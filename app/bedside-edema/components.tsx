"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  allItems,
  examSteps,
  physicalExamItemIds,
  redFlags,
  type ExamItem,
  type Guide,
} from "./data";

export type Answers = Record<string, string>;

function InfoGuide({
  label,
  guide,
  onClose,
}: {
  label: string;
  guide: Guide;
  onClose: () => void;
}) {
  const rows = [
    ["どこを見るか", guide.where],
    ["どう触るか", guide.how],
    ["正常所見", guide.normal],
    ["異常所見", guide.abnormal],
    ["何を疑うか", guide.suggests],
    ["診察のコツ", guide.tip],
  ];

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="edema-modal" role="dialog" aria-modal="true" aria-label={`${label}の診察ガイド`}>
      <button className="edema-modal-backdrop" onClick={onClose} aria-label="診察ガイドを閉じる" />
      <section className="edema-guide">
        <div className="edema-guide-head">
          <div>
            <p>PHYSICAL EXAM GUIDE</p>
            <h2>{label}</h2>
          </div>
          <button onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="edema-guide-grid">
          {rows.map(([title, body]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProgressHeader({
  percent,
  confirmed,
  total,
  onShowMissing,
}: {
  percent: number;
  confirmed: number;
  total: number;
  onShowMissing: () => void;
}) {
  return (
    <header className="edema-progress">
      <div className="edema-progress-label">
        <span>診察完了率</span>
        <strong>{percent}%</strong>
      </div>
      <div className="edema-progress-track" aria-label={`診察完了率 ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <button onClick={onShowMissing} aria-label={`未確認一覧を開く（${total - confirmed}項目）`}>
        未確認 <span>{total - confirmed}</span>
      </button>
    </header>
  );
}

function FindingCard({
  item,
  answer,
  onAnswer,
  onInfo,
}: {
  item: ExamItem;
  answer?: string;
  onAnswer: (value: string) => void;
  onInfo: () => void;
}) {
  return (
    <article className="edema-finding-card">
      <div className="edema-question-head">
        <span>CHECK</span>
        <button
          type="button"
          disabled={!item.guide}
          onClick={onInfo}
          aria-label={`${item.label}の診察ガイド`}
          title="診察ガイド"
        >
          ⓘ
        </button>
      </div>
      <h2>{item.label}</h2>
      <p>{item.prompt}</p>
      <div className={`edema-choices ${item.choices.length > 3 ? "edema-choices-scroll" : ""}`}>
        {item.choices.map((choice) => (
          <button
            type="button"
            key={choice.value}
            className={answer === choice.value ? "selected" : ""}
            aria-pressed={answer === choice.value}
            onClick={() => onAnswer(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function MissingPanel({
  answers,
  onJump,
  onClose,
}: {
  answers: Answers;
  onJump: (itemId: string) => void;
  onClose: () => void;
}) {
  const missing = allItems.filter(
    (item) =>
      physicalExamItemIds.has(item.id) &&
      (!answers[item.id] || answers[item.id] === "unknown"),
  );
  return (
    <div className="edema-modal" role="dialog" aria-modal="true" aria-label="未確認一覧">
      <button className="edema-modal-backdrop" onClick={onClose} aria-label="未確認一覧を閉じる" />
      <section className="edema-guide edema-missing">
        <div className="edema-guide-head">
          <div>
            <p>NOT YET EXAMINED</p>
            <h2>未確認 {missing.length}項目</h2>
          </div>
          <button onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="edema-missing-list">
          {missing.length ? missing.map((item) => (
            <button key={item.id} onClick={() => onJump(item.id)}>
              <span>□</span>{item.label}<b>確認する →</b>
            </button>
          )) : <p className="edema-complete">すべて確認済みです</p>}
        </div>
      </section>
    </div>
  );
}

type Candidate = {
  name: string;
  reason: string[];
  missing: string[];
  exam: string;
  test?: string;
};

function buildCandidates(answers: Answers): Candidate[] {
  const has = (id: string, values = ["present", "warm", "cold", "large", "reduced", "high"]) =>
    values.includes(answers[id]);
  const unknown = (ids: string[]) =>
    ids.filter((id) => !answers[id] || answers[id] === "unknown")
      .map((id) => allItems.find((item) => item.id === id)?.label ?? id);
  const candidates: Candidate[] = [];

  if (has("unilateral") || has("calf-difference") || answers["history-1"] === "present") {
    candidates.push({
      name: "深部静脈血栓症など片側性静脈還流障害",
      reason: [
        has("unilateral") ? "片側性腫脹" : "",
        has("calf-difference") ? "下腿周径差3cm以上" : "",
        answers["history-6"] === "present" ? "長距離移動歴" : "",
      ].filter(Boolean),
      missing: unknown(["tenderness", "temperature", "calf-difference", "pedal-pulse"]),
      exam: "深部静脈走行の圧痛、皮膚温、下腿周径を左右比較",
      test: "臨床確率を評価したうえでD-dimer／下肢静脈超音波",
    });
  }

  if (has("jvd") || has("jvp") || has("crackles") || has("s3")) {
    candidates.push({
      name: "うっ血性心不全",
      reason: [
        has("jvd") || has("jvp") ? "頸静脈圧上昇" : "",
        has("crackles") ? "肺ラ音" : "",
        has("s3") ? "Ⅲ音" : "",
        has("bilateral") ? "両側性浮腫" : "",
      ].filter(Boolean),
      missing: unknown(["jvp", "crackles", "s3", "sacral"]),
      exam: "頸静脈圧、肺底部、Ⅲ音、仙骨浮腫を再確認",
      test: "診察で疑う場合にBNP、心電図、胸部画像、心エコー",
    });
  }

  if (has("pigmentation") || answers["history-4"] === "present" || answers["history-5"] === "present") {
    candidates.push({
      name: "慢性静脈不全",
      reason: [
        has("pigmentation") ? "下腿色素沈着" : "",
        answers["history-4"] === "present" ? "挙上で改善" : "",
        answers["history-5"] === "present" ? "長時間立位" : "",
      ].filter(Boolean),
      missing: unknown(["ulcer", "venous-distension", "pedal-pulse"]),
      exam: "静脈瘤、内果周囲の皮膚変化、潰瘍、動脈拍動を確認",
      test: "非典型例や介入検討時に静脈超音波",
    });
  }

  if (has("stemmer") || has("induration") || answers["history-10"] === "present") {
    candidates.push({
      name: "リンパ浮腫",
      reason: [
        has("stemmer") ? "Stemmer徴候陽性" : "",
        has("induration") ? "皮膚硬化" : "",
        answers["history-10"] === "present" ? "リンパ節郭清歴" : "",
      ].filter(Boolean),
      missing: unknown(["stemmer", "dorsum", "induration"]),
      exam: "足背・趾を含む分布、Stemmer徴候、皮膚硬化を確認",
      test: "診察で典型的なら通常は検査不要。非典型例は画像を検討",
    });
  }

  if (has("erythema") || answers.temperature === "warm" || has("tenderness")) {
    candidates.push({
      name: "蜂窩織炎など炎症性浮腫",
      reason: [
        has("erythema") ? "発赤" : "",
        answers.temperature === "warm" ? "皮膚温上昇" : "",
        has("tenderness") ? "圧痛" : "",
      ].filter(Boolean),
      missing: unknown(["temperature", "tenderness", "ulcer"]),
      exam: "発赤範囲、皮膚温、圧痛、侵入門戸と全身状態を確認",
      test: "全身症や重症所見がある場合に血算・炎症反応など",
    });
  }

  if (!candidates.length) {
    candidates.push({
      name: "現時点では特徴的なパターンが不十分",
      reason: ["入力済みの身体所見だけでは主要パターンを支持する組み合わせが未成立"],
      missing: unknown(["unilateral", "pitting", "stemmer", "jvp", "sacral", "dorsum"]),
      exam: "分布、圧痕、足背・仙骨、頸静脈、Stemmer徴候を優先して確認",
      test: "身体診察を完了して仮説を立てた後、必要最小限に選択",
    });
  }
  return candidates.slice(0, 3);
}

function ResultView({
  answers,
  onBack,
  onReset,
}: {
  answers: Answers;
  onBack: () => void;
  onReset: () => void;
}) {
  const candidates = buildCandidates(answers);
  const red = redFlags.filter((item) => {
    const choice = item.choices.find((option) => option.value === answers[item.id]);
    return choice?.positive;
  });

  return (
    <section className="edema-results">
      <div className="edema-result-hero">
        <span>BED-SIDE SYNTHESIS</span>
        <h1>診察所見のまとめ</h1>
        <p>診断の確定ではありません。所見の組み合わせから、次に行う診察を整理します。</p>
      </div>
      {red.length > 0 && (
        <div className="edema-warning">
          <strong>緊急評価を優先</strong>
          <p>{red.map((item) => item.label).join("・")}</p>
        </div>
      )}
      {candidates.map((candidate, index) => (
        <article className="edema-result-card" key={candidate.name}>
          <span className="edema-rank">0{index + 1}</span>
          <h2>{candidate.name}</h2>
          <dl>
            <div><dt>根拠となる身体所見</dt><dd>{candidate.reason.join("・")}</dd></div>
            <div><dt>まだ確認していない身体所見</dt><dd>{candidate.missing.length ? candidate.missing.join("・") : "主要項目は確認済み"}</dd></div>
            <div><dt>推奨される追加診察</dt><dd>{candidate.exam}</dd></div>
            <div><dt>必要なら推奨検査</dt><dd>{candidate.test ?? "現時点では必須検査なし"}</dd></div>
          </dl>
        </article>
      ))}
      <div className="edema-result-actions">
        <button onClick={onBack}>診察に戻る</button>
        <button onClick={onReset}>最初から</button>
      </div>
      <p className="edema-disclaimer">本ツールは教育・診療補助用です。緊急性の判断と最終的な診断・治療は担当医が行ってください。</p>
    </section>
  );
}

export default function EdemaNavigator() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [guide, setGuide] = useState<ExamItem | null>(null);
  const [showMissing, setShowMissing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const steps = useMemo(
    () => [{ id: "red", number: 0, title: "Red Flags", english: "SAFETY", description: "最初に必ず緊急所見を確認します", items: redFlags }, ...examSteps],
    [],
  );
  const currentStep = steps[stepIndex];
  const currentItem = currentStep.items[itemIndex];
  const physicalItems = allItems.filter((item) => physicalExamItemIds.has(item.id));
  const confirmed = physicalItems.filter((item) => answers[item.id] && answers[item.id] !== "unknown").length;
  const percent = Math.round((confirmed / physicalItems.length) * 100);
  const hasRedFlag = redFlags.some((item) =>
    item.choices.find((choice) => choice.value === answers[item.id])?.positive,
  );

  function answer(value: string) {
    setAnswers((current) => ({ ...current, [currentItem.id]: value }));
    window.setTimeout(() => {
      if (itemIndex < currentStep.items.length - 1) setItemIndex((value) => value + 1);
      else if (stepIndex < steps.length - 1) {
        setStepIndex((value) => value + 1);
        setItemIndex(0);
      } else setShowResult(true);
    }, 140);
  }

  function jumpTo(itemId: string) {
    const nextStep = steps.findIndex((step) => step.items.some((item) => item.id === itemId));
    const nextItem = steps[nextStep].items.findIndex((item) => item.id === itemId);
    setStepIndex(nextStep);
    setItemIndex(nextItem);
    setShowMissing(false);
    setShowResult(false);
  }

  function reset() {
    setAnswers({});
    setStepIndex(0);
    setItemIndex(0);
    setShowResult(false);
  }

  if (showResult) {
    return <ResultView answers={answers} onBack={() => setShowResult(false)} onReset={reset} />;
  }

  return (
    <main className="edema-shell">
      <div className="edema-ambient" />
      <div className="edema-app">
        <ProgressHeader percent={percent} confirmed={confirmed} total={physicalItems.length} onShowMissing={() => setShowMissing(true)} />
        <nav className="edema-topnav">
          <Link href="/" aria-label="Medical Hubへ戻る">← <span>MEDICAL HUB</span></Link>
          <div><b>BED·SIDE</b><span>EXAMINATION NAVIGATOR</span></div>
          <button onClick={() => setShowResult(true)}>結果</button>
        </nav>

        <section className="edema-stage">
          <div className="edema-step-meta">
            <span>STEP {currentStep.number}</span>
            <div>{stepIndex + 1} / {steps.length}</div>
          </div>
          <h1>{currentStep.title} <em>{currentStep.english}</em></h1>
          <p>{currentStep.description}</p>
          <div className="edema-dots" aria-label={`${currentStep.title} ${itemIndex + 1}/${currentStep.items.length}`}>
            {currentStep.items.map((item, index) => (
              <button
                key={item.id}
                aria-label={`${item.label}へ移動`}
                className={`${index === itemIndex ? "current" : ""} ${answers[item.id] && answers[item.id] !== "unknown" ? "done" : ""}`}
                onClick={() => setItemIndex(index)}
              />
            ))}
          </div>

          {hasRedFlag && stepIndex === 0 && (
            <div className="edema-warning">
              <strong>緊急評価を優先してください</strong>
              <p>該当するRed Flagがあります。診察ナビゲーションを続ける場合も、救急対応を遅らせないでください。</p>
            </div>
          )}

          <FindingCard item={currentItem} answer={answers[currentItem.id]} onAnswer={answer} onInfo={() => currentItem.guide && setGuide(currentItem)} />

          <div className="edema-navigation">
            <button
              disabled={stepIndex === 0 && itemIndex === 0}
              onClick={() => {
                if (itemIndex > 0) setItemIndex(itemIndex - 1);
                else {
                  setStepIndex(stepIndex - 1);
                  setItemIndex(steps[stepIndex - 1].items.length - 1);
                }
              }}
            >
              ← 戻る
            </button>
            <span>{itemIndex + 1} / {currentStep.items.length}</span>
            <button onClick={() => {
              if (itemIndex < currentStep.items.length - 1) setItemIndex(itemIndex + 1);
              else if (stepIndex < steps.length - 1) {
                setStepIndex(stepIndex + 1);
                setItemIndex(0);
              } else setShowResult(true);
            }}>
              スキップ →
            </button>
          </div>
        </section>
        <footer>検査値ではなく、まず患者を診る。</footer>
      </div>
      {guide?.guide && <InfoGuide label={guide.label} guide={guide.guide} onClose={() => setGuide(null)} />}
      {showMissing && <MissingPanel answers={answers} onJump={jumpTo} onClose={() => setShowMissing(false)} />}
    </main>
  );
}
