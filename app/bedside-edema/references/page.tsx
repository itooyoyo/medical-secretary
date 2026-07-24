import type { Metadata } from "next";
import Link from "next/link";
import { evidenceSources } from "../evidence";
import "../styles.css";

export const metadata: Metadata = {
  title: "References | Bedside Edema Navigator",
  description: "浮腫鑑別アルゴリズムで利用した公開情報源",
};

export default function ReferencesPage() {
  return (
    <main className="edema-shell">
      <div className="edema-ambient" />
      <section className="edema-references">
        <nav className="edema-reference-nav">
          <Link href="/bedside-edema">← 診察へ戻る</Link>
          <span>BED·SIDE EVIDENCE</span>
        </nav>
        <header>
          <span>REFERENCES</span>
          <h1>判断根拠と公開情報源</h1>
          <p>公開されたガイドライン・査読論文を鑑別ロジックとして独自に再構成しています。本文・図表の転載はしていません。</p>
        </header>
        <div className="edema-reference-list">
          {evidenceSources.map((source, index) => (
            <article key={source.id}>
              <span>0{index + 1}</span>
              <div>
                <code>{source.id}</code>
                <h2>{source.title}</h2>
                <p>{source.publisher} · {source.year}</p>
                <dl><dt>利用した内容</dt><dd>{source.usedFor}</dd></dl>
                <a href={source.url} target="_blank" rel="noopener noreferrer">原資料を開く ↗</a>
              </div>
            </article>
          ))}
        </div>
        <footer className="edema-fixed-note">最終判断は原資料と患者個別の臨床状況を確認してください。</footer>
      </section>
    </main>
  );
}
