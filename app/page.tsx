"use client";

import Image from "next/image";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type AppCategoryName =
  | "感染症"
  | "救急"
  | "内分泌"
  | "神経"
  | "循環器"
  | "内科総合";

type BadgeStatus = "NEW" | "BETA" | "Stable" | "Deprecated";

type AppItem = {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: string;
  category: AppCategoryName;
  description: string;
  estimatedTime: string;
  badges: BadgeStatus[];
  tags: string[];
};

type AppCategory = {
  title: AppCategoryName;
  description: string;
};

type StoredApp = {
  id: string;
  usedAt: number;
};

type ClinicalPearl = {
  title: string;
  body: string;
  category: string;
  tags: string[];
};

export const VERSION = "v0.9";
export const FAVORITES_KEY = "medical-ai-console:favorites";
export const RECENT_KEY = "medical-ai-console:recent";

export const categories: AppCategory[] = [
  { title: "感染症", description: "Infection" },
  { title: "救急", description: "Emergency" },
  { title: "内分泌", description: "Endocrine" },
  { title: "神経", description: "Neurology" },
  { title: "循環器", description: "Cardiology" },
  { title: "内科総合", description: "General Medicine" },
];

export const apps: AppItem[] = [
  {
    id: "bedside-edema",
    title: "浮腫診断ナビ",
    subtitle: "Bedside Edema Navigator",
    url: "/bedside-edema",
    icon: "🦵",
    category: "内科総合",
    description: "身体診察から始める浮腫診療",
    estimatedTime: "5分",
    badges: ["NEW"],
    tags: ["浮腫", "身体診察", "内科総合", "ベッドサイド"],
  },
  {
    id: "infection-antibiotic",
    title: "感染症・抗菌薬初期選択支援",
    url: "https://infection-antibiotic-navigator.vercel.app/",
    icon: "🦠",
    category: "感染症",
    description: "感染臓器・耐性菌リスク・腎機能から抗菌薬候補を整理。",
    estimatedTime: "1分",
    badges: ["NEW", "BETA"],
    tags: ["感染症", "抗菌薬", "腎機能", "耐性菌", "敗血症"],
  },
  {
    id: "fever-crp",
    title: "発熱・CRP診断支援",
    url: "https://fever-diagnostic-assistant.vercel.app/",
    icon: "🔥",
    category: "内科総合",
    description: "発熱、CRP高値、原因不明発熱の診断推論を支援。",
    estimatedTime: "1分",
    badges: ["NEW"],
    tags: ["発熱", "CRP", "FUO", "Red Flag"],
  },
  {
    id: "diabetes-treatment",
    title: "糖尿病治療薬選択支援",
    url: "https://diabetes-treatment-assistant.vercel.app/",
    icon: "💊",
    category: "内分泌",
    description: "患者背景に応じた糖尿病治療薬の選択を補助。",
    estimatedTime: "3分",
    badges: ["Stable"],
    tags: ["糖尿病", "薬剤選択", "SGLT2", "GLP-1"],
  },
  {
    id: "tachyscan",
    title: "頻脈初期対応支援",
    url: "https://tachyscan-pro.vercel.app/",
    icon: "⚡",
    category: "循環器",
    description: "頻脈の初期対応、波形確認、緊急度判断を支援。",
    estimatedTime: "30秒",
    badges: ["Stable"],
    tags: ["頻脈", "TachyScan", "ECG", "循環器"],
  },
  {
    id: "neuro-localizer",
    title: "神経局在診断支援",
    url: "https://neuro-localizer.vercel.app/",
    icon: "🧠",
    category: "神経",
    description: "神経診察所見から病巣局在と確認項目を整理。",
    estimatedTime: "3分",
    badges: ["Stable"],
    tags: ["神経", "局在", "脳卒中", "診察"],
  },
  {
    id: "acid-base",
    title: "酸塩基異常診断支援",
    url: "https://acid-base-diagnostic-assistant.vercel.app/",
    icon: "🩸",
    category: "救急",
    description: "pH、HCO3、PaCO2、AGから病態を整理。",
    estimatedTime: "1分",
    badges: ["Stable"],
    tags: ["酸塩基", "AG", "救急", "血液ガス"],
  },
  {
    id: "electrolyte",
    title: "電解質異常診断支援（Na・K）",
    url: "https://electrolyte-diagnostic-assistant.vercel.app/",
    icon: "🧪",
    category: "救急",
    description: "Na、K、Caなどの異常値から初期対応を確認。",
    estimatedTime: "1分",
    badges: ["Stable"],
    tags: ["電解質", "Na", "K", "Ca"],
  },
  {
    id: "calcium-disorder",
    title: "電解質異常診断支援（Ca）",
    subtitle: "Calcium Disorder Navigator",
    url: "https://electrolyte-diagnostic-assistant-ca.vercel.app/",
    icon: "◉",
    category: "救急",
    description: "補正Ca、症状、緊急度から初期対応と次の検査を30秒で整理。",
    estimatedTime: "30秒",
    badges: ["NEW"],
    tags: ["電解質", "Ca", "高Ca", "低Ca", "救急"],
  },
  {
    id: "thyroid-crisis",
    title: "甲状腺クリーゼ診断支援",
    url: "https://thyroid-crisis-navigator.vercel.app/",
    icon: "🦋",
    category: "内分泌",
    description: "甲状腺クリーゼのRed Flag、診断、初期対応を支援。",
    estimatedTime: "3分",
    badges: ["Stable"],
    tags: ["甲状腺", "クリーゼ", "内分泌", "救急"],
  },
];

export const popularTags = ["感染症", "発熱", "糖尿病", "敗血症", "神経"];

export const todaysGuides = [
  {
    title: "敗血症を疑う場合は感染症支援をご利用ください",
    appId: "infection-antibiotic",
  },
  {
    title: "発熱とCRP高値では発熱診断から整理できます",
    appId: "fever-crp",
  },
  {
    title: "頻脈で迷う場合はTachyScanを先に開いてください",
    appId: "tachyscan",
  },
  {
    title: "神経所見が主役なら神経診察から局在を確認できます",
    appId: "neuro-localizer",
  },
];

export const clinicalPearls: ClinicalPearl[] = [
  {
    title: "低Na補正",
    body: "補正速度を先に決め、症状と慢性度で安全域を確認します。",
    category: "電解質",
    tags: ["Na", "補正", "救急"],
  },
  {
    title: "DKA",
    body: "補液、K、インスリンの順に安全確認を組み立てます。",
    category: "糖尿病",
    tags: ["DKA", "K", "インスリン"],
  },
  {
    title: "敗血症",
    body: "抗菌薬だけでなく感染源コントロールを同時に考えます。",
    category: "感染症",
    tags: ["敗血症", "抗菌薬", "感染源"],
  },
  {
    title: "SGLT2",
    body: "内服中は正常血糖DKAを鑑別に残します。",
    category: "糖尿病",
    tags: ["SGLT2", "DKA", "内分泌"],
  },
  {
    title: "インスリン",
    body: "導入時は低血糖リスクと食事摂取量を先に確認します。",
    category: "糖尿病",
    tags: ["インスリン", "低血糖", "食事"],
  },
];

export const releaseNotes = {
  version: VERSION,
  date: "2026-07-29",
  changes: "救急シリーズに電解質異常診断支援（Ca）を追加。",
};

export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeGetLocalStorageItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocalStorageItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable in private or restricted environments.
  }
}

export function pickClinicalPearl(
  pearlData: ClinicalPearl[] = clinicalPearls,
  randomValue = Math.random(),
) {
  if (pearlData.length === 0) {
    return {
      title: "Clinical Pearl",
      body: "診療支援の要点をここに表示します。",
      category: "General",
      tags: [],
    };
  }

  const index = Math.min(
    pearlData.length - 1,
    Math.floor(randomValue * pearlData.length),
  );
  return pearlData[index];
}

export function pickTodaysGuide(
  guideData = todaysGuides,
  randomValue = Math.random(),
) {
  if (guideData.length === 0) {
    return {
      title: "Recent、Favorites、検索から必要な診療支援ツールを開いてください",
      appId: "infection-antibiotic",
    };
  }

  const index = Math.min(
    guideData.length - 1,
    Math.floor(randomValue * guideData.length),
  );
  return guideData[index];
}

function getAppById(id: string) {
  return apps.find((app) => app.id === id);
}

function isAppItem(app: AppItem | undefined): app is AppItem {
  return Boolean(app);
}

function formatUsedAt(timestamp: number) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

const MedicalPage = memo(function MedicalPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="medical-console relative min-h-screen overflow-x-hidden text-white">
      <div className="console-stars pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 px-2.5 py-3 pb-20 sm:px-4 sm:py-4 lg:px-6">
        {children}
      </div>
    </main>
  );
});

const MedicalCard = memo(function MedicalCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-cyan-100/10 bg-slate-950/42 shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
});

function MedicalButton({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-3 text-xs font-black text-cyan-50 transition hover:border-cyan-200/70 hover:bg-cyan-300/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

function MedicalBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-h-5 items-center rounded-full border border-cyan-200/20 px-1.5 text-[9px] font-black tracking-wide text-cyan-100/90">
      {children}
    </span>
  );
}

const MedicalSearchInput = memo(function MedicalSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">アプリを検索</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="検索: タイトル / 説明 / カテゴリ / タグ"
        aria-label="タイトル、説明、カテゴリ、タグでアプリを検索"
        className="min-h-11 w-full rounded-xl border border-cyan-100/10 bg-slate-950/60 px-3 text-xs font-semibold text-white outline-none transition placeholder:text-slate-500 focus-visible:border-cyan-200/55 focus-visible:ring-2 focus-visible:ring-cyan-200/25"
        type="search"
      />
    </label>
  );
});

function MedicalSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex min-w-0 items-end justify-between gap-2 border-b border-cyan-200/10 pb-1.5">
      <h2 className="truncate text-sm font-black text-white sm:text-base">
        {title}
      </h2>
      {description ? (
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function MedicalEmptyState({ children }: { children: ReactNode }) {
  return (
    <MedicalCard className="flex min-h-16 items-center p-3 text-xs font-semibold leading-5 text-slate-400">
      {children}
    </MedicalCard>
  );
}

function MedicalSkeleton() {
  return (
    <div className="grid gap-2" aria-label="読み込み中">
      <div className="h-3 w-24 animate-pulse rounded-full bg-cyan-100/10" />
      <div className="h-12 animate-pulse rounded-xl bg-cyan-100/10" />
    </div>
  );
}

function MedicalBottomNavigation() {
  return (
    <nav
      aria-label="Medical AI Console navigation"
      className="fixed inset-x-2 bottom-2 z-20 mx-auto grid max-w-md grid-cols-4 rounded-2xl border border-cyan-100/10 bg-slate-950/90 p-1 text-[11px] font-black text-slate-300 shadow-[0_16px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:hidden"
    >
      {[
        ["#home", "🏠 Home"],
        ["#favorites", "⭐ Favorites"],
        ["#recent", "🕒 Recent"],
        ["#settings", "⚙ Settings"],
      ].map(([href, label]) => (
        <a
          key={href}
          href={href}
          className="inline-flex min-h-11 items-center justify-center rounded-xl transition hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

const AppCard = memo(function AppCard({
  app,
  isFavorite,
  onToggleFavorite,
  onLaunch,
  usedAt,
}: {
  app: AppItem;
  isFavorite: boolean;
  onToggleFavorite: (appId: string) => void;
  onLaunch: (appId: string) => void;
  usedAt?: number;
}) {
  return (
    <MedicalCard className="group relative min-h-[88px] p-2.5 shadow-none transition hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-cyan-950/20">
      <button
        type="button"
        aria-label={`${app.title}をFavorite${isFavorite ? "から解除" : "に追加"}`}
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(app.id)}
        className="absolute right-1 top-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-lg text-amber-200 transition hover:bg-amber-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
      >
        {isFavorite ? "★" : "☆"}
      </button>

      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${app.title}を開く`}
        onClick={() => onLaunch(app.id)}
        className="block pr-9 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      >
        <div className="flex min-w-0 gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-300/10 text-base">
            {app.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1">
              <h3 className="min-w-0 flex-1 truncate text-xs font-black leading-5 text-white sm:text-sm">
                {app.title}
              </h3>
              <span className="shrink-0">
                {app.badges.slice(0, 1).map((badge) => (
                  <MedicalBadge key={badge}>{badge}</MedicalBadge>
                ))}
              </span>
            </div>
            {app.subtitle ? (
              <p className="truncate text-[10px] font-semibold leading-4 text-slate-500">
                {app.subtitle}
              </p>
            ) : null}
            <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold leading-4 text-slate-400">
              {app.description}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-black text-cyan-200">
              <span>{app.estimatedTime}</span>
              {usedAt ? (
                <span className="text-slate-500">{formatUsedAt(usedAt)}</span>
              ) : null}
              <span>Launch →</span>
            </div>
          </div>
        </div>
      </a>
    </MedicalCard>
  );
});

const RecentListItem = memo(function RecentListItem({
  app,
  usedAt,
  onLaunch,
}: {
  app: AppItem;
  usedAt: number;
  onLaunch: (appId: string) => void;
}) {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${app.title}をRecentから開く`}
      onClick={() => onLaunch(app.id)}
      className="grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-cyan-100/10 bg-slate-950/35 px-2.5 py-2 transition hover:border-cyan-200/35 hover:bg-cyan-950/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
    >
      <span className="text-base">{app.icon}</span>
      <span className="truncate text-xs font-black text-white">{app.title}</span>
      <span className="text-[10px] font-bold text-slate-500">
        {formatUsedAt(usedAt)}
      </span>
    </a>
  );
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<StoredApp[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [pearl, setPearl] = useState<ClinicalPearl>(clinicalPearls[0]);
  const [todaysGuide, setTodaysGuide] = useState(todaysGuides[0]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setFavorites(
        safeParse<string[]>(
          safeGetLocalStorageItem(FAVORITES_KEY),
          [],
        ),
      );
      setRecent(
        safeParse<StoredApp[]>(safeGetLocalStorageItem(RECENT_KEY), []),
      );
      setPearl(pickClinicalPearl());
      setTodaysGuide(pickTodaysGuide());
      setStorageReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const favoriteApps = useMemo(
    () => favorites.map(getAppById).filter(isAppItem),
    [favorites],
  );

  const recentApps = useMemo(
    () =>
      recent
        .map((item) => {
          const app = getAppById(item.id);
          return app ? { app, usedAt: item.usedAt } : undefined;
        })
        .filter(
          (item): item is { app: AppItem; usedAt: number } => Boolean(item),
        )
        .slice(0, 3),
    [recent],
  );

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return apps;

    return apps.filter((app) =>
      [
        app.title,
        app.subtitle,
        app.description,
        app.category,
        ...app.tags,
        ...app.badges,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  const toggleFavorite = useCallback((appId: string) => {
    setFavorites((current) => {
      const next = current.includes(appId)
        ? current.filter((id) => id !== appId)
        : [appId, ...current];
      safeSetLocalStorageItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordLaunch = useCallback((appId: string) => {
    const usedAt = Date.now();

    setRecent((current) => {
      const next = [
        { id: appId, usedAt },
        ...current.filter((item) => item.id !== appId),
      ].slice(0, 3);
      safeSetLocalStorageItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <MedicalPage>
      <section
        id="home"
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-cyan-200/10 pb-3"
      >
        <Image
          src="/guide-character.png"
          alt=""
          width={520}
          height={467}
          loading="lazy"
          className="h-9 w-10 object-contain sm:h-11 sm:w-12"
        />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black leading-tight text-white sm:text-3xl">
            Medical AI Console
          </h1>
          <p className="truncate text-[11px] font-bold text-slate-400 sm:text-sm">
            Clinical Decision Support Platform
          </p>
        </div>
        <div className="grid justify-items-end gap-1 text-[10px] font-black text-slate-400">
          <span>{VERSION}</span>
          <span className="text-emerald-300">● Online</span>
        </div>
      </section>

      <section
        aria-label="Dashboard"
        className="grid grid-cols-4 gap-2 border-b border-cyan-200/10 pb-3"
      >
        {[
          ["Apps", apps.length.toString()],
          ["Updates", "4"],
          ["Version", VERSION],
          ["Online", "●"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
              {label}
            </p>
            <p className="mt-1 truncate text-base font-black text-white sm:text-lg">
              {value}
            </p>
          </div>
        ))}
      </section>

      <MedicalCard className="p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/80">
          Today&apos;s Guide
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-300">
          {todaysGuide.title}
        </p>
      </MedicalCard>

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="recent" className="grid gap-2 scroll-mt-4">
          <MedicalSectionHeader title="Recent" description="Last 3" />
          {storageReady ? (
            recentApps.length > 0 ? (
              <div className="grid gap-1.5">
                {recentApps.map(({ app, usedAt }) => (
                  <RecentListItem
                    key={`${app.id}-${usedAt}`}
                    app={app}
                    usedAt={usedAt}
                    onLaunch={recordLaunch}
                  />
                ))}
              </div>
            ) : (
              <MedicalEmptyState>起動したアプリがここに3件まで保存されます。</MedicalEmptyState>
            )
          ) : (
            <MedicalSkeleton />
          )}
        </section>

        <section id="favorites" className="grid gap-2 scroll-mt-4">
          <MedicalSectionHeader title="Favorites" description="Pinned" />
          {favoriteApps.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {favoriteApps.slice(0, 2).map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={favorites.includes(app.id)}
                  onToggleFavorite={toggleFavorite}
                  onLaunch={recordLaunch}
                />
              ))}
            </div>
          ) : (
            <MedicalEmptyState>各アプリ右上の★で診療開始セットに登録できます。</MedicalEmptyState>
          )}
        </section>
      </div>

      <section id="apps" className="grid gap-3 scroll-mt-4">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_24rem] sm:items-end">
          <MedicalSectionHeader title="Applications" description="Compact catalog" />
          <MedicalSearchInput value={query} onChange={setQuery} />
        </div>

        {query.trim() ? null : (
          <div className="flex flex-wrap gap-1.5" aria-label="よく使うタグ">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="inline-flex min-h-11 items-center rounded-xl border border-cyan-100/10 bg-slate-950/42 px-3 text-xs font-black text-cyan-100 transition hover:border-cyan-200/35 hover:bg-cyan-950/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filteredApps.length > 0 ? (
          <div className="grid gap-3">
            {categories.map((category) => {
              const categoryApps = filteredApps.filter(
                (app) => app.category === category.title,
              );

              if (categoryApps.length === 0) return null;

              return (
                <section key={category.title} className="grid gap-2">
                  <MedicalSectionHeader
                    title={category.title}
                    description={category.description}
                  />
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {categoryApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        isFavorite={favorites.includes(app.id)}
                        onToggleFavorite={toggleFavorite}
                        onLaunch={recordLaunch}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <MedicalEmptyState>
            一致するアプリがありません。検索語を変えてください。
          </MedicalEmptyState>
        )}
      </section>

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <details className="border-t border-cyan-200/10 pt-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-xs font-black text-cyan-300/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            Clinical Pearl
            <span className="text-[10px] font-bold text-slate-500">
              {pearl.category}
            </span>
          </summary>
          <h2 className="mt-2 text-sm font-black text-white">{pearl.title}</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
            {pearl.body}
          </p>
          <p className="mt-2 text-[10px] font-bold text-slate-500">
            {pearl.tags.join(" / ")}
          </p>
        </details>

        <section className="grid gap-2" aria-label="Release Notes">
          <MedicalSectionHeader title="Release Notes" />
          <div className="border-b border-cyan-200/10 pb-3">
            <p className="flex flex-wrap gap-x-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              <span>{releaseNotes.version}</span>
              <span>{releaseNotes.date}</span>
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
              {releaseNotes.changes}
            </p>
          </div>
        </section>
      </div>

      <section id="settings" className="grid gap-2 scroll-mt-4">
        <MedicalSectionHeader title="Links" />
        <div className="grid divide-y divide-cyan-100/10 border-b border-cyan-200/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            ["Antaa", "https://slide.antaa.jp/profile/aEvSNVPlS4Cj"],
            ["Note", "https://note.com/"],
            ["GitHub", "https://github.com/"],
            ["Developer", "#"],
          ].map(([label, href]) => (
            <MedicalButton
              key={label}
              href={href}
              target={href === "#" ? undefined : "_blank"}
              rel={href === "#" ? undefined : "noopener noreferrer"}
              className="justify-between rounded-none border-0 bg-transparent text-white hover:bg-cyan-300/10"
            >
              {label}
              <span className="text-cyan-200">→</span>
            </MedicalButton>
          ))}
        </div>
      </section>

      <footer className="border-t border-cyan-200/10 pt-3 text-[11px] font-semibold leading-5 text-slate-500 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4">
        <span>Version {VERSION}</span>
        <a href="#" className="inline-flex min-h-11 min-w-11 items-center py-3 hover:text-cyan-200">
          License
        </a>
        <a href="#" className="inline-flex min-h-11 min-w-11 items-center py-3 hover:text-cyan-200">
          Privacy
        </a>
        <a href="#" className="inline-flex min-h-11 min-w-11 items-center py-3 hover:text-cyan-200">
          Disclaimer
        </a>
        <span className="font-black text-cyan-300/80">Developed by Dr. Ito</span>
      </footer>

      <MedicalBottomNavigation />
    </MedicalPage>
  );
}
