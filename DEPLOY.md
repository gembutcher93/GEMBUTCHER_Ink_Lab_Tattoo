# 🚀 Deploy Guide — GemButcher

Deploy completo del sito a **~zero costi** usando:

- **Frontend** → Cloudflare Pages (gratis, banda illimitata)
- **Backend** → Railway (~5$/mese hobby) o **Render.com** (gratis con cold-start)
- **Database** → MongoDB Atlas M0 (gratis per sempre, 512 MB)
- **DNS/Dominio** → Cloudflare (gratis; dominio ~10€/anno)
- **Codice** → GitHub (gratis)

Costo totale: **~5-10€/anno solo per il dominio** (se usi Render free per il backend).

---

## STEP 0 · Push del codice su GitHub

Dalla tua macchina locale (dopo aver scaricato il progetto da Emergent):

```bash
cd /path/to/gembutcher
git init
git add .
git commit -m "initial commit"
gh repo create gembutcher --private --source=. --push
# oppure crea manualmente il repo su github.com e:
# git remote add origin https://github.com/TUOUSER/gembutcher.git
# git branch -M main
# git push -u origin main
```

---

## STEP 1 · MongoDB Atlas (database gratis)

1. Vai su https://mongodb.com/cloud/atlas → crea account
2. Crea nuovo cluster → seleziona **M0 (FREE)** → regione **EU (Frankfurt o Ireland)**
3. Nome cluster: `gembutcher`
4. **Database Access** → crea utente: username `gembutcher`, password (generane una robusta e salvala)
5. **Network Access** → Add IP → `0.0.0.0/0` (permetti da ovunque, il DB è già protetto da user/password)
6. Torna al cluster → **Connect** → **Drivers** → copia la **connection string**, sarà tipo:
   ```
   mongodb+srv://gembutcher:<password>@gembutcher.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Sostituisci `<password>` con quella vera. **Salvala**, ti serve dopo.

---

## STEP 2 · Backend su Railway (~5$/mese) o Render (gratis)

### Opzione A · Railway (raccomandato se OK con 5$/mese)

1. Vai su https://railway.app → login con GitHub
2. **New Project** → **Deploy from GitHub repo** → seleziona `gembutcher`
3. Railway rileva 2 cartelle. Clicca "Configure" e imposta:
   - **Root Directory**: `backend`
   - **Start Command**: (lascia vuoto, il Procfile lo gestisce)
4. **Settings** → **Variables** → aggiungi TUTTE queste env variables:
   ```
   MONGO_URL = mongodb+srv://gembutcher:PASSWORD@...    (dal step 1)
   DB_NAME = gembutcher
   CORS_ORIGINS = https://gembutcher.pages.dev,https://gembutcher.com
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = gembutcher93@gmail.com
   SMTP_PASSWORD = djga sywq adnh xkpd
   NOTIFY_EMAIL = gembutcher93@gmail.com
   ```
5. **Settings** → **Networking** → **Generate Domain** → Railway ti dà un URL tipo:
   ```
   https://gembutcher-production.up.railway.app
   ```
   **Salvalo**, ti serve dopo.
6. Verifica: apri `https://gembutcher-production.up.railway.app/api/` — deve rispondere JSON.

### Opzione B · Render.com (gratis, cold-start ~30s dopo 15min inattività)

1. Vai su https://render.com → login con GitHub
2. **New +** → **Web Service** → connetti repo `gembutcher`
3. Configurazione:
   - **Name**: `gembutcher-api`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
4. **Environment** → aggiungi le stesse env variables dell'opzione A
5. Deploy → dopo ~5 minuti hai un URL tipo `https://gembutcher-api.onrender.com`

⚠️ **Nota Render Free**: dopo 15 minuti di inattività il servizio si "addormenta". Al primo click di un visitatore dopo il sonno ci vogliono ~30 secondi per svegliarsi. Per un tatuatore con traffico moderato è accettabile.

---

## STEP 3 · Frontend su Cloudflare Pages (gratis)

1. Vai su https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Autorizza Cloudflare a leggere GitHub → seleziona repo `gembutcher`
3. Configurazione build:
   - **Project name**: `gembutcher`
   - **Production branch**: `main`
   - **Framework preset**: **Create React App**
   - **Build command**: `yarn build`
   - **Build output directory**: `build`
   - **Root directory (Advanced)**: `frontend`
   - **Environment variables**:
     ```
     REACT_APP_BACKEND_URL = https://gembutcher-production.up.railway.app
     NPM_FLAGS = --legacy-peer-deps
     NODE_VERSION = 20
     ```
     (usa l'URL del backend dallo step 2. Il flag `NPM_FLAGS` evita conflitti di peer dependencies durante il build.)
4. **Save and Deploy** → attendi ~2 minuti
5. Il sito è online su: `https://gembutcher.pages.dev`

---

## STEP 4 · Torna al backend e aggiorna CORS

Ora che sai l'URL del frontend Cloudflare, torna su Railway/Render e:

1. **Variables** → modifica `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://gembutcher.pages.dev
   ```
2. Il servizio si ridiploya automaticamente (~30 secondi)

Verifica che tutto funzioni:
- Apri `https://gembutcher.pages.dev` dal browser
- Prova il form di prenotazione — deve arrivare email
- Verifica il preventivo rapido → prenotazione (banner deve apparire)

---

## STEP 5 · Dominio custom (opzionale, ~10€/anno)

Se vuoi `gembutcher.com` invece di `gembutcher.pages.dev`:

1. Su Cloudflare → **Registrar** → **Register Domains** → cerca `gembutcher.com` (o quello che vuoi)
2. Acquistalo (~9€/anno, senza margine come su altri registrar)
3. Torna a **Pages** → tuo progetto → **Custom domains** → **Set up a custom domain** → `gembutcher.com`
4. Cloudflare configura automaticamente DNS + SSL (2-5 minuti)
5. **Aggiorna 2 cose**:
   - Su Railway/Render: `CORS_ORIGINS = https://gembutcher.com,https://gembutcher.pages.dev`
   - Su `/frontend/public/index.html`: sostituisci `gembutcher.com` nei meta OG/canonical se il dominio è diverso

---

## ⚙️ File di configurazione già preparati

Ho creato per te:

- **`backend/Procfile`** — dice a Railway/Render come avviare il server (`uvicorn server:app --host 0.0.0.0 --port $PORT`)
- **`backend/runtime.txt`** — pinna la versione Python a 3.11.9 (evita che Railway/Render usino una versione non compatibile con le tue dipendenze)

**Non toccare**: `frontend/.env`, `backend/.env` — quelli sono solo per lo sviluppo locale. In produzione le env variables le imposti nei pannelli di Railway/Cloudflare.

---

## 🔍 Troubleshooting

### "Preflight CORS error" quando il frontend chiama il backend
→ Su Railway/Render controlla che `CORS_ORIGINS` contenga l'URL Cloudflare **senza slash finale** e senza spazi. Riavvia il servizio.

### "MongoDB connection timeout"
→ Su Atlas verifica Network Access: deve esserci `0.0.0.0/0` per permettere a Railway di connettersi.

### Il preventivo si apre ma le email non arrivano
→ Verifica su Railway le env `SMTP_*`. La password Gmail deve essere una "App Password" (non la tua password Gmail normale). Genera nuova app password su https://myaccount.google.com/apppasswords se necessario.

### Build Cloudflare fallisce
→ Controlla che sotto **Framework preset** ci sia "Create React App" e che il **Root Directory** sia `frontend`. Se ancora fallisce, verifica il log di build.

### Backend Render dorme sempre / troppo lento
→ Passa a Railway (~5$/mese, no cold start) o setta un servizio esterno tipo cron-job.org che pinga `/api/` ogni 10 minuti per tenerlo sveglio.

---

## 💰 Riepilogo costi annuali

| Servizio | Costo |
|---|---|
| GitHub (private repo) | 0€ |
| MongoDB Atlas M0 | 0€ |
| Cloudflare Pages | 0€ |
| Backend Render Free | 0€ (con cold-start) |
| Backend Railway Hobby | ~60€/anno (no cold-start) |
| Dominio `.com` | ~10€/anno |
| **Totale Render** | **~10€/anno** |
| **Totale Railway** | **~70€/anno** |

Rispetto a 120€/anno di Emergent, risparmi il 40-90% mantenendo controllo totale del codice.
