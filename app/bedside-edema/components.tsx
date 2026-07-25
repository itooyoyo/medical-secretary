"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MedicalAlert,
  MedicalBadge,
  MedicalBottomNavigation,
  MedicalButton,
  MedicalCard,
  MedicalGuide,
  MedicalNumberInput,
  MedicalProgress,
  MedicalSpace,
} from "../components/medical-kit";
import {
  buildDifferential,
  calculateWells,
  interpretAlbumin,
  interpretBnp,
  interpretCrp,
  type Answers,
  type LabValues,
  type WellsInput,
} from "./algorithm";
import { redFlags } from "./data";
import { sourceMap } from "./evidence";

type Distribution = "unilateral" | "bilateral" | "generalized";
type Onset = "acute" | "chronic";

const emptyWells: WellsInput = {
  activeCancer: false,
  paralysisOrCast: false,
  bedriddenOrSurgery: false,
  deepVeinTenderness: false,
  entireLegSwollen: false,
  calfDifference3cm: false,
  unilateralPitting: false,
  collateralVeins: false,
  previousDvt: false,
  alternativeLikely: false,
};

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="station-section-heading">
      <span>{number}</span>
      <div><h2>{title}</h2><p>{description}</p></div>
    </div>
  );
}

function ChoiceGroup({
  label,
  options,
  selected,
  onSelect,
  multiple = false,
}: {
  label: string;
  options: Array<{ value: string; label: string; sub?: string }>;
  selected: string[];
  onSelect: (value: string) => void;
  multiple?: boolean;
}) {
  return (
    <fieldset className="station-question">
      <legend>{label}</legend>
      <div className="station-choice-grid">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.value)}
            >
              <span>{multiple ? (active ? "✓" : "＋") : active ? "◉" : "○"}</span>
              <b>{option.label}</b>
              {option.sub ? <small>{option.sub}</small> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function EvidenceResult({
  answers,
  labs,
}: {
  answers: Answers;
  labs: LabValues;
}) {
  const candidates = buildDifferential(answers, labs).slice(0, 4);
  const top = candidates[0];
  const bnp = interpretBnp(labs);
  const albumin = interpretAlbumin(labs.albumin);
  const crp = interpretCrp(labs.crp);

  return (
    <div className="station-results-stack">
      <MedicalGuide
        imageSrc="/edema-ai-guide.png"
        imageAlt="白い未来的装甲の浮腫診療AIナビゲーター"
        title="診療ガイド"
        tone="result"
      >
        {top.support.length
          ? `現時点では「${top.name}」を支持する所見が最も多いです。未確認所見を埋めて再評価してください。`
          : "まだ支持所見が十分ではありません。未確認の身体所見から確認しましょう。"}
      </MedicalGuide>

      {(labs.bnp != null || labs.ntProBnp != null || labs.albumin != null || labs.crp != null) && (
        <div className="station-lab-summary">
          {(labs.bnp != null || labs.ntProBnp != null) && (
            <MedicalAlert title={`BNP：${bnp.label}`} tone={bnp.status === "high" ? "warning" : "info"}>{bnp.detail}</MedicalAlert>
          )}
          {labs.albumin != null && labs.albumin < 3.5 && (
            <MedicalAlert title={`Alb：${albumin.label}`} tone={albumin.status === "high" ? "warning" : "info"}>{albumin.detail}</MedicalAlert>
          )}
          {labs.crp != null && (
            <MedicalAlert title={`CRP：${crp.label}`} tone={crp.status === "high" ? "warning" : "info"}>{crp.detail}</MedicalAlert>
          )}
        </div>
      )}

      {candidates.map((candidate, index) => (
        <MedicalCard key={candidate.id} className="station-result-card">
          <div className="station-result-head">
            <span>0{index + 1}</span>
            <div><MedicalBadge tone={index === 0 ? "cyan" : "muted"}>{index === 0 ? "LEADING" : "DIFFERENTIAL"}</MedicalBadge><h3>{candidate.name}</h3></div>
          </div>
          <dl>
            <div><dt>支持所見</dt><dd>{candidate.support.length ? candidate.support.join("・") : "明確な支持所見なし"}</dd></div>
            <div><dt>反対所見</dt><dd>{candidate.against.length ? candidate.against.join("・") : "明確な反対所見なし"}</dd></div>
            <div><dt>未確認所見</dt><dd>{candidate.missing.length ? candidate.missing.join("・") : "主要項目確認済み"}</dd></div>
            <div><dt>次の評価</dt><dd>{candidate.next}</dd></div>
            <div><dt>必要なら検査</dt><dd>{candidate.tests}</dd></div>
          </dl>
          <div className="station-source-row">
            {candidate.sourceIds.map((id) => (
              <a key={id} href={sourceMap[id].url} target="_blank" rel="noopener noreferrer">{sourceMap[id].publisher} {sourceMap[id].year}</a>
            ))}
          </div>
        </MedicalCard>
      ))}
    </div>
  );
}

export default function EdemaNavigator() {
  const [answers, setAnswers] = useState<Answers>({});
  const [labs, setLabs] = useState<LabValues>({});
  const [wells, setWells] = useState<WellsInput>(emptyWells);
  const [touched, setTouched] = useState<string[]>([]);

  const distribution = (answers.distribution as Distribution | undefined);
  const onset = (answers.onset as Onset | undefined);
  const isUnilateral = distribution === "unilateral";
  const isSystemic = distribution === "bilateral" || distribution === "generalized";
  const inflammatory = answers.erythema === "present" || answers.temperature === "warm" || answers.tenderness === "present";
  const redFlagCount = redFlags.filter((item) => answers[item.id] === "present").length;
  const visibleQuestionCount = 9 + (isUnilateral ? 3 : 0) + (isSystemic ? 1 : 0);
  const progress = Math.min(100, Math.round((new Set(touched).size / visibleQuestionCount) * 100));
  const wellsResult = calculateWells(wells);

  const setTouchedKey = (key: string) =>
    setTouched((current) => current.includes(key) ? current : [...current, key]);

  const setExclusive = (
    key: string,
    value: string,
    mappings: Record<string, Record<string, string>>,
  ) => {
    setAnswers((current) => ({ ...current, [key]: value, ...mappings[value] }));
    setTouchedKey(key);
  };

  const toggle = (id: string, onValue = "present") => {
    setAnswers((current) => ({ ...current, [id]: current[id] === onValue ? "absent" : onValue }));
  };

  const toggleGroup = (group: string, id: string, onValue = "present") => {
    toggle(id, onValue);
    setTouchedKey(group);
  };

  const resultCount = useMemo(() => buildDifferential(answers, labs).filter((item) => item.score > 0).length, [answers, labs]);

  return (
    <MedicalSpace className="station-shell">
      <div className="station-container">
        <header className="station-topbar">
          <Link href="/" aria-label="Medical Hubへ戻る">← HUB</Link>
          <div><b>MEDICAL SPACE STATION</b><span>BED·SIDE MODULE / EDEMA</span></div>
          <MedicalBadge>v1.2</MedicalBadge>
        </header>

        <MedicalProgress value={progress} label="入力完了率" />

        <MedicalCard className="station-hero">
          <div className="station-hero-copy">
            <MedicalBadge>GENERAL PRACTICE · 60 SEC</MedicalBadge>
            <h1>Bedside Edema<br />Navigator</h1>
            <p>身体診察と最小限の検査から浮腫を鑑別します</p>
          </div>
          <MedicalGuide
            className="station-hero-guide"
            imageSrc="/edema-ai-guide.png"
            imageAlt="白い未来的装甲の浮腫診療AIナビゲーター"
            title="診療ガイド"
          >
            <p>浮腫診療を開始します。</p>
            <p>まず浮腫の分布を選択してください。</p>
            <p>必要な項目のみ表示します。</p>
          </MedicalGuide>
        </MedicalCard>

        <section id="distribution" className="station-section">
          <SectionHeading number="01" title="分布" description="緊急所見・分布・時間軸を一度だけ確認" />
          <MedicalCard className="station-panel">
            <ChoiceGroup
              label="Red Flags（該当するものを選択）"
              multiple
              selected={redFlags.filter((item) => answers[item.id] === "present").map((item) => item.id)}
              onSelect={(id) => toggleGroup("redflags", id)}
              options={redFlags.map((item) => ({ value: item.id, label: item.label }))}
            />
            {redFlagCount > 0 && (
              <div className="station-character-alert">
                <MedicalGuide
                  imageSrc="/edema-ai-guide.png"
                  imageAlt="白い未来的装甲の浮腫診療AIナビゲーター"
                  title="緊急診療ガイド"
                  tone="warning"
                >
                  Red Flagを{redFlagCount}件検出。入力継続より緊急評価を優先してください。
                </MedicalGuide>
                <MedicalAlert title="緊急評価を優先" tone="danger">救急対応を遅らせないでください。</MedicalAlert>
              </div>
            )}
            <ChoiceGroup
              label="浮腫の分布"
              selected={distribution ? [distribution] : []}
              onSelect={(value) => setExclusive("distribution", value, {
                unilateral: { unilateral: "present", bilateral: "absent" },
                bilateral: { unilateral: "absent", bilateral: "present" },
                generalized: { unilateral: "absent", bilateral: "present", face: "present", sacral: "present" },
              })}
              options={[
                { value: "unilateral", label: "片側", sub: "一方の下肢" },
                { value: "bilateral", label: "両側", sub: "両下肢" },
                { value: "generalized", label: "全身", sub: "顔・体幹を含む" },
              ]}
            />
            <ChoiceGroup
              label="発症・経過"
              selected={onset ? [onset] : []}
              onSelect={(value) => setExclusive("onset", value, {
                acute: { "history-1": "present", "history-2": "absent" },
                chronic: { "history-1": "absent", "history-2": "present" },
              })}
              options={[
                { value: "acute", label: "急性", sub: "3日以内を目安" },
                { value: "chronic", label: "慢性", sub: "3日超・反復" },
              ]}
            />
          </MedicalCard>
        </section>

        <section id="physical" className="station-section">
          <SectionHeading number="02" title="身体所見" description="LOOK・FEEL・MOVE・GENERALを重複なく統合" />
          <MedicalCard className="station-panel">
            <ChoiceGroup
              label="圧痕"
              selected={answers.pitting ? [answers.pitting] : []}
              onSelect={(value) => { setAnswers((current) => ({ ...current, pitting: value })); setTouchedKey("pitting"); }}
              options={[
                { value: "present", label: "圧痕あり" },
                { value: "absent", label: "圧痕なし" },
                { value: "unknown", label: "未確認" },
              ]}
            />
            <ChoiceGroup
              label="浮腫部位（複数選択）"
              multiple
              selected={["dorsum", "face", "eyelid", "sacral"].filter((id) => answers[id] === "present")}
              onSelect={(id) => toggleGroup("sites", id)}
              options={[
                { value: "dorsum", label: "足背・足趾" },
                { value: "sacral", label: "仙骨" },
                { value: "face", label: "顔面" },
                { value: "eyelid", label: "眼瞼" },
              ]}
            />
            <ChoiceGroup
              label="皮膚・静脈所見（複数選択）"
              multiple
              selected={["pigmentation", "venous-distension", "induration", "ulcer", "erythema", "stemmer"].filter((id) => answers[id] === "present")}
              onSelect={(id) => toggleGroup("skin", id)}
              options={[
                { value: "pigmentation", label: "色素沈着" },
                { value: "venous-distension", label: "静脈瘤・怒張" },
                { value: "induration", label: "皮膚肥厚・硬化" },
                { value: "ulcer", label: "皮膚潰瘍" },
                { value: "erythema", label: "発赤" },
                { value: "stemmer", label: "Stemmer陽性" },
              ]}
            />

            {isUnilateral && (
              <div className="station-conditional" data-condition="unilateral">
                <MedicalBadge tone="amber">片側性のため追加表示</MedicalBadge>
                <ChoiceGroup
                  label="炎症・血栓を示唆する局所所見"
                  multiple
                  selected={[
                    answers.temperature === "warm" ? "temperature" : "",
                    answers.tenderness === "present" ? "tenderness" : "",
                  ].filter(Boolean)}
                  onSelect={(id) => toggleGroup("local-signs", id, id === "temperature" ? "warm" : "present")}
                  options={[
                    { value: "temperature", label: "熱感" },
                    { value: "tenderness", label: "圧痛" },
                  ]}
                />
                <ChoiceGroup
                  label="下腿周径差"
                  selected={answers["calf-difference"] ? [answers["calf-difference"]] : []}
                  onSelect={(value) => { setAnswers((current) => ({ ...current, "calf-difference": value })); setTouchedKey("calf"); }}
                  options={[
                    { value: "large", label: "3cm以上" },
                    { value: "normal", label: "3cm未満" },
                    { value: "unknown", label: "未測定" },
                  ]}
                />
                <ChoiceGroup
                  label="関節・筋骨格所見（複数選択）"
                  multiple
                  selected={["rom", "baker", "weight-bearing"].filter((id) => answers[id] === "present")}
                  onSelect={(id) => toggleGroup("musculoskeletal", id)}
                  options={[
                    { value: "rom", label: "ROM制限" },
                    { value: "baker", label: "Baker嚢胞疑い" },
                    { value: "weight-bearing", label: "荷重痛" },
                  ]}
                />
              </div>
            )}

            {isSystemic && (
              <div className="station-conditional" data-condition="systemic">
                <MedicalBadge>両側・全身性のため追加表示</MedicalBadge>
                <ChoiceGroup
                  label="全身うっ血所見（複数選択）"
                  multiple
                  selected={["jvd", "crackles", "s3", "ascites", "hepatomegaly"].filter((id) => answers[id] === "present")}
                  onSelect={(id) => toggleGroup("systemic-signs", id)}
                  options={[
                    { value: "jvd", label: "頸静脈怒張" },
                    { value: "crackles", label: "肺ラ音" },
                    { value: "s3", label: "Ⅲ音" },
                    { value: "ascites", label: "腹水" },
                    { value: "hepatomegaly", label: "肝腫大" },
                  ]}
                />
              </div>
            )}
          </MedicalCard>
        </section>

        <section id="background" className="station-section">
          <SectionHeading number="03" title="背景" description="時間変化とリスク因子をまとめて確認" />
          <MedicalCard className="station-panel">
            <ChoiceGroup
              label="変動パターン（複数選択）"
              multiple
              selected={["history-3", "history-4", "history-5"].filter((id) => answers[id] === "present")}
              onSelect={(id) => toggleGroup("pattern", id)}
              options={[
                { value: "history-3", label: "夕方・日内変動" },
                { value: "history-4", label: "挙上で改善" },
                { value: "history-5", label: "長時間立位で悪化" },
              ]}
            />
            <ChoiceGroup
              label="関連する背景（複数選択）"
              multiple
              selected={["history-6", "history-7", "history-8", "history-9", "history-10"].filter((id) => answers[id] === "present")}
              onSelect={(id) => toggleGroup("background", id)}
              options={[
                { value: "history-6", label: "長距離移動・臥床" },
                { value: "history-7", label: "最近の手術" },
                { value: "history-8", label: "悪性腫瘍" },
                { value: "history-9", label: "放射線治療" },
                { value: "history-10", label: "リンパ節郭清" },
              ]}
            />
            <ChoiceGroup
              label="薬剤開始・増量"
              selected={answers["history-11"] ? [answers["history-11"]] : []}
              onSelect={(value) => { setAnswers((current) => ({ ...current, "history-11": value })); setTouchedKey("medication"); }}
              options={[
                { value: "present", label: "あり" },
                { value: "absent", label: "なし" },
                { value: "unknown", label: "不明" },
              ]}
            />
          </MedicalCard>
        </section>

        <section id="labs" className="station-section">
          <SectionHeading number="04" title="検査値" description="身体所見で必要と判断した項目だけ入力" />
          <MedicalCard className="station-panel">
            <MedicalAlert title="検査は任意です" tone="info">未入力は陰性・正常として扱いません。</MedicalAlert>
            <div className="station-number-grid">
              <MedicalNumberInput label="Alb" unit="g/dL" value={labs.albumin} onChange={(albumin) => setLabs({ ...labs, albumin })} />
              <MedicalNumberInput label="Cr" unit="mg/dL" value={labs.creatinine} onChange={(creatinine) => setLabs({ ...labs, creatinine })} />
              <MedicalNumberInput label="eGFR" unit="mL/min/1.73㎡" value={labs.egfr} onChange={(egfr) => setLabs({ ...labs, egfr })} />
              <MedicalNumberInput label="尿蛋白/Cr比" unit="g/gCr" value={labs.urineProteinCr} onChange={(urineProteinCr) => setLabs({ ...labs, urineProteinCr })} />
              <MedicalNumberInput label="TSH" unit="μIU/mL" value={labs.tsh} onChange={(tsh) => setLabs({ ...labs, tsh })} />
              <MedicalNumberInput label="FT4" unit="ng/dL" value={labs.ft4} onChange={(ft4) => setLabs({ ...labs, ft4 })} />
              {isSystemic && <>
                <MedicalNumberInput label="年齢" unit="歳" value={labs.age} onChange={(age) => setLabs({ ...labs, age })} />
                <MedicalNumberInput label="BNP" unit="pg/mL" value={labs.bnp} onChange={(bnp) => setLabs({ ...labs, bnp })} />
                <MedicalNumberInput label="NT-proBNP" unit="pg/mL" value={labs.ntProBnp} onChange={(ntProBnp) => setLabs({ ...labs, ntProBnp })} />
              </>}
              {isUnilateral && <MedicalNumberInput label="D-dimer" unit="μg/mL" value={labs.dDimer} onChange={(dDimer) => setLabs({ ...labs, dDimer })} />}
              {isUnilateral && inflammatory && <MedicalNumberInput label="CRP" unit="mg/dL" value={labs.crp} onChange={(crp) => setLabs({ ...labs, crp })} />}
            </div>
            {labs.albumin != null && labs.albumin < 3.5 && (
              <MedicalAlert title={interpretAlbumin(labs.albumin).label} tone="warning">{interpretAlbumin(labs.albumin).detail}</MedicalAlert>
            )}
            {isUnilateral && (
              <details className="station-wells">
                <summary><span>DVT Wells score</span><b>{wellsResult.score}点 · {wellsResult.category}</b></summary>
                <p>NICEの2-level DVT Wellsを改変せず使用します。</p>
                {([
                  ["activeCancer", "活動性悪性腫瘍", "+1"],
                  ["paralysisOrCast", "下肢麻痺・不全麻痺・ギプス", "+1"],
                  ["bedriddenOrSurgery", "3日以上臥床／12週以内の大手術", "+1"],
                  ["deepVeinTenderness", "深部静脈走行の圧痛", "+1"],
                  ["entireLegSwollen", "下肢全体の腫脹", "+1"],
                  ["calfDifference3cm", "下腿周径差3cm以上", "+1"],
                  ["unilateralPitting", "患側限局の圧痕性浮腫", "+1"],
                  ["collateralVeins", "側副表在静脈", "+1"],
                  ["previousDvt", "DVT既往", "+1"],
                  ["alternativeLikely", "別診断が同程度以上に考えやすい", "−2"],
                ] as Array<[keyof WellsInput, string, string]>).map(([key, label, point]) => (
                  <label key={key}><input type="checkbox" checked={wells[key]} onChange={(event) => setWells({ ...wells, [key]: event.target.checked })} /><span>{label}</span><b>{point}</b></label>
                ))}
              </details>
            )}
          </MedicalCard>
        </section>

        <section id="results" className="station-section station-results">
          <SectionHeading number="05" title="結果" description={`${resultCount || "未"}候補を所見と根拠から整理`} />
          <EvidenceResult answers={answers} labs={labs} />
          <div className="station-result-actions">
            <Link href="/bedside-edema/references">References</Link>
            <MedicalButton onClick={() => { setAnswers({}); setLabs({}); setWells(emptyWells); setTouched([]); }}>入力をリセット</MedicalButton>
          </div>
        </section>
      </div>

      <MedicalBottomNavigation items={[
        { href: "#distribution", icon: "◎", label: "分布" },
        { href: "#physical", icon: "✦", label: "所見" },
        { href: "#background", icon: "◇", label: "背景" },
        { href: "#labs", icon: "＋", label: "検査" },
        { href: "#results", icon: "⌁", label: "結果" },
      ]} />
    </MedicalSpace>
  );
}
