import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Users, DollarSign, TrendingUp, Mic, MessageCircle, Check, X, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalCalls: number;
  totalLeads: number;
  totalRevenue: number;
  callsThisMonth: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCalls: 0,
    totalLeads: 0,
    totalRevenue: 0,
    callsThisMonth: 0,
  });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Fetch call logs
      const { data: calls } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch payments - handle both 'status' and 'payment_status' columns
      let payments: any[] = [];
      try {
        // Try with 'status' column first (production schema)
        const { data: paymentsData, error: statusError } = await supabase
          .from('payments')
          .select('*')
          .eq('status', 'successful');
        
        if (!statusError && paymentsData) {
          payments = paymentsData;
        } else if (statusError?.code === 'PGRST116' || statusError?.message?.includes('column')) {
          // Fallback to 'payment_status' column if 'status' doesn't exist
          const { data: paymentsData2, error: paymentStatusError } = await supabase
            .from('payments')
            .select('*')
            .eq('payment_status', 'successful');

          if (!paymentStatusError && paymentsData2) {
            payments = paymentsData2;
          } else {
            if (import.meta.env.DEV) console.warn('Could not fetch payments:', paymentStatusError);
          }
        } else {
          if (import.meta.env.DEV) console.warn('Could not fetch payments:', statusError);
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error fetching payments:', error);
      }

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      // Calculate stats
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const callsThisMonth = calls?.filter(call => {
        const callDate = new Date(call.created_at);
        return callDate.getMonth() === thisMonth && callDate.getFullYear() === thisYear;
      }).length || 0;

      setStats({
        totalCalls: calls?.length || 0,
        totalLeads: leads?.length || 0,
        totalRevenue,
        callsThisMonth,
      });

      setRecentCalls(calls || []);
      setRecentLeads(leads || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { label: 'Total Calls', value: stats.totalCalls, icon: Phone, color: 'blue' },
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'green' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'purple' },
    { label: 'Calls This Month', value: stats.callsThisMonth, icon: TrendingUp, color: 'orange' },
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your CallWaitingAI command center
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-premium p-6 hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-500 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white rounded-2xl shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-500 border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
              <button className="text-sm text-[#1E3A5F] hover:text-[#2C5F8D] font-medium transition-colors duration-300">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCalls.length > 0 ? (
              recentCalls.slice(0, 5).map((call) => (
                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {call.caller_phone || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(call.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      call.call_status === 'completed' ? 'bg-green-100 text-green-800' :
                      call.call_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.call_status === 'completed' && <Check className="h-3 w-3" />}
                      {call.call_status === 'failed' && <X className="h-3 w-3" />}
                      {call.call_status !== 'completed' && call.call_status !== 'failed' && <Clock className="h-3 w-3" />}
                      {call.call_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="p-3 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium">No calls yet</p>
                <p className="text-sm mt-1">Your call history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-500 border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
              <button className="text-sm text-[#1E3A5F] hover:text-[#2C5F8D] font-medium transition-colors duration-300">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLeads.length > 0 ? (
              recentLeads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          {lead.email || lead.phone_number || 'No contact info'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                      lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status === 'converted' && <Check className="h-3 w-3" />}
                      {lead.status !== 'converted' && <Clock className="h-3 w-3" />}
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="p-3 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium">No leads yet</p>
                <p className="text-sm mt-1">Your leads will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message from Marcy */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-white/20 rounded-full">
            <MessageCircle className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3">Hello! I'm Marcy, your CallWaitingAI assistant</h3>
            <p className="text-white/90 mb-6 text-lg max-w-3xl">
              I'll help you manage calls, capture leads, and automate your voice reception. 
              Would you like to test my voice or chat with me?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  // Open chat widget in voice mode
                  window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'voice' } }));
                }}
                className="px-6 py-3 bg-white text-[#1E3A5F] rounded-xl hover:bg-blue-50 transition-all duration-500 font-medium flex items-center gap-3 shadow-premium hover:shadow-premium-lg"
              >
                <Mic className="h-5 w-5" />
                Test Voice Call
              </button>
              <button 
                onClick={() => {
                  // Open chat widget in chat mode
                  window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'chat' } }));
                }}
                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all font-medium flex items-center gap-3 border border-white/30"
              >
                <MessageCircle className="h-5 w-5" />
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
