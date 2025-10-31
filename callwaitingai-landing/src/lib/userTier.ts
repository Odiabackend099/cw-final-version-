import { supabase } from './supabase';

export type UserTier = 'free' | 'professional' | 'pro' | 'promax';

/**
 * Determines user's subscription tier based on payment history
 * @param userId - User ID to check
 * @returns 'free' (Starter), 'professional', or 'pro'
 */
export async function getUserTier(userId: string): Promise<UserTier> {
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

    if (error || !payment) {
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
  } catch (error) {
    console.error('Error determining user tier:', error);
    // Default to free tier on error
    return 'free';
  }
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
