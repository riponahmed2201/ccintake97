# INTAKE97.COM — National Cadet College Alumni Association (Class of 1997)

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![PHPUnit Tests](https://img.shields.io/badge/Tests-48%20Passed%20(172%20assertions)-brightgreen?style=for-the-badge&logo=php&logoColor=white)](https://phpunit.de)

---

## 🏛️ Project Overview

**INTAKE97.COM** is a dedicated, institutional Alumni Association Management System (AAMS) built for the **1997 Cadet College Intake cohort** across all 12 Cadet Colleges of Bangladesh. 

Grounded in military discipline, egalitarian collegiate parity, and lifelong fraternal commitment, the platform connects senior armed forces commanders, corporate directors, diplomats, surgeons, academics, and innovators across 34 nations.

The platform is engineered with strict batch affinity verification, multi-layer role-based access control (RBAC), end-to-end audit logging, and an executive collegiate design inspired by global university alumni associations (Harvard, Oxford, and Sandhurst).

---

## 🧭 System Architecture & Three Core Interfaces

```
                           ┌───────────────────────────────┐
                           │         INTAKE97.COM          │
                           │     Central Alumni Gateway    │
                           └───────────────┬───────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  PUBLIC PORTAL   │             │  MEMBER PORTAL   │             │   ADMIN PANEL    │
│                  │             │                  │             │                  │
│ • Harvard/Oxford │             │ • Digital ID Pass│             │ • Real Analytics │
│   Clean Aesthetic│             │ • Cadet Directory│             │ • Verification   │
│ • 12 Colleges Net│             │ • Privacy Shield │             │ • Event Ticketing│
│ • Crucible Story │             │ • 1:1 Networking │             │ • Content Review │
│ • Welfare Trust  │             │ • Event Passes   │             │ • Audit History  │
│ • 2027 Reunion   │             │ • Business Hub   │             │ • RBAC Manager   │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

---

## ✨ Key Features

### 1. Public Portal & Landing Interface
* **Collegiate Design Language**: Pristine white and alabaster layout, serif typography (*Cormorant Garamond*), with subtle regimental gold and crimson accents.
* **Executive Navigation Sequence**:
  * **About** (`#about`): Historical crucible narrative, the 12 participating colleges bento grid (with established year, houses, and cadet counts), and the 27-year milestone timeline (1997–2027).
  * **Directory** (`#directory`): Cadet roll search preview, privacy shielding, and excellence across 6 core global sectors (Defense, Surgery, Tech, Diplomacy, Finance, and Law).
  * **Committee** (`#committee`): Central Executive Council leadership and stewardship profiles.
  * **Welfare & Trust** (`#welfare`): Emergency Medical Lifeline (BDT 42M+ disbursed in < 3 hours), Children's Education Trust (18 scholars supported), and national disaster relief.
  * **Businesses** (`#businesses`): Commercial directory of alumni-founded enterprises and consultancies.
  * **News** (`#news`): The Cadet Gazette, official announcements, and archival communiqués.
  * **Constitution** (`#constitution`): Non-political sovereign charter, egalitarian parity, and audited accounts.
  * **Contact** (`#contact`): Central Secretariat coordinates, regional liaison desks (North America, UK, Middle East, Australia), and message dispatcher.
  * **Grand Reunion 2027** (`#reunion`): 30-Year National Conclave pass registration, gala dinner, and assembly details.

### 2. Member Portal
* **Alumni Identity & Digital Pass**: Official encrypted QR digital member pass with central member ID (`M97-XXXX`), collegiate badge, house, and verification status.
* **Multi-Filter Alumni Directory**: Search verified batchmates by college, collegiate house, cadet roll number, current profession, city, and global chapter.
* **Four-Tier Privacy Engine**: Granular field visibility controls for phone, email, and location (`public`, `verified_members`, `connections_only`, `private`).
* **Cadet Networking & Connections**: Send connection invitations, accept/decline batchmates, and exchange mutual contact details.
* **Event Pass Management**: Interactive ticket registration, guest allocations, fee status, and attendance check-in passes.
* **Business Submissions**: Register alumni companies, consultancy services, and extend batchmate commercial privileges.

### 3. Administrative Control Panel
* **Comprehensive Dashboard**: Real database metrics (Verified Cadets, Pending Applications, Active Colleges, Revenue/Endowments, Gazette Dispatches).
* **Multi-Step Member Verification Workflow**:
  1. Registration submitted (`APP97-XXXX`).
  2. Identity verification via cadet records, college archives, or peer endorsements.
  3. Formal committee approval or rejection with audit reason.
  4. Automatic member ID assignment (`M97-XXXX`) and role elevation.
* **College Management**: Configuration of the 12 constituent cadet colleges (name, short name, established year, campus imagery, houses, and participation status).
* **Leadership & Committee Governance**: Manage executive terms, advisory board, portfolios, and historical committee archives.
* **Event Operations**: QR code event check-in scanner, registration approvals, attendee exports, and waitlists.
* **Publication & Gazette CMS**: Draft, editor review, and publication scheduling with tags and categories.
* **Role-Based Access Control (RBAC)**: 13 granular Spatie roles with 40+ permissions.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | Laravel 12.x | PHP 8.2+ enterprise backend architecture |
| **Frontend UI** | React 19.x & TypeScript | Single-Page Application (SPA) driven by Inertia.js v2 |
| **Styling & Components**| Tailwind CSS v4 & Radix UI | shadcn/ui component primitives and Lucide icons |
| **Authentication** | Laravel Fortify & Sanctum | Token & session authentication with 2FA support |
| **Authorization** | Spatie Laravel Permission | 13 pre-configured roles with strict permission matrices |
| **Databases** | MySQL 8.x / SQLite | Dual compatibility with stored procedures & fallback |
| **Sequential Identifiers**| `SequenceService` | Concurrency-safe ID generator (`M97-XXXX`, `APP97-XXXX`) |
| **Testing Suite** | PHPUnit & TypeScript compiler | 48 automated test suites with 172 assertions |

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure your local environment meets the following requirements:
* **PHP**: `>= 8.2` (with extensions: `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `curl`, `sqlite3`)
* **Composer**: `>= 2.6`
* **Node.js**: `>= 18.x` (LTS recommended) & **npm** `>= 9.x`
* **Database**: MySQL 8.0+ or SQLite 3

### 2. Clone and Setup Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/ccintake97.git
cd ccintake97

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy sample environment configuration
cp .env.example .env

# Generate unique application encryption key
php artisan key:generate
```

Edit your `.env` file to configure your database connection:

**For MySQL (Recommended for Production/Staging):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intake97
DB_USERNAME=root
DB_PASSWORD=your_password
```

**For SQLite (Local rapid development):**
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/ccintake97/database/database.sqlite
```

### 4. Database Migration & Reference Seeding
Run migrations and populate the reference databases (12 Cadet Colleges, Industries, Event Categories, Spatie Roles, and Demo Users):

```bash
# Run migrations with comprehensive seeders
php artisan migrate:fresh --seed
```

### 5. Compile Frontend Assets
```bash
# For development with Hot Module Replacement (HMR):
npm run dev

# Or build production-ready optimized bundles:
npm run build
```

### 6. Start the Local Server
```bash
php artisan serve
```
Open your browser at `http://127.0.0.1:8000`.

---

## 🔐 Seeded Accounts & Credentials

The database seeders (`ReferenceDataSeeder` and `DevSampleDataSeeder`) automatically provision test accounts for every portal role with the default password: **`password`**.

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@intake97.com` | `password` | Complete administrative, security, and audit access |
| **Verified Member** | `alpha@example.test` | `password` | FCC #97, Cadet 1001 (Full member portal & directory access) |
| **Pending Member** | `bravo@example.test` | `password` | MCC #97, Cadet 1002 (Awaiting secretariat verification) |
| **Review Member** | `charlie@example.test` | `password` | JCC #97, Cadet 1003 (Application under active review) |
| **Event Manager** | `eventmgr@example.test`| `password` | Event pass creation, attendee approvals & QR scanner |
| **Content Editor** | `editor@example.test`  | `password` | Gazette publishing, archival drafts & category management |

---

## 🧪 Verification & Testing

The platform includes full automated test coverage for registration sequences, privacy masking, directory filtering, event check-in, and administrative actions:

```bash
# Run all backend PHPUnit test suites (48 tests / 172 assertions)
php artisan test

# Verify TypeScript types
npm run types:check

# Optimize and clear application cache
php artisan optimize:clear
```

---

## 🛡️ Privacy & Compliance Architecture

The Intake '97 system enforces a strict privacy framework designed for prominent public figures and senior military personnel:
* **Directory Masking**: Direct telephone numbers, WhatsApp contact, and sensitive residential addresses are never displayed publicly.
* **Batch Affinity Guard**: Only members whose 1997 intake records are authenticated by the central review board receive directory access.
* **Audit History**: All administrative actions (approvals, suspensions, profile edits, role grants) are recorded in the immutable `activity_logs` table.

---

## 🏛️ Constituent Cadet Colleges Network

| Code | College Name | Established | Location | 1997 Induction Cohort |
| :---: | :--- | :---: | :--- | :---: |
| **FCC** | Faujdarhat Cadet College | 1958 | Chittagong | 54 Cadets |
| **JCC** | Jhenaidah Cadet College | 1963 | Khulna / Jhenaidah | 52 Cadets |
| **MCC** | Mirzapur Cadet College | 1965 | Tangail / Dhaka | 54 Cadets |
| **RCC** | Rajshahi Cadet College | 1966 | Sarda, Rajshahi | 54 Cadets |
| **SCC** | Sylhet Cadet College | 1978 | Sylhet | 52 Cadets |
| **CCR** | Rangpur Cadet College | 1979 | Rangpur | 54 Cadets |
| **BCC** | Barishal Cadet College | 1981 | Barishal | 51 Cadets |
| **PCC** | Pabna Cadet College | 1981 | Pabna | 54 Cadets |
| **MGCC**| Mymensingh Girls' Cadet College | 1982 | Mymensingh | 52 Cadets |
| **CCC** | Cumilla Cadet College | 1983 | Kotbari, Cumilla | 55 Cadets |
| **FGCC**| Feni Girls' Cadet College | 2006 | Feni | Affiliate Roll |
| **JGCC**| Joypurhat Girls' Cadet College | 2006 | Joypurhat | Affiliate Roll |

---

## 📜 Governance & License

This platform is operated by the **Central Executive Committee of INTAKE97.COM**. 

*Motto: Fidelitas et Disciplina — Class of 1997.*
All rights reserved © 2026 INTAKE97.COM.
