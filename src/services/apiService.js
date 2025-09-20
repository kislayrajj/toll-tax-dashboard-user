// The base URL of your deployed Render server
const API_BASE_URL = 'https://toll-tax-server.onrender.com/api';

/**
 * A centralized place for all API calls.
 */
export const apiService = {
  /**
   * Handles the response from the fetch API, parsing JSON and throwing errors.
   */
  _handleResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    return response.json();
  },

  /**
   * Fetches data from a given endpoint.
   * @param {string} endpoint - The API endpoint to fetch from (e.g., '/vehicles').
   * @returns {Promise<any>} The JSON data from the API.
   */
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return apiService._handleResponse(response);
  },

  /**
   * Sends data to a given endpoint using POST.
   * @param {string} endpoint - The API endpoint to send to.
   * @param {object} body - The JSON body to send.
   * @returns {Promise<any>} The JSON data from the API.
   */
  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return apiService._handleResponse(response);
  },
  
  // You can add patch and delete methods here following the same pattern
  patch: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return apiService._handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
    });
    return apiService._handleResponse(response);
  },
};