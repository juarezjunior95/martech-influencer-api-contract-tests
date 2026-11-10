import http from 'k6/http';

/**
 * Builds a complete URL by concatenating the base URL with the endpoint path
 * @param {string} baseUrl - The base URL from configuration
 * @param {string} endpointPath - The endpoint path from configuration
 * @returns {string} Complete URL
 */
export function buildUrl(baseUrl, endpointPath) {
  return `${baseUrl}${endpointPath}`;
}

/**
 * Randomizes specified filter keys in query params based on randomFilters configuration
 * If possibleValues are provided in the config, randomly selects from the list, otherwise generates unique random value
 * @param {object} queryParams - Query parameters object
 * @param {object} randomFilters - Object mapping filter keys to arrays of possible values
 *   (e.g., { 'filter[country]': ['ABI', 'BRA', 'USA'] })
 * @returns {object} Query parameters with specified filters randomized
 */
export function randomizeFilters(queryParams, randomFilters = {}) {
  if (!queryParams || typeof queryParams !== 'object' || !randomFilters || Object.keys(randomFilters).length === 0) {
    return queryParams;
  }
  
  const filtersToRandomize = Object.keys(randomFilters);

  // Check if any of the filters to randomize actually exist in queryParams
  const hasFiltersToRandomize = filtersToRandomize.some(filterKey => queryParams[filterKey] !== undefined);
  if (!hasFiltersToRandomize) {
    return queryParams;
  }

  const randomizedParams = { ...queryParams };

  // Randomize each specified filter that exists
  filtersToRandomize.forEach(filterKey => {
    if (randomizedParams[filterKey] !== undefined) {
      const possibleValues = randomFilters[filterKey];
      // If possible values are provided for this filter, randomly select from the list
      if (possibleValues && Array.isArray(possibleValues) && possibleValues.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        randomizedParams[filterKey] = possibleValues[randomIndex];
      } else {
        // Otherwise, generate unique random value
        const timestamp = Date.now();
        const randomComponent = Math.floor(Math.random() * 100000); // 0-99999
        const randomValue = `RANDOM_${timestamp}_${randomComponent}_${filterKey.replace(/[\[\]]/g, '_')}`;
        randomizedParams[filterKey] = randomValue;
      }
    }
  });

  return randomizedParams;
}

/**
 * Converts query parameters object into a URL query string
 * @param {object} queryParams - Object containing key-value pairs for query parameters
 * @returns {string} URL-encoded query string or empty string if no params
 */
export function buildQueryString(queryParams) {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return '';
  }
  
  const parts = [];
  Object.keys(queryParams).forEach(key => {
    const value = queryParams[key];
    if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  
  return parts.join('&');
}

/**
 * Selects query parameters for a specific VU by distributing them sequentially across VUs
 * Uses modulo operation to cycle through available query param sets
 * @param {object} configQueryParams - Array of query params from configuration
 * @param {number} vuIndex - Zero-based index of the current virtual user
 * @returns {object} Query parameters object selected for this VU
 */
export function selectQueryParamsForVu(configQueryParams, vuIndex) {
  if (!configQueryParams || configQueryParams.length === 0) {
    return {};
  }
  
  const queryParamsIndex = vuIndex % configQueryParams.length;
  return configQueryParams[queryParamsIndex];
}

/**
 * Performs a GET request to the specified endpoint with query parameters
 * Randomizes specified filters before building the final URL
 * @param {string} endpoint - The endpoint path to call
 * @param {object} queryParams - Query parameters to append to the URL
 * @param {string} baseUrl - Base URL for building the complete URL
 * @param {object} options - Optional configuration
 * @param {object} options.headers - Custom headers (defaults to Content-Type and Accept)
 * @param {string} options.timeout - Request timeout (defaults to '120s')
 * @param {object} options.randomFilters - Object mapping filter keys to arrays of possible values
 *   (e.g., { 'filter[country]': ['ABI', 'BRA', 'USA'] })
 * @returns {object} HTTP response object
 */
export function callEndpoint(endpoint, queryParams, baseUrl, options = {}) {
  const randomFilters = options.randomFilters || {};

  // Only randomize if there are filters to randomize
  const finalQueryParams = Object.keys(randomFilters).length > 0
    ? randomizeFilters(queryParams, randomFilters)
    : queryParams;

  const url = buildUrl(baseUrl, endpoint);
  const queryString = buildQueryString(finalQueryParams);
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const headers = { ...defaultHeaders, ...options.headers };
  const timeout = options.timeout || '120s';
  
  const requestOptions = {
    headers,
    timeout
  };
  
  return http.get(fullUrl, requestOptions);
}
