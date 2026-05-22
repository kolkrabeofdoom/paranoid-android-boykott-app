import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Building2, 
  X, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck,
  HelpCircle,
  MapPin,
  Award,
  Trophy,
  Sprout,
  Calendar,
  Info
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  utmBrands, 
  utmPlants, 
  boycottReasons, 
  independentAlternatives, 
  checkUTMBrand, 
  checkUTMPlant,
  checkOfflineProduct,
  checkEANPrefix
} from './data/utmDatabase';
import type { UTMPlant, Alternative } from './data/utmDatabase';
import { seasonalItems } from './data/seasonalDatabase';
import './App.css';

interface ScanHistoryItem {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  status: 'hit' | 'hit-nestle' | 'hit-anthroposophy' | 'free' | 'notfound';
  matchReason?: string;
  timestamp: string;
  brandsTags?: string[];
  embCodes?: string;
  embCodesTags?: string[] | string;
  loadedOffline?: boolean;
  loadedFromCache?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'explore' | 'political' | 'dashboard' | 'saison'>('scan');
  const [eanInput, setEanInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualVetInput, setManualVetInput] = useState('');
  const [vetResult, setVetResult] = useState<{ match: UTMPlant | null; checked: boolean }>({ match: null, checked: false });
  const [activeResult, setActiveResult] = useState<ScanHistoryItem | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  
  // Saison-Buster states
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth());
  const [saisonCategoryFilter, setSaisonCategoryFilter] = useState<'all' | 'vegetable' | 'fruit' | 'herb'>('all');
  const [saisonTypeFilter, setSaisonTypeFilter] = useState<'all' | 'freiland' | 'lager' | 'geschuetzt'>('all');
  const [saisonSearchQuery, setSaisonSearchQuery] = useState('');
  
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineCache, setOfflineCache] = useState<Record<string, ScanHistoryItem>>(() => {
    const saved = localStorage.getItem('mfb_offline_cache');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse offline cache", e);
      }
    }
    return {};
  });

  const [activeFilters, setActiveFilters] = useState<{ muller: boolean; nestle: boolean; anthroposophy: boolean }>(() => {
    const saved = localStorage.getItem('mfb_filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          muller: parsed.muller !== false,
          nestle: parsed.nestle !== false,
          anthroposophy: parsed.anthroposophy !== false
        };
      } catch (e) {}
    }
    return { muller: true, nestle: true, anthroposophy: true };
  });

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync offline cache to localStorage
  const saveToOfflineCache = (item: ScanHistoryItem) => {
    setOfflineCache(prev => {
      const next = { ...prev, [item.barcode]: item };
      // Limit cache size to 100 entries to avoid overflowing localStorage
      const keys = Object.keys(next);
      if (keys.length > 100) {
        delete next[keys[0]];
      }
      localStorage.setItem('mfb_offline_cache', JSON.stringify(next));
      return next;
    });
  };

  const handleFilterToggle = (key: 'muller' | 'nestle' | 'anthroposophy') => {
    setActiveFilters(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('mfb_filters', JSON.stringify(next));
      return next;
    });
  };

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "camera-reader";

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mfb_history');
    if (saved) {
      try {
        setScanHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse scan history", e);
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: ScanHistoryItem[]) => {
    setScanHistory(newHistory);
    localStorage.setItem('mfb_history', JSON.stringify(newHistory));
  };

  // Toggle Camera Scanning
  useEffect(() => {
    if (isScanning && activeTab === 'scan') {
      setCameraError(null);
      
      // Delay initialization slightly to ensure DOM element is ready
      const timer = setTimeout(() => {
        try {
          const html5Qrcode = new Html5Qrcode(scannerContainerId);
          scannerRef.current = html5Qrcode;

          html5Qrcode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: (width, height) => {
                const min = Math.min(width, height);
                // Return square box suitable for EAN-13 barcodes
                return { width: Math.floor(min * 0.8), height: Math.floor(min * 0.5) };
              }
            },
            (decodedText) => {
              // Vibrate device if supported
              if (navigator.vibrate) navigator.vibrate(100);
              
              // Process barcode
              handleProductLookup(decodedText);
            },
            () => {
              // Ignore silent errors during scanning
            }
          ).then(() => {
            // Camera started successfully
          }).catch(err => {
            console.error("Camera start failed", err);
            setCameraError("Kamera konnte nicht gestartet werden. Bitte erlauben Sie Kamerazugriff in Ihren Browsereinstellungen.");
            setIsScanning(false);
          });
        } catch (e) {
          console.error("Scanner setup failed", e);
          setCameraError("Scanner-Initialisierung fehlgeschlagen.");
          setIsScanning(false);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        stopScanning();
      };
    } else {
      stopScanning();
    }
  }, [isScanning, activeTab]);

  const stopScanning = () => {
    if (scannerRef.current) {
      if (scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          console.log("Scanner stopped successfully");
        }).catch(err => {
          console.error("Error stopping scanner", err);
        });
      }
      scannerRef.current = null;
    }
  };

  const startScanningAction = () => {
    setIsScanning(true);
  };

  const stopScanningAction = () => {
    setIsScanning(false);
  };

  // Main evaluation engine
  const handleProductLookup = async (barcode: string) => {
    if (!barcode || barcode.trim() === '') return;
    const cleanBarcode = barcode.trim();
    
    // Stop scanning immediately upon hit
    setIsScanning(false);
    setLoading(true);
    setCameraError(null);

    const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    // --- STEP 1: CHECK CURATED OFFLINE PRODUCT DATABASE ---
    const offlineMatch = checkOfflineProduct(cleanBarcode);
    if (offlineMatch) {
      const matchedBrand = utmBrands[offlineMatch.matchedBrandId];
      let isHit = false;
      let corporationHit: 'muller' | 'nestle' | 'anthroposophy' | null = null;
      let reason = "";

      if (matchedBrand) {
        if (matchedBrand.corporation === 'muller' && activeFilters.muller) {
          isHit = true;
          corporationHit = 'muller';
          reason = `Die Marke '${matchedBrand.name}' gehört zum Müller-Konzern (Offline-Treffer).`;
        } else if (matchedBrand.corporation === 'nestle' && activeFilters.nestle) {
          isHit = true;
          corporationHit = 'nestle';
          reason = `Die Marke '${matchedBrand.name}' gehört zum Nestlé-Konzern (Offline-Treffer).`;
        } else if (matchedBrand.corporation === 'anthroposophy' && activeFilters.anthroposophy) {
          isHit = true;
          corporationHit = 'anthroposophy';
          reason = `Die Marke '${matchedBrand.name}' steht in Verbindung zur Anthroposophie (Offline-Treffer).`;
        }
      }

      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        barcode: cleanBarcode,
        name: offlineMatch.name,
        brand: offlineMatch.brand,
        imageUrl: offlineMatch.imageUrl,
        status: isHit ? (corporationHit === 'nestle' ? 'hit-nestle' : corporationHit === 'anthroposophy' ? 'hit-anthroposophy' : 'hit') : 'free',
        matchReason: reason || `Produkt offline geprüft: Keine aktiven Boykott-Warnungen für diese Marke.`,
        timestamp,
        loadedOffline: true
      };

      const updatedHistory = [historyItem, ...scanHistory.filter(h => h.barcode !== cleanBarcode)].slice(0, 25);
      saveHistory(updatedHistory);
      setActiveResult(historyItem);
      setEanInput('');
      setLoading(false);
      return;
    }

    // --- STEP 2: CHECK OFFLINE CACHE (PREVIOUS SCANS) ---
    if (offlineCache[cleanBarcode]) {
      const cachedItem = { ...offlineCache[cleanBarcode], id: Date.now().toString(), timestamp, loadedFromCache: true };
      
      const updatedHistory = [cachedItem, ...scanHistory.filter(h => h.barcode !== cleanBarcode)].slice(0, 25);
      saveHistory(updatedHistory);
      setActiveResult(cachedItem);
      setEanInput('');
      setLoading(false);
      return;
    }

    // --- STEP 3: IF OFFLINE & NOT IN CACHE/DB ---
    if (!isOnline) {
      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        barcode: cleanBarcode,
        name: "Produkt offline nicht prüfbar",
        brand: "Keine Internetverbindung",
        imageUrl: null,
        status: 'notfound',
        matchReason: "Du bist offline! Dieses Produkt ist nicht in unserer Offline-Datenbank und es gibt keine gecachte Version. Scanne es erneut, sobald du wieder Netz hast.",
        timestamp,
        loadedOffline: true
      };

      const updatedHistory = [historyItem, ...scanHistory.filter(h => h.barcode !== cleanBarcode)].slice(0, 25);
      saveHistory(updatedHistory);
      setActiveResult(historyItem);
      setEanInput('');
      setLoading(false);
      return;
    }

    // --- STEP 4: ONLINE API LOOKUP ---
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}`);
      let data;
      if (response.status === 404) {
        data = { status: 0 };
      } else if (!response.ok) {
        throw new Error("Netzwerkfehler bei OpenFoodFacts");
      } else {
        data = await response.json();
      }
      
      let historyItem: ScanHistoryItem;

      if (data.status === 1 && data.product) {
        const product = data.product;
        const productName = product.product_name || product.product_name_de || product.product_name_en || "Unbekanntes Produkt";
        const brand = product.brands || "Unbekannte Marke";
        const imageUrl = product.image_front_url || product.image_url || product.image_thumb_url || null;
        
        // Match Engine: Step 1: Check Brands
        let matchedBrand = checkUTMBrand(brand);
        
        // Robust Fallback: Check brands_tags if present
        if (!matchedBrand && product.brands_tags) {
          const tags = Array.isArray(product.brands_tags) ? product.brands_tags : [product.brands_tags];
          for (const tag of tags) {
            const m = checkUTMBrand(tag);
            if (m) {
              matchedBrand = m;
              break;
            }
          }
        }

        let isHit = false;
        let corporationHit: 'muller' | 'nestle' | 'anthroposophy' | null = null;
        let reason = "";

        if (matchedBrand) {
          if (matchedBrand.corporation === 'muller' && activeFilters.muller) {
            isHit = true;
            corporationHit = 'muller';
            reason = `Die Marke '${matchedBrand.name}' gehört zum Müller-Konzern.`;
          } else if (matchedBrand.corporation === 'nestle' && activeFilters.nestle) {
            isHit = true;
            corporationHit = 'nestle';
            reason = `Die Marke '${matchedBrand.name}' gehört zum Nestlé-Konzern.`;
          } else if (matchedBrand.corporation === 'anthroposophy' && activeFilters.anthroposophy) {
            isHit = true;
            corporationHit = 'anthroposophy';
            reason = `Die Marke '${matchedBrand.name}' steht in Verbindung zur Anthroposophie.`;
          }
        }
        
        // Match Engine: Step 2: Check Packaging codes
        let matchedPlant: UTMPlant | null = null;
        let matchedPlantSource = "";
        
        if (!isHit) {
          // Check emb_codes array
          if (product.emb_codes) {
            const codes = product.emb_codes.split(',').map((c: string) => c.trim());
            for (const code of codes) {
              const p = checkUTMPlant(code);
              if (p && p.corporation === 'muller' && activeFilters.muller) {
                matchedPlant = p;
                matchedPlantSource = code;
                break;
              }
            }
          }
          
          // Check emb_codes_tags array
          if (!matchedPlant && product.emb_codes_tags) {
            const tags = Array.isArray(product.emb_codes_tags) ? product.emb_codes_tags : [product.emb_codes_tags];
            for (const tag of tags) {
              const p = checkUTMPlant(tag);
              if (p && p.corporation === 'muller' && activeFilters.muller) {
                matchedPlant = p;
                matchedPlantSource = tag;
                break;
              }
            }
          }

          if (matchedPlant) {
            isHit = true;
            corporationHit = 'muller';
            reason = `Wurde hergestellt im Müller-Werk in ${matchedPlant.city} (${matchedPlant.name}, Betriebsnummer ${matchedPlant.code}, abgeglichen über Code: ${matchedPlantSource}).`;
          }
        }

        historyItem = {
          id: Date.now().toString(),
          barcode: cleanBarcode,
          name: productName,
          brand,
          imageUrl,
          status: isHit ? (corporationHit === 'nestle' ? 'hit-nestle' : corporationHit === 'anthroposophy' ? 'hit-anthroposophy' : 'hit') : 'free',
          matchReason: reason,
          timestamp,
          brandsTags: product.brands_tags || [],
          embCodes: product.emb_codes || "",
          embCodesTags: product.emb_codes_tags || []
        };

        // Save successfully online fetched items to offline cache
        saveToOfflineCache(historyItem);
      } else {
        // Product not found in OpenFoodFacts - Check EAN Prefix Fallback
        const prefixInfo = checkEANPrefix(cleanBarcode);
        let matchReason = "Dieses Produkt wurde nicht bei OpenFoodFacts gefunden. Du kannst das Genusstauglichkeitskennzeichen (ovaler Stempel) manuell unten überprüfen.";
        let status: 'hit' | 'hit-nestle' | 'hit-anthroposophy' | 'free' | 'notfound' = 'notfound';

        if (prefixInfo && prefixInfo.matchingCorp && activeFilters[prefixInfo.matchingCorp]) {
          const corp = prefixInfo.matchingCorp;
          status = corp === 'nestle' ? 'hit-nestle' : corp === 'anthroposophy' ? 'hit-anthroposophy' : 'hit';
          matchReason = `⚠️ VORSICHT (Präfix-Treffer): Das Produkt fehlt in der OpenFoodFacts-Datenbank, aber der EAN-Code beginnt mit '${prefixInfo.prefix}', was sehr wahrscheinlich zum Boykott-Kandidaten '${prefixInfo.matchingBrandName}' gehört!`;
        }

        historyItem = {
          id: Date.now().toString(),
          barcode: cleanBarcode,
          name: prefixInfo && prefixInfo.matchingCorp && prefixInfo.matchingBrandName ? `Verdacht auf ${prefixInfo.matchingBrandName}` : "Produkt nicht in Datenbank",
          brand: (prefixInfo && prefixInfo.matchingCorp && prefixInfo.matchingBrandName) ? prefixInfo.matchingBrandName : "Prüfe Betriebsnummer manuell!",
          imageUrl: null,
          status,
          matchReason,
          timestamp
        };
      }

      // Add to history list, keep maximum of 25 items
      const updatedHistory = [historyItem, ...scanHistory.filter(h => h.barcode !== cleanBarcode)].slice(0, 25);
      saveHistory(updatedHistory);
      setActiveResult(historyItem);
      setEanInput('');
    } catch (error) {
      console.error("API Fetch error:", error);
      setCameraError("Fehler beim Abrufen der Produktdaten. Bitte Internetverbindung prüfen.");
    } finally {
      setLoading(false);
    }
  };

  // Manual Vet Code checker
  const handleVetLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualVetInput) return;
    const match = checkUTMPlant(manualVetInput);
    setVetResult({
      match,
      checked: true
    });
  };

  // Clear search history
  const clearHistory = () => {
    if (window.confirm("Möchtest du deinen Scan-Verlauf wirklich löschen?")) {
      saveHistory([]);
    }
  };

  // Remove single item from history
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = scanHistory.filter(item => item.id !== id);
    saveHistory(updated);
  };

  // Dynamic status evaluation helper
  const getDynamicStatus = (item: ScanHistoryItem): { status: 'hit' | 'hit-nestle' | 'hit-anthroposophy' | 'free' | 'notfound'; reason: string } => {
    if (item.status === 'notfound') {
      return { status: 'notfound', reason: item.matchReason || "" };
    }

    // Step 1: Check brand
    let matchedBrand = checkUTMBrand(item.brand);
    
    // Check brandsTags fallback
    if (!matchedBrand && item.brandsTags) {
      for (const tag of item.brandsTags) {
        const m = checkUTMBrand(tag);
        if (m) {
          matchedBrand = m;
          break;
        }
      }
    }

    if (matchedBrand) {
      if (matchedBrand.corporation === 'muller' && activeFilters.muller) {
        return { 
          status: 'hit', 
          reason: `Die Marke '${matchedBrand.name}' gehört zum Müller-Konzern.` 
        };
      }
      if (matchedBrand.corporation === 'nestle' && activeFilters.nestle) {
        return { 
          status: 'hit-nestle', 
          reason: `Die Marke '${matchedBrand.name}' gehört zum Nestlé-Konzern.` 
        };
      }
      if (matchedBrand.corporation === 'anthroposophy' && activeFilters.anthroposophy) {
        return { 
          status: 'hit-anthroposophy', 
          reason: `Die Marke '${matchedBrand.name}' steht in Verbindung zur Anthroposophie.` 
        };
      }
    }

    // Step 2: Check packaging codes for Müller
    let matchedPlant: UTMPlant | null = null;
    let matchedPlantSource = "";

    if (item.embCodes && activeFilters.muller) {
      const codes = item.embCodes.split(',').map(c => c.trim());
      for (const code of codes) {
        const p = checkUTMPlant(code);
        if (p && p.corporation === 'muller') {
          matchedPlant = p;
          matchedPlantSource = code;
          break;
        }
      }
    }

    if (!matchedPlant && item.embCodesTags && activeFilters.muller) {
      const tags = Array.isArray(item.embCodesTags) 
        ? item.embCodesTags 
        : typeof item.embCodesTags === 'string' 
          ? [item.embCodesTags] 
          : [];
      for (const tag of tags) {
        const p = checkUTMPlant(tag);
        if (p && p.corporation === 'muller') {
          matchedPlant = p;
          matchedPlantSource = tag;
          break;
        }
      }
    }

    if (matchedPlant) {
      return {
        status: 'hit',
        reason: `Wurde hergestellt im Müller-Werk in ${matchedPlant.city} (${matchedPlant.name}, Betriebsnummer ${matchedPlant.code}, abgeglichen über Code: ${matchedPlantSource}).`
      };
    }

    // Step 3: Check EAN prefix matching as a fallback
    const prefixInfo = checkEANPrefix(item.barcode);
    if (prefixInfo && prefixInfo.matchingCorp) {
      const corp = prefixInfo.matchingCorp;
      if (activeFilters[corp]) {
        return {
          status: corp === 'nestle' ? 'hit-nestle' : corp === 'anthroposophy' ? 'hit-anthroposophy' : 'hit',
          reason: `⚠️ VORSICHT (Präfix-Treffer): Der EAN-Code beginnt mit '${prefixInfo.prefix}', was sehr wahrscheinlich zum Boykott-Kandidaten '${prefixInfo.matchingBrandName}' gehört!`
        };
      }
    }

    return { status: 'free', reason: "" };
  };

  // Recommendations generator depending on brands/categories
  const getAlternativesForProduct = (result: ScanHistoryItem): Alternative[] => {
    const { status } = getDynamicStatus(result);
    if (status !== 'hit' && status !== 'hit-nestle' && status !== 'hit-anthroposophy') return [];
    
    const brandLower = result.brand.toLowerCase();
    const nameLower = result.name.toLowerCase();
    
    let matchedCategory = 'milch'; // default fallback
    
    if (brandLower.includes('alverde') || brandLower.includes('weleda') || brandLower.includes('hauschka') || brandLower.includes('wala') || brandLower.includes('dm') || nameLower.includes('creme') || nameLower.includes('duschgel') || nameLower.includes('shampoo') || nameLower.includes('kosmetik') || nameLower.includes('pflege') || nameLower.includes('lotion')) {
      matchedCategory = 'kosmetik';
    } else if (brandLower.includes('berief') || nameLower.includes('tofu') || nameLower.includes('soja') || nameLower.includes('soy')) {
      matchedCategory = 'tofu';
    } else if (brandLower.includes('loose') || brandLower.includes('quäse') || nameLower.includes('käse') || nameLower.includes('cheese')) {
      matchedCategory = 'kaese';
    } else if (brandLower.includes('homann') || brandLower.includes('nadler') || nameLower.includes('salat') || nameLower.includes('fisch') || nameLower.includes('sauce') || nameLower.includes('dressing')) {
      matchedCategory = 'saucen';
    } else if (nameLower.includes('joghurt') || nameLower.includes('yoghurt') || brandLower.includes('elinas') || brandLower.includes('lünebest')) {
      matchedCategory = 'joghurt';
    } else if (nameLower.includes('milchreis') || nameLower.includes('wackelpudding') || nameLower.includes('pudding') || nameLower.includes('dessert')) {
      matchedCategory = 'dessert';
    } else if (nameLower.includes('sahne') || nameLower.includes('butter') || nameLower.includes('schmand') || nameLower.includes('rahm')) {
      matchedCategory = 'butter';
    } else if (brandLower.includes('wagner') || nameLower.includes('pizza') || nameLower.includes('flammkuchen') || brandLower.includes('buitoni')) {
      matchedCategory = 'pizza';
    } else if (brandLower.includes('vittel') || brandLower.includes('pellegrino') || brandLower.includes('panna') || brandLower.includes('perrier') || nameLower.includes('wasser') || nameLower.includes('mineralwasser') || nameLower.includes('limonade')) {
      matchedCategory = 'wasser';
    } else if (brandLower.includes('kitkat') || brandLower.includes('smarties') || brandLower.includes('lion') || brandLower.includes('aftereight') || brandLower.includes('crossies') || brandLower.includes('choclait') || nameLower.includes('schokolade') || nameLower.includes('kakao') || nameLower.includes('nesquik') || nameLower.includes('riegel')) {
      matchedCategory = 'schokolade';
    } else if (brandLower.includes('maggi') || brandLower.includes('thomy') || nameLower.includes('brühe') || nameLower.includes('gewürz') || nameLower.includes('bouillon') || nameLower.includes('senf') || nameLower.includes('mayo')) {
      matchedCategory = 'saucen';
    }

    return independentAlternatives.filter(alt => 
      alt.recommendedFor.includes(matchedCategory) &&
      !alt.isAnthroposophic &&
      !alt.name.toLowerCase().includes('alnatura') &&
      !alt.name.toLowerCase().includes('weleda') &&
      !alt.name.toLowerCase().includes('wala') &&
      !alt.name.toLowerCase().includes('hauschka') &&
      !alt.name.toLowerCase().includes('demeter') &&
      !alt.name.toLowerCase().includes('bauckhof') &&
      !alt.name.toLowerCase().includes('voelkel') &&
      !alt.name.toLowerCase().includes('spielberger') &&
      !alt.name.toLowerCase().includes('holle') &&
      !alt.name.toLowerCase().includes('dmbio') &&
      !alt.name.toLowerCase().includes('dm-') &&
      !alt.name.toLowerCase().includes('alverde')
    );
  };

  // --- STATS & ACHIEVEMENTS CALCULATION ---
  const stats = React.useMemo(() => {
    let mullerHits = 0;
    let nestleHits = 0;
    let anthroHits = 0;
    let safeScans = 0;

    scanHistory.forEach(item => {
      const { status } = getDynamicStatus(item);
      if (status === 'hit') mullerHits++;
      else if (status === 'hit-nestle') nestleHits++;
      else if (status === 'hit-anthroposophy') anthroHits++;
      else if (status === 'free') safeScans++;
    });

    const totalValidScans = mullerHits + nestleHits + anthroHits + safeScans;
    const busterScore = totalValidScans > 0 ? Math.round((safeScans / totalValidScans) * 100) : 100;

    return {
      mullerHits,
      nestleHits,
      anthroHits,
      safeScans,
      totalValidScans,
      busterScore
    };
  }, [scanHistory, activeFilters]);

  const achievements = React.useMemo(() => {
    const totalScans = scanHistory.length;
    const hasMullerHit = scanHistory.some(item => getDynamicStatus(item).status === 'hit');
    const hasNestleHit = scanHistory.some(item => getDynamicStatus(item).status === 'hit-nestle');
    const hasAnthroHit = scanHistory.some(item => getDynamicStatus(item).status === 'hit-anthroposophy');
    const isPerfectFive = stats.totalValidScans >= 5 && stats.busterScore === 100;
    const isBoycottMaster = scanHistory.filter(item => getDynamicStatus(item).status !== 'notfound').length >= 15;

    return [
      {
        id: 'first_scan',
        title: 'Ersttäter',
        description: 'Deinen ersten Produkt-Scan durchgeführt.',
        unlocked: totalScans > 0,
        icon: 'Award',
        color: '#00e5ff'
      },
      {
        id: 'muller_buster',
        title: 'Müller-Buster',
        description: 'Erfolgreich ein Müller-Konzernprodukt entlarvt.',
        unlocked: hasMullerHit,
        icon: 'Trophy',
        color: '#ff4433'
      },
      {
        id: 'nestle_hunter',
        title: 'Nestlé-Jäger',
        description: 'Ein Produkt des Nestlé-Konzerns aufgespürt.',
        unlocked: hasNestleHit,
        icon: 'Trophy',
        color: '#00d2ff'
      },
      {
        id: 'anthro_filter',
        title: 'Schattenboxer',
        description: 'Verbindung zur Anthroposophie/Demeter aufgedeckt.',
        unlocked: hasAnthroHit,
        icon: 'Trophy',
        color: '#c38eff'
      },
      {
        id: 'purity_law',
        title: 'Reinheitsgebot',
        description: '5+ Scans absolviert und 100% boykottfreie Weste!',
        unlocked: isPerfectFive,
        icon: 'Award',
        color: '#00e676'
      },
      {
        id: 'boycott_master',
        title: 'Boykott-Meister',
        description: '15+ Produkte erfolgreich auf deine Blacklist gecheckt.',
        unlocked: isBoycottMaster,
        icon: 'Award',
        color: '#ffc107'
      }
    ];
  }, [scanHistory, stats]);

  // Motivational quote based on score
  const motivationText = React.useMemo(() => {
    if (stats.totalValidScans === 0) {
      return "Scanne dein erstes Produkt im Laden, um deinen persönlichen Buster-Score zu berechnen!";
    }
    if (stats.busterScore === 100) {
      return "Makellose Weste! Du kaufst absolut bewusst ein und meidest Ausbeutung, Esoterik und rechtsextreme Verflechtungen. Weiter so!";
    }
    if (stats.busterScore >= 80) {
      return "Ziemlich gut! Dein Einkaufswagen ist fast sauber. Nur noch ein paar kleine Anpassungen und du bist komplett buster-rein.";
    }
    if (stats.busterScore >= 50) {
      return "Auf dem Weg der Besserung! Du entlarvst schon einige unschöne Produkte, aber es schleicht sich noch zu viel Müller oder Nestlé ein.";
    }
    return "Oje, dein Einkaufswagen ist eine Konzern-Festung! Nutze unsere empfohlenen Alternativen, um dich von Müller, Nestlé und Anthroposophie zu befreien.";
  }, [stats]);

  return (
    <div className="app-container">
      {/* HEADER SECTION */}
      <header className="app-header">
        <div className="brand-title">
          <h1>
            Paranoid Android
            <span className="logo-badge">Beta</span>
          </h1>
          <span className={`network-badge ${isOnline ? 'online' : 'offline'}`}>
            <span className="network-dot"></span>
            {isOnline ? 'Online' : 'Offline-Modus'}
          </span>
        </div>
        
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            <Camera size={18} />
            <span>Scanner</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Building2 size={18} />
            <span>Konzern-Struktur</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'political' ? 'active' : ''}`}
            onClick={() => setActiveTab('political')}
          >
            <BookOpen size={18} />
            <span>Hintergrund</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Trophy size={18} />
            <span>Mein Score</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'saison' ? 'active' : ''}`}
            onClick={() => setActiveTab('saison')}
          >
            <Sprout size={18} />
            <span>Saison-Buster</span>
          </button>
        </nav>
      </header>

      {/* MAIN VIEW */}
      <main className="app-main">
        
        {/* VIEW 1: SCANNER PAGE */}
        {activeTab === 'scan' && (
          <div className="scanner-grid">
            
            {/* Left Side: Scanner Controls and Viewport */}
            <div className="scanner-section">
              <div className="glass-card">
                <h2 className="section-title">
                  <Sparkles size={20} className="text-cyan" />
                  Nahrungsmittel scannen
                </h2>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Scanne den Barcode (EAN) oder tippe ihn ein, um sofort zu prüfen, ob das Produkt zum Konzernumfeld der ausgewählten Konzerne gehört.
                </p>

                {/* Interactive Boycott-Filter Toggles */}
                <div className="filter-selector">
                  <div className="filter-selector-label">
                    <Building2 size={15} />
                    <span>Aktive Boykott-Filter:</span>
                  </div>
                  <div className="filter-toggles">
                    <button 
                      type="button"
                      className={`filter-toggle-btn muller ${activeFilters.muller ? 'active' : ''}`}
                      onClick={() => handleFilterToggle('muller')}
                    >
                      <span className="dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                      Müller-Gruppe ({activeFilters.muller ? 'Aktiv' : 'Inaktiv'})
                    </button>
                    <button 
                      type="button"
                      className={`filter-toggle-btn nestle ${activeFilters.nestle ? 'active' : ''}`}
                      onClick={() => handleFilterToggle('nestle')}
                    >
                      <span className="dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-nestle)' }}></span>
                      Nestlé-Konzern ({activeFilters.nestle ? 'Aktiv' : 'Inaktiv'})
                    </button>
                    <button 
                      type="button"
                      className={`filter-toggle-btn anthroposophy ${activeFilters.anthroposophy ? 'active' : ''}`}
                      onClick={() => handleFilterToggle('anthroposophy')}
                    >
                      <span className="dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-anthroposophy)' }}></span>
                      Anthroposophie ({activeFilters.anthroposophy ? 'Aktiv' : 'Inaktiv'})
                    </button>
                  </div>
                </div>

                {/* Camera Viewport Container */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {isScanning ? (
                    <div className="scanner-box scanning">
                      <div id={scannerContainerId}></div>
                      
                      {/* Premium HUD scanner frame overlay */}
                      <div className="scanner-overlay">
                        <div className="scanner-target-box">
                          <div className="scanner-laser"></div>
                          <div className="scanner-corner top-left"></div>
                          <div className="scanner-corner top-right"></div>
                          <div className="scanner-corner bottom-left"></div>
                          <div className="scanner-corner bottom-right"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="scanner-box" style={{ background: 'linear-gradient(135deg, hsl(220, 20%, 8%) 0%, hsl(220, 20%, 13%) 100%)' }}>
                      <Camera size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <button className="btn btn-primary" onClick={startScanningAction}>
                        <Camera size={18} />
                        Kamera starten & scannen
                      </button>
                    </div>
                  )}

                  {cameraError && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255, 68, 51, 0.1)', border: '1px solid rgba(255, 68, 51, 0.2)', color: 'var(--color-danger)', fontSize: '0.85rem' }}>
                      {cameraError}
                    </div>
                  )}

                  {isScanning && (
                    <div className="scanner-controls" style={{ marginTop: '1rem' }}>
                      <button className="btn btn-secondary" onClick={stopScanningAction}>
                        Barcode-Scanner stoppen
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
                  <span style={{ padding: '0 1rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Oder Barcode eingeben</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
                </div>

                {/* Manual Barcode Input */}
                <div className="manual-input-box">
                  <label className="input-label">EAN-Barcode (13-stellige Zahl)</label>
                  <form onSubmit={(e) => { e.preventDefault(); handleProductLookup(eanInput); }} className="input-group" style={{ marginBottom: eanInput.length >= 3 ? '1rem' : '0' }}>
                    <input 
                      type="text" 
                      className="text-input" 
                      placeholder="z.B. 4002631000124 (Müllermilch)"
                      value={eanInput}
                      onChange={(e) => setEanInput(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading || !eanInput}>
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                      Prüfen
                    </button>
                  </form>

                  {(() => {
                    const livePrefixMatch = eanInput.length >= 3 ? checkEANPrefix(eanInput) : null;
                    if (!livePrefixMatch) return null;
                    
                    return (
                      <div className={`ean-diagnostic-card ${livePrefixMatch.matchingCorp ? `match-${livePrefixMatch.matchingCorp}` : 'safe-prefix'} animate-slide-down`}>
                        <div className="diag-header">
                          <span className="diag-flag">{livePrefixMatch.flag}</span>
                          <span className="diag-country">Registriert in <strong>{livePrefixMatch.country}</strong></span>
                          <span className="diag-confidence-badge">{livePrefixMatch.matchingCorp ? 'Konzern-Muster erkannt' : 'Präfix unauffällig'}</span>
                        </div>
                        {livePrefixMatch.matchingCorp ? (
                          <div className="diag-body">
                            <div className="diag-warning-row">
                              <AlertTriangle size={18} className="text-warning-icon" />
                              <div className="diag-text-block">
                                <strong>Verdacht auf: {livePrefixMatch.matchingBrandName}</strong>
                                <p className="diag-warning-desc">
                                  Dieses Barcode-Präfix ({livePrefixMatch.prefix}) deutet direkt auf Produkte der Gruppe <strong>{livePrefixMatch.matchingBrandName}</strong> hin.
                                </p>
                              </div>
                            </div>
                            
                            {activeFilters[livePrefixMatch.matchingCorp] ? (
                              <div className="diag-filter-status danger">
                                <span className="dot danger-dot"></span>
                                <strong>Boykott-Filter AKTIV!</strong> Dieses Produkt fällt unter deine aktiven Boykott-Richtlinien.
                              </div>
                            ) : (
                              <div className="diag-filter-status info">
                                <span className="dot info-dot"></span>
                                <strong>Boykott-Filter Inaktiv.</strong> Die Marke wird boykottiert, aber der Filter ist aktuell ausgeschaltet.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="diag-body safe">
                            <CheckCircle size={16} className="text-success" />
                            <span>Dieses EAN-Präfix ({livePrefixMatch.prefix}) ist in unserer Boykott-Datenbank nicht als Konzern-Muster registriert.</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Veterinary Code interactive Lookup Tool */}
              <div className="glass-card vet-lookup-card">
                <h3 className="section-title">
                  <ShieldCheck size={20} className="text-cyan" />
                  Stempel-Checker (Genusstauglichkeitskennzeichen)
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Manche Eigenmarken von Discountern verschleiern den wahren Hersteller. Siehe auf der Rückseite nach dem <strong>ovalen EU-Identitätskennzeichen</strong> (z.B. <code>DE SN 016 EG</code>) und gib es hier direkt ein.
                </p>

                <form onSubmit={handleVetLookup} className="vet-lookup-input-box">
                  <input 
                    type="text" 
                    className="text-input" 
                    placeholder="z.B. DE SN 016 EG" 
                    value={manualVetInput}
                    onChange={(e) => {
                      setManualVetInput(e.target.value);
                      setVetResult({ match: null, checked: false });
                    }}
                  />
                  <button type="submit" className="btn btn-secondary">Überprüfen</button>
                </form>

                {vetResult.checked && (
                  <div className="vet-lookup-result">
                    {vetResult.match ? (
                      <div className="trigger-match-box">
                        <div className="trigger-title">
                          <AlertTriangle size={18} />
                          MÜLLER-KONZERN TREFFER!
                        </div>
                        <p className="trigger-text" style={{ fontSize: '0.85rem' }}>
                          Dieses Kennzeichen gehört zur Betriebsstätte: <br />
                          <strong>{vetResult.match.name}</strong> in {vetResult.match.city} ({vetResult.match.state}). <br />
                          <span style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.5rem', display: 'block' }}>
                            {vetResult.match.description}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="safe-info-box">
                        <div className="safe-title">
                          <CheckCircle size={18} />
                          Keine Müller-Betriebsstätte
                        </div>
                        <p className="safe-text" style={{ fontSize: '0.85rem' }}>
                          Das eingegebene Kennzeichen <strong>"{manualVetInput}"</strong> stimmt mit keiner bekannten Betriebsstätte der Müller-Gruppe überein.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Scan History */}
            <div className="history-section glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <h2 className="section-title" style={{ border: 'none', padding: 0, margin: 0 }}>
                  <History size={20} className="text-cyan" />
                  Deine Scans
                </h2>
                {scanHistory.length > 0 && (
                  <button className="delete-btn" onClick={clearHistory} title="Verlauf löschen">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {scanHistory.length === 0 ? (
                <div className="empty-state">
                  <History size={40} style={{ opacity: 0.3 }} />
                  <p>Noch keine Scans durchgeführt.</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Scanne Produkte im Markt, um deine Einkaufsliste Müller-frei zu halten!</p>
                </div>
              ) : (
                <div className="history-list">
                  {scanHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className="history-item" 
                      onClick={() => setActiveResult(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="history-info">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="product-img" style={{ width: '40px', height: '40px' }} />
                        ) : (
                          <div className="product-no-img" style={{ width: '40px', height: '40px' }}>
                            <HelpCircle size={16} />
                          </div>
                        )}
                        <div className="history-meta">
                          <div className="history-name">{item.name}</div>
                          <div className="history-code">{item.brand}</div>
                          {item.loadedOffline && (
                            <span className="source-badge offline-source">⚡ Offline-Treffer</span>
                          )}
                          {item.loadedFromCache && (
                            <span className="source-badge cache-source">💾 Aus Cache</span>
                          )}
                        </div>
                      </div>
                      
                      {(() => {
                        const { status: itemStatus } = getDynamicStatus(item);
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={`indicator-pill ${itemStatus}`}>
                              {itemStatus === 'hit' ? 'Müller' : itemStatus === 'hit-nestle' ? 'Nestlé' : itemStatus === 'hit-anthroposophy' ? 'Anthros.' : itemStatus === 'free' ? 'Frei' : 'Unbekannt'}
                            </span>
                            <button className="delete-btn" onClick={(e) => deleteHistoryItem(item.id, e)}>
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: EXPLORE CONCERN STRUCTURE */}
        {activeTab === 'explore' && (
          <div className="explore-grid">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 className="section-title">
                <Building2 size={22} className="text-cyan" />
                Konzern-Strukturen & Marken
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Viele Marken von <strong>Theo Müller</strong> und <strong>Nestlé</strong> verbergen sich geschickt hinter ländlicher Idylle, historischen Logos oder regionaler Herkunft. Hier ist eine Übersicht über die boykottierten Konzerne:
              </p>

              <h3 style={{ fontSize: '1.15rem', color: '#ff4433', borderBottom: '1px solid rgba(255, 68, 51, 0.2)', paddingBottom: '0.5rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                Unternehmensgruppe Theo Müller (UTM)
              </h3>
              <div className="brand-showcase">
                {Object.values(utmBrands)
                  .filter((brand, idx, self) => brand.corporation === 'muller' && self.findIndex(b => b.id === brand.id) === idx)
                  .map((brand) => (
                  <div key={brand.id} className="brand-card">
                    <div className="brand-card-header">
                      <div className="brand-card-name">{brand.name}</div>
                      <span className="indicator-pill hit" style={{ fontSize: '0.65rem' }}>Müller</span>
                    </div>
                    <div className="brand-card-category">{brand.category}</div>
                    <div className="brand-card-desc">{brand.description}</div>
                    <div className="brand-card-relation">{brand.relation}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-nestle)', borderBottom: '1px solid rgba(0, 210, 255, 0.2)', paddingBottom: '0.5rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-nestle)' }}></span>
                Nestlé-Konzern
              </h3>
              <div className="brand-showcase">
                {Object.values(utmBrands)
                  .filter((brand, idx, self) => brand.corporation === 'nestle' && self.findIndex(b => b.id === brand.id) === idx)
                  .map((brand) => (
                  <div key={brand.id} className="brand-card nestle-brand">
                    <div className="brand-card-header">
                      <div className="brand-card-name">{brand.name}</div>
                      <span className="indicator-pill hit-nestle" style={{ fontSize: '0.65rem' }}>Nestlé</span>
                    </div>
                    <div className="brand-card-category">{brand.category}</div>
                    <div className="brand-card-desc">{brand.description}</div>
                    <div className="brand-card-relation">{brand.relation}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-anthroposophy)', borderBottom: '1px solid rgba(195, 142, 255, 0.2)', paddingBottom: '0.5rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-anthroposophy)' }}></span>
                Anthroposophie & Demeter
              </h3>
              <div className="brand-showcase">
                {Object.values(utmBrands)
                  .filter((brand, idx, self) => brand.corporation === 'anthroposophy' && self.findIndex(b => b.id === brand.id) === idx)
                  .map((brand) => (
                  <div key={brand.id} className="brand-card anthroposophy-brand">
                    <div className="brand-card-header">
                      <div className="brand-card-name">{brand.name}</div>
                      <span className="indicator-pill hit-anthroposophy" style={{ fontSize: '0.65rem' }}>Anthros.</span>
                    </div>
                    <div className="brand-card-category">{brand.category}</div>
                    <div className="brand-card-desc">{brand.description}</div>
                    <div className="brand-card-relation">{brand.relation}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="section-title">
                <MapPin size={20} className="text-cyan" />
                Müller Betriebsstätten
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Wenn ein Produkt als <strong>Handelsmarke</strong> (Eigenmarke z.B. bei Lidl, Aldi, Edeka, REWE) vertrieben wird, muss laut Gesetz ein Identitätskennzeichen aufgedruckt sein. Folgende Betriebsnummern verweisen direkt auf Müller-Molkereien:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.values(utmPlants).filter((v, i, a) => a.findIndex(t => t.code === v.code) === i).map((plant) => (
                  <div key={plant.code} className="plant-card">
                    <div className="plant-card-header">
                      <div className="plant-card-name">{plant.name}</div>
                      <span className="plant-card-code">{plant.code}</span>
                    </div>
                    <div className="plant-card-location">{plant.city}, {plant.state}</div>
                    <div className="plant-card-desc">{plant.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: POLITICAL BACKGROUND */}
        {activeTab === 'political' && (
          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 className="section-title">
              <BookOpen size={22} className="text-cyan" />
              Hintergründe des Boykotts: Warum Müller, Nestlé & Anthroposophie meiden?
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem' }}>
              Die Kritik an Theo Müller, dem Nestlé-Konzern und anthroposophischen Großunternehmen hat sich über Jahrzehnte aufgebaut. Sie speist sich aus politischen Kontroversen, Steuervermeidungstaktiken, Ausbeutung von Ressourcen, unwissenschaftlichen Praktiken und marktbeherrschendem Druck auf globale Systeme.
            </p>

            <div className="controversy-list">
              <h3 style={{ fontSize: '1.25rem', color: '#ff4433', borderBottom: '1px solid rgba(255, 68, 51, 0.2)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                Unternehmensgruppe Theo Müller Kontroversen
              </h3>
              {boycottReasons.filter(r => r.corporation === 'muller').map((reason, idx) => (
                <div key={idx} className="controversy-item">
                  <h4 className="controversy-title">
                    <AlertTriangle size={18} className="text-danger" />
                    {reason.title}
                  </h4>
                  <div className="controversy-summary">{reason.description}</div>
                  <p className="controversy-details">{reason.details}</p>
                </div>
              ))}

              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-nestle)', borderBottom: '1px solid rgba(0, 210, 255, 0.2)', paddingBottom: '0.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-nestle)' }}></span>
                Nestlé-Konzern Kontroversen
              </h3>
              {boycottReasons.filter(r => r.corporation === 'nestle').map((reason, idx) => (
                <div key={idx} className="controversy-item nestle-controversy">
                  <h4 className="controversy-title">
                    <AlertTriangle size={18} style={{ color: 'var(--color-nestle)' }} />
                    {reason.title}
                  </h4>
                  <div className="controversy-summary">{reason.description}</div>
                  <p className="controversy-details">{reason.details}</p>
                </div>
              ))}

              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-anthroposophy)', borderBottom: '1px solid rgba(195, 142, 255, 0.2)', paddingBottom: '0.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-anthroposophy)' }}></span>
                Anthroposophie & Demeter Kontroversen
              </h3>
              {boycottReasons.filter(r => r.corporation === 'anthroposophy').map((reason, idx) => (
                <div key={idx} className="controversy-item anthroposophy-controversy">
                  <h4 className="controversy-title">
                    <AlertTriangle size={18} style={{ color: 'var(--color-anthroposophy)' }} />
                    {reason.title}
                  </h4>
                  <div className="controversy-summary">{reason.description}</div>
                  <p className="controversy-details">{reason.details}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Weiterführende, unabhängige Recherchen & Berichte:</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <li>
                  <a href="https://www.tagesschau.de/inland/innenpolitik/afd-weidel-mueller-milch-100.html" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Tagesschau: Theo Müller bestätigt Kontakte zu AfD-Spitze <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://de.wikipedia.org/wiki/Unternehmensgruppe_Theo_M%C3%BCller#Kritik" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Wikipedia: Detaillierte Kritik an der Müller-Unternehmensgruppe <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://de.wikipedia.org/wiki/Nestl%C3%A9#Kritik_und_Kontroversen" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Wikipedia: Nestlé Kritik und weltweite Kontroversen <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://www.spiegel.de/thema/nestle/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Der Spiegel: Berichte & Recherchen zum Nestlé-Konzern <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://de.wikipedia.org/wiki/Anthroposophie#Kritik" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Wikipedia: Kritik an der Anthroposophie (Esoterik & Rassenlehre Rudolf Steiners) <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://de.wikipedia.org/wiki/G%C3%B6tz_Werner#Anthroposophie" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    Wikipedia: Götz Werner und anthroposophische Führungsprinzipien bei dm <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* VIEW 4: MY SCORE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            
            {/* Score circle card */}
            <div className="glass-card score-main-card">
              <h2 className="section-title">
                <Trophy size={20} className="text-cyan animate-pulse" />
                Dein Buster-Score
              </h2>
              
              <div className="score-ring-container">
                <div className="score-ring-wrapper">
                  <svg width="180" height="180" viewBox="0 0 180 180" className="score-ring-svg">
                    <circle
                      className="score-ring-bg"
                      cx="90"
                      cy="90"
                      r="72"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      className="score-ring-progress"
                      cx="90"
                      cy="90"
                      r="72"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 72}
                      strokeDashoffset={2 * Math.PI * 72 * (1 - stats.busterScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="score-center-text">
                    <span className="score-number">{stats.busterScore}%</span>
                    <span className="score-label">Reinheit</span>
                  </div>
                </div>
              </div>

              <div className="motivation-card">
                <p className="motivation-quote">"{motivationText}"</p>
              </div>
            </div>

            {/* Statistics Counters Grid */}
            <div className="glass-card stats-counters-card">
              <h2 className="section-title">
                <Building2 size={20} className="text-cyan" />
                Deine Einkaufs-Statistiken
              </h2>
              
              <div className="stats-metric-grid">
                <div className="metric-box muller-metric">
                  <div className="metric-header">
                    <span className="dot muller-dot"></span>
                    <span>Müller</span>
                  </div>
                  <div className="metric-value">{stats.mullerHits}</div>
                  <div className="metric-footer">Produkte entlarvt</div>
                </div>

                <div className="metric-box nestle-metric">
                  <div className="metric-header">
                    <span className="dot nestle-dot"></span>
                    <span>Nestlé</span>
                  </div>
                  <div className="metric-value">{stats.nestleHits}</div>
                  <div className="metric-footer">Produkte entlarvt</div>
                </div>

                <div className="metric-box anthro-metric">
                  <div className="metric-header">
                    <span className="dot anthro-dot"></span>
                    <span>Anthroposophie</span>
                  </div>
                  <div className="metric-value">{stats.anthroHits}</div>
                  <div className="metric-footer">Produkte entlarvt</div>
                </div>

                <div className="metric-box safe-metric">
                  <div className="metric-header">
                    <span className="dot safe-dot"></span>
                    <span>Sauber</span>
                  </div>
                  <div className="metric-value">{stats.safeScans}</div>
                  <div className="metric-footer">Produkte verifiziert</div>
                </div>
              </div>

              <div className="total-metric-bar">
                <span>Geprüfte Produkte (gesamt): <strong>{stats.totalValidScans}</strong></span>
              </div>
            </div>

            {/* Achievements/Medaillen */}
            <div className="glass-card achievements-card">
              <h2 className="section-title">
                <Award size={20} className="text-cyan" />
                Freigeschaltete Abzeichen
              </h2>
              
              <div className="badges-grid">
                {achievements.map((badge) => {
                  const IconComponent = badge.icon === 'Trophy' ? Trophy : Award;
                  return (
                    <div 
                      key={badge.id} 
                      className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                      style={{ '--badge-theme-color': badge.color } as React.CSSProperties}
                    >
                      <div className="badge-icon-container">
                        <IconComponent size={24} className="badge-icon" />
                        {!badge.unlocked && <div className="badge-lock">🔒</div>}
                      </div>
                      <div className="badge-info">
                        <h3 className="badge-title">{badge.title}</h3>
                        <p className="badge-description">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Sins with Quick Alternatives */}
            <div className="glass-card sins-card">
              <h2 className="section-title">
                <AlertTriangle size={20} className="text-danger" />
                Deine Sünden (Boykottierte Produkte)
              </h2>

              {scanHistory.filter(item => {
                const s = getDynamicStatus(item).status;
                return s === 'hit' || s === 'hit-nestle' || s === 'hit-anthroposophy';
              }).length === 0 ? (
                <div className="empty-sins-state">
                  <CheckCircle size={48} className="text-success animate-bounce" />
                  <h3 style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 'bold' }}>Keine Sünden gefunden!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '350px' }}>
                    Du hast in deiner aktuellen Scan-Historie keine problematischen Produkte gescannt. Hervorragend!
                  </p>
                </div>
              ) : (
                <div className="sins-list">
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Folgende Produkte in deinem Verlauf sind mit Warnungen versehen. Tippe auf ein Produkt, um Alternativen zu sehen:
                  </p>
                  {scanHistory.filter(item => {
                    const s = getDynamicStatus(item).status;
                    return s === 'hit' || s === 'hit-nestle' || s === 'hit-anthroposophy';
                  }).map((item) => {
                    const { status: itemStatus } = getDynamicStatus(item);
                    return (
                      <div 
                        key={item.id} 
                        className={`sin-item ${itemStatus}`}
                        onClick={() => setActiveResult(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="sin-left">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="product-img-sin" style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#fff', borderRadius: '6px', padding: '2px' }} />
                          ) : (
                            <div className="product-no-img-sin" style={{ width: '40px', height: '40px', background: 'hsla(220, 10%, 40%, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                              <HelpCircle size={14} />
                            </div>
                          )}
                          <div className="sin-meta" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '10px' }}>
                            <span className="sin-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                            <span className="sin-brand" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.brand}</span>
                          </div>
                        </div>
                        <span className={`indicator-pill ${itemStatus}`}>
                          {itemStatus === 'hit' ? 'Müller' : itemStatus === 'hit-nestle' ? 'Nestlé' : 'Anthros.'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 5: SAISON-BUSTER REGIONAL CALENDAR */}
        {activeTab === 'saison' && (() => {
          const monthNames = [
            "Januar", "Februar", "März", "April", "Mai", "Juni", 
            "Juli", "August", "September", "Oktober", "November", "Dezember"
          ];

          // Compute seasonal list on the fly
          const filteredSaisonItems = seasonalItems.filter(item => {
            // Month match
            if (!item.months.includes(selectedMonth)) return false;
            
            // Category filter
            if (saisonCategoryFilter !== 'all' && item.category !== saisonCategoryFilter) return false;
            
            // Type filter
            if (saisonTypeFilter !== 'all' && item.type !== saisonTypeFilter) return false;
            
            // Search query filter
            if (saisonSearchQuery.trim() !== '') {
              const q = saisonSearchQuery.toLowerCase();
              if (!item.name.toLowerCase().includes(q) && !(item.tips && item.tips.toLowerCase().includes(q))) {
                return false;
              }
            }
            
            return true;
          });

          return (
            <div className="saison-container glass-card animate-slide-down">
              <div className="saison-header">
                <h2 className="section-title">
                  <Sprout size={22} className="text-success animate-pulse" />
                  Saison-Buster: Regionaler Einkaufshelfer
                </h2>
                <p className="saison-subtitle">
                  Der ultimative Schutz vor Konzern-Monopolen: Kaufe frische, unverarbeitete und biologische Lebensmittel zur richtigen Jahreszeit direkt aus deiner Region.
                </p>
              </div>

              {/* Sprout Antidote Explainer Box */}
              <div className="saison-explainer">
                <div className="explainer-icon-container">
                  <Sparkles size={20} />
                </div>
                <div className="explainer-text">
                  <strong>Das ultimative Antidot zu Müller & Nestlé</strong>
                  <p>
                    Indem du frisches, regionales Freilandgemüse, Kräuter und Obst direkt auf Bauernmärkten oder über Solawis (Solidarische Landwirtschaft) kaufst, meidest du industriell verarbeitete Produkte vollständig. Das entzieht den ausbeuterischen Lebensmittelkonzernen jegliche finanzielle Macht und schützt das Klima!
                  </p>
                </div>
              </div>

              {/* Month Selector Horizontal Slider */}
              <div className="months-slider-container">
                <div className="months-slider-header">
                  <Calendar size={16} />
                  <span>Monat auswählen:</span>
                </div>
                <div className="months-slider">
                  {monthNames.map((name, index) => (
                    <button
                      key={index}
                      className={`month-btn ${selectedMonth === index ? 'active' : ''}`}
                      onClick={() => setSelectedMonth(index)}
                    >
                      <span className="month-number">{index + 1}</span>
                      <span className="month-name">{name.substring(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters panel */}
              <div className="saison-filters">
                <div className="search-box-saison">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Saisonale Produkte filtern (z.B. Bärlauch, Kürbis)..."
                    value={saisonSearchQuery}
                    onChange={(e) => setSaisonSearchQuery(e.target.value)}
                    className="text-input"
                  />
                  {saisonSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setSaisonSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-row-saison">
                  <div className="filter-group-saison">
                    <span className="filter-group-label">Kategorie:</span>
                    <div className="filter-buttons">
                      <button 
                        className={`filter-btn ${saisonCategoryFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setSaisonCategoryFilter('all')}
                      >
                        Alle
                      </button>
                      <button 
                        className={`filter-btn ${saisonCategoryFilter === 'vegetable' ? 'active' : ''}`}
                        onClick={() => setSaisonCategoryFilter('vegetable')}
                      >
                        Gemüse
                      </button>
                      <button 
                        className={`filter-btn ${saisonCategoryFilter === 'fruit' ? 'active' : ''}`}
                        onClick={() => setSaisonCategoryFilter('fruit')}
                      >
                        Obst
                      </button>
                      <button 
                        className={`filter-btn ${saisonCategoryFilter === 'herb' ? 'active' : ''}`}
                        onClick={() => setSaisonCategoryFilter('herb')}
                      >
                        Kräuter
                      </button>
                    </div>
                  </div>

                  <div className="filter-group-saison">
                    <span className="filter-group-label">Anbau:</span>
                    <div className="filter-buttons">
                      <button 
                        className={`filter-btn ${saisonTypeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setSaisonTypeFilter('all')}
                      >
                        Alle
                      </button>
                      <button 
                        className={`filter-btn ${saisonTypeFilter === 'freiland' ? 'active' : ''}`}
                        onClick={() => setSaisonTypeFilter('freiland')}
                      >
                        Freiland
                      </button>
                      <button 
                        className={`filter-btn ${saisonTypeFilter === 'lager' ? 'active' : ''}`}
                        onClick={() => setSaisonTypeFilter('lager')}
                      >
                        Lagerware
                      </button>
                      <button 
                        className={`filter-btn ${saisonTypeFilter === 'geschuetzt' ? 'active' : ''}`}
                        onClick={() => setSaisonTypeFilter('geschuetzt')}
                      >
                        Gewächshaus
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of seasonal cards */}
              <div className="seasonal-grid-header">
                <h3>Saison-Ergebnisse für {monthNames[selectedMonth]} ({filteredSaisonItems.length})</h3>
              </div>
              
              <div className="seasonal-grid">
                {filteredSaisonItems.length === 0 ? (
                  <div className="empty-seasonal">
                    <Info size={40} className="text-muted" />
                    <p>Keine regionalen Produkte für diesen Monat und diese Filterkriterien gefunden.</p>
                    <button className="btn btn-secondary" onClick={() => {
                      setSaisonSearchQuery('');
                      setSaisonCategoryFilter('all');
                      setSaisonTypeFilter('all');
                    }} style={{ marginTop: '1rem' }}>
                      Filter zurücksetzen
                    </button>
                  </div>
                ) : (
                  filteredSaisonItems.map((item) => (
                    <div key={item.id} className={`seasonal-card ${item.type}-glow`}>
                      <div className="seasonal-card-header">
                        <div className="seasonal-name">{item.name}</div>
                        <span className={`seasonal-cat-badge ${item.category}`}>
                          {item.category === 'vegetable' ? 'Gemüse' : item.category === 'fruit' ? 'Obst' : 'Kräuter'}
                        </span>
                      </div>
                      
                      <div className="seasonal-type-row">
                        <span className={`seasonal-type-tag ${item.type}`}>
                          {item.type === 'freiland' ? '☀️ Frisches Freiland' : item.type === 'lager' ? '🍂 Regionale Lagerware' : '🌿 Geschützter Anbau'}
                        </span>
                      </div>

                      {item.tips && (
                        <p className="seasonal-tips">
                          <strong>Tipp:</strong> {item.tips}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* OVERLAY MODAL: DETAIL RESULT DISPLAY */}
      {activeResult && (() => {
        const { status: currentStatus, reason: currentReason } = getDynamicStatus(activeResult);
        return (
          <div className="result-backdrop" onClick={() => setActiveResult(null)}>
            <div className="result-card glass-card" style={{ padding: 0 }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header dependent on status */}
              <div className={`result-header ${currentStatus}`}>
                <button 
                  style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  onClick={() => setActiveResult(null)}
                >
                  <X size={20} />
                </button>

                <div className="result-icon-glow">
                  {currentStatus === 'hit' || currentStatus === 'hit-nestle' || currentStatus === 'hit-anthroposophy' ? <AlertTriangle size={28} /> : currentStatus === 'free' ? <CheckCircle size={28} /> : <HelpCircle size={28} />}
                </div>

                <div className="result-title">
                  {currentStatus === 'hit' ? 'Achtung: Müller-Gruppe!' : currentStatus === 'hit-nestle' ? 'Achtung: Nestlé-Konzern!' : currentStatus === 'hit-anthroposophy' ? 'Achtung: Anthroposophie!' : currentStatus === 'free' ? 'Super: Boykott-Frei!' : 'Unbekanntes Produkt'}
                </div>

                <div className="result-subtitle">
                  {currentStatus === 'hit' ? 'Dieses Produkt steht in Verbindung zu Theo Müller.' : currentStatus === 'hit-nestle' ? 'Dieses Produkt gehört zum Nestlé-Konzern.' : currentStatus === 'hit-anthroposophy' ? 'Dieses Produkt steht in Verbindung zur Anthroposophie.' : currentStatus === 'free' ? 'Keine Verbindung zu Müller, Nestlé oder Anthroposophie gefunden.' : 'Prüfung unvollständig.'}
                </div>
              </div>

              {/* Modal Body */}
              <div className="result-body">
                
                {/* Product Info Block */}
                <div className="product-details">
                  {activeResult.imageUrl ? (
                    <img src={activeResult.imageUrl} alt={activeResult.name} className="product-img" />
                  ) : (
                    <div className="product-no-img">
                      <HelpCircle size={24} />
                    </div>
                  )}
                  <div className="product-meta">
                    <div className="product-name">{activeResult.name}</div>
                    <div className="product-brand">{activeResult.brand}</div>
                    <div className="product-barcode" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      <span>EAN: {activeResult.barcode}</span>
                      {activeResult.loadedOffline && (
                        <span className="source-badge offline-source-large">⚡ Offline-Treffer (Sofort-Prüfung)</span>
                      )}
                      {activeResult.loadedFromCache && (
                        <span className="source-badge cache-source-large">💾 Aus Cache geladen</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Details / Explanation */}
                {(currentStatus === 'hit' || currentStatus === 'hit-nestle' || currentStatus === 'hit-anthroposophy') && (
                  <div className={`trigger-match-box ${currentStatus}`}>
                    <div className="trigger-title">
                      <AlertTriangle size={16} />
                      Treffer-Begründung
                    </div>
                    <p className="trigger-text">
                      <strong>{currentReason}</strong>
                    </p>
                  </div>
                )}

                {currentStatus === 'free' && (
                  <div className="safe-info-box">
                    <div className="safe-title">
                      <CheckCircle size={16} />
                      Unbedenklich
                    </div>
                    <p className="safe-text">
                      Nach unseren Datenbank-Einträgen gehört weder die Marke noch das herstellende Werk zum Konzernumfeld der aktiven Boykott-Filter (Müller / Nestlé / Anthroposophie). Du kannst dieses Produkt beruhigt einkaufen!
                    </p>
                  </div>
                )}

                {currentStatus === 'notfound' && (
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <HelpCircle size={16} className="text-cyan" />
                      Produkt fehlt in OpenFoodFacts
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.45 }}>
                      Das Produkt wurde in der weltweiten Datenbank nicht gefunden. Du kannst es selbst visuell prüfen:
                      <br /><br />
                      Suche auf der Verpackung nach dem <strong>Genusstauglichkeitskennzeichen</strong> (ovales EU-Kürzel). Wenn dort eine der folgenden Betriebsnummern steht, handelt es sich um Müller-Ware:
                      <br />
                      <code style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)', display: 'inline-block', padding: '0.2rem 0.4rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                        DE BY 718 EG | DE SN 016 EG | DE BY 103 EG | DE NW 401 EG | DE BW 033 EG
                      </code>
                    </p>
                  </div>
                )}

                {/* Alternatives grid (for hits only) */}
                {(currentStatus === 'hit' || currentStatus === 'hit-nestle' || currentStatus === 'hit-anthroposophy') && (
                  <div className="alternatives-container">
                    <h4 className="alt-title">
                      <Sparkles size={16} className="text-cyan" />
                      Empfohlene boykottfreie Alternativen:
                    </h4>
                    <div className="alt-grid">
                      {getAlternativesForProduct(activeResult).map((alt, idx) => (
                        <div key={idx} className="alt-card">
                          <div className="alt-card-header">
                            <div className="alt-name">{alt.name}</div>
                            <span className={`alt-badge ${alt.type}`}>
                              {alt.type === 'organic' ? 'Bio' : alt.type === 'regional' ? 'Regional' : alt.type === 'plant-based' ? 'Vegan' : 'Unabhängig'}
                            </span>
                          </div>
                          <p className="alt-desc">{alt.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="result-footer">
                <button className="btn btn-primary" onClick={() => setActiveResult(null)}>
                  Schließen
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* FOOTER */}
      <footer className="app-footer">
        <p>
          Paranoid Android — Für einen bewussten, demokratischen Konsum.
        </p>
        <p style={{ fontSize: '0.75rem' }}>
          Alle Daten stammen aus der kollaborativen Datenbank <a href="https://de.openfoodfacts.org" target="_blank" rel="noopener noreferrer">OpenFoodFacts</a> sowie öffentlich zugänglichen Betriebsinformationen.
        </p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
          Kein offizielles Angebot des Verbraucherschutzes. Made with <span className="app-footer-accent">♥</span> in Germany.
        </p>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-btn ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          <Camera size={20} />
          <span>Scanner</span>
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <Building2 size={20} />
          <span>Konzerne</span>
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'political' ? 'active' : ''}`}
          onClick={() => setActiveTab('political')}
        >
          <BookOpen size={20} />
          <span>Info</span>
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'saison' ? 'active' : ''}`}
          onClick={() => setActiveTab('saison')}
        >
          <Sprout size={20} />
          <span>Saison</span>
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Trophy size={20} />
          <span>Score</span>
        </button>
      </nav>
    </div>
  );
}
