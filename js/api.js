const API_URL = '/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;

// Helper for API calls
const fetchAPI = async (endpoint, method = 'GET', body = null, requireAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requireAuth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            throw new Error('Not authorized, no token');
        }
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
