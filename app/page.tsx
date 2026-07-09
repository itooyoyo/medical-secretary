"use client";

import Image from "next/image";

type AppItem = {
  name: string;
  url: string;
  icon: string;
  subtitle?: string;
  isNew?: boolean;
};

type AppCategory = {
  title: string;
  description: string;
  apps: AppItem[];
};

const appCategories: AppCategory[] = [
  {
    title: "🏥 総合内科",
    description: "総合内科外来・救急での診断推論や検査値の整理を支援するツール群です。",
    apps: [
      {
        name: "発熱・CRP診断支援",
        subtitle: "総合内科外来・救急向け診断推論支援",
        url: "https://fever-diagnostic-assistant.vercel.app/",
        icon: "🔥",
        isNew: true,
      },
    ],
  },
  {
    title: "🚑 救急・当直",
    description: "初期対応、検査値の整理、緊急度判断を支援するツール群です。",
    apps: [
      {
        name: "酸塩基異常診断支援",
        url: "https://acid-base-diagnostic-assistant.vercel.app/",
        icon: "🩸",
      },
      {
        name: "頻脈初期対応支援",
        url: "https://tachyscan-pro.vercel.app/",
        icon: "❤️",
      },
      {
        name: "電解質異常診断支援",
        url: "https://electrolyte-diagnostic-assistant.vercel.app/",
        icon: "⚡",
      },
    ],
  },
  {
    title: "🧠 神経",
    description: "神経診察と病巣推定を整理するための診療支援ツールです。",
    apps: [
      {
        name: "神経局在診断支援",
        url: "https://neuro-localizer.vercel.app/",
        icon: "🧠",
      },
    ],
  },
  {
    title: "🦋 内分泌",
    description: "内分泌緊急症の診断と対応方針の整理を支援します。",
    apps: [
      {
        name: "甲状腺クリーゼ診断支援",
        url: "https://thyroid-crisis-navigator.vercel.app/",
        icon: "🦋",
      },
    ],
  },
  {
    title: "💊 糖尿病",
    description: "糖尿病診療における薬剤選択や説明を補助します。",
    apps: [
      {
        name: "糖尿病治療薬選択支援",
        url: "https://diabetes-treatment-assistant.vercel.app/",
        icon: "💊",
      },
    ],
  },
];

const guideMessages = [
  "今日のClinical Pearlです。",
  "必要なツールを選んでください。",
  "迷ったらRed Flagから確認しましょう。",
  "病態から整理してみましょう。",
];

const clinicalPearls = [
  "発熱＝感染症とは限りません。",
  "pH正常でも混合性酸塩基異常は否定できません。",
  "AG開大は診断名ではなく原因検索の入口です。",
  "Wide QRS頻拍ではVTをまず考慮します。",
  "低Na補正は速すぎても危険です。",
  "黄色ブドウ球菌菌血症では感染性心内膜炎を評価します。",
  "LDH高値＋感染巣不明では血管内リンパ腫も考慮します。",
  "発熱＋腰背部痛では化膿性脊椎炎を忘れない。",
  "甲状腺クリーゼではRed Flagを先に確認します。",
  "神経診察では皮質症状の有無が局在診断の入口になります。",
];

const diagnosticTips = [
  "まずRed Flagを確認してから鑑別を広げます。",
  "病名ではなく病態から考えると整理しやすくなります。",
  "診断がつかない時は、再評価のタイミングを決めることも重要です。",
  "検査値は単独ではなく、臨床背景と合わせて解釈します。",
  "迷ったら「次に確認すること」を1つに絞ります。",
];

const recentUpdates = [
  "発熱・CRP診断支援：Disease CardとMobile UIを改善",
  "酸塩基異常診断支援：病態推論とGuide Characterを改善",
  "甲状腺クリーゼ診断支援：Premium Designへ更新",
];

function pickDailyItem(items: string[], offset = 0) {
  const today = new Date();
  const dayKey =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  return items[(dayKey + offset) % items.length];
}

function getDailyDashboardCopy() {
  return {
    guide: pickDailyItem(guideMessages),
    pearl: pickDailyItem(clinicalPearls, 3),
    tip: pickDailyItem(diagnosticTips, 1),
  };
}

export default function Home() {
  const dashboardCopy = getDailyDashboardCopy();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07111f] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        <section className="rounded-2xl border border-white/10 bg-[#0b1a2e] px-4 py-5 shadow-2xl shadow-sky-950/30 sm:px-7 sm:py-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                Dr. Ito Medical Hub
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-5xl">
                Dr. Ito Medical Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                診断支援ツール、臨床メモ、更新情報を一画面で確認できます。必要なツールへ素早く移動し、まず確認すべき視点を短く整理します。
              </p>

              <div className="mt-5 grid grid-cols-[78px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[92px_minmax(0,1fr)]">
                <Image
                  src="/guide-character.png"
                  alt=""
                  width={520}
                  height={467}
                  priority
                  className="h-[84px] w-[76px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.34)] sm:h-[96px] sm:w-[90px]"
                />
                <div className="relative rounded-2xl border border-sky-300/40 bg-[#071b2e]/90 px-4 py-3 shadow-lg shadow-black/20 before:absolute before:left-[-7px] before:top-1/2 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:border-b before:border-l before:border-sky-300/40 before:bg-[#071b2e]">
                  <p className="text-sm font-black text-white">診療ガイド</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {dashboardCopy.guide}
                  </p>
                </div>
              </div>
            </div>

            <aside className="grid gap-3">
              <div className="rounded-xl border border-sky-200/20 bg-white px-4 py-4 text-[#0b1a2e]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
                  Today&apos;s Clinical Pearl
                </p>
                <p className="mt-2 text-base font-black leading-7">
                  {dashboardCopy.pearl}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#10243b] px-4 py-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-200">
                  Today&apos;s Diagnostic Tip
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-white">
                  {dashboardCopy.tip}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b1a2e] p-4 sm:p-5">
          <h2 className="text-lg font-black text-white">最近更新</h2>
          <ul className="grid gap-2 text-sm leading-6 text-slate-300">
            {recentUpdates.map((update) => (
              <li key={update} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                <span>{update}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-5 pt-1">
          {appCategories.map((category) => (
            <section
              key={category.title}
              className="rounded-2xl border border-slate-700 bg-[#0d1b2d] p-4 shadow-xl shadow-black/15 sm:p-5"
            >
              <div className="mb-4">
                <h2 className="text-xl font-black text-white sm:text-2xl">
                  {category.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.apps.map((app) => (
                  <a
                    key={app.url}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block min-w-0 rounded-xl border border-slate-700 bg-[#13243a] p-4 transition hover:border-sky-300 hover:bg-[#17304d]"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-200 text-xl font-black text-[#0b1a2e]">
                        {app.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black leading-snug text-white">
                            {app.name}
                          </p>
                          {app.isNew ? (
                            <span className="rounded-full border border-amber-200/50 bg-amber-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#0b1a2e]">
                              NEW
                            </span>
                          ) : null}
                        </div>
                        {app.subtitle ? (
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {app.subtitle}
                          </p>
                        ) : null}
                        <p className="mt-2 break-words text-xs leading-5 text-slate-400">
                          {app.url}
                        </p>
                        <p className="mt-3 text-sm font-black text-sky-300 transition group-hover:text-sky-200">
                          アプリを開く
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-[#0d1b2d] p-4 sm:p-5">
          <h2 className="text-lg font-black text-white">外部リンク</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a
              href="https://slide.antaa.jp/profile/aEvSNVPlS4Cj"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-700 bg-[#13243a] p-4 transition hover:border-sky-300 hover:bg-[#17304d]"
            >
              <p className="font-black text-white">Antaa Slide</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Dr. Ito の公開スライド一覧
              </p>
            </a>

            <a
              href="https://note.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-700 bg-[#13243a] p-4 transition hover:border-sky-300 hover:bg-[#17304d]"
            >
              <p className="font-black text-white">Note</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                医学教育・診断支援コンテンツ
              </p>
            </a>
          </div>
        </section>

        <footer className="rounded-2xl border border-slate-700 bg-[#0d1b2d] p-4 text-sm leading-6 text-slate-400 sm:p-5">
          <p>
            本ポータルおよび各アプリは診療支援・医学教育目的で提供されています。最終的な診療判断は、診療ガイドライン、添付文書、患者背景、施設方針に基づいて行ってください。
          </p>
          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="font-bold text-sky-300">Developed by Dr. Ito</p>
            <p className="text-slate-500">Medical App Hub</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
