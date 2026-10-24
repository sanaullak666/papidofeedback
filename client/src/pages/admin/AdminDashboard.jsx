import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Users,
  Star,
  Globe,
  Rocket,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];
const PREFERENCE_COLORS = {
  WhatsApp: '#10B981', // green
  'Papido Website': '#3B82F6', // blue
  Both: '#F59E0B', // amber
  'No preference': '#94A3B8', // slate
};

export default function AdminDashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getDashboardAnalytics();
      if (res.success) {
        setData(res);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Skeleton Loaders */}
        <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-slate-200/70 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200/70 rounded-2xl animate-pulse"></div>
          <div className="h-80 bg-slate-200/70 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};
  const recentResponses = data?.recentResponses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              Survey Analytics & Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time consensus metrics comparing WhatsApp vs. Website booking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 8 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Responses */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Responses</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.totalResponses}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Submissions received</span>
        </div>

        {/* Average WhatsApp Satisfaction */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Rating</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.avgWhatsappSatisfaction} <span className="text-sm font-semibold text-slate-400">/ 5</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Satisfaction Score</span>
        </div>

        {/* Website Rating */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Website Rating</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
            {metrics.websitePositiveRatingPct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Rated Excellent / Good</span>
        </div>

        {/* Website Adoption Intent */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Adoption Intent</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
            {metrics.websiteAdoptionIntentPct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Would book via website</span>
        </div>

        {/* Prefer Website */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prefer Website</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.preferWebsitePct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Primary preference</span>
        </div>

        {/* Prefer WhatsApp */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prefer WhatsApp</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.preferWhatsAppPct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Primary preference</span>
        </div>

        {/* Prefer Both */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prefer Both</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
            {metrics.preferBothPct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Hybrid consensus</span>
        </div>

        {/* Launch Support */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Launch Support</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
            {metrics.launchSupportPct}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Recommend launch</span>
        </div>
      </div>

      {/* Row 1 Charts: Preferred Booking Method & Launch Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Preference Pie/Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Preferred Booking Method</h2>
              <p className="text-xs text-slate-500">WhatsApp vs Website vs Both</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Consensus
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.bookingPreference || []} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="method" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} Responses`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {(charts.bookingPreference || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PREFERENCE_COLORS[entry.method] || CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Launch Recommendation Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">“What Should Papido Do?”</h2>
              <p className="text-xs text-slate-500">Key user strategic recommendations</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Key Question
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts.launchRecommendation || []}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="recommendation"
                  type="category"
                  width={150}
                  tick={{ fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(val) => [`${val} Votes`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: WhatsApp Satisfaction & Website Opinion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Satisfaction Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">WhatsApp Booking Satisfaction</h2>
              <p className="text-xs text-slate-500">1 (Very dissatisfied) to 5 (Very satisfied)</p>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-emerald-500" />
              <span>Avg: {metrics.avgWhatsappSatisfaction}</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.whatsappSatisfaction || []} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} Responses`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Website Opinion Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Website Overall Opinion</h2>
              <p className="text-xs text-slate-500">User ratings after previewing the new website</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {metrics.websitePositiveRatingPct}% Positive
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.websiteOpinion || []} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="opinion" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} Responses`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Ranked Requested Features & Timeline Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Requested Features */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Most Requested Features</h2>
              <p className="text-xs text-slate-500">Ranked feature demand for the new system</p>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3 pt-1">
            {(charts.rankedFeatures || []).slice(0, 6).map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <span className="text-slate-400 font-mono">#{idx + 1}</span>
                    <span>{feat.feature}</span>
                  </span>
                  <span className="text-slate-500">
                    {feat.count} requests ({feat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, feat.percentage))}%` }}
                  ></div>
                </div>
              </div>
            ))}

            {(!charts.rankedFeatures || charts.rankedFeatures.length === 0) && (
              <div className="text-center py-6 text-xs text-slate-400">
                No feature requests submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Responses Timeline Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submission Timeline Trends</h2>
              <p className="text-xs text-slate-500">Responses recorded over the last 14 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.trends || []} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date_label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} Submissions`, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#F59E0B' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Recent Feedback Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Responses</h2>
            <p className="text-xs text-slate-500">Latest feedback submissions from riders</p>
          </div>

          <button
            onClick={() => onNavigate('/admin/feedback')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Feedback</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Feedback Ref</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">WhatsApp Rating</th>
                <th className="py-2.5 px-3">Website Rating</th>
                <th className="py-2.5 px-3">Preferred Method</th>
                <th className="py-2.5 px-3">Recommendation</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentResponses.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onNavigate(`/admin/feedback?id=${item.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.feedback_ref}</td>
                  <td className="py-3 px-3 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-emerald-500" />
                      <span>{item.whatsapp_satisfaction}/5</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{item.website_opinion}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{item.preferred_booking_method}</td>
                  <td className="py-3 px-3 font-medium text-slate-700 max-w-[180px] truncate">
                    {item.launch_recommendation}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Reviewed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
