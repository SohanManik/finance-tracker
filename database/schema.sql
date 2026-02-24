-- ============================================================
-- PERSONAL FINANCE TRACKER — FULL POSTGRESQL SCHEMA
-- Designed for Supabase (PostgreSQL)
-- All monetary values stored as NUMERIC(12,2) to avoid float issues
-- Every table has: id, created_at, updated_at, is_deleted, user_id
-- Soft deletes via is_deleted flag — nothing is ever truly removed
-- ============================================================


-- ============================================================
-- UTILITY: Auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. USERS
-- Single user for now, but schema supports multi-user from day one
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  default_currency CHAR(3) DEFAULT 'USD',  -- ISO 4217, future-proofed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 2. REFERENCE / ENUM TABLES
-- Using lookup tables instead of ENUM types for flexibility
-- (ENUMs in Postgres are painful to alter later)
-- ============================================================

-- Pay frequencies for salaried employees
CREATE TABLE pay_frequencies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL  -- 'weekly', 'biweekly', 'semi_monthly', 'monthly'
);
INSERT INTO pay_frequencies (name) VALUES
  ('weekly'), ('biweekly'), ('semi_monthly'), ('monthly');

-- Employment types
CREATE TABLE employment_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL  -- 'hourly', 'salaried'
);
INSERT INTO employment_types (name) VALUES ('hourly'), ('salaried');

-- Transaction types (high level)
CREATE TABLE transaction_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL  -- 'income', 'expense', 'transfer', 'bet'
);
INSERT INTO transaction_types (name) VALUES
  ('income'), ('expense'), ('transfer'), ('bet');

-- Payment methods
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO payment_methods (name) VALUES
  ('cash'), ('debit'), ('venmo'), ('zelle'), ('check'), ('direct_deposit');
-- Credit cards are linked separately via credit_cards table

-- Bet types for sports betting
CREATE TABLE bet_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO bet_types (name) VALUES
  ('moneyline'), ('spread'), ('over_under'), ('parlay'),
  ('same_game_parlay'), ('prop_bet'), ('futures'), ('live_in_game');

-- Bet result statuses
CREATE TABLE bet_results (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO bet_results (name) VALUES
  ('pending'), ('win'), ('loss'), ('push'), ('void');

-- Sports
CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO sports (name) VALUES
  ('NFL'), ('NBA'), ('MLB'), ('NHL'), ('NCAAFB'),
  ('NCAAMB'), ('Soccer'), ('Tennis'), ('Golf'), ('MMA'), ('Other');

-- Sportsbooks
CREATE TABLE sportsbooks (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO sportsbooks (name) VALUES ('FanDuel'), ('DraftKings');

-- Debt types
CREATE TABLE debt_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO debt_types (name) VALUES
  ('student_loan'), ('car_loan'), ('personal_loan'),
  ('medical_debt'), ('credit_card'), ('other');

-- Retirement account types
CREATE TABLE retirement_account_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO retirement_account_types (name) VALUES
  ('traditional_401k'), ('roth_401k'), ('traditional_ira'), ('roth_ira'), ('other');

-- Recurring frequencies
CREATE TABLE frequencies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO frequencies (name) VALUES
  ('daily'), ('weekly'), ('biweekly'), ('semi_monthly'),
  ('monthly'), ('quarterly'), ('annually');

-- P2P transfer platforms
CREATE TABLE p2p_platforms (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO p2p_platforms (name) VALUES ('venmo'), ('zelle');

-- Asset types for net worth
CREATE TABLE asset_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO asset_types (name) VALUES
  ('checking'), ('savings'), ('investment'), ('crypto'),
  ('real_estate'), ('vehicle'), ('other');

-- Liability types for net worth
CREATE TABLE liability_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
INSERT INTO liability_types (name) VALUES
  ('credit_card'), ('student_loan'), ('car_loan'),
  ('mortgage'), ('personal_loan'), ('medical_debt'), ('other');


-- ============================================================
-- 3. EXPENSE CATEGORIES & SUBCATEGORIES
-- Fully customizable per user, seeded with defaults
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,                        -- optional emoji or icon name
  color TEXT,                       -- hex color for UI
  is_default BOOLEAN DEFAULT FALSE, -- marks system-seeded categories
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_subcategories_updated_at
  BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- NOTE: Seed categories and subcategories after inserting your user record.
-- Example seed (replace USER_ID with your actual UUID):
--
-- INSERT INTO categories (user_id, name, is_default) VALUES
--   (USER_ID, 'Food & Dining', TRUE),
--   (USER_ID, 'Housing', TRUE),
--   (USER_ID, 'Transportation', TRUE),
--   (USER_ID, 'Subscriptions & Memberships', TRUE),
--   (USER_ID, 'Shopping', TRUE),
--   (USER_ID, 'Health', TRUE),
--   (USER_ID, 'Education', TRUE),
--   (USER_ID, 'Entertainment', TRUE),
--   (USER_ID, 'Personal Finance', TRUE),
--   (USER_ID, 'Peer-to-Peer Payments', TRUE),
--   (USER_ID, 'Miscellaneous', TRUE);


-- ============================================================
-- 4. TAGS
-- Attach any tag to any transaction for flexible filtering
-- ============================================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. BANK ACCOUNTS
-- Supports multiple accounts, designed for future expansion
-- ============================================================
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,         -- e.g., 'Chase', 'Wells Fargo'
  account_name TEXT NOT NULL,             -- e.g., 'Primary Checking'
  account_type TEXT NOT NULL,             -- 'checking', 'savings', 'investment', 'hysa'
  last_4_digits CHAR(4),
  current_balance NUMERIC(12,2) DEFAULT 0,
  currency CHAR(3) DEFAULT 'USD',
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);


-- ============================================================
-- 6. CREDIT CARDS
-- ============================================================
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,                 -- e.g., 'Chase Sapphire'
  issuer TEXT NOT NULL,                   -- e.g., 'Chase', 'Amex'
  last_4_digits CHAR(4),
  credit_limit NUMERIC(12,2),
  apr NUMERIC(5,2),                       -- e.g., 24.99
  annual_fee NUMERIC(8,2) DEFAULT 0,
  current_balance NUMERIC(12,2) DEFAULT 0,
  statement_balance NUMERIC(12,2),        -- balance at last statement close
  minimum_payment NUMERIC(8,2),
  due_date_day SMALLINT,                  -- day of month payment is due (1-31)
  rewards_type TEXT,                      -- 'cashback', 'points', 'miles'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_credit_cards_updated_at
  BEFORE UPDATE ON credit_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_credit_cards_user_id ON credit_cards(user_id);

-- Credit card payment history
CREATE TABLE credit_card_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credit_card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount_paid NUMERIC(12,2) NOT NULL,
  statement_balance_at_payment NUMERIC(12,2),  -- what the balance was
  is_full_balance BOOLEAN DEFAULT FALSE,
  bank_account_id UUID REFERENCES bank_accounts(id), -- which account paid it
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_credit_card_payments_updated_at
  BEFORE UPDATE ON credit_card_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_cc_payments_card_id ON credit_card_payments(credit_card_id);
CREATE INDEX idx_cc_payments_date ON credit_card_payments(payment_date);

-- Credit card rewards tracking
CREATE TABLE credit_card_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credit_card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  statement_period_start DATE,
  statement_period_end DATE,
  points_earned NUMERIC(10,2) DEFAULT 0,
  cashback_earned NUMERIC(8,2) DEFAULT 0,
  miles_earned NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_cc_rewards_updated_at
  BEFORE UPDATE ON credit_card_rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 7. EMPLOYMENT & INCOME
-- Supports both hourly and salaried in same table
-- When you go salaried on June 29th, just add a new record
-- ============================================================
CREATE TABLE employment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_name TEXT NOT NULL,
  employment_type_id INTEGER NOT NULL REFERENCES employment_types(id),
  start_date DATE NOT NULL,
  end_date DATE,                          -- NULL if current job

  -- Hourly fields
  hourly_rate NUMERIC(8,2),
  regular_hours_per_week NUMERIC(5,2),
  overtime_multiplier NUMERIC(4,2) DEFAULT 1.5,

  -- Salaried fields
  annual_salary NUMERIC(12,2),
  pay_frequency_id INTEGER REFERENCES pay_frequencies(id),

  -- Both
  state TEXT,                             -- for state tax calculations
  filing_status TEXT,                     -- 'single', 'married_filing_jointly', etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_employment_updated_at
  BEFORE UPDATE ON employment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_employment_user_id ON employment(user_id);

-- Individual paychecks
-- Every paycheck is one row — gross pay broken down into all components
CREATE TABLE paychecks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employment_id UUID NOT NULL REFERENCES employment(id) ON DELETE CASCADE,
  pay_date DATE NOT NULL,
  pay_period_start DATE,
  pay_period_end DATE,

  -- Pay components
  is_bonus BOOLEAN DEFAULT FALSE,          -- flag for bonus paychecks
  gross_pay NUMERIC(12,2) NOT NULL,
  regular_pay NUMERIC(12,2),              -- hourly: regular hours * rate
  overtime_pay NUMERIC(12,2) DEFAULT 0,
  bonus_amount NUMERIC(12,2) DEFAULT 0,

  -- Tax withholdings
  federal_income_tax NUMERIC(10,2) DEFAULT 0,
  state_income_tax NUMERIC(10,2) DEFAULT 0,
  social_security NUMERIC(10,2) DEFAULT 0,
  medicare NUMERIC(10,2) DEFAULT 0,
  -- Supplemental federal rate applies to bonuses (flat 22%)
  supplemental_federal_tax NUMERIC(10,2) DEFAULT 0,
  additional_withholding NUMERIC(10,2) DEFAULT 0,  -- local, disability, etc.

  -- 401k
  retirement_employee_contribution NUMERIC(10,2) DEFAULT 0,
  retirement_employer_match NUMERIC(10,2) DEFAULT 0,
  retirement_account_type_id INTEGER REFERENCES retirement_account_types(id),

  -- Other deductions
  health_insurance_deduction NUMERIC(10,2) DEFAULT 0,
  dental_vision_deduction NUMERIC(10,2) DEFAULT 0,
  other_deductions NUMERIC(10,2) DEFAULT 0,
  other_deductions_notes TEXT,

  -- Calculated
  net_pay NUMERIC(12,2) NOT NULL,          -- gross minus all deductions

  -- YTD totals (snapshot at time of paycheck)
  ytd_gross NUMERIC(12,2),
  ytd_federal_tax NUMERIC(12,2),
  ytd_state_tax NUMERIC(12,2),
  ytd_social_security NUMERIC(12,2),
  ytd_medicare NUMERIC(12,2),
  ytd_retirement NUMERIC(12,2),

  bank_account_id UUID REFERENCES bank_accounts(id),  -- where it was deposited
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_paychecks_updated_at
  BEFORE UPDATE ON paychecks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_paychecks_user_id ON paychecks(user_id);
CREATE INDEX idx_paychecks_pay_date ON paychecks(pay_date);
CREATE INDEX idx_paychecks_employment_id ON paychecks(employment_id);


-- ============================================================
-- 8. OTHER INCOME SOURCES
-- Freelance, bonuses not tied to payroll, tax refunds, cash gifts
-- ============================================================
CREATE TABLE other_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  income_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  source_name TEXT NOT NULL,             -- e.g., 'Freelance Client', 'IRS Refund'
  income_type TEXT NOT NULL,             -- 'freelance', 'bonus', 'tax_refund', 'gift', 'other'
  is_1099 BOOLEAN DEFAULT FALSE,         -- freelance/side gig 1099 income
  bank_account_id UUID REFERENCES bank_accounts(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_other_income_updated_at
  BEFORE UPDATE ON other_income
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_other_income_user_id ON other_income(user_id);
CREATE INDEX idx_other_income_date ON other_income(income_date);


-- ============================================================
-- 9. P2P TRANSFERS (VENMO / ZELLE)
-- Track both received and sent, with reimbursement flag
-- ============================================================
CREATE TABLE p2p_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES p2p_platforms(id),
  transfer_date DATE NOT NULL,
  direction TEXT NOT NULL,               -- 'received' or 'sent'
  amount NUMERIC(12,2) NOT NULL,
  counterparty_name TEXT NOT NULL,       -- friend's name
  reason TEXT,                           -- 'split dinner', 'rent share', etc.
  is_reimbursement BOOLEAN DEFAULT FALSE, -- TRUE = not real income, just getting money back
  linked_expense_id UUID,                -- optionally link to an expense (FK added later)
  bank_account_id UUID REFERENCES bank_accounts(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_p2p_transfers_updated_at
  BEFORE UPDATE ON p2p_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_p2p_transfers_user_id ON p2p_transfers(user_id);
CREATE INDEX idx_p2p_transfers_date ON p2p_transfers(transfer_date);


-- ============================================================
-- 10. EXPENSES / TRANSACTIONS
-- Core table — every purchase goes here
-- ============================================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_date TIMESTAMPTZ NOT NULL,  -- date AND time
  amount NUMERIC(12,2) NOT NULL,
  merchant_name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),

  -- Payment method — one of these will be set, others null
  payment_method_id INTEGER REFERENCES payment_methods(id),
  credit_card_id UUID REFERENCES credit_cards(id),  -- if paid by credit card

  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_transaction_id UUID,          -- FK to recurring_transactions (added later)

  notes TEXT,
  currency CHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(transaction_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_credit_card ON expenses(credit_card_id);

-- Split transactions
-- One expense can be split across multiple categories
-- e.g., one Target run = $30 groceries + $20 household
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  amount NUMERIC(12,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_expense_splits_updated_at
  BEFORE UPDATE ON expense_splits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tag junction table (many expenses <-> many tags)
CREATE TABLE expense_tags (
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (expense_id, tag_id)
);


-- ============================================================
-- 11. RECURRING TRANSACTIONS
-- Bills, subscriptions, income that repeats on a schedule
-- ============================================================
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- e.g., 'Netflix', 'Rent'
  transaction_type_id INTEGER REFERENCES transaction_types(id),
  amount NUMERIC(12,2) NOT NULL,
  frequency_id INTEGER NOT NULL REFERENCES frequencies(id),
  next_occurrence_date DATE NOT NULL,
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  payment_method_id INTEGER REFERENCES payment_methods(id),
  credit_card_id UUID REFERENCES credit_cards(id),
  auto_create BOOLEAN DEFAULT FALSE,     -- auto-create expense on due date
  is_subscription BOOLEAN DEFAULT FALSE,
  free_trial_end_date DATE,              -- for subscriptions with trials
  cancellation_date DATE,                -- set when cancelled
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_recurring_updated_at
  BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_recurring_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_next_date ON recurring_transactions(next_occurrence_date);

-- Add FK back to expenses now that recurring_transactions exists
ALTER TABLE expenses
  ADD CONSTRAINT fk_expense_recurring
  FOREIGN KEY (recurring_transaction_id)
  REFERENCES recurring_transactions(id);


-- ============================================================
-- 12. BUDGETS
-- Monthly limits per category with rollover support
-- ============================================================
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id),  -- NULL = applies to whole category
  budget_month DATE NOT NULL,            -- store as first day of month, e.g., 2025-06-01
  budgeted_amount NUMERIC(12,2) NOT NULL,
  rollover_enabled BOOLEAN DEFAULT FALSE,
  rollover_amount NUMERIC(12,2) DEFAULT 0,  -- carried in from previous month
  alert_at_80_percent BOOLEAN DEFAULT TRUE,
  alert_at_100_percent BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, category_id, subcategory_id, budget_month)
);

CREATE TRIGGER trg_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_month ON budgets(budget_month);


-- ============================================================
-- 13. DEBT TRACKING
-- ============================================================
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  debt_type_id INTEGER NOT NULL REFERENCES debt_types(id),
  creditor_name TEXT NOT NULL,
  original_balance NUMERIC(12,2) NOT NULL,
  current_balance NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,    -- APR as percentage, e.g., 6.5
  minimum_payment NUMERIC(10,2),
  due_date_day SMALLINT,                  -- day of month
  payoff_strategy TEXT,                   -- 'avalanche' or 'snowball'
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_debts_user_id ON debts(user_id);

-- Debt payment history
CREATE TABLE debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount_paid NUMERIC(12,2) NOT NULL,
  principal_portion NUMERIC(12,2),       -- how much went to principal
  interest_portion NUMERIC(12,2),        -- how much went to interest
  balance_after_payment NUMERIC(12,2),
  bank_account_id UUID REFERENCES bank_accounts(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_debt_payments_updated_at
  BEFORE UPDATE ON debt_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_debt_payments_debt_id ON debt_payments(debt_id);
CREATE INDEX idx_debt_payments_date ON debt_payments(payment_date);


-- ============================================================
-- 14. FINANCIAL GOALS
-- ============================================================
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) DEFAULT 0,
  target_date DATE,
  linked_account_id UUID REFERENCES bank_accounts(id),  -- optional
  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_financial_goals_updated_at
  BEFORE UPDATE ON financial_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);


-- ============================================================
-- 15. SPORTS BETTING
-- ============================================================

-- Sportsbook accounts (one per platform per user)
CREATE TABLE sportsbook_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sportsbook_id INTEGER NOT NULL REFERENCES sportsbooks(id),
  current_balance NUMERIC(12,2) DEFAULT 0,
  username TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, sportsbook_id)
);

CREATE TRIGGER trg_sportsbook_accounts_updated_at
  BEFORE UPDATE ON sportsbook_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Deposits and withdrawals to/from sportsbooks
CREATE TABLE sportsbook_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sportsbook_account_id UUID NOT NULL REFERENCES sportsbook_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  direction TEXT NOT NULL,               -- 'deposit' or 'withdrawal'
  amount NUMERIC(12,2) NOT NULL,
  source TEXT,                           -- 'checking', 'credit_card', 'paypal', etc.
  bank_account_id UUID REFERENCES bank_accounts(id),
  credit_card_id UUID REFERENCES credit_cards(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_sportsbook_transactions_updated_at
  BEFORE UPDATE ON sportsbook_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_sportsbook_txn_account ON sportsbook_transactions(sportsbook_account_id);
CREATE INDEX idx_sportsbook_txn_date ON sportsbook_transactions(transaction_date);

-- Individual bets
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sportsbook_account_id UUID NOT NULL REFERENCES sportsbook_accounts(id) ON DELETE CASCADE,
  bet_type_id INTEGER NOT NULL REFERENCES bet_types(id),
  sport_id INTEGER REFERENCES sports(id),  -- NULL for parlays (sport is on each leg)
  placed_date DATE NOT NULL,
  bet_description TEXT,                   -- e.g., 'Cardinals +3.5'
  odds INTEGER NOT NULL,                  -- American odds, e.g., -110 or +250
  stake NUMERIC(10,2) NOT NULL,
  potential_payout NUMERIC(10,2),         -- calculated at time of placement
  result_id INTEGER REFERENCES bet_results(id) DEFAULT 1,  -- default 'pending'
  actual_payout NUMERIC(10,2) DEFAULT 0,
  profit_loss NUMERIC(10,2),              -- actual_payout - stake (negative = loss)
  is_parlay BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_bets_updated_at
  BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_placed_date ON bets(placed_date);
CREATE INDEX idx_bets_sportsbook ON bets(sportsbook_account_id);
CREATE INDEX idx_bets_result ON bets(result_id);

-- Parlay legs
-- Each row is one leg of a parlay bet
-- If bet.is_parlay = TRUE, this table has the individual legs
CREATE TABLE parlay_legs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport_id INTEGER REFERENCES sports(id),
  bet_type_id INTEGER REFERENCES bet_types(id),
  description TEXT NOT NULL,             -- e.g., 'LeBron 25+ points'
  odds INTEGER NOT NULL,                 -- American odds for this leg
  result_id INTEGER REFERENCES bet_results(id) DEFAULT 1,  -- pending by default
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_parlay_legs_updated_at
  BEFORE UPDATE ON parlay_legs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_parlay_legs_bet_id ON parlay_legs(bet_id);


-- ============================================================
-- 16. NET WORTH TRACKING
-- ============================================================

-- Manual assets (car, property, etc. not tracked elsewhere)
CREATE TABLE manual_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_type_id INTEGER REFERENCES asset_types(id),
  name TEXT NOT NULL,                    -- e.g., '2022 Honda Civic'
  current_value NUMERIC(12,2) NOT NULL,
  as_of_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_manual_assets_updated_at
  BEFORE UPDATE ON manual_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Manual liabilities (loans not tracked in debts table)
CREATE TABLE manual_liabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  liability_type_id INTEGER REFERENCES liability_types(id),
  name TEXT NOT NULL,
  current_balance NUMERIC(12,2) NOT NULL,
  as_of_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_manual_liabilities_updated_at
  BEFORE UPDATE ON manual_liabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Monthly net worth snapshots
-- Calculated and stored once a month for trending over time
CREATE TABLE net_worth_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,           -- first of month
  total_assets NUMERIC(12,2) NOT NULL,
  total_liabilities NUMERIC(12,2) NOT NULL,
  net_worth NUMERIC(12,2) NOT NULL,      -- assets - liabilities
  bank_balances NUMERIC(12,2),
  credit_card_balances NUMERIC(12,2),
  sportsbook_balances NUMERIC(12,2),
  investment_value NUMERIC(12,2),
  debt_balances NUMERIC(12,2),
  manual_assets_value NUMERIC(12,2),
  manual_liabilities_value NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, snapshot_date)
);

CREATE TRIGGER trg_net_worth_snapshots_updated_at
  BEFORE UPDATE ON net_worth_snapshots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_net_worth_user_date ON net_worth_snapshots(user_id, snapshot_date);


-- ============================================================
-- 17. BANK ACCOUNT BALANCE HISTORY
-- Running balance snapshots over time for charting
-- ============================================================
CREATE TABLE bank_balance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  balance NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_bank_balance_history_updated_at
  BEFORE UPDATE ON bank_balance_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_bank_balance_history_account ON bank_balance_history(bank_account_id);
CREATE INDEX idx_bank_balance_history_date ON bank_balance_history(recorded_date);


-- ============================================================
-- ADD BACK FK: p2p_transfers -> expenses
-- ============================================================
ALTER TABLE p2p_transfers
  ADD CONSTRAINT fk_p2p_linked_expense
  FOREIGN KEY (linked_expense_id)
  REFERENCES expenses(id);


-- ============================================================
-- DONE
-- ============================================================
-- Tables created:
--   users, pay_frequencies, employment_types, transaction_types,
--   payment_methods, bet_types, bet_results, sports, sportsbooks,
--   debt_types, retirement_account_types, frequencies, p2p_platforms,
--   asset_types, liability_types, categories, subcategories, tags,
--   bank_accounts, credit_cards, credit_card_payments, credit_card_rewards,
--   employment, paychecks, other_income, p2p_transfers, expenses,
--   expense_splits, expense_tags, recurring_transactions, budgets,
--   debts, debt_payments, financial_goals, sportsbook_accounts,
--   sportsbook_transactions, bets, parlay_legs, manual_assets,
--   manual_liabilities, net_worth_snapshots, bank_balance_history
-- ============================================================