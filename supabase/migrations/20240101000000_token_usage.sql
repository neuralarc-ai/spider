-- Create token_usage table
CREATE TABLE IF NOT EXISTS public.token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    used_tokens INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT token_usage_used_tokens_check CHECK (used_tokens >= 0 AND used_tokens <= 20000)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS token_usage_user_id_idx ON public.token_usage(user_id);

-- Enable Row Level Security
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own token usage" ON public.token_usage;
DROP POLICY IF EXISTS "Users can update their own token usage" ON public.token_usage;
DROP POLICY IF EXISTS "Users can insert their own token usage" ON public.token_usage;

-- Create policies
CREATE POLICY "Users can view their own token usage"
    ON public.token_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own token usage"
    ON public.token_usage FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage"
    ON public.token_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to initialize token usage for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.token_usage (user_id, used_tokens)
    VALUES (NEW.id, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create token usage record for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 