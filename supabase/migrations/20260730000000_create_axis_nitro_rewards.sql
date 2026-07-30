-- Create Axis Nitro Rewards Tables and RLS Policies

-- 1. Create reward_tasks Table
CREATE TABLE IF NOT EXISTS kfs_reward_tasks (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    points_reward INT NOT NULL DEFAULT 100,
    cash_reward_usd NUMERIC(10, 2) DEFAULT 0,
    category VARCHAR(50) NOT NULL DEFAULT 'SCAN_QR',
    verification_type VARCHAR(50) NOT NULL DEFAULT 'AUTOMATIC_QR',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    target_audience VARCHAR(50) NOT NULL DEFAULT 'ALL',
    requirements TEXT,
    qr_code_secret VARCHAR(100),
    geo_lat NUMERIC(10, 6),
    geo_lng NUMERIC(10, 6),
    geo_radius_meters INT DEFAULT 50,
    max_completions_per_user INT DEFAULT 1,
    banner_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100) DEFAULT 'System Core'
);

-- 2. Create reward_submissions Table
CREATE TABLE IF NOT EXISTS kfs_reward_submissions (
    id VARCHAR(100) PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL REFERENCES kfs_reward_tasks(id) ON DELETE CASCADE,
    task_title VARCHAR(255) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    user_email VARCHAR(100),
    points_awarded INT NOT NULL DEFAULT 0,
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE kfs_reward_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kfs_reward_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kfs_reward_tasks
CREATE POLICY "Allow public read active reward tasks" ON kfs_reward_tasks FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated insert reward tasks" ON kfs_reward_tasks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow authenticated update reward tasks" ON kfs_reward_tasks FOR UPDATE TO public USING (true);

-- RLS Policies for kfs_reward_submissions
CREATE POLICY "Allow public read reward submissions" ON kfs_reward_submissions FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert reward submissions" ON kfs_reward_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update reward submissions" ON kfs_reward_submissions FOR UPDATE TO public USING (true);
