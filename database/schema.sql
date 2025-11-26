-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Location Zones (Matryoshka Matching)
CREATE TABLE IF NOT EXISTS location_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('country', 'region', 'city', 'neighborhood')),
  parent_id UUID REFERENCES location_zones(id),
  boundary GEOMETRY(MULTIPOLYGON, 4326), -- PostGIS Polygon
  economic_tier INT DEFAULT 3, -- 1=High, 5=Low
  risk_score DECIMAL(3,2) DEFAULT 0.0
);

-- 2. Categories (The Emergent Taxonomy)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'core' CHECK (type IN ('core', 'emergent')),
  parent_id UUID REFERENCES categories(id),
  demand_threshold INT DEFAULT 100,
  ai_prompt TEXT, -- System prompt for this category
  privacy_default INT DEFAULT 2, -- 1=Public, 4=Ghost
  reputation_weights JSONB, -- { "punctuality": 0.4, "quality": 0.6 }
  fraud_signals JSONB, -- ["price_too_low", "no_history"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users (The Sovereign Identity)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'provider', 'admin')),
  
  -- Privacy & Sovereignty
  privacy_level VARCHAR(50) DEFAULT 'alias' CHECK (privacy_level IN ('public', 'alias', 'mediated', 'ghost')),
  reputation_base DECIMAL(5,2) DEFAULT 50.00, -- 0-100
  wallet_address VARCHAR(42), -- Polygon Address
  
  -- Location & Culture
  location GEOMETRY(POINT, 4326),
  location_zone_id UUID REFERENCES location_zones(id),
  timezone VARCHAR(50) DEFAULT 'UTC',
  languages TEXT[], -- ['en', 'ar', 'fr']
  
  -- Provider Specifics
  skills TEXT[],
  availability_schedule JSONB, -- { "mon": ["09:00-17:00"] }
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Requests (The Demand Signal)
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  embedding vector(1536), -- OpenAI Embedding for Semantic Search
  
  -- Temporal Intelligence
  temporal_type VARCHAR(50) DEFAULT 'flexible' CHECK (temporal_type IN ('flexible', 'scheduled', 'urgent', 'emergency')),
  deadline TIMESTAMPTZ,
  penalty_rate DECIMAL(10,2) DEFAULT 0.0, -- Cost per hour of delay
  
  -- Geo-Strategy
  location GEOMETRY(POINT, 4326),
  broadcast_radius_km INT DEFAULT 10,
  privacy_zone BOOLEAN DEFAULT FALSE, -- If true, fuzz location
  
  -- Budget
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'DZD',
  
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'matched', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Matches (The Affinity Link)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id),
  provider_id UUID REFERENCES users(id),
  
  score DECIMAL(5,4), -- 0.0000 to 1.0000
  score_breakdown JSONB, -- { "geo": 0.9, "budget": 0.8, "reputation": 0.7 }
  
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'negotiating')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Transactions (Zero-Custody Record)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id),
  
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  
  -- Trust & Escrow
  escrow_status VARCHAR(50) DEFAULT 'none' CHECK (escrow_status IN ('none', 'held', 'released', 'disputed')),
  reputation_staked DECIMAL(10,2) DEFAULT 0.0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reputation Scores (The Trust Chain)
CREATE TABLE IF NOT EXISTS reputation_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  score DECIMAL(5,2), -- Category-specific score
  total_reviews INT DEFAULT 0,
  successful_transactions INT DEFAULT 0,
  disputes_lost INT DEFAULT 0,
  
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Fraud Alerts (The Immune System)
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_id UUID, -- User or Transaction ID
  target_type VARCHAR(50),
  
  signal_code VARCHAR(50), -- e.g., 'PRICE_TOO_LOW'
  severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB,
  
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Campaigns (The Social Bot Output)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id),
  
  platform VARCHAR(50) CHECK (platform IN ('whatsapp', 'facebook', 'instagram', 'telegram')),
  ad_copy TEXT,
  target_audience JSONB,
  
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'failed')),
  performance_metrics JSONB, -- { "clicks": 120, "ctr": 0.05 }
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Admin Users & Moderation
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'moderator' CHECK (role IN ('superadmin', 'moderator', 'analyst')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  target_id UUID,
  action_type VARCHAR(50), -- 'ban_user', 'flag_request'
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
