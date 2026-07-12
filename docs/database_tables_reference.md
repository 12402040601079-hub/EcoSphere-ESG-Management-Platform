# EcoSphere — Complete Database Tables Reference

Every table in the project, laid out like an Excel sheet. Each section tells you **who fills it**.

---

## 🔑 Legend

| Symbol | Meaning |
|---|---|
| **PK** | Primary Key |
| **FK** | Foreign Key (links to another table) |
| **UQ** | Unique Constraint |
| **NN** | Not Null (required) |
| **AUTO** | System auto-generates this value |
| 🟢 | Filled by **Employee** |
| 🔵 | Filled by **Manager / Dept Head** |
| 🔴 | Filled by **Admin** |
| ⚙️ | Filled by **System / Background Job** |

---

# SECTION A: MASTER / CONFIGURATION TABLES

> These tables are set up **once** by Admins. Employees never touch these.

---

## Table 1: `Organization` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `a1b2c3d4-...` | ⚙️ System |
| name | VARCHAR(255) | NN, UQ | `GreenCorp Industries` | 🔴 Admin |
| industry | VARCHAR(100) | NN | `Manufacturing` | 🔴 Admin |
| country | VARCHAR(100) | NN | `India` | 🔴 Admin |
| logo_url | VARCHAR(500) | | `/uploads/logo.png` | 🔴 Admin |
| auto_emission_calc | BOOLEAN | NN, DEFAULT false | `true` | 🔴 Admin |
| created_at | TIMESTAMP | NN, AUTO | `2026-01-15 09:00:00` | ⚙️ System |
| updated_at | TIMESTAMP | NN, AUTO | `2026-07-10 14:30:00` | ⚙️ System |

---

## Table 2: `Department` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `d5e6f7g8-...` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| parent_department_id | UUID | FK → Department (self) | `NULL` (top-level) | 🔴 Admin |
| name | VARCHAR(255) | NN | `Operations` | 🔴 Admin |
| code | VARCHAR(50) | UQ, NN | `OPS-001` | 🔴 Admin |
| head_user_id | UUID | FK → User | `u1234-...` | 🔴 Admin |
| created_at | TIMESTAMP | NN, AUTO | `2026-01-15 09:00:00` | ⚙️ System |

**Example Rows:**

| id | name | parent_department_id | code | head_user_id |
|---|---|---|---|---|
| `dept-001` | `Operations` | `NULL` | `OPS` | `user-mgr-01` |
| `dept-002` | `Fleet Management` | `dept-001` | `OPS-FLEET` | `user-mgr-02` |
| `dept-003` | `Human Resources` | `NULL` | `HR` | `user-mgr-03` |

---

## Table 3: `User` 🔴 Admin creates, 🟢 Employee updates profile

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `u9876-...` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| department_id | UUID | FK → Department, NN | `dept-002` | 🔴 Admin |
| email | VARCHAR(255) | UQ, NN | `ravi@greencorp.com` | 🔴 Admin |
| password_hash | VARCHAR(255) | NN | `$2b$10$...` | ⚙️ System |
| first_name | VARCHAR(100) | NN | `Ravi` | 🟢 Employee |
| last_name | VARCHAR(100) | NN | `Sharma` | 🟢 Employee |
| role | ENUM | NN | `EMPLOYEE` | 🔴 Admin |
| avatar_url | VARCHAR(500) | | `/avatars/ravi.jpg` | 🟢 Employee |
| xp_total | INTEGER | NN, DEFAULT 0 | `450` | ⚙️ System |
| points_balance | INTEGER | NN, DEFAULT 0 | `120` | ⚙️ System |
| is_active | BOOLEAN | NN, DEFAULT true | `true` | 🔴 Admin |
| last_login_at | TIMESTAMP | | `2026-07-12 08:00:00` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-03-01 09:00:00` | ⚙️ System |

**Role ENUM values:** `SUPER_ADMIN`, `ADMIN`, `DEPARTMENT_HEAD`, `MANAGER`, `EMPLOYEE`

---

## Table 4: `EmissionFactor` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ef-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| activity_type | ENUM | NN | `FLEET_TRAVEL` | 🔴 Admin |
| fuel_type | ENUM | NN | `DIESEL` | 🔴 Admin |
| factor_value | DECIMAL(10,4) | NN | `0.2700` | 🔴 Admin |
| unit_numerator | VARCHAR(20) | NN | `kg CO₂` | 🔴 Admin |
| unit_denominator | VARCHAR(20) | NN | `km` | 🔴 Admin |
| scope | ENUM | NN | `SCOPE_1` | 🔴 Admin |
| source | VARCHAR(255) | | `IPCC 2024 Guidelines` | 🔴 Admin |
| effective_from | DATE | NN | `2026-01-01` | 🔴 Admin |
| effective_to | DATE | | `NULL` (still active) | 🔴 Admin |

**Example Rows (what Admin pre-fills):**

| activity_type | fuel_type | factor_value | unit | scope | source |
|---|---|---|---|---|---|
| `FLEET_TRAVEL` | `DIESEL` | `0.2700` | `kg CO₂ / km` | `SCOPE_1` | `IPCC 2024` |
| `FLEET_TRAVEL` | `PETROL` | `0.2300` | `kg CO₂ / km` | `SCOPE_1` | `IPCC 2024` |
| `ELECTRICITY` | `GRID` | `0.8200` | `kg CO₂ / kWh` | `SCOPE_2` | `CEA India 2025` |
| `BUSINESS_TRAVEL` | `AVIATION` | `0.2550` | `kg CO₂ / km` | `SCOPE_3` | `DEFRA 2025` |
| `WASTE` | `LANDFILL` | `0.5867` | `kg CO₂ / kg` | `SCOPE_3` | `EPA 2024` |

---

## Table 5: `ESGConfiguration` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `cfg-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, UQ, NN | `a1b2c3d4-...` | ⚙️ System |
| env_weight | DECIMAL(3,2) | NN, CHECK (0-1) | `0.40` | 🔴 Admin |
| social_weight | DECIMAL(3,2) | NN, CHECK (0-1) | `0.30` | 🔴 Admin |
| gov_weight | DECIMAL(3,2) | NN, CHECK (0-1) | `0.30` | 🔴 Admin |
| scoring_method | ENUM | NN | `WEIGHTED_AVERAGE` | 🔴 Admin |
| recalc_frequency | ENUM | NN | `DAILY` | 🔴 Admin |

**Constraint:** `env_weight + social_weight + gov_weight = 1.00`

---

## Table 6: `ESGPolicy` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `pol-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| title | VARCHAR(255) | NN | `Anti-Bribery Policy` | 🔴 Admin |
| description | TEXT | NN | `This policy outlines...` | 🔴 Admin |
| category | ENUM | NN | `GOVERNANCE` | 🔴 Admin |
| version | VARCHAR(20) | NN | `v2.0` | 🔴 Admin |
| document_url | VARCHAR(500) | NN | `/policies/anti-bribery-v2.pdf` | 🔴 Admin |
| effective_date | DATE | NN | `2026-07-01` | 🔴 Admin |
| requires_acknowledgement | BOOLEAN | NN, DEFAULT true | `true` | 🔴 Admin |
| created_at | TIMESTAMP | NN, AUTO | `2026-06-25 10:00:00` | ⚙️ System |

---

## Table 7: `Category` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `cat-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| name | VARCHAR(100) | NN | `Tree Planting` | 🔴 Admin |
| type | ENUM | NN | `CSR_ACTIVITY` | 🔴 Admin |
| points_per_hour | INTEGER | NN, DEFAULT 5 | `5` | 🔴 Admin |
| is_active | BOOLEAN | NN, DEFAULT true | `true` | 🔴 Admin |

**Type ENUM:** `CSR_ACTIVITY`, `CHALLENGE`, `ENVIRONMENTAL`, `GOVERNANCE`

---

## Table 8: `Badge` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `badge-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| name | VARCHAR(100) | NN | `Green Warrior` | 🔴 Admin |
| description | VARCHAR(500) | NN | `Awarded for 500+ XP` | 🔴 Admin |
| icon_url | VARCHAR(500) | NN | `/badges/green-warrior.svg` | 🔴 Admin |
| tier | ENUM | NN | `GOLD` | 🔴 Admin |
| unlock_rule | JSONB | NN | `{"type":"xp_threshold","value":500}` | 🔴 Admin |
| xp_reward | INTEGER | NN, DEFAULT 0 | `50` | 🔴 Admin |

**Example unlock_rule variations:**

| Badge Name | unlock_rule JSON |
|---|---|
| First Steps | `{"type": "first_csr_participation"}` |
| Green Warrior | `{"type": "xp_threshold", "value": 500}` |
| Marathon Volunteer | `{"type": "csr_hours_total", "value": 50}` |
| Policy Champion | `{"type": "policies_acknowledged", "value": 10}` |
| Carbon Cutter | `{"type": "carbon_reduced_kg", "value": 1000}` |

---

## Table 9: `Reward` 🔴 Admin

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `rew-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| name | VARCHAR(255) | NN | `₹500 Amazon Gift Card` | 🔴 Admin |
| description | TEXT | | `Redeemable gift card...` | 🔴 Admin |
| image_url | VARCHAR(500) | | `/rewards/amazon-gc.png` | 🔴 Admin |
| points_cost | INTEGER | NN | `200` | 🔴 Admin |
| stock | INTEGER | NN, CHECK (≥ 0) | `50` | 🔴 Admin |
| is_active | BOOLEAN | NN, DEFAULT true | `true` | 🔴 Admin |

---

# SECTION B: TRANSACTIONAL TABLES

> These are filled by **Employees** and **Managers** during daily operations.

---

## Table 10: `CarbonTransaction` 🟢 Employee enters, ⚙️ System calculates

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ct-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| department_id | UUID | FK → Department, NN | `dept-002` | ⚙️ System (from user) |
| recorded_by_user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System (logged-in user) |
| emission_factor_id | UUID | FK → EmissionFactor, NN | `ef-001` | ⚙️ System (auto-matched) |
| activity_type | ENUM | NN | `FLEET_TRAVEL` | 🟢 Employee |
| fuel_type | ENUM | NN | `DIESEL` | 🟢 Employee |
| quantity | DECIMAL(12,4) | NN | `500.0000` | 🟢 Employee |
| unit | ENUM | NN | `KM` | 🟢 Employee |
| carbon_kg | DECIMAL(12,4) | NN | `135.0000` | ⚙️ System (calculated) |
| scope | ENUM | NN | `SCOPE_1` | ⚙️ System (from factor) |
| activity_date | DATE | NN | `2026-07-10` | 🟢 Employee |
| proof_url | VARCHAR(500) | | `/proofs/fuel-receipt.pdf` | 🟢 Employee |
| notes | TEXT | | `Weekly delivery route` | 🟢 Employee |
| status | ENUM | NN, DEFAULT PENDING | `APPROVED` | 🔵 Manager |
| reviewed_by | UUID | FK → User | `user-mgr-02` | ⚙️ System |
| reviewed_at | TIMESTAMP | | `2026-07-11 10:00:00` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-10 17:00:00` | ⚙️ System |

**Example Rows (how it looks filled):**

| Employee | activity_type | fuel_type | quantity | unit | carbon_kg ⚙️ | status |
|---|---|---|---|---|---|---|
| Ravi Sharma | `FLEET_TRAVEL` | `DIESEL` | `500` | `KM` | `135.00` | ✅ Approved |
| Priya Patel | `ELECTRICITY` | `GRID` | `1200` | `KWH` | `984.00` | ⏳ Pending |
| Amit Kumar | `BUSINESS_TRAVEL` | `AVIATION` | `2800` | `KM` | `714.00` | ✅ Approved |
| Sneha Rao | `WASTE` | `LANDFILL` | `300` | `KG` | `176.01` | ❌ Rejected |

---

## Table 11: `CSRActivity` 🔵 Manager / 🔴 Admin creates

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `csr-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| category_id | UUID | FK → Category, NN | `cat-001` | 🔵 Manager |
| title | VARCHAR(255) | NN | `Tree Planting Drive 2026` | 🔵 Manager |
| description | TEXT | NN | `Annual drive at City Park...` | 🔵 Manager |
| location | VARCHAR(255) | | `City Park, Mumbai` | 🔵 Manager |
| start_date | DATE | NN | `2026-07-15` | 🔵 Manager |
| end_date | DATE | NN | `2026-07-15` | 🔵 Manager |
| max_participants | INTEGER | | `100` | 🔵 Manager |
| status | ENUM | NN | `ACTIVE` | 🔵 Manager |
| created_by | UUID | FK → User, NN | `user-mgr-03` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-01 09:00:00` | ⚙️ System |

---

## Table 12: `EmployeeParticipation` 🟢 Employee enters, 🔵 Manager approves

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ep-001` | ⚙️ System |
| csr_activity_id | UUID | FK → CSRActivity, NN | `csr-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System (logged-in) |
| hours_contributed | DECIMAL(5,2) | NN | `4.00` | 🟢 Employee |
| role | ENUM | NN | `VOLUNTEER` | 🟢 Employee |
| proof_url | VARCHAR(500) | | `/proofs/selfie.jpg` | 🟢 Employee |
| comments | TEXT | | `Planted 12 saplings` | 🟢 Employee |
| approval_status | ENUM | NN, DEFAULT PENDING | `APPROVED` | 🔵 Manager |
| approved_by | UUID | FK → User | `user-mgr-03` | ⚙️ System |
| approved_at | TIMESTAMP | | `2026-07-16 10:00:00` | ⚙️ System |
| xp_awarded | INTEGER | DEFAULT 0 | `20` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-15 18:00:00` | ⚙️ System |

**Approval Status ENUM:** `PENDING`, `APPROVED`, `REJECTED`
**Role ENUM:** `VOLUNTEER`, `ORGANIZER`, `COORDINATOR`

---

## Table 13: `PolicyAcknowledgement` 🟢 Employee (one-click action)

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `pa-001` | ⚙️ System |
| policy_id | UUID | FK → ESGPolicy, NN | `pol-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System (logged-in) |
| policy_version | VARCHAR(20) | NN | `v2.0` | ⚙️ System (auto from policy) |
| acknowledged_at | TIMESTAMP | NN | `2026-07-05 11:30:00` | 🟢 Employee (clicks button) |
| ip_address | VARCHAR(45) | | `192.168.1.55` | ⚙️ System |

**Unique Constraint:** `(policy_id, user_id, policy_version)` — one ack per user per version.

---

## Table 14: `ComplianceIssue` 🔵 Manager / Auditor creates

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ci-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| department_id | UUID | FK → Department, NN | `dept-001` | 🔵 Manager |
| title | VARCHAR(255) | NN | `Missing fire safety audit Q2` | 🔵 Manager |
| description | TEXT | NN | `The quarterly fire safety...` | 🔵 Manager |
| severity | ENUM | NN | `HIGH` | 🔵 Manager |
| status | ENUM | NN, DEFAULT OPEN | `IN_PROGRESS` | 🔵 Manager |
| owner_user_id | UUID | FK → User, NN | `u9876-...` | 🔵 Manager |
| due_date | DATE | NN | `2026-08-01` | 🔵 Manager |
| resolved_at | TIMESTAMP | | `NULL` | ⚙️ System |
| created_by | UUID | FK → User, NN | `user-mgr-01` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-10 09:00:00` | ⚙️ System |

**Severity ENUM:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
**Status ENUM:** `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `OVERDUE`

---

## Table 15: `Challenge` 🔵 Manager creates, 🟢 Employee participates

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ch-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| title | VARCHAR(255) | NN | `Zero Waste July` | 🔵 Manager |
| description | TEXT | NN | `Reduce dept waste by 30%...` | 🔵 Manager |
| category_id | UUID | FK → Category, NN | `cat-002` | 🔵 Manager |
| target_value | DECIMAL(10,2) | NN | `30.00` | 🔵 Manager |
| target_unit | VARCHAR(50) | NN | `percent_reduction` | 🔵 Manager |
| xp_reward | INTEGER | NN | `100` | 🔵 Manager |
| start_date | DATE | NN | `2026-07-01` | 🔵 Manager |
| end_date | DATE | NN | `2026-07-31` | 🔵 Manager |
| status | ENUM | NN, DEFAULT DRAFT | `ACTIVE` | 🔵 Manager |
| created_by | UUID | FK → User, NN | `user-mgr-01` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-06-25 09:00:00` | ⚙️ System |

**Status State Machine:** `DRAFT` → `ACTIVE` → `UNDER_REVIEW` → `COMPLETED` (or `ARCHIVED`)

---

## Table 16: `ChallengeParticipation` 🟢 Employee enters progress

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `cp-001` | ⚙️ System |
| challenge_id | UUID | FK → Challenge, NN | `ch-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System (logged-in) |
| current_value | DECIMAL(10,2) | NN, DEFAULT 0 | `18.50` | 🟢 Employee |
| proof_url | VARCHAR(500) | | `/proofs/waste-log.pdf` | 🟢 Employee |
| notes | TEXT | | `Switched to digital invoices` | 🟢 Employee |
| is_completed | BOOLEAN | NN, DEFAULT false | `false` | ⚙️ System |
| xp_awarded | INTEGER | DEFAULT 0 | `0` | ⚙️ System |
| joined_at | TIMESTAMP | NN, AUTO | `2026-07-02 08:00:00` | ⚙️ System |
| updated_at | TIMESTAMP | NN, AUTO | `2026-07-10 17:00:00` | ⚙️ System |

---

## Table 17: `EnvironmentalGoal` 🔵 Manager sets, ⚙️ System tracks

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `eg-001` | ⚙️ System |
| organization_id | UUID | FK → Organization, NN | `a1b2c3d4-...` | ⚙️ System |
| department_id | UUID | FK → Department | `dept-001` | 🔵 Manager |
| title | VARCHAR(255) | NN | `Reduce Scope 1 by 20%` | 🔵 Manager |
| target_type | ENUM | NN | `CARBON_REDUCTION` | 🔵 Manager |
| target_value | DECIMAL(10,2) | NN | `20.00` | 🔵 Manager |
| baseline_value | DECIMAL(12,4) | NN | `5000.00` | 🔵 Manager |
| current_value | DECIMAL(12,4) | DEFAULT 0 | `3750.00` | ⚙️ System |
| target_year | INTEGER | NN | `2026` | 🔵 Manager |
| status | ENUM | NN | `ON_TRACK` | ⚙️ System |

---

# SECTION C: SYSTEM-GENERATED TABLES

> **No human fills these.** Background jobs write to them automatically.

---

## Table 18: `DepartmentScore` ⚙️ System only

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ds-001` | ⚙️ System |
| department_id | UUID | FK → Department, NN | `dept-001` | ⚙️ System |
| period | VARCHAR(10) | NN | `2026-Q3` | ⚙️ System |
| environmental_score | DECIMAL(5,2) | NN | `72.00` | ⚙️ System |
| social_score | DECIMAL(5,2) | NN | `85.00` | ⚙️ System |
| governance_score | DECIMAL(5,2) | NN | `87.50` | ⚙️ System |
| total_score | DECIMAL(5,2) | NN | `80.55` | ⚙️ System |
| calculated_at | TIMESTAMP | NN | `2026-07-12 02:00:00` | ⚙️ System |

**Example Rows:**

| Department | Period | Env ⚙️ | Social ⚙️ | Gov ⚙️ | Total ⚙️ |
|---|---|---|---|---|---|
| Operations | `2026-Q3` | 72.00 | 85.00 | 87.50 | **80.55** |
| HR | `2026-Q3` | 60.00 | 92.00 | 95.00 | **81.60** |
| Fleet Mgmt | `2026-Q3` | 55.00 | 70.00 | 80.00 | **67.00** |

---

## Table 19: `UserBadge` ⚙️ System awards automatically

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `ub-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System |
| badge_id | UUID | FK → Badge, NN | `badge-001` | ⚙️ System |
| awarded_at | TIMESTAMP | NN | `2026-07-10 14:30:00` | ⚙️ System |

**Unique Constraint:** `(user_id, badge_id)` — can't earn the same badge twice.

---

## Table 20: `RewardRedemption` 🟢 Employee triggers, ⚙️ System processes

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `rr-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System (logged-in) |
| reward_id | UUID | FK → Reward, NN | `rew-001` | 🟢 Employee (picks reward) |
| points_spent | INTEGER | NN | `200` | ⚙️ System |
| status | ENUM | NN | `FULFILLED` | ⚙️ System |
| redeemed_at | TIMESTAMP | NN | `2026-07-11 16:00:00` | ⚙️ System |

**Status ENUM:** `PENDING`, `FULFILLED`, `CANCELLED`

---

## Table 21: `Notification` ⚙️ System generates

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `notif-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System |
| type | ENUM | NN | `BADGE_EARNED` | ⚙️ System |
| title | VARCHAR(255) | NN | `You earned Green Warrior!` | ⚙️ System |
| message | TEXT | NN | `Congrats! You crossed 500 XP...` | ⚙️ System |
| is_read | BOOLEAN | NN, DEFAULT false | `false` | 🟢 Employee (marks read) |
| link_url | VARCHAR(500) | | `/badges/green-warrior` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-10 14:30:00` | ⚙️ System |

---

## Table 22: `AuditLog` ⚙️ System only (immutable)

| Column | Type | Constraints | Example Value | Filled By |
|---|---|---|---|---|
| id | UUID | PK, AUTO | `al-001` | ⚙️ System |
| user_id | UUID | FK → User, NN | `u9876-...` | ⚙️ System |
| action | VARCHAR(100) | NN | `CARBON_TRANSACTION_CREATED` | ⚙️ System |
| entity_type | VARCHAR(100) | NN | `CarbonTransaction` | ⚙️ System |
| entity_id | UUID | NN | `ct-001` | ⚙️ System |
| changes | JSONB | | `{"quantity": {"old": null, "new": 500}}` | ⚙️ System |
| ip_address | VARCHAR(45) | | `192.168.1.55` | ⚙️ System |
| created_at | TIMESTAMP | NN, AUTO | `2026-07-10 17:00:00` | ⚙️ System |

---

# SECTION D: QUICK REFERENCE — Who Fills What?

| Table | 🔴 Admin | 🔵 Manager | 🟢 Employee | ⚙️ System |
|---|---|---|---|---|
| Organization | ✅ Creates | | | Timestamps |
| Department | ✅ Creates | | | Timestamps |
| User | ✅ Creates account | | ✅ Updates profile | Password hash, XP, login |
| EmissionFactor | ✅ Full control | | | Timestamps |
| ESGConfiguration | ✅ Full control | | | |
| ESGPolicy | ✅ Full control | | | Timestamps |
| Category | ✅ Full control | | | |
| Badge | ✅ Full control | | | |
| Reward | ✅ Full control | | | |
| CSRActivity | | ✅ Creates | | Timestamps |
| CarbonTransaction | | ✅ Approves | ✅ Logs activity | Calculates carbon_kg |
| EmployeeParticipation | | ✅ Approves | ✅ Submits hours/proof | Awards XP |
| PolicyAcknowledgement | | | ✅ Clicks acknowledge | Timestamps, IP |
| ComplianceIssue | | ✅ Creates/manages | | Tracks overdue |
| Challenge | | ✅ Creates/manages | | State transitions |
| ChallengeParticipation | | | ✅ Updates progress | Completion check, XP |
| EnvironmentalGoal | | ✅ Sets targets | | Tracks progress |
| DepartmentScore | | | | ✅ Full (background job) |
| UserBadge | | | | ✅ Full (auto-award) |
| RewardRedemption | | | ✅ Picks reward | Deducts points, stock |
| Notification | | | ✅ Marks read | ✅ Generates |
| AuditLog | | | | ✅ Full (immutable) |
