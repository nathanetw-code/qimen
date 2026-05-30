# Deployment Guide — QimenAPP

This guide covers deploying QimenAPP to production using Supabase (database + auth) and Vercel (hosting).

---

## Prerequisites

- GitHub account with access to `nathanetw-code/qimen`
- Supabase account (https://supabase.com) — free tier works
- Vercel account (https://vercel.com) — free tier works

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **New project**
3. Choose a name (e.g. `qimen-prod`) and a strong database password
4. Select the region closest to your users
5. Wait ~2 minutes for the project to provision

### 1.2 Run the Database Migration

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase/migrations/001_user_profiles.sql` from this repo
4. Paste the contents into the SQL Editor
5. Click **Run** — you should see "Success"

### 1.3 Enable Google OAuth

1. In Supabase, go to **Authentication → Providers**
2. Find **Google** and toggle it ON
3. You will need a Google OAuth client:
   - Go to https://console.cloud.google.com
   - Create a project (or use an existing one)
   - Enable the **Google+ API** or **People API**
   - Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add your Supabase callback URL as an Authorized redirect URI:
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
4. Paste the Client ID and Secret back in Supabase → Authentication → Providers → Google
5. Save

### 1.4 Get Your Supabase Credentials

1. In Supabase, go to **Settings → API**
2. Copy the following values — you will need them in Step 2:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **Project API Keys → anon / public** key

### 1.5 (Optional) Local Development Setup

Create or update `/Users/bomac/Desktop/QImenAPP/.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Run locally: `pnpm dev`

---

## Step 2: Deploy to Vercel

### 2.1 Import the Repository

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Connect your GitHub account if not already connected
4. Find and select **nathanetw-code/qimen**
5. Click **Import**

### 2.2 Configure the Project

On the configuration screen:

- **Framework Preset:** Vercel should auto-detect **Vite** — confirm this
- **Root Directory:** leave as `.` (project root)
- **Build Command:** `pnpm build` (or `vite build`)
- **Output Directory:** `dist`

### 2.3 Add Environment Variables

Still on the configuration screen, expand **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL from Step 1.4 |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 1.4 |

Click **Deploy**. Wait ~1–2 minutes for the build to complete.

### 2.4 Note Your Vercel URL

After deployment, Vercel assigns a URL like:
`https://qimen-xxxx.vercel.app`

You can also add a custom domain in **Vercel → Settings → Domains**.

---

## Step 3: Post-Deploy Configuration

### 3.1 Update Supabase URL Configuration

This step is **required** for OAuth login to work in production.

1. In Supabase, go to **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel production URL:
   `https://qimen-xxxx.vercel.app`
3. Under **Redirect URLs**, add all the following:
   ```
   https://qimen-xxxx.vercel.app
   https://qimen-xxxx.vercel.app/**
   http://localhost:5173
   http://localhost:5173/**
   ```
4. Click **Save**

### 3.2 Update Google OAuth Redirect URI

1. Go back to Google Cloud Console → Credentials → your OAuth client
2. Add your Vercel URL as an Authorized redirect URI:
   `https://qimen-xxxx.vercel.app`
3. Also add the Supabase callback URL if not already there:
   `https://your-project-ref.supabase.co/auth/v1/callback`
4. Save

---

## Step 4: Test the Production Deployment

1. Open your Vercel URL in a browser
2. Click **Login with Google**
3. Complete the Google OAuth flow
4. Confirm you land on the Onboarding or Dashboard page
5. Fill in your birth date and save — confirm it persists on page reload
6. Test the Auspicious Timing and other pages

---

## Redeployment

Every `git push` to `master` will automatically trigger a new Vercel deployment (Vercel's GitHub integration handles this).

To deploy manually from the CLI, install the Vercel CLI first:

```bash
pnpm add -g vercel
vercel login
vercel --prod
```

---

## Troubleshooting

**Login redirects to wrong URL after OAuth**
→ Double-check Supabase → Authentication → URL Configuration → Redirect URLs includes your Vercel URL.

**"Invalid API key" errors in browser console**
→ Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly in Vercel → Settings → Environment Variables. Redeploy after changing them.

**Build fails on Vercel**
→ Check that the build command is `pnpm build` and the output directory is `dist`. Vercel may default to `npm run build` — override if needed.

**Google OAuth: "redirect_uri_mismatch" error**
→ The exact Vercel URL must be in Google Cloud Console → OAuth client → Authorized redirect URIs.
