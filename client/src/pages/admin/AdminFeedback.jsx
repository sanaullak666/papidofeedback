import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Star,
  MessageSquare,
  Globe,
  RefreshCw,
  Phone,
  Mail,
  User,
  Calendar,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminFeedback({ initialFeedbackId }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    preferred_booking_method: 'All',
    whatsapp_satisfaction: 'All',
    website_opinion: 'All',
    launch_recommendation: 'All',
    date_from: '',
    date_to: '',
  });

  const [activeNotes, setActiveNotes] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  const fetchFeedback = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };
      const res = await api.getFeedbackList(params);
      if (res.success) {
        setFeedbackList(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to load feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(1);
  }, [filters]);

  useEffect(() => {
    if (initialFeedbackId) {
      openDetailModal(initialFeedbackId);
    }
  }, [initialFeedbackId]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const openDetailModal = async (id) => {
    try {
      const res = await api.getFeedbackById(id);
      if (res.success) {
        setSelectedItem(res.data);
        setActiveNotes(res.data.admin_notes || '');
        setActiveStatus(res.data.status || 'New');
      }
    } catch (err) {
      showNotification('error', 'Could not open feedback details.');
    }
  };

  const handleUpdateStatus = async (id, newStatus, notes) => {
    try {
      const res = await api.updateFeedbackStatus(id, {
        status: newStatus,
        admin_notes: notes,
      });
      if (res.success) {
        showNotification('success', 'Feedback updated successfully.');
        // Update local list
        setFeedbackList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus, admin_notes: notes } : item))
        );
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem({ ...selectedItem, status: newStatus, admin_notes: notes });
        }
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to update feedback status.');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await api.deleteFeedback(itemToDelete.id);
      if (res.success) {
        showNotification('success', res.message || 'Feedback deleted.');
        setItemToDelete(null);
        if (selectedItem && selectedItem.id === itemToDelete.id) {
          setSelectedItem(null);
        }
        fetchFeedback(pagination.page);
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete response.');
    }
  };

  const handleExport = async (type) => {
    try {
      setIsExporting(true);
      await api.downloadExport(type);
      showNotification('success', `Export generated and downloaded successfully (${type.toUpperCase()}).`);
    } catch (err) {
      showNotification('error', `Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      preferred_booking_method: 'All',
      whatsapp_satisfaction: 'All',
      website_opinion: 'All',
      launch_recommendation: 'All',
      date_from: '',
      date_to: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in-up">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center space-x-2 animate-fade-in-up ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-red-900 text-red-100 border-red-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            Feedback Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review detailed responses, manage status tags, and export structured records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Panel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by Feedback Ref, Name, Mobile, Email, or Suggestions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          {/* Quick status filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
            {['All', 'New', 'Reviewed', 'Important', 'Archived'].map((st) => (
              <button
                key={st}
                onClick={() => setFilters({ ...filters, status: st })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filters.status === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Preferred Method</label>
            <select
              value={filters.preferred_booking_method}
              onChange={(e) => setFilters({ ...filters, preferred_booking_method: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Methods</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Papido Website">Papido Website</option>
              <option value="Both">Both</option>
              <option value="No preference">No preference</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">WhatsApp Rating</label>
            <select
              value={filters.whatsapp_satisfaction}
              onChange={(e) => setFilters({ ...filters, whatsapp_satisfaction: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 - Very satisfied</option>
              <option value="4">4 - Satisfied</option>
              <option value="3">3 - Neutral</option>
              <option value="2">2 - Dissatisfied</option>
              <option value="1">1 - Very dissatisfied</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Website Opinion</label>
            <select
              value={filters.website_opinion}
              onChange={(e) => setFilters({ ...filters, website_opinion: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Opinions</option>
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Recommendation</label>
            <select
              value={filters.launch_recommendation}
              onChange={(e) => setFilters({ ...filters, launch_recommendation: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Recommendations</option>
              <option value="Launch alongside WhatsApp">Launch alongside WhatsApp</option>
              <option value="Move primarily to website">Move primarily to website</option>
              <option value="Launch after improvements">Launch after improvements</option>
              <option value="Continue with WhatsApp">Continue with WhatsApp</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>
        </div>

        {/* Date Filter & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Date Range:</span>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="p-1.5 rounded-lg border border-slate-200 bg-white"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="p-1.5 rounded-lg border border-slate-200 bg-white"
            />
          </div>

          <button
            onClick={resetFilters}
            className="text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Feedback ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">WhatsApp Sat.</th>
                <th className="py-3 px-4">Website Rating</th>
                <th className="py-3 px-4">Preferred Method</th>
                <th className="py-3 px-4">Adoption Intent</th>
                <th className="py-3 px-4">Recommendation</th>
                <th className="py-3 px-4">Name / Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading survey records...</span>
                  </td>
                </tr>
              ) : feedbackList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No survey responses match your filter criteria.
                  </td>
                </tr>
              ) : (
                feedbackList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.feedback_ref}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-emerald-500" />
                        <span>{item.whatsapp_satisfaction} / 5</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {item.website_opinion}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                      {item.preferred_booking_method}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {item.website_adoption_intent}
                    </td>
                    <td className="py-3.5 px-4 max-w-[170px] truncate font-medium text-slate-700">
                      {item.launch_recommendation}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.willing_to_contact && item.contact_name ? (
                        <div className="font-semibold text-slate-900 flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.contact_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Anonymous</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value, item.admin_notes)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          item.status === 'New'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.status === 'Reviewed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'Important'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Important">Important</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openDetailModal(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
                        title="View Full Response"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Response"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong>{feedbackList.length}</strong> of <strong>{pagination.total}</strong> responses
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchFeedback(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchFeedback(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Feedback Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {selectedItem.feedback_ref}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Submitted {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1 WhatsApp Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Step 1: Current WhatsApp Experience</span>
              </h3>
              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Satisfaction Rating:</strong> {selectedItem.whatsapp_satisfaction} / 5
                </div>
                <div>
                  <strong>Likes:</strong>{' '}
                  {Array.isArray(selectedItem.whatsapp_likes)
                    ? selectedItem.whatsapp_likes.join(', ')
                    : selectedItem.whatsapp_likes || 'None'}
                  {selectedItem.whatsapp_likes_other ? ` (Other: ${selectedItem.whatsapp_likes_other})` : ''}
                </div>
                <div>
                  <strong>Difficulties:</strong>{' '}
                  {Array.isArray(selectedItem.whatsapp_difficulties)
                    ? selectedItem.whatsapp_difficulties.join(', ')
                    : selectedItem.whatsapp_difficulties || 'None'}
                  {selectedItem.whatsapp_difficulties_other
                    ? ` (Other: ${selectedItem.whatsapp_difficulties_other})`
                    : ''}
                </div>
              </div>
            </div>

            {/* Step 3 Website Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Step 3: New Website Preview Opinion</span>
              </h3>
              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Explored Website:</strong> {selectedItem.explored_website ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Overall Opinion:</strong> {selectedItem.website_opinion}
                </div>
                <div>
                  <strong>Ease of Use:</strong> {selectedItem.website_ease_of_use}
                </div>
                <div>
                  <strong>Likes:</strong>{' '}
                  {Array.isArray(selectedItem.website_likes)
                    ? selectedItem.website_likes.join(', ')
                    : selectedItem.website_likes || 'None'}
                  {selectedItem.website_likes_other ? ` (Other: ${selectedItem.website_likes_other})` : ''}
                </div>
                {selectedItem.website_improvements && (
                  <div className="pt-1">
                    <strong>Suggested Improvements:</strong>
                    <p className="mt-0.5 p-2 rounded bg-white border border-slate-200 text-slate-800 italic">
                      "{selectedItem.website_improvements}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4 & 5 Preference & Strategic Decision */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Step 4 & 5: Preference & Strategic Direction
              </h3>
              <div className="text-xs text-slate-800 space-y-1">
                <div>
                  <strong>Preferred Method:</strong> {selectedItem.preferred_booking_method}
                </div>
                <div>
                  <strong>Would Use Website If Launched:</strong> {selectedItem.website_adoption_intent}
                </div>
                <div>
                  <strong>Continue WhatsApp:</strong> {selectedItem.continue_whatsapp}
                </div>
                <div>
                  <strong>Both More Convenient:</strong> {selectedItem.both_convenience}
                </div>
                <div className="pt-1">
                  <strong>Strategic Recommendation:</strong>
                  <span className="ml-1 font-bold text-amber-950 underline decoration-amber-400">
                    {selectedItem.launch_recommendation}
                  </span>
                </div>
                {selectedItem.most_important_improvement && (
                  <div className="pt-1">
                    <strong>Most Important Improvement:</strong>
                    <p className="mt-0.5 p-2 rounded bg-white border border-slate-200 text-slate-800 italic">
                      "{selectedItem.most_important_improvement}"
                    </p>
                  </div>
                )}
                {selectedItem.additional_feedback && (
                  <div className="pt-1">
                    <strong>Additional Feedback:</strong>
                    <p className="mt-0.5 p-2 rounded bg-white border border-slate-200 text-slate-800 italic">
                      "{selectedItem.additional_feedback}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Contact Permission</h3>
              {selectedItem.willing_to_contact ? (
                <div className="space-y-1 text-slate-700">
                  <div className="text-emerald-700 font-semibold">✓ Willing to be contacted</div>
                  <div>
                    <strong>Name:</strong> {selectedItem.contact_name || 'N/A'}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {selectedItem.contact_mobile || 'N/A'}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedItem.contact_email || 'N/A'}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic">Participant opted not to provide contact details.</p>
              )}
            </div>

            {/* Admin Notes & Status Update */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Status</label>
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  className="text-xs p-1.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Important">Important</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={activeNotes}
                  onChange={(e) => setActiveNotes(e.target.value)}
                  placeholder="Internal team notes on this feedback..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedItem.id, activeStatus, activeNotes)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Delete Feedback Record?</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete feedback reference{' '}
              <strong className="font-mono text-slate-900">{itemToDelete.feedback_ref}</strong>? This action will be logged in admin audit history.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
