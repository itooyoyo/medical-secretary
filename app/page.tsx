type AppItem = {
  name: string;
  url: string;
  icon: string;
};

type AppCategory = {
  title: string;
  description: string;
  apps: AppItem[];
};

const appCategories: AppCategory[] = [
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
    description: "内分泌救急の診断と対応方針の整理を支援します。",
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

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4 text-slate-100 sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                Dr. Ito Medical Hub
              </div>

              <h1 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                Dr. Ito Medical Hub
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                診療支援アプリ、医学教育コンテンツ、公開資料をまとめたポータルです。
                各ツールは参考情報として使用し、最終判断は担当医が行ってください。
              </p>
            </div>

            <div className="rounded-2xl border border-slate-600 bg-slate-900/90 px-5 py-4 sm:text-right">
              <p className="text-xs text-slate-400">Developed by</p>
              <p className="font-bold text-cyan-300">Dr. Ito</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          {appCategories.map((category) => (
            <section
              key={category.title}
              className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20 sm:p-6"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {category.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
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
                    className="group block rounded-2xl border border-slate-700 bg-slate-800 p-4 transition hover:border-cyan-400 hover:bg-slate-800/80"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                        {app.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug text-white">
                          {app.name}
                        </p>
                        <p className="mt-2 break-words text-xs leading-relaxed text-slate-400">
                          {app.url}
                        </p>
                        <p className="mt-3 text-sm font-bold text-cyan-300 transition group-hover:text-cyan-200">
                          アプリを開く →
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">外部リンク</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a
              href="https://slide.antaa.jp/profile/aEvSNVPlS4Cj"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-4 transition hover:bg-fuchsia-400/20"
            >
              <p className="font-bold text-white">Antaa Slide</p>
              <p className="mt-2 text-sm text-slate-300">
                Dr. Ito の公開スライド一覧
              </p>
            </a>

            <a
              href="https://note.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 transition hover:bg-emerald-400/20"
            >
              <p className="font-bold text-white">Note</p>
              <p className="mt-2 text-sm text-slate-300">
                医学教育・診療支援コンテンツ
              </p>
            </a>
          </div>
        </section>

        <footer className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 text-sm leading-relaxed text-slate-400 sm:p-6">
          <p>
            本ポータルおよび各アプリは診療支援・教育目的で提供されています。
            実際の診療判断は、各種ガイドライン、添付文書、患者背景、施設方針に基づいて行ってください。
          </p>
          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="font-semibold text-cyan-300">Developed by Dr. Ito</p>
            <p className="text-slate-500">Medical App Hub</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
