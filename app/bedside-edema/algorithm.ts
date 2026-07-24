import { allItems } from "./data";

export type Answers = Record<string, string | undefined>;

export type LabValues = {
  age?: number;
  bnp?: number;
  ntProBnp?: number;
  albumin?: number;
  creatinine?: number;
  egfr?: number;
  urineProteinCr?: number;
  crp?: number;
  dDimer?: number;
  tsh?: number;
  ft4?: number;
};

export type WellsInput = {
  activeCancer: boolean;
  paralysisOrCast: boolean;
  bedriddenOrSurgery: boolean;
  deepVeinTenderness: boolean;
  entireLegSwollen: boolean;
  calfDifference3cm: boolean;
  unilateralPitting: boolean;
  collateralVeins: boolean;
  previousDvt: boolean;
  alternativeLikely: boolean;
};

export type Differential = {
  id: string;
  name: string;
  score: number;
  support: string[];
  against: string[];
  missing: string[];
  next: string;
  tests: string;
  sourceIds: string[];
};

export type LabInterpretation = {
  status: "unmeasured" | "low" | "intermediate" | "high" | "caution";
  label: string;
  detail: string;
};

const present = (answers: Answers, id: string) =>
  ["present", "warm", "large", "high", "reduced", "difficult"].includes(answers[id] ?? "");
const absent = (answers: Answers, id: string) =>
  ["absent", "normal"].includes(answers[id] ?? "");
const labelFor = (id: string) => allItems.find((item) => item.id === id)?.label ?? id;

export function calculateWells(input: WellsInput) {
  const positive = [
    input.activeCancer,
    input.paralysisOrCast,
    input.bedriddenOrSurgery,
    input.deepVeinTenderness,
    input.entireLegSwollen,
    input.calfDifference3cm,
    input.unilateralPitting,
    input.collateralVeins,
    input.previousDvt,
  ].filter(Boolean).length;
  const score = positive - (input.alternativeLikely ? 2 : 0);
  return { score, category: score >= 2 ? "DVT likely" : "DVT unlikely" };
}

export function interpretBnp(labs: LabValues): LabInterpretation {
  if (labs.bnp == null && labs.ntProBnp == null) {
    return { status: "unmeasured", label: "未測定", detail: "未測定は陰性ではありません" };
  }
  if (labs.bnp != null) {
    if (labs.bnp < 100) return { status: "low", label: "急性心不全は考えにくい", detail: "BNP < 100 pg/mL（急性症状での除外目安）" };
    if (labs.bnp > 400) return { status: "high", label: "急性心不全を支持", detail: "BNP > 400 pg/mL。身体所見・画像と統合してください" };
    return { status: "intermediate", label: "判定保留", detail: "BNP 100–400 pg/mL。診察と心エコー等で評価" };
  }
  const value = labs.ntProBnp!;
  if (value < 300) return { status: "low", label: "急性心不全は考えにくい", detail: "NT-proBNP < 300 pg/mL（急性症状での除外目安）" };
  if (labs.age == null) return { status: "intermediate", label: "判定保留", detail: "年齢別rule-in判定には年齢入力が必要です" };
  const threshold = labs.age < 50 ? 450 : labs.age < 75 ? 900 : 1800;
  if (value >= threshold) return { status: "high", label: "急性心不全を支持", detail: `年齢別rule-in値 ${threshold} pg/mL以上。単独で確定しません` };
  return { status: "intermediate", label: "判定保留", detail: `300以上、年齢別rule-in値 ${threshold} pg/mL未満。画像評価を検討` };
}

export function interpretAlbumin(value?: number): LabInterpretation {
  if (value == null) return { status: "unmeasured", label: "未測定", detail: "未測定は正常とはみなしません" };
  if (value < 2.2) return { status: "high", label: "低Albの寄与を強く支持", detail: "絶対的な発症境界ではなく、原因検索が必要です" };
  if (value < 3) return { status: "intermediate", label: "浮腫への寄与あり", detail: "Alb 2.2–2.9 g/dL" };
  if (value < 3.5) return { status: "caution", label: "軽度低下", detail: "単独原因と断定せず、他所見と統合します" };
  return { status: "low", label: "低Alb単独は考えにくい", detail: "Alb 3.5 g/dL以上" };
}

export function interpretCrp(value?: number): LabInterpretation {
  if (value == null) return { status: "unmeasured", label: "未測定", detail: "未測定は炎症なしを意味しません" };
  if (value >= 3) return { status: "high", label: "炎症・感染を支持する補助所見", detail: "CRP単独で感染症を確定しません" };
  return { status: "low", label: "著明上昇なし", detail: "局所所見が強ければ感染症を除外できません" };
}

type Rule = {
  id: string;
  name: string;
  support: Array<[string, (answers: Answers, labs: LabValues) => boolean]>;
  against?: Array<[string, (answers: Answers, labs: LabValues) => boolean]>;
  requiredChecks: string[];
  next: string;
  tests: string;
  sourceIds: string[];
};

export const differentialRules: Rule[] = [
  {
    id: "acute-unilateral-dvt",
    name: "深部静脈血栓症（DVT）",
    support: [
      ["急性", (a) => present(a, "history-1")],
      ["片側性", (a) => present(a, "unilateral")],
      ["下腿周径差3cm以上", (a) => a["calf-difference"] === "large"],
      ["深部静脈走行の圧痛", (a) => present(a, "tenderness")],
      ["悪性腫瘍歴", (a) => present(a, "history-8")],
      ["手術歴", (a) => present(a, "history-7")],
      ["長距離移動", (a) => present(a, "history-6")],
    ],
    against: [["慢性経過", (a) => present(a, "history-2") && !present(a, "history-1")]],
    requiredChecks: ["history-1", "unilateral", "calf-difference", "tenderness", "history-8", "history-7", "history-6"],
    next: "2-level DVT Wells scoreで事前確率を評価",
    tests: "Wellsに応じてD-dimerまたは下肢静脈圧迫超音波",
    sourceIds: ["aafp-2022", "nice-ng158"],
  },
  {
    id: "chronic-venous-insufficiency",
    name: "慢性静脈不全",
    support: [
      ["慢性経過", (a) => present(a, "history-2")],
      ["色素沈着", (a) => present(a, "pigmentation")],
      ["静脈怒張・静脈瘤", (a) => present(a, "venous-distension")],
      ["挙上で改善", (a) => present(a, "history-4")],
      ["長時間立位", (a) => present(a, "history-5")],
      ["圧痕性", (a) => present(a, "pitting")],
    ],
    requiredChecks: ["history-2", "pigmentation", "venous-distension", "history-4", "history-5", "pitting"],
    next: "足背動脈、皮膚変化、潰瘍を確認",
    tests: "必要時に静脈超音波（逆流評価）",
    sourceIds: ["aafp-2022", "gasparis-2020"],
  },
  {
    id: "lymphedema",
    name: "リンパ浮腫",
    support: [
      ["足背・足趾まで腫脹", (a) => present(a, "dorsum")],
      ["Stemmer徴候陽性", (a) => present(a, "stemmer")],
      ["皮膚肥厚・硬化", (a) => present(a, "induration")],
      ["慢性経過", (a) => present(a, "history-2")],
      ["放射線治療歴", (a) => present(a, "history-9")],
      ["リンパ節郭清歴", (a) => present(a, "history-10")],
      ["非圧痕性", (a) => absent(a, "pitting")],
    ],
    against: [],
    requiredChecks: ["dorsum", "stemmer", "induration", "history-2", "history-9", "history-10", "pitting"],
    next: "分布、皮膚肥厚、既往を統合（Stemmer陰性のみでは除外しない）",
    tests: "典型例は臨床診断。非典型例でリンパ画像を検討",
    sourceIds: ["gasparis-2020", "isl-2016"],
  },
  {
    id: "systemic-heart-failure",
    name: "心不全・全身性うっ血",
    support: [
      ["両側性", (a) => present(a, "bilateral")],
      ["急性経過", (a) => present(a, "history-1")],
      ["頸静脈圧上昇", (a) => present(a, "jvd") || present(a, "jvp")],
      ["肺ラ音", (a) => present(a, "crackles")],
      ["Ⅲ音", (a) => present(a, "s3")],
      ["BNP/NT-proBNP高値", (_, l) => interpretBnp(l).status === "high"],
    ],
    against: [["BNP/NT-proBNPが急性心不全除外域", (_, l) => interpretBnp(l).status === "low"]],
    requiredChecks: ["bilateral", "jvp", "crackles", "s3"],
    next: "呼吸困難・起座呼吸・体重変化、頸静脈、肺、心音を再評価",
    tests: "BNP/NT-proBNP、心電図、胸部X線、心エコー",
    sourceIds: ["aafp-2022", "esc-hf-2021", "pride-2005"],
  },
  {
    id: "systemic-renal-hepatic-protein",
    name: "腎・肝疾患／低アルブミン血症など全身性原因",
    support: [
      ["慢性経過", (a) => present(a, "history-2")],
      ["両側性", (a) => present(a, "bilateral")],
      ["顔面・眼瞼浮腫", (a) => present(a, "face") || present(a, "eyelid")],
      ["腹水", (a) => present(a, "ascites")],
      ["低アルブミン血症", (_, l) => ["high", "intermediate"].includes(interpretAlbumin(l.albumin).status)],
      ["腎機能低下", (_, l) => l.egfr != null && l.egfr < 60],
      ["蛋白尿", (_, l) => l.urineProteinCr != null && l.urineProteinCr > 0.15],
    ],
    requiredChecks: ["history-2", "bilateral", "face", "eyelid", "ascites"],
    next: "顔面・仙骨浮腫、腹水、肝腫大、体液量所見を確認",
    tests: "Cr/eGFR、尿蛋白/Cr比、Alb、肝機能、TSH/FT4",
    sourceIds: ["aafp-2022", "gasparis-2020"],
  },
  {
    id: "acute-inflammatory",
    name: "蜂窩織炎・深部感染・関節炎など炎症性浮腫",
    support: [
      ["片側性", (a) => present(a, "unilateral")],
      ["発赤", (a) => present(a, "erythema")],
      ["熱感", (a) => a.temperature === "warm"],
      ["疼痛・圧痛", (a) => present(a, "tenderness")],
      ["発熱", (a) => present(a, "red-8")],
      ["ROM制限", (a) => present(a, "rom")],
      ["CRP 3 mg/dL以上", (_, l) => l.crp != null && l.crp >= 3],
    ],
    requiredChecks: ["unilateral", "erythema", "temperature", "tenderness", "red-8", "rom"],
    next: "発赤範囲、侵入門戸、関節所見、全身状態を確認",
    tests: "重症度に応じてCRP・血算・培養・画像（CRP単独で確定しない）",
    sourceIds: ["aafp-2022", "gasparis-2020"],
  },
];

export function buildDifferential(answers: Answers, labs: LabValues = {}): Differential[] {
  return differentialRules
    .map((rule) => {
      const support = rule.support.filter(([, test]) => test(answers, labs)).map(([label]) => label);
      const against = (rule.against ?? []).filter(([, test]) => test(answers, labs)).map(([label]) => label);
      const missing = rule.requiredChecks
        .filter((id) => answers[id] == null || answers[id] === "unknown")
        .map(labelFor);
      const branchBoost =
        (present(answers, "history-1") && rule.id.startsWith("acute-") ? 2 : 0) +
        (present(answers, "history-2") && (rule.id.startsWith("chronic-") || rule.id.startsWith("systemic-")) ? 2 : 0) +
        (present(answers, "unilateral") && ["acute-unilateral-dvt", "chronic-venous-insufficiency", "lymphedema", "acute-inflammatory"].includes(rule.id) ? 2 : 0) +
        (present(answers, "bilateral") && rule.id.startsWith("systemic-") ? 2 : 0);
      return {
        id: rule.id,
        name: rule.name,
        score: support.length * 2 + branchBoost - against.length * 2,
        support,
        against,
        missing,
        next: rule.next,
        tests: rule.tests,
        sourceIds: rule.sourceIds,
      };
    })
    .sort((a, b) => b.score - a.score);
}
