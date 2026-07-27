export type EvidenceSource = {
  id: string;
  title: string;
  publisher: string;
  year: number;
  usedFor: string;
  url: string;
};

export const evidenceSources: EvidenceSource[] = [
  {
    id: "aafp-2022",
    title: "Peripheral Edema: Evaluation and Management in Primary Care",
    publisher: "American Family Physician",
    year: 2022,
    usedFor: "急性/慢性、片側/両側の初期分岐、初期検査、DVT・静脈不全・全身性浮腫の評価",
    url: "https://www.aafp.org/pubs/afp/issues/2022/1100/peripheral-edema.html",
  },
  {
    id: "gasparis-2020",
    title: "Diagnostic approach to lower limb edema",
    publisher: "Phlebology",
    year: 2020,
    usedFor: "局所性/全身性、静脈性/リンパ性の鑑別と段階的画像評価",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7536506/",
  },
  {
    id: "nice-ng158",
    title: "Venous thromboembolic diseases: diagnosis and management",
    publisher: "National Institute for Health and Care Excellence",
    year: 2020,
    usedFor: "2-level DVT Wells scoreの検証済み項目・点数・判定",
    url: "https://www.nice.org.uk/guidance/ng158/chapter/Recommendations",
  },
  {
    id: "esc-hf-2021",
    title: "2021 ESC Guidelines for acute and chronic heart failure",
    publisher: "European Society of Cardiology / European Heart Journal",
    year: 2021,
    usedFor: "急性心不全のBNP・NT-proBNP除外値、年齢別rule-in値、交絡因子",
    url: "https://academic.oup.com/eurheartj/article/42/36/3599/6358045",
  },
  {
    id: "pride-2005",
    title: "The N-terminal Pro-BNP Investigation of Dyspnea in the Emergency Department study",
    publisher: "The American Journal of Cardiology",
    year: 2005,
    usedFor: "NT-proBNP 300 pg/mLのrule-outと年齢別rule-in値の検証",
    url: "https://pubmed.ncbi.nlm.nih.gov/15820160/",
  },
  {
    id: "isl-2016",
    title: "The Diagnosis and Treatment of Peripheral Lymphedema: Consensus Document",
    publisher: "International Society of Lymphology",
    year: 2016,
    usedFor: "リンパ浮腫の臨床診断、病期による圧痕性から非圧痕性への変化",
    url: "https://pubmed.ncbi.nlm.nih.gov/29908550/",
  },
  {
    id: "ata-thyroid-tests",
    title: "Thyroid Function Tests",
    publisher: "American Thyroid Association",
    year: 2024,
    usedFor: "TSHとFT4の組み合わせによる原発性・中枢性甲状腺機能低下症の判定",
    url: "https://www.thyroid.org/thyroid-function-tests/",
  },
  {
    id: "aafp-hypothyroidism-2021",
    title: "Hypothyroidism: Diagnosis and Treatment",
    publisher: "American Family Physician",
    year: 2021,
    usedFor: "顕性・潜在性・中枢性の分類、身体所見、潜在性を過大評価しない評価",
    url: "https://www.aafp.org/pubs/afp/issues/2021/0515/p605.html",
  },
];

export const sourceMap = Object.fromEntries(
  evidenceSources.map((source) => [source.id, source]),
);
