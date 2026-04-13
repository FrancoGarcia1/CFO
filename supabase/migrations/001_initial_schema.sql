-- ============================================================
-- vCFO AI — Initial Schema
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  empresa TEXT,
  plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'active', 'cancelled')),
  trial_used BOOLEAN NOT NULL DEFAULT FALSE,
  trial_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('daily', 'weekly', 'monthly')),
  type TEXT NOT NULL CHECK (type IN ('income', 'cost', 'expense')),
  category TEXT NOT NULL,
  concept TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX idx_transactions_user_type ON public.transactions(user_id, type);

-- Historical data (prior years for forecast)
CREATE TABLE public.historical (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
  income NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  expense NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);

-- Visitors
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER NOT NULL CHECK (count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Occupancy
CREATE TABLE public.occupancy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pct NUMERIC(5, 2) NOT NULL CHECK (pct >= 0 AND pct <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- User Settings
CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  growth_rate NUMERIC(4, 1) NOT NULL DEFAULT 6.0 CHECK (growth_rate >= 3.0 AND growth_rate <= 15.0),
  last_forecast_q TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_user_time ON public.chat_messages(user_id, created_at);

-- Rate Limits
CREATE TABLE public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  call_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Transactions
CREATE POLICY "Users can CRUD own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Historical
CREATE POLICY "Users can CRUD own historical" ON public.historical FOR ALL USING (auth.uid() = user_id);

-- Visitors
CREATE POLICY "Users can CRUD own visitors" ON public.visitors FOR ALL USING (auth.uid() = user_id);

-- Occupancy
CREATE POLICY "Users can CRUD own occupancy" ON public.occupancy FOR ALL USING (auth.uid() = user_id);

-- Settings
CREATE POLICY "Users can CRUD own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Chat
CREATE POLICY "Users can CRUD own chat" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- Rate limits: no direct client access (service role only)

-- ============================================================
-- Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, telefono, empresa)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'telefono',
    NEW.raw_user_meta_data->>'empresa'
  );
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Rate Limit Function (server-side only)
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_max_calls INTEGER DEFAULT 10,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER) AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  SELECT call_count, api_rate_limits.window_start
  INTO v_count, v_window_start
  FROM public.api_rate_limits
  WHERE user_id = p_user_id;

  IF NOT FOUND OR (now() - v_window_start) > (p_window_seconds || ' seconds')::interval THEN
    INSERT INTO public.api_rate_limits (user_id, window_start, call_count)
    VALUES (p_user_id, now(), 1)
    ON CONFLICT (user_id) DO UPDATE SET window_start = now(), call_count = 1;
    RETURN QUERY SELECT TRUE, p_max_calls - 1;
  ELSIF v_count >= p_max_calls THEN
    RETURN QUERY SELECT FALSE, 0;
  ELSE
    UPDATE public.api_rate_limits SET call_count = call_count + 1 WHERE user_id = p_user_id;
    RETURN QUERY SELECT TRUE, p_max_calls - v_count - 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
