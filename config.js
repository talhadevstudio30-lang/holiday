// Environment configuration
// WARNING: In production, use a build tool like Vite or a backend proxy to protect your API key
// This is a simple solution for development. Never commit .env to version control!

// For development: You need to manually create a config-local.js file
// Copy config-local.example.js to config-local.js and add your API key there

// Default configuration (fallback values)
const config = {
    API_KEY: '',
    BASE_URL: 'https://calendarific.com/api/v2'
};

// Try to load local configuration if available
// This will be loaded from config-local.js which should not be committed
if (typeof localConfig !== 'undefined') {
    config.API_KEY = localConfig.API_KEY || config.API_KEY;
    config.BASE_URL = localConfig.BASE_URL || config.BASE_URL;
}

// Validate that required environment variables are set
if (!config.API_KEY) {
    console.error('ERROR: API_KEY is not set');
    console.warn('Please create config-local.js with your API key (see config-local.example.js)');
}

export default config;
