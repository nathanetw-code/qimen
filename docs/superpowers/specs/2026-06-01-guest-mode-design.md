# Guest Mode — Design Spec
**Date:** 2026-06-01  
**Status:** Approved

---

## Goal

Allow anyone to use QimenAPP without logging in. Visitors enter their birthdate and immediately see their Natal Qimen Chart and 3 Palaces summary. Login is optional and unlocks saving data and finding auspicious timing (หาฤกษ์).

---

## User Flows

### Guest (not logged in)
1. Visit any URL → see **GuestPage**
2. Enter day/month/year/hour/minute/gender → tap "คำนวณดวง"
3. See results inline (same page, scroll down):
   - 八字 BAZI (4 pillars with element colors)
   - ผัง 9 วัง ณ วันเกิด (Natal Chart — frozen at birth time)
   - สรุป 3 วัง (palace number, direction, door, deity, element)
4. Login CTA banner at bottom: "เข้าสู่ระบบเพื่อบันทึก + หาฤกษ์"

### Logged-in with profile
→ Existing Dashboard (current chart + 3 palaces tabs, หาฤกษ์, โปรไฟล์)

### Logged-in without profile (first time)
→ Onboarding → Dashboard

### "เข้าสู่ระบบ" button in GuestPage
→ Triggers Google OAuth → on return:
- If profile exists → `/dashboard`
- If no profile → `/onboarding`

---

## Architecture

### New file: `src/app/pages/GuestPage.tsx`

**State:**
- `day`, `month`, `yearCE`, `hour`, `minute` — form fields (strings)
- `gender: Gender` — male/female
- `result: ThreePalaces | null` — computed natal 3 palaces (null = not yet computed)
- `natalChart: EngineChart | null` — chart at birth time (for displaying natal 9-palace grid)
- `natalBazi: [string,string,string,string] | null` — bazi from natal chart

**On "คำนวณดวง":**
```
birthDateTime = new Date(`${birthDate}T${birthTime}`)
natalChart = buildEngineChartFromDate(birthDateTime)
threePalaces = buildThreePalaces(birthDateTime, natalChart)
setNatalChart(natalChart)
setNatalBazi(natalChart.bazi)
setResult(threePalaces)
```

**Layout (single page, vertical scroll):**
1. Header bar — logo + "เข้าสู่ระบบ" button (top right)
2. Form card — day/month/year + hour/minute/gender + "คำนวณดวง" button
3. Results section (hidden until computed):
   - 八字 BAZI panel (same styling as Dashboard)
   - QimenChartGrid with `chart={natalChart}` and `highlightPalace={result.destinyPalaceNumber}`
   - 3 Palaces summary card (purple, shows direction/door/deity/element)
4. Login CTA card (gradient purple→blue)

**No bottom nav** — GuestPage has no nav bar (users are not logged in)

### Modified: `src/App.tsx`

Split current `!profile` branch into two:

```typescript
// Before (combined):
if (!profile) {
  // shows LoginPage or OnboardingPage
}

// After (split):
if (!user) {
  // Show GuestPage (no login required)
  return <BrowserRouter><Routes>
    <Route path="*" element={<GuestPage />} />
  </Routes></BrowserRouter>
}

if (!profile) {
  // Logged in but no profile → Onboarding
  return <BrowserRouter><Routes>
    <Route path="/onboarding" element={<OnboardingPage redirectTo="/dashboard" />} />
    <Route path="*" element={<Navigate to="/onboarding" replace />} />
  </Routes></BrowserRouter>
}

// Full app (unchanged)
```

### Removed: `src/app/pages/LoginPage.tsx`

LoginPage is no longer a standalone route. Login is triggered from GuestPage's header button and Login CTA banner. The file can be deleted.

---

## Components Used (existing, no changes needed)

| Component | Used for |
|---|---|
| `QimenChartGrid` | Display natal 9-palace chart |
| `buildEngineChartFromDate` | Compute natal chart |
| `buildThreePalaces` | Compute 3 palaces from natal chart |
| `signInWithGoogle` | Trigger OAuth from GuestPage |
| `DEITY_INFO`, `GATE_INFO` | Thai names for door/deity in summary |
| `STEM_COLOR`, `BRANCH_COLOR` | Bazi element colors (defined inline in GuestPage, same as Dashboard) |

---

## What stays login-only

| Feature | Guest | Logged in |
|---|---|---|
| View Natal Chart | ✅ | ✅ |
| View 八字 BAZI | ✅ | ✅ |
| View 3 Palaces summary | ✅ | ✅ |
| Save data to Supabase | ❌ | ✅ |
| View current hour chart | ❌ | ✅ (Dashboard) |
| หาฤกษ์มงคล | ❌ | ✅ |
| Profile / edit birthdate | ❌ | ✅ |

---

## Out of scope

- Guest data persistence (localStorage caching) — not needed for v1
- Sharing results — not needed for v1
- Guest → login data migration (user re-enters on Onboarding) — acceptable for v1
