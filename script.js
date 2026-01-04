// Set current date in footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// API Configuration
const API_KEY = 'jjhy20GVzUEwu6Bv488JbksVKYU63XZ9';
const BASE_URL = 'https://calendarific.com/api/v2';

// Country data (some popular countries with ISO codes)
const countries = [
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' }
];

// Years range (2006 to 2030)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => currentYear - 20 + i);

// App state
let allHolidays = [];
let filteredHolidays = [];
let selectedCountry = 'PK';
let selectedYear = '2026';
const holidayCache = {}; // Cache for API responses

// DOM Elements
const countrySelect = document.getElementById('country-select');
const yearSelect = document.getElementById('year-select');
const fetchButton = document.getElementById('fetch-btn');
const filtersSection = document.getElementById('filters-section');
const holidaysContainer = document.getElementById('holidays-container');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('no-results');
const noDataElement = document.getElementById('no-data');
const totalHolidaysElement = document.getElementById('total-holidays');
const currentCountryElement = document.getElementById('current-country');
const currentYearElement = document.getElementById('current-year');
const monthFilter = document.getElementById('month-filter');
const typeFilter = document.getElementById('type-filter');
const searchInput = document.getElementById('search-input');
const resetFiltersButton = document.getElementById('reset-filters');
const loadingDetailsElement = document.getElementById('loading-details');
// current-date
// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    populateCountries();
    populateYears();
    setDefaultSelections();
    Overlimit();
    // Add event listeners
    countrySelect.addEventListener('change', handleCountryChange);
    yearSelect.addEventListener('change', handleYearChange);
    fetchButton.addEventListener('click', fetchHolidays);
    monthFilter.addEventListener('change', filterHolidays);
    typeFilter.addEventListener('change', filterHolidays);
    searchInput.addEventListener('input', debounce(filterHolidays, 300));
    resetFiltersButton.addEventListener('click', resetFilters);

    // Set initial state
    updateCurrentSelectionDisplay();
});

// Populate country dropdown
function populateCountries() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.flag} ${country.name}`;
        countrySelect.appendChild(option);
    });
}

// Populate year dropdown
function populateYears() {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Overlimit function
function Overlimit() {
    if (selectedYear > 2030) {
        yearSelect.value = '2030'
        alert(
            "⚠️ Oops! The current year data is not available yet.\n\n" +
            "📅 You can still explore data from previous years anytime.\n\n" +
            "💡 Need access to more years?\n" +
            "👉 Reach out to us using the Feedback button in the footer.\n\n" +
            "🙏 Thanks for your patience!"
        );
        document.getElementById('current-date').textContent = 'Oops! Current year is not available';
        document.getElementById('current-date').style.color = 'red';
    }
}

// Set default selections
function setDefaultSelections() {
    countrySelect.value = 'PK';
    yearSelect.value = new Date().getFullYear();
    selectedCountry = 'PK';
    selectedYear = new Date().getFullYear();
}

// Handle country change
function handleCountryChange() {
    selectedCountry = countrySelect.value;
    const country = countries.find(c => c.code === selectedCountry);

    if (country) {
        updateCurrentSelectionDisplay();
    }
}

// Handle year change
function handleYearChange() {
    selectedYear = yearSelect.value;
    updateCurrentSelectionDisplay();
}

// Update current selection display
function updateCurrentSelectionDisplay() {
    const country = countries.find(c => c.code === selectedCountry);
    currentCountryElement.innerHTML = `<i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                <span class="font-medium">Country: <span class="text-blue-600">${country ? country.flag + ' ' + country.name : selectedCountry}</span></span>`;

    currentYearElement.innerHTML = `<i class="fas fa-calendar-alt text-green-500 mr-2"></i>
                <span class="font-medium">Year: <span class="text-green-600">${selectedYear}</span></span>`;
}

// Fetch holidays from API
async function fetchHolidays() {
    try {
        // Create a cache key
        const cacheKey = `${selectedCountry}-${selectedYear}`;

        // Check cache first
        if (holidayCache[cacheKey]) {
            console.log('Serving from cache:', cacheKey);
            const data = holidayCache[cacheKey];
            processHolidayData(data);
            return;
        }

        // Show loading state
        loadingElement.classList.remove('hidden');
        loadingDetailsElement.textContent = `Fetching holidays for ${countries.find(c => c.code === selectedCountry).name} (${selectedYear})...`;
        noDataElement.classList.add('hidden');
        holidaysContainer.innerHTML = '';
        filtersSection.classList.add('hidden');

        const API_URL = `${BASE_URL}/holidays?&api_key=${API_KEY}&country=${selectedCountry}&year=${selectedYear}`;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Save to cache
        if (data.response && data.response.holidays) {
            holidayCache[cacheKey] = data;
            processHolidayData(data);
        } else {
            throw new Error('No holiday data found for the selected country and year.');
        }

    } catch (error) {
        console.error('Error fetching holidays:', error);
        displayError(error.message);
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function processHolidayData(data) {
    if (data.response && data.response.holidays) {
        allHolidays = data.response.holidays;
        filteredHolidays = [...allHolidays];

        // Update total holidays count
        totalHolidaysElement.textContent = allHolidays.length;

        // Show filters section
        filtersSection.classList.remove('hidden');

        // Display holidays
        displayHolidays(filteredHolidays);

        // Reset filters
        resetFilters();
    }
}

// Display holidays in the UI
function displayHolidays(holidays) {
    if (holidays.length === 0) {
        noResultsElement.classList.remove('hidden');
        holidaysContainer.innerHTML = '';
        return;
    }

    noResultsElement.classList.add('hidden');
    noDataElement.classList.add('hidden');

    // Sort holidays by date
    holidays.sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));

    // Create holiday cards
    holidaysContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    holidays.forEach(holiday => {
        const holidayCard = createHolidayCard(holiday);
        fragment.appendChild(holidayCard);
    });
    holidaysContainer.appendChild(fragment);
}

// Create a holiday card element
function createHolidayCard(holiday) {
    const card = document.createElement('div');
    // Format date
    const date = new Date(holiday.date.iso);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get month for color coding
    const month = date.getMonth() + 1;
    const colorClasses = getColorClassByMonth(month);

    // Get icon based on holiday type
    const iconClass = getIconByType(holiday.type[0]);

    card.innerHTML = `
    <div class="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <!-- Header with gradient -->
        <div class="${colorClasses.bg} snap-x p-4 md:p-6 scroll-pl-6 scroll-pr-6 relative overflow-auto">
            <!-- Subtle pattern overlay -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25px 25px, white 2%, transparent 3%); background-size: 30px 30px;"></div>
            </div>
            
            <div class="relative flex justify-between items-start">
                <div class="pr-4">
                    <!-- Category badge -->
                    <span class="inline-block px-3 py-1.5 ${colorClasses.text} ${colorClasses.bgLight} rounded-full text-xs font-semibold mb-3 tracking-wide">
                        ${holiday.type[0]}
                    </span>
                    
                    <!-- Holiday name -->
                    <h3 class="text-xl md:text-2xl font-semibold text-white mb-2 px-2 text-wrap wrap-anywhere break-words hyphens-auto">${holiday.name}</h3>
                    
                    <!-- Date in header (mobile visible) -->
                    <div class="flex items-center text-white/90 text-sm md:hidden">
                        <i class="fas fa-calendar-alt mr-2 text-sm"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                
                <!-- Icon with subtle background -->
                <div class="text-white text-4xl px-4 py-3 rounded-xl m-1 bg-white/20 backdrop-blur-sm">
                    <i class="${iconClass}"></i>
                </div>
            </div>
        </div>
        
        <!-- Content section -->
        <div class="bg-white p-5">
            <!-- Date (desktop visible) -->
            <div class="hidden md:flex items-center text-gray-700 mb-5 px-4 py-3 bg-gray-100 rounded-xl">
                <i class="fas fa-calendar-day mr-3 text-blue-500 text-lg"></i>
                <div>
                    <span class="font-semibold text-gray-900">${formattedDate}</span>
                    <span class="text-gray-500 text-sm ml-2">• ${date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
            </div>
            
            <!-- Description -->
            <div class="mb-6">
                <div class="flex items-start text-gray-700">
                    <i class="fas fa-info-circle mr-3 text-green-500 mt-1 text-lg"></i>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-1">Description</h4>
                        <p class="text-gray-600 text-sm leading-relaxed">${holiday.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Divider -->
            <div class="border-t border-gray-200 my-5"></div>
            
            <!-- Footer -->
            <div class="result-card-footer flex justify-between items-start sm:items-center gap-4">
                <!-- Holiday types -->
                <div class="flex flex-wrap gap-2">
                    ${holiday.type.map(t => `
                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <i class="fas fa-tag mr-1.5 text-xs text-gray-500"></i>
                            ${t}
                        </span>
                    `).join('')}
                </div>
                
                <!-- Month indicator with progress -->
                <div class="flex items-center">
                    <div class="text-right mr-3">
                        <div class="text-sm font-semibold ${colorClasses.text}">
                            ${date.toLocaleDateString('en-US', { month: 'long' })}
                        </div>
                        <div class="text-xs text-gray-500">${date.getDate()} ${date.toLocaleDateString('en-US', { day: 'numeric' }) === '1' ? 'st' : date.toLocaleDateString('en-US', { day: 'numeric' }) === '2' ? 'nd' : date.toLocaleDateString('en-US', { day: 'numeric' }) === '3' ? 'rd' : 'th'}</div>
                    </div>
                    <div class="w-12 h-12 rounded-full ${colorClasses.bgLight} flex items-center justify-center">
                        <i class="fas fa-calendar ${colorClasses.text} text-lg"></i>
                    </div>
                </div>
            </div>
            
            <!-- Progress indicator for month -->
            <div class="mt-5">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Month Progress</span>
                    <span>${Math.round((date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) * 100)}%</span>
                </div>
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full ${colorClasses.bg}" style="width: ${(date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) * 100}%"></div>
                </div>
            </div>
        </div>
        
        <!-- Hover effect border -->
        <div class="absolute inset-0 border-2 border-transparent hover:border-white/20 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
    </div>
`;
    return card;
}

// Get color class based on month
function getColorClassByMonth(month) {
    const colors = [
        { bg: 'bg-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-100' }, // Jan
        { bg: 'bg-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-100' }, // Feb
        { bg: 'bg-green-600', text: 'text-green-600', bgLight: 'bg-green-100' }, // Mar
        { bg: 'bg-pink-600', text: 'text-pink-600', bgLight: 'bg-pink-100' }, // Apr
        { bg: 'bg-yellow-600', text: 'text-yellow-600', bgLight: 'bg-yellow-100' }, // May
        { bg: 'bg-red-600', text: 'text-red-600', bgLight: 'bg-red-100' }, // Jun
        { bg: 'bg-indigo-600', text: 'text-indigo-600', bgLight: 'bg-indigo-100' }, // Jul
        { bg: 'bg-teal-600', text: 'text-teal-600', bgLight: 'bg-teal-100' }, // Aug
        { bg: 'bg-orange-600', text: 'text-orange-600', bgLight: 'bg-orange-100' }, // Sep
        { bg: 'bg-cyan-600', text: 'text-cyan-600', bgLight: 'bg-cyan-100' }, // Oct
        { bg: 'bg-gray-600', text: 'text-gray-600', bgLight: 'bg-gray-100' }, // Nov
        { bg: 'bg-blue-800', text: 'text-blue-800', bgLight: 'bg-blue-100' }, // Dec
    ];

    return colors[month - 1] || colors[0];
}

// Get icon based on holiday type
function getIconByType(type) {
    const iconMap = {
        'National holiday': 'fas fa-flag',
        'Observance': 'fas fa-eye',
        'Season': 'fas fa-leaf',
        'Muslim': 'fas fa-star-and-crescent',
        'Christian': 'fas fa-cross',
        'Jewish': 'fas fa-star-of-david',
        'Hinduism': 'fas fa-om',
        'Buddhist': 'fas fa-yin-yang',
        'Federal holiday': 'fas fa-building',
        'Local holiday': 'fas fa-map-pin',
        'Common local holiday': 'fas fa-users'
    };

    return iconMap[type] || 'fas fa-calendar-alt';
}

// Filter holidays based on selected filters
function filterHolidays() {
    const selectedMonth = monthFilter.value;
    const selectedType = typeFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    filteredHolidays = allHolidays.filter(holiday => {
        // Filter by month
        if (selectedMonth !== 'all') {
            const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
            if (holidayMonth.toString() !== selectedMonth) {
                return false;
            }
        }

        // Filter by type
        if (selectedType !== 'all') {
            if (!holiday.type.includes(selectedType)) {
                return false;
            }
        }

        // Filter by search term
        if (searchTerm) {
            const holidayName = holiday.name.toLowerCase();
            const holidayDesc = (holiday.description || '').toLowerCase();

            if (!holidayName.includes(searchTerm) && !holidayDesc.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    // Update displayed holidays
    displayHolidays(filteredHolidays);
}

// Reset all filters
function resetFilters() {
    monthFilter.value = 'all';
    typeFilter.value = 'all';
    searchInput.value = '';
    filterHolidays();
}

// Display error message
function displayError(message) {
    filtersSection.classList.add('hidden');
    holidaysContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
                    <p class="text-gray-600 max-w-md mx-auto mb-6">${message}</p>
                    <button onclick="fetchHolidays()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:-translate-y-1 shadow-md">
                        <i class="fas fa-redo mr-2"></i> Try Again
                    </button>
                </div>
            `;
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}