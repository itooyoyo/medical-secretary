import { assessFever, initialForm } from "../lib/feverAssessment.ts";

const clone = () => structuredClone(initialForm);

function makeForm(overrides = {}) {
  const form = clone();
  Object.assign(form, {
    age: "45",
    temperature: "38.5",
    heartRate: "105",
    systolicBp: "120",
    spo2: "97",
  });

  for (const [key, value] of Object.entries(overrides)) {
    if (key.includes(".")) {
      const [group, child] = key.split(".");
      form[group][child] = value;
    } else {
      form[key] = value;
    }
  }

  return form;
}

function outputText(assessment) {
  return [
    assessment.urgency,
    ...assessment.criticalDiseases.map((item) => `${item.title} ${item.details}`),
    ...assessment.infectionFoci.map((item) => `${item.title} ${item.details}`),
    assessment.relativeBradycardia ? `${assessment.relativeBradycardia.title} ${assessment.relativeBradycardia.details}` : "",
    ...assessment.nonInfectious.map((item) => `${item.title} ${item.details}`),
    ...assessment.tests.map((item) => `${item.title} ${item.details}`),
    ...assessment.cautions.map((item) => `${item.title} ${item.details}`),
    ...assessment.cultureNotes.map((item) => `${item.title} ${item.details}`),
    ...assessment.additionalEvaluations.map((item) => `${item.title} ${item.details}`),
    ...assessment.reassessment.map((item) => `${item.title} ${item.details}`),
    ...assessment.antibiotics.map((item) => `${item.title} ${item.details}`),
    ...assessment.actions,
  ].join("\n");
}

const cases = [
  {
    name: "01 ショックで敗血症",
    form: makeForm({ "emergency.shock": true, systolicBp: "78" }),
    expect: ["敗血症", "最優先"],
  },
  {
    name: "02 意識障害で敗血症",
    form: makeForm({ alteredMentalStatus: true }),
    expect: ["敗血症"],
  },
  {
    name: "03 呼吸不全で敗血症",
    form: makeForm({ "emergency.respiratoryFailure": true, spo2: "88" }),
    expect: ["敗血症"],
  },
  {
    name: "04 頭痛＋項部硬直＋発熱で髄膜炎",
    form: makeForm({ "symptoms.headache": true, "symptoms.neckStiffness": true }),
    expect: ["髄膜炎", "髄液検査"],
  },
  {
    name: "05 腰背部痛＋発熱",
    form: makeForm({ "symptoms.backPain": true }),
    expect: ["化膿性脊椎炎", "腎盂腎炎", "腸腰筋膿瘍", "尿路感染"],
  },
  {
    name: "06 前胸部痛＋胸鎖関節圧痛",
    form: makeForm({ "symptoms.anteriorChestShoulderPain": true, "physical.sternoclavicularTenderness": true }),
    expect: ["胸鎖関節炎"],
  },
  {
    name: "07 Janeway/Oslerで感染性心内膜炎",
    form: makeForm({ "physical.janewayOsler": true }),
    expect: ["感染性心内膜炎", "心エコー"],
  },
  {
    name: "08 人工弁/ペースメーカーで感染性心内膜炎",
    form: makeForm({ "exposures.prostheticValvePacer": true }),
    expect: ["感染性心内膜炎"],
  },
  {
    name: "09 LDH高値・感染巣不明",
    form: makeForm({ "labs.ldhHigh": true, temperature: "38.0" }),
    expect: ["血管内リンパ腫", "ランダム皮膚生検"],
  },
  {
    name: "10 CK高値＋SSRI",
    form: makeForm({ "labs.ckHigh": true, "exposures.ssri": true }),
    expect: ["セロトニン症候群", "横紋筋融解"],
  },
  {
    name: "11 側頭動脈所見",
    form: makeForm({ "physical.temporalArteryTenderness": true }),
    expect: ["巨細胞性動脈炎"],
  },
  {
    name: "12 鞍鼻",
    form: makeForm({ "physical.saddleNose": true }),
    expect: ["ANCA関連血管炎"],
  },
  {
    name: "13 遊走性紅斑＋ダニ",
    form: makeForm({ "physical.erythemaMigrans": true, "exposures.tickBite": true }),
    expect: ["ライム病"],
  },
  {
    name: "14 齧歯類＋肝障害＋血小板低下＋AKI",
    form: makeForm({ "exposures.rodentExposure": true, "labs.liverInjury": true, "labs.plateletLow": true, "labs.aki": true }),
    expect: ["レプトスピラ症"],
  },
  {
    name: "15 鳥曝露",
    form: makeForm({ "exposures.birdExposure": true }),
    expect: ["オウム病"],
  },
  {
    name: "16 全身発疹＋後頚部リンパ節",
    form: makeForm({ "physical.generalizedRash": true, "physical.posteriorCervicalNodes": true }),
    expect: ["麻疹・風疹"],
  },
  {
    name: "17 皮膚剥離",
    form: makeForm({ "physical.skinDesquamation": true }),
    expect: ["SSSS", "中毒性ショック症候群"],
  },
  {
    name: "18 最近開始薬剤",
    form: makeForm({ "exposures.newMedication": true }),
    expect: ["薬剤熱", "72〜96時間"],
  },
  {
    name: "19 最近の抗菌薬使用",
    form: makeForm({ "exposures.recentAntibiotics": true }),
    expect: ["薬剤熱"],
  },
  {
    name: "20 高齢者・症状なし＋食欲低下",
    form: makeForm({ age: "86", "symptoms.noSymptoms": true, "atypical.appetiteLoss": true }),
    expect: ["高齢者の非典型感染", "肺炎", "尿路感染症", "胆道感染症", "感染性心内膜炎"],
  },
  {
    name: "21 相対的徐脈",
    form: makeForm({ temperature: "40.0", heartRate: "70" }),
    expect: ["相対的徐脈", "レジオネラ", "チフス", "ブルセラ", "レプトスピラ", "サルモネラ", "オウム病", "マラリア", "薬剤熱", "腫瘍熱"],
  },
  {
    name: "22 相対的徐脈＋徐脈判定注意",
    form: makeForm({ temperature: "40.0", heartRate: "70", betaBlockerCaBlockerAvBlockPacer: true }),
    expect: ["徐脈判定の注意", "β遮断薬", "Ca拮抗薬", "房室ブロック", "ペースメーカー"],
  },
  {
    name: "23 呼吸器感染で検査提案",
    form: makeForm({ "symptoms.coughSputum": true }),
    expect: ["呼吸器感染", "血液培養2セット", "尿検査・尿培養", "胸部X線またはCT", "腹部エコーまたはCT"],
  },
  {
    name: "24 胆道感染",
    form: makeForm({ "symptoms.rightUpperQuadrantPain": true, "labs.liverInjury": true }),
    expect: ["胆道感染", "胆管炎", "胆嚢炎"],
  },
  {
    name: "25 腹腔内感染",
    form: makeForm({ "symptoms.abdominalPain": true }),
    expect: ["腹腔内感染", "憩室炎", "虫垂炎"],
  },
  {
    name: "26 皮膚軟部組織感染",
    form: makeForm({ "symptoms.skinRednessSwelling": true }),
    expect: ["皮膚軟部組織感染", "蜂窩織炎"],
  },
  {
    name: "27 関節痛",
    form: makeForm({ "symptoms.arthralgia": true }),
    expect: ["化膿性関節炎", "偽痛風"],
  },
  {
    name: "28 免疫抑制リスク",
    form: makeForm({ immunosuppressed: true, "exposures.immunosuppressants": true }),
    expect: ["免疫抑制・好中球減少", "重症感染"],
  },
  {
    name: "29 糖尿病・CKDリスク",
    form: makeForm({ diabetes: true, ckdDialysis: true }),
    expect: ["重症化リスク", "糖尿病", "CKD/透析", "耐性菌リスク"],
  },
  {
    name: "30 未入力・極端値でもクラッシュしない",
    form: makeForm({ age: "", temperature: "999", heartRate: "-10", systolicBp: "", spo2: "200" }),
    expect: ["入力値を確認"],
    notCritical: ["敗血症"],
    notExpect: ["相対的徐脈"],
  },
  {
    name: "31 70歳以上＋発熱＋急性関節痛でCPPD",
    form: makeForm({ age: "78", temperature: "38.4", "cppd.acuteJointPain": true }),
    expect: ["偽痛風 / CPPD", "高齢者に多く", "化膿性関節炎との鑑別", "関節液検査", "ピロリン酸カルシウム結晶"],
  },
  {
    name: "32 70歳以上＋CRP高値＋急性関節痛でCPPD",
    form: makeForm({ age: "83", temperature: "36.8", "labs.crpHigh": true, "cppd.acuteJointPain": true }),
    expect: ["偽痛風 / CPPD", "CRP高値", "関節液グラム染色・細菌培養"],
  },
  {
    name: "33 70歳以上＋膝関節痛でCPPD",
    form: makeForm({ age: "76", temperature: "37.0", "cppd.kneePain": true }),
    expect: ["偽痛風 / CPPD", "膝関節が最多", "関節X線"],
  },
  {
    name: "34 多関節痛＋発熱でCPPD",
    form: makeForm({ temperature: "38.2", "cppd.polyarthralgia": true }),
    expect: ["偽痛風 / CPPD", "多関節型"],
  },
  {
    name: "35 手術後または外傷後＋急性関節炎でCPPD",
    form: makeForm({ temperature: "37.0", "cppd.postOpOrTrauma": true, "cppd.acuteJointPain": true, "cppd.jointSwelling": true }),
    expect: ["偽痛風 / CPPD", "CPPDの治療コメント", "NSAIDs", "感染が否定できない場合"],
  },
  {
    name: "36 代謝リスクでCPPD",
    form: makeForm({ temperature: "36.9", "cppd.hypomagnesemia": true, "cppd.hyperparathyroidism": true, "cppd.hemochromatosis": true, "cppd.hypophosphatemia": true }),
    expect: ["偽痛風 / CPPD", "CPPD関連採血", "Ca", "Mg", "副甲状腺ホルモン"],
  },
  {
    name: "37 70歳以上＋発熱＋急性頸部痛でCDS",
    form: makeForm({ age: "81", temperature: "38.3", "cppd.acuteNeckPain": true }),
    expect: ["Crowned dens syndrome", "環軸関節のCPPD発作", "髄膜炎", "化膿性脊椎炎", "頸椎CT"],
  },
  {
    name: "38 急性頸部痛＋回旋制限でCDS",
    form: makeForm({ temperature: "36.8", "cppd.acuteNeckPain": true, "cppd.limitedNeckRotation": true }),
    expect: ["Crowned dens syndrome", "頸部痛", "頸椎疾患", "CDSでのMRI"],
  },
  {
    name: "39 急性頸部痛＋CRP高値でCDS",
    form: makeForm({ temperature: "37.0", "labs.crpHigh": true, "cppd.acuteNeckPain": true }),
    expect: ["Crowned dens syndrome", "CDSでの髄液検査", "CDSでの血液培養"],
  },
  {
    name: "40 PMR 50歳以上＋肩痛＋朝のこわばり",
    form: makeForm({ age: "72", temperature: "38.0", "cppd.shoulderPain": true, "nonInfectious.morningStiffness": true }),
    expect: ["リウマチ性多発筋痛症（PMR）", "感染症、悪性腫瘍、GCA"],
  },
  {
    name: "41 GCA 50歳以上＋側頭部痛＋顎跛行",
    form: makeForm({ age: "76", temperature: "38.1", "nonInfectious.temporalHeadache": true, "nonInfectious.jawClaudication": true }),
    expect: ["巨細胞性動脈炎 / 側頭動脈炎（GCA）", "眼科・リウマチ膠原病科相談", "GCAでの視力障害・顎跛行"],
  },
  {
    name: "42 薬剤熱 最近開始薬剤",
    form: makeForm({ "exposures.newMedication": true }),
    expect: ["薬剤熱", "中止後72〜96時間", "原因薬剤"],
  },
  {
    name: "43 腫瘍熱 感染巣不明＋NSAIDs反応",
    form: makeForm({ "symptoms.noSymptoms": true, "nonInfectious.nsaidResponse": true }),
    expect: ["腫瘍熱", "悪性リンパ腫", "心臓粘液腫"],
  },
  {
    name: "44 血管内リンパ腫 LDH高値＋感染巣不明",
    form: makeForm({ "symptoms.noSymptoms": true, "labs.ldhHigh": true }),
    expect: ["血管内リンパ腫", "皮疹がなくても", "ランダム皮膚生検"],
  },
  {
    name: "45 TAFRO 発熱＋血小板低下＋浮腫＋AKI＋臓器腫大",
    form: makeForm({ temperature: "38.2", "labs.plateletLow": true, "labs.aki": true, "nonInfectious.edema": true, "nonInfectious.organomegaly": true }),
    expect: ["TAFRO症候群", "血小板減少", "臓器腫大"],
  },
  {
    name: "46 DVT/PE 発熱＋下肢腫脹",
    form: makeForm({ temperature: "37.8", "nonInfectious.legSwelling": true }),
    expect: ["DVT/PE", "37〜38℃程度の発熱", "感染症などを再評価"],
  },
  {
    name: "47 心筋炎 発熱＋胸痛",
    form: makeForm({ temperature: "38.0", "symptoms.chestPain": true }),
    expect: ["心筋炎", "心電図", "トロポニン", "心エコー"],
  },
  {
    name: "48 セロトニン症候群 SSRI＋発熱＋振戦",
    form: makeForm({ temperature: "38.6", "exposures.ssri": true, "nonInfectious.tremor": true }),
    expect: ["セロトニン症候群", "振戦", "横紋筋融解"],
  },
  {
    name: "49 CPPD Step3入力相当 CRP高値＋急性関節痛",
    form: makeForm({ temperature: "37.0", "labs.crpHigh": true, "cppd.acuteJointPain": true }),
    expect: ["偽痛風 / CPPD", "化膿性関節炎との鑑別", "グラム染色"],
  },
  {
    name: "50 発熱＋下痢＋抗菌薬使用歴でCDI",
    form: makeForm({ temperature: "38.2", "deepDive.diarrhea": true, "exposures.recentAntibiotics": true }),
    expect: ["Clostridioides difficile infection", "CDI", "便中毒素", "NAAT/PCR", "Alb"],
  },
  {
    name: "51 COPD既往＋発熱＋膿性痰＋肺炎像なしでCOPD増悪",
    form: makeForm({ temperature: "38.0", "deepDive.copd": true, "deepDive.purulentSputum": true, "deepDive.noPneumoniaImage": true }),
    expect: ["COPD増悪", "肺炎、心不全、肺塞栓、気胸", "血液ガス", "BNP"],
  },
  {
    name: "52 Candida血症で眼科診察",
    form: makeForm({ culture: "Candida" }),
    expect: ["Candida血症", "眼科診察", "眼内炎", "TPN"],
  },
  {
    name: "53 黄色ブドウ球菌菌血症で心エコー",
    form: makeForm({ culture: "Staphylococcus aureus" }),
    expect: ["黄色ブドウ球菌菌血症", "感染性心内膜炎", "心エコー", "深部感染巣検索"],
  },
  {
    name: "54 GPC＋GNR混在で嫌気性菌混合感染",
    form: makeForm({ culture: "GPC＋GNR混在" }),
    expect: ["GPC＋GNR混在", "嫌気性菌", "混合感染", "腹腔内感染", "糖尿病足"],
  },
  {
    name: "55 感染臓器不明＋CRP高値＋LDH高値で血管内リンパ腫",
    form: makeForm({ "symptoms.noSymptoms": true, "labs.crpHigh": true, "labs.ldhHigh": true }),
    expect: ["感染臓器不明", "血管内リンパ腫", "ランダム皮膚生検"],
  },
  {
    name: "56 感染臓器不明＋CRP高値＋腰痛で化膿性脊椎炎/腸腰筋膿瘍",
    form: makeForm({ "symptoms.noSymptoms": true, "labs.crpHigh": true, "symptoms.backPain": true }),
    expect: ["化膿性脊椎炎", "腸腰筋膿瘍", "脊椎MRI"],
  },
  {
    name: "57 感染臓器不明＋CRP高値＋胸背部痛で大動脈疾患",
    form: makeForm({ "symptoms.noSymptoms": true, "labs.crpHigh": true, "symptoms.chestPain": true }),
    expect: ["大動脈瘤", "大動脈解離", "造影CT"],
  },
  {
    name: "58 発熱＋貧血＋血小板低下＋AKIでHUS/TMA",
    form: makeForm({ temperature: "38.1", "nonInfectious.anemia": true, "labs.plateletLow": true, "labs.aki": true }),
    expect: ["発熱＋貧血＋血小板低下＋AKI", "HUS/TMA", "重症感染症", "TAFRO"],
  },
  {
    name: "59 頸部感染＋菌血症でLemierre症候群",
    form: makeForm({ "deepDive.neckInfection": true, "deepDive.bloodCulturePositive": true }),
    expect: ["内頸静脈血栓", "Lemierre症候群", "頸部感染", "菌血症"],
  },
  {
    name: "60 抗菌薬48時間後も発熱＋血圧不安定＋乳酸改善なし",
    form: makeForm({ "reassessment.after48To72h": true, "reassessment.persistentFever": true, "reassessment.unstableBp": true, "reassessment.lactateNotImproved": true }),
    expect: ["重症感染症・敗血症として再評価", "感染巣検索", "集中治療適応"],
  },
  {
    name: "61 感染巣不明＋造影CT未施行＋発熱持続",
    form: makeForm({ "reassessment.unknownSource": true, "reassessment.contrastCtNotDone": true, "reassessment.persistentFever": true }),
    expect: ["診断・感染巣の再評価", "深部膿瘍", "感染性心内膜炎", "化膿性脊椎炎"],
  },
  {
    name: "62 膿瘍あり＋ドレナージ未実施",
    form: makeForm({ "reassessment.abscess": true, "reassessment.drainageNotDone": true }),
    expect: ["ソースコントロール不足", "膿瘍ドレナージ"],
  },
  {
    name: "63 胆管炎疑い＋胆道閉塞あり",
    form: makeForm({ "reassessment.biliaryObstruction": true }),
    expect: ["ソースコントロール不足", "胆道ドレナージ"],
  },
  {
    name: "64 尿路感染疑い＋尿路閉塞あり",
    form: makeForm({ "reassessment.urinaryObstruction": true }),
    expect: ["ソースコントロール不足", "尿路閉塞解除"],
  },
  {
    name: "65 90日以内抗菌薬使用＋発熱持続",
    form: makeForm({ "reassessment.antibioticsWithin90d": true, "reassessment.persistentFever": true }),
    expect: ["耐性菌・カバー不足", "ESBL", "MRSA", "緑膿菌"],
  },
  {
    name: "66 免疫抑制＋抗菌薬反応不良",
    form: makeForm({ "reassessment.immunosuppressed": true, "reassessment.after48To72h": true, "reassessment.persistentFever": true }),
    expect: ["通常細菌以外の感染症", "真菌", "結核", "PCP", "非定型"],
  },
  {
    name: "67 発熱持続＋LDH高値＋感染巣不明",
    form: makeForm({ "reassessment.persistentFever": true, "reassessment.ldhHigh": true, "reassessment.unknownSource": true }),
    expect: ["非感染症の再評価", "血管内リンパ腫", "腫瘍熱"],
  },
  {
    name: "68 発熱持続＋最近開始した薬剤",
    form: makeForm({ "reassessment.persistentFever": true, "reassessment.newMedication": true }),
    expect: ["非感染症の再評価", "薬剤熱"],
  },
  {
    name: "69 解熱傾向＋CRP改善＋血圧安定",
    form: makeForm({ "reassessment.defervesced": true, "reassessment.crpWbcImproved": true }),
    expect: ["改善傾向あり", "de-escalation", "治療期間", "内服切替"],
  },
];

const results = cases.map((testCase) => {
  let assessment;
  let text;
  let missing = [];
  try {
    assessment = assessFever(testCase.form);
    text = outputText(assessment);
    missing = testCase.expect.filter((needle) => !text.includes(needle));
    const criticalText = assessment.criticalDiseases.map((item) => `${item.title} ${item.details}`).join("\n");
    const unexpectedCritical = (testCase.notCritical ?? []).filter((needle) => criticalText.includes(needle));
    missing.push(...unexpectedCritical.map((needle) => `想定外の危険疾患表示: ${needle}`));
    const unexpected = (testCase.notExpect ?? []).filter((needle) => text.includes(needle));
    missing.push(...unexpected.map((needle) => `想定外の表示: ${needle}`));
  } catch (error) {
    missing = [`クラッシュ: ${error instanceof Error ? error.message : String(error)}`];
    text = "";
  }

  return {
    name: testCase.name,
    demographics: {
      age: testCase.form.age,
      temperature: testCase.form.temperature,
      heartRate: testCase.form.heartRate,
      systolicBp: testCase.form.systolicBp,
      spo2: testCase.form.spo2,
    },
    expected: testCase.expect,
    actual: text.split("\n").filter(Boolean).slice(0, 12),
    result: missing.length === 0 ? "Pass" : "Fail",
    issues: missing,
  };
});

const failed = results.filter((result) => result.result === "Fail");
console.log(JSON.stringify({ total: results.length, pass: results.length - failed.length, fail: failed.length, failed, results }, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}
