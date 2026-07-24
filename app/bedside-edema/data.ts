export type Guide = {
  where: string;
  how: string;
  normal: string;
  abnormal: string;
  suggests: string;
  tip: string;
};

export type Choice = {
  label: string;
  value: string;
  positive?: boolean;
};

export type ExamItem = {
  id: string;
  label: string;
  prompt: string;
  choices: Choice[];
  guide?: Guide;
};

export type ExamStep = {
  id: string;
  number: number;
  title: string;
  english: string;
  description: string;
  items: ExamItem[];
  optional?: boolean;
};

const yesNo: Choice[] = [
  { label: "あり", value: "present", positive: true },
  { label: "なし", value: "absent" },
  { label: "未確認", value: "unknown" },
];

const guide = (
  where: string,
  how: string,
  normal: string,
  abnormal: string,
  suggests: string,
  tip: string,
): Guide => ({ where, how, normal, abnormal, suggests, tip });

const finding = (
  id: string,
  label: string,
  where: string,
  how: string,
  suggests: string,
  tip: string,
  prompt = `${label}を認めますか？`,
): ExamItem => ({
  id,
  label,
  prompt,
  choices: yesNo,
  guide: guide(
    where,
    how,
    `${label}を認めない`,
    `${label}を認める`,
    suggests,
    tip,
  ),
});

export const redFlags: ExamItem[] = [
  "急速に悪化",
  "呼吸困難",
  "SpO2低下",
  "胸痛",
  "片側急性腫脹",
  "高度疼痛",
  "発赤・熱感",
  "発熱",
  "皮膚壊死",
  "コンパートメント症候群疑い",
].map((label, index) => ({
  id: `red-${index + 1}`,
  label,
  prompt: `${label}がありますか？`,
  choices: yesNo,
}));

export const examSteps: ExamStep[] = [
  {
    id: "look",
    number: 1,
    title: "見る",
    english: "LOOK",
    description: "露出と左右比較を意識して観察します",
    items: [
      finding("unilateral", "片側性", "両下肢全体", "左右を同じ高さ・照明で比較する", "DVT、蜂窩織炎、静脈・リンパ還流障害", "腫れていない側を基準にします"),
      finding("bilateral", "両側性", "両下肢全体", "左右対称か分布を観察する", "心不全、腎・肝疾患、薬剤性", "全身性でも左右差はあり得ます"),
      finding("asymmetry", "左右差", "足背から大腿まで", "輪郭と皮膚の張りを比較する", "局所性の静脈・リンパ疾患", "同じ肢位で比べます"),
      finding("dorsum", "足背浮腫", "足背と趾の付け根", "腱や骨の輪郭が消えていないか見る", "全身性浮腫、リンパ浮腫", "靴下痕だけで判断しません"),
      finding("face", "顔面浮腫", "頬・口唇・顔全体", "普段の写真や家族の印象とも比較する", "腎疾患、血管性浮腫、甲状腺機能低下", "呼吸路症状があれば緊急評価します"),
      finding("eyelid", "眼瞼浮腫", "上下眼瞼", "左右差と朝の腫れを観察する", "腎疾患、アレルギー、甲状腺疾患", "眼球突出と区別します"),
      finding("sacral", "仙骨浮腫", "臥床患者の仙骨部", "衣服をずらし皮膚の張りと圧痕を見る", "全身性体液貯留", "臥床患者では下腿より感度が高いことがあります"),
      finding("erythema", "発赤", "腫脹部とその周囲", "境界、広がり、線状発赤を観察する", "蜂窩織炎、DVT、炎症", "皮膚色の左右差を確認します"),
      finding("pigmentation", "色素沈着", "下腿遠位、内果周囲", "褐色調変化と分布を見る", "慢性静脈不全", "静脈瘤や湿疹も同時に探します"),
      finding("ulcer", "皮膚潰瘍", "内外果、足趾、荷重部", "部位、辺縁、滲出、壊死を観察する", "静脈・動脈・神経障害", "足背動脈と皮膚温も確認します"),
      finding("venous-distension", "静脈怒張", "表在静脈と腹壁", "立位可能なら立位でも観察する", "静脈還流障害、DVT、静脈不全", "左右差と側副血行路に注目します"),
    ],
  },
  {
    id: "feel",
    number: 2,
    title: "触る",
    english: "FEEL",
    description: "圧痕・温度・循環を手で確かめます",
    items: [
      finding("pitting", "圧痕", "脛骨前面、内果、足背、仙骨", "母指で約5秒圧迫し、離した後の陥凹を見る", "心・腎・肝疾患、静脈不全", "骨の上を一定の力で押します"),
      {
        id: "pitting-return",
        label: "圧痕が戻る時間",
        prompt: "圧痕が戻るまでの時間は？",
        choices: [
          { label: "1秒以内", value: "1s" },
          { label: "約3秒", value: "3s", positive: true },
          { label: "約5秒", value: "5s", positive: true },
          { label: "10秒以上", value: "10s", positive: true },
          { label: "未確認", value: "unknown" },
        ],
        guide: guide("脛骨前面または内果", "5秒圧迫後、陥凹消失まで数える", "陥凹なし、または速やかに消失", "圧痕が長く残る", "間質液貯留の程度", "同じ部位・力・時間で再評価します"),
      },
      {
        ...finding("temperature", "皮膚温", "手背で両下肢", "左右を交互に触れて比較する", "炎症、感染、血栓、動脈不全", "手掌より温度差に敏感な手背を使います"),
        choices: [
          { label: "正常・左右差なし", value: "normal" },
          { label: "熱い", value: "warm", positive: true },
          { label: "冷たい", value: "cold", positive: true },
          { label: "未確認", value: "unknown" },
        ],
        prompt: "皮膚温はどうですか？",
      },
      finding("tenderness", "圧痛", "腫脹部、深部静脈走行、関節周囲", "軽い触診から始め局在を確認する", "DVT、感染、関節・筋骨格疾患", "強く揉まず、疼痛部位を記録します"),
      finding("induration", "皮膚硬化", "下腿遠位と足背", "皮膚をつまみ、厚みと可動性を比べる", "リンパ浮腫、脂肪皮膚硬化症", "慢性変化は左右差が手掛かりです"),
      finding("stemmer", "Stemmer徴候", "第2趾基部背側", "皮膚を母指と示指でつまみ上げる", "リンパ浮腫", "陽性はリンパ浮腫を支持しますが陰性でも除外できません"),
      {
        ...finding("pedal-pulse", "足背動脈", "第1・第2中足骨間の近位", "示指・中指で軽く触れ左右比較する", "末梢動脈疾患", "触れなければ後脛骨動脈も確認します"),
        choices: [
          { label: "触知良好", value: "normal" },
          { label: "減弱・触知不能", value: "reduced", positive: true },
          { label: "未確認", value: "unknown" },
        ],
        prompt: "足背動脈の触知は？",
      },
      {
        ...finding("calf-difference", "下腿周径差", "脛骨粗面下10cmなど一定点", "メジャーを皮膚に食い込ませず両側測定する", "DVT、片側性腫脹", "測定位置と値を記録し、3cm以上の差に注意します"),
        choices: [
          { label: "3cm未満", value: "normal" },
          { label: "3cm以上", value: "large", positive: true },
          { label: "未確認", value: "unknown" },
        ],
        prompt: "下腿周径差は？",
      },
    ],
  },
  {
    id: "move",
    number: 3,
    title: "動かす",
    english: "MOVE",
    description: "機能と筋骨格由来の腫脹を確認します",
    items: [
      {
        ...finding("walking", "歩行可能", "立ち上がりから数歩", "安全を確保し普段通り歩いてもらう", "重症度、疼痛、廃用", "転倒リスクがあれば無理に歩かせません"),
        prompt: "安全に歩行できますか？",
        choices: [
          { label: "可能", value: "normal" },
          { label: "困難", value: "difficult", positive: true },
          { label: "未確認", value: "unknown" },
        ],
      },
      finding("gait-difficulty", "歩行困難", "立位・歩行時", "跛行、ふらつき、疼痛の誘発を見る", "疼痛性・神経性・循環性疾患", "原因となる動作を言語化してもらいます"),
      finding("hip-pain", "股関節痛", "鼠径部、臀部、大転子", "自動運動後に必要なら他動運動する", "股関節疾患、関連痛", "疼痛部位を指一本で示してもらいます"),
      finding("knee-pain", "膝痛", "関節裂隙と膝窩", "屈伸と軽い触診で再現性をみる", "関節炎、Baker嚢胞", "関節液貯留も確認します"),
      finding("rom", "ROM制限", "股・膝・足関節", "自動可動域を左右比較する", "関節炎、疼痛、拘縮", "疼痛が出る直前で止めます"),
      finding("weight-bearing", "荷重痛", "立位時の下肢", "安全な支持下で段階的に荷重する", "骨・関節・軟部組織病変", "荷重不能は画像評価の閾値を下げます"),
      finding("baker", "Baker嚢胞疑い", "膝窩", "膝を軽く伸展し膨隆を視触診する", "膝関節液貯留、破裂による偽性血栓性静脈炎", "強い触診やマッサージは避けます"),
    ],
  },
  {
    id: "general",
    number: 4,
    title: "全身を診る",
    english: "GENERAL",
    description: "局所から離れて体液貯留の手掛かりを探します",
    items: [
      finding("jvd", "頸静脈怒張", "右内頸静脈", "上体30–45度で接線方向の光を当て拍動を見る", "右心不全、体液過剰", "外頸静脈だけで判断しません"),
      finding("crackles", "肺ラ音", "両側背部下肺野", "座位で深呼吸してもらい左右比較する", "肺うっ血、間質性肺疾患", "咳で変化するかも確認します"),
      finding("s3", "Ⅲ音", "心尖部", "左側臥位でベル面を軽く当てる", "容量負荷、心不全", "頻脈時はリズムと同期して聴きます"),
      finding("ascites", "腹水", "腹部全体", "膨隆を観察し濁音界移動を確認する", "肝疾患、心不全、悪性疾患", "少量腹水は診察だけで除外できません"),
      finding("hepatomegaly", "肝腫大", "右季肋部", "右下腹部から吸気に合わせて触診する", "右心不全、肝疾患", "圧痛や拍動性も記録します"),
      {
        id: "jvp",
        label: "頸静脈圧",
        prompt: "推定頸静脈圧は？",
        choices: [
          { label: "正常範囲", value: "normal" },
          { label: "上昇", value: "high", positive: true },
          { label: "未確認", value: "unknown" },
        ],
        guide: guide("右内頸静脈拍動の最高点", "胸骨角から垂直距離を測る", "胸骨角から概ね3cm以下", "明らかな上昇", "右房圧上昇、心不全", "体幹角度を記録し、必要なら腹頸静脈逆流も確認します"),
      },
    ],
  },
  {
    id: "history",
    number: 5,
    title: "問診",
    english: "HISTORY",
    description: "診察所見を時間軸とリスクでつなぎます",
    items: [
      "急性", "慢性", "日内変動", "挙上で改善", "長時間立位", "長距離移動",
      "手術歴", "悪性腫瘍", "放射線治療", "リンパ節郭清", "薬剤開始",
    ].map((label, index) => ({
      id: `history-${index + 1}`,
      label,
      prompt: `${label}に該当しますか？`,
      choices: yesNo,
    })),
  },
  {
    id: "tests",
    number: 6,
    title: "必要時のみ検査",
    english: "TESTS",
    description: "診察で立てた仮説を確かめる最小限の検査です",
    optional: true,
    items: ["BNP", "Alb", "Cr", "尿蛋白", "TSH", "D-dimer"].map(
      (label, index) => ({
        id: `test-${index + 1}`,
        label,
        prompt: `${label}を確認しますか？`,
        choices: [
          { label: "確認する", value: "ordered", positive: true },
          { label: "不要", value: "not-needed" },
          { label: "保留", value: "unknown" },
        ],
      }),
    ),
  },
];

export const physicalExamItemIds = new Set(
  examSteps
    .filter((step) => ["look", "feel", "move", "general"].includes(step.id))
    .flatMap((step) => step.items.map((item) => item.id)),
);

export const allItems = [...redFlags, ...examSteps.flatMap((step) => step.items)];

