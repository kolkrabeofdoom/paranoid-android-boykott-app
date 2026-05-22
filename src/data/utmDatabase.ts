export interface UTMBrand {
  id: string;
  name: string;
  category: string;
  description: string;
  relation: string;
  corporation: 'muller' | 'nestle' | 'anthroposophy';
}

export interface UTMPlant {
  code: string;
  name: string;
  city: string;
  state: string;
  description: string;
  corporation: 'muller' | 'nestle' | 'anthroposophy';
}

export interface Alternative {
  name: string;
  type: 'organic' | 'regional' | 'plant-based' | 'independent';
  description: string;
  recommendedFor: string[];
  isAnthroposophic?: boolean;
}

export interface BoycottReason {
  title: string;
  description: string;
  details: string;
  corporation: 'muller' | 'nestle' | 'anthroposophy';
}

export interface OfflineProduct {
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  matchedBrandId: string;
}


// Normalized brands list for fast matching (Müller and Nestlé)
export const utmBrands: Record<string, UTMBrand> = {
  // --- MÜLLER-GRUPPE ---
  muller: {
    id: "muller",
    name: "Müller (Müllermilch)",
    category: "Milchmischgetränke, Joghurt, Dessert",
    description: "Die Kernmarke der Unternehmensgruppe. Bekannt für Müllermilch, Joghurt mit der Ecke, Milchreis und Reine Buttermilch.",
    relation: "Direkte Hauptmarke der Molkerei Alois Müller.",
    corporation: "muller"
  },
  mullermilch: {
    id: "muller",
    name: "Müllermilch",
    category: "Milchmischgetränke",
    description: "Bekanntes Milchmischgetränk in verschiedenen Geschmacksrichtungen.",
    relation: "Direkte Hauptmarke der Molkerei Alois Müller.",
    corporation: "muller"
  },
  weihenstephan: {
    id: "weihenstephan",
    name: "Weihenstephan",
    category: "Premium-Milchprodukte, Butter, Sahne, Joghurt",
    description: "Traditionsreiche Marke aus Freising, die 2000 von Müller übernommen wurde. Vermarktet als Premium-Marke.",
    relation: "100%ige Tochtergesellschaft der Müller-Gruppe (Staatliche Molkerei Weihenstephan GmbH & Co. KG).",
    corporation: "muller"
  },
  sachsenmilch: {
    id: "sachsenmilch",
    name: "Sachsenmilch",
    category: "Milch, Butter, Käse, Joghurt",
    description: "Regionale Marke in Ostdeutschland. Der Standort Leppersdorf ist eine der größten und modernsten Molkereien Europas.",
    relation: "Gehört seit 1994 vollständig zur Unternehmensgruppe Theo Müller.",
    corporation: "muller"
  },
  landliebe: {
    id: "landliebe",
    name: "Landliebe",
    category: "Joghurt, Milch, Pudding, Butter",
    description: "Traditionelle Marke mit ländlichem Image. Wurde im April 2023 von FrieslandCampina übernommen.",
    relation: "Im Zuge der Übernahme des deutschen Konsumgeschäfts von FrieslandCampina an Müller übergegangen.",
    corporation: "muller"
  },
  almhof: {
    id: "almhof",
    name: "Almhof",
    category: "Joghurt, Desserts",
    description: "Bekannte Marke in den Niederlanden und teilweise in Westdeutschland.",
    relation: "Tochtergesellschaft der Unternehmensgruppe Theo Müller.",
    corporation: "muller"
  },
  elinas: {
    id: "elinas",
    name: "Elinas",
    category: "Joghurt nach griechischer Art",
    description: "Spezialitäten-Joghurtmarke im deutschen Lebensmittelhandel.",
    relation: "Marke der Molkerei Alois Müller GmbH & Co. KG.",
    corporation: "muller"
  },
  lunebest: {
    id: "lunebest",
    name: "Lünebest",
    category: "Wackelpudding, Joghurt, Desserts",
    description: "Traditionsmarke für süße Desserts, bekannt für Wackelpudding und Becher-Joghurts.",
    relation: "Wurde von Müller übernommen (Betriebsstätte Elsterwerda).",
    corporation: "muller"
  },
  kasereloose: {
    id: "kasereloose",
    name: "Käserei Loose",
    category: "Sauermilchkäse, Quäse, Harzer Käse",
    description: "Bekanntester Hersteller von Sauermilchkäse in Deutschland (Quäse, Loose Hausmacher).",
    relation: "Seit 1998 eine eigenständige Tochtergesellschaft der Unternehmensgruppe Theo Müller.",
    corporation: "muller"
  },
  loose: {
    id: "kasereloose",
    name: "Loose",
    category: "Käse",
    description: "Sauermilchkäse-Spezialitäten.",
    relation: "Gehört zur Käserei Loose (Müller-Gruppe).",
    corporation: "muller"
  },
  quase: {
    id: "kasereloose",
    name: "Quäse",
    category: "Käse",
    description: "Fitness-Käse aus Sauermilchquark, reich an Protein.",
    relation: "Marke der Käserei Loose, die zur Müller-Gruppe gehört.",
    corporation: "muller"
  },
  nadler: {
    id: "nadler",
    name: "Nadler",
    category: "Feinkost, Fischspezialitäten, Saucen",
    description: "Bekannte Marke für Heringssalate, Brotaufstriche und Fisch-Feinkost.",
    relation: "Gehört zur Homann-Gruppe und verblieb nach dem Verkauf der Salatsparte bei der Müller-Gruppe.",
    corporation: "muller"
  },
  homann: {
    id: "homann",
    name: "Homann",
    category: "Saucen, Dressings, Fischprodukte",
    description: "Bekannte Feinkostmarke. ACHTUNG: Die Feinkostsalate-Sparte wurde 2021 an Signature Foods verkauft. Dressings, Saucen und Fischprodukte gehören weiterhin zu Müller.",
    relation: "Saucen und Fisch verbleiben in der Müller-Feinkostsparte. Salate sind unabhängig.",
    corporation: "muller"
  },
  berief: {
    id: "berief",
    name: "Berief",
    category: "Pflanzliche Drinks, Tofu, Joghurt-Alternativen",
    description: "Bio-Pflanzendrink- und Tofu-Hersteller aus Beckum. Die Übernahme durch die Unternehmensgruppe Theo Müller wurde im Mai 2026 bekannt gegeben.",
    relation: "Wird innerhalb der Müller-Gruppe zur Stärkung der pflanzlichen Feinkost- und Molkereisparte geführt.",
    corporation: "muller"
  },

  // --- NESTLÉ-KONZERN ---
  nestle: {
    id: "nestle",
    name: "Nestlé",
    category: "Mutterkonzern, diverse Produkte",
    description: "Der größte Lebensmittelkonzern der Welt. Deckt unzählige Marken ab.",
    relation: "Direkte Hauptmarke des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  nescafe: {
    id: "nescafe",
    name: "Nescafé",
    category: "Kaffee, Löskaffee, Kaffeemischgetränke",
    description: "Weltweit führende Marke für Instantkaffee und Kaffeemaschinensysteme.",
    relation: "Kernmarke von Nestlé.",
    corporation: "nestle"
  },
  nespresso: {
    id: "nespresso",
    name: "Nespresso",
    category: "Kaffeekapseln, Kaffeemaschinen",
    description: "Pionier bei portioniertem Premium-Kapselkaffee.",
    relation: "Eigenständige Tochtergesellschaft des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  dolcegusto: {
    id: "dolcegusto",
    name: "Nescafé Dolce Gusto",
    category: "Kaffeekapseln, Heißgetränke",
    description: "Kapsel-Kaffeesystem für den Massenmarkt.",
    relation: "Kapselmarke von Nestlé.",
    corporation: "nestle"
  },
  caro: {
    id: "caro",
    name: "Caro Landkaffee",
    category: "Kaffee-Ersatz, Getreidekaffee",
    description: "Löslicher Getreidekaffee aus Gerste, Roggen und Zichorie.",
    relation: "Marke von Nestlé.",
    corporation: "nestle"
  },
  nesquik: {
    id: "nesquik",
    name: "Nesquik",
    category: "Kakaopulver, Cerealien, Milchgetränke",
    description: "Bekanntes zuckerreiches Kakaopulver und Frühstücksflocken mit dem Hasen-Maskottchen.",
    relation: "Klassische Nestlé-Süßwarenmarke.",
    corporation: "nestle"
  },
  maggi: {
    id: "maggi",
    name: "Maggi",
    category: "Suppen, Fertiggerichte, Saucen, Bouillons",
    description: "Marktführer bei Fertiggerichten, Tütensuppen, Brühen und Küchenhelfern (z. B. Maggi-Würze, 5-Minuten-Terrine).",
    relation: "Seit 1947 eine der wichtigsten und bekanntesten Nestlé-Tochtergesellschaften.",
    corporation: "nestle"
  },
  thomy: {
    id: "thomy",
    name: "Thomy",
    category: "Mayonnaise, Senf, Salatdressings, Saucen",
    description: "Feinkost-Spezialist in Tuben und Gläsern, extrem weit verbreitet.",
    relation: "Gehört seit 1971 vollständig zum Nestlé-Konzern.",
    corporation: "nestle"
  },
  gardengourmet: {
    id: "gardengourmet",
    name: "Garden Gourmet",
    category: "Vegetarische & Vegane Fleischalternativen",
    description: "Große Marke für fleischfreie Burger, Geschnetzeltes und vegane Fertiggerichte.",
    relation: "Die Hauptmarke von Nestlé im pflanzlichen Fleischersatz-Sektor.",
    corporation: "nestle"
  },
  buitoni: {
    id: "buitoni",
    name: "Buitoni",
    category: "Pastasaucen, Pesto, Fertiggerichte",
    description: "Traditionelle italienische Nudel- und Saucenmarke. ACHTUNG: Die Marke wurde in manchen Nudelbereichen lizenziert, Pastasaucen und Pesto gehören aber weiterhin zu Nestlé.",
    relation: "Gehört im Saucenbereich direkt zu Nestlé.",
    corporation: "nestle"
  },
  vittel: {
    id: "vittel",
    name: "Vittel",
    category: "Mineralwasser",
    description: "Stilles französisches Mineralwasser. Stand wegen des Abpumpens von Grundwasser in Vittel (Frankreich) extrem in der Kritik.",
    relation: "Premium-Wassermarke von Nestlé.",
    corporation: "nestle"
  },
  sanpellegrino: {
    id: "sanpellegrino",
    name: "San Pellegrino",
    category: "Mineralwasser, Edel-Limonaden",
    description: "Prickelndes italienisches Mineralwasser und Premium-Limonaden in Dosen.",
    relation: "Wurde 1997 vom Nestlé-Konzern übernommen.",
    corporation: "nestle"
  },
  acquapanna: {
    id: "acquapanna",
    name: "Acqua Panna",
    category: "Mineralwasser",
    description: "Stilles toskanisches Premium-Mineralwasser, häufig in der Gastronomie.",
    relation: "Gehört zur Sanpellegrino-Sparte von Nestlé.",
    corporation: "nestle"
  },
  perrier: {
    id: "perrier",
    name: "Perrier",
    category: "Mineralwasser",
    description: "Französisches kohlensäurehaltiges Mineralwasser in grünen Glasflaschen.",
    relation: "Premium-Wassermarke von Nestlé.",
    corporation: "nestle"
  },
  kitkat: {
    id: "kitkat",
    name: "KitKat",
    category: "Süßwaren, Schokoriegel",
    description: "Weltberühmter Knusper-Schokoriegel in roter Verpackung ('Have a break...').",
    relation: "Kernmarke der Süßwarensparte von Nestlé.",
    corporation: "nestle"
  },
  smarties: {
    id: "smarties",
    name: "Smarties",
    category: "Süßwaren, Schokolinsen",
    description: "Bunte Schokolinsen mit Zuckerüberzug, verpackt in Papprollen.",
    relation: "Marke des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  lion: {
    id: "lion",
    name: "Lion",
    category: "Süßwaren, Schokoriegel, Cerealien",
    description: "Knuspriger Riegel mit Karamell, Waffel und Knusperreis sowie Lion-Frühstücksflocken.",
    relation: "Süßwarenmarke des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  aftereight: {
    id: "aftereight",
    name: "After Eight",
    category: "Feine Schokolade, Pfefferminztäfelchen",
    description: "Hauchdünne Täfelchen aus Zartbitterschokolade mit flüssiger Minzfüllung.",
    relation: "Marke des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  chococrossies: {
    id: "chococrossies",
    name: "Choclait Chips / Choco Crossies",
    category: "Süßwaren, Schoko-Knabbereien",
    description: "Beliebte Knusperpralinen mit Cornflakes und Schokolade.",
    relation: "Marken des Nestlé-Konzerns.",
    corporation: "nestle"
  },
  wagner: {
    id: "wagner",
    name: "Original Wagner (Wagner Pizza)",
    category: "Tiefkühlpizza, Flammkuchen, Snacks",
    description: "Einer der Marktführer bei Tiefkühlpizzen in Deutschland (Steinofen Pizza, Ernst Wagners, Piccolinis).",
    relation: "Seit 2013 eine 100%ige Tochtergesellschaft von Nestlé.",
    corporation: "nestle"
  },
  beba: {
    id: "beba",
    name: "Beba (Nestlé BEBA)",
    category: "Säuglingsnahrung, Babymilch",
    description: "Weit verbreitete Babynahrung und Milchpulver für Säuglinge.",
    relation: "Die Säuglingsnahrungsmarke von Nestlé.",
    corporation: "nestle"
  },
  purina: {
    id: "purina",
    name: "Purina (Felix / Gourmet / Beneful)",
    category: "Tiernahrung, Katzenfutter, Hundefutter",
    description: "Gigantische Haustiernahrungs-Sparte. Umfasst Marken wie Felix, Gourmet, Beneful, ONE und Pro Plan.",
    relation: "Tiernahrungssparte von Nestlé.",
    corporation: "nestle"
  },
  felix: {
    id: "felix",
    name: "Felix",
    category: "Tiernahrung, Katzenfutter",
    description: "Sehr bekanntes Katzenfutter mit der schwarz-weißen Katze.",
    relation: "Marke von Nestlé Purina.",
    corporation: "nestle"
  },
  gourmet: {
    id: "gourmet",
    name: "Gourmet (Katzenfutter)",
    category: "Tiernahrung, Katzenfutter",
    description: "Feuchtfutter-Dosen für Katzen im Premium-Segment.",
    relation: "Marke von Nestlé Purina.",
    corporation: "nestle"
  },
  
  // --- ANTHROPOSOPHIE & DEMETER ---
  alnatura: {
    id: "alnatura",
    name: "Alnatura",
    category: "Bio-Lebensmittel, Supermarktkette",
    description: "Führende deutsche Marke und Handelskette für ökologische Lebensmittel. Gegründet von Götz Rehn.",
    relation: "Gegründet und geführt nach anthroposophischen Idealen; enge finanzielle und personelle Verflechtungen mit anthroposophischen Stiftungen und Organisationen.",
    corporation: "anthroposophy"
  },
  weleda: {
    id: "weleda",
    name: "Weleda",
    category: "Naturkosmetik, Anthroposophische Heilmittel",
    description: "Der weltweite Marktführer für Naturkosmetik und anthroposophische Arzneimittel.",
    relation: "1921 von Rudolf Steiner (Begründer der Anthroposophie) und Ita Wegman mitbegründet. Die Anthroposophische Gesellschaft hält bis heute signifikante Anteile.",
    corporation: "anthroposophy"
  },
  wala: {
    id: "wala",
    name: "WALA / Dr. Hauschka",
    category: "Homöopathische Arzneimittel, Naturkosmetik",
    description: "Trägergesellschaft für WALA Arzneimittel und Dr. Hauschka Kosmetik.",
    relation: "Geführt von einer anthroposophischen Stiftung. Sämtliche Präparate und Kosmetika basieren auf Rudolf Steiners Lehren und rhythmischen Herstellungsverfahren.",
    corporation: "anthroposophy"
  },
  drhauschka: {
    id: "drhauschka",
    name: "Dr. Hauschka",
    category: "Premium-Naturkosmetik",
    description: "Sehr bekannte, hochwertige Naturkosmetik-Sparte der WALA Heilmittel GmbH.",
    relation: "100 % anthroposophisch konzipierte Kosmetikmarke der WALA-Stiftung.",
    corporation: "anthroposophy"
  },
  demeter: {
    id: "demeter",
    name: "Demeter (Zertifizierung / Verband)",
    category: "Bio-Lebensmittel, Zertifikat",
    description: "Der älteste ökologische Anbauverband in Deutschland. Kennzeichnet biodynamisch erzeugte Produkte.",
    relation: "Basiert vollständig auf Rudolf Steiners esoterischen Vorlesungen 'Landwirtschaftlicher Kurs' von 1924 (u.a. kosmische Rhythmen, Hornmist-Präparate).",
    corporation: "anthroposophy"
  },
  bauckhof: {
    id: "bauckhof",
    name: "Bauckhof",
    category: "Bio-Mehl, Backmischungen, Müsli",
    description: "Einer der ältesten und größten biodynamischen Mühlenbetriebe Deutschlands.",
    relation: "Pionierbetrieb der biologisch-dynamischen Landwirtschaft, der streng nach Steiners Lehren und Demeter-Richtlinien geführt wird.",
    corporation: "anthroposophy"
  },
  voelkel: {
    id: "voelkel",
    name: "Voelkel",
    category: "Bio-Säfte, Limonaden",
    description: "Führende deutsche Naturkostsaftkellerei mit großem Sortiment.",
    relation: "Familienbetrieb mit tiefen anthroposophischen Wurzeln; produziert einen Großteil seines Sortiments nach Demeter-Richtlinien.",
    corporation: "anthroposophy"
  },
  holle: {
    id: "holle",
    name: "Holle Baby Food",
    category: "Säuglingsnahrung, Babynahrung",
    description: "Traditionsreiche Marke für Bio- und Demeter-Säuglingsnahrung.",
    relation: "Einer der ältesten Demeter-Hersteller im Babysegment. Vertritt explizit anthroposophische Ernährungslehren für Säuglinge.",
    corporation: "anthroposophy"
  },
  spielberger: {
    id: "spielberger",
    name: "Spielberger Mühle",
    category: "Mühlenprodukte, Getreide, Flocken",
    description: "Großer Demeter-Verarbeiter von Getreideflocken und Mehlen.",
    relation: "Arbeitet konsequent nach biologisch-dynamischen Demeter-Prinzipien und fördert anthroposophisch geprägte Züchtungsinitiativen.",
    corporation: "anthroposophy"
  },
  dm: {
    id: "dm",
    name: "dm-drogerie markt",
    category: "Drogerie, Kosmetik, Bio-Lebensmittel",
    description: "Führende europäische Drogeriekette. Gegründet von Götz Werner.",
    relation: "Götz Werner war überzeugter Anthroposoph und gestaltete dm nach Rudolf Steiners Lehren zur 'sozialen Dreigliederung' und anthroposophischen Führungsprinzipien. dm kooperiert extrem eng mit Alnatura und Weleda.",
    corporation: "anthroposophy"
  },
  dmdrogeriemarkt: {
    id: "dm",
    name: "dm-drogerie markt",
    category: "Drogerie, Kosmetik, Bio-Lebensmittel",
    description: "Führende europäische Drogeriekette.",
    relation: "Gegründet und geführt nach anthroposophischen Führungsprinzipien.",
    corporation: "anthroposophy"
  },
  alverde: {
    id: "alverde",
    name: "alverde Naturkosmetik",
    category: "Naturkosmetik, Drogerieartikel",
    description: "Die zertifizierte Naturkosmetik-Eigenmarke von dm-drogerie markt.",
    relation: "Als dm-Eigenmarke eng mit den anthroposophischen Werten des Mutterkonzerns und dessen anthroposophischen Zulieferern (wie Weleda/WALA) verknüpft.",
    corporation: "anthroposophy"
  }
};

// Known UTM Plant Codes (Genusstauglichkeitskennzeichen / Identitätskennzeichen)
export const utmPlants: Record<string, UTMPlant> = {
  deby718eg: {
    code: "DE BY 718 EG",
    name: "Molkerei Alois Müller GmbH & Co. KG",
    city: "Aretsried",
    state: "Bayern",
    description: "Das Stammhaus der Molkerei Müller. Hier werden Müllermilch, Joghurt mit der Ecke und Buttermilch produziert.",
    corporation: "muller"
  },
  deby718ec: {
    code: "DE BY 718 EC",
    name: "Molkerei Alois Müller GmbH & Co. KG",
    city: "Aretsried",
    state: "Bayern",
    description: "Das Stammhaus der Molkerei Müller. Hier werden Müllermilch, Joghurt mit der Ecke und Buttermilch produziert.",
    corporation: "muller"
  },
  desn016eg: {
    code: "DE SN 016 EG",
    name: "Sachsenmilch Leppersdorf GmbH",
    city: "Leppersdorf",
    state: "Sachsen",
    description: "Eine der größten Molkereien Europas. Produziert Sachsenmilch-Produkte, aber auch in riesigem Umfang Handelsmarken (z.B. Milbona, ja!, Gut & Günstig) für Lidl, Aldi, Edeka, REWE.",
    corporation: "muller"
  },
  desn016ec: {
    code: "DE SN 016 EC",
    name: "Sachsenmilch Leppersdorf GmbH",
    city: "Leppersdorf",
    state: "Sachsen",
    description: "Eine der größten Molkereien Europas. Produziert Sachsenmilch-Produkte, aber auch in riesigem Umfang Handelsmarken (z.B. Milbona, ja!, Gut & Günstig) für Lidl, Aldi, Edeka, REWE.",
    corporation: "muller"
  },
  deby103eg: {
    code: "DE BY 103 EG",
    name: "Molkerei Weihenstephan (Staatliche Molkerei Weihenstephan GmbH & Co. KG)",
    city: "Freising",
    state: "Bayern",
    description: "Ehemalige staatliche Traditionsmolkerei, heute Müller-Tochter. Produziert alle Weihenstephan-Milchprodukte, Butter und Rahm.",
    corporation: "muller"
  },
  deby103ec: {
    code: "DE BY 103 EC",
    name: "Molkerei Weihenstephan",
    city: "Freising",
    state: "Bayern",
    description: "Ehemalige staatliche Traditionsmolkerei, heute Müller-Tochter. Produziert alle Weihenstephan-Milchprodukte, Butter und Rahm.",
    corporation: "muller"
  },
  denw401eg: {
    code: "DE NW 401 EG",
    name: "Molkerei Köln (ehem. FrieslandCampina)",
    city: "Köln",
    state: "Nordrhein-Westfalen",
    description: "Molkerei-Standort in Köln, im April 2023 von FrieslandCampina an Müller übergeben. Hier werden u.a. Landliebe-Produkte hergestellt.",
    corporation: "muller"
  },
  denw401ec: {
    code: "DE NW 401 EC",
    name: "Molkerei Köln (ehem. FrieslandCampina)",
    city: "Köln",
    state: "Nordrhein-Westfalen",
    description: "Molkerei-Standort in Köln, im April 2023 von FrieslandCampina an Müller übergeben. Hier werden u.a. Landliebe-Produkte hergestellt.",
    corporation: "muller"
  },
  debw033eg: {
    code: "DE BW 033 EG",
    name: "Molkerei Heilbronn (ehem. FrieslandCampina)",
    city: "Heilbronn",
    state: "Baden-Württemberg",
    description: "Großer Molkerei-Standort in Heilbronn, im April 2023 an Müller übergeben. Produziert Landliebe-Produkte.",
    corporation: "muller"
  },
  debw033ec: {
    code: "DE BW 033 EC",
    name: "Molkerei Heilbronn (ehem. FrieslandCampina)",
    city: "Heilbronn",
    state: "Baden-Württemberg",
    description: "Großer Molkerei-Standort in Heilbronn, im April 2023 an Müller übergeben. Produziert Landliebe-Produkte.",
    corporation: "muller"
  },
  debw034eg: {
    code: "DE BW 034 EG",
    name: "Molkerei Schefflenz (ehem. FrieslandCampina)",
    city: "Schefflenz",
    state: "Baden-Württemberg",
    description: "Spezialstandort für traditionelle Milchverarbeitung, im April 2023 an die Müller-Gruppe übergegangen.",
    corporation: "muller"
  },
  debw034ec: {
    code: "DE BW 034 EC",
    name: "Molkerei Schefflenz (ehem. FrieslandCampina)",
    city: "Schefflenz",
    state: "Baden-Württemberg",
    description: "Spezialstandort für traditionelle Milchverarbeitung, im April 2023 an die Müller-Gruppe übergegangen.",
    corporation: "muller"
  }
};

// Boycott explanations for the background section
export const boycottReasons: BoycottReason[] = [
  {
    title: "Rechtsextreme Kontroversen",
    description: "Verbindungen zu rechtsextremen Politikern (Müller)",
    details: "Theo Müller hat in Interviews offen bestätigt, sich regelmäßig mit hochrangigen Politikern der AfD (Alternative für Deutschland), u.a. mit Bundessprecherin Alice Weidel, zu treffen. Diese Treffen und die Weigerung, sich von rechtsextremem Gedankengut zu distanzieren, führten zu breiten Protesten und Boykottaufrufen unter dem Motto 'Kein Geld für Faschos'.",
    corporation: "muller"
  },
  {
    title: "Steuerflucht in die Schweiz",
    description: "Umzug aus steuerlichen Gründen (Müller)",
    details: "Theo Müller verlegte 2003 seinen Hauptwohnsitz in die Schweiz (Erlenbach ZH), um der deutschen Erbschaftsteuer zu entgehen. Dies stieß auf starke Kritik, da das Unternehmen gleichzeitig in Deutschland staatliche Subventionen in Millionenhöhe (z.B. für den Ausbau des Werks in Leppersdorf) in Anspruch nahm.",
    corporation: "muller"
  },
  {
    title: "Marktmacht & Druck auf Erzeuger",
    description: "Ausnutzung monopolähnlicher Stellungen (Müller)",
    details: "Die Unternehmensgruppe Theo Müller kontrolliert einen gigantischen Anteil des deutschen Milchmarktes. Kritiker und Bauernverbände werfen dem Konzern vor, seine enorme Marktmacht auszunutzen, um die Milchpreise für die landwirtschaftlichen Erzeuger extrem niedrig zu halten, was viele Familienbetriebe in den Ruin treibt.",
    corporation: "muller"
  },
  {
    title: "Aggressive Expansion & Markensterben",
    description: "Aufkauf unabhängiger Traditionsmarken (Müller)",
    details: "Durch den aggressiven Aufkauf von Traditionsmarken wie Weihenstephan oder zuletzt Landliebe (2023) monopolisiert Müller den Markt. Viele Verbraucher kaufen ahnungslos Produkte im Glauben, eine kleine regionale Molkerei zu unterstützen, während das Geld direkt an den Müller-Konzern fließt.",
    corporation: "muller"
  },
  {
    title: "Ausbeutung & Wasserprivatisierung",
    description: "Abfüllung in wasserarmen Regionen (Nestlé)",
    details: "Nestlé steht weltweit massiv in der Kritik für die Privatisierung von Wasserquellen. In Dürregebieten und Schwellenländern (z. B. in Pakistan oder der Region Vittel in Frankreich) pumpt der Konzern Grundwasser ab, um es als Flaschenwasser (Vittel, Pure Life, San Pellegrino) teuer zu verkaufen. Den Einheimischen fehlt dadurch der Zugang zu sicherem, kostenlosem Trinkwasser.",
    corporation: "nestle"
  },
  {
    title: "Babymilch-Skandal",
    description: "Aggressives Marketing in Entwicklungsländern (Nestlé)",
    details: "Nestlé vermarktete Milchpulver in Entwicklungsländern mit verheerenden Folgen. Mütter wurden mit Gratisproben zum Abstillen gedrängt. Durch verunreinigtes Wasser und fehlende Dosierungsmöglichkeiten starben hunderttausende Säuglinge. Der Boykott begann in den 1970er Jahren und ist bis heute ein Symbol für verantwortungsloses Marketing.",
    corporation: "nestle"
  },
  {
    title: "Systematische Kinderarbeit beim Kakao",
    description: "Ausbeutung auf Kakao-Plantagen (Nestlé)",
    details: "Ein Großteil des von Nestlé verarbeiteten Kakaos stammt aus Westafrika (Elfenbeinküste, Ghana). Unabhängige Recherchen dokumentieren dort seit Jahrzehnten Kinderarbeit, Schuldsklaverei und Menschenhandel auf den Plantagen. Nestlé gelang es trotz wiederholter Versprechen nicht, die Lieferketten vollständig von Kinderarbeit zu befreien.",
    corporation: "nestle"
  },
  {
    title: "Regenwaldzerstörung & Plastikmüll",
    description: "Umweltbelastung auf globaler Ebene (Nestlé)",
    details: "Nestlé gehört zu den weltweit größten Verursachern von Einweg-Plastikmüll, der Flüsse und Weltmeere verschmutzt. Zudem verarbeitet der Konzern in großem Umfang billiges Palmöl, dessen Gewinnung für die rohe Rodung gigantischer Regenwaldflächen und die Zerstörung des Lebensraums bedrohter Tierarten verantwortlich ist.",
    corporation: "nestle"
  },
  {
    title: "Esoterik & Pseudowissenschaft",
    description: "Grundlagen der Demeter-Landwirtschaft & Medizin (Anthroposophie)",
    details: "Die biologisch-dynamische Landwirtschaft (Demeter) und anthroposophische Medizin (Weleda, WALA) basieren auf den Lehren von Rudolf Steiner. Kritiker bemängeln unwissenschaftliche Praktiken: Demeter-Bauern müssen Präparate wie in Kuhhörnern vergrabenen Mist nach kosmischen Konstellationen anwenden. In der anthroposophischen Medizin fehlen oft wissenschaftliche Wirksamkeitsnachweise.",
    corporation: "anthroposophy"
  },
  {
    title: "Weltbild & Steiner-Ideologie",
    description: "Kontroverse Thesen Rudolf Steiners (Anthroposophie)",
    details: "Rudolf Steiner, der Begründer der Anthroposophie, formulierte in seinen Schriften rassistische, antisemitische und deterministische Thesen über die Höherentwicklung von Seelen. Bis heute gibt es an Waldorfschulen und anthroposophischen Organisationen Kritik wegen unzureichender Abgrenzung von diesen problematischen Aspekten des Steiner-Weltbildes.",
    corporation: "anthroposophy"
  },
  {
    title: "Verschleierung im Bio-Markt",
    description: "Intransparente Mittelverwendung (Anthroposophie)",
    details: "Unternehmen wie Alnatura oder Weleda erwirtschaften dreistellige Millionenumsätze. Ein erheblicher Teil der Gewinne fließt über Stiftungen und Schenkungen direkt in die Förderung anthroposophischer Einrichtungen. Konsumenten, die lediglich umweltbewusst einkaufen wollen, unterstützen damit ahnungslos und ohne transparente Aufklärung eine esoterische Weltanschauung.",
    corporation: "anthroposophy"
  },
  {
    title: "Anthroposophische Unternehmensführung",
    description: "Verbreitung esoterischer Konzepte in Großkonzernen (dm)",
    details: "dm-Gründer Götz Werner nutzte Steiners Anthroposophie explizit zur Gestaltung des Konzerns. Kritiker bemängeln, dass hierbei ein esoterisches Weltbild als moderner Führungsstil getarnt wird, während die enge Kooperation mit Alnatura und Weleda die wirtschaftliche Vormachtstellung der Anthroposophie im deutschen Handel zementiert.",
    corporation: "anthroposophy"
  }
];

// Independent Alternatives
export const independentAlternatives: Alternative[] = [
  // --- MILCH & JOGHURT ALTERNATIVEN (Gegen Müller) ---
  {
    name: "Berchtesgadener Land",
    type: "organic",
    description: "Genossenschaftliche Molkerei aus Bayern. Bekannt für fairen Milchpreis für Bauern, hohe Tierwohlstandards und absolute Unabhängigkeit von Großkonzernen.",
    recommendedFor: ["milch", "joghurt", "sahne", "butter"]
  },
  {
    name: "Schwarzwaldmilch",
    type: "regional",
    description: "Traditionelle, genossenschaftlich organisierte Molkerei im Südwesten Deutschlands. Bietet hervorragende Qualität und gehört den Bauern der Region.",
    recommendedFor: ["milch", "joghurt", "butter", "dessert"]
  },
  {
    name: "Andechser Natur",
    type: "organic",
    description: "Führende Bio-Molkerei in Familienbesitz. Verarbeitet ausschließlich 100% Bio-Milch und setzt sich aktiv für Umweltschutz und faire Erzeugerpreise ein.",
    recommendedFor: ["joghurt", "quark", "milch", "butter", "kaese"]
  },
  {
    name: "Oatly",
    type: "plant-based",
    description: "Der schwedische Pionier für Haferdrinks. Bietet exzellente, klimafreundliche Alternativen zu Milch, Kakao, Kochsahne und Joghurt (Oatgurt).",
    recommendedFor: ["milch", "sahne", "dessert"]
  },
  {
    name: "Alpro / Provamel",
    type: "plant-based",
    description: "Marktführer für pflanzliche Joghurt- und Milchalternativen auf Basis von Soja, Mandel, Hafer und Kokos. Ideal als Ersatz für süße Joghurtbecher.",
    recommendedFor: ["joghurt", "milch", "dessert"]
  },
  
  // --- TOFU & VEGANE ALTERNATIVEN (Gegen Müller & Nestlé) ---
  {
    name: "Taifun Tofu",
    type: "organic",
    description: "Der unabhängige deutsche Bio-Tofu-Pionier aus Freiburg. In einer Stiftung organisiert, um Übernahmen durch Großkonzerne auszuschließen. 100% europäischer Bio-Soja.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },
  {
    name: "Viana / Tofutown",
    type: "organic",
    description: "Unabhängiger deutscher Bio-Pionier aus der Vulkaneifel. Stellt seit 1988 innovative Veggie-Snacks, Steaks und Bio-Tofu aus rein europäischen Rohstoffen her.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },
  {
    name: "Treiber Tofu",
    type: "regional",
    description: "Traditionelle, inhabergeführte Bio-Tofurei aus Berlin. Stellt handwerklichen Tofu von Weltklasse-Qualität nach original japanischem Verfahren her.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },
  {
    name: "Alberts (Lupinen- & Bio-Tofu)",
    type: "organic",
    description: "Unabhängiger Bio-Hersteller (Landhof Alberts) spezialisiert auf Soja-Tofu und zukunftsweisende Lupinen-Produkte aus rein deutschem Bio-Anbau.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },
  {
    name: "Lord of Tofu",
    type: "organic",
    description: "Inhabergeführtes Familienunternehmen aus Lörrach. Bekannt für innovative Bio-Tofu-Spezialitäten mit regionalem Soja und handwerklicher Herstellung.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },
  {
    name: "Kato Tofu",
    type: "organic",
    description: "Inhabergeführte Bio-Tofurei aus Kassel. Stellt seit Jahrzehnten in handwerklicher Tradition hochwertigen Tofu aus deutschem und europäischem Bio-Soja her.",
    recommendedFor: ["tofu", "vegan", "pflanzlich"]
  },

  // --- PIZZA-ALTERNATIVEN (Gegen Nestlé/Wagner) ---
  {
    name: "Gustavo Gusto",
    type: "independent",
    description: "Inhabergeführtes Premium-Tiefkühlpizza-Unternehmen aus Bayern. Bekannt für traditionell im Steinofen gebackene Pizzaböden, hochwertige Bio-Zutaten und absolute Unabhängigkeit.",
    recommendedFor: ["pizza", "wagner"]
  },
  {
    name: "Bio-TK-Pizzen (Soto, Followfood)",
    type: "organic",
    description: "Hervorragende ökologische Tiefkühl-Pizzen und Flammkuchen aus inhabergeführter Bio-Produktion mit Fokus auf nachhaltige Fischerei und faire Landwirtschaft.",
    recommendedFor: ["pizza", "wagner"]
  },

  // --- WASSER-ALTERNATIVEN (Gegen Nestlé/Vittel/Pellegrino) ---
  {
    name: "Viva con Agua",
    type: "independent",
    description: "Gemeinnütziges Brunnenprojekt aus Hamburg. Fließt zu 100% in weltweite Trinkwasserprojekte. Bietet regionales Mineralwasser in umweltfreundlichen Mehrwegflaschen.",
    recommendedFor: ["wasser", "drink"]
  },
  {
    name: "Bio-Mineralwasser (z.B. Preussenquelle)",
    type: "organic",
    description: "Unabhängige Mineralbrunnen (wie Rheinsberger Preussenquelle oder Neumarkter Lammsbräu Bio-Kristall). Streng kontrolliert, klimaneutral und in regionalem Familienbesitz.",
    recommendedFor: ["wasser", "drink"]
  },
  {
    name: "Leitungswasser & Wassersprudler",
    type: "independent",
    description: "Die nachhaltigste, günstigste und 100% Nestlé-freie Alternative. Lokales Leitungswasser ist in Deutschland von exzellenter Qualität und schont Transportwege.",
    recommendedFor: ["wasser", "drink"]
  },

  // --- SÜSSWAREN / SCHOKOLADE ALTERNATIVEN (Gegen Nestlé/KitKat/Smarties) ---
  {
    name: "Tony's Chocolonely",
    type: "independent",
    description: "Niederländischer Schokoladenhersteller, der sich zum Ziel gesetzt hat, die Kakaoindustrie zu 100% sklavenfrei und kinderarbeitsfrei zu machen. Kauft Kakao direkt bei Kooperativen.",
    recommendedFor: ["schokolade", "sweet", "kitkat", "smarties"]
  },
  {
    name: "GEPA / Gepa / Rapunzel",
    type: "organic",
    description: "Die Pioniere des Fairen Handels in Deutschland. Hervorragende Bio-Schokolade und Riegel, die den Kakaobauern existenzsichernde Preise garantieren.",
    recommendedFor: ["schokolade", "sweet", "kitkat", "smarties"]
  },
  {
    name: "Ritter Sport",
    type: "independent",
    description: "Inhabergeführtes, deutsches Familienunternehmen. Setzt auf 100% zertifiziert nachhaltigen Kakaobezug und betreibt eine eigene, nachhaltige Kakaoplantage.",
    recommendedFor: ["schokolade", "sweet", "kitkat", "smarties"]
  },

  // --- GEWÜRZE / SAUCEN ALTERNATIVEN (Gegen Nestlé/Maggi/Thomy) ---
  {
    name: "Byodo",
    type: "organic",
    description: "Inhabergeführtes Naturkostunternehmen aus Bayern. Premium-Feinkost, Senf, Mayonnaise und Salat-Dressing in feinster Bio-Qualität.",
    recommendedFor: ["saucen", "gewuerz", "thomy", "maggi"]
  },
  {
    name: "Sonnentor / Lebensbaum Gewürze",
    type: "organic",
    description: "Die führenden Bio-Gewürzhersteller. Bieten reine, hocharomatische Kräutermischungen, Suppenbrühen und Würzen ohne jegliche künstliche Zusatzstoffe.",
    recommendedFor: ["saucen", "gewuerz", "maggi"]
  },

  // --- KOSMETIK & DROGERIE ALTERNATIVEN (Gegen Weleda, alverde, Dr. Hauschka, dm) ---
  {
    name: "lavera Naturkosmetik",
    type: "organic",
    description: "Pionier der Bio-Kosmetik aus Niedersachsen (Laverana GmbH & Co. KG). Komplett unabhängig von anthroposophischen Einflüssen, Weleda oder dm. Tierversuchsfrei und vegan.",
    recommendedFor: ["kosmetik"]
  },
  {
    name: "i+m Naturkosmetik Berlin",
    type: "organic",
    description: "Unabhängige Berliner Marke für 100% vegane, bio-zertifizierte Naturkosmetik. Als soziales Unternehmen organisiert, spendet i+m einen Teil der Gewinne an soziale Projekte.",
    recommendedFor: ["kosmetik"]
  },
  {
    name: "Speick Naturkosmetik",
    type: "independent",
    description: "Traditioneller, unabhängiger deutscher Familienbetrieb (Walter Rau GmbH) seit 1928. Naturkosmetik mit dem Extrakt der geschützten Speick-Pflanze.",
    recommendedFor: ["kosmetik"]
  },
  {
    name: "Rossmann Alterra / Isana",
    type: "independent",
    description: "Die Naturkosmetik- und Pflegelinien von Rossmann. Eine hervorragende, preissensible Alternative zu dm-Eigenmarken, frei von anthroposophischer Verflechtung des dm-Konzerns.",
    recommendedFor: ["kosmetik"]
  },

  // --- SUPERMARKT-BIO-EIGENMARKEN ---
  {
    name: "Vemondo / K-Take it veggie / REWE Bio",
    type: "independent",
    description: "Ökologische Eigenmarken von Supermärkten (z.B. Lidl, Kaufland, REWE). Bieten preiswerte, qualitativ hochwertige Alternativen zu klassischen Milch-, Feinkost- und Tofuprodukten.",
    recommendedFor: ["joghurt", "milch", "dessert", "saucen", "tofu", "pizza", "schokolade"]
  }
];

// Normalize strings helper to perform robust matching
export const normalizeString = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD") // Decompose character accents (e.g., ü -> u + ¨)
    .replace(/[\u0300-\u036f]/g, "") // Remove the accent marks
    .replace(/[^a-z0-9]/g, ""); // Keep only letters and numbers
};

// Check if a brand name matches UTM database
export const checkUTMBrand = (brandName: string): UTMBrand | null => {
  if (!brandName) return null;
  
  // Split by comma in case of multiple brands (e.g. "Nestlé,Original Wagner")
  const brandParts = brandName.split(',').map(b => b.trim());
  
  for (const part of brandParts) {
    const normalizedInput = normalizeString(part);
    if (!normalizedInput) continue;
    
    // Direct check
    if (utmBrands[normalizedInput]) {
      return utmBrands[normalizedInput];
    }
    
    // Partial check (e.g. "Molkerei Alois Müller" contains "muller")
    for (const key of Object.keys(utmBrands)) {
      if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
        return utmBrands[key];
      }
    }
  }
  
  return null;
};

// Check if an emb code matches UTM database
export const checkUTMPlant = (embCode: string): UTMPlant | null => {
  const normalizedInput = normalizeString(embCode);
  
  // Search for the plant code in the input
  for (const plant of Object.values(utmPlants)) {
    const normalizedKey = normalizeString(plant.code);
    if (normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput)) {
      return plant;
    }
  }
  
  return null;
};

// Curated list of popular products for offline scanning support
export const offlineProducts: Record<string, OfflineProduct> = {
  // --- Müller ---
  "4002631000124": {
    barcode: "4002631000124",
    name: "Müllermilch Erdbeere",
    brand: "Müller (Müllermilch)",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/263/100/0124/front_de.227.400.jpg",
    matchedBrandId: "mullermilch"
  },
  "4002631300224": {
    barcode: "4002631300224",
    name: "Joghurt mit der Ecke - Schoko-Balls",
    brand: "Müller (Müllermilch)",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/263/130/0224/front_de.141.400.jpg",
    matchedBrandId: "muller"
  },
  "4002631007208": {
    barcode: "4002631007208",
    name: "H-Milch 1,5% Fett",
    brand: "Weihenstephan",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/263/100/7208/front_de.100.400.jpg",
    matchedBrandId: "weihenstephan"
  },
  "4025130007255": {
    barcode: "4025130007255",
    name: "Landliebe Landmilch 3,8%",
    brand: "Landliebe",
    imageUrl: "https://images.openfoodfacts.org/images/products/402/513/000/7255/front_de.88.400.jpg",
    matchedBrandId: "landliebe"
  },
  "4002631003712": {
    barcode: "4002631003712",
    name: "Sachsenmilch Reine Buttermilch",
    brand: "Sachsenmilch",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/263/100/3712/front_de.58.400.jpg",
    matchedBrandId: "sachsenmilch"
  },

  // --- Nestlé ---
  "7613034926830": {
    barcode: "7613034926830",
    name: "KitKat Classic 4 Finger Riegel",
    brand: "KitKat",
    imageUrl: "https://images.openfoodfacts.org/images/products/761/303/492/6830/front_de.152.400.jpg",
    matchedBrandId: "kitkat"
  },
  "5000189974535": {
    barcode: "5000189974535",
    name: "Smarties Riesenrolle",
    brand: "Smarties",
    imageUrl: "https://images.openfoodfacts.org/images/products/500/018/997/4535/front_de.110.400.jpg",
    matchedBrandId: "smarties"
  },
  "4000400085141": {
    barcode: "4000400085141",
    name: "Original Wagner Steinofen Pizza Salami",
    brand: "Original Wagner (Wagner Pizza)",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/040/008/5141/front_de.104.400.jpg",
    matchedBrandId: "wagner"
  },
  "7613035799730": {
    barcode: "7613035799730",
    name: "Nescafé Gold Original",
    brand: "Nescafé",
    imageUrl: "https://images.openfoodfacts.org/images/products/761/303/579/9730/front_de.164.400.jpg",
    matchedBrandId: "nescafe"
  },
  "4005200000015": {
    barcode: "4005200000015",
    name: "Thomy Les Sauces Hollandaise",
    brand: "Thomy",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/520/000/0015/front_de.131.400.jpg",
    matchedBrandId: "thomy"
  },
  "7613036195748": {
    barcode: "7613036195748",
    name: "Maggi Guten Appetit Hochzeitssuppe",
    brand: "Maggi",
    imageUrl: "https://images.openfoodfacts.org/images/products/761/303/619/5748/front_de.109.400.jpg",
    matchedBrandId: "maggi"
  },

  // --- Anthroposophie / Demeter ---
  "4104420172608": {
    barcode: "4104420172608",
    name: "Alnatura Hafer Drink ungesüßt",
    brand: "Alnatura",
    imageUrl: "https://images.openfoodfacts.org/images/products/410/442/017/2608/front_de.180.400.jpg",
    matchedBrandId: "alnatura"
  },
  "4001638090094": {
    barcode: "4001638090094",
    name: "Weleda Skin Food Intensivpflege",
    brand: "Weleda",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/163/809/0094/front_de.112.400.jpg",
    matchedBrandId: "weleda"
  },
  "4020628000572": {
    barcode: "4020628000572",
    name: "Dr. Hauschka Rosen Tagescreme",
    brand: "Dr. Hauschka",
    imageUrl: "https://images.openfoodfacts.org/images/products/402/062/800/0572/front_de.15.400.jpg",
    matchedBrandId: "drhauschka"
  },
  "4006303004052": {
    barcode: "4006303004052",
    name: "Voelkel Bio Rhabarber-Trunk",
    brand: "Voelkel",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/630/300/4052/front_de.57.400.jpg",
    matchedBrandId: "voelkel"
  },
  "4000345151529": {
    barcode: "4000345151529",
    name: "Bauckhof Haferflocken zart Demeter",
    brand: "Bauckhof",
    imageUrl: "https://images.openfoodfacts.org/images/products/400/034/515/1529/front_de.68.400.jpg",
    matchedBrandId: "bauckhof"
  },
  "4010355139697": {
    barcode: "4010355139697",
    name: "alverde Pflegedusche Bio-Minze",
    brand: "alverde Naturkosmetik",
    imageUrl: "https://images.openfoodfacts.org/images/products/401/035/513/9697/front_de.12.400.jpg",
    matchedBrandId: "alverde"
  },
  "4058172314643": {
    barcode: "4058172314643",
    name: "dmBio Dinkel wie Reis",
    brand: "dm-drogerie markt",
    imageUrl: "https://images.openfoodfacts.org/images/products/405/817/231/4643/front_de.45.400.jpg",
    matchedBrandId: "dm"
  }
};

// Check if a barcode is part of the curated offline product database
export const checkOfflineProduct = (barcode: string): OfflineProduct | null => {
  if (!barcode) return null;
  const cleanBarcode = barcode.trim();
  return offlineProducts[cleanBarcode] || null;
};

// --- EAN PREFIX MATCHING ENGINE & DATABASES (BONUS IDEA) ---

export interface EANPrefixMatch {
  prefix: string;
  country: string;
  flag: string;
  matchingCorp?: 'muller' | 'nestle' | 'anthroposophy';
  matchingBrandName?: string;
  confidence: 'exact' | 'high' | 'possible';
}

// Registry mapping for EAN prefixes (3 digits)
export const gs1Registries: Record<string, { country: string; flag: string }> = {
  "400": { country: "Deutschland", flag: "🇩🇪" },
  "401": { country: "Deutschland", flag: "🇩🇪" },
  "402": { country: "Deutschland", flag: "🇩🇪" },
  "403": { country: "Deutschland", flag: "🇩🇪" },
  "404": { country: "Deutschland", flag: "🇩🇪" },
  "405": { country: "Deutschland", flag: "🇩🇪" },
  "406": { country: "Deutschland", flag: "🇩🇪" },
  "407": { country: "Deutschland", flag: "🇩🇪" },
  "408": { country: "Deutschland", flag: "🇩🇪" },
  "409": { country: "Deutschland", flag: "🇩🇪" },
  "410": { country: "Deutschland", flag: "🇩🇪" },
  "411": { country: "Deutschland", flag: "🇩🇪" },
  "412": { country: "Deutschland", flag: "🇩🇪" },
  "413": { country: "Deutschland", flag: "🇩🇪" },
  "414": { country: "Deutschland", flag: "🇩🇪" },
  "415": { country: "Deutschland", flag: "🇩🇪" },
  "416": { country: "Deutschland", flag: "🇩🇪" },
  "417": { country: "Deutschland", flag: "🇩🇪" },
  "418": { country: "Deutschland", flag: "🇩🇪" },
  "419": { country: "Deutschland", flag: "🇩🇪" },
  "420": { country: "Deutschland", flag: "🇩🇪" },
  "421": { country: "Deutschland", flag: "🇩🇪" },
  "422": { country: "Deutschland", flag: "🇩🇪" },
  "423": { country: "Deutschland", flag: "🇩🇪" },
  "424": { country: "Deutschland", flag: "🇩🇪" },
  "425": { country: "Deutschland", flag: "🇩🇪" },
  "426": { country: "Deutschland", flag: "🇩🇪" },
  "427": { country: "Deutschland", flag: "🇩🇪" },
  "428": { country: "Deutschland", flag: "🇩🇪" },
  "429": { country: "Deutschland", flag: "🇩🇪" },
  "430": { country: "Deutschland", flag: "🇩🇪" },
  "431": { country: "Deutschland", flag: "🇩🇪" },
  "432": { country: "Deutschland", flag: "🇩🇪" },
  "433": { country: "Deutschland", flag: "🇩🇪" },
  "434": { country: "Deutschland", flag: "🇩🇪" },
  "435": { country: "Deutschland", flag: "🇩🇪" },
  "436": { country: "Deutschland", flag: "🇩🇪" },
  "437": { country: "Deutschland", flag: "🇩🇪" },
  "438": { country: "Deutschland", flag: "🇩🇪" },
  "439": { country: "Deutschland", flag: "🇩🇪" },
  "440": { country: "Deutschland", flag: "🇩🇪" },
  "760": { country: "Schweiz", flag: "🇨🇭" },
  "761": { country: "Schweiz", flag: "🇨🇭" },
  "762": { country: "Schweiz", flag: "🇨🇭" },
  "763": { country: "Schweiz", flag: "🇨🇭" },
  "764": { country: "Schweiz", flag: "🇨🇭" },
  "765": { country: "Schweiz", flag: "🇨🇭" },
  "766": { country: "Schweiz", flag: "🇨🇭" },
  "767": { country: "Schweiz", flag: "🇨🇭" },
  "768": { country: "Schweiz", flag: "🇨🇭" },
  "769": { country: "Schweiz", flag: "🇨🇭" },
  "900": { country: "Österreich", flag: "🇦🇹" },
  "901": { country: "Österreich", flag: "🇦🇹" },
  "902": { country: "Österreich", flag: "🇦🇹" },
  "903": { country: "Österreich", flag: "🇦🇹" },
  "904": { country: "Österreich", flag: "🇦🇹" },
  "905": { country: "Österreich", flag: "🇦🇹" },
  "906": { country: "Österreich", flag: "🇦🇹" },
  "907": { country: "Österreich", flag: "🇦🇹" },
  "908": { country: "Österreich", flag: "🇦🇹" },
  "909": { country: "Österreich", flag: "🇦🇹" },
  "910": { country: "Österreich", flag: "🇦🇹" },
  "911": { country: "Österreich", flag: "🇦🇹" },
  "912": { country: "Österreich", flag: "🇦🇹" },
  "913": { country: "Österreich", flag: "🇦🇹" },
  "914": { country: "Österreich", flag: "🇦🇹" },
  "915": { country: "Österreich", flag: "🇦🇹" },
  "916": { country: "Österreich", flag: "🇦🇹" },
  "917": { country: "Österreich", flag: "🇦🇹" },
  "918": { country: "Österreich", flag: "🇦🇹" },
  "919": { country: "Österreich", flag: "🇦🇹" },
  "300": { country: "Frankreich", flag: "🇫🇷" },
  "301": { country: "Frankreich", flag: "🇫🇷" },
  "302": { country: "Frankreich", flag: "🇫🇷" },
  "303": { country: "Frankreich", flag: "🇫🇷" },
  "304": { country: "Frankreich", flag: "🇫🇷" },
  "305": { country: "Frankreich", flag: "🇫🇷" },
  "306": { country: "Frankreich", flag: "🇫🇷" },
  "307": { country: "Frankreich", flag: "🇫🇷" },
  "308": { country: "Frankreich", flag: "🇫🇷" },
  "309": { country: "Frankreich", flag: "🇫🇷" },
};

// Check EAN-13 barcode prefixes dynamically
export const checkEANPrefix = (barcode: string): EANPrefixMatch | null => {
  if (!barcode) return null;
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");
  if (cleanBarcode.length < 3) return null;

  const prefix3 = cleanBarcode.substring(0, 3);
  let registry = gs1Registries[prefix3];

  // Fallback programmatic mappings for other prefixes
  if (!registry) {
    const val = parseInt(prefix3, 10);
    if (val >= 0 && val <= 139) registry = { country: "USA / Kanada", flag: "🇺🇸" };
    else if (val >= 300 && val <= 379) registry = { country: "Frankreich", flag: "🇫🇷" };
    else if (val >= 400 && val <= 440) registry = { country: "Deutschland", flag: "🇩🇪" };
    else if (val >= 450 && val <= 499) registry = { country: "Japan", flag: "🇯🇵" };
    else if (val >= 500 && val <= 509) registry = { country: "Großbritannien", flag: "🇬🇧" };
    else if (val >= 540 && val <= 549) registry = { country: "Belgien / Luxemburg", flag: "🇧🇪" };
    else if (val === 560) registry = { country: "Portugal", flag: "🇵🇹" };
    else if (val === 570) registry = { country: "Dänemark", flag: "🇩🇰" };
    else if (val === 590) registry = { country: "Polen", flag: "🇵🇱" };
    else if (val === 594) registry = { country: "Rumänien", flag: "🇷🇴" };
    else if (val === 599) registry = { country: "Ungarn", flag: "🇭🇺" };
    else if (val >= 600 && val <= 601) registry = { country: "Südafrika", flag: "🇿🇦" };
    else if (val === 640) registry = { country: "Finnland", flag: "🇫🇮" };
    else if (val >= 690 && val <= 699) registry = { country: "China", flag: "🇨🇳" };
    else if (val >= 700 && val <= 709) registry = { country: "Norwegen", flag: "🇳🇴" };
    else if (val === 730) registry = { country: "Schweden", flag: "🇸🇪" };
    else if (val >= 760 && val <= 769) registry = { country: "Schweiz", flag: "🇨🇭" };
    else if (val >= 800 && val <= 839) registry = { country: "Italien", flag: "🇮🇹" };
    else if (val >= 840 && val <= 849) registry = { country: "Spanien", flag: "🇪🇸" };
    else if (val === 859) registry = { country: "Tschechien", flag: "🇨🇿" };
    else if (val === 869) registry = { country: "Türkei", flag: "🇹🇷" };
    else if (val >= 870 && val <= 879) registry = { country: "Niederlande", flag: "🇳🇱" };
    else if (val >= 900 && val <= 919) registry = { country: "Österreich", flag: "🇦🇹" };
    else if (val >= 930 && val <= 939) registry = { country: "Australien", flag: "🇦🇺" };
    else if (val === 955) registry = { country: "Malaysia", flag: "🇲🇾" };
  }

  // Manufacturer range matches - check longest patterns first
  const matchRanges: { pattern: string; corp: 'muller' | 'nestle' | 'anthroposophy'; brandName: string; confidence: 'exact' | 'high' | 'possible' }[] = [
    // --- Müller-Gruppe ---
    { pattern: "4002631", corp: "muller", brandName: "Müller / Weihenstephan", confidence: "exact" },
    { pattern: "4025130", corp: "muller", brandName: "Landliebe", confidence: "exact" },
    
    // --- Nestlé ---
    { pattern: "761303", corp: "nestle", brandName: "Nestlé (Maggi / KitKat / Garden Gourmet)", confidence: "high" },
    { pattern: "5000189", corp: "nestle", brandName: "Smarties (Nestlé)", confidence: "exact" },
    { pattern: "400040", corp: "nestle", brandName: "Original Wagner Pizza (Nestlé)", confidence: "high" },
    { pattern: "4005200", corp: "nestle", brandName: "Thomy (Nestlé)", confidence: "exact" },

    // --- Anthroposophie / Demeter ---
    { pattern: "410442", corp: "anthroposophy", brandName: "Alnatura", confidence: "high" },
    { pattern: "4001638", corp: "anthroposophy", brandName: "Weleda", confidence: "exact" },
    { pattern: "4010355", corp: "anthroposophy", brandName: "alverde (dm)", confidence: "exact" },
    { pattern: "4058172", corp: "anthroposophy", brandName: "dmBio", confidence: "exact" },
    { pattern: "4006303", corp: "anthroposophy", brandName: "Voelkel", confidence: "exact" },
    { pattern: "4020628", corp: "anthroposophy", brandName: "Dr. Hauschka / WALA", confidence: "exact" },
    { pattern: "4000345", corp: "anthroposophy", brandName: "Bauckhof", confidence: "exact" },
  ];

  for (const range of matchRanges) {
    if (cleanBarcode.startsWith(range.pattern)) {
      return {
        prefix: range.pattern,
        country: registry ? registry.country : "Unbekannt",
        flag: registry ? registry.flag : "❓",
        matchingCorp: range.corp,
        matchingBrandName: range.brandName,
        confidence: range.confidence
      };
    }
  }

  return {
    prefix: prefix3,
    country: registry ? registry.country : "Unbekannt",
    flag: registry ? registry.flag : "❓",
    confidence: "possible"
  };
};

