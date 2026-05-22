# v1.0.0 — Erstes stabiles Mobile-Release 📱

Willkommen zur ersten offiziellen und stabilen Version der **Paranoid Android Boykott App**! 

Dieses Release bringt die Funktionalitäten des bekannten Web-Projekts `mueller-fascho-buster` als native Hybrid-App direkt in die Hosentasche. Verbraucher können ab sofort Produkte direkt im Supermarkt am Regal sekundenschnell auf ihre ethische Verträglichkeit prüfen.

---

## ✨ Die Highlights auf einen Blick

### 📸 Native Kamera-Integration
- **Live-Scanner:** Direktes Scannen von Barcodes über die Smartphone-Kamera per Knopfdruck.
- **Kamera-Berechtigung:** Sichere Abfrage der Android-Berechtigungen direkt beim ersten Aufruf der App.
- **GS1-Echtzeit-Diagnose:** Ländercode-Analyse der EAN-Barcodes direkt während der Eingabe.

### 🛡️ Pixelgenaues, scharfes App-Icon
- **Kein Verschwimmen mehr:** Das offizielle App-Icon wurde nach professionellen Android-Mipmap-Dichtespezifikationen (mdpi bis xxxhdpi) hochqualitativ skaliert.
- **Scharf auf jedem Display:** Glasklare Kanten und Antialiasing auf High-End-Displays und dem Homescreen.

### 📱 Smartphone-optimiertes Premium-Layout
- **Bottom Navigation Bar:** Eine edle, schwebende Navigationsleiste im Glassmorphism-Design sorgt für daumenfreundliche Bedienung mit nur einer Hand.
- **Bottom Sheets (iOS/Android-Style):** Analyseergebnisse gleiten sanft von unten herein, inklusive wischbarem Drag-Indicator für maximale Ergonomie.
- **Safe-Area Protection:** Voller Schutz für Notch, Kamera-Loch und den unteren System-Gestenbalken auf modernen, randlosen Smartphones.

### 💾 100% Supermarkt-tauglicher Offline-Schutz
- **Integrierte Offline-Datenbank:** Sofortige Erkennung der gängigsten Marken ganz ohne Mobilfunkempfang.
- **FIFO-Rolling-Cache:** Automatische lokale Speicherung der letzten 100 erfolgreich abgerufenen Produkte.
- **100% Datenschutz:** Alle Daten und Verläufe verbleiben verschlüsselt im lokalen Speicher (`localStorage`) des Telefons. Keinerlei Server-Logs oder Benutzer-Tracking.

### 🍏 Saison-Buster & Score-Dashboard
- **Saisonaler Filter:** Ein interaktiver Monatskalender für regionale Landwirtschaft als vollständige Alternative zu Industriegiganten.
- **Buster-Score & Erfolge:** Ein kreisförmiges, HSL-fortlaufend animiertes Scoreboard mit 6 freischaltbaren Erfolgen (z.B. *Müller-Buster*, *Nestlé-Jäger*, *Reinheitsgebot*).

---

## 🐛 Wichtige Bugfixes in v1.0.0

- **Scroll-Bug auf echten Smartphones behoben:** 
  In früheren Builds wurde das Scrollen auf echten Smartphones (insbesondere dem *Pixel 8 Pro unter der neuesten Android Beta*) durch einen CSS-Gestenkonflikt blockiert. Das Entfernen künstlicher, restriktiver Scroll-Blocker (`overscroll-behavior-y`) auf `html`/`body`-Ebene gibt der WebView wieder die volle native Android-Touch-Gestenpriorität. Das vertikale Scrollen läuft nun butterweich.

---

## 📦 Download & Installation

Laden Sie das angehängte Asset **`app-debug.apk`** direkt aus diesem Release herunter, übertragen Sie es auf Ihr Android-Smartphone und installieren Sie die App. 

*(Hinweis: Stellen Sie sicher, dass in Ihren Android-Einstellungen die Installation aus unbekannten Quellen für Ihren Dateimanager oder Browser vorübergehend erlaubt ist.)*
