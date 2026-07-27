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
  tshLowerLimit?: number;
  tshUpperLimit?: number;
  ft4LowerLimit?: number;
  ft4UpperLimit?: number;
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

export type ThyroidInterpretation = {
  status: "unmeasured" | "incomplete" | "overt-primary" | "subclinical" | "central-possible" | "not-supportive" | "discordant";
  label: string;
  detail: string;
  usesDefaultRanges: boolean;
  ranges: {
    tshLower: number;
    tshUpper: number;
    ft4Lower: number;
    ft4Upper: number;
  };
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

const defaultThyroidRanges = {
  tshLower: 0.4,
  tshUpper: 4.5,
  ft4Lower: 0.8,
  ft4Upper: 1.8,
};

export function interpretThyroid(labs: LabValues): ThyroidInterpretation {
  const ranges = {
    tshLower: labs.tshLowerLimit ?? defaultThyroidRanges.tshLower,
    tshUpper: labs.tshUpperLimit ?? defaultThyroidRanges.tshUpper,
    ft4Lower: labs.ft4LowerLimit ?? defaultThyroidRanges.ft4Lower,
    ft4Upper: labs.ft4UpperLimit ?? defaultThyroidRanges.ft4Upper,
  };
  const usesDefaultRanges = [
    labs.tshLowerLimit,
    labs.tshUpperLimit,
    labs.ft4LowerLimit,
    labs.ft4UpperLimit,
  ].some((value) => value == null);
  const common = { usesDefaultRanges, ranges };

  if (labs.tsh == null && labs.ft4 == null) {
    return { ...common, status: "unmeasured", label: "未測定", detail: "未測定は正常を意味しません" };
  }
  if (labs.tsh == null || labs.ft4 == null) {
    return {
      ...common,
      status: "incomplete",
      label: "判定に必要な検査が不足",
      detail: "甲状腺機能の判定にはTSHとFT4の両方が必要です",
    };
  }

  const tshHigh = labs.tsh > ranges.tshUpper;
  const tshInRange = labs.tsh >= ranges.tshLower && labs.tsh <= ranges.tshUpper;
  const ft4Low = labs.ft4 < ranges.ft4Lower;
  const ft4InRange = labs.ft4 >= ranges.ft4Lower && labs.ft4 <= ranges.ft4Upper;

  if (tshHigh && ft4Low) {
    return {
      ...common,
      status: "overt-primary",
      label: "顕性甲状腺機能低下症を強く疑う",
      detail: "TSH高値かつFT4低値です。身体所見と合わせて浮腫への関与を評価します",
    };
  }
  if (tshHigh && ft4InRange) {
    return {
      ...common,
      status: "subclinical",
      label: "潜在性甲状腺機能低下症の可能性",
      detail: "FT4は正常範囲であり、これだけで浮腫の主因とは判断できません",
    };
  }
  if (ft4Low && labs.tsh <= ranges.tshUpper) {
    return {
      ...common,
      status: "central-possible",
      label: "中枢性甲状腺機能低下症の可能性",
      detail: "FT4低値に対してTSHが低値または不適切正常です。確定診断ではありません",
    };
  }
  if (tshInRange && ft4InRange) {
    return {
      ...common,
      status: "not-supportive",
      label: "検査上、甲状腺機能低下症は支持されません",
      detail: "TSH、FT4とも入力された施設基準範囲内です",
    };
  }
  return {
    ...common,
    status: "discordant",
    label: "甲状腺機能検査が非典型パターン",
    detail: "薬剤、重症疾患、測定干渉を含めて施設基準範囲と再確認してください",
  };
}

type Rule = {
  id: string;
  name: string;
  support: Array<[string, (answers: Answers, labs: LabValues) => boolean, number?]>;
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
  {
    id: "hypothyroidism",
    name: "甲状腺機能低下症",
    support: [
      ["TSH高値＋FT4低値（顕性）", (_, l) => interpretThyroid(l).status === "overt-primary", 4],
      ["FT4低値＋TSH低値／不適切正常（中枢性の可能性）", (_, l) => interpretThyroid(l).status === "central-possible", 2],
      ["TSH高値＋FT4正常（潜在性）", (_, l) => interpretThyroid(l).status === "subclinical"],
      ["非圧痕性浮腫", (a) => absent(a, "pitting")],
      ["顔面・眼瞼腫脹", (a) => present(a, "face") || present(a, "eyelid")],
      ["全身性浮腫", (a) => a.distribution === "generalized"],
      ["寒がり", (a) => present(a, "thyroid-cold")],
      ["皮膚乾燥", (a) => present(a, "thyroid-dry-skin")],
      ["徐脈", (a) => present(a, "thyroid-bradycardia")],
    ],
    against: [
      ["TSH・FT4とも施設基準範囲内", (_, l) => interpretThyroid(l).status === "not-supportive"],
      ["急性片側性浮腫", (a) => present(a, "history-1") && present(a, "unilateral")],
      ["発赤・熱感・強い圧痛", (a) => present(a, "erythema") || a.temperature === "warm" || present(a, "tenderness")],
      ["DVTを強く示唆する所見", (a) => a["calf-difference"] === "large" && present(a, "tenderness")],
    ],
    requiredChecks: ["pitting", "face", "eyelid"],
    next: "施設基準範囲、抗TPO抗体、薬剤歴、下垂体疾患の可能性を確認し、必要時に内分泌内科へ相談",
    tests: "TSH・FT4を必ず組み合わせて評価。中枢性疑いでは下垂体機能、薬剤、重症疾患を確認",
    sourceIds: ["ata-thyroid-tests", "aafp-hypothyroidism-2021", "aafp-2022"],
  },
];

export function buildDifferential(answers: Answers, labs: LabValues = {}): Differential[] {
  return differentialRules
    .map((rule) => {
      const matchedSupport = rule.support.filter(([, test]) => test(answers, labs));
      const support = matchedSupport.map(([label]) => label);
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
        score: matchedSupport.reduce((score, [, , weight = 1]) => score + weight * 2, 0) + branchBoost - against.length * 2,
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
