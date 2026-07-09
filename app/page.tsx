import Image from "next/image";

export const dynamic = "force-dynamic";

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
    description: "診断推論と検査値の整理",
    apps: [
      {
        name: "発熱・CRP診断支援",
        subtitle: "発熱、CRP高値、原因不明発熱",
        url: "https://fever-diagnostic-assistant.vercel.app/",
        icon: "🔥",
        isNew: true,
      },
    ],
  },
  {
    title: "🚑 救急・当直",
    description: "初期対応と緊急度判断",
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
    description: "神経診察と病巣推定",
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
    description: "内分泌緊急症の整理",
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
    description: "治療薬選択と説明補助",
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
  "必要なツールを選んでください。",
  "迷ったらRed Flagから確認しましょう。",
  "今日のClinical Pearlです。",
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

export default function Home() {
  const guideMessage = pickDailyItem(guideMessages);
  const clinicalPearl = pickDailyItem(clinicalPearls, 3);
  const diagnosticTip = pickDailyItem(diagnosticTips, 1);

  return (
    <main className="medical-console relative min-h-screen overflow-x-hidden text-white">
      <div className="console-stars pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan-300/40 shadow-[0_0_28px_rgba(34,211,238,0.45)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-7 sm:px-6 sm:py-10 lg:gap-16 lg:py-14">
        <section className="grid min-h-[72svh] content-center gap-8 py-10">
          <div className="mx-auto grid w-full max-w-3xl justify-items-center gap-6 text-center">
            <div className="guide-hologram relative grid justify-items-center gap-4">
              <Image
                src="/guide-character.png"
                alt=""
                width={520}
                height={467}
                priority
                className="relative z-10 h-[118px] w-[132px] object-contain sm:h-[150px] sm:w-[168px]"
              />
              <div className="relative z-10 max-w-[22rem] rounded-2xl border border-cyan-200/25 bg-cyan-950/15 px-4 py-3 text-left shadow-[0_0_26px_rgba(34,211,238,0.12)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  Guide AI
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-200">
                  {guideMessage}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/80">
                Dr. Ito Medical Hub
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
                Medical AI Console
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                診断支援ツールへすばやくアクセスする、日常診療のためのMedical Command Center。
              </p>
            </div>

            <a
              href="#apps"
              className="group inline-flex min-h-12 items-center justify-center rounded-2xl border border-cyan-200/35 bg-cyan-300/10 px-6 text-sm font-black text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.12)] transition duration-300 hover:border-cyan-200/70 hover:bg-cyan-300/15 hover:shadow-[0_0_34px_rgba(34,211,238,0.28)] focus:outline-none focus:ring-2 focus:ring-cyan-200/50"
            >
              <span className="mr-3 h-px w-7 bg-cyan-200/70 transition group-hover:w-9" />
              Open Console
            </a>
          </div>

          <div className="mx-auto grid w-full max-w-3xl gap-3 border-t border-cyan-200/15 pt-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/70">
              Today&apos;s Clinical Pearl
            </p>
            <p className="text-xl font-black leading-8 text-white sm:text-2xl">
              {clinicalPearl}
            </p>
            <p className="text-xs font-semibold leading-6 text-slate-500 sm:text-sm">
              Today&apos;s Diagnostic Tip: {diagnosticTip}
            </p>
          </div>
        </section>

        <section className="grid gap-5 border-y border-cyan-200/10 py-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300/80">
            Recent Updates
          </h2>
          <ul className="grid gap-3 text-sm leading-6 text-slate-300">
            {recentUpdates.map((update) => (
              <li key={update} className="flex gap-3">
                <span className="mt-2 h-px w-8 shrink-0 bg-cyan-300/50" />
                <span>{update}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="apps" className="grid gap-9 scroll-mt-8">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300/75">
              Console Modules
            </p>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              アプリ一覧
            </h2>
          </div>

          <div className="grid gap-10">
            {appCategories.map((category) => (
              <section key={category.title} className="grid gap-4">
                <div className="grid gap-2 border-b border-cyan-200/10 pb-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <h3 className="text-xl font-black text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    {category.description}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {category.apps.map((app) => (
                    <a
                      key={app.url}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block min-w-0 rounded-2xl border border-cyan-100/10 bg-cyan-950/[0.13] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-cyan-950/25 hover:shadow-[0_0_34px_rgba(34,211,238,0.16)]"
                    >
                      <span className="absolute inset-x-5 top-0 h-px bg-cyan-200/25 transition group-hover:bg-cyan-200/60" />
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-xl shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                          {app.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black leading-snug text-white">
                              {app.name}
                            </p>
                            {app.isNew ? (
                              <span className="rounded-full border border-cyan-200/35 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-cyan-100">
                                NEW
                              </span>
                            ) : null}
                          </div>
                          {app.subtitle ? (
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {app.subtitle}
                            </p>
                          ) : null}
                          <p className="mt-5 break-words text-[11px] leading-5 text-slate-600">
                            {app.url}
                          </p>
                          <p className="mt-4 inline-flex items-center gap-3 text-sm font-black text-cyan-200">
                            Launch
                            <span className="h-px w-8 bg-cyan-200/60 transition group-hover:w-12" />
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="grid gap-5 border-t border-cyan-200/10 pt-8 sm:grid-cols-[160px_minmax(0,1fr)]">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300/80">
            Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://slide.antaa.jp/profile/aEvSNVPlS4Cj"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-cyan-100/10 bg-transparent p-4 transition duration-300 hover:border-cyan-200/35 hover:shadow-[0_0_26px_rgba(34,211,238,0.12)]"
            >
              <p className="font-black text-white">Antaa Slide</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Dr. Ito の公開スライド一覧
              </p>
            </a>

            <a
              href="https://note.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-cyan-100/10 bg-transparent p-4 transition duration-300 hover:border-cyan-200/35 hover:shadow-[0_0_26px_rgba(34,211,238,0.12)]"
            >
              <p className="font-black text-white">Note</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                医学教育・診断支援コンテンツ
              </p>
            </a>
          </div>
        </section>

        <footer className="border-t border-cyan-200/10 pt-6 text-sm leading-6 text-slate-600">
          <p>
            本ポータルおよび各アプリは診療支援・医学教育目的で提供されています。最終的な診療判断は、診療ガイドライン、添付文書、患者背景、施設方針に基づいて行ってください。
          </p>
          <p className="mt-4 font-bold text-cyan-300/80">Developed by Dr. Ito</p>
        </footer>
      </div>
    </main>
  );
}
