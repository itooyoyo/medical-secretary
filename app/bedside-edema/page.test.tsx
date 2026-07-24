import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EdemaNavigator from "./components";
import { examSteps, physicalExamItemIds, redFlags } from "./data";
import ReferencesPage from "./references/page";
import {
  buildDifferential,
  calculateWells,
  differentialRules,
  interpretBnp,
} from "./algorithm";

describe("Bedside Edema Navigator", () => {
  it("defines 7 navigation steps and 32 physical examination items", () => {
    expect(examSteps).toHaveLength(6);
    expect(redFlags).toHaveLength(10);
    expect(physicalExamItemIds.size).toBe(32);
  });

  it("starts with Red Flags and exposes completion and missing controls", () => {
    render(<EdemaNavigator />);
    expect(screen.getByText("Red Flags")).toBeInTheDocument();
    expect(screen.getByText("診察完了率")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /未確認一覧を開く/ })).toBeInTheDocument();
  });

  it("shows a warning when a red flag is selected", () => {
    vi.spyOn(window, "setTimeout").mockImplementation(() => 0 as unknown as number);
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "あり" }));
    expect(screen.getByText("緊急評価を優先してください")).toBeInTheDocument();
  });

  it("opens the unconfirmed list and jumps to an examination item", () => {
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: /未確認一覧を開く/ }));
    expect(screen.getByRole("dialog", { name: "未確認一覧" })).toBeInTheDocument();
    const row = screen.getByRole("button", { name: /Stemmer徴候/ });
    fireEvent.click(row);
    expect(screen.getByText("Stemmer徴候")).toBeInTheDocument();
  });

  it("opens the six-part physical examination info guide", () => {
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: /未確認一覧を開く/ }));
    fireEvent.click(screen.getByRole("button", { name: /足背浮腫/ }));
    fireEvent.click(screen.getByRole("button", { name: "足背浮腫の診察ガイド" }));
    expect(screen.getByText("どこを見るか")).toBeInTheDocument();
    expect(screen.getByText("どう触るか")).toBeInTheDocument();
    expect(screen.getByText("正常所見")).toBeInTheDocument();
    expect(screen.getByText("異常所見")).toBeInTheDocument();
    expect(screen.getByText("何を疑うか")).toBeInTheDocument();
    expect(screen.getByText("診察のコツ")).toBeInTheDocument();
  });

  it("renders structured results rather than a diagnosis name alone", () => {
    render(<EdemaNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "結果" }));
    expect(screen.getAllByText("支持所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("反対所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未確認所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("推奨する次の評価").length).toBeGreaterThan(0);
    expect(screen.getAllByText("必要なら推奨検査").length).toBeGreaterThan(0);
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
