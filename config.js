// config.js
// This file is intentionally checked in with safe placeholder defaults.
// Put your real API key in config-local.js (which is loaded as a plain
// <script> before this module, and is typically kept out of version control).
//
// Get a free API key from https://calendarific.com/ (or swap BASE_URL /
// response parsing in script.js for the free https://date.nager.at API
// if you'd rather not use an API key at all).

const config = {
    API_KEY: (typeof window !== 'undefined' && window.LOCAL_CONFIG && window.LOCAL_CONFIG.API_KEY)
        ? window.LOCAL_CONFIG.API_KEY
        : 'YOUR_API_KEY_HERE',
    BASE_URL: (typeof window !== 'undefined' && window.LOCAL_CONFIG && window.LOCAL_CONFIG.BASE_URL)
        ? window.LOCAL_CONFIG.BASE_URL
        : 'https://calendarific.com/api/v2'
};

export default config;