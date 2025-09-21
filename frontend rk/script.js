// Traffic Management App with Interactive Map
document.addEventListener("DOMContentLoaded", () => {
    console.log("Traffic app loaded!");
    
    // Initialize the map
    initMap();
    
    // Setup event listeners
    setupEventListeners();
});

let map;
let selectedFromLocation = null;
let selectedToLocation = null;
let routeMarkers = [];
let trafficLines = [];
let trafficUpdateInterval;

// Preloaded popular locations
const preloadedLocations = [
    { name: "Central Business District", lat: 12.9716, lng: 77.5946, type: "business" },
    { name: "Bangalore Airport", lat: 13.1986, lng: 77.7063, type: "airport" },
    { name: "MG Road", lat: 12.9754, lng: 77.6101, type: "shopping" },
    { name: "Koramangala", lat: 12.9279, lng: 77.6271, type: "residential" },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500, type: "tech" },
    { name: "Electronic City", lat: 12.8456, lng: 77.6603, type: "tech" },
    { name: "Indiranagar", lat: 12.9719, lng: 77.6412, type: "residential" },
    { name: "Jayanagar", lat: 12.9304, lng: 77.5834, type: "residential" },
    { name: "Malleshwaram", lat: 13.0067, lng: 77.5611, type: "residential" },
    { name: "Rajajinagar", lat: 12.9784, lng: 77.5608, type: "residential" }
];

// Traffic simulation data - major roads and highways in Bangalore with realistic paths
const trafficRoutes = [
    // High traffic routes (red) - Following actual road networks
    { 
        name: "Outer Ring Road", 
        coordinates: [
            [12.9716, 77.5946], [12.9754, 77.6101], [12.9784, 77.5608], 
            [12.9850, 77.5550], [12.9900, 77.5500], [12.9950, 77.5450],
            [12.9304, 77.5834], [12.9250, 77.5800], [12.9200, 77.5750]
        ], 
        baseDensity: 0.8, 
        type: "highway" 
    },
    { 
        name: "MG Road", 
        coordinates: [
            [12.9754, 77.6101], [12.9720, 77.6150], [12.9700, 77.6200],
            [12.9680, 77.6250], [12.9660, 77.6300], [12.9640, 77.6350],
            [12.9719, 77.6412], [12.9700, 77.6450], [12.9680, 77.6500],
            [12.9279, 77.6271]
        ], 
        baseDensity: 0.9, 
        type: "arterial" 
    },
    { 
        name: "Airport Road", 
        coordinates: [
            [13.1986, 77.7063], [13.1800, 77.7000], [13.1600, 77.6900],
            [13.1400, 77.6800], [13.1200, 77.6700], [13.1000, 77.6600],
            [13.0800, 77.6500], [13.0600, 77.6400], [13.0400, 77.6300],
            [13.0200, 77.6200], [13.0000, 77.6100], [12.9800, 77.6000],
            [12.9716, 77.5946]
        ], 
        baseDensity: 0.7, 
        type: "highway" 
    },
    
    // Medium traffic routes (yellow) - Following arterial roads
    { 
        name: "Whitefield Road", 
        coordinates: [
            [12.9698, 77.7500], [12.9700, 77.7400], [12.9705, 77.7300],
            [12.9710, 77.7200], [12.9715, 77.7100], [12.9720, 77.7000],
            [12.9725, 77.6900], [12.9730, 77.6800], [12.9735, 77.6700],
            [12.9740, 77.6600], [12.9745, 77.6500], [12.9750, 77.6400],
            [12.9755, 77.6300], [12.9760, 77.6200], [12.9765, 77.6100],
            [12.9716, 77.5946]
        ], 
        baseDensity: 0.5, 
        type: "arterial" 
    },
    { 
        name: "Electronic City Road", 
        coordinates: [
            [12.8456, 77.6603], [12.8500, 77.6550], [12.8550, 77.6500],
            [12.8600, 77.6450], [12.8650, 77.6400], [12.8700, 77.6350],
            [12.8750, 77.6300], [12.8800, 77.6250], [12.8850, 77.6200],
            [12.8900, 77.6150], [12.8950, 77.6100], [12.9000, 77.6050],
            [12.9050, 77.6000], [12.9100, 77.5950], [12.9150, 77.5900],
            [12.9716, 77.5946]
        ], 
        baseDensity: 0.6, 
        type: "arterial" 
    },
    { 
        name: "Koramangala Road", 
        coordinates: [
            [12.9279, 77.6271], [12.9280, 77.6250], [12.9285, 77.6200],
            [12.9290, 77.6150], [12.9295, 77.6100], [12.9300, 77.6050],
            [12.9304, 77.5834]
        ], 
        baseDensity: 0.4, 
        type: "local" 
    },
    
    // Low traffic routes (green) - Following local roads
    { 
        name: "Residential Connector", 
        coordinates: [
            [13.0067, 77.5611], [13.0050, 77.5600], [13.0030, 77.5590],
            [13.0010, 77.5580], [12.9990, 77.5570], [12.9970, 77.5560],
            [12.9950, 77.5550], [12.9930, 77.5540], [12.9910, 77.5530],
            [12.9890, 77.5520], [12.9870, 77.5510], [12.9850, 77.5500],
            [12.9784, 77.5608]
        ], 
        baseDensity: 0.2, 
        type: "local" 
    },
    { 
        name: "Park Road", 
        coordinates: [
            [12.9719, 77.6412], [12.9750, 77.6350], [12.9780, 77.6300],
            [12.9810, 77.6250], [12.9840, 77.6200], [12.9870, 77.6150],
            [12.9900, 77.6100], [12.9930, 77.6050], [12.9960, 77.6000],
            [12.9990, 77.5950], [13.0020, 77.5900], [13.0050, 77.5850],
            [13.0067, 77.5611]
        ], 
        baseDensity: 0.3, 
        type: "local" 
    },
    { 
        name: "Tech Corridor", 
        coordinates: [
            [12.9698, 77.7500], [12.9650, 77.7400], [12.9600, 77.7300],
            [12.9550, 77.7200], [12.9500, 77.7100], [12.9450, 77.7000],
            [12.9400, 77.6900], [12.9350, 77.6800], [12.9300, 77.6700],
            [12.9250, 77.6600], [12.9200, 77.6500], [12.9150, 77.6400],
            [12.9100, 77.6300], [12.9050, 77.6200], [12.9000, 77.6100],
            [12.8950, 77.6000], [12.8900, 77.5900], [12.8850, 77.5800],
            [12.8800, 77.5700], [12.8750, 77.5600], [12.8700, 77.5500],
            [12.8650, 77.5400], [12.8600, 77.5300], [12.8550, 77.5200],
            [12.8500, 77.5100], [12.8456, 77.6603]
        ], 
        baseDensity: 0.25, 
        type: "local" 
    }
];

function initMap() {
    // Initialize map centered on Bangalore
    map = L.map('map').setView([12.9716, 77.5946], 11);
    
    // Add appropriate tile layer based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateMapTheme(currentTheme);
    
    // Add preloaded location markers
    addPreloadedLocations();
    
    // Add traffic lines
    addTrafficLines();
    
    // Start traffic simulation
    startTrafficSimulation();
    
    // Add click event to map for location selection
    map.on('click', onMapClick);
}

function addPreloadedLocations() {
    preloadedLocations.forEach(location => {
        const iconColor = getIconColor(location.type);
        const marker = L.circleMarker([location.lat, location.lng], {
            radius: 8,
            fillColor: iconColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
            <div>
                <h4>${location.name}</h4>
                <p>Type: ${location.type}</p>
                <button onclick="selectLocation('${location.name}', ${location.lat}, ${location.lng}, 'from')">Set as Start</button>
                <button onclick="selectLocation('${location.name}', ${location.lat}, ${location.lng}, 'to')">Set as Destination</button>
            </div>
        `);
        
        // Add click event to marker
        marker.on('click', () => {
            marker.openPopup();
        });
    });
}

function getIconColor(type) {
    const colors = {
        'business': '#FF6B6B',
        'airport': '#4ECDC4',
        'shopping': '#45B7D1',
        'residential': '#96CEB4',
        'tech': '#FFEAA7'
    };
    return colors[type] || '#95A5A6';
}

function addTrafficLines() {
    trafficRoutes.forEach(route => {
        const currentDensity = calculateCurrentDensity(route.baseDensity);
        const trafficLevel = getTrafficLevel(currentDensity);
        const color = getTrafficColor(trafficLevel);
        
        const polyline = L.polyline(route.coordinates, {
            color: color,
            weight: getTrafficWeight(trafficLevel),
            opacity: 0.8,
            dashArray: trafficLevel === 'high' ? '10, 5' : '0',
            className: `traffic-line ${trafficLevel}-traffic`
        }).addTo(map);
        
        // Add popup with traffic information
        polyline.bindPopup(`
            <div style="text-align: center;">
                <h4 style="margin: 0 0 5px 0; color: ${color};">${route.name}</h4>
                <p style="margin: 0; font-size: 14px;">
                    <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;">
                        ${trafficLevel.toUpperCase()} TRAFFIC
                    </span>
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                    Type: ${route.type} | Density: ${Math.round(currentDensity * 100)}%
                </p>
            </div>
        `);
        
        // Store reference for updates
        trafficLines.push({
            polyline: polyline,
            route: route,
            currentDensity: currentDensity
        });
    });
}

function calculateCurrentDensity(baseDensity) {
    // Simulate real-time traffic variations
    const timeVariation = Math.sin(Date.now() / 10000) * 0.2; // Slow oscillation
    const randomVariation = (Math.random() - 0.5) * 0.3; // Random fluctuation
    const rushHourMultiplier = getRushHourMultiplier();
    
    return Math.max(0.1, Math.min(1.0, baseDensity + timeVariation + randomVariation + rushHourMultiplier));
}

function getRushHourMultiplier() {
    const hour = new Date().getHours();
    // Rush hours: 7-9 AM and 5-7 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        return 0.3; // Increase traffic during rush hours
    }
    return 0; // Normal traffic
}

function getTrafficLevel(density) {
    if (density >= 0.7) return 'high';
    if (density >= 0.4) return 'medium';
    return 'low';
}

function getTrafficColor(level) {
    const colors = {
        'low': '#43e97b',      // Green
        'medium': '#f093fb',   // Yellow/Pink
        'high': '#fa709a'      // Red/Pink
    };
    return colors[level];
}

function getTrafficWeight(level) {
    const weights = {
        'low': 3,
        'medium': 5,
        'high': 7
    };
    return weights[level];
}

function startTrafficSimulation() {
    // Update traffic every 5 seconds
    trafficUpdateInterval = setInterval(updateTraffic, 5000);
}

function updateTraffic() {
    trafficLines.forEach(trafficLine => {
        const newDensity = calculateCurrentDensity(trafficLine.route.baseDensity);
        const newLevel = getTrafficLevel(newDensity);
        const newColor = getTrafficColor(newLevel);
        
        // Update line properties
        trafficLine.polyline.setStyle({
            color: newColor,
            weight: getTrafficWeight(newLevel),
            dashArray: newLevel === 'high' ? '10, 5' : '0'
        });
        
        // Update CSS class for animations
        const element = trafficLine.polyline.getElement();
        if (element) {
            element.className = `traffic-line ${newLevel}-traffic`;
        }
        
        // Update popup content
        trafficLine.polyline.setPopupContent(`
            <div style="text-align: center;">
                <h4 style="margin: 0 0 5px 0; color: ${newColor};">${trafficLine.route.name}</h4>
                <p style="margin: 0; font-size: 14px;">
                    <span style="background: ${newColor}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;">
                        ${newLevel.toUpperCase()} TRAFFIC
                    </span>
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                    Type: ${trafficLine.route.type} | Density: ${Math.round(newDensity * 100)}%
                </p>
                <p style="margin: 5px 0 0 0; font-size: 10px; color: #999;">
                    Last updated: ${new Date().toLocaleTimeString()}
                </p>
            </div>
        `);
        
        trafficLine.currentDensity = newDensity;
    });
}

function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Create a popup for the clicked location
    const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(`
            <div>
                <h4>Custom Location</h4>
                <p>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</p>
                <button onclick="selectLocation('Custom Location', ${lat}, ${lng}, 'from')">Set as Start</button>
                <button onclick="selectLocation('Custom Location', ${lat}, ${lng}, 'to')">Set as Destination</button>
            </div>
        `)
        .openOn(map);
}

function selectLocation(name, lat, lng, type) {
    if (type === 'from') {
        selectedFromLocation = { name, lat, lng };
        document.getElementById('fromLocation').textContent = name;
    } else {
        selectedToLocation = { name, lat, lng };
        document.getElementById('toLocation').textContent = name;
    }
    
    // Add animated marker for selected location
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: ${type === 'from' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #FF5722, #e64a19)'}; 
                color: white; 
                border-radius: 50%; 
                width: 25px; 
                height: 25px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 12px; 
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                animation: markerPulse 0.6s ease-out;
            ">${type === 'from' ? 'A' : 'B'}</div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        })
    }).addTo(map);
    
    // Add pulse animation to the marker
    setTimeout(() => {
        marker.getElement().style.animation = 'markerPulse 0.6s ease-out';
    }, 100);
    
    routeMarkers.push(marker);
    
    // Add visual feedback to location items
    const locationItem = document.querySelector(`#${type === 'from' ? 'fromLocation' : 'toLocation'}`).parentElement;
    locationItem.style.animation = 'none';
    setTimeout(() => {
        locationItem.style.animation = 'locationSelect 0.5s ease-out';
    }, 10);
    
    // Show trip planning section if both locations are selected
    if (selectedFromLocation && selectedToLocation) {
        showTripPlanning();
        calculateRoutes();
    }
    
    map.closePopup();
}

function showTripPlanning() {
    document.getElementById('tripPlanning').style.display = 'block';
    document.getElementById('tripPlanning').scrollIntoView({ behavior: 'smooth' });
}

function calculateRoutes() {
    if (!selectedFromLocation || !selectedToLocation) return;
    
    // Simulate route calculation with different options
    const routes = generateRouteOptions();
    displayRouteOptions(routes);
}

function generateRouteOptions() {
    // Simulate different route options with varying times and congestion
    const baseTime = Math.floor(Math.random() * 30) + 20; // 20-50 minutes base time
    
    return [
        {
            id: 1,
            name: "Fastest Route",
            time: baseTime,
            distance: (Math.random() * 10 + 15).toFixed(1),
            congestion: "medium",
            description: "Main highways with moderate traffic",
            details: "Uses Outer Ring Road and main arterial roads"
        },
        {
            id: 2,
            name: "Scenic Route",
            time: Math.floor(baseTime * 1.3),
            distance: (Math.random() * 5 + 20).toFixed(1),
            congestion: "low",
            description: "Less congested but longer route",
            details: "Through residential areas and parks"
        },
        {
            id: 3,
            name: "Direct Route",
            time: Math.floor(baseTime * 0.8),
            distance: (Math.random() * 3 + 12).toFixed(1),
            congestion: "high",
            description: "Shortest but most congested",
            details: "Through city center with heavy traffic"
        }
    ];
}

function displayRouteOptions(routes) {
    const routeOptionsContainer = document.getElementById('routeOptions');
    routeOptionsContainer.innerHTML = '';
    
    routes.forEach(route => {
        const routeElement = document.createElement('div');
        routeElement.className = 'route-option';
        routeElement.onclick = () => selectRoute(route.id);
        
        const congestionClass = `congestion-${route.congestion}`;
        const congestionText = route.congestion.charAt(0).toUpperCase() + route.congestion.slice(1);
        
        routeElement.innerHTML = `
            <div class="route-header">
                <div>
                    <div class="route-time">${route.time} min</div>
                    <div class="route-distance">${route.distance} km</div>
                </div>
                <span class="congestion-level ${congestionClass}">${congestionText}</span>
            </div>
            <div style="font-weight: bold; margin-bottom: 5px;">${route.name}</div>
            <div class="route-details">${route.description}</div>
            <div class="route-details">${route.details}</div>
        `;
        
        routeOptionsContainer.appendChild(routeElement);
    });
}

function selectRoute(routeId) {
    // Remove previous selection
    document.querySelectorAll('.route-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked route
    event.currentTarget.classList.add('selected');
    
    // You can add additional logic here for route selection
    console.log(`Selected route: ${routeId}`);
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', () => {
        const destination = document.getElementById('destinationInput').value;
        if (destination) {
            searchLocation(destination);
        }
    });
    
    // Enter key support for search
    document.getElementById('destinationInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const destination = document.getElementById('destinationInput').value;
            if (destination) {
                searchLocation(destination);
            }
        }
    });
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Initialize theme from localStorage
    initializeTheme();
    
    // Setup camera controls
    setupCameraControls();
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle icon
    const toggleIcon = document.querySelector('.toggle-icon');
    toggleIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Update map tiles for dark theme
    updateMapTheme(newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle icon
    const toggleIcon = document.querySelector('.toggle-icon');
    toggleIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function updateMapTheme(theme) {
    if (map) {
        // Remove existing tile layer
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        
        // Add appropriate tile layer based on theme
        if (theme === 'dark') {
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors, © CARTO'
            }).addTo(map);
        } else {
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }
    }
}

function searchLocation(query) {
    // Simple search through preloaded locations
    const foundLocation = preloadedLocations.find(location => 
        location.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (foundLocation) {
        map.setView([foundLocation.lat, foundLocation.lng], 15);
        
        // Create a temporary marker for the search result
        const searchMarker = L.marker([foundLocation.lat, foundLocation.lng], {
            icon: L.divIcon({
                className: 'search-marker',
                html: `<div style="background: #6C63FF; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">!</div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            })
        }).addTo(map);
        
        searchMarker.bindPopup(`<b>${foundLocation.name}</b><br>Found in search results`).openPopup();
        
        // Remove marker after 5 seconds
        setTimeout(() => {
            map.removeLayer(searchMarker);
        }, 5000);
    } else {
        alert('Location not found in our database. Please try clicking on the map to select a location.');
    }
}

// Cleanup function to stop traffic simulation
function stopTrafficSimulation() {
    if (trafficUpdateInterval) {
        clearInterval(trafficUpdateInterval);
        trafficUpdateInterval = null;
    }
}

// Camera feed functionality
const cameraData = {
    'mg-road': {
        name: 'MG Road Junction',
        vehicleCount: 24,
        status: 'Active'
    },
    'airport-road': {
        name: 'Airport Road Intersection',
        vehicleCount: 18,
        status: 'Active'
    },
    'outer-ring': {
        name: 'Outer Ring Road',
        vehicleCount: 35,
        status: 'Active'
    },
    'whitefield': {
        name: 'Whitefield Junction',
        vehicleCount: 12,
        status: 'Active'
    }
};

function setupCameraControls() {
    const cameraButtons = document.querySelectorAll('.camera-btn');
    cameraButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            cameraButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update camera feed
            const cameraId = button.getAttribute('data-camera');
            updateCameraFeed(cameraId);
        });
    });
}

function updateCameraFeed(cameraId) {
    const data = cameraData[cameraId];
    if (data) {
        document.getElementById('cameraLocation').textContent = data.name;
        document.getElementById('vehicleCount').textContent = data.vehicleCount;
        document.querySelector('.camera-location').textContent = data.name;
        
        // Simulate vehicle count changes
        setInterval(() => {
            const currentCount = parseInt(document.getElementById('vehicleCount').textContent);
            const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const newCount = Math.max(0, currentCount + variation);
            document.getElementById('vehicleCount').textContent = newCount;
        }, 5000);
    }
}

// Emergency vehicle system
let emergencyVehicles = [];
let modifiedSignals = [];

function openEmergencyPage() {
    // Create emergency dashboard page
    const emergencyPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Vehicle Dashboard</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <header class="banner">
                <div>
                    <h2>Emergency Vehicle Dashboard</h2>
                    <p>Real-time emergency vehicle tracking and signal control</p>
                </div>
                <div class="header-controls">
                    <button onclick="window.close()" class="close-btn">Close</button>
                </div>
            </header>
            
            <main class="emergency-dashboard">
                <div class="dashboard-grid">
                    <div class="emergency-vehicles">
                        <h3>Active Emergency Vehicles</h3>
                        <div class="vehicle-list" id="vehicleList">
                            <!-- Emergency vehicles will be populated here -->
                        </div>
                        <button class="add-vehicle-btn" onclick="addEmergencyVehicle()">Add Emergency Vehicle</button>
                    </div>
                    
                    <div class="signal-control">
                        <h3>Traffic Signal Control</h3>
                        <div class="signal-list" id="signalList">
                            <!-- Modified signals will be shown here -->
                        </div>
                    </div>
                </div>
                
                <div class="emergency-map">
                    <h3>Emergency Vehicle Locations</h3>
                    <div id="emergencyMap" class="map-container"></div>
                </div>
            </main>
            
            <script>
                // Emergency dashboard JavaScript
                let emergencyVehicles = [];
                let emergencyMap;
                
                function initEmergencyMap() {
                    emergencyMap = L.map('emergencyMap').setView([12.9716, 77.5946], 11);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(emergencyMap);
                }
                
                function addEmergencyVehicle() {
                    const vehicleId = 'EV-' + Date.now();
                    const vehicle = {
                        id: vehicleId,
                        type: 'Ambulance',
                        location: [12.9716 + (Math.random() - 0.5) * 0.1, 77.5946 + (Math.random() - 0.5) * 0.1],
                        destination: [12.9754, 77.6101],
                        status: 'Active',
                        priority: 'High'
                    };
                    
                    emergencyVehicles.push(vehicle);
                    updateVehicleList();
                    updateEmergencyMap();
                    modifySignalsForVehicle(vehicle);
                }
                
                function updateVehicleList() {
                    const vehicleList = document.getElementById('vehicleList');
                    vehicleList.innerHTML = '';
                    
                    emergencyVehicles.forEach(vehicle => {
                        const vehicleElement = document.createElement('div');
                        vehicleElement.className = 'vehicle-item';
                        vehicleElement.innerHTML = \`
                            <div class="vehicle-info">
                                <h4>\${vehicle.type} \${vehicle.id}</h4>
                                <p>Status: \${vehicle.status}</p>
                                <p>Priority: \${vehicle.priority}</p>
                            </div>
                            <div class="vehicle-actions">
                                <button onclick="removeVehicle('\${vehicle.id}')">Remove</button>
                            </div>
                        \`;
                        vehicleList.appendChild(vehicleElement);
                    });
                }
                
                function updateEmergencyMap() {
                    emergencyMap.eachLayer(layer => {
                        if (layer instanceof L.Marker) {
                            emergencyMap.removeLayer(layer);
                        }
                    });
                    
                    emergencyVehicles.forEach(vehicle => {
                        const marker = L.marker(vehicle.location, {
                            icon: L.divIcon({
                                className: 'emergency-marker',
                                html: \`<div style="background: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">E</div>\`,
                                iconSize: [30, 30],
                                iconAnchor: [15, 15]
                            })
                        }).addTo(emergencyMap);
                        
                        marker.bindPopup(\`<b>\${vehicle.type}</b><br>ID: \${vehicle.id}<br>Status: \${vehicle.status}\`);
                    });
                }
                
                function modifySignalsForVehicle(vehicle) {
                    // Simulate signal modification
                    const signals = ['MG Road Signal', 'Airport Road Signal', 'Outer Ring Signal'];
                    const modifiedSignal = signals[Math.floor(Math.random() * signals.length)];
                    
                    const signalList = document.getElementById('signalList');
                    const signalElement = document.createElement('div');
                    signalElement.className = 'signal-item';
                    signalElement.innerHTML = \`
                        <div class="signal-info">
                            <h4>\${modifiedSignal}</h4>
                            <p>Modified for: \${vehicle.type} \${vehicle.id}</p>
                            <p>Status: Green Light Extended</p>
                        </div>
                    \`;
                    signalList.appendChild(signalElement);
                }
                
                function removeVehicle(vehicleId) {
                    emergencyVehicles = emergencyVehicles.filter(v => v.id !== vehicleId);
                    updateVehicleList();
                    updateEmergencyMap();
                }
                
                // Initialize dashboard
                document.addEventListener('DOMContentLoaded', () => {
                    initEmergencyMap();
                    updateVehicleList();
                });
            </script>
        </body>
        </html>
    `;
    
    const newWindow = window.open('', '_blank', 'width=1200,height=800');
    newWindow.document.write(emergencyPage);
    newWindow.document.close();
}

function simulateEmergency() {
    // Simulate emergency vehicle detection
    const emergencyCount = document.getElementById('emergencyCount');
    const signalCount = document.getElementById('signalCount');
    
    let currentEmergencyCount = parseInt(emergencyCount.textContent) || 0;
    let currentSignalCount = parseInt(signalCount.textContent) || 0;
    
    currentEmergencyCount++;
    currentSignalCount += Math.floor(Math.random() * 3) + 1; // 1-3 signals affected
    
    emergencyCount.textContent = currentEmergencyCount + ' vehicles in system';
    signalCount.textContent = currentSignalCount + ' signals affected';
    
    // Show notification
    showNotification('Emergency vehicle detected! Signals are being modified for priority passage.');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = \`
        <div class="notification-content">
            <span class="notification-icon"></span>
            <span>\${message}</span>
        </div>
    \`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Make functions globally available for onclick events
window.selectLocation = selectLocation;
window.stopTrafficSimulation = stopTrafficSimulation;
window.openEmergencyPage = openEmergencyPage;
window.simulateEmergency = simulateEmergency;
  