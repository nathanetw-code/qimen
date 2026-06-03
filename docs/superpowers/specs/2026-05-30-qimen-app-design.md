# QimenAPP — Design Spec
**Date:** 2026-05-30  
**Status:** Approved

---

## Overview

Web app สำหรับแชร์ฟรี ช่วยให้ผู้ใช้รู้จักตัวเองผ่านวิชา Qimen Dunjia (奇門遁甲) และใช้หาฤกษ์เวลาที่เหมาะสมสำหรับกิจกรรมทางจิตวิญญาณ เช่น ไหว้เจ้า สวดมนต์ นั่งสมาธิ โดยจับคู่พลังงานส่วนตัว (3 วัง) กับ Qimen chart ปัจจุบัน

**กลุ่มผู้ใช้:** คนทำ content เรื่องฮวงจุ้ย/ดวงจีน และผู้สนใจทั่วไป  
**แพลตฟอร์ม:** Web app (responsive, ใช้ได้ทั้งมือถือและคอม)  
**ค่าใช้จ่าย:** ฟรี  

---

## Core Concept: วิชา 3 วัง (Trinity of Luck)

ระบบวิเคราะห์ดวงชะตาส่วนตัวจาก **Qimen Natal Chart** (ผังเวลาเกิด) โดยหา 3 วังสำคัญ:

| วัง | วิธีหา | บอกอะไร |
|-----|--------|---------|
| **วังโชคชะตา** | วังที่มี Day Stem (กิ่งฟ้าวันเกิดจาก BaZi) อยู่ใน Heaven Plate | ธาตุ, ตัวตน, พื้นดวง |
| **วังประตู** | ประตูที่อยู่ในวังโชคชะตา | แนวทางชีวิต, Man Luck |
| **วังเทพ** | วังที่ 值符 (Zhi Fu) สถิตอยู่ | เทพประจำตัว, Spirit Luck |

**หมายเหตุ:** เพศมีผลต่อการคำนวณ BaZi (ทิศการเดิน 大運):
- ชาย + ปีหยาง หรือ หญิง + ปีหยิน → เดินหน้า (順)
- ชาย + ปีหยิน หรือ หญิง + ปีหยาง → ย้อนหลัง (逆)

### เทพ 8 องค์และความหมาย

| เทพ | ชื่อ | พลังพิเศษ |
|-----|------|-----------|
| 值符 | Chief (จื๋อฟู) | มงคลสุด, ดึงดูด 10x, คุ้มครอง |
| 九天 | Nine Heavens | วิสัยทัศน์, Manifestation, ต่างแดน |
| 六合 | Harmony | ทีม, พาร์ทเนอร์, การเชื่อมโยง |
| 太陰 | Moon | ความรู้, เบื้องหลัง, วางแผน, สมาธิ |
| 九地 | Nine Earth | สะสมทรัพย์, เยียวยา, มั่นคง |
| 玄武 | Black Tortoise | สัญชาตญาณ, อ่านใจ |
| 白虎 | White Tiger | ความกล้า, แรงกดดัน |
| 腾蛇 | Surging Snake | Timing, จังหวะ |

---

## Architecture

```
anthonylee1994/qimen (fork — MIT License)
├── [ใช้ต่อ] Core Engine
│     ├── lunar-typescript (lunar calendar)
│     ├── BaZi calculation (八字)
│     ├── Qimen Hour Chart generator
│     └── Nine Stars / Eight Gates / Eight Spirits / Stems
│
└── [สร้างใหม่] QimenAPP Layer
      ├── auth/           — Google OAuth / email login
      ├── profile/        — User data (birthdate, time, gender)
      ├── palaces/        — 3 Palace Calculator
      ├── scorer/         — Auspicious Hour Scorer
      ├── pages/
      │     ├── Onboarding
      │     ├── Dashboard
      │     ├── AuspiciousTiming (หาฤกษ์)
      │     └── Profile
      └── api/            — Backend endpoints (user data persistence)
```

### Tech Stack
- **Frontend:** TypeScript + React 18 + Vite
- **UI:** Chakra UI (ใช้ต่อจาก base repo)
- **Auth:** Supabase Auth (Google OAuth + email)
- **Database:** Supabase (PostgreSQL) — เก็บ user profile
- **Deploy:** Vercel (frontend) + Supabase (backend)
- **Base Engine:** fork จาก `anthonylee1994/qimen`

### Extension Strategy
สร้าง layer แยกต่างหากที่ `import` engine เดิม ไม่แก้ core files — ทำให้ merge upstream ได้ง่าย:

```typescript
// palaces/threePalaceCalculator.ts
import { QimenChart } from '../engine/QimenUtil'

export function findDestinyPalace(dayStem: Stem, natalChart: QimenChart): Palace
export function findDoorPalace(destinyPalace: Palace): Door
export function findDeityPalace(natalChart: QimenChart): { palace: Palace; deity: Deity }
```

---

## หน้าหลัก 4 หน้า

### 1. Onboarding / Login
- สมัคร/Login ด้วย Google OAuth หรือ email
- กรอกข้อมูลครั้งแรก: วันเดือนปีเกิด + เวลาเกิด + เพศ
- คำนวณ 3 วัง → แสดง personal profile summary
- บันทึกลง Supabase

### 2. Dashboard (หน้าหลัก)
แสดงทุกอย่างในหน้าเดียว:

```
┌─────────────────────────────────────┐
│  Qimen Chart ปัจจุบัน               │
│  (อัปเดตทุก 2 ชั่วโมง)              │
├─────────────────────────────────────┤
│  Qimen Destiny Chart ของคุณ          │
│  (natal chart จากเวลาเกิด)           │
├──────────────────┬──────────────────┤
│  ทิศประจำตัว     │  เทพประจำตัว      │
│  (วังโชคชะตา)    │  (ชื่อ + ความหมาย) │
└──────────────────┴──────────────────┘
```

### 3. หาฤกษ์ (Auspicious Timing Search)
Search interface คล้าย Chinese Metasoft QMDJ Search:

**Input filters:**
- กิจกรรม: ไหว้เจ้า / สวดมนต์ / นั่งสมาธิ / เปิดกิจการ / อื่นๆ
- ช่วงวันที่: From / To (date picker)
- ช่วงเวลา: เช้า / บ่าย / เย็น / ทั้งวัน
- หลีกเลี่ยง Void: Yes / No
- ระดับ: ดีมาก / ดี / พอได้

**Logic การ match:**
ผลลัพธ์กรองเฉพาะชั่วโมงที่ตรงกับทิศ + เทพประจำตัวของผู้ใช้

**Scoring per hour:**
| เงื่อนไข | คะแนน |
|---------|-------|
| Open Door (ไหว้เจ้า) หรือ Rest Door (สมาธิ) | +3 |
| Nine Heavens หรือ Chief deity | +2 |
| Heavenly Heart star | +2 |
| Stem combo 丁+乙 (Heavenly Flourish) | +3 |
| Divine Veil (Tinka) formation | +5 |
| ตรงกับทิศวังโชคชะตา (v1 ใช้วังนี้เป็นหลัก) | +2 |
| มี Void | -5 |
| Fuyin chart | -3 |

**Output:** รายการชั่วโมงดีเรียงตามคะแนน พร้อม badge และทิศของวังโชคชะตาที่ควรหัน

### 4. Profile
- ดู/แก้ไขข้อมูลส่วนตัว
- แสดง 3 วัง summary: ธาตุ, ประตู, เทพ + คำอธิบาย
- Log out

---

## Data Model

```typescript
// Supabase: users table
interface UserProfile {
  id: string               // Supabase auth user ID
  birthDate: string        // YYYY-MM-DD
  birthTime: string        // HH:MM (24h)
  gender: 'male' | 'female'
  // Computed & cached:
  dayStem: Stem
  destinyPalace: number    // 1-9
  destinyDoor: Door
  destinyDeity: Deity
  destinyDirection: Direction
  createdAt: string
}
```

---

## Auspicious Timing Logic

### กิจกรรม → เงื่อนไขหลัก
| กิจกรรม | ประตูดี | เทพดี | ดาวดี |
|---------|---------|-------|-------|
| ไหว้เจ้า | Open Door | Nine Heavens, Chief | Heavenly Heart |
| สวดมนต์ | Open Door | Nine Heavens, Moon | Heavenly Assistant |
| นั่งสมาธิ | Rest Door | Moon, Nine Heavens | — |
| ทั่วไป | Open, Rest, Life | Chief | Heavenly Heart |

### Special Formations (bonus)
- **Tinka (Divine Veil):** Yi Wood + Scenery Door + Nine Heavens → +5
- **Alternative Veil:** Yi Wood + Moon deity + Heart Star → +4
- **Green Dragon Returns:** 戊+丙 → +3
- **Heavenly Flourish:** 丁+乙 → +3 (ดีมากสำหรับอธิษฐาน)

### ข้อหลีกเลี่ยง
- วัง Void/Emptiness → -5 (พลังหมด)
- Fuyin chart → -3 (ไม่ดีสำหรับเริ่มใหม่)
- ธาตุวังพิฆาตธาตุวันเกิด → -2

---

## Agent Breakdown (Implementation)

| Agent | หน้าที่ | Skills |
|-------|---------|--------|
| A | Fork repo + setup Supabase + config | get-shit-done |
| B | 3 Palace Calculator (gender-aware BaZi + 3 วัง) | get-shit-done |
| C | Auspicious Hour Scorer + activity tagging | get-shit-done |
| D | UI — Onboarding + Login + Profile page | gstack + frontend |
| E | UI — Dashboard (current chart + natal chart + ทิศ/เทพ) | gstack + frontend |
| F | UI — หาฤกษ์ (search + filters + results) | gstack + frontend |

Agents B และ C ทำงานใน worktree แยก สามารถ run parallel กับ D-F ได้หลัง Agent A เสร็จ

---

## Out of Scope (v1)

- Push notification แจ้งเตือนฤกษ์
- Multi-language (เริ่มด้วยภาษาไทยก่อน)
- Da Liu Ren, Zi Wei, หรือระบบอื่น
- Paid features
- Mobile app (iOS/Android native)
