import { getSupabaseClient } from '@/lib/supabase';

const MAX_TOKENS = 20000;

interface TokenUsage {
  used_tokens: number;
  max_tokens: number;
}

export const getTokenUsage = async (userId: string): Promise<TokenUsage> => {
  const supabase = getSupabaseClient();
  
  try {
    // First check if the user has a token usage record
    const { data, error } = await supabase
      .from('token_usage')
      .select('used_tokens')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching token usage:', error);
      return { used_tokens: 0, max_tokens: MAX_TOKENS };
    }
    
    // If no record exists, create one
    if (!data) {
      const { error: insertError } = await supabase
        .from('token_usage')
        .insert([{
          user_id: userId,
          used_tokens: 0
        }])
        .select('used_tokens')
        .single();
        
      if (insertError) {
        console.error('Error creating token usage record:', insertError);
        return { used_tokens: 0, max_tokens: MAX_TOKENS };
      }
      
      return { used_tokens: 0, max_tokens: MAX_TOKENS };
    }
    
    return {
      used_tokens: data.used_tokens,
      max_tokens: MAX_TOKENS
    };
  } catch (error) {
    console.error('Error in getTokenUsage:', error);
    return { used_tokens: 0, max_tokens: MAX_TOKENS };
  }
};

export const updateTokenUsage = async (userId: string, newTokens: number): Promise<void> => {
  const supabase = getSupabaseClient();
  
  try {
    // First check if the user has a token usage record
    const { data: existingData, error: fetchError } = await supabase
      .from('token_usage')
      .select('used_tokens')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) {
      throw fetchError;
    }
    
    const currentTokens = existingData?.used_tokens || 0;
    const updatedTokens = currentTokens + newTokens;
    
    if (updatedTokens > MAX_TOKENS) {
      throw new Error('Token limit exceeded');
    }

    if (!existingData) {
      // If no record exists, create one
      const { error: insertError } = await supabase
        .from('token_usage')
        .insert([{
          user_id: userId,
          used_tokens: newTokens
        }]);
      
      if (insertError) throw insertError;
    } else {
      // Update existing record
      const { error: updateError } = await supabase
        .from('token_usage')
        .update({ used_tokens: updatedTokens })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error updating token usage:', error);
    throw error;
  }
};

export const calculateTokens = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
};

export const hasEnoughTokens = async (userId: string, requiredTokens: number): Promise<boolean> => {
  try {
    const { used_tokens } = await getTokenUsage(userId);
    return (used_tokens + requiredTokens) <= MAX_TOKENS;
  } catch (error) {
    console.error('Error checking token availability:', error);
    return false;
  }
}; 