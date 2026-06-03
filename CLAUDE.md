# QimenAPP Project

## Stack
Vite + React + TypeScript, Chakra UI, Supabase (auth + DB), Vercel, Playwright MCP

## Key Files
- `src/App.tsx` — Root router + auth gate (loading → guest/onboarding/dashboard)
- `src/app/hooks/useUserProfile.ts` — Supabase auth + profile load (has 8s timeout)
- `src/app/lib/supabase.ts` — Supabase client (env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- `src/app/lib/auth.ts` — signInWithGoogle, loadUserProfile, saveUserProfile
- `src/app/components/QimenChartGrid.tsx` — 9-palace grid UI
- `src/app/pages/` — GuestPage, OnboardingPage, DashboardPage, ProfilePage, AuspiciousTimingPage
- `src/util/QmPatternTranslation.ts` — 81 stem combinations (天盤干+地盤干 → nameEn/nameTh/descTh)
- `src/app/types.ts` — DEITY_INFO, GATE_INFO, STAR_INFO, STEM_ELEMENT (อย่าแก้ nameThai ในนี้)
- `src/qimen/dictionary.ts` — ข้อมูลเทพหลัก

## commit ล่าสุด (38d6952)
- เพิ่ม loading spinner (purple) แทน `return null` ตอน auth init
- เพิ่ม 8s timeout ใน useUserProfile ป้องกัน Supabase ค้าง
- QimenChartGrid แสดง nameTh ของ stem combination ทุก palace พร้อม Tooltip
- QmPatternTranslation: 81 nameTh ใหม่สไตล์กำลังภายใน + 4 canonical names แก้แล้ว

## Supabase
- Project: wpndzlzwozwviacxaoxp.supabase.co
- Table: user_profiles (id, birth_date, birth_time, gender, destiny_palace_number, ...)
- Auth: Google OAuth (redirect to /dashboard after login)
- Vercel env vars: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (set 3d ago, Production only)

## Deploy
- `npm run build` → `dist/` → `npx vercel --prod`
- Vercel ไม่ auto-deploy จาก GitHub push — ต้อง run CLI ด้วยมือ
- Service Worker (PWA/Workbox) อาจ cache bundle เก่า → ถ้าหน้าขาวให้ Incognito หรือ clear SW

## งานที่ยังค้าง
- ตรวจสอบ dictionary.ts ให้ครบทุกเทพ
- Tooltip บน mobile (hover ไม่ทำงาน touch) → ต้องทำ tap-to-show modal
- หาสาเหตุที่ loadUserProfile ใช้เวลานาน / ตรวจ Supabase RLS policy
