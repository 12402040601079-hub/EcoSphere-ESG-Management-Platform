-- ENUMS
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE');
CREATE TYPE activity_type AS ENUM ('FLEET_TRAVEL', 'ELECTRICITY', 'BUSINESS_TRAVEL', 'WASTE');
CREATE TYPE fuel_type AS ENUM ('DIESEL', 'PETROL', 'GRID', 'AVIATION', 'LANDFILL');
CREATE TYPE emission_scope AS ENUM ('SCOPE_1', 'SCOPE_2', 'SCOPE_3');
CREATE TYPE scoring_method AS ENUM ('WEIGHTED_AVERAGE');
CREATE TYPE recalc_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE policy_category AS ENUM ('GOVERNANCE', 'ENVIRONMENTAL', 'SOCIAL');
CREATE TYPE category_type AS ENUM ('CSR_ACTIVITY', 'CHALLENGE', 'ENVIRONMENTAL', 'GOVERNANCE');
CREATE TYPE badge_tier AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE participation_role AS ENUM ('VOLUNTEER', 'ORGANIZER', 'COORDINATOR');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE issue_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'OVERDUE');
CREATE TYPE challenge_status AS ENUM ('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED');
CREATE TYPE target_type AS ENUM ('CARBON_REDUCTION');
CREATE TYPE goal_status AS ENUM ('ON_TRACK', 'BEHIND', 'ACHIEVED');
CREATE TYPE reward_status AS ENUM ('PENDING', 'FULFILLED', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('BADGE_EARNED', 'CHALLENGE_COMPLETED', 'ISSUE_ASSIGNED', 'GENERAL');
CREATE TYPE csr_status AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE metric_unit AS ENUM ('KM', 'KWH', 'KG', 'LITRE');

-- 1. Organization
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    auto_emission_calc BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Department
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    parent_department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    head_user_id UUID, -- Foreign key added later to avoid circular dependency
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. User
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    avatar_url VARCHAR(500),
    xp_total INTEGER NOT NULL DEFAULT 0,
    points_balance INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for head_user_id to Department
ALTER TABLE departments ADD CONSTRAINT fk_dept_head_user FOREIGN KEY (head_user_id) REFERENCES users(id);

-- 4. EmissionFactor
CREATE TABLE emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    activity_type activity_type NOT NULL,
    fuel_type fuel_type NOT NULL,
    factor_value DECIMAL(10,4) NOT NULL,
    unit_numerator VARCHAR(20) NOT NULL,
    unit_denominator VARCHAR(20) NOT NULL,
    scope emission_scope NOT NULL,
    source VARCHAR(255),
    effective_from DATE NOT NULL,
    effective_to DATE
);

-- 5. ESGConfiguration
CREATE TABLE esg_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id),
    env_weight DECIMAL(3,2) NOT NULL CHECK (env_weight >= 0 AND env_weight <= 1),
    social_weight DECIMAL(3,2) NOT NULL CHECK (social_weight >= 0 AND social_weight <= 1),
    gov_weight DECIMAL(3,2) NOT NULL CHECK (gov_weight >= 0 AND gov_weight <= 1),
    scoring_method scoring_method NOT NULL,
    recalc_frequency recalc_frequency NOT NULL,
    CONSTRAINT chk_weights_sum CHECK (env_weight + social_weight + gov_weight = 1.00)
);

-- 6. ESGPolicy
CREATE TABLE esg_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category policy_category NOT NULL,
    version VARCHAR(20) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    effective_date DATE NOT NULL,
    requires_acknowledgement BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Category
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    type category_type NOT NULL,
    points_per_hour INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 8. Badge
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    icon_url VARCHAR(500) NOT NULL,
    tier badge_tier NOT NULL,
    unlock_rule JSONB NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0
);

-- 9. Reward
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    points_cost INTEGER NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 10. CarbonTransaction
CREATE TABLE carbon_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    recorded_by_user_id UUID NOT NULL REFERENCES users(id),
    emission_factor_id UUID NOT NULL REFERENCES emission_factors(id),
    activity_type activity_type NOT NULL,
    fuel_type fuel_type NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit metric_unit NOT NULL,
    carbon_kg DECIMAL(12,4) NOT NULL,
    scope emission_scope NOT NULL,
    activity_date DATE NOT NULL,
    proof_url VARCHAR(500),
    notes TEXT,
    status approval_status NOT NULL DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. CSRActivity
CREATE TABLE csr_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER,
    status csr_status NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. EmployeeParticipation
CREATE TABLE employee_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    csr_activity_id UUID NOT NULL REFERENCES csr_activities(id),
    user_id UUID NOT NULL REFERENCES users(id),
    hours_contributed DECIMAL(5,2) NOT NULL,
    role participation_role NOT NULL,
    proof_url VARCHAR(500),
    comments TEXT,
    approval_status approval_status NOT NULL DEFAULT 'PENDING',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    xp_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. PolicyAcknowledgement
CREATE TABLE policy_acknowledgements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES esg_policies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    policy_version VARCHAR(20) NOT NULL,
    acknowledged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    UNIQUE (policy_id, user_id, policy_version)
);

-- 14. ComplianceIssue
CREATE TABLE compliance_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity severity_level NOT NULL,
    status issue_status NOT NULL DEFAULT 'OPEN',
    owner_user_id UUID NOT NULL REFERENCES users(id),
    due_date DATE NOT NULL,
    resolved_at TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Challenge
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    target_value DECIMAL(10,2) NOT NULL,
    target_unit VARCHAR(50) NOT NULL,
    xp_reward INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status challenge_status NOT NULL DEFAULT 'DRAFT',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. ChallengeParticipation
CREATE TABLE challenge_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id),
    user_id UUID NOT NULL REFERENCES users(id),
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    proof_url VARCHAR(500),
    notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    xp_awarded INTEGER DEFAULT 0,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. EnvironmentalGoal
CREATE TABLE environmental_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    target_type target_type NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    baseline_value DECIMAL(12,4) NOT NULL,
    current_value DECIMAL(12,4) DEFAULT 0,
    target_year INTEGER NOT NULL,
    status goal_status NOT NULL
);

-- 18. DepartmentScore
CREATE TABLE department_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id),
    period VARCHAR(10) NOT NULL,
    environmental_score DECIMAL(5,2) NOT NULL,
    social_score DECIMAL(5,2) NOT NULL,
    governance_score DECIMAL(5,2) NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. UserBadge
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    badge_id UUID NOT NULL REFERENCES badges(id),
    awarded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, badge_id)
);

-- 20. RewardRedemption
CREATE TABLE reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    reward_id UUID NOT NULL REFERENCES rewards(id),
    points_spent INTEGER NOT NULL,
    status reward_status NOT NULL,
    redeemed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. Notification
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    link_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 22. AuditLog
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
