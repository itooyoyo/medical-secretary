import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EdemaNavigator from "./components";
import { examSteps, physicalExamItemIds, redFlags } from "./data";

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
    expect(screen.getAllByText("根拠となる身体所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("まだ確認していない身体所見").length).toBeGreaterThan(0);
    expect(screen.getAllByText("推奨される追加診察").length).toBeGreaterThan(0);
    expect(screen.getAllByText("必要なら推奨検査").length).toBeGreaterThan(0);
  });
});
