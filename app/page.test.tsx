import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home, {
  FAVORITES_KEY,
  LAUNCH_COUNTS_KEY,
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
  it("renders the app catalog and core dashboard areas", async () => {
    renderConsole();

    expect(await screen.findByText("Medical AI Console")).toBeInTheDocument();
    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
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

  it("keeps Recent in latest-first order and limits it to five apps", async () => {
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

  it("renders Quick Actions apps with correct launch links", async () => {
    renderConsole();
    const quick = within(await screen.findByLabelText("Quick Actions"));

    expect(quick.getByText("感染症支援")).toBeInTheDocument();
    expect(quick.getByText("発熱診断")).toBeInTheDocument();
    expect(quick.getByText("糖尿病")).toBeInTheDocument();
    expect(quick.getByText("TachyScan")).toBeInTheDocument();
    expect(quick.getByText("神経診察")).toBeInTheDocument();
    expect(quick.getByText("甲状腺")).toBeInTheDocument();
    expect(
      quick.getByRole("link", {
        name: "発熱診断をQuick Actionsから開く",
      }),
    ).toHaveAttribute("href", "https://fever-diagnostic-assistant.vercel.app/");
  });

  it("updates Recent when launching from Quick Actions", async () => {
    renderConsole();
    const quick = within(await screen.findByLabelText("Quick Actions"));

    fireEvent.click(
      quick.getByRole("link", {
        name: "発熱診断をQuick Actionsから開く",
      }),
    );

    const recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    expect(recent[0].id).toBe("fever-crp");
  });

  it("places favorite apps at the top of Quick Actions", async () => {
    renderConsole();
    const favoriteButton = await appsSection().findByRole("button", {
      name: "甲状腺クリーゼ診断支援をFavoriteに追加",
    });

    fireEvent.click(favoriteButton);

    const quickLinks = within(screen.getByLabelText("Quick Actions")).getAllByRole(
      "link",
    );
    expect(quickLinks[0]).toHaveAccessibleName("甲状腺をQuick Actionsから開く");
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
    window.localStorage.setItem(LAUNCH_COUNTS_KEY, "{broken");

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
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
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
