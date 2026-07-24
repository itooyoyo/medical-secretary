import type { Metadata } from "next";
import Link from "next/link";
import { MedicalBadge, MedicalCard, MedicalSpace } from "../../components/medical-kit";
import { evidenceSources } from "../evidence";
import "../styles.css";

export const metadata: Metadata = {
  title: "References | Bedside Edema Navigator",
  description: "浮腫鑑別アルゴリズムで利用した公開情報源",
};

export default function ReferencesPage() {
  return (
    <MedicalSpace>
      <section className="station-references">
        <nav className="station-reference-nav">
          <Link href="/bedside-edema">← 診察へ戻る</Link>
          <span>MEDICAL SPACE STATION / EVIDENCE</span>
        </nav>
        <header className="station-reference-header">
          <MedicalBadge>REFERENCES</MedicalBadge>
          <h1>判断根拠と公開情報源</h1>
          <p>公開されたガイドライン・査読論文を鑑別ロジックとして独自に再構成しています。本文・図表の転載はしていません。</p>
        </header>
        <div className="station-reference-list">
          {evidenceSources.map((source, index) => (
            <MedicalCard key={source.id} className="station-reference-card">
              <span>0{index + 1}</span>
              <div>
                <code>{source.id}</code>
                <h2>{source.title}</h2>
                <p>{source.publisher} · {source.year}</p>
                <dl><dt>利用した内容</dt><dd>{source.usedFor}</dd></dl>
                <a href={source.url} target="_blank" rel="noopener noreferrer">原資料を開く ↗</a>
              </div>
            </MedicalCard>
          ))}
        </div>
        <footer className="station-fixed-note">最終判断は原資料と患者個別の臨床状況を確認してください。</footer>
      </section>
    </MedicalSpace>
  );
}
