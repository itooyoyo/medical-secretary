"use client";

import { useMemo, useState } from "react";

type Tone = "red" | "orange" | "blue" | "green";

type Item = {
  title: string;
  detail: string;
  tone: Tone;
};

type WizardState = {
  age: string;
  temperature: string;
  heartRate: string;
  systolicBp: string;
  spo2: string;
  emergency: Record<string, boolean>;
  infection: Record<string, boolean>;
  organ: string;
  organDetails: Record<string, boolean>;
  nonInfectious: Record<string, boolean>;
  culture: string;
  reassessment: Record<string, boolean>;
};

const steps = [
  "緊急性",
  "感染症らしさ",
  "感染臓器",
  "非感染症",
  "推奨検査",
  "培養結果",
  "再評価",
];

const organOptions = [
  "呼吸器",
  "尿路",
  "腹腔内/胆道",
  "皮膚軟部組織",
  "中枢神経",
  "骨関節",
  "血流感染/感染性心内膜炎",
  "デバイス感染",
  "感染臓器不明",
];

const initialState: WizardState = {
  age: "",
  temperature: "",
  heartRate: "",
  systolicBp: "",
  spo2: "",
  emergency: {
    shock: false,
    alteredMentalStatus: false,
    respiratoryFailure: false,
    lowSpo2: false,
    meningealSigns: false,
    neutropenia: false,
    immunosuppressed: false,
    severePain: false,
    necrotizingSkin: false,
  },
  infection: {
    wbcHigh: false,
    crpHigh: false,
    chills: false,
    localSymptoms: false,
    newMedication: false,
    recentAntibiotics: false,
    malignancyHistory: false,
    collagenDiseaseHistory: false,
    betaCaBlockerAvBlockPacer: false,
  },
  organ: "",
  organDetails: {},
  nonInfectious: {
    acuteJointPain: false,
    jointSwelling: false,
    kneePain: false,
    polyarthralgia: false,
    acuteNeckPain: false,
    limitedNeckRotation: false,
    shoulderPain: false,
    thighPain: false,
    morningStiffness: false,
    temporalHeadache: false,
    shoulderThighPain: false,
    temporalTenderness: false,
    jawClaudication: false,
    visualDisturbance: false,
    newMedication: false,
    recentAntibiotics: false,
    weightLoss: false,
    nightSweats: false,
    ldhHigh: false,
    anemia: false,
    aki: false,
    legSwelling: false,
    dvtHistory: false,
    peSymptoms: false,
    chestPain: false,
    shortnessOfBreath: false,
    chestSymptoms: false,
    ssri: false,
    ckHigh: false,
    tremor: false,
    sweating: false,
    rigidity: false,
    autonomicSymptoms: false,
    plateletLow: false,
    edema: false,
    renalDysfunction: false,
    organomegaly: false,
    nsaidResponse: false,
    hematologicCancer: false,
  },
  culture: "未提出",
  reassessment: {
    after48To72h: false,
    defervesced: false,
    persistentFever: false,
    recurrentFever: false,
    crpWbcImproved: false,
    crpWbcNotImproved: false,
    lactateNotImproved: false,
    unstableBp: false,
    organFailureProgression: false,
    unknownSource: false,
    organMismatch: false,
    cultureNotSubmitted: false,
    bloodCultureNotBeforeAntibiotics: false,
    imagingNotDone: false,
    contrastCtNotDone: false,
    echoNotDone: false,
    backPainMriNotDone: false,
    abscess: false,
    drainageNotDone: false,
    biliaryObstruction: false,
    urinaryObstruction: false,
    catheterInPlace: false,
    prostheticDevice: false,
    pressureUlcer: false,
    diabeticFoot: false,
    antibioticsWithin90d: false,
    facilityResident: false,
    longHospitalization: false,
    esblHistory: false,
    mrsaHistory: false,
    pseudomonasRisk: false,
    immunosuppressed: false,
    biologics: false,
    fungalRisk: false,
    tbRisk: false,
    atypicalRisk: false,
    renalDoseNotAdjusted: false,
    hepaticCautionNotChecked: false,
    weightObesityNotConsidered: false,
    poorPenetrationSite: false,
    poorAdherence: false,
    drugInteraction: false,
    newMedication: false,
    nsaidResponse: false,
    weightLoss: false,
    nightSweats: false,
    ldhHigh: false,
    arthralgia: false,
    shoulderThighPain: false,
    temporalTenderness: false,
    legSwelling: false,
    chestBackPain: false,
    ckHigh: false,
    ssri: false,
    cultureReviewed: false,
    sourceFound: false,
    abscessNeedsDrainage: false,
    antibioticDoseAppropriate: false,
    renalDoseAdjusted: false,
    nonInfectiousReviewed: false,
  },
};

const emergencyLabels: Record<string, string> = {
  shock: "ショック",
  alteredMentalStatus: "意識障害",
  respiratoryFailure: "呼吸不全",
  lowSpo2: "SpO2低下",
  meningealSigns: "髄膜刺激徴候",
  neutropenia: "好中球減少",
  immunosuppressed: "免疫抑制",
  severePain: "強い疼痛",
  necrotizingSkin: "壊死性筋膜炎を疑う皮膚所見",
};

const infectionLabels: Record<string, string> = {
  wbcHigh: "WBC高値",
  crpHigh: "CRP高値",
  chills: "悪寒戦慄",
  localSymptoms: "局所症状あり",
  newMedication: "最近の薬剤開始",
  recentAntibiotics: "最近の抗菌薬使用",
  malignancyHistory: "悪性腫瘍既往",
  collagenDiseaseHistory: "膠原病既往",
  betaCaBlockerAvBlockPacer: "β遮断薬/Ca拮抗薬/房室ブロック/ペースメーカー",
};

const nonInfectiousLabels: Record<string, string> = {
  acuteJointPain: "急性関節痛",
  jointSwelling: "関節腫脹",
  kneePain: "膝関節痛",
  polyarthralgia: "多関節痛",
  acuteNeckPain: "急性頸部痛",
  limitedNeckRotation: "頸部回旋制限",
  shoulderPain: "肩痛",
  thighPain: "大腿痛",
  morningStiffness: "朝のこわばり",
  temporalHeadache: "側頭部痛",
  shoulderThighPain: "肩や大腿の痛み",
  temporalTenderness: "側頭動脈圧痛",
  jawClaudication: "顎跛行",
  visualDisturbance: "視力障害",
  newMedication: "最近開始した薬剤",
  recentAntibiotics: "抗菌薬使用歴",
  weightLoss: "体重減少",
  nightSweats: "夜間発汗",
  ldhHigh: "LDH高値",
  anemia: "貧血",
  aki: "AKI",
  legSwelling: "下肢腫脹",
  dvtHistory: "DVT既往・リスク",
  peSymptoms: "肺塞栓を疑う症状",
  chestPain: "胸痛",
  shortnessOfBreath: "息切れ",
  chestSymptoms: "胸部症状",
  ssri: "SSRI使用",
  ckHigh: "CK上昇",
  tremor: "振戦",
  sweating: "発汗",
  rigidity: "筋強剛",
  autonomicSymptoms: "自律神経症状",
  plateletLow: "血小板低下",
  edema: "浮腫",
  renalDysfunction: "腎機能障害",
  organomegaly: "臓器腫大",
  nsaidResponse: "NSAIDsに反応",
  hematologicCancer: "血液腫瘍などの既往/疑い",
};

const organQuestions: Record<string, Record<string, string>> = {
  呼吸器: {
    cough: "咳",
    sputum: "痰",
    sputumIncrease: "痰増加",
    purulentSputum: "膿性痰",
    dyspnea: "呼吸困難",
    chestPain: "胸痛",
    lowSpo2: "SpO2低下",
    imagingAbnormal: "胸部X線/CT異常",
    noPneumoniaImage: "胸部X線/CTで明らかな肺炎像なし",
    smoker: "喫煙歴",
    copd: "COPD既往",
    immunosuppressed: "免疫抑制",
    biologics: "生物学的製剤使用",
  },
  尿路: {
    dysuria: "排尿痛",
    frequency: "頻尿",
    cvaTenderness: "CVA叩打痛",
    backPain: "腰背部痛",
    urinaryCatheter: "尿カテーテル",
    prostateSymptoms: "前立腺症状",
    diabetes: "糖尿病",
    ckdDialysis: "CKD/透析",
  },
  "腹腔内/胆道": {
    abdominalPain: "腹痛",
    ruqPain: "右季肋部痛",
    jaundice: "黄疸",
    liverInjury: "肝障害",
    diarrhea: "下痢",
    recentAntibiotics: "最近の抗菌薬使用",
    recentHospitalization: "入院中または最近の入院",
    ppi: "PPI使用",
    olderAdult: "高齢者",
    immunosuppressed: "免疫抑制",
    abdominalSurgery: "腹部手術歴",
  },
  皮膚軟部組織: {
    redness: "発赤",
    swelling: "腫脹",
    warmth: "熱感",
    severePain: "強い疼痛",
    desquamation: "皮膚剥離",
    diabeticFoot: "糖尿病足",
    pressureUlcer: "褥瘡",
    trauma: "外傷",
    blister: "水疱",
    necrosis: "壊死",
  },
  中枢神経: {
    headache: "頭痛",
    neckStiffness: "項部硬直",
    alteredMentalStatus: "意識障害",
    seizure: "痙攣",
    acuteNeckPain: "急性頸部痛",
    limitedNeckRotation: "頸部回旋制限",
  },
  骨関節: {
    arthralgia: "関節痛",
    jointSwelling: "関節腫脹",
    kneePain: "膝関節痛",
    polyarthralgia: "多関節痛",
    prostheticJoint: "人工関節",
    backPain: "腰背部痛",
    postOpTrauma: "手術後/外傷後",
    sternoclavicularPain: "前胸部痛/肩痛＋胸鎖関節圧痛",
  },
  "血流感染/感染性心内膜炎": {
    chills: "悪寒戦慄",
    bloodCulturePositive: "血液培養陽性",
    murmur: "心雑音",
    prostheticValve: "人工弁",
    pacemaker: "ペースメーカー",
    dialysis: "透析",
    skinLesions: "Janeway病変/Osler結節など",
    backPain: "腰痛",
    embolicSymptoms: "脳塞栓症状",
    mixedGpcGnr: "血液培養でGPC＋GNR混在",
    staphAureus: "黄色ブドウ球菌菌血症",
  },
  デバイス感染: {
    centralLine: "CVカテーテル",
    port: "ポート",
    urinaryCatheter: "尿道カテーテル",
    prostheticValve: "人工弁",
    pacemaker: "ペースメーカー",
    prostheticJoint: "人工関節",
  },
  感染臓器不明: {
    crpHigh: "CRP高値",
    ldhHigh: "LDH高値",
    anemia: "貧血",
    plateletLow: "血小板低下",
    weightLoss: "体重減少",
    nightSweats: "夜間発汗",
    backPain: "腰背部痛",
    temporalTenderness: "側頭動脈圧痛",
    shoulderThighPain: "肩/大腿の痛み",
    legSwelling: "下肢腫脹",
    murmur: "心雑音",
    prostheticValvePacer: "人工弁/ペースメーカー",
    bloodCulturePositive: "血液培養陽性",
    neckInfection: "頸部感染",
    soreThroat: "咽頭痛",
    neckPain: "頸部痛",
    chestBackPain: "胸背部痛",
  },
};

const cultureOptions = [
  "未提出",
  "陰性",
  "GPC",
  "GNR",
  "GPC＋GNR混在",
  "Candida",
  "Staphylococcus aureus",
  "Streptococcus",
  "Enterococcus",
];

const reassessmentLabels: Record<string, string> = {
  after48To72h: "抗菌薬開始後48〜72時間経過",
  defervesced: "解熱した",
  persistentFever: "発熱持続",
  recurrentFever: "再燃",
  crpWbcImproved: "CRP/WBCが改善した",
  crpWbcNotImproved: "CRP/WBC改善なし",
  lactateNotImproved: "乳酸改善なし",
  unstableBp: "血圧不安定",
  organFailureProgression: "臓器障害進行",
  unknownSource: "感染巣未確定",
  organMismatch: "感染臓器と症状が一致しない",
  cultureNotSubmitted: "培養未提出",
  bloodCultureNotBeforeAntibiotics: "抗菌薬投与前に血液培養未採取",
  imagingNotDone: "画像検査未施行",
  contrastCtNotDone: "造影CT未施行",
  echoNotDone: "心エコー未施行",
  backPainMriNotDone: "腰背部痛があるがMRI未施行",
  abscess: "膿瘍あり",
  drainageNotDone: "ドレナージ未実施",
  biliaryObstruction: "胆道閉塞あり",
  urinaryObstruction: "尿路閉塞あり",
  catheterInPlace: "カテーテル留置中",
  prostheticDevice: "人工物/デバイスあり",
  pressureUlcer: "褥瘡あり",
  diabeticFoot: "糖尿病足あり",
  antibioticsWithin90d: "90日以内抗菌薬使用",
  facilityResident: "施設入所",
  longHospitalization: "長期入院",
  esblHistory: "ESBL既往",
  mrsaHistory: "MRSA既往",
  pseudomonasRisk: "緑膿菌リスク",
  immunosuppressed: "免疫抑制",
  biologics: "生物学的製剤使用",
  fungalRisk: "真菌リスク",
  tbRisk: "結核リスク",
  atypicalRisk: "非定型感染リスク",
  renalDoseNotAdjusted: "腎機能に応じた投与量未調整",
  hepaticCautionNotChecked: "肝機能に応じた薬剤注意が未確認",
  weightObesityNotConsidered: "体重/肥満を考慮していない",
  poorPenetrationSite: "移行性が悪い感染巣の可能性",
  poorAdherence: "内服アドヒアランス不良",
  drugInteraction: "薬剤相互作用あり",
  newMedication: "最近開始した薬剤あり",
  nsaidResponse: "NSAIDsで解熱",
  weightLoss: "体重減少",
  nightSweats: "夜間発汗",
  ldhHigh: "LDH高値",
  arthralgia: "関節痛",
  shoulderThighPain: "肩痛/大腿痛",
  temporalTenderness: "側頭動脈圧痛",
  legSwelling: "下肢腫脹",
  chestBackPain: "胸背部痛",
  ckHigh: "CK高値",
  ssri: "SSRI使用",
  cultureReviewed: "血液培養結果を確認した",
  sourceFound: "画像で感染巣が見つかった",
  abscessNeedsDrainage: "ドレナージ必要な膿瘍がある",
  antibioticDoseAppropriate: "抗菌薬投与量は適切",
  renalDoseAdjusted: "腎機能に応じた調整ができている",
  nonInfectiousReviewed: "非感染症の可能性を再評価した",
};

function toNumber(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function hasAny(record: Record<string, boolean>, keys: string[]) {
  return keys.some((key) => record[key]);
}

function addUnique(items: Item[], item: Item) {
  if (!items.some((existing) => existing.title === item.title)) {
    items.push(item);
  }
}

function assess(state: WizardState) {
  const age = toNumber(state.age);
  const temperature = toNumber(state.temperature);
  const heartRate = toNumber(state.heartRate);
  const systolicBp = toNumber(state.systolicBp);
  const spo2 = toNumber(state.spo2);
  const validTemp = Number.isFinite(temperature) && temperature >= 30 && temperature <= 45;
  const validHr = Number.isFinite(heartRate) && heartRate >= 20 && heartRate <= 250;
  const hasFever = validTemp && temperature >= 37.5;
  const age70 = Number.isFinite(age) && age >= 70;
  const hypotension = Number.isFinite(systolicBp) && systolicBp < 90;
  const lowSpo2 = Number.isFinite(spo2) && spo2 < 92;
  const d = state.organDetails;

  const danger: Item[] = [];
  const infectionLikelihood: Item[] = [];
  const organFindings: Item[] = [];
  const critical: Item[] = [];
  const nonInfectious: Item[] = [];
  const tests: Item[] = [];
  const cultureNotes: Item[] = [];
  const additionalEvaluations: Item[] = [];
  const reassessment: Item[] = [];
  const actions: string[] = [];

  if (state.emergency.shock || hypotension || state.emergency.alteredMentalStatus || state.emergency.respiratoryFailure || state.emergency.lowSpo2 || lowSpo2) {
    addUnique(danger, { title: "敗血症・重症感染症", detail: "緊急対応を優先します。血液培養2セット、乳酸、臓器障害評価、感染巣検索、必要に応じて培養採取後に経験的抗菌薬を検討します。", tone: "red" });
  }
  if (state.emergency.meningealSigns || (d.headache && d.neckStiffness) || (d.acuteNeckPain && d.alteredMentalStatus)) {
    addUnique(danger, { title: "髄膜炎", detail: "頭痛、項部硬直、意識障害、髄膜刺激徴候では髄膜炎を考慮します。頭部画像の必要性を判断し、髄液検査を検討します。", tone: "red" });
  }
  if (state.emergency.neutropenia) {
    addUnique(danger, { title: "好中球減少性発熱", detail: "好中球減少を伴う発熱では重症感染症として早期評価を検討します。", tone: "red" });
  }
  if ((state.emergency.severePain && state.emergency.necrotizingSkin) || (d.severePain && (d.necrosis || d.blister))) {
    addUnique(danger, { title: "壊死性筋膜炎", detail: "疼痛が皮膚所見に比して強い場合は壊死性筋膜炎を考慮し、外科相談を含めて緊急対応を検討します。", tone: "red" });
  }
  if (state.emergency.immunosuppressed) {
    addUnique(danger, { title: "免疫抑制下の重症感染症", detail: "発熱のみでも重症感染症を否定できません。早期培養、画像、専門科相談を検討します。", tone: "red" });
  }

  if (hasFever && state.infection.chills && (state.infection.wbcHigh || state.infection.crpHigh)) {
    infectionLikelihood.push({ title: "感染症を考慮", detail: "発熱、悪寒戦慄、炎症反応高値の組み合わせから感染症を考慮します。", tone: "blue" });
  }
  if (!state.infection.localSymptoms) {
    infectionLikelihood.push({ title: "感染症以外も鑑別", detail: "局所症状が乏しい場合は、薬剤熱、腫瘍熱、膠原病、血栓症、CPPDなども並行して検討します。", tone: "orange" });
  }
  if (validTemp && validHr && heartRate < temperature * 10 - 323) {
    infectionLikelihood.push({
      title: "相対的徐脈の可能性",
      detail: "心拍数 < 体温 x 10 - 323 に該当します。レジオネラ、チフス、ブルセラ、レプトスピラ、サルモネラ、オウム病、マラリア、薬剤熱、腫瘍熱を考慮します。",
      tone: "orange",
    });
    nonInfectious.push({ title: "腫瘍熱", detail: "相対的に頻脈が少ない、NSAIDsに反応、血液腫瘍などがある場合は腫瘍熱を考慮します。", tone: "orange" });
  }
  if (state.infection.betaCaBlockerAvBlockPacer) {
    infectionLikelihood.push({ title: "相対的徐脈判定の注意", detail: "β遮断薬、Ca拮抗薬、房室ブロック、ペースメーカー装着では相対的徐脈の解釈に注意してください。", tone: "orange" });
  }

  switch (state.organ) {
    case "呼吸器":
      if (hasAny(d, ["cough", "sputum", "dyspnea", "imagingAbnormal"])) addUnique(organFindings, { title: "肺炎", detail: "咳、痰、呼吸困難、画像異常があれば肺炎を考慮します。", tone: "blue" });
      if (d.copd || d.smoker) addUnique(organFindings, { title: "COPD増悪", detail: "喫煙者・COPDでは明らかな肺陰影を伴わないCOPD増悪も考慮します。", tone: "blue" });
      if ((d.smoker || d.copd) && hasFever && hasAny(d, ["cough", "sputumIncrease", "purulentSputum", "dyspnea"]) && d.noPneumoniaImage) {
        addUnique(organFindings, {
          title: "COPD増悪",
          detail: "喫煙者・COPD患者では、明らかな肺陰影を呈さず発熱・呼吸器症状をきたすCOPD増悪も考慮してください。肺炎、心不全、肺塞栓、気胸との鑑別も重要です。",
          tone: "orange",
        });
      }
      if (d.chestPain) addUnique(organFindings, { title: "胸膜炎", detail: "胸痛を伴う場合は胸膜炎を考慮します。", tone: "blue" });
      if (d.immunosuppressed || d.biologics) {
        ["肺結核", "PCP", "薬剤性肺炎", "リウマチ肺", "真菌症"].forEach((title) => addUnique(organFindings, { title, detail: "生物学的製剤使用中や免疫抑制下では、結核、PCP、真菌症、薬剤性肺炎も考慮します。", tone: "orange" }));
      }
      break;
    case "尿路":
      if (d.dysuria || d.frequency) addUnique(organFindings, { title: "膀胱炎", detail: "排尿痛、頻尿があれば膀胱炎を考慮します。", tone: "blue" });
      if (d.cvaTenderness || d.backPain) addUnique(organFindings, { title: "腎盂腎炎", detail: "CVA叩打痛や腰背部痛を伴う場合は腎盂腎炎を考慮します。", tone: "blue" });
      if (d.prostateSymptoms) addUnique(organFindings, { title: "前立腺炎", detail: "前立腺症状を伴う場合は前立腺炎を考慮します。", tone: "blue" });
      if (d.urinaryCatheter) addUnique(organFindings, { title: "カテーテル関連尿路感染", detail: "尿カテーテル留置中ではカテーテル関連尿路感染を考慮します。高齢者では無症候性細菌尿との鑑別が重要です。", tone: "orange" });
      if (d.diabetes || d.ckdDialysis) addUnique(critical, { title: "気腫性腎盂腎炎", detail: "糖尿病やCKD/透析では重症尿路感染、気腫性腎盂腎炎を考慮します。", tone: "red" });
      break;
    case "腹腔内/胆道":
      if (d.ruqPain || d.jaundice || d.liverInjury) {
        addUnique(organFindings, { title: "胆管炎", detail: "右季肋部痛、黄疸、肝障害では胆管炎を考慮します。", tone: "blue" });
        addUnique(organFindings, { title: "胆嚢炎", detail: "右季肋部痛を伴う発熱では胆嚢炎を考慮します。", tone: "blue" });
      }
      if (d.abdominalPain) ["憩室炎", "虫垂炎", "腹腔内膿瘍"].forEach((title) => addUnique(organFindings, { title, detail: "腹痛を伴う場合は腹腔内感染を考慮します。", tone: "blue" }));
      if (d.diarrhea && d.recentAntibiotics) addUnique(critical, { title: "CDI", detail: "下痢＋発熱＋抗菌薬使用歴ではCDIを必ず考慮します。", tone: "red" });
      if (hasFever && d.diarrhea && (d.recentAntibiotics || d.recentHospitalization)) {
        addUnique(organFindings, {
          title: "Clostridioides difficile infection（CDI）",
          detail: "下痢＋発熱＋抗菌薬使用歴ではCDIを必ず考慮してください。重症例では脱水、AKI、低アルブミン、麻痺性イレウス、中毒性巨大結腸症に注意してください。",
          tone: "orange",
        });
      }
      break;
    case "皮膚軟部組織":
      if (d.redness || d.swelling || d.warmth) addUnique(organFindings, { title: "蜂窩織炎", detail: "発赤、腫脹、熱感があれば蜂窩織炎を考慮します。", tone: "blue" });
      if (d.severePain || d.necrosis || d.blister) addUnique(critical, { title: "壊死性筋膜炎", detail: "疼痛が皮膚所見に比して強い場合、水疱、壊死がある場合は壊死性筋膜炎を考慮します。", tone: "red" });
      if (d.desquamation) ["SSSS", "中毒性ショック症候群"].forEach((title) => addUnique(critical, { title, detail: "皮膚剥離を伴う発熱では重症皮膚感染・毒素性疾患を考慮します。", tone: "red" }));
      if (d.diabeticFoot) addUnique(organFindings, { title: "糖尿病足感染", detail: "糖尿病足では深部感染や混合感染を考慮します。", tone: "orange" });
      break;
    case "中枢神経":
      if (d.headache || d.neckStiffness || d.alteredMentalStatus || d.seizure) {
        addUnique(critical, { title: "髄膜炎", detail: "頭痛、項部硬直、意識障害、痙攣では髄膜炎を考慮します。", tone: "red" });
        addUnique(critical, { title: "脳炎", detail: "意識障害や痙攣を伴う場合は脳炎も考慮します。", tone: "red" });
      }
      if ((age70 && hasFever && d.acuteNeckPain) || (d.acuteNeckPain && d.limitedNeckRotation) || (d.acuteNeckPain && state.infection.crpHigh)) {
        addUnique(nonInfectious, { title: "Crowned dens syndrome", detail: "高齢者の発熱＋急性頸部痛ではCDSも考慮します。CTで軸椎歯突起周囲の石灰化を確認します。髄膜炎、化膿性脊椎炎との鑑別が重要です。", tone: "orange" });
      }
      break;
    case "骨関節":
      if (d.arthralgia || d.jointSwelling || d.prostheticJoint) addUnique(critical, { title: "化膿性関節炎", detail: "発熱、強い疼痛、関節腫脹、人工関節では化膿性関節炎を考慮し、関節穿刺を検討します。", tone: "red" });
      if ((age70 && hasFever && d.arthralgia) || (age70 && state.infection.crpHigh && d.arthralgia) || (age70 && d.kneePain) || (d.polyarthralgia && hasFever) || (d.postOpTrauma && d.arthralgia)) {
        addUnique(nonInfectious, { title: "偽痛風 / CPPD", detail: "偽痛風でも38℃以上の発熱やCRP高値を伴います。急性期は化膿性関節炎との鑑別が困難です。", tone: "orange" });
      }
      if (d.backPain) ["化膿性脊椎炎", "腸腰筋膿瘍"].forEach((title) => addUnique(critical, { title, detail: "腰背部痛を伴う発熱では深部感染を考慮します。", tone: "red" }));
      if (d.sternoclavicularPain) addUnique(critical, { title: "胸鎖関節炎", detail: "前胸部痛または肩痛＋胸鎖関節圧痛では胸鎖関節炎を考慮します。", tone: "red" });
      break;
    case "血流感染/感染性心内膜炎":
      if (d.chills || d.bloodCulturePositive) addUnique(critical, { title: "菌血症", detail: "悪寒戦慄や血液培養陽性では菌血症を考慮します。", tone: "red" });
      if (hasAny(d, ["murmur", "prostheticValve", "pacemaker", "dialysis", "skinLesions", "embolicSymptoms"])) addUnique(critical, { title: "感染性心内膜炎", detail: "心雑音、人工弁、ペースメーカー、透析、皮膚所見、塞栓症状では感染性心内膜炎を考慮します。", tone: "red" });
      if (d.staphAureus) addUnique(critical, { title: "黄色ブドウ球菌菌血症", detail: "黄色ブドウ球菌菌血症では心エコーを検討します。", tone: "red" });
      if (d.mixedGpcGnr) addUnique(critical, { title: "混合感染", detail: "血液培養でGPCとGNRが混在する場合は嫌気性菌を含む混合感染、腹腔内感染、糖尿病足、褥瘡を考慮します。", tone: "red" });
      if (d.backPain) addUnique(critical, { title: "化膿性脊椎炎・深部膿瘍", detail: "菌血症に腰痛を伴う場合は化膿性脊椎炎や深部膿瘍を考慮します。", tone: "red" });
      break;
    case "デバイス感染":
      if (d.centralLine || d.port) addUnique(critical, { title: "CRBSI", detail: "CVカテーテル、ポート留置中の発熱ではCRBSIを考慮します。", tone: "red" });
      if (d.urinaryCatheter) addUnique(organFindings, { title: "カテーテル関連尿路感染", detail: "尿道カテーテルではカテーテル関連尿路感染を考慮します。", tone: "blue" });
      if (d.prostheticValve) addUnique(critical, { title: "人工弁感染", detail: "人工弁がある場合は感染性心内膜炎を考慮します。", tone: "red" });
      if (d.pacemaker) addUnique(critical, { title: "ペースメーカー感染", detail: "ペースメーカー感染やリード感染を考慮します。", tone: "red" });
      if (d.prostheticJoint) addUnique(critical, { title: "人工関節感染", detail: "人工関節周囲感染を考慮します。", tone: "red" });
      break;
    case "感染臓器不明":
      ["感染性心内膜炎", "菌血症", "敗血症", "深部膿瘍"].forEach((title) => addUnique(critical, { title, detail: "感染臓器不明の発熱では、血流感染や深部感染巣を見逃さないように検討します。", tone: "red" }));
      if (state.infection.crpHigh || d.crpHigh) {
        ["感染性心内膜炎", "菌血症", "敗血症", "深部膿瘍", "化膿性脊椎炎", "腸腰筋膿瘍"].forEach((title) => addUnique(critical, {
          title,
          detail: "感染臓器が不明なCRP高値では、深部感染巣や血流感染を見逃さないように検討します。深部膿瘍が疑われる場合は造影CTや必要に応じたドレナージ適応を検討してください。",
          tone: "red",
        }));
        ["悪性腫瘍", "血管内リンパ腫", "リウマチ性多発筋痛症", "巨細胞性動脈炎", "DVT/PE", "大動脈瘤", "大動脈解離"].forEach((title) => addUnique(nonInfectious, {
          title,
          detail: "感染臓器が不明なCRP高値では、感染症だけでなく悪性腫瘍、膠原病、血栓症、大動脈疾患も再評価してください。",
          tone: "orange",
        }));
      }
      if (d.ldhHigh) addUnique(nonInfectious, { title: "血管内リンパ腫", detail: "LDH高値＋感染巣不明では血管内リンパ腫を考慮し、ランダム皮膚生検も検討します。", tone: "orange" });
      if (d.weightLoss || d.nightSweats || state.infection.malignancyHistory) addUnique(nonInfectious, { title: "悪性腫瘍", detail: "体重減少、夜間発汗、悪性腫瘍既往では腫瘍熱も考慮します。", tone: "orange" });
      if (d.shoulderThighPain) addUnique(nonInfectious, { title: "リウマチ性多発筋痛症", detail: "肩/大腿の痛みを伴う発熱ではPMRを考慮します。", tone: "orange" });
      if (d.temporalTenderness) addUnique(nonInfectious, { title: "巨細胞性動脈炎", detail: "側頭動脈圧痛を伴う場合は巨細胞性動脈炎を考慮します。", tone: "orange" });
      if (d.chestBackPain) ["大動脈瘤", "大動脈解離"].forEach((title) => addUnique(critical, { title, detail: "胸背部痛を伴う場合は大動脈疾患も検討します。", tone: "red" }));
      if ((d.neckInfection || d.soreThroat || d.neckPain) && d.bloodCulturePositive) {
        addUnique(critical, {
          title: "内頸静脈血栓 / Lemierre症候群",
          detail: "頸部感染や咽頭痛、頸部痛、菌血症がある場合は内頸静脈血栓やLemierre症候群も考慮してください。",
          tone: "red",
        });
      }
      break;
  }

  if (state.infection.newMedication || state.infection.recentAntibiotics) addUnique(nonInfectious, { title: "薬剤熱", detail: "最近開始した薬剤や抗菌薬使用歴があれば薬剤熱を考慮します。", tone: "orange" });
  if (state.nonInfectious.nsaidResponse || state.nonInfectious.hematologicCancer) addUnique(nonInfectious, { title: "腫瘍熱", detail: "相対的に頻脈が少ない、NSAIDs反応、血液腫瘍などでは腫瘍熱を考慮します。", tone: "orange" });
  if (state.nonInfectious.shoulderThighPain) addUnique(nonInfectious, { title: "PMR/GCA", detail: "肩や大腿痛、側頭動脈圧痛ではPMR/GCAを考慮します。", tone: "orange" });
  if (state.nonInfectious.temporalTenderness) addUnique(nonInfectious, { title: "巨細胞性動脈炎", detail: "側頭動脈圧痛では巨細胞性動脈炎を考慮します。", tone: "orange" });
  if (state.nonInfectious.legSwelling || state.nonInfectious.dvtHistory || state.nonInfectious.peSymptoms) addUnique(nonInfectious, { title: "血栓症", detail: "下肢腫脹、DVTリスク、肺塞栓症状があれば血栓症を考慮します。", tone: "orange" });
  if (state.nonInfectious.chestSymptoms) addUnique(critical, { title: "心筋炎", detail: "発熱＋胸部症状では心筋炎を考慮します。胸部症状が乏しい場合も経過に注意します。", tone: "red" });
  if (state.nonInfectious.ssri && state.nonInfectious.ckHigh && state.nonInfectious.autonomicSymptoms) addUnique(nonInfectious, { title: "セロトニン症候群", detail: "SSRI使用＋CK上昇＋自律神経症状ではセロトニン症候群を考慮します。", tone: "orange" });
  if (state.nonInfectious.plateletLow && state.nonInfectious.edema && hasFever && state.nonInfectious.renalDysfunction && state.nonInfectious.organomegaly) addUnique(nonInfectious, { title: "TAFRO症候群", detail: "血小板低下、浮腫、発熱、腎機能障害、臓器腫大ではTAFRO症候群を考慮します。", tone: "orange" });

  const age50 = Number.isFinite(age) && age >= 50;
  const unknownSource = state.organ === "感染臓器不明" || !state.infection.localSymptoms;
  const cppdLikely =
    (age70 && hasFever && state.nonInfectious.acuteJointPain) ||
    (state.infection.crpHigh && state.nonInfectious.acuteJointPain) ||
    state.nonInfectious.kneePain ||
    state.nonInfectious.polyarthralgia;
  if (cppdLikely) {
    addUnique(nonInfectious, {
      title: "偽痛風 / CPPD",
      detail: "偽痛風 / CPPDを考慮します。偽痛風でも38℃以上の発熱やCRP高値を伴うことがあります。急性期には化膿性関節炎との鑑別が困難であり、関節穿刺、グラム染色、培養を検討してください。",
      tone: "orange",
    });
  }

  if ((age70 && hasFever && state.nonInfectious.acuteNeckPain) || (state.nonInfectious.acuteNeckPain && state.nonInfectious.limitedNeckRotation)) {
    addUnique(nonInfectious, {
      title: "Crowned dens syndrome",
      detail: "高齢者の発熱＋急性頸部痛ではCrowned dens syndromeを考慮します。髄膜炎、化膿性脊椎炎、PMRとの鑑別が重要です。MRIでは石灰化が見えにくく、頸椎CTで軸椎歯突起周囲の石灰化を確認します。",
      tone: "orange",
    });
  }

  if (age50 && hasFever && (state.nonInfectious.shoulderPain || state.nonInfectious.thighPain || state.nonInfectious.shoulderThighPain) && state.nonInfectious.morningStiffness) {
    addUnique(nonInfectious, {
      title: "リウマチ性多発筋痛症（PMR）",
      detail: "50歳以上の発熱、肩痛または大腿痛、朝のこわばりではPMRを考慮します。感染症、悪性腫瘍、GCAの合併を除外しながら評価してください。",
      tone: "orange",
    });
  }

  if (age50 && hasFever && (state.nonInfectious.temporalHeadache || state.nonInfectious.temporalTenderness || state.nonInfectious.jawClaudication || state.nonInfectious.visualDisturbance)) {
    const gca = {
      title: "巨細胞性動脈炎 / 側頭動脈炎（GCA）",
      detail: "50歳以上の発熱に側頭部痛、側頭動脈圧痛、顎跛行、視力障害を伴う場合はGCAを考慮します。視力障害や顎跛行を伴う場合は緊急性があり、眼科・リウマチ膠原病科相談を検討してください。",
      tone: "red" as const,
    };
    addUnique(critical, gca);
    addUnique(nonInfectious, { ...gca, tone: "orange" });
  }

  if (state.nonInfectious.newMedication || state.nonInfectious.recentAntibiotics || state.infection.newMedication || state.infection.recentAntibiotics) {
    addUnique(nonInfectious, {
      title: "薬剤熱",
      detail: "最近開始した薬剤または抗菌薬使用歴がある場合は薬剤熱を考慮します。発症時期はさまざまで、中止後72〜96時間で解熱することがあります。感染症を除外しながら原因薬剤を見直してください。",
      tone: "orange",
    });
  }

  if ((unknownSource && state.nonInfectious.nsaidResponse) || state.nonInfectious.weightLoss || state.nonInfectious.nightSweats || state.nonInfectious.ldhHigh || state.nonInfectious.anemia) {
    addUnique(nonInfectious, {
      title: "腫瘍熱",
      detail: "感染症が否定的で、抗菌薬反応不良、NSAIDs反応、B症状がある場合は腫瘍熱を考慮します。悪性リンパ腫、白血病、腎細胞癌、肝細胞癌、副腎腫瘍、心臓粘液腫などを鑑別に入れます。",
      tone: "orange",
    });
  }

  if ((state.nonInfectious.ldhHigh && unknownSource) || (state.nonInfectious.ldhHigh && hasFever)) {
    addUnique(nonInfectious, {
      title: "血管内リンパ腫",
      detail: "LDH高値を伴う感染巣不明の発熱では、皮疹がなくても血管内リンパ腫を考慮し、ランダム皮膚生検を検討してください。",
      tone: "orange",
    });
  }

  if (hasFever && state.nonInfectious.plateletLow && state.nonInfectious.edema && state.nonInfectious.renalDysfunction && state.nonInfectious.organomegaly) {
    const tafro = {
      title: "TAFRO症候群",
      detail: "TAFRO症候群は血小板減少、浮腫、発熱、骨髄線維化、腎機能障害、臓器腫大を特徴とします。",
      tone: "red" as const,
    };
    addUnique(critical, tafro);
    addUnique(nonInfectious, { ...tafro, tone: "orange" });
  }

  if ((hasFever && state.nonInfectious.legSwelling) || (hasFever && (state.nonInfectious.chestPain || state.nonInfectious.shortnessOfBreath || state.nonInfectious.peSymptoms))) {
    const thromboembolism = {
      title: "DVT/PE",
      detail: "下肢血栓では37〜38℃程度の発熱を伴うことがあります。抗凝固開始後も1週間以上発熱が続く場合は感染症などを再評価してください。",
      tone: "red" as const,
    };
    addUnique(critical, thromboembolism);
    addUnique(nonInfectious, { ...thromboembolism, tone: "orange" });
  }

  if (hasFever && (state.nonInfectious.chestPain || state.nonInfectious.shortnessOfBreath || state.nonInfectious.chestSymptoms)) {
    const myocarditis = {
      title: "心筋炎",
      detail: "発熱＋胸痛/息切れでは心筋炎を考慮します。胸部症状が乏しいこともあり、想起が重要です。心電図、トロポニン、心エコーを検討してください。",
      tone: "red" as const,
    };
    addUnique(critical, myocarditis);
    addUnique(nonInfectious, { ...myocarditis, tone: "orange" });
  }

  if (state.nonInfectious.ssri && hasFever && (state.nonInfectious.ckHigh || state.nonInfectious.tremor || state.nonInfectious.sweating || state.nonInfectious.rigidity || state.nonInfectious.autonomicSymptoms)) {
    addUnique(nonInfectious, {
      title: "セロトニン症候群",
      detail: "SSRI使用＋発熱にCK高値、振戦、発汗、筋強剛がある場合はセロトニン症候群を考慮します。高体温、自律神経症状、神経筋症状、横紋筋融解を伴うことがあります。",
      tone: "orange",
    });
  }

  tests.push(
    { title: "共通検査", detail: "血液培養2セット、CBC、生化学、CRP、乳酸、尿検査/尿培養、胸部X線またはCTを検討します。", tone: "green" },
  );
  if (state.organ === "呼吸器") tests.push({ title: "呼吸器検査", detail: "喀痰グラム染色・培養、尿中抗原、抗酸菌検査、β-Dグルカン、必要に応じてCTを検討します。", tone: "green" });
  if (state.organ === "尿路") tests.push({ title: "尿路検査", detail: "尿定性、尿培養、腹部エコー/CTを検討します。", tone: "green" });
  if (state.organ === "腹腔内/胆道") tests.push({ title: "腹腔内/胆道検査", detail: "腹部エコー、CT、血液培養、必要に応じて外科/消化器相談を検討します。", tone: "green" });
  if (state.organ === "中枢神経") tests.push({ title: "CNS検査", detail: "髄液検査、頭部画像、血液培養を検討します。", tone: "green" });
  if (state.organ === "骨関節") tests.push({ title: "骨関節検査", detail: "関節穿刺、グラム染色、細菌培養、抗酸菌培養、X線、CT/MRIを検討します。", tone: "green" });
  if (state.organ === "血流感染/感染性心内膜炎") tests.push({ title: "IE/菌血症検査", detail: "血液培養複数セット、心エコー、深部感染巣検索を検討します。", tone: "green" });
  if (critical.some((item) => item.title === "CDI")) tests.push({ title: "CDI検査", detail: "便中毒素、GDH、NAAT/PCRを検討します。便培養は目的に応じて検討します。", tone: "green" });
  if (organFindings.some((item) => item.title.includes("CDI"))) {
    tests.push({ title: "CDI重症度・便検査", detail: "便中毒素、GDH、NAAT/PCR、CBC、Cr/eGFR、Albを検討します。腹部所見が強い場合は腹部CTも検討します。", tone: "green" });
  }
  if (organFindings.some((item) => item.title === "COPD増悪")) {
    tests.push({ title: "COPD増悪評価", detail: "胸部X線またはCT、SpO2/血液ガス、喀痰グラム染色・培養、心電図、BNP/NT-proBNPを検討します。Dダイマーは状況に応じて検討します。", tone: "green" });
  }
  if (state.organ === "感染臓器不明" && (state.infection.crpHigh || d.crpHigh)) {
    tests.push(
      { title: "感染臓器不明CRP高値の検索", detail: "血液培養2セット以上、尿検査/尿培養、胸腹部造影CT、心エコーを検討します。", tone: "green" },
      { title: "深部感染・血管疾患評価", detail: "腰背部痛があれば脊椎MRI、DVT/PE疑いでは下肢静脈エコーや造影CT、大動脈疾患疑いでは造影CTを検討します。", tone: "green" },
      { title: "非感染症評価", detail: "LDH高値なら血管内リンパ腫を考慮しランダム皮膚生検を検討します。PMR/GCA疑いではESR、眼症状確認、専門科相談を検討します。", tone: "green" },
    );
  }
  if (d.immunosuppressed || d.biologics || state.emergency.immunosuppressed) tests.push({ title: "真菌/免疫抑制検査", detail: "β-Dグルカン、血清クリプトコッカス抗原、真菌培養、CTを検討します。", tone: "green" });
  if (cppdLikely) {
    tests.push(
      { title: "CPPD関連検査", detail: "関節液検査、グラム染色、細菌培養、必要に応じて抗酸菌培養を検討します。", tone: "green" },
      { title: "CPPD画像・代謝評価", detail: "Xpで軟骨石灰化を確認し、Ca/P/Mg/ALP/Fe/トランスフェリン/PTH/甲状腺機能を検討します。", tone: "green" },
    );
  }
  if (nonInfectious.some((item) => item.title === "Crowned dens syndrome")) {
    tests.push({ title: "CDS検査", detail: "頸椎CTで軸椎歯突起周囲の石灰化を確認します。髄膜炎や化膿性脊椎炎が疑わしい場合は髄液検査やMRIも検討します。", tone: "green" });
  }
  if (critical.some((item) => item.title === "心筋炎")) {
    tests.push({ title: "心筋炎評価", detail: "心電図、トロポニン、心エコーを検討します。", tone: "green" });
  }
  if (nonInfectious.some((item) => item.title === "血管内リンパ腫")) {
    tests.push({ title: "血管内リンパ腫評価", detail: "LDH高値で感染巣不明の場合、ランダム皮膚生検を検討します。", tone: "green" });
  }

  switch (state.culture) {
    case "Candida":
      cultureNotes.push({ title: "Candida血症", detail: "Candida血症を考慮。眼内炎評価のため眼科診察を検討してください。カテーテル関連血流感染、腹腔内感染、免疫抑制、TPNなどを背景として確認してください。", tone: "orange" });
      addUnique(additionalEvaluations, { title: "Candida血症の追加評価", detail: "眼科診察を検討します。カテーテル関連血流感染、腹腔内感染、免疫抑制、TPNなどを確認してください。", tone: "orange" });
      break;
    case "Staphylococcus aureus":
      cultureNotes.push({ title: "黄色ブドウ球菌菌血症", detail: "黄色ブドウ球菌菌血症では感染性心内膜炎、化膿性脊椎炎、深部膿瘍、デバイス感染を考慮し、心エコーを検討してください。", tone: "red" });
      addUnique(additionalEvaluations, { title: "黄色ブドウ球菌菌血症の追加評価", detail: "心エコー、深部感染巣検索を検討します。", tone: "red" });
      break;
    case "GPC＋GNR混在":
      cultureNotes.push({ title: "GPC＋GNR混在", detail: "GPCとGNRが混在する場合、嫌気性菌を含む混合感染を考慮してください。腹腔内感染、糖尿病足感染、褥瘡、深部膿瘍などを確認してください。", tone: "orange" });
      break;
    case "陰性":
      cultureNotes.push({ title: "血液培養陰性", detail: "血液培養陰性でも感染性心内膜炎、深部膿瘍、抗菌薬先行投与後の感染症は否定できません。", tone: "orange" });
      break;
    case "GNR":
      cultureNotes.push({ title: "GNR菌血症", detail: "GNR菌血症では尿路、胆道、腹腔内感染、カテーテル関連感染を確認してください。", tone: "orange" });
      break;
    case "GPC":
      cultureNotes.push({ title: "GPC菌血症", detail: "GPC菌血症では黄色ブドウ球菌、連鎖球菌、腸球菌、皮膚常在菌汚染の可能性を整理してください。複数セット陽性、デバイス、心雑音があれば感染性心内膜炎を考慮してください。", tone: "orange" });
      break;
    case "Streptococcus":
    case "Enterococcus":
      cultureNotes.push({ title: `${state.culture}検出時の深掘り`, detail: "菌種、採血セット数、汚染可能性、感染巣、デバイス有無を確認します。", tone: "orange" });
      break;
  }

  if (hasFever && state.nonInfectious.anemia) {
    addUnique(additionalEvaluations, { title: "発熱＋貧血", detail: "パルボウイルスB19、HUS、血液疾患なども考慮します。", tone: "orange" });
  }
  if (hasFever && state.nonInfectious.anemia && state.nonInfectious.plateletLow && (state.nonInfectious.aki || state.nonInfectious.renalDysfunction)) {
    addUnique(additionalEvaluations, { title: "発熱＋貧血＋血小板低下＋AKI", detail: "HUS/TMA、重症感染症、TAFROなども考慮します。", tone: "red" });
  }

  if (state.reassessment.unstableBp || state.reassessment.lactateNotImproved || state.reassessment.organFailureProgression || state.emergency.alteredMentalStatus || state.emergency.respiratoryFailure) {
    reassessment.push({
      title: "重症感染症・敗血症として再評価",
      detail: "重症感染症・敗血症として再評価を検討。感染巣検索、培養再確認、ソースコントロール、抗菌薬カバー範囲、集中治療適応を確認してください。",
      tone: "red",
    });
  }
  if (state.reassessment.unknownSource || state.reassessment.organMismatch || state.reassessment.imagingNotDone || state.reassessment.contrastCtNotDone) {
    reassessment.push({
      title: "診断・感染巣の再評価",
      detail: "感染性心内膜炎、深部膿瘍、化膿性脊椎炎、腸腰筋膿瘍、胆道感染、尿路閉塞を伴う腎盂腎炎、CDI、結核、真菌症、非感染症を再評価します。",
      tone: "blue",
    });
  }
  if (state.reassessment.cultureNotSubmitted || state.reassessment.bloodCultureNotBeforeAntibiotics || (state.culture === "陰性" && state.reassessment.persistentFever)) {
    reassessment.push({
      title: "培養提出状況を再確認",
      detail: "抗菌薬投与前の血液培養が未採取の場合、起因菌推定が難しくなります。発熱持続時は血液培養再提出、尿培養、喀痰培養、膿瘍穿刺培養、カテーテル培養などを検討してください。",
      tone: "blue",
    });
  }
  if ((state.reassessment.abscess && state.reassessment.drainageNotDone) || state.reassessment.biliaryObstruction || state.reassessment.urinaryObstruction || state.reassessment.catheterInPlace || state.reassessment.prostheticDevice || state.reassessment.pressureUlcer || state.reassessment.diabeticFoot) {
    reassessment.push({
      title: "ソースコントロール不足",
      detail: "抗菌薬のみでは改善しにくい感染巣があります。膿瘍ドレナージ、胆道ドレナージ、尿路閉塞解除、カテーテル抜去/交換、デバイス感染評価、創部デブリードマンを検討してください。",
      tone: "red",
    });
  }
  if (state.reassessment.antibioticsWithin90d || state.reassessment.facilityResident || state.reassessment.longHospitalization || state.reassessment.esblHistory || state.reassessment.mrsaHistory || state.reassessment.pseudomonasRisk || state.reassessment.immunosuppressed || state.reassessment.biologics) {
    reassessment.push({
      title: "耐性菌・カバー不足を再評価",
      detail: "ESBL産生菌、MRSA、緑膿菌、Enterococcus、嫌気性菌、非定型病原体、真菌、結核を候補に、感染臓器、培養結果、過去培養、抗菌薬曝露歴、施設入所歴をもとにカバー範囲を再評価してください。",
      tone: "orange",
    });
  }
  if (state.reassessment.immunosuppressed || state.reassessment.biologics || state.reassessment.fungalRisk || state.reassessment.tbRisk || state.reassessment.atypicalRisk || (state.reassessment.after48To72h && state.reassessment.persistentFever)) {
    reassessment.push({
      title: "通常細菌以外の感染症",
      detail: "結核、PCP、真菌症、非結核性抗酸菌、レジオネラ、オウム病、ウイルス感染症を考慮します。抗酸菌塗抹・培養・PCR、β-Dグルカン、血清クリプトコッカス抗原、胸部CT、尿中抗原、必要に応じて専門科相談を検討してください。",
      tone: "orange",
    });
  }
  if (state.reassessment.renalDoseNotAdjusted || state.reassessment.hepaticCautionNotChecked || state.reassessment.weightObesityNotConsidered || state.reassessment.poorPenetrationSite || state.reassessment.poorAdherence || state.reassessment.drugInteraction) {
    reassessment.push({
      title: "薬剤側の問題を確認",
      detail: "薬剤量、投与間隔、腎機能・肝機能、体重、感染巣への移行性、内服継続状況、相互作用を確認してください。",
      tone: "orange",
    });
  }
  if (state.reassessment.newMedication || state.reassessment.nsaidResponse || state.reassessment.weightLoss || state.reassessment.nightSweats || state.reassessment.ldhHigh || state.reassessment.arthralgia || state.reassessment.shoulderThighPain || state.reassessment.temporalTenderness || state.reassessment.legSwelling || state.reassessment.chestBackPain || state.reassessment.ckHigh || state.reassessment.ssri) {
    reassessment.push({
      title: "非感染症の再評価",
      detail: "薬剤熱、腫瘍熱、血管内リンパ腫、偽痛風、PMR/GCA、DVT/PE、大動脈疾患、心筋炎、セロトニン症候群を検討します。抗菌薬反応不良時は、感染症の見直しだけでなく、非感染症の発熱も並行して再評価してください。",
      tone: "orange",
    });
  }
  if (state.reassessment.defervesced && state.reassessment.crpWbcImproved && !state.reassessment.unstableBp && !state.reassessment.organFailureProgression) {
    reassessment.push({
      title: "改善傾向あり",
      detail: "培養結果、感染巣、臨床経過を確認し、de-escalation、治療期間、内服切替、退院可能性を検討してください。",
      tone: "green",
    });
  }

  const hasReassessmentConcern = state.reassessment.after48To72h || state.reassessment.persistentFever || state.reassessment.recurrentFever || state.reassessment.crpWbcNotImproved;
  if (hasReassessmentConcern && (!state.reassessment.defervesced || !state.reassessment.crpWbcImproved)) {
    reassessment.push({ title: "48〜72時間後に改善しない場合", detail: "感染巣が違う、ドレナージ不足、耐性菌、薬剤量不足、真菌/結核/非定型感染、薬剤熱、腫瘍熱、膠原病、血栓症、大動脈疾患を再評価します。", tone: "orange" });
  }
  if (state.reassessment.abscessNeedsDrainage) reassessment.push({ title: "ドレナージ不足", detail: "ドレナージが必要な膿瘍があれば、外科的/IVR的処置を検討します。", tone: "red" });
  if (hasReassessmentConcern && (!state.reassessment.antibioticDoseAppropriate || !state.reassessment.renalDoseAdjusted)) reassessment.push({ title: "投与量・腎機能調整", detail: "抗菌薬投与量と腎機能に応じた調整を再確認します。", tone: "orange" });
  if (hasReassessmentConcern && !state.reassessment.nonInfectiousReviewed) reassessment.push({ title: "非感染症の再評価", detail: "改善しない場合は非感染症の可能性を必ず再評価します。", tone: "orange" });

  const allCritical = [...danger, ...critical];
  const urgency = allCritical.length > 0 ? "高: 緊急対応または見逃し疾患の除外を優先" : infectionLikelihood.some((item) => item.tone === "orange") ? "中: 感染症以外も並行評価" : "低〜中: 経過と検査で再評価";

  actions.push("危険疾患の赤カードを先に確認する");
  actions.push("感染臓器を1つ選び、追加質問で鑑別を絞る");
  actions.push("培養採取後に経験的治療を検討し、耐性菌リスク、腎機能、肝機能、年齢、心血管リスクを評価する");
  actions.push("48〜72時間で解熱、炎症反応、培養、画像、ドレナージ必要性、非感染症を再評価する");

  return {
    urgency,
    danger: allCritical,
    infectionLikelihood,
    organFindings,
    nonInfectious,
    tests,
    cultureNotes,
    additionalEvaluations,
    reassessment,
    actions,
  };
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      <div className="flex min-h-12 items-center rounded-lg border border-slate-700 bg-slate-950/70 focus-within:border-cyan-400">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="decimal"
          className="w-full bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-slate-500"
          placeholder="未入力"
        />
        {suffix && <span className="pr-4 text-sm text-slate-400">{suffix}</span>}
      </div>
    </label>
  );
}

function Toggle({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-lg border px-3 py-3 text-left text-sm font-semibold transition ${
        checked ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500"
      }`}
    >
      <span className={`mr-2 inline-block h-3 w-3 rounded-sm border ${checked ? "border-cyan-200 bg-cyan-300" : "border-slate-500"}`} />
      {label}
    </button>
  );
}

function Card({ item }: { item: Item }) {
  const tone = {
    red: "border-red-400/40 bg-red-950/55 text-red-100",
    orange: "border-amber-400/40 bg-amber-950/45 text-amber-100",
    blue: "border-blue-400/35 bg-blue-950/45 text-blue-100",
    green: "border-emerald-400/35 bg-emerald-950/45 text-emerald-100",
  }[item.tone];

  return (
    <article className={`rounded-lg border p-4 ${tone}`}>
      <h3 className="font-bold">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{item.detail}</p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 shadow-lg shadow-black/20">
      <h2 className="mb-4 text-lg font-bold text-cyan-200">{title}</h2>
      {children}
    </section>
  );
}

function Summary({ result }: { result: ReturnType<typeof assess> }) {
  return (
    <div className="space-y-3">
      <Card item={{ title: "緊急度", detail: result.urgency, tone: result.danger.length > 0 ? "red" : "orange" }} />
      {result.danger.length > 0 && (
        <div className="space-y-2">
          {result.danger.map((item) => <Card key={item.title} item={item} />)}
        </div>
      )}
      <div className="grid gap-3">
        <OutputBlock title="感染症らしさ" items={result.infectionLikelihood} empty="Step1で感染症らしさを評価します。" />
        <OutputBlock title="疑う感染臓器" items={result.organFindings} empty="Step2で感染臓器を選択すると表示します。" />
        <OutputBlock title="非感染症の鑑別" items={result.nonInfectious} empty="Step3で非感染症を並行評価します。" />
        <OutputBlock title="推奨検査" items={result.tests} empty="Step4で表示します。" />
        <OutputBlock title="培養結果に応じた注意" items={result.cultureNotes} empty="Step5で培養結果を選択します。" />
        <OutputBlock title="追加評価" items={result.additionalEvaluations} empty="培養結果や血算・腎機能から追加評価が必要な場合に表示します。" />
        <OutputBlock title="48〜72時間後の再評価" items={result.reassessment} empty="Step6で再評価ポイントを確認します。" />
      </div>
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-950/35 p-4">
        <h3 className="font-bold text-emerald-100">次に行うべきアクション</h3>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
          {result.actions.map((action, index) => <li key={action}>{index + 1}. {action}</li>)}
        </ol>
      </div>
    </div>
  );
}

function OutputBlock({ title, items, empty }: { title: string; items: Item[]; empty: string }) {
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-950/45 p-4">
      <h3 className="font-bold text-slate-100">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => <Card key={`${title}-${item.title}`} item={item} />) : <p className="text-sm text-slate-400">{empty}</p>}
      </div>
    </section>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [state, setState] = useState<WizardState>(initialState);
  const result = useMemo(() => assess(state), [state]);
  const currentQuestions = organQuestions[state.organ] ?? {};

  const setFlag = (group: "emergency" | "infection" | "organDetails" | "nonInfectious" | "reassessment", key: string) => {
    setState((current) => ({
      ...current,
      [group]: { ...current[group], [key]: !current[group][key] },
    }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6">
        <header className="rounded-lg border border-cyan-400/25 bg-slate-900 p-5 shadow-xl shadow-cyan-950/25">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Dr. Ito</p>
              <h1 className="mt-1 text-3xl font-extrabold text-white">発熱対応支援ツール</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">緊急性 → 感染症/非感染症 → 感染臓器 → 検査 → 再評価の順に深掘りします。</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-950/40 p-3 text-sm font-semibold leading-6 text-amber-100">
            本ツールは診療支援であり、最終判断は担当医が行ってください。診断確定や抗菌薬処方を代替しません。
          </p>
        </header>

        {result.danger.length > 0 && (
          <section className="sticky top-0 z-20 space-y-2 rounded-lg border border-red-400/50 bg-red-950/90 p-3 shadow-xl backdrop-blur">
            <p className="text-sm font-bold text-red-100">常時表示: 危険疾患</p>
            {result.danger.slice(0, 3).map((item) => <Card key={`sticky-${item.title}`} item={item} />)}
          </section>
        )}

        <nav className="rounded-lg border border-slate-700 bg-slate-900 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-cyan-200">Step{step}: {steps[step]}</p>
            <button type="button" onClick={() => setShowSummary((value) => !value)} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200">
              {showSummary ? "サマリーを閉じる" : "サマリーを開く"}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {steps.map((label, index) => (
              <button
                type="button"
                key={label}
                onClick={() => setStep(index)}
                className={`min-h-10 rounded-md text-xs font-bold ${index === step ? "bg-cyan-300 text-slate-950" : "bg-slate-800 text-slate-400"}`}
              >
                {index}
              </button>
            ))}
          </div>
        </nav>

        {showSummary && <Summary result={result} />}

        {step === 0 && (
          <Section title="Step0：緊急性評価">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(emergencyLabels).map(([key, label]) => (
                <Toggle key={key} label={label} checked={state.emergency[key]} onClick={() => setFlag("emergency", key)} />
              ))}
            </div>
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-950/40 p-3 text-sm leading-6 text-red-100">
              緊急対応を優先。血液培養2セット、乳酸、臓器障害評価、感染巣検索、必要に応じて培養採取後に経験的抗菌薬を検討します。
            </p>
          </Section>
        )}

        {step === 1 && (
          <Section title="Step1：感染症らしさの評価">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="体温" value={state.temperature} suffix="℃" onChange={(value) => setState((current) => ({ ...current, temperature: value }))} />
              <Field label="心拍数" value={state.heartRate} suffix="/分" onChange={(value) => setState((current) => ({ ...current, heartRate: value }))} />
              <Field label="血圧（収縮期）" value={state.systolicBp} suffix="mmHg" onChange={(value) => setState((current) => ({ ...current, systolicBp: value }))} />
              <Field label="SpO2" value={state.spo2} suffix="%" onChange={(value) => setState((current) => ({ ...current, spo2: value }))} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(infectionLabels).map(([key, label]) => (
                <Toggle key={key} label={label} checked={state.infection[key]} onClick={() => setFlag("infection", key)} />
              ))}
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section title="Step2：感染臓器を深掘り">
            <div className="grid gap-2">
              {organOptions.map((organ) => (
                <button
                  type="button"
                  key={organ}
                  onClick={() => setState((current) => ({ ...current, organ, organDetails: {} }))}
                  className={`min-h-12 rounded-lg border px-4 py-3 text-left font-bold ${state.organ === organ ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/60 text-slate-300"}`}
                >
                  {organ}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/40 p-4">
              {state.organ ? (
                <>
                  <h3 className="font-bold text-cyan-100">{state.organ} の追加質問</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {Object.entries(currentQuestions).map(([key, label]) => (
                      <Toggle key={key} label={label} checked={Boolean(state.organDetails[key])} onClick={() => setFlag("organDetails", key)} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm leading-6 text-slate-300">感染臓器候補を選ぶと、追加質問と検査提案が切り替わります。</p>
              )}
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="Step3：非感染症を並行評価">
            <div className="mb-4">
              <Field label="年齢" value={state.age} suffix="歳" onChange={(value) => setState((current) => ({ ...current, age: value }))} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(nonInfectiousLabels).map(([key, label]) => (
                <Toggle key={key} label={label} checked={state.nonInfectious[key]} onClick={() => setFlag("nonInfectious", key)} />
              ))}
            </div>
          </Section>
        )}

        {step === 4 && (
          <Section title="Step4：推奨検査">
            <OutputBlock title="現在の入力に応じた検査" items={result.tests} empty="感染臓器を選ぶと検査提案が変わります。" />
          </Section>
        )}

        {step === 5 && (
          <Section title="Step5：培養・検査結果から深掘り">
            <div className="grid gap-2">
              {cultureOptions.map((culture) => (
                <button
                  type="button"
                  key={culture}
                  onClick={() => setState((current) => ({ ...current, culture }))}
                  className={`min-h-12 rounded-lg border px-4 py-3 text-left font-bold ${state.culture === culture ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/60 text-slate-300"}`}
                >
                  {culture}
                </button>
              ))}
            </div>
          </Section>
        )}

        {step === 6 && (
          <Section title="Step6：48〜72時間後の再評価">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(reassessmentLabels).map(([key, label]) => (
                <Toggle key={key} label={label} checked={state.reassessment[key]} onClick={() => setFlag("reassessment", key)} />
              ))}
            </div>
          </Section>
        )}

        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} className="min-h-12 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 font-bold text-slate-100">
            戻る
          </button>
          <button type="button" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className="min-h-12 flex-1 rounded-lg bg-cyan-300 px-4 font-bold text-slate-950">
            次へ
          </button>
        </div>
      </div>
    </main>
  );
}
