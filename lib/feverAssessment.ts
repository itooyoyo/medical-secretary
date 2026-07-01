export type EmergencyKey =
  | "shock"
  | "respiratoryFailure"
  | "alteredConsciousness"
  | "meningealSigns"
  | "neutropenia"
  | "necrotizingPain";

export type SymptomKey =
  | "coughSputum"
  | "dyspnea"
  | "chestPain"
  | "headache"
  | "neckStiffness"
  | "abdominalPain"
  | "rightUpperQuadrantPain"
  | "backPain"
  | "dysuriaFrequency"
  | "skinRednessSwelling"
  | "arthralgia"
  | "anteriorChestShoulderPain"
  | "noSymptoms";

export type AtypicalKey = "appetiteLoss" | "adlDecline" | "fall" | "delirium" | "lowActivity";

export type PhysicalKey =
  | "temporalArteryTenderness"
  | "saddleNose"
  | "skinDesquamation"
  | "erythemaMigrans"
  | "generalizedRash"
  | "posteriorCervicalNodes"
  | "sternoclavicularTenderness"
  | "janewayOsler";

export type LabKey = "wbcHigh" | "crpHigh" | "ldhHigh" | "ckHigh" | "plateletLow" | "liverInjury" | "aki";

export type ExposureKey =
  | "recentAntibiotics"
  | "newMedication"
  | "ssri"
  | "immunosuppressants"
  | "travel"
  | "tickBite"
  | "animalExposure"
  | "rodentExposure"
  | "birdExposure"
  | "urinaryCatheter"
  | "centralLinePort"
  | "prostheticValvePacer"
  | "prostheticJoint";

export type CppdKey =
  | "acuteJointPain"
  | "jointSwelling"
  | "kneePain"
  | "wristPain"
  | "shoulderPain"
  | "elbowPain"
  | "anklePain"
  | "hipPain"
  | "polyarthralgia"
  | "acuteNeckPain"
  | "limitedNeckRotation"
  | "postOpOrTrauma"
  | "hypomagnesemia"
  | "hyperparathyroidism"
  | "hemochromatosis"
  | "hypophosphatemia";

export type NonInfectiousKey =
  | "morningStiffness"
  | "temporalHeadache"
  | "jawClaudication"
  | "visualDisturbance"
  | "nsaidResponse"
  | "weightLoss"
  | "nightSweats"
  | "anemia"
  | "edema"
  | "organomegaly"
  | "legSwelling"
  | "shortnessOfBreath"
  | "tremor"
  | "sweating"
  | "rigidity";

export type DeepDiveKey =
  | "diarrhea"
  | "abdominalPain"
  | "recentHospitalization"
  | "ppi"
  | "olderAdult"
  | "smoking"
  | "copd"
  | "cough"
  | "sputumIncrease"
  | "purulentSputum"
  | "noPneumoniaImage"
  | "bloodCulturePositive"
  | "neckInfection"
  | "soreThroat"
  | "neckPain";

export type CultureResult =
  | "未提出"
  | "陰性"
  | "GPC"
  | "GNR"
  | "GPC＋GNR混在"
  | "Candida"
  | "Staphylococcus aureus"
  | "Streptococcus"
  | "Enterococcus";

export type ReassessmentKey =
  | "after48To72h"
  | "defervesced"
  | "persistentFever"
  | "crpWbcImproved"
  | "crpWbcNotImproved"
  | "lactateNotImproved"
  | "unstableBp"
  | "organFailureProgression"
  | "unknownSource"
  | "organMismatch"
  | "cultureNotSubmitted"
  | "bloodCultureNotBeforeAntibiotics"
  | "imagingNotDone"
  | "contrastCtNotDone"
  | "echoNotDone"
  | "backPainMriNotDone"
  | "abscess"
  | "drainageNotDone"
  | "biliaryObstruction"
  | "urinaryObstruction"
  | "catheterInPlace"
  | "prostheticDevice"
  | "pressureUlcer"
  | "diabeticFoot"
  | "antibioticsWithin90d"
  | "facilityResident"
  | "longHospitalization"
  | "esblHistory"
  | "mrsaHistory"
  | "pseudomonasRisk"
  | "immunosuppressed"
  | "biologics"
  | "fungalRisk"
  | "tbRisk"
  | "atypicalRisk"
  | "renalDoseNotAdjusted"
  | "hepaticCautionNotChecked"
  | "weightObesityNotConsidered"
  | "poorPenetrationSite"
  | "poorAdherence"
  | "drugInteraction"
  | "newMedication"
  | "nsaidResponse"
  | "weightLoss"
  | "nightSweats"
  | "ldhHigh"
  | "arthralgia"
  | "shoulderThighPain"
  | "temporalTenderness"
  | "legSwelling"
  | "chestBackPain"
  | "ckHigh"
  | "ssri";

export type FormState = {
  age: string;
  temperature: string;
  heartRate: string;
  systolicBp: string;
  spo2: string;
  alteredMentalStatus: boolean;
  immunosuppressed: boolean;
  diabetes: boolean;
  ckdDialysis: boolean;
  betaBlockerCaBlockerAvBlockPacer: boolean;
  emergency: Record<EmergencyKey, boolean>;
  symptoms: Record<SymptomKey, boolean>;
  atypical: Record<AtypicalKey, boolean>;
  physical: Record<PhysicalKey, boolean>;
  labs: Record<LabKey, boolean>;
  exposures: Record<ExposureKey, boolean>;
  cppd: Record<CppdKey, boolean>;
  nonInfectious: Record<NonInfectiousKey, boolean>;
  deepDive: Record<DeepDiveKey, boolean>;
  culture: CultureResult;
  reassessment: Record<ReassessmentKey, boolean>;
};

export type Finding = {
  title: string;
  details: string;
  severity?: "critical" | "caution" | "candidate" | "test";
};

export type Assessment = {
  urgency: string;
  urgencyTone: "red" | "orange" | "green";
  infectionFoci: Finding[];
  criticalDiseases: Finding[];
  nonInfectious: Finding[];
  tests: Finding[];
  cautions: Finding[];
  actions: string[];
  antibiotics: Finding[];
  cultureNotes: Finding[];
  additionalEvaluations: Finding[];
  reassessment: Finding[];
  relativeBradycardia: Finding | null;
};

export const emergencyOptions: { key: EmergencyKey; label: string }[] = [
  { key: "shock", label: "ショックあり" },
  { key: "respiratoryFailure", label: "呼吸不全あり" },
  { key: "alteredConsciousness", label: "意識障害あり" },
  { key: "meningealSigns", label: "髄膜刺激徴候あり" },
  { key: "neutropenia", label: "好中球減少あり" },
  { key: "necrotizingPain", label: "壊死性筋膜炎を疑う強い疼痛あり" },
];

export const symptomOptions: { key: SymptomKey; label: string }[] = [
  { key: "coughSputum", label: "咳・痰" },
  { key: "dyspnea", label: "呼吸困難" },
  { key: "chestPain", label: "胸痛" },
  { key: "headache", label: "頭痛" },
  { key: "neckStiffness", label: "項部硬直" },
  { key: "abdominalPain", label: "腹痛" },
  { key: "rightUpperQuadrantPain", label: "右季肋部痛" },
  { key: "backPain", label: "腰背部痛" },
  { key: "dysuriaFrequency", label: "排尿痛・頻尿" },
  { key: "skinRednessSwelling", label: "皮膚発赤・腫脹" },
  { key: "arthralgia", label: "関節痛" },
  { key: "anteriorChestShoulderPain", label: "前胸部痛・肩痛" },
  { key: "noSymptoms", label: "症状なし" },
];

export const atypicalOptions: { key: AtypicalKey; label: string }[] = [
  { key: "appetiteLoss", label: "食欲低下" },
  { key: "adlDecline", label: "ADL低下" },
  { key: "fall", label: "転倒" },
  { key: "delirium", label: "せん妄" },
  { key: "lowActivity", label: "活気低下" },
];

export const physicalOptions: { key: PhysicalKey; label: string }[] = [
  { key: "temporalArteryTenderness", label: "側頭動脈怒張・圧痛" },
  { key: "saddleNose", label: "鞍鼻" },
  { key: "skinDesquamation", label: "皮膚剥離" },
  { key: "erythemaMigrans", label: "遊走性紅斑" },
  { key: "generalizedRash", label: "全身発疹" },
  { key: "posteriorCervicalNodes", label: "後頚部リンパ節腫脹" },
  { key: "sternoclavicularTenderness", label: "胸鎖関節圧痛" },
  { key: "janewayOsler", label: "Janeway病変またはOsler結節" },
];

export const labOptions: { key: LabKey; label: string }[] = [
  { key: "wbcHigh", label: "WBC上昇" },
  { key: "crpHigh", label: "CRP上昇" },
  { key: "ldhHigh", label: "LDH上昇" },
  { key: "ckHigh", label: "CK上昇" },
  { key: "plateletLow", label: "血小板低下" },
  { key: "liverInjury", label: "肝障害" },
  { key: "aki", label: "急性腎障害" },
];

export const exposureOptions: { key: ExposureKey; label: string }[] = [
  { key: "recentAntibiotics", label: "最近の抗菌薬使用" },
  { key: "newMedication", label: "最近開始した薬剤あり" },
  { key: "ssri", label: "SSRI使用" },
  { key: "immunosuppressants", label: "免疫抑制薬使用" },
  { key: "travel", label: "海外渡航歴" },
  { key: "tickBite", label: "ダニ刺咬歴" },
  { key: "animalExposure", label: "動物曝露" },
  { key: "rodentExposure", label: "齧歯類曝露" },
  { key: "birdExposure", label: "鳥曝露" },
  { key: "urinaryCatheter", label: "尿道カテーテル" },
  { key: "centralLinePort", label: "CVカテーテル/ポート" },
  { key: "prostheticValvePacer", label: "人工弁/ペースメーカー" },
  { key: "prostheticJoint", label: "人工関節" },
];

export const cppdOptions: { key: CppdKey; label: string }[] = [
  { key: "acuteJointPain", label: "急性関節痛" },
  { key: "jointSwelling", label: "関節腫脹" },
  { key: "kneePain", label: "膝関節痛" },
  { key: "wristPain", label: "手関節痛" },
  { key: "shoulderPain", label: "肩関節痛" },
  { key: "elbowPain", label: "肘関節痛" },
  { key: "anklePain", label: "足関節痛" },
  { key: "hipPain", label: "股関節痛" },
  { key: "polyarthralgia", label: "多関節痛" },
  { key: "acuteNeckPain", label: "急性頸部痛" },
  { key: "limitedNeckRotation", label: "頸部回旋制限" },
  { key: "postOpOrTrauma", label: "手術後または外傷後" },
  { key: "hypomagnesemia", label: "低Mg血症" },
  { key: "hyperparathyroidism", label: "副甲状腺機能亢進症" },
  { key: "hemochromatosis", label: "ヘモクロマトーシス" },
  { key: "hypophosphatemia", label: "低P血症" },
];

export const nonInfectiousOptions: { key: NonInfectiousKey; label: string }[] = [
  { key: "morningStiffness", label: "朝のこわばり" },
  { key: "temporalHeadache", label: "側頭部痛" },
  { key: "jawClaudication", label: "顎跛行" },
  { key: "visualDisturbance", label: "視力障害" },
  { key: "nsaidResponse", label: "NSAIDsで解熱" },
  { key: "weightLoss", label: "体重減少" },
  { key: "nightSweats", label: "夜間発汗" },
  { key: "anemia", label: "貧血" },
  { key: "edema", label: "浮腫" },
  { key: "organomegaly", label: "臓器腫大" },
  { key: "legSwelling", label: "下肢腫脹" },
  { key: "shortnessOfBreath", label: "息切れ" },
  { key: "tremor", label: "振戦" },
  { key: "sweating", label: "発汗" },
  { key: "rigidity", label: "筋強剛" },
];

export const deepDiveOptions: { key: DeepDiveKey; label: string }[] = [
  { key: "diarrhea", label: "下痢" },
  { key: "abdominalPain", label: "腹痛" },
  { key: "recentHospitalization", label: "入院中または最近の入院" },
  { key: "ppi", label: "PPI使用" },
  { key: "olderAdult", label: "高齢者" },
  { key: "smoking", label: "喫煙歴" },
  { key: "copd", label: "COPD既往" },
  { key: "cough", label: "咳" },
  { key: "sputumIncrease", label: "痰増加" },
  { key: "purulentSputum", label: "膿性痰" },
  { key: "noPneumoniaImage", label: "明らかな肺炎像なし" },
  { key: "bloodCulturePositive", label: "血液培養陽性" },
  { key: "neckInfection", label: "頸部感染" },
  { key: "soreThroat", label: "咽頭痛" },
  { key: "neckPain", label: "頸部痛" },
];

export const reassessmentOptions: { key: ReassessmentKey; label: string }[] = [
  { key: "after48To72h", label: "抗菌薬開始後48〜72時間経過" },
  { key: "defervesced", label: "解熱傾向あり" },
  { key: "persistentFever", label: "発熱持続" },
  { key: "crpWbcImproved", label: "CRP/WBC改善あり" },
  { key: "crpWbcNotImproved", label: "CRP/WBC改善なし" },
  { key: "lactateNotImproved", label: "乳酸改善なし" },
  { key: "unstableBp", label: "血圧不安定" },
  { key: "organFailureProgression", label: "臓器障害進行" },
  { key: "unknownSource", label: "感染巣未確定" },
  { key: "organMismatch", label: "感染臓器と症状が一致しない" },
  { key: "cultureNotSubmitted", label: "培養未提出" },
  { key: "bloodCultureNotBeforeAntibiotics", label: "抗菌薬投与前に血液培養未採取" },
  { key: "imagingNotDone", label: "画像検査未施行" },
  { key: "contrastCtNotDone", label: "造影CT未施行" },
  { key: "echoNotDone", label: "心エコー未施行" },
  { key: "backPainMriNotDone", label: "腰背部痛があるがMRI未施行" },
  { key: "abscess", label: "膿瘍あり" },
  { key: "drainageNotDone", label: "ドレナージ未実施" },
  { key: "biliaryObstruction", label: "胆道閉塞あり" },
  { key: "urinaryObstruction", label: "尿路閉塞あり" },
  { key: "catheterInPlace", label: "カテーテル留置中" },
  { key: "prostheticDevice", label: "人工物/デバイスあり" },
  { key: "pressureUlcer", label: "褥瘡あり" },
  { key: "diabeticFoot", label: "糖尿病足あり" },
  { key: "antibioticsWithin90d", label: "90日以内抗菌薬使用" },
  { key: "facilityResident", label: "施設入所" },
  { key: "longHospitalization", label: "長期入院" },
  { key: "esblHistory", label: "ESBL既往" },
  { key: "mrsaHistory", label: "MRSA既往" },
  { key: "pseudomonasRisk", label: "緑膿菌リスク" },
  { key: "immunosuppressed", label: "免疫抑制" },
  { key: "biologics", label: "生物学的製剤使用" },
  { key: "fungalRisk", label: "真菌リスク" },
  { key: "tbRisk", label: "結核リスク" },
  { key: "atypicalRisk", label: "非定型感染リスク" },
  { key: "renalDoseNotAdjusted", label: "腎機能に応じた投与量未調整" },
  { key: "hepaticCautionNotChecked", label: "肝機能に応じた薬剤注意が未確認" },
  { key: "weightObesityNotConsidered", label: "体重/肥満を考慮していない" },
  { key: "poorPenetrationSite", label: "移行性が悪い感染巣の可能性" },
  { key: "poorAdherence", label: "内服アドヒアランス不良" },
  { key: "drugInteraction", label: "薬剤相互作用あり" },
  { key: "newMedication", label: "最近開始した薬剤あり" },
  { key: "nsaidResponse", label: "NSAIDsで解熱" },
  { key: "weightLoss", label: "体重減少" },
  { key: "nightSweats", label: "夜間発汗" },
  { key: "ldhHigh", label: "LDH高値" },
  { key: "arthralgia", label: "関節痛" },
  { key: "shoulderThighPain", label: "肩痛/大腿痛" },
  { key: "temporalTenderness", label: "側頭動脈圧痛" },
  { key: "legSwelling", label: "下肢腫脹" },
  { key: "chestBackPain", label: "胸背部痛" },
  { key: "ckHigh", label: "CK高値" },
  { key: "ssri", label: "SSRI使用" },
];

const makeFlags = <T extends string>(keys: readonly T[]) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>);

export const initialForm: FormState = {
  age: "",
  temperature: "",
  heartRate: "",
  systolicBp: "",
  spo2: "",
  alteredMentalStatus: false,
  immunosuppressed: false,
  diabetes: false,
  ckdDialysis: false,
  betaBlockerCaBlockerAvBlockPacer: false,
  emergency: makeFlags(emergencyOptions.map((item) => item.key)),
  symptoms: makeFlags(symptomOptions.map((item) => item.key)),
  atypical: makeFlags(atypicalOptions.map((item) => item.key)),
  physical: makeFlags(physicalOptions.map((item) => item.key)),
  labs: makeFlags(labOptions.map((item) => item.key)),
  exposures: makeFlags(exposureOptions.map((item) => item.key)),
  cppd: makeFlags(cppdOptions.map((item) => item.key)),
  nonInfectious: makeFlags(nonInfectiousOptions.map((item) => item.key)),
  deepDive: makeFlags(deepDiveOptions.map((item) => item.key)),
  culture: "未提出",
  reassessment: makeFlags(reassessmentOptions.map((item) => item.key)),
};

function hasAny(flags: Record<string, boolean>, keys: string[]) {
  return keys.some((key) => flags[key]);
}

function addUnique(items: Finding[], next: Finding) {
  if (!items.some((item) => item.title === next.title)) {
    items.push(next);
  }
}

function toNumber(value: string) {
  if (value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

export function assessFever(form: FormState): Assessment {
  const age = toNumber(form.age);
  const temperature = toNumber(form.temperature);
  const heartRate = toNumber(form.heartRate);
  const sbp = toNumber(form.systolicBp);
  const spo2 = toNumber(form.spo2);
  const validAge = Number.isFinite(age) && age >= 0 && age <= 130;
  const validTemperature = Number.isFinite(temperature) && temperature >= 30 && temperature <= 45;
  const validHeartRate = Number.isFinite(heartRate) && heartRate >= 20 && heartRate <= 250;
  const validSbp = Number.isFinite(sbp) && sbp >= 40 && sbp <= 300;
  const validSpo2 = Number.isFinite(spo2) && spo2 >= 50 && spo2 <= 100;
  const invalidVitals = [
    form.age.trim() !== "" && !validAge ? "年齢" : "",
    form.temperature.trim() !== "" && !validTemperature ? "体温" : "",
    form.heartRate.trim() !== "" && !validHeartRate ? "心拍数" : "",
    form.systolicBp.trim() !== "" && !validSbp ? "収縮期血圧" : "",
    form.spo2.trim() !== "" && !validSpo2 ? "SpO2" : "",
  ].filter(Boolean);
  const hasFever = validTemperature && temperature >= 37.5;
  const isOlder = validAge && age >= 65;
  const shockByVital = validSbp && sbp < 90;
  const respiratoryByVital = validSpo2 && spo2 < 92;
  const atypicalOlder = isOlder && Object.values(form.atypical).some(Boolean);

  const criticalDiseases: Finding[] = [];
  const infectionFoci: Finding[] = [];
  const nonInfectious: Finding[] = [];
  const tests: Finding[] = [];
  const cautions: Finding[] = [];
  const actions: string[] = [];
  const cultureNotes: Finding[] = [];
  const additionalEvaluations: Finding[] = [];
  const reassessment: Finding[] = [];

  if (invalidVitals.length > 0) {
    cautions.push({
      title: "入力値を確認",
      details: `${invalidVitals.join("、")}に臨床的に想定しにくい値が入力されています。判定には使用せず、入力値を確認してください。`,
      severity: "caution",
    });
  }

  if (form.emergency.shock || form.emergency.alteredConsciousness || form.emergency.respiratoryFailure || shockByVital || respiratoryByVital || form.alteredMentalStatus) {
    addUnique(criticalDiseases, {
      title: "敗血症",
      details: "ショック、意識障害、呼吸不全、低血圧、低酸素を伴う発熱では敗血症を最優先で考慮します。",
      severity: "critical",
    });
  }

  if ((hasFever || form.emergency.meningealSigns) && (form.symptoms.neckStiffness || form.emergency.meningealSigns) && (form.symptoms.headache || form.emergency.alteredConsciousness || form.alteredMentalStatus)) {
    addUnique(criticalDiseases, {
      title: "髄膜炎",
      details: "頭痛、項部硬直、発熱、意識障害、髄膜刺激徴候の組み合わせでは髄膜炎を考慮します。",
      severity: "critical",
    });
  }

  if (form.emergency.necrotizingPain || (form.symptoms.skinRednessSwelling && form.emergency.necrotizingPain)) {
    addUnique(criticalDiseases, {
      title: "壊死性筋膜炎",
      details: "皮膚所見に比して強い疼痛、急速な進行、ショック徴候があれば外科相談を含め緊急対応を検討します。",
      severity: "critical",
    });
  }

  if (form.symptoms.chestPain || (form.symptoms.anteriorChestShoulderPain && form.labs.ckHigh)) {
    addUnique(criticalDiseases, {
      title: "心筋炎",
      details: "胸痛を伴う発熱では心電図、トロポニン、心エコーなどで心筋炎を考慮します。",
      severity: "critical",
    });
  }

  if (form.physical.janewayOsler || form.exposures.prostheticValvePacer || form.exposures.centralLinePort) {
    addUnique(criticalDiseases, {
      title: "感染性心内膜炎",
      details: "Janeway病変/Osler結節、人工弁、ペースメーカー、血管内デバイスがあれば血液培養陽性を想定し、感染性心内膜炎を考慮します。",
      severity: "critical",
    });
  }

  if (form.symptoms.backPain) {
    addUnique(criticalDiseases, {
      title: "腰背部痛を伴う危険疾患",
      details: "化膿性脊椎炎、腎盂腎炎、腸腰筋膿瘍を考慮します。",
      severity: "critical",
    });
  }

  if ((form.symptoms.anteriorChestShoulderPain || form.symptoms.chestPain) && form.physical.sternoclavicularTenderness) {
    addUnique(criticalDiseases, {
      title: "胸鎖関節炎",
      details: "前胸部痛または肩痛に胸鎖関節圧痛を伴う場合は胸鎖関節炎を考慮します。",
      severity: "critical",
    });
  }

  if (form.physical.skinDesquamation) {
    addUnique(criticalDiseases, {
      title: "SSSS・中毒性ショック症候群",
      details: "皮膚剥離を伴う発熱ではSSSS、中毒性ショック症候群などの重症皮膚感染・毒素性疾患を考慮します。",
      severity: "critical",
    });
  }

  if (form.symptoms.coughSputum || form.symptoms.dyspnea) {
    addUnique(infectionFoci, { title: "呼吸器感染", details: "肺炎、気管支炎、胸膜炎を考慮します。", severity: "candidate" });
  }
  if ((form.deepDive.smoking || form.deepDive.copd) && hasFever && (form.deepDive.cough || form.deepDive.sputumIncrease || form.deepDive.purulentSputum || form.symptoms.dyspnea) && form.deepDive.noPneumoniaImage) {
    addUnique(infectionFoci, {
      title: "COPD増悪",
      details: "COPD増悪を考慮します。喫煙者・COPD患者では、明らかな肺陰影を呈さず発熱・呼吸器症状をきたすCOPD増悪も考慮してください。肺炎、心不全、肺塞栓、気胸との鑑別も重要です。",
      severity: "candidate",
    });
    addUnique(tests, {
      title: "COPD増悪評価",
      details: "胸部X線またはCT、SpO2/血液ガス、喀痰グラム染色・培養、心電図、BNP/NT-proBNPを検討します。Dダイマーは状況に応じて検討します。",
      severity: "test",
    });
  }
  if (form.symptoms.dysuriaFrequency || form.symptoms.backPain || form.exposures.urinaryCatheter) {
    addUnique(infectionFoci, { title: "尿路感染", details: "尿路感染症、腎盂腎炎、前立腺炎を考慮します。尿道カテーテルのみで症状が乏しい場合は無症候性細菌尿との区別が必要です。", severity: "candidate" });
  }
  if (form.symptoms.rightUpperQuadrantPain || form.labs.liverInjury) {
    addUnique(infectionFoci, { title: "胆道感染", details: "胆管炎、胆嚢炎を考慮します。", severity: "candidate" });
  }
  if (form.symptoms.abdominalPain) {
    addUnique(infectionFoci, { title: "腹腔内感染", details: "腹腔内感染、憩室炎、虫垂炎を考慮します。", severity: "candidate" });
  }
  if (hasFever && (form.deepDive.diarrhea || form.symptoms.abdominalPain) && (form.exposures.recentAntibiotics || form.deepDive.recentHospitalization)) {
    addUnique(infectionFoci, {
      title: "Clostridioides difficile infection（CDI）",
      details: "Clostridioides difficile infection（CDI）を考慮します。下痢＋発熱＋抗菌薬使用歴ではCDIを必ず考慮してください。重症例では脱水、AKI、低アルブミン、麻痺性イレウス、中毒性巨大結腸症に注意してください。",
      severity: "candidate",
    });
    addUnique(tests, {
      title: "CDI検査",
      details: "便中毒素、GDH、NAAT/PCR、CBC、Cr/eGFR、Albを検討します。腹部所見が強い場合は腹部CTを検討します。",
      severity: "test",
    });
  }
  if (form.symptoms.skinRednessSwelling) {
    addUnique(infectionFoci, { title: "皮膚軟部組織感染", details: "蜂窩織炎、皮膚軟部組織感染症を考慮します。", severity: "candidate" });
  }
  if (form.symptoms.arthralgia || form.exposures.prostheticJoint) {
    addUnique(infectionFoci, { title: "関節感染・炎症", details: "化膿性関節炎、偽痛風を考慮します。人工関節があれば感染リスクも評価します。", severity: "candidate" });
  }
  if (form.symptoms.noSymptoms && atypicalOlder) {
    addUnique(infectionFoci, {
      title: "高齢者の非典型感染",
      details: "症状が乏しくても、肺炎、尿路感染症、胆道感染症、感染性心内膜炎を候補として考慮します。",
      severity: "candidate",
    });
  }

  if (form.physical.erythemaMigrans && form.exposures.tickBite) {
    addUnique(infectionFoci, { title: "ライム病", details: "遊走性紅斑とダニ刺咬歴の組み合わせで考慮します。", severity: "candidate" });
  }
  if (form.physical.generalizedRash && form.physical.posteriorCervicalNodes) {
    addUnique(infectionFoci, { title: "麻疹・風疹", details: "全身発疹と後頚部リンパ節腫脹があれば曝露歴とワクチン歴も確認します。", severity: "candidate" });
  }
  if (form.exposures.rodentExposure && form.labs.liverInjury && form.labs.plateletLow && form.labs.aki) {
    addUnique(infectionFoci, { title: "レプトスピラ症", details: "齧歯類曝露、肝障害、血小板低下、AKIの組み合わせで考慮します。", severity: "candidate" });
  }
  if (form.exposures.birdExposure) {
    addUnique(infectionFoci, { title: "オウム病", details: "鳥曝露があれば肺炎像、肝障害、相対的徐脈の有無を確認します。", severity: "candidate" });
  }
  if (form.exposures.travel) {
    addUnique(infectionFoci, { title: "輸入感染症", details: "マラリア、腸チフス、デング熱などを考慮します。渡航先、時期、蚊刺咬、予防内服を確認します。", severity: "candidate" });
  }

  if (form.labs.ldhHigh) {
    addUnique(nonInfectious, {
      title: "血管内リンパ腫",
      details: "LDH高値を伴う感染巣不明の発熱では、皮疹がなくても血管内リンパ腫を考慮し、ランダム皮膚生検を検討してください。",
      severity: "caution",
    });
  }
  if (form.labs.ckHigh && form.exposures.ssri) {
    addUnique(nonInfectious, {
      title: "セロトニン症候群・横紋筋融解",
      details: "CK上昇とSSRI使用があれば、セロトニン症候群、横紋筋融解、薬剤性発熱を考慮します。",
      severity: "caution",
    });
  }
  if (form.physical.temporalArteryTenderness) {
    addUnique(nonInfectious, { title: "巨細胞性動脈炎", details: "側頭動脈怒張・圧痛、頭痛、視症状、顎跛行を確認します。", severity: "caution" });
  }
  if (form.physical.saddleNose) {
    addUnique(nonInfectious, { title: "ANCA関連血管炎", details: "鞍鼻があれば上気道病変、腎障害、肺病変とあわせて評価します。", severity: "caution" });
  }
  if (form.labs.plateletLow && form.labs.aki && hasFever) {
    addUnique(nonInfectious, {
      title: "TAFRO症候群",
      details: "TAFRO症候群は血小板減少、浮腫、発熱、骨髄線維化、腎機能障害、臓器腫大を特徴とします。",
      severity: "caution",
    });
  }

  const isAge70OrOlder = validAge && age >= 70;
  const hasCppdMetabolicRisk =
    form.cppd.hypomagnesemia ||
    form.cppd.hyperparathyroidism ||
    form.cppd.hemochromatosis ||
    form.cppd.hypophosphatemia;
  const hasAcuteArthritis = form.cppd.acuteJointPain && form.cppd.jointSwelling;
  const suspectCppd =
    (isAge70OrOlder && hasFever && form.cppd.acuteJointPain) ||
    (form.labs.crpHigh && form.cppd.acuteJointPain) ||
    (isAge70OrOlder && (form.cppd.kneePain || form.cppd.wristPain || form.cppd.shoulderPain)) ||
    (form.cppd.polyarthralgia && hasFever) ||
    (form.cppd.postOpOrTrauma && hasAcuteArthritis) ||
    hasCppdMetabolicRisk;
  const suspectCds =
    (isAge70OrOlder && hasFever && form.cppd.acuteNeckPain) ||
    (form.cppd.acuteNeckPain && form.cppd.limitedNeckRotation) ||
    (form.cppd.acuteNeckPain && form.labs.crpHigh);

  if (suspectCppd) {
    addUnique(nonInfectious, {
      title: "偽痛風 / CPPD",
      details:
        "偽痛風 / CPPDを考慮します。高齢者に多く、38℃以上の発熱やCRP高値を伴うことがあります。膝関節が最多ですが、手・肩・肘・足・股関節にも起こり、多関節型もあります。急性期には化膿性関節炎との鑑別が困難です。",
      severity: "caution",
    });
    addUnique(cautions, {
      title: "CPPDと化膿性関節炎の鑑別",
      details:
        "急性期には化膿性関節炎との鑑別が困難です。発熱、強い疼痛、関節腫脹、免疫抑制、糖尿病、人工関節、菌血症リスクがある場合は、関節穿刺、グラム染色、培養を検討してください。必要に応じて入院・抗菌薬投与も検討してください。",
      severity: "caution",
    });
    addUnique(cautions, {
      title: "CPPDの治療コメント",
      details:
        "治療は安静、冷却、NSAIDsなどを検討します。ただし腎機能障害、高齢者、心血管疾患、消化管出血リスクがある場合はNSAIDs使用に注意してください。感染が否定できない場合は化膿性関節炎としての対応を優先してください。",
      severity: "caution",
    });
    tests.push(
      { title: "関節液検査", details: "ピロリン酸カルシウム結晶の確認を検討します。", severity: "test" },
      { title: "関節液グラム染色・細菌培養", details: "化膿性関節炎との鑑別のため、グラム染色と細菌培養を検討します。必要に応じて抗酸菌培養も検討します。", severity: "test" },
      { title: "CPPD関連採血", details: "Ca、P、Mg、ALP、Fe、トランスフェリン、甲状腺機能、副甲状腺ホルモンを検討します。", severity: "test" },
      { title: "関節X線", details: "線状または層状の軟骨石灰化、関節変形の確認を検討します。", severity: "test" },
    );
  }

  if (suspectCds) {
    addUnique(nonInfectious, {
      title: "Crowned dens syndrome（環軸関節のCPPD発作）",
      details:
        "Crowned dens syndrome（環軸関節のCPPD発作）を考慮します。高齢者の急性頸部痛と発熱で発症することがあります。MRIでは石灰化が見えにくく、CTで軸椎歯突起周囲の石灰化を確認します。",
      severity: "caution",
    });
    addUnique(criticalDiseases, {
      title: "急性頸部痛で見逃さない疾患",
      details: "CDSを疑う場合でも、髄膜炎、化膿性脊椎炎、リウマチ性多発筋痛症、頸椎疾患を鑑別に入れてください。",
      severity: "critical",
    });
    addUnique(cautions, {
      title: "CDSの鑑別注意",
      details:
        "髄膜炎、化膿性脊椎炎、リウマチ性多発筋痛症、頸椎疾患との鑑別が重要です。発熱、意識障害、髄膜刺激徴候、神経症状、菌血症リスクがある場合は感染症評価を優先して検討してください。",
      severity: "caution",
    });
    tests.push(
      { title: "頸椎CT", details: "軸椎歯突起周囲の石灰化を確認します。", severity: "test" },
      { title: "CDSでの髄液検査", details: "髄膜炎が疑わしい場合は髄液検査を検討します。", severity: "test" },
      { title: "CDSでのMRI", details: "化膿性脊椎炎が疑わしい場合はMRIを検討します。", severity: "test" },
      { title: "CDSでの血液培養", details: "感染症が否定できない場合に血液培養を検討します。", severity: "test" },
    );
  }

  const isAge50OrOlder = validAge && age >= 50;
  const infectionSourceUnknown =
    form.symptoms.noSymptoms ||
    (!form.symptoms.coughSputum &&
      !form.symptoms.dyspnea &&
      !form.symptoms.abdominalPain &&
      !form.symptoms.rightUpperQuadrantPain &&
      !form.symptoms.backPain &&
      !form.symptoms.dysuriaFrequency &&
      !form.symptoms.skinRednessSwelling &&
      !form.symptoms.arthralgia);

  if (infectionSourceUnknown && form.labs.crpHigh) {
    ["感染性心内膜炎", "菌血症", "敗血症", "深部膿瘍", "化膿性脊椎炎", "腸腰筋膿瘍"].forEach((title) =>
      addUnique(criticalDiseases, {
        title,
        details: "感染臓器不明＋CRP高値では、深部感染巣や血流感染を見逃さないように検討します。深部膿瘍が疑われる場合は造影CTや必要に応じたドレナージ適応を検討してください。",
        severity: "critical",
      }),
    );
    ["悪性腫瘍", "血管内リンパ腫", "リウマチ性多発筋痛症", "巨細胞性動脈炎", "DVT/PE", "大動脈瘤", "大動脈解離"].forEach((title) =>
      addUnique(nonInfectious, {
        title,
        details: "感染臓器が不明なCRP高値では、感染症だけでなく悪性腫瘍、膠原病、血栓症、大動脈疾患も再評価してください。",
        severity: "caution",
      }),
    );
    addUnique(cautions, {
      title: "感染臓器不明CRP高値",
      details: "頸部感染や咽頭痛、頸部痛、菌血症がある場合は内頸静脈血栓やLemierre症候群も考慮してください。",
      severity: "caution",
    });
    tests.push(
      { title: "感染臓器不明CRP高値の検索", details: "血液培養2セット以上、尿検査/尿培養、胸腹部造影CT、心エコーを検討します。", severity: "test" },
      { title: "深部感染・血管疾患評価", details: "腰背部痛があれば脊椎MRI、DVT/PE疑いでは下肢静脈エコーや造影CT、大動脈疾患疑いでは造影CTを検討します。", severity: "test" },
      { title: "非感染症評価", details: "LDH高値なら血管内リンパ腫を考慮しランダム皮膚生検を検討します。PMR/GCA疑いではESR、眼症状確認、専門科相談を検討します。", severity: "test" },
    );
  }

  if (infectionSourceUnknown && form.labs.crpHigh && form.symptoms.backPain) {
    ["化膿性脊椎炎", "腸腰筋膿瘍"].forEach((title) =>
      addUnique(criticalDiseases, { title, details: "感染臓器不明＋CRP高値＋腰背部痛では深部感染巣を考慮し、脊椎MRIや造影CTを検討します。", severity: "critical" }),
    );
  }
  if (infectionSourceUnknown && form.labs.crpHigh && form.nonInfectious.legSwelling) {
    addUnique(nonInfectious, { title: "DVT/PE", details: "感染臓器不明＋CRP高値＋下肢腫脹ではDVT/PEも考慮します。", severity: "caution" });
  }
  if (infectionSourceUnknown && form.labs.crpHigh && form.symptoms.chestPain) {
    ["大動脈瘤", "大動脈解離"].forEach((title) =>
      addUnique(criticalDiseases, { title, details: "感染臓器不明＋CRP高値＋胸背部痛では大動脈疾患を検討します。", severity: "critical" }),
    );
  }
  if ((form.deepDive.neckInfection || form.deepDive.soreThroat || form.deepDive.neckPain) && form.deepDive.bloodCulturePositive) {
    addUnique(criticalDiseases, {
      title: "内頸静脈血栓 / Lemierre症候群",
      details: "頸部感染や咽頭痛、頸部痛、菌血症がある場合は内頸静脈血栓やLemierre症候群も考慮してください。",
      severity: "critical",
    });
  }

  if (isAge50OrOlder && hasFever && (form.cppd.shoulderPain || form.nonInfectious.morningStiffness) && form.nonInfectious.morningStiffness) {
    addUnique(nonInfectious, {
      title: "リウマチ性多発筋痛症（PMR）",
      details: "50歳以上の発熱、肩痛または大腿痛、朝のこわばりではPMRを考慮します。感染症、悪性腫瘍、GCAの合併を除外しながら評価してください。",
      severity: "caution",
    });
  }

  if (isAge50OrOlder && hasFever && (form.nonInfectious.temporalHeadache || form.physical.temporalArteryTenderness || form.nonInfectious.jawClaudication || form.nonInfectious.visualDisturbance)) {
    addUnique(nonInfectious, {
      title: "巨細胞性動脈炎 / 側頭動脈炎（GCA）",
      details: "50歳以上の発熱に側頭部痛、側頭動脈圧痛、顎跛行、視力障害を伴う場合はGCAを考慮します。視力障害や顎跛行を伴う場合は緊急性があります。眼科・リウマチ膠原病科相談を検討してください。",
      severity: "caution",
    });
    addUnique(criticalDiseases, {
      title: "GCAでの視力障害・顎跛行",
      details: "巨細胞性動脈炎 / 側頭動脈炎では視力障害や顎跛行を伴う場合に緊急性があり、眼科・リウマチ膠原病科相談を検討してください。",
      severity: "critical",
    });
  }

  if (form.exposures.newMedication || form.exposures.recentAntibiotics) {
    addUnique(nonInfectious, {
      title: "薬剤熱",
      details: "最近開始した薬剤または抗菌薬使用歴がある場合は薬剤熱を考慮します。発症時期はさまざまで、中止後72〜96時間で解熱することがあります。感染症を除外しながら原因薬剤を見直してください。",
      severity: "caution",
    });
  }

  if ((infectionSourceUnknown && form.nonInfectious.nsaidResponse) || form.nonInfectious.weightLoss || form.nonInfectious.nightSweats || form.labs.ldhHigh || form.nonInfectious.anemia) {
    addUnique(nonInfectious, {
      title: "腫瘍熱",
      details: "感染症が否定的で、抗菌薬反応不良、NSAIDs反応、B症状がある場合は腫瘍熱を考慮してください。悪性リンパ腫、白血病、腎細胞癌、肝細胞癌、副腎腫瘍、心臓粘液腫などを鑑別に入れます。",
      severity: "caution",
    });
  }

  if ((form.labs.ldhHigh && infectionSourceUnknown) || (form.labs.ldhHigh && hasFever)) {
    addUnique(nonInfectious, {
      title: "血管内リンパ腫",
      details: "LDH高値を伴う感染巣不明の発熱では、皮疹がなくても血管内リンパ腫を考慮し、ランダム皮膚生検を検討してください。",
      severity: "caution",
    });
  }

  if (hasFever && form.labs.plateletLow && form.nonInfectious.edema && form.labs.aki && form.nonInfectious.organomegaly) {
    addUnique(nonInfectious, {
      title: "TAFRO症候群",
      details: "TAFRO症候群は血小板減少、浮腫、発熱、骨髄線維化、腎機能障害、臓器腫大を特徴とします。",
      severity: "caution",
    });
    addUnique(criticalDiseases, {
      title: "TAFRO症候群",
      details: "発熱、血小板低下、浮腫、腎機能障害、臓器腫大がそろう場合はTAFRO症候群を見逃さないよう検討します。",
      severity: "critical",
    });
  }

  if ((hasFever && form.nonInfectious.legSwelling) || (hasFever && (form.symptoms.chestPain || form.nonInfectious.shortnessOfBreath))) {
    addUnique(nonInfectious, {
      title: "DVT/PE",
      details: "下肢血栓では37〜38℃程度の発熱を伴うことがあります。抗凝固開始後も1週間以上発熱が続く場合は感染症などを再評価してください。",
      severity: "caution",
    });
    addUnique(criticalDiseases, {
      title: "DVT/PE",
      details: "発熱に下肢腫脹、胸痛、息切れを伴う場合はDVT/PEを考慮します。",
      severity: "critical",
    });
  }

  if (hasFever && (form.symptoms.chestPain || form.nonInfectious.shortnessOfBreath)) {
    addUnique(nonInfectious, {
      title: "心筋炎",
      details: "発熱＋胸痛/息切れでは心筋炎を考慮します。胸部症状が乏しいこともあり、想起が重要です。心電図、トロポニン、心エコーを検討してください。",
      severity: "caution",
    });
    addUnique(criticalDiseases, {
      title: "心筋炎",
      details: "発熱に胸部症状や息切れを伴う場合は心筋炎を見逃さないよう検討します。",
      severity: "critical",
    });
    addUnique(tests, {
      title: "心筋炎評価",
      details: "心電図、トロポニン、心エコーを検討します。",
      severity: "test",
    });
  }

  if (form.exposures.ssri && hasFever && (form.labs.ckHigh || form.nonInfectious.tremor || form.nonInfectious.sweating || form.nonInfectious.rigidity)) {
    addUnique(nonInfectious, {
      title: "セロトニン症候群",
      details: "SSRI使用＋発熱にCK高値、振戦、発汗、筋強剛がある場合はセロトニン症候群を考慮します。高体温、自律神経症状、神経筋症状、横紋筋融解を伴うことがあります。",
      severity: "caution",
    });
  }

  switch (form.culture) {
    case "Candida":
      addUnique(cultureNotes, {
        title: "Candida血症",
        details: "Candida血症を考慮。眼内炎評価のため眼科診察を検討してください。カテーテル関連血流感染、腹腔内感染、免疫抑制、TPNなどを背景として確認してください。",
        severity: "caution",
      });
      addUnique(additionalEvaluations, { title: "Candida血症", details: "眼科診察を検討します。", severity: "caution" });
      break;
    case "Staphylococcus aureus":
      addUnique(cultureNotes, {
        title: "黄色ブドウ球菌菌血症",
        details: "黄色ブドウ球菌菌血症では感染性心内膜炎、化膿性脊椎炎、深部膿瘍、デバイス感染を考慮し、心エコーを検討してください。",
        severity: "critical",
      });
      addUnique(additionalEvaluations, { title: "黄色ブドウ球菌菌血症", details: "心エコー、深部感染巣検索を検討します。", severity: "critical" });
      break;
    case "GPC＋GNR混在":
      addUnique(cultureNotes, {
        title: "GPC＋GNR混在",
        details: "GPCとGNRが混在する場合、嫌気性菌を含む混合感染を考慮してください。腹腔内感染、糖尿病足感染、褥瘡、深部膿瘍などを確認してください。",
        severity: "caution",
      });
      break;
    case "GNR":
      addUnique(cultureNotes, { title: "GNR菌血症", details: "GNR菌血症では尿路、胆道、腹腔内感染、カテーテル関連感染を確認してください。", severity: "caution" });
      break;
    case "GPC":
      addUnique(cultureNotes, {
        title: "GPC菌血症",
        details: "GPC菌血症では黄色ブドウ球菌、連鎖球菌、腸球菌、皮膚常在菌汚染の可能性を整理してください。複数セット陽性、デバイス、心雑音があれば感染性心内膜炎を考慮してください。",
        severity: "caution",
      });
      break;
    case "陰性":
      addUnique(cultureNotes, { title: "血液培養陰性", details: "血液培養陰性でも感染性心内膜炎、深部膿瘍、抗菌薬先行投与後の感染症は否定できません。", severity: "caution" });
      break;
  }

  if (hasFever && form.nonInfectious.anemia) {
    addUnique(additionalEvaluations, { title: "発熱＋貧血", details: "パルボウイルスB19、HUS、血液疾患なども考慮します。", severity: "caution" });
  }
  if (hasFever && form.nonInfectious.anemia && form.labs.plateletLow && form.labs.aki) {
    addUnique(additionalEvaluations, { title: "発熱＋貧血＋血小板低下＋AKI", details: "HUS/TMA、重症感染症、TAFROなども考慮します。", severity: "critical" });
  }

  let relativeBradycardia: Finding | null = null;
  if (validTemperature && validHeartRate) {
    const threshold = temperature * 10 - 323;
    if (heartRate < threshold) {
      relativeBradycardia = {
        title: "相対的徐脈の可能性",
        details: "簡易式「心拍数 < 体温 x 10 - 323」で判定しています。候補: レジオネラ、チフス、ブルセラ、レプトスピラ、サルモネラ、オウム病、マラリア、薬剤熱、腫瘍熱。",
        severity: "caution",
      };
      addUnique(cautions, {
        title: "相対的徐脈",
        details: `閾値 ${threshold.toFixed(0)} bpm、入力HR ${heartRate} bpmです。体温と心拍数の関係から相対的徐脈を考慮します。`,
        severity: "caution",
      });
    }
  }

  if (relativeBradycardia) {
    addUnique(nonInfectious, {
      title: "腫瘍熱",
      details: "相対的に頻脈が少ない、NSAIDsに反応する場合は、リンパ腫、白血病、腎細胞癌、肝細胞癌、副腎腫瘍、心臓粘液腫なども考慮します。",
      severity: "caution",
    });
  }

  if (form.exposures.newMedication || form.exposures.recentAntibiotics) {
    addUnique(nonInfectious, {
      title: "薬剤熱",
      details: "最近開始した薬剤または抗菌薬使用歴があれば薬剤熱を考慮します。中止後72〜96時間で解熱することが多いです。",
      severity: "caution",
    });
    addUnique(cautions, {
      title: "薬剤熱の代表薬",
      details: "ペニシリン、セファロスポリン、プロカインアミド、キニジン、フェニトイン、アムホテリシンB、バルビツール、メチルドパ、スルホンアミド、インターフェロンなど。",
      severity: "caution",
    });
  }

  if (form.betaBlockerCaBlockerAvBlockPacer && relativeBradycardia) {
    cautions.push({
      title: "徐脈判定の注意",
      details: "β遮断薬、Ca拮抗薬、房室ブロック、ペースメーカー装着では相対的徐脈の解釈に注意してください。",
      severity: "caution",
    });
  }

  if (form.immunosuppressed || form.exposures.immunosuppressants || form.emergency.neutropenia) {
    cautions.push({
      title: "免疫抑制・好中球減少",
      details: "発熱のみでも重症感染を否定できません。早期培養、画像、上級医または専門科相談を検討します。",
      severity: "caution",
    });
  }
  if (form.diabetes || form.ckdDialysis) {
    cautions.push({
      title: "重症化リスク",
      details: "糖尿病、CKD/透析では重症感染、非典型症状、耐性菌リスク、腎機能に応じた薬剤調整を意識します。",
      severity: "caution",
    });
  }
  if (!hasFever && nonInfectious.length > 0) {
    cautions.push({
      title: "感染症ではない可能性",
      details: "発熱が明確でない、または非感染症所見が目立つ場合は、感染症以外の炎症性疾患、薬剤性、悪性腫瘍も並行して検討します。",
      severity: "caution",
    });
  }
  if (form.symptoms.noSymptoms || form.exposures.urinaryCatheter) {
    cautions.push({
      title: "無症候性細菌尿への注意",
      details: "尿所見や尿培養陽性のみで尿路感染症と断定しないでください。発熱の他原因、尿路症状、全身状態、カテーテル関連所見をあわせて判断します。",
      severity: "caution",
    });
  }

  const infectionLikely =
    hasFever ||
    form.labs.wbcHigh ||
    form.labs.crpHigh ||
    infectionFoci.length > 0 ||
    criticalDiseases.length > 0 ||
    hasAny(form.emergency, ["shock", "respiratoryFailure", "alteredConsciousness", "meningealSigns", "neutropenia"]);

  if (infectionLikely) {
    tests.push(
      { title: "血液培養2セット", details: "抗菌薬投与前に可能な限り採取します。重症例や心内膜炎疑いでは複数セットを検討します。", severity: "test" },
      { title: "尿検査・尿培養", details: "尿路症状、腰背部痛、高齢者の非典型症状、カテーテル関連感染疑いで検討します。無症候性細菌尿との区別に注意します。", severity: "test" },
      { title: "胸部X線またはCT", details: "咳、痰、呼吸困難、低酸素、症状なしの高齢者で検討します。", severity: "test" },
      { title: "腹部エコーまたはCT", details: "腹痛、右季肋部痛、肝障害、感染巣不明で必要に応じて検討します。", severity: "test" },
    );
  }
  if (criticalDiseases.some((item) => item.title === "髄膜炎")) {
    tests.push({ title: "髄液検査", details: "頭部画像の必要性を判断後、髄液検査を検討します。", severity: "test" });
  }
  if (criticalDiseases.some((item) => item.title === "感染性心内膜炎")) {
    tests.push({ title: "心内膜炎評価", details: "血液培養複数セット、経胸壁/経食道心エコーを検討します。", severity: "test" });
  }
  if (form.labs.ldhHigh) {
    tests.push({ title: "LDH高値・感染巣不明", details: "血管内リンパ腫を考慮し、ランダム皮膚生検も検討します。", severity: "test" });
  }

  if (form.reassessment.unstableBp || form.reassessment.lactateNotImproved || form.reassessment.organFailureProgression || form.emergency.alteredConsciousness || form.emergency.respiratoryFailure) {
    reassessment.push({
      title: "重症感染症・敗血症として再評価",
      details: "重症感染症・敗血症として再評価を検討。感染巣検索、培養再確認、ソースコントロール、抗菌薬カバー範囲、集中治療適応を確認してください。",
      severity: "critical",
    });
  }
  if (form.reassessment.unknownSource || form.reassessment.organMismatch || form.reassessment.imagingNotDone || form.reassessment.contrastCtNotDone) {
    reassessment.push({
      title: "診断・感染巣の再評価",
      details: "診断・感染巣の再評価を検討します。感染性心内膜炎、深部膿瘍、化膿性脊椎炎、腸腰筋膿瘍、胆道感染、尿路閉塞を伴う腎盂腎炎、CDI、結核、真菌症、非感染症を候補にします。",
      severity: "candidate",
    });
  }
  if (form.reassessment.cultureNotSubmitted || form.reassessment.bloodCultureNotBeforeAntibiotics || (form.culture === "陰性" && form.reassessment.persistentFever)) {
    reassessment.push({
      title: "培養提出状況を再確認",
      details: "抗菌薬投与前の血液培養が未採取の場合、起因菌推定が難しくなります。発熱持続時は血液培養再提出、尿培養、喀痰培養、膿瘍穿刺培養、カテーテル培養などを検討してください。",
      severity: "candidate",
    });
  }
  if ((form.reassessment.abscess && form.reassessment.drainageNotDone) || form.reassessment.biliaryObstruction || form.reassessment.urinaryObstruction || form.reassessment.catheterInPlace || form.reassessment.prostheticDevice || form.reassessment.pressureUlcer || form.reassessment.diabeticFoot) {
    reassessment.push({
      title: "ソースコントロール不足を考慮",
      details: "抗菌薬のみでは改善しにくい感染巣があります。膿瘍ドレナージ、胆道ドレナージ、尿路閉塞解除、カテーテル抜去/交換、デバイス感染評価、創部デブリードマンを検討してください。",
      severity: "critical",
    });
  }
  if (form.reassessment.antibioticsWithin90d || form.reassessment.facilityResident || form.reassessment.longHospitalization || form.reassessment.esblHistory || form.reassessment.mrsaHistory || form.reassessment.pseudomonasRisk || form.reassessment.immunosuppressed || form.reassessment.biologics) {
    reassessment.push({
      title: "耐性菌・カバー不足を再評価",
      details: "ESBL産生菌、MRSA、緑膿菌、Enterococcus、嫌気性菌、非定型病原体、真菌、結核を候補に、感染臓器、培養結果、過去培養、抗菌薬曝露歴、施設入所歴をもとにカバー範囲を再評価してください。",
      severity: "caution",
    });
  }
  if (form.reassessment.immunosuppressed || form.reassessment.biologics || form.reassessment.fungalRisk || form.reassessment.tbRisk || form.reassessment.atypicalRisk || (form.reassessment.after48To72h && form.reassessment.persistentFever)) {
    reassessment.push({
      title: "通常細菌以外の感染症を考慮",
      details: "結核、PCP、真菌症、非結核性抗酸菌、レジオネラ、オウム病、ウイルス感染症を考慮します。抗酸菌塗抹・培養・PCR、β-Dグルカン、血清クリプトコッカス抗原、胸部CT、尿中抗原、必要に応じて専門科相談を検討してください。",
      severity: "caution",
    });
  }
  if (form.reassessment.renalDoseNotAdjusted || form.reassessment.hepaticCautionNotChecked || form.reassessment.weightObesityNotConsidered || form.reassessment.poorPenetrationSite || form.reassessment.poorAdherence || form.reassessment.drugInteraction) {
    reassessment.push({
      title: "薬剤側の問題を確認",
      details: "薬剤量、投与間隔、腎機能・肝機能、体重、感染巣への移行性、内服継続状況、相互作用を確認してください。",
      severity: "caution",
    });
  }
  if (form.reassessment.newMedication || form.reassessment.nsaidResponse || form.reassessment.weightLoss || form.reassessment.nightSweats || form.reassessment.ldhHigh || form.reassessment.arthralgia || form.reassessment.shoulderThighPain || form.reassessment.temporalTenderness || form.reassessment.legSwelling || form.reassessment.chestBackPain || form.reassessment.ckHigh || form.reassessment.ssri) {
    reassessment.push({
      title: "非感染症の再評価を検討",
      details: "薬剤熱、腫瘍熱、血管内リンパ腫、偽痛風、PMR/GCA、DVT/PE、大動脈疾患、心筋炎、セロトニン症候群を候補にします。抗菌薬反応不良時は、感染症の見直しだけでなく、非感染症の発熱も並行して再評価してください。",
      severity: "caution",
    });
  }
  if (form.reassessment.defervesced && form.reassessment.crpWbcImproved && !form.reassessment.unstableBp && !form.reassessment.organFailureProgression) {
    reassessment.push({
      title: "改善傾向あり",
      details: "培養結果、感染巣、臨床経過を確認し、de-escalation、治療期間、内服切替、退院可能性を検討してください。",
      severity: "test",
    });
  }

  if (criticalDiseases.length > 0) {
    actions.push("ABC、バイタル再評価、静脈路確保、モニター装着を行う");
    actions.push("重症感染が疑われる場合は、血液培養採取後に経験的治療と上級医/専門科相談を検討する");
  } else if (infectionFoci.length > 0 || nonInfectious.length > 0) {
    actions.push("感染巣と非感染症を並行して整理し、見逃してはいけない疾患に沿って検査を選ぶ");
    actions.push("バイタル変化、意識、呼吸状態、疼痛の進行を再評価する");
  } else {
    actions.push("追加問診、再診察、基本検査で感染巣と非感染症の手がかりを探す");
  }
  actions.push("本ツールの候補を診断確定とせず、患者背景・身体所見・施設プロトコルに照らして最終判断する");

  const antibiotics = [
    {
      title: "抗菌薬が必要な可能性",
      details: "第1版では抗菌薬名の具体的推奨は行いません。耐性菌リスク、腎機能、肝機能、年齢、心血管リスクを評価したうえで選択してください。",
      severity: "caution" as const,
    },
    {
      title: "培養採取後に経験的治療を検討",
      details: "敗血症、髄膜炎、壊死性筋膜炎など時間依存の病態では、培養採取後に経験的治療を検討し、治療開始の遅れを避けます。",
      severity: "caution" as const,
    },
  ];

  const urgencyTone = criticalDiseases.length > 0 ? "red" : cautions.length > 0 ? "orange" : "green";
  const urgency =
    urgencyTone === "red"
      ? "高: 今すぐ除外すべき疾患あり"
      : urgencyTone === "orange"
        ? "中: 注意疾患・重症化リスクあり"
        : "低〜中: 継続評価";

  return { urgency, urgencyTone, infectionFoci, criticalDiseases, nonInfectious, tests, cautions, actions, antibiotics, cultureNotes, additionalEvaluations, reassessment, relativeBradycardia };
}
