import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, DollarSign, Calendar, Check, X, Clock } from 'lucide-react';

export function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [planType, setPlanType] = useState('basic');
  const [creatingPayment, setCreatingPayment] = useState(false);

  useEffect(() => {
    loadPayments();

    const subscription = supabase
      .channel('payments_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payments'
      }, () => {
        loadPayments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadPayments() {
    try {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createPaymentLink() {
    setCreatingPayment(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const plans = {
        basic: { amount: 49.99, name: 'Basic Plan' },
        professional: { amount: 99.99, name: 'Professional Plan' },
        enterprise: { amount: 199.99, name: 'Enterprise Plan' },
      };

      const plan = plans[planType as keyof typeof plans];

      const { data, error } = await supabase.functions.invoke('create-payment-link', {
        body: {
          amount: plan.amount,
          currency: 'USD',
          email: user?.email,
          planType: planType,
          userId: user?.id
        }
      });

      if (error) throw error;

      const paymentLink = data?.data?.paymentLink;
      if (paymentLink) {
        window.open(paymentLink, '_blank');
      }

      setShowCreateModal(false);
      loadPayments();
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert('Failed to create payment link. Please try again.');
    } finally {
      setCreatingPayment(false);
    }
  }

  const plans = [
    {
      name: 'Basic',
      value: 'basic',
      price: '$49.99',
      features: ['Up to 100 calls/month', 'Basic analytics', 'Email support']
    },
    {
      name: 'Professional',
      value: 'professional',
      price: '$99.99',
      features: ['Up to 500 calls/month', 'Advanced analytics', 'Priority support', 'Custom integrations']
    },
    {
      name: 'Enterprise',
      value: 'enterprise',
      price: '$199.99',
      features: ['Unlimited calls', 'Full analytics suite', '24/7 support', 'White-label solution', 'Custom AI training']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-600">Manage subscriptions and payment history</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2C5F8D] transition-all duration-300 shadow-premium hover:shadow-premium-lg"
        >
          <CreditCard className="h-4 w-4" />
          New Payment
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-500">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {payment.flutterwave_tx_ref?.substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {payment.plan_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {Number(payment.amount).toFixed(2)} {payment.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${
                        payment.payment_status === 'successful' ? 'bg-green-100 text-green-800' :
                        payment.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                        payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.payment_status === 'successful' && <Check className="h-3 w-3" />}
                        {payment.payment_status === 'failed' && <X className="h-3 w-3" />}
                        {payment.payment_status === 'pending' && <Clock className="h-3 w-3" />}
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No payments yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-premium-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => setPlanType(plan.value)}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 ${
                    planType === plan.value
                      ? 'border-[#1E3A5F] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-[#1E3A5F] mb-4">{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={createPaymentLink}
              disabled={creatingPayment}
              className="w-full bg-[#1E3A5F] text-white py-3 px-4 rounded-lg hover:bg-[#2C5F8D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-premium hover:shadow-premium-lg"
            >
              {creatingPayment ? 'Creating Payment Link...' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
