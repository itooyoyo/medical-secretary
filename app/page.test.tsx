import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home, {
  FAVORITES_KEY,
  RECENT_KEY,
  apps,
  clinicalPearls,
  pickClinicalPearl,
  pickTodaysGuide,
  popularTags,
  releaseNotes,
  safeParse,
} from "./page";

function renderConsole() {
  return render(<Home />);
}

function appsSection() {
  const section = document.querySelector("#apps");
  if (!section) throw new Error("Applications section not found");
  return within(section as HTMLElement);
}

function dashboardSection() {
  const section = screen.getByLabelText("Dashboard");
  return section;
}

function favoritesSection() {
  const section = document.querySelector("#favorites");
  if (!section) throw new Error("Favorites section not found");
  return within(section as HTMLElement);
}

function recentSection() {
  const section = document.querySelector("#recent");
  if (!section) throw new Error("Recent section not found");
  return within(section as HTMLElement);
}

function clickAppLaunch(appTitle: string) {
  const link = appsSection().getByRole("link", {
    name: `${appTitle}を開く`,
  });
  fireEvent.click(link);
}

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("Medical AI Console v3", () => {
  it("registers 浮腫診断ナビ under 内科総合 with the English subtitle preserved", () => {
    expect(apps.find((app) => app.id === "bedside-edema")?.category).toBe("内科総合");
    expect(apps.find((app) => app.id === "bedside-edema")?.title).toBe(
      "浮腫診断ナビ",
    );
    expect(apps.find((app) => app.id === "bedside-edema")?.subtitle).toBe(
      "Bedside Edema Navigator",
    );
  });

  it("clarifies the electrolyte navigator title without changing its URL", () => {
    const electrolyteApp = apps.find((app) => app.id === "electrolyte");

    expect(electrolyteApp?.title).toBe("電解質異常診断支援（Na・K）");
    expect(electrolyteApp?.url).toBe(
      "https://electrolyte-diagnostic-assistant.vercel.app/",
    );
  });

  it("registers the Calcium Disorder Navigator in the emergency category", () => {
    const calciumApp = apps.find((app) => app.id === "calcium-disorder");

    expect(calciumApp).toMatchObject({
      title: "電解質異常診断支援（Ca）",
      subtitle: "Calcium Disorder Navigator",
      category: "救急",
      url: "https://electrolyte-diagnostic-assistant-ca.vercel.app/",
      estimatedTime: "30秒",
    });
    expect(calciumApp?.tags).toEqual(
      expect.arrayContaining(["Ca", "高Ca", "低Ca", "救急"]),
    );
  });

  it("renders the app catalog and core dashboard areas", async () => {
    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Today's Guide")).toBeInTheDocument();
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
    expect(appsSection().getByText("感染症・抗菌薬初期選択支援")).toBeInTheDocument();
  });

  it("searches by title", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "発熱" },
    });

    expect(appsSection().getByText("発熱・CRP診断支援")).toBeInTheDocument();
    expect(appsSection().queryByText("神経局在診断支援")).not.toBeInTheDocument();
  });

  it("searches by description", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "波形確認" },
    });

    expect(appsSection().getByText("頻脈初期対応支援")).toBeInTheDocument();
  });

  it("searches by category", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "神経" },
    });

    expect(appsSection().getByText("神経局在診断支援")).toBeInTheDocument();
  });

  it("searches by tag", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "SGLT2" },
    });

    expect(appsSection().getByText("糖尿病治療薬選択支援")).toBeInTheDocument();
  });

  it("searches the edema app by its English subtitle", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "Bedside Edema Navigator" },
    });

    expect(appsSection().getByText("浮腫診断ナビ")).toBeInTheDocument();
    expect(appsSection().getByText("Bedside Edema Navigator")).toBeInTheDocument();
  });

  it("shows an empty state when search has no matches", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "no-such-clinical-module" },
    });

    expect(screen.getByText("一致するアプリがありません。検索語を変えてください。")).toBeInTheDocument();
  });

  it("adds and removes a favorite while syncing localStorage and dashboard count", async () => {
    renderConsole();
    const favoriteButton = await appsSection().findByRole("button", {
      name: "発熱・CRP診断支援をFavoriteに追加",
    });

    fireEvent.click(favoriteButton);

    expect(JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]")).toEqual([
      "fever-crp",
    ]);
    expect(favoritesSection().getByText("発熱・CRP診断支援")).toBeInTheDocument();

    fireEvent.click(
      appsSection().getByRole("button", {
        name: "発熱・CRP診断支援をFavoriteから解除",
      }),
    );

    expect(JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]")).toEqual([]);
    expect(
      favoritesSection().getByText("各アプリ右上の★で診療開始セットに登録できます。"),
    ).toBeInTheDocument();
  });

  it("adds launched apps to Recent with timestamp data", async () => {
    renderConsole();
    await screen.findByText("Applications");

    clickAppLaunch("発熱・CRP診断支援");

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent).toHaveLength(1);
    expect(recent[0].id).toBe("fever-crp");
    expect(typeof recent[0].usedAt).toBe("number");
    expect(screen.getAllByText("発熱・CRP診断支援").length).toBeGreaterThan(0);
  });

  it("does not duplicate Recent entries for the same app", async () => {
    renderConsole();
    await screen.findByText("Applications");

    clickAppLaunch("発熱・CRP診断支援");
    clickAppLaunch("発熱・CRP診断支援");

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent).toHaveLength(1);
    expect(recent[0].id).toBe("fever-crp");
  });

  it("keeps Recent in latest-first order and limits it to three apps", async () => {
    renderConsole();
    await screen.findByText("Applications");

    [
      "感染症・抗菌薬初期選択支援",
      "発熱・CRP診断支援",
      "糖尿病治療薬選択支援",
      "頻脈初期対応支援",
      "神経局在診断支援",
      "酸塩基異常診断支援",
    ].forEach(clickAppLaunch);

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent).toHaveLength(3);
    expect(recent[0].id).toBe("acid-base");
    expect(recent.map((item: { id: string }) => item.id)).not.toContain(
      "infection-antibiotic",
    );
    expect(recent.map((item: { id: string }) => item.id)).not.toContain(
      "fever-crp",
    );
  });

  it("does not render the removed Quick Actions section or launch cards", async () => {
    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(screen.queryByText("Quick Actions")).not.toBeInTheDocument();
    expect(screen.queryByText("Tap to launch")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Quick Actions")).not.toBeInTheDocument();
    expect(document.querySelector("#quick-actions")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: /Quick Actionsから開く/,
      }),
    ).not.toBeInTheDocument();
  });

  it("launches apps from search results and records Recent", async () => {
    renderConsole();
    fireEvent.change(await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"), {
      target: { value: "発熱" },
    });

    fireEvent.click(
      appsSection().getByRole("link", {
        name: "発熱・CRP診断支援を開く",
      }),
    );

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent[0].id).toBe("fever-crp");
  });

  it("launches apps from Favorites and records Recent", async () => {
    renderConsole();
    const favoriteButton = await appsSection().findByRole("button", {
      name: "甲状腺クリーゼ診断支援をFavoriteに追加",
    });

    fireEvent.click(favoriteButton);

    fireEvent.click(
      favoritesSection().getByRole("link", {
        name: "甲状腺クリーゼ診断支援を開く",
      }),
    );

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent[0].id).toBe("thyroid-crisis");
  });

  it("launches apps from Recent and keeps them deduplicated", async () => {
    renderConsole();
    await screen.findByText("Applications");

    clickAppLaunch("発熱・CRP診断支援");

    fireEvent.click(
      await recentSection().findByRole("link", {
        name: "発熱・CRP診断支援をRecentから開く",
      }),
    );

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent).toHaveLength(1);
    expect(recent[0].id).toBe("fever-crp");
  });

  it("keeps category catalog launch links available", async () => {
    renderConsole();

    expect(await screen.findByText("内科総合")).toBeInTheDocument();
    expect(
      appsSection().getByRole("link", {
        name: "浮腫診断ナビを開く",
      }),
    ).toHaveAttribute("href", "/bedside-edema");
  });

  it("renders four Dashboard widgets with the real app count and online state", async () => {
    renderConsole();
    const dashboard = dashboardSection();

    expect(dashboard.children).toHaveLength(4);
    expect(dashboard).toHaveTextContent(`Apps${apps.length}`);
    expect(dashboard).not.toHaveTextContent("Favorites");
    expect(dashboard).not.toHaveTextContent("Recent");
    expect(dashboard).toHaveTextContent("Online●");
  });

  it("renders Clinical Pearl from JSON-shaped data", async () => {
    renderConsole();

    const pearlToggle = await screen.findByText("Clinical Pearl");
    expect(pearlToggle.closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText(clinicalPearls[0].title)).toBeInTheDocument();
    expect(screen.getByText(clinicalPearls[0].body)).toBeInTheDocument();
    expect(screen.getByText(clinicalPearls[0].category)).toBeInTheDocument();
    expect(screen.getByText(clinicalPearls[0].tags.join(" / "))).toBeInTheDocument();
  });

  it("handles empty Clinical Pearl data safely", () => {
    expect(pickClinicalPearl([])).toEqual({
      title: "Clinical Pearl",
      body: "診療支援の要点をここに表示します。",
      category: "General",
      tags: [],
    });
  });

  it("renders release notes version, date, and change detail", async () => {
    renderConsole();
    const release = within(await screen.findByLabelText("Release Notes"));

    expect(release.getByText("Release Notes")).toBeInTheDocument();
    expect(release.getByText(releaseNotes.version)).toBeInTheDocument();
    expect(release.getByText(releaseNotes.date)).toBeInTheDocument();
    expect(release.getByText(releaseNotes.changes)).toBeInTheDocument();
  });

  it("renders Today's Guide from structured data", async () => {
    renderConsole();

    expect(await screen.findByText("Today's Guide")).toBeInTheDocument();
    expect(screen.getByText(pickTodaysGuide().title)).toBeInTheDocument();
  });

  it("shows popular tags before searching and applies a tag query", async () => {
    renderConsole();

    const tagRegion = await screen.findByLabelText("よく使うタグ");
    for (const tag of popularTags) {
      expect(within(tagRegion).getByRole("button", { name: tag })).toBeInTheDocument();
    }

    fireEvent.click(within(tagRegion).getByRole("button", { name: "敗血症" }));

    expect(appsSection().getByText("感染症・抗菌薬初期選択支援")).toBeInTheDocument();
    expect(screen.queryByLabelText("よく使うタグ")).not.toBeInTheDocument();
  });

  it("survives invalid JSON in localStorage", async () => {
    window.localStorage.setItem(FAVORITES_KEY, "{broken");
    window.localStorage.setItem(RECENT_KEY, "{broken");

    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(dashboardSection()).not.toHaveTextContent("Favorites");
    expect(
      await screen.findByText("起動したアプリがここに3件まで保存されます。"),
    ).toBeInTheDocument();
  });

  it("renders and handles interactions when localStorage methods throw", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    renderConsole();
    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();

    fireEvent.click(
      appsSection().getByRole("button", {
        name: "発熱・CRP診断支援をFavoriteに追加",
      }),
    );

    expect(favoritesSection().getByText("発熱・CRP診断支援")).toBeInTheDocument();
  });

  it("renders normally on first access with empty localStorage", async () => {
    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(
      await screen.findByText("起動したアプリがここに3件まで保存されます。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("各アプリ右上の★で診療開始セットに登録できます。"),
    ).toBeInTheDocument();
    expect(screen.getByText("Today's Guide")).toBeInTheDocument();
    expect(screen.queryByText("Quick Actions")).not.toBeInTheDocument();
  });

  it("keeps the Medical Hub guide character in the header", async () => {
    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(document.querySelector('img[src*="guide-character"]')).toBeInTheDocument();
  });

  it("provides accessible search, favorite, and launch controls", async () => {
    renderConsole();

    expect(
      await screen.findByLabelText("タイトル、説明、カテゴリ、タグでアプリを検索"),
    ).toBeInTheDocument();
    expect(
      appsSection().getByRole("button", {
        name: "発熱・CRP診断支援をFavoriteに追加",
      }),
    ).toBeInTheDocument();
    expect(
      appsSection().getByRole("link", {
        name: "発熱・CRP診断支援を開く",
      }),
    ).toBeInTheDocument();
  });

  it("supports keyboard activation for Favorite controls", async () => {
    renderConsole();
    const favoriteButton = await appsSection().findByRole("button", {
      name: "発熱・CRP診断支援をFavoriteに追加",
    });

    favoriteButton.focus();
    expect(favoriteButton).toHaveFocus();
    fireEvent.keyDown(favoriteButton, { key: "Enter", code: "Enter" });
    fireEvent.click(favoriteButton);

    await waitFor(() =>
      expect(favoritesSection().getByText("発熱・CRP診断支援")).toBeInTheDocument(),
    );
  });

  it("safeParse returns fallback for malformed values", () => {
    expect(safeParse("{bad-json", ["fallback"])).toEqual(["fallback"]);
  });
});
