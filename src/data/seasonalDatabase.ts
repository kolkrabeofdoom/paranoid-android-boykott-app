export interface SeasonalItem {
  id: string;
  name: string;
  category: 'vegetable' | 'fruit' | 'herb';
  months: number[]; // 0 = Jan, 11 = Dec
  type: 'freiland' | 'lager' | 'geschuetzt'; // Cultivation type
  tips?: string; // Purchasing/culinary tip
}

export const seasonalItems: SeasonalItem[] = [
  // --- GEMÜSE (VEGETABLES) ---
  {
    id: "kartoffel",
    name: "Kartoffeln",
    category: "vegetable",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    type: "lager",
    tips: "Heimische Lagerware ist das ganze Jahr verfügbar. Frühkartoffeln gibt es ab Juni frisch vom Feld."
  },
  {
    id: "karotte",
    name: "Karotten / Möhren",
    category: "vegetable",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    type: "lager",
    tips: "Bundmöhren mit frischem Grün gibt es ab Juni. Gelagert sind sie das ganze Jahr über regional erhältlich."
  },
  {
    id: "spargel",
    name: "Spargel (weiß & grün)",
    category: "vegetable",
    months: [3, 4, 5], // April, May, June
    type: "freiland",
    tips: "Die Spargelzeit endet traditionell am 24. Juni (Johannistag). Am besten ganz frisch vom lokalen Erzeuger kaufen."
  },
  {
    id: "zucchini",
    name: "Zucchini",
    category: "vegetable",
    months: [5, 6, 7, 8, 9], // June - October
    type: "freiland",
    tips: "Kleine Zucchini (bis 20cm) schmecken am zartesten und eignen sich hervorragend für Salate oder Pfannengerichte."
  },
  {
    id: "kuerbis",
    name: "Kürbis (Hokkaido / Butternut)",
    category: "vegetable",
    months: [7, 8, 9, 10, 11, 0], // Aug - Jan (open field + stored)
    type: "freiland",
    tips: "Erntezeit ist von August bis November. Durch gute Lagereigenschaften bis in den Januar hinein regional verfügbar."
  },
  {
    id: "spinat",
    name: "Spinat",
    category: "vegetable",
    months: [3, 4, 5, 8, 9, 10], // April-June, Sept-Nov
    type: "freiland",
    tips: "Frischer Frühlingsspinat schmeckt roh im Salat toll. Der kräftigere Herbstspinat eignet sich ideal zum Dünsten."
  },
  {
    id: "rote_bete",
    name: "Rote Bete",
    category: "vegetable",
    months: [6, 7, 8, 9, 10, 11, 0, 1, 2, 3], // July - April (fresh + stored)
    type: "freiland",
    tips: "Frische Rote Bete gibt es ab Juli. Gelagerte Knollen versorgen uns den ganzen Winter über mit Vitamin C und Eisen."
  },
  {
    id: "rosenkohl",
    name: "Rosenkohl",
    category: "vegetable",
    months: [8, 9, 10, 11, 0, 1, 2], // Sept - March
    type: "freiland",
    tips: "Rosenkohl entfaltet sein volles, süßlich-mildes Aroma erst, wenn er den ersten Frost auf dem Feld abbekommen hat."
  },
  {
    id: "gruenkohl",
    name: "Grünkohl",
    category: "vegetable",
    months: [10, 11, 0, 1], // Nov - Feb
    type: "freiland",
    tips: "Ein echtes Winter-Superfood! Reich an Calcium, Eisen und Vitaminen. Toll als traditioneller Eintopf oder moderne Chips."
  },
  {
    id: "brokkoli",
    name: "Brokkoli",
    category: "vegetable",
    months: [5, 6, 7, 8, 9, 10], // June - Nov
    type: "freiland",
    tips: "Achte beim Kauf auf fest geschlossene, tiefgrüne bis blaugrüne Röschen. Schmeckt gedünstet oder im Auflauf."
  },
  {
    id: "blumenkohl",
    name: "Blumenkohl",
    category: "vegetable",
    months: [4, 5, 6, 7, 8, 9, 10], // May - Nov
    type: "freiland",
    tips: "Durch Blätter geschützt bleibt er schön weiß. Kann auch geraspelt roh als kohlenhydratarmer 'Blumenkohlreis' gegessen werden."
  },
  {
    id: "tomate",
    name: "Tomaten",
    category: "vegetable",
    months: [4, 5, 6, 7, 8, 9], // May - Oct
    type: "geschuetzt",
    tips: "Regionale Tomaten schmecken durch Sonne und Reifezeit unvergleichlich aromatisch. Außerhalb der Saison oft wässrig."
  },
  {
    id: "gurke",
    name: "Salatgurken",
    category: "vegetable",
    months: [5, 6, 7, 8, 9], // June - Oct
    type: "geschuetzt",
    tips: "Bestehen zu 95% aus Wasser und sind der ideale Sommer-Snack. Am besten mit Schale essen (vorher gut waschen)."
  },
  {
    id: "radieschen",
    name: "Radieschen",
    category: "vegetable",
    months: [3, 4, 5, 6, 7, 8, 9], // April - Oct
    type: "freiland",
    tips: "Die feine Schärfe stammt von Senfölen, die das Immunsystem stärken. Schmecken toll in dünnen Scheiben auf Butterbrot."
  },
  {
    id: "porree",
    name: "Porree / Lauch",
    category: "vegetable",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    type: "freiland",
    tips: "Man unterscheidet Sommer- und Winterlauch. Winterlauch ist kräftiger und hält frostigen Temperaturen stand."
  },

  // --- OBST (FRUITS) ---
  {
    id: "apfel",
    name: "Äpfel",
    category: "fruit",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    type: "lager",
    tips: "Frische Ernte ab August. Durch modernste Lagerverfahren sind regionale Äpfel das gesamte Jahr über knackig verfügbar."
  },
  {
    id: "birne",
    name: "Birnen",
    category: "fruit",
    months: [7, 8, 9, 10, 11, 0], // Aug - Jan
    type: "lager",
    tips: "Frische Ernte ab August. Reifen bei Zimmertemperatur schnell nach und werden wunderbar süß und saftig."
  },
  {
    id: "erdbeere",
    name: "Erdbeeren",
    category: "fruit",
    months: [4, 5, 6], // May - July
    type: "freiland",
    tips: "Erdbeeren reifen nach dem Pflücken nicht nach! Kaufe sie prall, glänzend und ohne grüne Spitzen am besten direkt am Erdbeerstand."
  },
  {
    id: "himbeere",
    name: "Himbeeren",
    category: "fruit",
    months: [5, 6, 7, 8], // June - Sept
    type: "freiland",
    tips: "Sehr druckempfindlich und rasch verderblich. Am besten frisch gepflückt am selben Tag vernaschen."
  },
  {
    id: "kirsche",
    name: "Süß- & Sauerkirschen",
    category: "fruit",
    months: [5, 6, 7], // June - Aug
    type: "freiland",
    tips: "Werden traditionell in den 'Kirschenwochen' geerntet. Schützen durch Anthocyane die Gefäße und Zellen."
  },
  {
    id: "pflaume",
    name: "Pflaumen / Zwetschgen",
    category: "fruit",
    months: [6, 7, 8, 9], // July - Oct
    type: "freiland",
    tips: "Der weißliche Wachsfilm ist ein natürlicher Verdunstungsschutz. Erst kurz vor dem Verzehr abwaschen."
  },
  {
    id: "rhabarber",
    name: "Rhabarber",
    category: "fruit",
    months: [3, 4, 5], // April - June
    type: "freiland",
    tips: "Botanisch gesehen ein Gemüse, wird aber als Obst zubereitet. Enthält Oxalsäure – daher ab Mitte Juni nicht mehr ernten."
  },
  {
    id: "heidelbeere",
    name: "Heidelbeeren / Blaubeeren",
    category: "fruit",
    months: [6, 7, 8], // July - Sept
    type: "freiland",
    tips: "Heimische Kulturheidelbeeren haben helles Fruchtfleisch. Wilde Heidelbeeren sind kleiner und färben Zunge und Zähne blau."
  },

  // --- KRÄUTER (HERBS) ---
  {
    id: "baerlauch",
    name: "Bärlauch",
    category: "herb",
    months: [2, 3, 4], // March - May
    type: "freiland",
    tips: "Wächst wild im Wald und duftet herrlich nach Knoblauch. Perfekt für frisches Bärlauch-Pesto oder Butter."
  },
  {
    id: "petersilie",
    name: "Petersilie",
    category: "herb",
    months: [4, 5, 6, 7, 8, 9, 10], // May - Nov
    type: "freiland",
    tips: "Echtes Vitamin-C-Wunder! Man unterscheidet krause (dekorativer) und glatte Petersilie (aromatischer)."
  },
  {
    id: "schnittlauch",
    name: "Schnittlauch",
    category: "herb",
    months: [3, 4, 5, 6, 7, 8, 9, 10], // April - Nov
    type: "freiland",
    tips: "Gedeiht auf jedem Balkon. Die lila Blüten sind essbar und machen sich hervorragend als Deko auf Salaten."
  },
  {
    id: "basilikum",
    name: "Basilikum",
    category: "herb",
    months: [5, 6, 7, 8], // June - Sept
    type: "geschuetzt",
    tips: "Braucht viel Wärme und Sonne. Am besten die Triebspitzen abzupfen statt einzelner Blätter – das regt das Wachstum an."
  },
  {
    id: "dill",
    name: "Dill",
    category: "herb",
    months: [4, 5, 6, 7, 8, 9], // May - Oct
    type: "freiland",
    tips: "Das klassische Gurkenkraut! Passt perfekt zu sommerlichen Salaten, feinen Marinaden oder Kartoffelgerichten."
  }
];

export const getSeasonalItemsByMonth = (month: number): SeasonalItem[] => {
  return seasonalItems.filter(item => item.months.includes(month));
};
