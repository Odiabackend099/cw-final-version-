import { supabase } from './supabase';

export type UserTier = 'free' | 'professional' | 'pro';

/**
 * Determines user's subscription tier based on payment history
 * @param userId - User ID to check
 * @returns 'free' (Starter), 'professional', or 'pro'
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  try {
    // Check payments table for most recent successful payment
    const { data: payment, error } = await supabase
      .from('payments')
      .select('plan_type')
      .eq('user_id', userId)
      .eq('payment_status', 'successful')
      .order('paid_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !payment) {
      // No successful payment found = free tier
      return 'free';
    }

    // Map plan_type to tier
    const planType = payment.plan_type?.toLowerCase();

    if (planType === 'professional') {
      return 'professional';
    } else if (planType === 'pro') {
      return 'pro';
    }

    // Default to free for 'starter' or unknown plans
    return 'free';
  } catch (error) {
    console.error('Error determining user tier:', error);
    // Default to free tier on error
    return 'free';
  }
}

/**
 * Checks if user is on a paid tier (Professional or Pro)
 * @param userId - User ID to check
 * @returns true if user is on paid tier
 */
export async function isPaidTier(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === 'professional' || tier === 'pro';
}

/**
 * Checks if user can use Minimax TTS (paid tiers only)
 * @param userId - User ID to check
 * @returns true if user can use Minimax TTS
 */
export async function canUseMinimaxTTS(userId: string): Promise<boolean> {
  return isPaidTier(userId);
}
