# Configuratore Cestini ESA

Configurator online per cestini portarifiuti ESA. Permette di personalizzare dimensioni, colori e accessori per cestini urbani.

## 🚀 Deploy su Vercel

### Prerequisiti
- Account Vercel
- Repository Git (GitHub, GitLab, o Bitbucket)

### Passi per il Deploy

1. **Push del codice su Git**
   ```bash
   git add .
   git commit -m "Preparazione per deploy Vercel"
   git push origin main
   ```

2. **Connetti a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa il repository
   - Vercel rileverà automaticamente Next.js

3. **Configurazione Automatica**
   - Build Command: `npm run build` (già configurato)
   - Output Directory: `.next` (già configurato)
   - Install Command: `npm install` (già configurato)

4. **Deploy**
   - Clicca "Deploy"
   - Il sito sarà disponibile su `https://your-project.vercel.app`

## 🛠️ Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build di produzione
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Struttura del Progetto

```
├── app/                    # App Router di Next.js
│   ├── layout.tsx         # Layout principale
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Sitemap dinamica
│   ├── manifest.ts        # PWA manifest
│   └── viewport.ts        # Configurazione viewport
├── components/            # Componenti React
│   ├── ui/               # Componenti UI base
│   └── *.tsx             # Componenti specifici
├── hooks/                # Custom hooks
├── lib/                  # Utilities e dati
├── public/               # Asset statici
│   ├── images/           # Immagini
│   └── models/           # Modelli 3D
└── styles/               # Stili CSS
```

## 🔧 Configurazioni Ottimizzate

### Vercel
- ✅ `vercel.json` configurato
- ✅ Headers di sicurezza
- ✅ Cache ottimizzata per immagini
- ✅ Runtime Node.js 20.x

### Next.js
- ✅ Ottimizzazione immagini
- ✅ Compressione abilitata
- ✅ React Strict Mode
- ✅ Bundle analyzer supportato

### SEO
- ✅ Metadati completi
- ✅ Open Graph
- ✅ Twitter Cards
- ✅ Sitemap dinamica
- ✅ Robots.txt
- ✅ PWA manifest

### Performance
- ✅ Dipendenze con versioni fisse
- ✅ Tree shaking ottimizzato
- ✅ Code splitting automatico
- ✅ Lazy loading componenti

## 🌐 Variabili d'Ambiente

Copia `.env.example` in `.env.local` per lo sviluppo locale:

```bash
cp .env.example .env.local
```

Per Vercel, configura le variabili nel dashboard:
- `NEXT_PUBLIC_SITE_URL`: URL del sito (es. https://your-domain.vercel.app)

## 📊 Monitoraggio

- **Build Status**: Vercel Dashboard
- **Performance**: Vercel Analytics (opzionale)
- **Errors**: Console del browser / Vercel Functions logs

## 🔒 Sicurezza

- Headers di sicurezza configurati
- CSP (Content Security Policy) ready
- No secrets nel codice
- Dipendenze aggiornate

## 📱 PWA Ready

- Manifest configurato
- Service Worker ready (da implementare se necessario)
- Responsive design
- Offline support ready

## 🚨 Troubleshooting

### Build Errors
```bash
# Pulisci cache e ricostruisci
npm run clean
npm install
npm run build
```

### Type Errors
```bash
# Controlla errori TypeScript
npm run type-check
```

### Dependency Issues
```bash
# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

## 📞 Supporto

Per problemi tecnici:
1. Controlla i logs di Vercel
2. Verifica la console del browser
3. Controlla la documentazione di Next.js

---

**Ecologia Soluzione Ambiente S.p.A.**  
P.IVA IT01494430356