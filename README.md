# NiftyPulse AI - Indian Market & Algo Platform

An intelligent Indian stock and options trading terminal designed for beginners and algorithmic traders. Features real-time pre-market scanners (9:00 AM discovery), live growing shares radar with instant buy/sell target alerts, TradingView advanced charts, options chain scalper, multi-broker integration (Zerodha, Groww, Angel One, Upstox, etc.), and paper demo trading.

---

## Deploy to Netlify via GitHub (Step-by-Step)

This repository is pre-configured with `netlify.toml` and `@netlify/plugin-nextjs` for 1-click deployment.

### Step 1: Push your Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit of NiftyPulse AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Connect GitHub Repository to Netlify
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** and authorize access.
4. Select your **NiftyPulse AI** repository.

### Step 3: Configure Build & Environment Settings
Netlify will automatically detect the settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Next.js Runtime**: Automatically handled by `@netlify/plugin-nextjs`

Under **"Environment variables"**, add:
- `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.

Click **"Deploy site"** and your platform will be live with a custom HTTPS URL!

---

## Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
