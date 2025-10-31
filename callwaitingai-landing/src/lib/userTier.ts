import { supabase } from './supabase';

export type UserTier = 'free' | 'professional' | 'pro' | 'promax';

/**
 * Determines user's subscription tier based on payment history
 * @param userId - User ID to check
 * @returns 'free' (Starter), 'professional', or 'pro'
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  // Retry logic with exponential backoff (3 attempts)
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check payments table for most recent successful payment
      // Note: Actual schema uses 'status' not 'payment_status', and 'amount' to determine tier
      const { data: payment, error } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('user_id', userId)
        .eq('status', 'successful')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // If query succeeds (even with no payment), process result
      if (!error) {
        if (!payment) {
          // No successful payment found = free tier
          return 'free';
        }

        // Map amount to tier (based on pricing structure)
        const amount = payment.amount;

        if (amount >= 180) {
          return 'promax'; // $180+ = ProMax tier (gets Minimax TTS)
        } else if (amount >= 80) {
          return 'pro'; // $80+ = Pro tier (gets Minimax TTS)
        } else if (amount >= 49) {
          return 'professional'; // $49+ = Professional tier (Vapi default)
        }

        // Default to free for smaller amounts
        return 'free';
      }

      // If error is 406 (Not Acceptable) or no rows found, retry with delay
      // PostgrestError doesn't have status property, check code or message instead
      const isRetryableError = error.code === 'PGRST116' || 
                               error.message?.includes('406') ||
                               error.message?.includes('Not Acceptable');
      
      if (isRetryableError) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          // Exponential backoff: 250ms, 500ms, 1000ms
          await new Promise(resolve => setTimeout(resolve, 250 * Math.pow(2, attempt)));
          continue;
        }
      }

      // For other errors or final attempt, return free tier
      if (import.meta.env.DEV) {
        console.warn('Payment query error (non-critical, using free tier):', error.message);
      }
      return 'free';
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 250 * Math.pow(2, attempt)));
        continue;
      }
    }
  }

  // After all retries failed, default to free tier
  if (import.meta.env.DEV && lastError) {
    console.warn('Error determining user tier after retries (using free tier):', lastError);
  }
  return 'free';
}

/**
 * Checks if user is on a paid tier (Professional, Pro, or Promax)
 * @param userId - User ID to check
 * @returns true if user is on paid tier
 */
export async function isPaidTier(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === 'professional' || tier === 'pro' || tier === 'promax';
}

/**
 * Checks if user can use Minimax TTS (paid tiers only)
 * @param userId - User ID to check
 * @returns true if user can use Minimax TTS
 */
export async function canUseMinimaxTTS(userId: string): Promise<boolean> {
  return isPaidTier(userId);
}
