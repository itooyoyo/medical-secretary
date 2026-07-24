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
import {
  buildDifferential,
  calculateWells,
  interpretAlbumin,
  interpretBnp,
  interpretCrp,
  type LabValues,
  type WellsInput,
} from "./algorithm";
import { sourceMap } from "./evidence";

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

const emptyWells: WellsInput = {
  activeCancer: false, paralysisOrCast: false, bedriddenOrSurgery: false,
  deepVeinTenderness: false, entireLegSwollen: false, calfDifference3cm: false,
  unilateralPitting: false, collateralVeins: false, previousDvt: false,
  alternativeLikely: false,
};

function EvidenceInputs({
  labs,
  setLabs,
  wells,
  setWells,
}: {
  labs: LabValues;
  setLabs: (labs: LabValues) => void;
  wells: WellsInput;
  setWells: (wells: WellsInput) => void;
}) {
  const fields: Array<[keyof LabValues, string, string]> = [
    ["age", "年齢", "歳"], ["bnp", "BNP", "pg/mL"], ["ntProBnp", "NT-proBNP", "pg/mL"],
    ["albumin", "Alb", "g/dL"], ["creatinine", "Cr", "mg/dL"], ["egfr", "eGFR", "mL/min/1.73㎡"],
    ["urineProteinCr", "尿蛋白/Cr比", "g/gCr"], ["crp", "CRP", "mg/dL"],
    ["tsh", "TSH", "μIU/mL"], ["ft4", "FT4", "ng/dL"],
  ];
  const wellsLabels: Array<[keyof WellsInput, string, string]> = [
    ["activeCancer", "活動性悪性腫瘍", "+1"],
    ["paralysisOrCast", "下肢麻痺・不全麻痺・ギプス固定", "+1"],
    ["bedriddenOrSurgery", "3日以上臥床／12週以内の大手術", "+1"],
    ["deepVeinTenderness", "深部静脈走行に沿う圧痛", "+1"],
    ["entireLegSwollen", "下肢全体の腫脹", "+1"],
    ["calfDifference3cm", "下腿周径差3cm以上", "+1"],
    ["unilateralPitting", "患側に限局する圧痕性浮腫", "+1"],
    ["collateralVeins", "側副表在静脈（非静脈瘤性）", "+1"],
    ["previousDvt", "DVT既往", "+1"],
    ["alternativeLikely", "DVTと同程度以上に考えやすい別診断", "−2"],
  ];
  const wellsResult = calculateWells(wells);
  const updateLab = (key: keyof LabValues, raw: string) =>
    setLabs({ ...labs, [key]: raw === "" ? undefined : Number(raw) });

  return (
    <section className="edema-input-panel" aria-label="必要時検査入力">
      <div className="edema-section-title">
        <div><span>OPTIONAL DATA</span><h2>必要時のみ検査</h2></div>
        <b>未入力は陰性扱いしません</b>
      </div>
      <div className="edema-number-grid">
        {fields.map(([key, label, unit]) => (
          <label key={key}>
            <span>{label}</span>
            <div><input aria-label={label} type="number" min="0" step="any" value={labs[key] ?? ""} onChange={(event) => updateLab(key, event.target.value)} /><small>{unit}</small></div>
          </label>
        ))}
      </div>
      <div className="edema-lab-badges">
        {[interpretBnp(labs), interpretAlbumin(labs.albumin), interpretCrp(labs.crp)].map((result, index) => (
          <div key={index} data-status={result.status}><strong>{["BNP", "Alb", "CRP"][index]}：{result.label}</strong><span>{result.detail}</span></div>
        ))}
      </div>
      <details className="edema-wells">
        <summary><span>DVT Wells score（2-level）</span><b>{wellsResult.score}点・{wellsResult.category}</b></summary>
        <p>NICE掲載の検証済み項目を改変せず使用。スコア単独で診断しません。</p>
        <div>
          {wellsLabels.map(([key, label, points]) => (
            <label key={key}><input type="checkbox" checked={wells[key]} onChange={(event) => setWells({ ...wells, [key]: event.target.checked })} /><span>{label}</span><b>{points}</b></label>
          ))}
        </div>
      </details>
    </section>
  );
}

function ResultView({
  answers,
  labs,
  setLabs,
  wells,
  setWells,
  onBack,
  onReset,
}: {
  answers: Answers;
  labs: LabValues;
  setLabs: (labs: LabValues) => void;
  wells: WellsInput;
  setWells: (wells: WellsInput) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const candidates = buildDifferential(answers, labs).slice(0, 4);
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
      <EvidenceInputs labs={labs} setLabs={setLabs} wells={wells} setWells={setWells} />
      <div className="edema-section-title edema-basis-title">
        <div><span>EVIDENCE-BASED DIFFERENTIAL</span><h2>判断根拠</h2></div>
        <Link href="/bedside-edema/references">参考文献 →</Link>
      </div>
      {candidates.map((candidate, index) => (
        <article className="edema-result-card" key={candidate.id} data-differential-id={candidate.id}>
          <span className="edema-rank">0{index + 1}</span>
          <h2>{candidate.name}</h2>
          <dl>
            <div><dt>支持所見</dt><dd>{candidate.support.length ? candidate.support.join("・") : "現時点で明確な支持所見なし"}</dd></div>
            <div><dt>反対所見</dt><dd>{candidate.against.length ? candidate.against.join("・") : "確認された明確な反対所見なし"}</dd></div>
            <div><dt>未確認所見</dt><dd>{candidate.missing.length ? candidate.missing.join("・") : "主要項目は確認済み"}</dd></div>
            <div><dt>推奨する次の評価</dt><dd>{candidate.next}</dd></div>
            <div><dt>必要なら推奨検査</dt><dd>{candidate.tests}</dd></div>
            <div><dt>参考情報源</dt><dd className="edema-sources">{candidate.sourceIds.map((sourceId) => {
              const source = sourceMap[sourceId];
              return <a key={sourceId} href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher}, {source.year}</a>;
            })}</dd></div>
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
  const [labs, setLabs] = useState<LabValues>({});
  const [wells, setWells] = useState<WellsInput>(emptyWells);

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
    setLabs({});
    setWells(emptyWells);
  }

  function reset() {
    setAnswers({});
    setStepIndex(0);
    setItemIndex(0);
    setShowResult(false);
  }

  if (showResult) {
    return <ResultView answers={answers} labs={labs} setLabs={setLabs} wells={wells} setWells={setWells} onBack={() => setShowResult(false)} onReset={reset} />;
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
