---
name: run
description: Use when asked to run, start, preview, or test the QimenAPP locally. Covers dev server launch, browser verification, and test suite.
---

# Running QimenAPP

## Stack
Vite + React + TypeScript + Chakra UI — Supabase backend (Google OAuth)

## Prerequisites

`.env.local` must exist at project root with:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
File already exists at `/Users/bomac/Desktop/QImenAPP/.env.local` — do not overwrite.

## Launch Dev Server

```bash
pnpm dev --port 5173
```

- Starts at **http://localhost:5173**
- Ready in ~250ms (look for `VITE ready` in output)
- Run in background: add `&` and `sleep 3` before verifying

## Verify Running

```bash
curl -s http://localhost:5173 | head -3
```

Expected: `<!DOCTYPE html>` — if missing, server isn't up yet.

## First Screen

**LoginPage** — shows "QimenAPP" heading + "เข้าสู่ระบบด้วย Google" button.  
Google OAuth requires a real browser — use Playwright browser_navigate to http://localhost:5173 and take a screenshot to confirm.

## App Routes (after login)

| Route | Page |
|---|---|
| `/dashboard` | ผัง 9 วัง + 3 วังส่วนตัว |
| `/timing` | หาฤกษ์มงคล |
| `/profile` | โปรไฟล์ + ข้อมูล 3 วัง |
| `/onboarding` | กรอกวันเกิด (ครั้งแรก) |

## Run Tests

```bash
pnpm test
```

- All 34 tests should pass
- TZ is set automatically (`TZ=Asia/Shanghai` in package.json)
- Test suites: `QimenUtil`, `LunarUtil`, `FormatUtil`, `threePalaceCalculator`, `auspiciousScorer`

## Build Check

```bash
pnpm build
```

Output in `dist/` — chunk size warning is expected and harmless.
