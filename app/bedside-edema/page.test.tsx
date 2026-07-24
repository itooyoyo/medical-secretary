import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EdemaNavigator from "./components";
import ReferencesPage from "./references/page";
import {
  buildDifferential,
  calculateWells,
  differentialRules,
  interpretBnp,
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
    expect(screen.getByRole("img", { name: "白い未来的装甲をまとった医療AIガーディアン" })).toBeInTheDocument();
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
