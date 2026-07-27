import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EdemaNavigator from "./components";
import ReferencesPage from "./references/page";
import {
  buildDifferential,
  calculateWells,
  differentialRules,
  interpretBnp,
  interpretThyroid,
} from "./algorithm";

describe("Bedside Edema Navigator", () => {
  it("renders the five-section single page without Step navigation", () => {
    render(<EdemaNavigator />);
    for (const title of ["分布", "身体所見", "背景", "検査値", "結果"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(screen.queryByText(/STEP \d/)).not.toBeInTheDocument();
  });

  it("shows the new character and home copy", () => {
    render(<EdemaNavigator />);
    const guides = screen.getAllByRole("img", { name: "白い未来的装甲の浮腫診療AIナビゲーター" });
    expect(guides.length).toBeGreaterThan(0);
    expect(guides[0]).toHaveAttribute("src", expect.stringContaining("edema-guide-mascot.png"));
    expect(guides[0]).not.toHaveAttribute("src", expect.stringContaining("edema-ai-guide.png"));
    expect(screen.getByText("INTERNAL MEDICINE · 60 SEC")).toBeInTheDocument();
    expect(screen.getByText("まず浮腫の分布を選択してください。")).toBeInTheDocument();
    expect(screen.getByText("必要な項目のみ表示します。")).toBeInTheDocument();
    expect(screen.getByText("身体診察と最小限の検査から浮腫を鑑別します")).toBeInTheDocument();
  });

  it("shows a character warning when a red flag is selected", () => {
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "＋急速に悪化" }));
    expect(screen.getByText(/Red Flagを1件検出/)).toBeInTheDocument();
    expect(screen.getByText("救急対応を遅らせないでください。")).toBeInTheDocument();
  });

  it("conditionally shows unilateral findings and D-dimer only for unilateral edema", () => {
    render(<EdemaNavigator />);
    expect(screen.queryByText("炎症・血栓を示唆する局所所見")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("D-dimer")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /片側一方の下肢/ }));
    expect(screen.getByText("炎症・血栓を示唆する局所所見")).toBeInTheDocument();
    expect(screen.getByLabelText("D-dimer")).toBeInTheDocument();
    expect(screen.queryByLabelText("BNP")).not.toBeInTheDocument();
  });

  it("conditionally shows systemic findings and BNP only for bilateral edema", () => {
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: /両側両下肢/ }));
    expect(screen.getByText("全身うっ血所見（複数選択）")).toBeInTheDocument();
    expect(screen.getByLabelText("BNP")).toBeInTheDocument();
    expect(screen.queryByLabelText("D-dimer")).not.toBeInTheDocument();
  });

  it("shows only three focused thyroid findings when a trigger is present", () => {
    render(<EdemaNavigator />);
    expect(screen.queryByText("甲状腺機能低下症を支持する所見（複数選択）")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /圧痕なし/ }));
    expect(screen.getByText("甲状腺機能低下症を支持する所見（複数選択）")).toBeInTheDocument();
    for (const label of ["寒がり", "皮膚乾燥", "徐脈"]) {
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeInTheDocument();
    }
  });

  it("asks for both TSH and FT4 when only one is entered", () => {
    render(<EdemaNavigator />);
    fireEvent.change(screen.getByLabelText("TSH"), { target: { value: "8" } });
    expect(screen.getByText("甲状腺機能の判定にはTSHとFT4の両方が必要です")).toBeInTheDocument();
  });

  it("renders structured results rather than a diagnosis name alone", () => {
    render(<EdemaNavigator />);
    expect(screen.getAllByText("支持所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("反対所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未確認所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("次の評価").length).toBeGreaterThan(0);
    expect(screen.getAllByText("必要なら検査").length).toBeGreaterThan(0);
  });

  it("ranks DVT first for acute unilateral edema", () => {
    const result = buildDifferential({
      "history-1": "present",
      unilateral: "present",
      "calf-difference": "large",
      tenderness: "present",
    });
    expect(result[0].id).toBe("acute-unilateral-dvt");
  });

  it("ranks systemic causes for chronic bilateral edema", () => {
    const result = buildDifferential({
      "history-2": "present",
      bilateral: "present",
      eyelid: "present",
      ascites: "present",
    });
    expect(result[0].id).toBe("systemic-renal-hepatic-protein");
  });

  it("recognizes the chronic venous insufficiency finding combination", () => {
    const result = buildDifferential({
      "history-2": "present",
      pigmentation: "present",
      "venous-distension": "present",
      "history-4": "present",
      "history-5": "present",
      pitting: "present",
    });
    expect(result[0].id).toBe("chronic-venous-insufficiency");
  });

  it("recognizes the lymphedema finding combination", () => {
    const result = buildDifferential({
      "history-2": "present",
      dorsum: "present",
      stemmer: "present",
      induration: "present",
      "history-10": "present",
    });
    expect(result[0].id).toBe("lymphedema");
  });

  it("does not exclude lymphedema from a negative Stemmer sign alone", () => {
    const result = buildDifferential({
      "history-2": "present",
      dorsum: "present",
      stemmer: "absent",
      induration: "present",
      "history-9": "present",
    });
    const lymph = result.find((item) => item.id === "lymphedema");
    expect(lymph?.against).not.toContain("Stemmer徴候陰性");
    expect(result[0].id).toBe("lymphedema");
  });

  it("keeps intermediate BNP indeterminate", () => {
    expect(interpretBnp({ bnp: 250 }).status).toBe("intermediate");
    expect(interpretBnp({ ntProBnp: 600, age: 60 }).status).toBe("intermediate");
  });

  it("does not treat unmeasured tests as negative", () => {
    const result = interpretBnp({});
    expect(result.status).toBe("unmeasured");
    expect(result.detail).toContain("陰性ではありません");
  });

  it("classifies high TSH and low FT4 as overt primary hypothyroidism", () => {
    expect(interpretThyroid({ tsh: 18.4, ft4: 0.52 }).status).toBe("overt-primary");
  });

  it("classifies high TSH and normal FT4 as subclinical hypothyroidism", () => {
    const result = interpretThyroid({ tsh: 8, ft4: 1.1 });
    expect(result.status).toBe("subclinical");
    expect(result.detail).toContain("浮腫の主因とは判断できません");
  });

  it("does not label subclinical hypothyroidism as strongly suspected", () => {
    expect(interpretThyroid({ tsh: 8, ft4: 1.1 }).label).not.toContain("強く");
  });

  it("considers central hypothyroidism for low FT4 with low or inappropriately normal TSH", () => {
    expect(interpretThyroid({ tsh: 0.2, ft4: 0.5 }).status).toBe("central-possible");
    expect(interpretThyroid({ tsh: 2, ft4: 0.5 }).status).toBe("central-possible");
  });

  it("does not support hypothyroidism when both tests are in the facility ranges", () => {
    expect(interpretThyroid({
      tsh: 2,
      ft4: 1.2,
      tshLowerLimit: 0.5,
      tshUpperLimit: 4,
      ft4LowerLimit: 0.9,
      ft4UpperLimit: 1.7,
    }).status).toBe("not-supportive");
  });

  it("does not treat unmeasured TSH as normal", () => {
    expect(interpretThyroid({ ft4: 1.1 }).status).toBe("incomplete");
  });

  it("does not treat unmeasured FT4 as normal", () => {
    expect(interpretThyroid({ tsh: 8 }).status).toBe("incomplete");
  });

  it("does not classify overt or subclinical disease from TSH alone", () => {
    const result = interpretThyroid({ tsh: 18 });
    expect(["overt-primary", "subclinical"]).not.toContain(result.status);
  });

  it("does not classify primary hypothyroidism from FT4 alone", () => {
    expect(interpretThyroid({ ft4: 0.5 }).status).toBe("incomplete");
  });

  it("ranks overt hypothyroidism higher with nonpitting and eyelid edema", () => {
    const result = buildDifferential(
      { pitting: "absent", eyelid: "present", distribution: "generalized" },
      { tsh: 18.4, ft4: 0.52 },
    );
    expect(result[0].id).toBe("hypothyroidism");
  });

  it("does not over-rank subclinical hypothyroidism with bilateral pitting edema alone", () => {
    const result = buildDifferential(
      { pitting: "present", bilateral: "present", distribution: "bilateral" },
      { tsh: 8, ft4: 1.1 },
    );
    expect(result[0].id).not.toBe("hypothyroidism");
  });

  it("prioritizes acute inflammatory or DVT causes over thyroid in acute unilateral inflammation", () => {
    const result = buildDifferential({
      "history-1": "present",
      unilateral: "present",
      distribution: "unilateral",
      erythema: "present",
      temperature: "warm",
      tenderness: "present",
    });
    expect(["acute-inflammatory", "acute-unilateral-dvt"]).toContain(result[0].id);
    expect(result[0].id).not.toBe("hypothyroidism");
  });

  it("assigns thyroid sourceIds to the hypothyroidism rule", () => {
    const thyroid = differentialRules.find((rule) => rule.id === "hypothyroidism");
    expect(thyroid?.sourceIds).toEqual(expect.arrayContaining(["ata-thyroid-tests", "aafp-hypothyroidism-2021"]));
  });

  it("renders thyroid references", () => {
    render(<ReferencesPage />);
    expect(screen.getByText("Thyroid Function Tests")).toBeInTheDocument();
    expect(screen.getByText("Hypothyroidism: Diagnosis and Treatment")).toBeInTheDocument();
  });

  it("assigns sourceIds to every differential rule", () => {
    for (const rule of differentialRules) {
      expect(rule.sourceIds.length).toBeGreaterThan(0);
    }
  });

  it("calculates the unmodified two-level DVT Wells score", () => {
    const result = calculateWells({
      activeCancer: true,
      paralysisOrCast: false,
      bedriddenOrSurgery: true,
      deepVeinTenderness: true,
      entireLegSwollen: false,
      calfDifference3cm: true,
      unilateralPitting: false,
      collateralVeins: false,
      previousDvt: false,
      alternativeLikely: true,
    });
    expect(result).toEqual({ score: 2, category: "DVT likely" });
  });

  it("renders References with safe external links", () => {
    render(<ReferencesPage />);
    expect(screen.getByRole("heading", { name: "判断根拠と公開情報源" })).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: "原資料を開く ↗" });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
