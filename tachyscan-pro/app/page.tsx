"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Hemodynamics = {
  hypotension?: boolean;
  shock?: boolean;
  chestPain?: boolean;
  consciousness?: boolean;
  heartFailure?: boolean;
};

type Data = {
  pulse: "present" | "absent" | null;
  hemodynamicsStable: boolean | null;
  hemodynamics: Hemodynamics;
  heartRate: string;
  qrsWidth: "narrow" | "wide" | null;
  rhythm: "regular" | "irregular" | null;
  pWave: "present" | "absent" | "unclear" | null;
  vtFindings: Record<string, boolean>;
  vtDuration: "nonSustained" | "sustained" | null;
  backgrounds: Record<string, boolean>;
};

type Diagnosis = {
  category: string;
  candidates: string[];
  why: string;
  next: string;
  miss: string;
  action: string[];
  risk: "medium" | "high" | "critical";
};

const initialData: Data = {
  pulse: null,
  hemodynamicsStable: null,
  hemodynamics: {},
  heartRate: "",
  qrsWidth: null,
  rhythm: null,
  pWave: null,
  vtFindings: {},
  vtDuration: null,
  backgrounds: {},
};

const guideMessages = [
  "血行動態が不安定なら、診断分類より初期対応を優先しましょう。",
  "QRS幅を確認しましょう。WideかNarrowかで考え方が変わります。",
  "規則性を確認すると鑑別が絞れます。",
  "12誘導心電図でP波や房室関係を確認しましょう。",
  "Wide QRS頻拍ではVTも考慮し、臨床所見と合わせて評価しましょう。",
  "診断結果は参考情報です。患者さん全体の情報と合わせて判断してください。",
];

const hemodynamicItems = [
  { id: "hypotension", label: "血圧低下" },
  { id: "shock", label: "ショック" },
  { id: "chestPain", label: "胸痛" },
  { id: "consciousness", label: "意識障害" },
  { id: "heartFailure", label: "心不全" },
] as const;

const vtItems = [
  { id: "avDissociation", label: "房室解離" },
  { id: "captureBeat", label: "捕捉収縮" },
  { id: "fusionBeat", label: "融合収縮" },
  { id: "extremeAxis", label: "極端な軸偏位" },
] as const;

const backgroundItems = [
  { id: "fever", label: "発熱" },
  { id: "sepsis", label: "敗血症" },
  { id: "dehydration", label: "脱水" },
  { id: "bleeding", label: "出血" },
  { id: "dka", label: "DKA/HHS" },
  { id: "pe", label: "肺塞栓" },
  { id: "thyroid", label: "甲状腺中毒症" },
  { id: "drugs", label: "薬剤・刺激物" },
] as const;

function hasHemodynamicRedFlag(data: Data) {
  return data.pulse === "absent" || Object.values(data.hemodynamics).some(Boolean);
}

function hasWideQrsConcern(data: Data) {
  return data.qrsWidth === "wide";
}

function getDiagnosis(data: Data): Diagnosis {
  const hr = Number.parseInt(data.heartRate, 10) || 0;
  const hasBackground = Object.values(data.backgrounds).some(Boolean);
  const vtCount = Object.values(data.vtFindings).filter(Boolean).length;

  if (data.pulse === "absent") {
    return {
      category: "無脈性VT/VFを含む心停止対応",
      candidates: ["無脈性VT", "VF", "心停止"],
      why: "脈が触れない頻拍では分類より蘇生対応が優先されます。",
      next: "CPR、除細動器装着、救急チーム要請を並行して進めます。",
      miss: "脈拍確認に時間をかけすぎないことが重要です。",
      action: ["CPRを開始", "AED/除細動器を装着", "救急・循環器チームを要請"],
      risk: "critical",
    };
  }

  if (Object.values(data.hemodynamics).some(Boolean)) {
    return {
      category: "血行動態不安定な頻脈",
      candidates: ["不安定頻脈", "VTを含む重症頻脈"],
      why: "血圧低下、ショック、胸痛、意識障害、心不全は緊急対応を要する所見です。",
      next: "モニター、酸素、静脈路を確保し、同期カルディオバージョンを検討します。",
      miss: "診断名の確定を待つと初期対応が遅れる可能性があります。",
      action: ["モニター・酸素・静脈路を確保", "同期カルディオバージョンを検討", "循環器へ緊急相談"],
      risk: "critical",
    };
  }

  if (data.qrsWidth === "wide" && data.rhythm === "regular") {
    return {
      category: "Wide QRS + 規則的",
      candidates: ["心室頻拍（VT）", "脚ブロックを伴うSVT", "WPW関連頻拍"],
      why: vtCount > 0 ? "VTを示唆する所見があり、VTとして扱う必要性が高まります。" : "Wide QRS頻拍ではVTを最後まで除外しない姿勢が安全です。",
      next: "12誘導心電図で房室解離、捕捉収縮、融合収縮、軸偏位を確認します。",
      miss: "血行動態が保たれていてもVTは否定できません。",
      action: data.vtDuration === "sustained" ? ["VTとして対応", "循環器へ緊急相談", "電気的治療を検討"] : ["VTとして評価継続", "電解質・心エコーを確認", "循環器相談を検討"],
      risk: data.vtDuration === "sustained" ? "critical" : "high",
    };
  }

  if (data.qrsWidth === "wide" && data.rhythm === "irregular") {
    return {
      category: "Wide QRS + 不規則",
      candidates: ["AF with WPW", "多形性VT", "Torsades de Pointes"],
      why: "Wide QRSかつ不規則な頻拍では致死的不整脈や副伝導路の関与を考えます。",
      next: "12誘導心電図、QT、K/Mg、薬剤歴を確認します。",
      miss: "AF with WPWでは通常の房室結節抑制薬が危険になる場合があります。",
      action: ["緊急対応の準備", "電解質とQTを確認", "循環器へ緊急相談"],
      risk: "critical",
    };
  }

  if (data.qrsWidth === "narrow" && data.rhythm === "irregular") {
    return {
      category: "Narrow QRS + 不規則",
      candidates: ["心房細動", "心房粗動（可変伝導）", "多源性心房頻拍"],
      why: "狭QRSで不規則なら上室性頻拍を中心に考えます。",
      next: "12誘導心電図でf波、flutter波、P波形のばらつきを確認します。",
      miss: "不安定化、WPW合併、抗凝固の必要性を見落とさないことが重要です。",
      action: ["原因と持続時間を確認", "レートコントロールを検討", "血栓塞栓リスクを評価"],
      risk: "medium",
    };
  }

  if (data.qrsWidth === "narrow" && data.rhythm === "regular") {
    const afl = hr >= 140 && hr <= 160;
    const sinusFirst = data.pWave === "present" && hasBackground;
    return {
      category: "Narrow QRS + 規則的",
      candidates: sinusFirst ? ["洞性頻脈", "AVNRT", "AVRT", "心房粗動2:1伝導"] : ["AVNRT", "AVRT", "洞性頻脈", "心房粗動2:1伝導"],
      why: sinusFirst ? "P波と背景疾患があり、頻脈が代償反応の可能性があります。" : "狭QRSで規則的なら上室性頻拍を中心に整理します。",
      next: afl ? "150/分前後ならII・III・aVF・V1でflutter波を確認します。" : "P波の位置、RP間隔、発作性かどうかを確認します。",
      miss: "洞性頻脈では背景疾患の検索を優先します。",
      action: sinusFirst ? ["背景疾患を評価", "原因治療を優先", "SVT所見があれば追加評価"] : ["迷走神経刺激を検討", "12誘導心電図を確認", "薬物治療は適応を確認"],
      risk: "medium",
    };
  }

  return {
    category: "評価未完了",
    candidates: ["追加情報が必要"],
    why: "QRS幅、規則性、12誘導所見が揃うと鑑別を整理できます。",
    next: "未入力の項目を順番に確認します。",
    miss: "血行動態不安定とWide QRSは先に確認します。",
    action: ["血行動態を確認", "QRS幅を確認", "規則性を確認"],
    risk: "medium",
  };
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(initialData);

  const diagnosis = useMemo(() => getDiagnosis(data), [data]);
  const redFlags = useMemo(() => {
    const items = [];
    if (data.pulse === "absent") items.push("脈なし");
    hemodynamicItems.forEach((item) => {
      if (data.hemodynamics[item.id]) items.push(item.label);
    });
    if (data.qrsWidth === "wide") items.push("Wide QRS頻拍");
    if (data.qrsWidth === "wide" && (data.rhythm || Object.values(data.vtFindings).some(Boolean))) items.push("VT疑い");
    return items;
  }, [data]);

  const updateData = (updates: Partial<Data>) => setData((prev) => ({ ...prev, ...updates }));
  const reset = () => {
    setStep(0);
    setData(initialData);
    setStarted(false);
  };

  const toggleHemo = (id: keyof Hemodynamics) => {
    updateData({
      hemodynamicsStable: false,
      hemodynamics: { ...data.hemodynamics, [id]: !data.hemodynamics[id] },
    });
  };

  const toggleRecord = (field: "vtFindings" | "backgrounds", id: string) => {
    updateData({
      [field]: { ...data[field], [id]: !data[field][id] },
    } as Partial<Data>);
  };

  const goNext = () => setStep((current) => Math.min(5, current + 1));
  const goBack = () => setStep((current) => Math.max(0, current - 1));
  const currentMessage = started ? guideMessages[step] : "まず血行動態から確認しましょう。";

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-[calc(88px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))] sm:px-6 lg:pb-12">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Dr. Ito Medical Apps</p>
            <h1>TachyScan Pro</h1>
            <p className="lead">血行動態・QRS幅・規則性から頻脈を整理します</p>
            <button
              type="button"
              className="primary-action"
              onClick={() => {
                setStarted(true);
                setStep(0);
              }}
            >
              評価を開始
            </button>
          </div>
          <GuideCharacter message={currentMessage} />
        </section>

        {redFlags.length > 0 && (
          <section className="red-flag-card" aria-live="polite">
            <p className="section-label">Red Flag</p>
            <h2>{redFlags.join(" / ")}</h2>
            <p>危険所見があります。早めに再評価し、必要なら緊急対応を検討してください。</p>
          </section>
        )}

        {started && (
          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <StepIntro step={step} />
              <div className="mt-5">{renderStep()}</div>
            </div>

            <aside className="space-y-4">
              <div className="input-card">
                <p className="section-label text-slate-600">入力サマリー</p>
                <dl className="summary-list">
                  <div><dt>HR</dt><dd>{data.heartRate || "未入力"} bpm</dd></div>
                  <div><dt>QRS</dt><dd>{data.qrsWidth === "wide" ? "Wide" : data.qrsWidth === "narrow" ? "Narrow" : "未選択"}</dd></div>
                  <div><dt>規則性</dt><dd>{data.rhythm === "regular" ? "規則的" : data.rhythm === "irregular" ? "不規則" : "未選択"}</dd></div>
                  <div><dt>P波</dt><dd>{data.pWave === "present" ? "あり" : data.pWave === "absent" ? "なし" : data.pWave === "unclear" ? "不明瞭" : "未選択"}</dd></div>
                </dl>
              </div>
              <ClinicalPearl />
            </aside>
          </section>
        )}
      </div>

      {started && (
        <nav className="bottom-nav">
          <button type="button" onClick={goBack} disabled={step === 0}>戻る</button>
          <button type="button" onClick={reset}>リセット</button>
          <button type="button" onClick={goNext} disabled={step === 5}>次へ</button>
        </nav>
      )}
    </main>
  );

  function renderStep() {
    if (step === 0) {
      return (
        <div className="input-card">
          <div className="field-group">
            <p className="field-title">脈拍</p>
            <div className="choice-grid">
              <Choice selected={data.pulse === "present"} onClick={() => updateData({ pulse: "present" })}>脈あり</Choice>
              <Choice selected={data.pulse === "absent"} danger onClick={() => updateData({ pulse: "absent" })}>脈なし</Choice>
            </div>
          </div>
          <div className="field-group">
            <p className="field-title">血行動態</p>
            <button
              type="button"
              className={`choice full ${data.hemodynamicsStable ? "selected" : ""}`}
              onClick={() => updateData({ hemodynamicsStable: true, hemodynamics: {} })}
            >
              血行動態は安定している
            </button>
            <div className="choice-grid">
              {hemodynamicItems.map((item) => (
                <Choice key={item.id} selected={!!data.hemodynamics[item.id]} danger onClick={() => toggleHemo(item.id)}>
                  {item.label}
                </Choice>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="input-card">
          <label className="field-title" htmlFor="heart-rate">心拍数</label>
          <input
            id="heart-rate"
            inputMode="numeric"
            min="0"
            className="number-input"
            value={data.heartRate}
            onChange={(event) => updateData({ heartRate: event.target.value.replace(/\D/g, "") })}
            placeholder="例: 150"
          />
          <p className="help-text">150/分前後の規則正しい頻拍では心房粗動2:1伝導を考えます。</p>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="input-card">
          <p className="field-title">QRS幅</p>
          <div className="choice-grid">
            <Choice selected={data.qrsWidth === "narrow"} onClick={() => updateData({ qrsWidth: "narrow" })}>Narrow QRS（120ms未満）</Choice>
            <Choice selected={data.qrsWidth === "wide"} danger onClick={() => updateData({ qrsWidth: "wide" })}>Wide QRS（120ms以上）</Choice>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="input-card">
          <p className="field-title">規則性</p>
          <div className="choice-grid">
            <Choice selected={data.rhythm === "regular"} onClick={() => updateData({ rhythm: "regular" })}>規則的</Choice>
            <Choice selected={data.rhythm === "irregular"} onClick={() => updateData({ rhythm: "irregular" })}>不規則</Choice>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="input-card">
          <p className="field-title">12誘導心電図</p>
          <div className="choice-grid">
            <Choice selected={data.pWave === "present"} onClick={() => updateData({ pWave: "present" })}>P波あり</Choice>
            <Choice selected={data.pWave === "absent"} onClick={() => updateData({ pWave: "absent" })}>P波なし</Choice>
            <Choice selected={data.pWave === "unclear"} onClick={() => updateData({ pWave: "unclear" })}>不明瞭</Choice>
          </div>
          <div className="field-group">
            <p className="field-title">背景疾患</p>
            <div className="choice-grid">
              {backgroundItems.map((item) => (
                <Choice key={item.id} selected={!!data.backgrounds[item.id]} onClick={() => toggleRecord("backgrounds", item.id)}>
                  {item.label}
                </Choice>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {hasWideQrsConcern(data) && (
          <div className="input-card">
            <p className="field-title">VT評価</p>
            <div className="choice-grid">
              {vtItems.map((item) => (
                <Choice key={item.id} selected={!!data.vtFindings[item.id]} danger onClick={() => toggleRecord("vtFindings", item.id)}>
                  {item.label}
                </Choice>
              ))}
            </div>
            <div className="mt-4 choice-grid">
              <Choice selected={data.vtDuration === "nonSustained"} onClick={() => updateData({ vtDuration: "nonSustained" })}>30秒未満</Choice>
              <Choice selected={data.vtDuration === "sustained"} danger onClick={() => updateData({ vtDuration: "sustained" })}>30秒以上</Choice>
            </div>
          </div>
        )}
        <Result diagnosis={diagnosis} data={data} />
      </div>
    );
  }
}

function GuideCharacter({ message }: { message: string }) {
  return (
    <div className="guide-wrap" aria-label="Guide Character">
      <div className="guide-bubble">
        <strong>Guide</strong>
        <span>{message}</span>
      </div>
      <Image
        src="/guide-character.png"
        alt="Dr. Ito Medical Apps Guide Character"
        width={180}
        height={180}
        priority
      />
    </div>
  );
}

function StepIntro({ step }: { step: number }) {
  const titles = [
    ["Step 0", "血行動態", "血行動態が不安定なら、診断分類より初期対応を優先しましょう。"],
    ["Step 1", "心拍数", "QRS幅を確認しましょう。WideかNarrowかで考え方が変わります。"],
    ["Step 2", "QRS幅", "規則性を確認すると鑑別が絞れます。"],
    ["Step 3", "規則性", "12誘導心電図でP波や房室関係を確認しましょう。"],
    ["Step 4", "12誘導心電図", "Wide QRS頻拍ではVTも考慮し、臨床所見と合わせて評価しましょう。"],
    ["Step 5", "初期対応", "診断結果は参考情報です。患者さん全体の情報と合わせて判断してください。"],
  ];
  const item = titles[step];
  return (
    <div className="step-intro">
      <p>{item[0]}</p>
      <h2>{item[1]}</h2>
      <span>{item[2]}</span>
    </div>
  );
}

function Choice({
  children,
  selected,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`choice ${selected ? "selected" : ""} ${danger ? "danger" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Result({ diagnosis, data }: { diagnosis: Diagnosis; data: Data }) {
  const riskLabel = diagnosis.risk === "critical" ? "緊急対応" : diagnosis.risk === "high" ? "高リスク" : "要評価";

  return (
    <section className="result-card">
      <p className="section-label text-slate-600">診断結果</p>
      <h2>{diagnosis.category}</h2>
      <p className={`risk-pill ${diagnosis.risk}`}>{riskLabel}</p>

      <div className="result-block">
        <h3>考える候補</h3>
        <ul>{diagnosis.candidates.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="result-grid">
        <div>
          <h3>なぜ考えるか</h3>
          <p>{diagnosis.why}</p>
        </div>
        <div>
          <h3>次に確認すること</h3>
          <p>{diagnosis.next}</p>
        </div>
        <div>
          <h3>見逃しポイント</h3>
          <p>{diagnosis.miss}</p>
        </div>
      </div>
      <div className="result-block">
        <h3>初期対応</h3>
        <ul>{diagnosis.action.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      {hasHemodynamicRedFlag(data) && (
        <p className="result-note">血行動態不安定では、鑑別の精密化より蘇生・循環管理を優先します。</p>
      )}
    </section>
  );
}

function ClinicalPearl() {
  const pearls = [
    "Wide QRS頻拍はVTとして扱うことを基本にする。",
    "150/分前後の規則正しい頻拍では心房粗動2:1伝導を考える。",
    "血行動態不安定なら診断分類より初期対応を優先する。",
    "洞性頻脈では背景疾患を探す。",
  ];

  return (
    <section className="clinical-pearl">
      <p className="section-label">Clinical Pearl</p>
      <p>判断に迷う場合は、見逃した場合のリスクが高い病態から優先して考えましょう。</p>
      <ul>{pearls.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
