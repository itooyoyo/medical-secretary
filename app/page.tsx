"use client";

import { useEffect, useState } from "react";

type Result = {
  title: string;
  category: string;
  difficulty: string;
  impact: string;
  reason: string;
  nextStep: string;
  noteTitle: string;
  pv: string;
  contribution: string;
  monetization: string;
  buildDifficulty: string;
  scores: {
    diabetes: number;
    emergency: number;
    neuro: number;
    education: number;
    research: number;
  };
};

type NoteItem = {
  title: string;
  link: string;
  pubDate: string;
};

const myApps = [
  {
    name: "糖尿病治療薬選択補助ツール",
    category: "糖尿病",
    url: "https://economic-med-script-flow.base44.app",
    icon: "💊",
  },
  {
    name: "酸塩基異常診断支援",
    category: "救急",
    url: "https://acid-base-diagnostic-assistant.vercel.app/",
    icon: "🩸",
  },
  {
    name: "甲状腺クリーゼ治療補助ツール",
    category: "内分泌救急",
    url: "https://thyro-score-flow.base44.app/",
    icon: "🦋",
  },
  {
    name: "電解質異常診断補助ツール",
    category: "総合内科",
    url: "https://ito-lab-calc.base44.app",
    icon: "⚡",
  },
  {
  name: "動悸・頻脈初期対応支援",
  category: "救急",
  url: "https://tachy-check-flow.base44.app",
  icon: "❤️",
},
  {
    name: "TachyScan Pro",
    category: "救急",
    url: "https://tachyscan-pro.vercel.app/",
    icon: "❤️",
  },
  {
    name: "神経診察診断補助ツール",
    category: "神経",
    url: "https://neuro-path-scan.base44.app",
    icon: "🧠",
  },
];

export default function Home() {
  const [apps, setApps] = useState(
    "糖尿病治療薬選択補助ツール、酸塩基異常診断支援、甲状腺クリーゼ治療補助ツール、電解質異常診断補助ツール、神経診察診断補助ツール"
  );
  const [specialty, setSpecialty] = useState("糖尿病内科、総合内科");
  const [goal, setGoal] = useState("教育、診療支援、Note発信");
  const [result, setResult] = useState<Result | null>(null);
  const [showApps, setShowApps] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch(() => setNotes([]));
  }, []);

  function stars(score: number) {
    return "★".repeat(score) + "☆".repeat(5 - score);
  }

  function analyze() {
    const text = `${apps} ${specialty} ${goal}`;

    let recommendation: Result = {
      title: "CGM解析AI",
      category: "糖尿病・外来支援",
      difficulty: "★★★☆☆",
      impact: "★★★★★",
      pv: "★★★★☆",
      contribution: "★★★★★",
      monetization: "★★★★☆",
      buildDifficulty: "★★★☆☆",
      reason:
        "糖尿病専門医としての強みを最も活かしやすく、Note・講演・学会発表にも展開しやすいテーマです。",
      nextStep:
        "TIR、TAR、TBR、CV、平均血糖を入力し、評価コメントとカルテ記載例を返すVer1を作りましょう。",
      noteTitle: "糖尿病専門医が作るCGM解析AI：血糖変動をどう読むか",
      scores: { diabetes: 5, emergency: 3, neuro: 1, education: 4, research: 4 },
    };

    if (text.includes("血液ガス") || text.includes("DKA")) {
      recommendation = {
        title: "糖尿病救急統合ダッシュボード",
        category: "救急・糖尿病",
        difficulty: "★★★★☆",
        impact: "★★★★★",
        pv: "★★★★★",
        contribution: "★★★★★",
        monetization: "★★★☆☆",
        buildDifficulty: "★★★★☆",
        reason:
          "血液ガス、DKA、電解質を統合すると、救急外来で実用性の高い代表作になります。",
        nextStep:
          "pH、HCO3、PaCO2、Na、血糖、ケトン体、浸透圧を一画面で評価できる構成にしましょう。",
        noteTitle:
          "その血ガス、正常に見えて危険かも：糖尿病救急をアプリで支援する",
        scores: { diabetes: 5, emergency: 5, neuro: 2, education: 4, research: 3 },
      };
    }

    if (text.includes("脳梗塞") || text.includes("神経")) {
      recommendation = {
        title: "神経診察・脳卒中初療支援ツール",
        category: "神経・救急",
        difficulty: "★★★★☆",
        impact: "★★★★☆",
        pv: "★★★★☆",
        contribution: "★★★★★",
        monetization: "★★★☆☆",
        buildDifficulty: "★★★★☆",
        reason:
          "脳梗塞診断支援ツールを、眼球運動・構音障害・失語・麻痺の評価まで拡張できます。",
        nextStep:
          "突然発症、意識障害、失語、麻痺、眼球運動異常から病変部位を推定する画面を作りましょう。",
        noteTitle: "脳梗塞を見逃さないための診察フローをアプリ化してみた",
        scores: { diabetes: 3, emergency: 5, neuro: 5, education: 4, research: 3 },
      };
    }

    if (text.includes("電解質") || text.includes("Na") || text.includes("K")) {
      recommendation = {
        title: "輸液・電解質補正プラン作成ツール",
        category: "総合内科・救急",
        difficulty: "★★★☆☆",
        impact: "★★★★☆",
        pv: "★★★★☆",
        contribution: "★★★★☆",
        monetization: "★★☆☆☆",
        buildDifficulty: "★★★☆☆",
        reason:
          "電解質計算だけでなく、補正速度・輸液選択・注意点まで出せると臨床で使われやすくなります。",
        nextStep:
          "Na補正、K補正、自由水欠乏量、補正速度の警告表示を実装しましょう。",
        noteTitle: "低Na血症・高K血症の計算をアプリで整理する",
        scores: { diabetes: 3, emergency: 5, neuro: 2, education: 3, research: 2 },
      };
    }

    if (text.includes("教育") || text.includes("Note") || text.includes("note")) {
      recommendation = {
        title: "医療者向け無料診療支援ツール集ポータル",
        category: "教育・発信",
        difficulty: "★★☆☆☆",
        impact: "★★★★★",
        pv: "★★★★★",
        contribution: "★★★★☆",
        monetization: "★★★☆☆",
        buildDifficulty: "★★☆☆☆",
        reason:
          "すでに公開している複数アプリを一覧化すると、Noteからの回遊性と信頼性が上がります。",
        nextStep:
          "各アプリのカード、説明文、対象者、注意事項、リンクボタンを並べるポータルを作りましょう。",
        noteTitle: "医師が自作した無料診療支援ツール集を公開します",
        scores: { diabetes: 4, emergency: 4, neuro: 3, education: 5, research: 2 },
      };
    }

    setResult(recommendation);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                Dr. Ito Medical Hub
              </div>

              <h1 className="mb-3 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                Dr. Ito Medical Hub
              </h1>

              <p className="max-w-3xl text-slate-300">
                医療アプリ・Antaa Slide・Noteを統合した診療支援ポータル
              </p>
            </div>

            <div className="rounded-2xl border border-slate-600 bg-slate-900 px-5 py-4 text-right">
              <p className="text-xs text-slate-400">Developed by</p>
              <p className="font-bold text-cyan-300">Dr. Ito</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-5 text-2xl font-bold text-white">入力</h2>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-cyan-300">
                  ① 作成済みアプリ
                </label>
                <p className="text-sm text-slate-400">
                  これまで作成した医療アプリを入力してください。
                </p>

                <textarea
                  className="min-h-36 w-full rounded-2xl border border-slate-600 bg-slate-900 p-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  value={apps}
                  onChange={(e) => setApps(e.target.value)}
                />

                <label className="block text-sm font-bold text-cyan-300">
                  ② 専門領域
                </label>
                <p className="text-sm text-slate-400">
                  例：糖尿病内科、総合内科、内分泌内科
                </p>

                <input
                  className="w-full rounded-2xl border border-slate-600 bg-slate-900 p-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />

                <label className="block text-sm font-bold text-cyan-300">
                  ③ 目標
                </label>
                <p className="text-sm text-slate-400">
                  例：教育、診療支援、Note発信、研究、収益化
                </p>

                <input
                  className="w-full rounded-2xl border border-slate-600 bg-slate-900 p-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />

                <button
                  onClick={analyze}
                  className="w-full rounded-2xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
                >
                  次に作るべきアプリを提案する
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">保有アプリ一覧</h2>

                <button
                  onClick={() => setShowApps(!showApps)}
                  className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300"
                >
                  {showApps ? "閉じる ▲" : "開く ▼"}
                </button>
              </div>

              {showApps && (
                <div className="space-y-3">
                  {myApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-slate-700 bg-slate-800 p-4 transition hover:border-cyan-400 hover:bg-slate-700"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-white">
                            {app.icon} {app.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {app.category}
                          </p>
                        </div>
                        <span className="text-sm text-cyan-300">開く →</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">📝 最新Note記事</h2>

                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300"
                >
                  {showNotes ? "閉じる ▲" : "開く ▼"}
                </button>
              </div>

              {showNotes && (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <a
                      key={note.link}
                      href={note.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-slate-700 bg-slate-800 p-4 transition hover:border-emerald-400 hover:bg-slate-700"
                    >
                      <p className="font-bold text-white">📝 {note.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(note.pubDate).toLocaleDateString("ja-JP")}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
           <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
  <h2 className="mb-4 text-xl font-bold text-white">
    📊 Antaa Slide
  </h2>

  <a
    href="https://slide.antaa.jp/profile/aEvSNVPlS4Cj"
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-2xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-4 transition hover:bg-fuchsia-400/20"
  >
    <p className="font-bold text-white">
      Dr.Ito Antaaプロフィール
    </p>

    <p className="mt-2 text-sm text-slate-300">
      投稿したAntaa Slideを一覧表示
    </p>

    <p className="mt-2 text-fuchsia-300">
      プロフィールを開く →
    </p>
  </a>
</div> 
          </div>

          <div className="space-y-6">
            {!result && (
              <div className="rounded-3xl border border-dashed border-slate-600 bg-slate-800 p-8 text-slate-400">
                入力後、「次に作るべきアプリを提案する」を押すとダッシュボードが表示されます。
              </div>
            )}

            {result && (
              <>
                <div className="grid gap-4 md:grid-cols-5">
                  {[
                    ["糖尿病", result.scores.diabetes],
                    ["救急", result.scores.emergency],
                    ["神経", result.scores.neuro],
                    ["教育", result.scores.education],
                    ["研究", result.scores.research],
                  ].map(([label, score]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4"
                    >
                      <p className="text-sm text-cyan-200">{label}</p>
                      <p className="mt-2 text-xl">{stars(score as number)}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-cyan-400/30 bg-slate-800 p-6 shadow-xl">
                  <p className="mb-2 text-sm font-bold text-cyan-300">
                    次の攻略先
                  </p>
                  <h2 className="text-4xl font-bold text-white">
                    {result.title}
                  </h2>
                  <p className="mt-3 text-slate-300">{result.category}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                    <p className="text-sm text-cyan-200">PV期待</p>
                    <p className="mt-2 text-2xl">{result.pv}</p>
                  </div>
                  <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <p className="text-sm text-emerald-200">医療貢献</p>
                    <p className="mt-2 text-2xl">{result.contribution}</p>
                  </div>
                  <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-5">
                    <p className="text-sm text-fuchsia-200">収益化</p>
                    <p className="mt-2 text-2xl">{result.monetization}</p>
                  </div>
                  <div className="rounded-3xl border border-blue-400/30 bg-blue-400/10 p-5">
                    <p className="text-sm text-blue-200">実装難易度</p>
                    <p className="mt-2 text-2xl">{result.buildDifficulty}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-600 bg-slate-800 p-6">
                    <p className="text-sm font-bold text-cyan-300">戦略理由</p>
                    <p className="mt-3 leading-relaxed text-slate-200">
                      {result.reason}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
                    <p className="text-sm font-bold text-amber-200">次の一手</p>
                    <p className="mt-3 leading-relaxed text-slate-100">
                      {result.nextStep}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-6">
                  <p className="text-sm font-bold text-fuchsia-200">Note記事案</p>
                  <p className="mt-3 text-2xl font-bold text-white">
                    {result.noteTitle}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        <footer className="mt-12 rounded-3xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-400">
          <div className="space-y-3">
            <p>
              本ツールは教育・開発支援目的で提供されています。
              実際の診療判断は各種ガイドラインおよび担当医の臨床判断に基づいて行ってください。
            </p>
            <p>
              個人情報・患者識別情報（氏名、生年月日、ID等）は入力しないでください。
            </p>
            <div className="border-t border-slate-700 pt-3">
              <p className="font-semibold text-cyan-300">Developed by Dr. Ito</p>
              <p className="text-slate-500">Medical App Empire Dashboard</p>
              <p className="text-slate-500">
                Version 1.0.0 | Last Updated: 2026-06-04
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
