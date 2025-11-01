import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Mail, Phone as PhoneIcon, Building, Plus, X, Check, Clock } from 'lucide-react';

export function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    message: '',
  });

  useEffect(() => {
    loadLeads();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads'
      }, () => {
        loadLeads();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadLeads() {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      setLeads(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          ...newLead,
          source: 'manual',
          status: 'new'
        });

      if (error) throw error;

      setShowAddModal(false);
      setNewLead({
        full_name: '',
        email: '',
        phone_number: '',
        company_name: '',
        message: '',
      });

      loadLeads();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error adding lead:', error);
    }
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;
      loadLeads();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error updating lead:', error);
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track all your leads</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2C5F8D] transition-all duration-300 shadow-premium hover:shadow-premium-lg"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl shadow-premium p-6 hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{lead.full_name}</h3>
                    <p className="text-xs text-gray-500">{lead.source}</p>
                  </div>
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer transition-all duration-300 ${
                    lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                    lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                {lead.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{lead.phone_number}</span>
                  </div>
                )}
                {lead.company_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{lead.company_name}</span>
                  </div>
                )}
              </div>

              {lead.message && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {lead.message}
                </p>
              )}

              <p className="mt-3 text-xs text-gray-500">
                Created: {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No leads yet</p>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-premium-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLead.full_name}
                  onChange={(e) => setNewLead({ ...newLead, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newLead.phone_number}
                  onChange={(e) => setNewLead({ ...newLead, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={newLead.company_name}
                  onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A5F] text-white py-2 px-4 rounded-lg hover:bg-[#2C5F8D] transition-all duration-300 shadow-premium hover:shadow-premium-lg"
              >
                Add Lead
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
