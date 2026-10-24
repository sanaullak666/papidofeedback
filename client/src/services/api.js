const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic request helper with JSON parsing and authentication headers
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('papido_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle session expiry
    if (response.status === 401 && endpoint.startsWith('/admin') && !endpoint.includes('/login')) {
      localStorage.removeItem('papido_admin_token');
      localStorage.removeItem('papido_admin_user');
      window.dispatchEvent(new CustomEvent('papido:session_expired'));
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Public Survey APIs
  getPublicSettings: () => request('/survey/settings'),
  submitSurvey: (payload) => request('/survey/submit', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin Auth
  adminLogin: (email, password) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getAdminMe: () => request('/admin/me'),

  // Admin Dashboard & Management
  getDashboardAnalytics: () => request('/admin/dashboard'),
  getFeedbackList: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
    ).toString();
    return request(`/admin/feedback${query ? `?${query}` : ''}`);
  },
  getFeedbackById: (id) => request(`/admin/feedback/${id}`),
  updateFeedbackStatus: (id, payload) =>
    request(`/admin/feedback/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteFeedback: (id) => request(`/admin/feedback/${id}`, { method: 'DELETE' }),
  getActivityLogs: () => request('/admin/logs'),
  updateSettings: (payload) =>
    request('/admin/settings', { method: 'PATCH', body: JSON.stringify(payload) }),

  // File Exports (direct URL download triggers)
  getExportCsvUrl: () => {
    const token = localStorage.getItem('papido_admin_token');
    return `${API_BASE_URL}/admin/export/csv?token=${encodeURIComponent(token || '')}`;
  },
  getExportExcelUrl: () => {
    const token = localStorage.getItem('papido_admin_token');
    return `${API_BASE_URL}/admin/export/excel?token=${encodeURIComponent(token || '')}`;
  },
  
  // Direct file blob download with auth header
  downloadExport: async (type = 'excel') => {
    const token = localStorage.getItem('papido_admin_token');
    const url = `${API_BASE_URL}/admin/export/${type}`;
    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export download failed (${response.status})`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `papido_survey_responses_${new Date().toISOString().slice(0, 10)}.${
      type === 'excel' ? 'xlsx' : 'csv'
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },
};
