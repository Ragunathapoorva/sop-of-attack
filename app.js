// Advanced Cybersecurity Dashboard with D3.js Network Topology - FIXED
let appState = {
    currentTab: 'dashboard',
    isMonitoring: false,
    attackInProgress: false,
    replayInProgress: false,
    charts: {},
    network: null,
    intervals: {},
    topology: {
        svg: null,
        simulation: null,
        nodes: [],
        links: [],
        particles: [],
        activeAttacks: [],
        zoom: null,
        animationsPaused: false
    }
};

// Enhanced Sample Data with more realistic network structure
const networkData = {
    devices: [
        {id: "gateway_001", type: "gateway", ip: "192.168.1.1", status: "online", manufacturer: "Cisco", x: 400, y: 300, group: 1},
        {id: "sensor_001", type: "sensor", ip: "192.168.1.10", status: "online", manufacturer: "Bosch", x: 200, y: 200, group: 2},
        {id: "sensor_002", type: "sensor", ip: "192.168.1.11", status: "online", manufacturer: "Honeywell", x: 600, y: 200, group: 2},
        {id: "camera_001", type: "camera", ip: "192.168.1.20", status: "online", manufacturer: "Ring", x: 300, y: 100, group: 3},
        {id: "camera_002", type: "camera", ip: "192.168.1.21", status: "suspicious", manufacturer: "Nest", x: 500, y: 100, group: 3},
        {id: "actuator_001", type: "actuator", ip: "192.168.1.30", status: "online", manufacturer: "Siemens", x: 150, y: 400, group: 4},
        {id: "actuator_002", type: "actuator", ip: "192.168.1.31", status: "offline", manufacturer: "ABB", x: 650, y: 400, group: 4},
        {id: "thermostat_001", type: "thermostat", ip: "192.168.1.40", status: "online", manufacturer: "Nest", x: 300, y: 500, group: 5},
        {id: "server_001", type: "server", ip: "192.168.1.100", status: "online", manufacturer: "Dell", x: 400, y: 150, group: 6},
        {id: "router_001", type: "router", ip: "192.168.1.254", status: "online", manufacturer: "Netgear", x: 400, y: 450, group: 7}
    ],
    connections: [
        {source: "gateway_001", target: "sensor_001", strength: 1},
        {source: "gateway_001", target: "sensor_002", strength: 1},
        {source: "gateway_001", target: "camera_001", strength: 1},
        {source: "gateway_001", target: "camera_002", strength: 1},
        {source: "gateway_001", target: "actuator_001", strength: 1},
        {source: "gateway_001", target: "actuator_002", strength: 1},
        {source: "gateway_001", target: "thermostat_001", strength: 1},
        {source: "server_001", target: "gateway_001", strength: 2},
        {source: "router_001", target: "gateway_001", strength: 2}
    ],
    attackTypes: [
        {name: "DDoS", value: 35, color: "#ff4757", severity: "critical"},
        {name: "Malware", value: 25, color: "#ff6b6b", severity: "high"},
        {name: "Spoofing", value: 20, color: "#ffa502", severity: "medium"},
        {name: "Injection", value: 12, color: "#ff9f43", severity: "medium"},
        {name: "Brute Force", value: 8, color: "#ffdd59", severity: "low"}
    ],
    systemStats: {
        activeSimulations: 3,
        activeThreats: 7,
        detectionRate: 0.94,
        totalMitigations: 156,
        avgDetectionTime: 0.045,
        systemLoad: 67,
        packetsPerSecond: 1247
    },
    recentAttacks: [
        {id: "attack_001", type: "DDoS", source: "external", target: "gateway_001", timestamp: "2025-01-20T10:30:15Z", status: "active"},
        {id: "attack_002", type: "Malware", source: "camera_002", target: "server_001", timestamp: "2025-01-20T10:28:42Z", status: "mitigated"},
        {id: "attack_003", type: "Spoofing", source: "external", target: "sensor_001", timestamp: "2025-01-20T10:25:30Z", status: "detected"}
    ]
};

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Advanced Cybersecurity Dashboard initializing...');
    initializeApp();
});

function initializeApp() {
    try {
        setupNavigation();
        loadDeviceStatus();
        updateLastUpdatedTime();
        
        // Initialize charts with delay
        setTimeout(() => {
            initializeCharts();
        }, 100);
        
        setupEventListeners();
        startRealTimeUpdates();
        loadSystemLogs();
        loadRecentReports();
        
        // Initialize range sliders
        setTimeout(() => {
            updateRangeValue('intensity-level', 'intensity-value');
            updateRangeValue('sensitivity-level', 'sensitivity-value');
        }, 200);
        
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
}

// FIXED Navigation System
function setupNavigation() {
    console.log('🧭 Setting up navigation system...');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const tabName = link.getAttribute('data-tab');
        
        // Remove existing listeners and add new ones
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📍 Navigation: switching to ${tabName}`);
            switchTab(tabName);
        });
    });
    
    console.log(`Navigation setup complete for ${navLinks.length} links`);
}

function switchTab(tabName) {
    console.log(`🔄 Switching to tab: ${tabName}`);
    
    try {
        // Clear active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Activate selected tab
        const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTab = document.getElementById(tabName);
        
        if (activeLink) {
            activeLink.classList.add('active');
            console.log(`✓ Activated nav link for ${tabName}`);
        } else {
            console.error(`✗ Nav link for ${tabName} not found`);
            return;
        }

        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.display = 'block';
            console.log(`✓ Activated tab content for ${tabName}`);
        } else {
            console.error(`✗ Tab element with id ${tabName} not found`);
            return;
        }
        
        // Update page title
        const titles = {
            'dashboard': 'Cybersecurity Operations Dashboard',
            'topology': 'Advanced Network Topology',
            'simulation': 'Attack Simulation Center',
            'monitoring': 'Real-time Security Monitoring',
            'ai-metrics': 'AI Detection Metrics',
            'logs': 'System Security Logs',
            'reports': 'Security Analysis Reports',
            'config': 'System Configuration',
            'replay': 'Attack Replay Analysis'
        };
        
        const titleElement = document.getElementById('page-title');
        if (titleElement && titles[tabName]) {
            titleElement.textContent = titles[tabName];
        }
        
        appState.currentTab = tabName;
        
        // Initialize tab-specific content
        setTimeout(() => {
            initializeTabContent(tabName);
        }, 100);
        
        console.log(`✅ Successfully switched to ${tabName}`);
        
    } catch (error) {
        console.error(`❌ Error switching to ${tabName}:`, error);
    }
}

function initializeTabContent(tabName) {
    console.log(`🎯 Initializing content for tab: ${tabName}`);
    
    switch (tabName) {
        case 'topology':
            if (!appState.topology.svg) {
                setTimeout(initializeAdvancedTopology, 100);
            }
            break;
        case 'monitoring':
            if (!appState.charts.realtime) {
                setTimeout(setupRealtimeChart, 100);
            }
            break;
        case 'ai-metrics':
            if (!appState.charts.performance) {
                setTimeout(setupPerformanceChart, 100);
            }
            break;
    }
}

// Advanced D3.js Network Topology Implementation
function initializeAdvancedTopology() {
    console.log('🌐 Initializing advanced network topology with D3.js...');
    
    const container = document.getElementById('network-topology');
    if (!container) {
        console.error('❌ Network topology container not found');
        return;
    }

    // Clear any existing content
    container.innerHTML = '';
    
    // Set up dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;
    
    console.log(`📐 Topology dimensions: ${width}x${height}`);
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'transparent');
    
    // Add background pattern
    const defs = svg.append('defs');
    
    // Grid pattern
    const pattern = defs.append('pattern')
        .attr('id', 'grid')
        .attr('width', 40)
        .attr('height', 40)
        .attr('patternUnits', 'userSpaceOnUse');
    
    pattern.append('path')
        .attr('d', 'M 40 0 L 0 0 0 40')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(100, 100, 100, 0.1)')
        .attr('stroke-width', 1);
    
    // Glow filter for attack effects
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#grid)');
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            if (!appState.topology.animationsPaused) {
                g.attr('transform', event.transform);
            }
        });
    
    svg.call(zoom);
    appState.topology.zoom = zoom;
    
    // Create main group for zoomable content
    const g = svg.append('g');
    
    // Create layers
    const linkLayer = g.append('g').attr('class', 'links');
    const particleLayer = g.append('g').attr('class', 'particles');
    const nodeLayer = g.append('g').attr('class', 'nodes');
    const labelLayer = g.append('g').attr('class', 'labels');
    
    // Prepare data
    const nodes = networkData.devices.map(d => ({
        id: d.id,
        type: d.type,
        ip: d.ip,
        status: d.status,
        manufacturer: d.manufacturer,
        group: d.group,
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height / 2 + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null
    }));
    
    const links = networkData.connections.map(d => ({
        source: d.source,
        target: d.target,
        strength: d.strength || 1,
        type: 'normal'
    }));
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.1))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30))
        .force('x', d3.forceX(width / 2).strength(0.1))
        .force('y', d3.forceY(height / 2).strength(0.1));
    
    // Create links
    const link = linkLayer.selectAll('.network-link')
        .data(links)
        .enter().append('line')
        .attr('class', d => `network-link ${d.type}`)
        .attr('stroke-width', d => Math.sqrt(d.strength) * 2)
        .style('stroke', '#888')
        .style('opacity', 0.6);
    
    // Create nodes
    const node = nodeLayer.selectAll('.network-node')
        .data(nodes)
        .enter().append('circle')
        .attr('class', d => `network-node ${d.type} ${d.status}`)
        .attr('r', d => getNodeRadius(d.type))
        .style('fill', d => getNodeColor(d.type, d.status))
        .style('stroke', d => getNodeStrokeColor(d.type, d.status))
        .style('stroke-width', 2)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Create labels
    const labels = labelLayer.selectAll('.node-label')
        .data(nodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .text(d => d.id.replace('_', ' ').toUpperCase())
        .attr('dy', -35)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#333')
        .style('pointer-events', 'none');
    
    // Add node interactions
    node.on('click', function(event, d) {
        event.stopPropagation();
        showNodeDetails(d);
    }).on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', getNodeRadius(d.type) * 1.3);
        showTooltip(event, d);
    }).on('mouseout', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', getNodeRadius(d.type));
        hideTooltip();
    });
    
    // Simulation tick function
    simulation.on('tick', () => {
        if (!appState.topology.animationsPaused) {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
            
            // Update particles
            updateParticles();
        }
    });
    
    // Store references
    appState.topology.svg = svg;
    appState.topology.simulation = simulation;
    appState.topology.nodes = nodes;
    appState.topology.links = links;
    appState.topology.nodeElements = node;
    appState.topology.linkElements = link;
    appState.topology.particleLayer = particleLayer;
    appState.topology.g = g;
    
    // Setup zoom controls
    setupZoomControls();
    
    // Update topology stats
    updateTopologyStats();
    
    // Start particle animation
    startParticleAnimation();
    
    console.log('✅ Advanced topology initialized with D3.js force simulation');
    
    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function getNodeRadius(type) {
    const radii = {
        'sensor': 12,
        'camera': 14,
        'server': 18,
        'gateway': 20,
        'router': 16,
        'actuator': 13,
        'thermostat': 11,
        'threat': 15
    };
    return radii[type] || 12;
}

function getNodeColor(type, status) {
    const colors = {
        'sensor': '#1FB8CD',
        'camera': '#FFC185',
        'server': '#5D878F',
        'gateway': '#B4413C',
        'router': '#ECEBD5',
        'actuator': '#DB4545',
        'thermostat': '#D2BA4C'
    };
    
    let baseColor = colors[type] || '#888';
    
    if (status === 'offline') baseColor = '#666';
    if (status === 'suspicious') baseColor = '#ff6b6b';
    
    return baseColor;
}

function getNodeStrokeColor(type, status) {
    if (status === 'offline') return '#f44336';
    if (status === 'suspicious') return '#ff9800';
    return '#2196f3';
}

function setupZoomControls() {
    document.getElementById('zoom-in')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (appState.topology.zoom && appState.topology.svg) {
            appState.topology.svg.transition().duration(300).call(
                appState.topology.zoom.scaleBy, 1.5
            );
        }
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (appState.topology.zoom && appState.topology.svg) {
            appState.topology.svg.transition().duration(300).call(
                appState.topology.zoom.scaleBy, 1 / 1.5
            );
        }
    });
    
    document.getElementById('zoom-reset')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (appState.topology.zoom && appState.topology.svg) {
            appState.topology.svg.transition().duration(500).call(
                appState.topology.zoom.transform,
                d3.zoomIdentity
            );
            centerTopology();
        }
    });
}

function centerTopology() {
    if (appState.topology.simulation) {
        const rect = document.getElementById('network-topology').getBoundingClientRect();
        appState.topology.simulation
            .force('center', d3.forceCenter(rect.width / 2, rect.height / 2))
            .alpha(0.3)
            .restart();
    }
}

// Advanced Particle System for Attack Visualization
function startParticleAnimation() {
    const animateParticles = () => {
        if (!appState.topology.animationsPaused) {
            updateParticles();
            // Spawn new particles for active attacks
            appState.topology.activeAttacks.forEach(attack => {
                if (Math.random() < 0.3) { // 30% chance to spawn particle each frame
                    createAttackParticle(attack);
                }
            });
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();
}

function createAttackParticle(attack) {
    const sourceNode = appState.topology.nodes.find(n => n.id === attack.source);
    const targetNode = appState.topology.nodes.find(n => n.id === attack.target);
    
    if (!sourceNode || !targetNode || !appState.topology.particleLayer) return;
    
    const particle = {
        id: `particle_${Date.now()}_${Math.random()}`,
        x: sourceNode.x,
        y: sourceNode.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
        progress: 0,
        type: attack.type,
        speed: 0.015 + Math.random() * 0.02,
        life: 1
    };
    
    const particleElement = appState.topology.particleLayer
        .append('circle')
        .attr('class', 'attack-particle')
        .attr('r', 4)
        .attr('cx', particle.x)
        .attr('cy', particle.y)
        .style('fill', getAttackColor(attack.type))
        .style('opacity', 1)
        .style('filter', 'url(#glow)');
    
    particle.element = particleElement;
    appState.topology.particles.push(particle);
}

function updateParticles() {
    appState.topology.particles = appState.topology.particles.filter(particle => {
        particle.progress += particle.speed;
        particle.life -= 0.008;
        
        if (particle.progress >= 1 || particle.life <= 0) {
            if (particle.element) particle.element.remove();
            return false;
        }
        
        // Update particle position using smooth interpolation
        const t = easeInOutCubic(particle.progress);
        const newX = particle.x + (particle.targetX - particle.x) * t;
        const newY = particle.y + (particle.targetY - particle.y) * t;
        
        particle.x = newX;
        particle.y = newY;
        
        if (particle.element) {
            particle.element
                .attr('cx', particle.x)
                .attr('cy', particle.y)
                .style('opacity', particle.life);
        }
        
        return true;
    });
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function getAttackColor(type) {
    const colors = {
        'ddos': '#ff4757',
        'malware': '#ff6b6b',
        'spoofing': '#ffa502',
        'injection': '#ff9f43',
        'brute-force': '#ffdd59'
    };
    return colors[type] || '#ff4757';
}

// FIXED Attack Simulation Integration with Topology
function triggerTopologyAttack(attackType, sourceId, targetId) {
    console.log(`🚨 Triggering topology attack: ${attackType} from ${sourceId} to ${targetId}`);
    
    const attack = {
        id: `attack_${Date.now()}`,
        type: attackType,
        source: sourceId === 'external' ? 'gateway_001' : sourceId, // Use gateway for external attacks
        target: targetId,
        timestamp: new Date(),
        active: true
    };
    
    appState.topology.activeAttacks.push(attack);
    
    // Update link to show attack
    if (appState.topology.linkElements) {
        appState.topology.linkElements
            .filter(d => {
                const sourceMatch = d.source.id === attack.source && d.target.id === attack.target;
                const targetMatch = d.source.id === attack.target && d.target.id === attack.source;
                return sourceMatch || targetMatch;
            })
            .classed('attack', true)
            .transition()
            .duration(500)
            .style('stroke', getAttackColor(attackType))
            .style('stroke-width', 6)
            .style('opacity', 1)
            .style('filter', 'url(#glow)');
    }
    
    // Highlight affected nodes
    if (appState.topology.nodeElements) {
        appState.topology.nodeElements
            .filter(d => d.id === attack.source || d.id === attack.target)
            .classed('under-attack', true)
            .transition()
            .duration(500)
            .style('stroke', getAttackColor(attackType))
            .style('stroke-width', 5)
            .style('filter', 'url(#glow)');
    }
    
    // Update topology stats
    updateTopologyStats();
    
    console.log(`✅ Attack visualization activated: ${attack.id}`);
    
    return attack.id;
}

function stopTopologyAttack(attackId) {
    const attackIndex = appState.topology.activeAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;
    
    const attack = appState.topology.activeAttacks[attackIndex];
    appState.topology.activeAttacks.splice(attackIndex, 1);
    
    // Reset link appearance
    if (appState.topology.linkElements) {
        appState.topology.linkElements
            .filter(d => {
                const sourceMatch = d.source.id === attack.source && d.target.id === attack.target;
                const targetMatch = d.source.id === attack.target && d.target.id === attack.source;
                return sourceMatch || targetMatch;
            })
            .classed('attack', false)
            .transition()
            .duration(1000)
            .style('stroke', '#888')
            .style('stroke-width', 2)
            .style('opacity', 0.6)
            .style('filter', null);
    }
    
    // Reset node appearance
    if (appState.topology.nodeElements) {
        appState.topology.nodeElements
            .filter(d => d.id === attack.source || d.id === attack.target)
            .classed('under-attack', false)
            .transition()
            .duration(1000)
            .style('stroke', d => getNodeStrokeColor(d.type, d.status))
            .style('stroke-width', 2)
            .style('filter', null);
    }
    
    // Update topology stats
    updateTopologyStats();
    
    console.log(`✅ Stopped topology attack: ${attackId}`);
}

function updateTopologyStats() {
    const nodeCount = appState.topology.nodes?.length || 0;
    const linkCount = appState.topology.links?.length || 0;
    const threatCount = appState.topology.activeAttacks?.length || 0;
    
    const nodeCountEl = document.getElementById('node-count');
    const connectionCountEl = document.getElementById('connection-count');
    const threatCountEl = document.getElementById('threat-count');
    
    if (nodeCountEl) nodeCountEl.textContent = nodeCount;
    if (connectionCountEl) connectionCountEl.textContent = linkCount;
    if (threatCountEl) threatCountEl.textContent = threatCount;
}

// Node Details Panel
function showNodeDetails(node) {
    const panel = document.getElementById('node-details-panel');
    const title = document.getElementById('node-details-title');
    const content = document.getElementById('node-details-content');
    
    if (!panel || !title || !content) return;
    
    title.textContent = `${node.id} Details`;
    
    content.innerHTML = `
        <div style="display: grid; gap: 12px;">
            <div>
                <strong>Type:</strong> ${node.type.charAt(0).toUpperCase() + node.type.slice(1)}
            </div>
            <div>
                <strong>IP Address:</strong> <code>${node.ip}</code>
            </div>
            <div>
                <strong>Status:</strong> 
                <span class="status ${node.status === 'online' ? 'success' : node.status === 'suspicious' ? 'warning' : 'error'}">
                    ${node.status.toUpperCase()}
                </span>
            </div>
            <div>
                <strong>Manufacturer:</strong> ${node.manufacturer}
            </div>
            <div>
                <strong>Group:</strong> ${node.group}
            </div>
            <div style="margin-top: 16px;">
                <strong>Security Actions:</strong>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button class="btn btn--sm btn--primary" onclick="scanNode('${node.id}')">🔍 Scan</button>
                    <button class="btn btn--sm btn--secondary" onclick="isolateNode('${node.id}')">🔒 Isolate</button>
                    <button class="btn btn--sm btn--outline" onclick="resetNode('${node.id}')">🔄 Reset</button>
                </div>
            </div>
        </div>
    `;
    
    panel.style.display = 'block';
}

// Tooltip functions
function showTooltip(event, d) {
    console.log(`Showing tooltip for ${d.id}`);
}

function hideTooltip() {
    // Implementation for tooltip hiding
}

// Chart Initialization (Enhanced from original)
function initializeCharts() {
    console.log('📊 Initializing enhanced charts...');
    try {
        setupTrafficChart();
        setupAttackTypesChart();
        setupRealtimeChart();
        setupPerformanceChart();
    } catch (error) {
        console.error('❌ Error initializing charts:', error);
    }
}

function setupTrafficChart() {
    const ctx = document.getElementById('traffic-chart');
    if (!ctx) return;

    const data = generateTrafficData();
    appState.charts.traffic = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Benign Traffic',
                    data: data.benign,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: 'Malicious Traffic',
                    data: data.malicious,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Packets/sec'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function setupAttackTypesChart() {
    const ctx = document.getElementById('attack-types-chart');
    if (!ctx) return;

    appState.charts.attackTypes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: networkData.attackTypes.map(item => item.name),
            datasets: [{
                data: networkData.attackTypes.map(item => item.value),
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            }
        }
    });
}

function setupRealtimeChart() {
    const ctx = document.getElementById('realtime-chart');
    if (!ctx) return;

    const initialData = Array.from({length: 20}, (_, i) => ({
        x: i,
        network: Math.random() * 100 + 50,
        threats: Math.random() * 20
    }));
    
    appState.charts.realtime = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Network Activity',
                    data: initialData.map(d => ({x: d.x, y: d.network})),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'Threats Detected',
                    data: initialData.map(d => ({x: d.x, y: d.threats})),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Activity Level'
                    }
                }
            }
        }
    });
}

function setupPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;

    const performanceData = generatePerformanceData();
    appState.charts.performance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [
                {
                    label: 'Accuracy',
                    data: performanceData.accuracy,
                    borderColor: '#1FB8CD',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Precision',
                    data: performanceData.precision,
                    borderColor: '#FFC185',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Recall',
                    data: performanceData.recall,
                    borderColor: '#5D878F',
                    tension: 0.4,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// FIXED Event Listeners Setup
function setupEventListeners() {
    console.log('🎛️ Setting up enhanced event listeners...');

    setupThemeToggle();
    setupEmergencyStop();
    setupAttackSimulation();
    setupMonitoringControls();
    setupAIControls();
    setupLogControls();
    setupConfigControls();
    setupReportControls();
    setupReplayControls();
    setupTopologyControls();
    setupRangeSliders();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }
}

function setupEmergencyStop() {
    const emergencyStop = document.getElementById('emergency-stop');
    if (emergencyStop) {
        emergencyStop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            emergencyStopHandler();
        });
    }
}

function setupAttackSimulation() {
    const startAttack = document.getElementById('start-attack');
    const stopAttack = document.getElementById('stop-attack');
    const previewAttack = document.getElementById('preview-attack');
    
    if (startAttack) {
        startAttack.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startAttackSimulation();
        });
    }
    
    if (stopAttack) {
        stopAttack.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopAttackSimulation();
        });
    }
    
    if (previewAttack) {
        previewAttack.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewAttackHandler();
        });
    }
}

function setupTopologyControls() {
    const refreshTopology = document.getElementById('refresh-topology');
    const centerTopologyBtn = document.getElementById('center-topology');
    const pauseAnimations = document.getElementById('pause-animations');
    const closeNodeDetails = document.getElementById('close-node-details');
    
    if (refreshTopology) {
        refreshTopology.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Refreshing topology...');
            if (appState.topology.simulation) {
                appState.topology.simulation.alpha(0.3).restart();
            }
            addLiveAlert('Topology Refreshed', 'Network topology has been refreshed', 'info');
        });
    }
    
    if (centerTopologyBtn) {
        centerTopologyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            centerTopology();
        });
    }
    
    if (pauseAnimations) {
        pauseAnimations.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appState.topology.animationsPaused = !appState.topology.animationsPaused;
            pauseAnimations.textContent = appState.topology.animationsPaused ? '▶️ Resume' : '⏸️ Pause';
            addLiveAlert('Animations ' + (appState.topology.animationsPaused ? 'Paused' : 'Resumed'), 
                        'Topology animations have been ' + (appState.topology.animationsPaused ? 'paused' : 'resumed'), 'info');
        });
    }
    
    if (closeNodeDetails) {
        closeNodeDetails.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('node-details-panel').style.display = 'none';
        });
    }
    
    // FIXED Filter checkboxes - prevent navigation
    ['show-sensors', 'show-cameras', 'show-servers', 'show-threats'].forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                applyTopologyFilters();
            });
        }
    });
}

function applyTopologyFilters() {
    const filters = {
        sensors: document.getElementById('show-sensors')?.checked !== false,
        cameras: document.getElementById('show-cameras')?.checked !== false,
        servers: document.getElementById('show-servers')?.checked !== false,
        threats: document.getElementById('show-threats')?.checked !== false
    };
    
    console.log('Applying topology filters:', filters);
    
    if (appState.topology.nodeElements) {
        appState.topology.nodeElements.style('display', d => {
            const typeMap = {
                'sensor': filters.sensors,
                'camera': filters.cameras,
                'server': filters.servers,
                'thermostat': filters.sensors,
                'actuator': filters.sensors,
                'gateway': filters.servers,
                'router': filters.servers,
                'threat': filters.threats
            };
            return typeMap[d.type] !== false ? 'block' : 'none';
        });
    }
}

// FIXED Attack Simulation with Proper Topology Integration
function startAttackSimulation() {
    if (appState.attackInProgress) return;

    const attackType = document.getElementById('attack-type')?.value || 'ddos';
    const sourceDevice = document.getElementById('source-device')?.value || 'external';
    const targetDevice = document.getElementById('target-device')?.value || 'gateway_001';
    const intensity = document.getElementById('intensity-level')?.value || '5';
    const duration = parseInt(document.getElementById('attack-duration')?.value) || 30;

    console.log(`🚀 Starting attack simulation: ${attackType} from ${sourceDevice} to ${targetDevice}`);

    appState.attackInProgress = true;
    appState.currentAttackId = null;
    
    // Update UI
    const startButton = document.getElementById('start-attack');
    const stopButton = document.getElementById('stop-attack');
    const progressElement = document.getElementById('attack-progress');
    
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
    if (progressElement) progressElement.style.display = 'block';

    // Trigger topology visualization IMMEDIATELY
    if (appState.topology.svg) {
        appState.currentAttackId = triggerTopologyAttack(attackType, sourceDevice, targetDevice);
        console.log(`✅ Topology attack triggered with ID: ${appState.currentAttackId}`);
    } else {
        console.log('ℹ️ Topology not initialized yet, attack will not be visualized');
    }

    // Start attack progress simulation
    let progress = 0;
    let packetsSent = 0;
    let detectionRate = 0;
    let mitigationStatus = 'Monitoring';
    
    const progressBar = document.getElementById('attack-progress-bar');
    const attackLog = document.getElementById('attack-log');
    const packetsSentEl = document.getElementById('packets-sent');
    const detectionRateEl = document.getElementById('detection-rate-sim');
    const mitigationStatusEl = document.getElementById('mitigation-status');
    
    let logEntries = [];

    const attackInterval = setInterval(() => {
        progress += 100 / (duration * 10);
        packetsSent += Math.floor(Math.random() * 100) + 20;
        detectionRate = Math.min(100, detectionRate + Math.random() * 8);
        
        if (progress > 40 && mitigationStatus === 'Monitoring') {
            mitigationStatus = 'Detecting';
        }
        if (progress > 70 && mitigationStatus === 'Detecting') {
            mitigationStatus = 'Mitigating';
        }
        
        if (progressBar) progressBar.style.width = Math.min(progress, 100) + '%';
        if (packetsSentEl) packetsSentEl.textContent = packetsSent.toLocaleString();
        if (detectionRateEl) detectionRateEl.textContent = Math.floor(detectionRate) + '%';
        if (mitigationStatusEl) mitigationStatusEl.textContent = mitigationStatus;

        // Add log entries
        if (Math.random() < 0.5) {
            const timestamp = new Date().toLocaleTimeString();
            const messages = [
                `[${timestamp}] 🚨 Attack initiated: ${attackType.toUpperCase()} → ${targetDevice}`,
                `[${timestamp}] 📡 Packets sent: ${packetsSent} (intensity: ${intensity}/10)`,
                `[${timestamp}] 🤖 AI detection confidence: ${Math.floor(detectionRate)}%`,
                `[${timestamp}] ⚠️ Network anomaly detected on ${targetDevice}`,
                `[${timestamp}] 🔍 Applying deep packet inspection`,
                `[${timestamp}] ${mitigationStatus === 'Mitigating' ? '🛡️ Mitigation protocols activated' : '👁️ Monitoring traffic patterns'}`,
                `[${timestamp}] 🌐 Security perimeter status: ${mitigationStatus.toLowerCase()}`
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            logEntries.push(randomMessage);
            
            if (logEntries.length > 8) logEntries.shift();
            if (attackLog) {
                attackLog.textContent = logEntries.join('\n');
                attackLog.scrollTop = attackLog.scrollHeight;
            }
        }

        if (progress >= 100) {
            clearInterval(attackInterval);
            setTimeout(stopAttackSimulation, 1000);
        }
    }, 100);

    appState.intervals.attack = attackInterval;
    addLiveAlert('Attack Simulation Started', `${attackType.toUpperCase()} attack launched against ${targetDevice}`, 'warning');
}

function stopAttackSimulation() {
    console.log('🛑 Stopping attack simulation');
    appState.attackInProgress = false;
    
    // Stop topology attack
    if (appState.currentAttackId) {
        stopTopologyAttack(appState.currentAttackId);
        appState.currentAttackId = null;
    }
    
    const startButton = document.getElementById('start-attack');
    const stopButton = document.getElementById('stop-attack');
    
    if (startButton) startButton.disabled = false;
    if (stopButton) stopButton.disabled = true;
    
    if (appState.intervals.attack) {
        clearInterval(appState.intervals.attack);
    }

    setTimeout(() => {
        const progressElement = document.getElementById('attack-progress');
        const progressBar = document.getElementById('attack-progress-bar');
        if (progressElement) progressElement.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
    }, 5000);

    addLiveAlert('Attack Simulation Completed', 'Attack simulation has been successfully completed', 'success');
}

// Continue with remaining event handlers...
function setupMonitoringControls() {
    const startMonitoring = document.getElementById('start-monitoring');
    const pauseMonitoring = document.getElementById('pause-monitoring');
    
    if (startMonitoring) {
        startMonitoring.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appState.isMonitoring = true;
            startMonitoring.textContent = '✅ Active';
            startMonitoring.disabled = true;
            if (pauseMonitoring) pauseMonitoring.disabled = false;
            addLiveAlert('Monitoring Started', 'Real-time monitoring activated', 'info');
        });
    }
    
    if (pauseMonitoring) {
        pauseMonitoring.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appState.isMonitoring = false;
            if (startMonitoring) {
                startMonitoring.textContent = '▶️ Start';
                startMonitoring.disabled = false;
            }
            pauseMonitoring.disabled = true;
            addLiveAlert('Monitoring Paused', 'Real-time monitoring paused', 'info');
        });
    }
}

function setupAIControls() {
    const retrainModel = document.getElementById('retrain-model');
    const evaluateModel = document.getElementById('evaluate-model');
    const exportModel = document.getElementById('export-model');
    
    if (retrainModel) {
        retrainModel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            retrainModel.textContent = '🔄 Training...';
            retrainModel.disabled = true;
            setTimeout(() => {
                retrainModel.textContent = '🔄 Retrain Model';
                retrainModel.disabled = false;
                addLiveAlert('Model Retrained', 'AI model successfully retrained', 'success');
            }, 3000);
        });
    }
    
    if (evaluateModel) {
        evaluateModel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert(`🤖 AI Model Performance Evaluation:\n\nAccuracy: 94.2% ✅\nPrecision: 92.8% ✅\nRecall: 96.1% ✅\nF1 Score: 94.4% ✅\n\nLast Training: 2 hours ago\nTest Dataset: 50,000 samples\nConfidence: High`);
        });
    }
    
    if (exportModel) {
        exportModel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const blob = new Blob(['AI Model Export Data'], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cybersecurity_ai_model.pkl';
            a.click();
            URL.revokeObjectURL(url);
            addLiveAlert('Model Exported', 'AI model exported successfully', 'info');
        });
    }
}

function setupLogControls() {
    const filterLogs = document.getElementById('filter-logs');
    const clearLogs = document.getElementById('clear-logs');
    const exportLogs = document.getElementById('export-logs');
    
    if (filterLogs) {
        filterLogs.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const level = document.getElementById('log-level')?.value || 'all';
            const search = document.getElementById('log-search')?.value || '';
            loadSystemLogs(level, search);
            addLiveAlert('Logs Filtered', `Filter applied: ${level}${search ? `, search: "${search}"` : ''}`, 'info');
        });
    }
    
    if (clearLogs) {
        clearLogs.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const logsContainer = document.getElementById('logs-container');
            if (logsContainer) {
                logsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">System logs cleared</div>';
            }
            addLiveAlert('Logs Cleared', 'All system logs have been cleared', 'info');
        });
    }
    
    if (exportLogs) {
        exportLogs.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const logs = generateSystemLogs();
            const logText = logs.map(log => `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`).join('\n');
            const blob = new Blob([logText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `security_logs_${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            addLiveAlert('Logs Exported', 'System logs exported successfully', 'info');
        });
    }
}

function setupConfigControls() {
    const saveConfig = document.getElementById('save-config');
    const resetConfig = document.getElementById('reset-config');
    
    if (saveConfig) {
        saveConfig.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            saveConfig.textContent = '💾 Saving...';
            saveConfig.disabled = true;
            setTimeout(() => {
                saveConfig.textContent = '💾 Save Configuration';
                saveConfig.disabled = false;
                addLiveAlert('Configuration Saved', 'System configuration saved successfully', 'success');
            }, 1500);
        });
    }
    
    if (resetConfig) {
        resetConfig.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Reset to default configuration? This cannot be undone.')) {
                const configs = [
                    { id: 'sensitivity-level', value: 7 },
                    { id: 'alert-threshold', value: 85 },
                    { id: 'network-segment', value: '192.168.1.0/24' },
                    { id: 'monitoring-port', value: 8080 }
                ];
                
                configs.forEach(config => {
                    const element = document.getElementById(config.id);
                    if (element) element.value = config.value;
                });
                
                updateRangeValue('sensitivity-level', 'sensitivity-value');
                addLiveAlert('Configuration Reset', 'Configuration reset to defaults', 'info');
            }
        });
    }
}

function setupReportControls() {
    const generateReport = document.getElementById('generate-report');
    if (generateReport) {
        generateReport.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            generateReportHandler('custom');
        });
    }
}

function setupReplayControls() {
    const startReplay = document.getElementById('start-replay');
    const pauseReplay = document.getElementById('pause-replay');
    const stopReplay = document.getElementById('stop-replay');
    
    if (startReplay) {
        startReplay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const attackSelect = document.getElementById('replay-attack');
            if (!attackSelect?.value) {
                alert('Please select an attack to replay');
                return;
            }
            
            appState.replayInProgress = true;
            startReplay.disabled = true;
            if (pauseReplay) pauseReplay.disabled = false;
            if (stopReplay) stopReplay.disabled = false;
            
            document.getElementById('replay-timeline').style.display = 'block';
            document.getElementById('replay-visualization').style.display = 'block';
            
            simulateReplay();
            addLiveAlert('Replay Started', `Started replaying ${attackSelect.value}`, 'info');
        });
    }
    
    if (pauseReplay) {
        pauseReplay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appState.replayInProgress = !appState.replayInProgress;
            pauseReplay.textContent = appState.replayInProgress ? '⏸️ Pause' : '▶️ Resume';
        });
    }
    
    if (stopReplay) {
        stopReplay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appState.replayInProgress = false;
            if (startReplay) startReplay.disabled = false;
            if (pauseReplay) {
                pauseReplay.disabled = true;
                pauseReplay.textContent = '⏸️ Pause';
            }
            stopReplay.disabled = true;
            document.getElementById('timeline-progress').style.width = '0%';
            addLiveAlert('Replay Stopped', 'Attack replay stopped', 'info');
        });
    }
}

function setupRangeSliders() {
    const intensityLevel = document.getElementById('intensity-level');
    const sensitivityLevel = document.getElementById('sensitivity-level');
    
    if (intensityLevel) {
        intensityLevel.addEventListener('input', () => {
            updateRangeValue('intensity-level', 'intensity-value');
        });
    }
    
    if (sensitivityLevel) {
        sensitivityLevel.addEventListener('input', () => {
            updateRangeValue('sensitivity-level', 'sensitivity-value');
        });
    }
}

// Real-time Updates
function startRealTimeUpdates() {
    console.log('⚡ Starting real-time updates...');
    
    appState.intervals.metrics = setInterval(updateMetrics, 3000);
    appState.intervals.monitoring = setInterval(updateRealtimeMonitoring, 1000);
    appState.intervals.time = setInterval(updateLastUpdatedTime, 60000);
    appState.intervals.topology = setInterval(updateTopologyStats, 5000);
}

function updateMetrics() {
    const activeThreats = Math.floor(Math.random() * 10) + 3;
    const detectionRate = (Math.random() * 0.1 + 0.9);
    const currentMitigations = parseInt(document.getElementById('total-mitigations')?.textContent) || 156;
    const newMitigations = currentMitigations + Math.floor(Math.random() * 2);

    const elements = {
        'active-threats': activeThreats,
        'detection-rate': (detectionRate * 100).toFixed(0) + '%',
        'total-mitigations': newMitigations,
        'packets-per-sec': (Math.random() * 2000 + 500).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        'bandwidth-usage': (Math.random() * 100 + 50).toFixed(1) + ' MB/s',
        'system-load': Math.floor(Math.random() * 30 + 60) + '%',
        'anomaly-count': Math.floor(Math.random() * 5) + 1
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function updateRealtimeMonitoring() {
    if (!appState.isMonitoring || appState.currentTab !== 'monitoring') return;

    const chart = appState.charts.realtime;
    if (!chart) return;

    const networkActivity = Math.random() * 100 + 50;
    const threats = Math.random() * 20;
    const time = chart.data.datasets[0].data.length;

    // Keep only last 60 data points
    if (time > 60) {
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }

    chart.data.datasets[0].data.push({x: time, y: networkActivity});
    chart.data.datasets[1].data.push({x: time, y: threats});
    
    chart.update('none');
}

// Utility Functions
function updateLastUpdatedTime() {
    const element = document.getElementById('last-updated-time');
    if (element) {
        element.textContent = new Date().toLocaleTimeString();
    }
}

function updateRangeValue(rangeId, valueId) {
    const range = document.getElementById(rangeId);
    const valueSpan = document.getElementById(valueId);
    if (range && valueSpan) {
        valueSpan.textContent = range.value;
    }
}

function addLiveAlert(title, message, type = 'info') {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${type === 'error' ? 'critical' : ''}`;
    alertItem.innerHTML = `
        <div class="alert-content">
            <div class="alert-message"><strong>${title}:</strong> ${message}</div>
            <div class="alert-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;

    alertsList.insertBefore(alertItem, alertsList.firstChild);

    // Keep only last 10 alerts
    while (alertsList.children.length > 10) {
        alertsList.removeChild(alertsList.lastChild);
    }

    // Auto-remove after 15 seconds
    setTimeout(() => {
        if (alertItem.parentNode) {
            alertItem.parentNode.removeChild(alertItem);
        }
    }, 15000);
}

// Event Handler Functions
function toggleTheme() {
    const button = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-color-scheme', newTheme);
    
    if (button) {
        button.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    addLiveAlert('Theme Changed', `Switched to ${newTheme} theme`, 'info');
}

function emergencyStopHandler() {
    if (confirm('🚨 EMERGENCY STOP: Stop all security operations immediately?')) {
        // Stop all operations
        appState.attackInProgress = false;
        appState.isMonitoring = false;
        appState.replayInProgress = false;
        
        // Clear all active attacks
        appState.topology.activeAttacks = [];
        
        // Clear intervals
        Object.values(appState.intervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        
        // Reset UI
        const buttons = [
            'start-attack', 'start-monitoring', 'start-replay'
        ];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = false;
        });
        
        addLiveAlert('EMERGENCY STOP ACTIVATED', 'All security operations have been stopped immediately', 'error');
    }
}

function previewAttackHandler() {
    const attackType = document.getElementById('attack-type')?.value || 'ddos';
    const sourceDevice = document.getElementById('source-device')?.value || 'external';
    const targetDevice = document.getElementById('target-device')?.value || 'gateway_001';
    const intensity = document.getElementById('intensity-level')?.value || '5';
    const duration = document.getElementById('attack-duration')?.value || '30';

    alert(`🔍 Attack Simulation Preview:\n\n` +
          `Type: ${attackType.toUpperCase()}\n` +
          `Source: ${sourceDevice}\n` +
          `Target: ${targetDevice}\n` +
          `Intensity: ${intensity}/10\n` +
          `Duration: ${duration} seconds\n\n` +
          `This attack will be safely simulated with real-time topology visualization and animated attack paths.`);
}

function generateReportHandler(type) {
    const button = document.getElementById('generate-report');
    if (button) {
        const originalText = button.textContent;
        button.textContent = '📄 Generating...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            
            const reportName = `${type}_security_report_${new Date().toISOString().split('T')[0]}.pdf`;
            addReportToList(reportName, type);
            addLiveAlert('Report Generated', `${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`, 'success');
        }, 2500);
    }
}

function simulateReplay() {
    let progress = 0;
    const progressBar = document.getElementById('timeline-progress');
    const eventsContainer = document.getElementById('timeline-events');
    
    if (!progressBar || !eventsContainer) return;
    
    const events = [
        { time: '00:00', description: '🔍 Attack initiation detected from external IP' },
        { time: '00:15', description: '⚠️ Malicious packet patterns identified - DDoS signature' },
        { time: '00:30', description: '🤖 AI model triggered high-confidence alert (94.2%)' },
        { time: '00:45', description: '🛡️ Automatic mitigation protocols activated' },
        { time: '01:00', description: '✅ Attack successfully mitigated and IP blocked' }
    ];

    eventsContainer.innerHTML = events.map(event => `
        <div class="timeline-event">
            <div class="event-time">${event.time}</div>
            <div class="event-description">${event.description}</div>
        </div>
    `).join('');

    const interval = setInterval(() => {
        if (!appState.replayInProgress) return;
        
        progress += 2;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const stopBtn = document.getElementById('stop-replay');
                if (stopBtn) stopBtn.click();
            }, 1000);
        }
    }, 100);
}

// Data Generation Functions
function generateTrafficData() {
    const labels = [];
    const benign = [];
    const malicious = [];
    
    for (let i = 0; i < 24; i++) {
        labels.push(`${i.toString().padStart(2, '0')}:00`);
        benign.push(Math.floor(Math.random() * 1000) + 500 + Math.sin(i * 0.5) * 200);
        malicious.push(Math.floor(Math.random() * 100) + 10 + (i > 12 && i < 18 ? 50 : 0));
    }
    
    return { labels, benign, malicious };
}

function generatePerformanceData() {
    const labels = [];
    const accuracy = [];
    const precision = [];
    const recall = [];
    
    for (let i = 0; i < 30; i++) {
        labels.push(`Day ${i + 1}`);
        accuracy.push(Math.max(0.85, Math.min(0.98, 0.91 + (Math.random() - 0.5) * 0.1)));
        precision.push(Math.max(0.80, Math.min(0.95, 0.88 + (Math.random() - 0.5) * 0.12)));
        recall.push(Math.max(0.85, Math.min(0.98, 0.93 + (Math.random() - 0.5) * 0.08)));
    }
    
    return { labels, accuracy, precision, recall };
}

function generateSystemLogs() {
    const levels = ['info', 'warning', 'critical', 'debug'];
    const messages = [
        '🔍 Network packet analysis completed successfully',
        '⚠️ Anomaly detected in sensor network - investigating',
        '🤖 AI model prediction accuracy: 94.2%',
        '🛡️ Mitigation protocol activated for suspicious IP',
        '✅ System health check passed - all systems nominal',
        '🔗 Database connection established and verified',
        '📡 Threat intelligence feeds updated successfully',
        '💾 Configuration backup created automatically',
        '📊 Real-time monitoring service started',
        '⚡ Attack simulation completed without errors',
        '🔒 SSL certificate validation successful',
        '👤 User authentication logged and verified',
        '💻 Memory usage within normal parameters',
        '🌐 Network latency: 12ms (optimal)',
        '🔥 Firewall rules synchronized across nodes'
    ];
    
    const logs = [];
    const now = Date.now();
    
    for (let i = 0; i < 50; i++) {
        const timestamp = new Date(now - i * 120000).toLocaleString();
        const level = levels[Math.floor(Math.random() * levels.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        logs.push({ timestamp, level, message });
    }
    
    return logs.reverse();
}

function loadDeviceStatus() {
    const devicesGrid = document.getElementById('devices-grid');
    if (!devicesGrid) return;

    devicesGrid.innerHTML = networkData.devices.map(device => `
        <div class="device-card" style="cursor: pointer;" onclick="showDeviceDetails('${device.id}')">
            <div class="device-header">
                <div class="device-name">${device.id.replace('_', ' ').toUpperCase()}</div>
                <div class="device-status-badge ${device.status}">${device.status.toUpperCase()}</div>
            </div>
            <div class="device-ip">${device.ip}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                ${device.manufacturer} • ${device.type}
            </div>
        </div>
    `).join('');
}

function loadSystemLogs(level = 'all', search = '') {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;

    const logs = generateSystemLogs();
    const filteredLogs = logs.filter(log => {
        const matchesLevel = level === 'all' || log.level === level;
        const matchesSearch = search === '' || log.message.toLowerCase().includes(search.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    if (filteredLogs.length === 0) {
        logsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">No logs match the current filter criteria</div>';
        return;
    }

    logsContainer.innerHTML = filteredLogs.map(log => `
        <div class="log-entry">
            <div class="log-timestamp">${log.timestamp}</div>
            <div class="log-level ${log.level}">${log.level.toUpperCase()}</div>
            <div class="log-message">${log.message}</div>
        </div>
    `).join('');
}

function loadRecentReports() {
    const reportsList = document.getElementById('reports-list');
    if (!reportsList) return;

    const reports = [
        { name: 'Security_Analysis_2025-01-20.pdf', date: '2025-01-20', size: '2.4 MB' },
        { name: 'Threat_Intelligence_2025-01-19.pdf', date: '2025-01-19', size: '1.9 MB' },
        { name: 'Network_Performance_2025-01-18.pdf', date: '2025-01-18', size: '3.1 MB' }
    ];

    reportsList.innerHTML = reports.map(report => `
        <div class="report-item">
            <div class="report-info">
                <div class="report-name">${report.name}</div>
                <div class="report-date">${report.date} • ${report.size}</div>
            </div>
            <div class="report-actions">
                <button class="btn btn--outline btn--sm" onclick="downloadReport('${report.name}')">📥 Download</button>
                <button class="btn btn--secondary btn--sm" onclick="viewReport('${report.name}')">👁️ View</button>
            </div>
        </div>
    `).join('');
}

function addReportToList(name, type) {
    const reportsList = document.getElementById('reports-list');
    if (!reportsList) return;
    
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    const size = (Math.random() * 3 + 1).toFixed(1) + ' MB';
    
    reportItem.innerHTML = `
        <div class="report-info">
            <div class="report-name">${name}</div>
            <div class="report-date">${new Date().toLocaleDateString()} • ${size}</div>
        </div>
        <div class="report-actions">
            <button class="btn btn--outline btn--sm" onclick="downloadReport('${name}')">📥 Download</button>
            <button class="btn btn--secondary btn--sm" onclick="viewReport('${name}')">👁️ View</button>
        </div>
    `;
    
    reportsList.insertBefore(reportItem, reportsList.firstChild);
}

// Global functions for onclick handlers
window.generateReport = generateReportHandler;

window.downloadReport = function(name) {
    const blob = new Blob(['Mock PDF Report Content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    addLiveAlert('Report Downloaded', `Report ${name} downloaded successfully`, 'info');
};

window.viewReport = function(name) {
    alert(`📊 Viewing Report: ${name}\n\n📈 Report Overview:\n- Generated: ${new Date().toLocaleDateString()}\n- Status: Complete\n- Pages: ${Math.floor(Math.random() * 20) + 5}\n- Security Level: Confidential\n\nThis would open the report viewer in a production system.`);
};

window.showDeviceDetails = function(deviceId) {
    const device = networkData.devices.find(d => d.id === deviceId);
    if (!device) return;
    
    if (appState.currentTab === 'topology') {
        showNodeDetails(device);
    } else {
        alert(`🔍 Device Details: ${deviceId}\n\nType: ${device.type}\nIP: ${device.ip}\nStatus: ${device.status}\nManufacturer: ${device.manufacturer}\n\nSwitch to Network Topology tab for advanced device interaction and attack visualization.`);
    }
};

window.scanNode = function(nodeId) {
    addLiveAlert('Node Scan Started', `Security scan initiated for ${nodeId}`, 'info');
    setTimeout(() => {
        addLiveAlert('Node Scan Complete', `Security scan completed for ${nodeId} - No threats detected`, 'success');
    }, 2000);
};

window.isolateNode = function(nodeId) {
    if (confirm(`🔒 Isolate ${nodeId} from the network?\n\nThis will disconnect the device from all network communications.`)) {
        addLiveAlert('Node Isolated', `${nodeId} has been isolated from the network`, 'warning');
    }
};

window.resetNode = function(nodeId) {
    if (confirm(`🔄 Reset ${nodeId} to default configuration?\n\nThis will restart the device and restore default settings.`)) {
        addLiveAlert('Node Reset', `${nodeId} has been reset and is restarting`, 'info');
    }
};

console.log('🎉 Advanced Cybersecurity Dashboard with FIXED navigation and attack visualization loaded successfully!');