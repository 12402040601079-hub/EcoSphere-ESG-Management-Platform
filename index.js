/**
 * EcoSphere ESG Management Platform - Core Interactivity Layer
 * Orchestrates login transitions, sidebar routes, data telemetry, and simulators.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global Application State ---
    const appState = {
        loggedIn: true,
        activeTab: 'dashboard',
        sidebarCollapsed: false,
        tableDensityCompact: false,
        facilityData: [
            { id: 'fac_seed1', name: 'Singapore HQ', region: 'Asia-Pacific', scope1: 320.4, scope2: 185.6, scope3: 490.0, energy: 8450, water: 32000, waste: 82, compliance: 'Compliant' },
            { id: 'fac_seed2', name: 'Berlin Manufacturing', region: 'Europe', scope1: 540.2, scope2: 310.1, scope3: 720.3, energy: 14200, water: 68500, waste: 74, compliance: 'Compliant' },
            { id: 'fac_seed3', name: 'Texas Operations', region: 'North America', scope1: 410.8, scope2: 228.4, scope3: 610.5, energy: 11800, water: 54200, waste: 68, compliance: 'Audit Due' },
            { id: 'fac_seed4', name: 'Mumbai Data Centre', region: 'South Asia', scope1: 195.0, scope2: 142.5, scope3: 380.2, energy: 6900, water: 28100, waste: 91, compliance: 'Compliant' },
            { id: 'fac_seed5', name: 'Sydney Office', region: 'Oceania', scope1: 88.6, scope2: 64.2, scope3: 198.4, energy: 3200, water: 12400, waste: 88, compliance: 'Compliant' },
            { id: 'fac_seed6', name: 'Dubai Logistics Hub', region: 'Middle East', scope1: 274.1, scope2: 196.3, scope3: 443.7, energy: 9100, water: 41800, waste: 76, compliance: 'Audit Due' }
        ],
        reportsCount: 0,
        envLogs: [
            { id: 'env_1', date: '2023-10-24', category: 'Electricity', value: 1450.00, unit: 'kWh', status: 'Verified' },
            { id: 'env_2', date: '2023-10-22', category: 'Water', value: 4200.00, unit: 'Liters', status: 'Verified' },
            { id: 'env_3', date: '2023-10-20', category: 'Fuel', value: 310.50, unit: 'Units', status: 'Pending' },
            { id: 'env_4', date: '2023-10-18', category: 'Renewable', value: 22.40, unit: '% Mix', status: 'Verified' }
        ],
        envFilter: 'ALL',
        socialLogs: [
            { id: 'soc_1', date: '2023-10-24', category: 'Diversity & Inclusion', value: 48.2, unit: '%', status: 'Verified' },
            { id: 'soc_2', date: '2023-10-24', category: 'Training & Development', value: 1250, unit: 'Hours', status: 'Verified' },
            { id: 'soc_3', date: '2023-10-18', category: 'Safety Audit', value: 0, unit: 'Incidents', status: 'Pending' },
            { id: 'soc_4', date: '2023-10-15', category: 'Volunteer Program', value: 540, unit: 'Hours', status: 'Verified' },
            { id: 'soc_5', date: '2023-10-12', category: 'Community Outreach', value: 8, unit: 'Events', status: 'Verified' }
        ],
        govAudits: [
            { id: 'gov_1', date: '2023-10-12', name: 'Q3 Security Access Review', category: 'Internal Compliance', auditor: 'Jane Doe', auditorInitials: 'JD', auditorColor: 'bg-blue-500', status: 'Compliant' },
            { id: 'gov_2', date: '2023-09-28', name: 'GHG Protocol Emission Audit', category: 'Environmental Verification', auditor: 'EcoRisk Ltd.', auditorInitials: 'ER', auditorColor: 'bg-teal-500', status: 'In Progress' },
            { id: 'gov_3', date: '2023-08-15', name: 'Supplier Ethics Assessment', category: 'Supply Chain Governance', auditor: 'Marcus Knight', auditorInitials: 'MK', auditorColor: 'bg-purple-500', status: 'Non-Compliant' },
            { id: 'gov_4', date: '2023-07-22', name: 'Data Privacy & GDPR Review', category: 'Regulatory Affairs', auditor: 'Sarah Lee', auditorInitials: 'SL', auditorColor: 'bg-green-500', status: 'Compliant' }
        ]
    };

    // --- 2. DOM Elements Selection ---
    
    // Auth elements
    const loginView = document.getElementById('login-view');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePwdBtn = document.getElementById('toggle-pwd-btn');
    
    // Core Layout elements
    const appShell = document.getElementById('app-shell');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const viewsWrapper = document.getElementById('views-wrapper');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const breadcrumbActive = document.getElementById('breadcrumb-active');

    // Tab buttons and Content Sections
    const tabTriggers = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add Data elements
    const addDataHeaderBtn = document.getElementById('add-data-header-btn');
    const addDataModal = document.getElementById('add-data-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const addDataForm = document.getElementById('add-data-form');

    // Facility Table elements
    const facilityTable = document.getElementById('facility-table');
    const facilityTableBody = document.getElementById('facility-table-body');
    const densityToggleBtn = document.getElementById('density-toggle-btn');
    const facilitySearchInput = document.getElementById('facility-search-input');

    // Reports & Simulators
    const sidebarGenReportBtn = document.getElementById('sidebar-gen-report-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const loadingRow = document.getElementById('generating-report-progress-row');
    const simulatedProgress = document.getElementById('simulated-progress');
    const reportsListContainer = document.getElementById('reports-list-container');

    // Activity Log
    const activityLogContainer = document.getElementById('activity-log-container');

    // Toast alerts container
    const toastContainer = document.getElementById('toast-container');


    // --- 3. Authentication Routing & View States ---

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple mockup validation
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            if (email && password) {
                appState.loggedIn = true;
                
                // Transition views with fade-out
                loginView.classList.add('transition-opacity', 'duration-300', 'opacity-0');
                setTimeout(() => {
                    loginView.classList.add('hidden');
                    appShell.classList.remove('hidden');
                    appShell.classList.add('transition-opacity', 'duration-300', 'opacity-0');
                    
                    // Trigger reflow/repaint
                    appShell.offsetHeight;
                    
                    appShell.classList.remove('opacity-0');
                    appShell.classList.add('opacity-100');
                    
                    // Render default dynamic values
                    renderFacilityTable();
                    updateSustainabilityStats();
                    
                    showToast('Welcome back, Alex River!', 'success');
                    logActivity('Logged into EcoSphere Platform');
                }, 300);
            }
        });
    }

    if (togglePwdBtn && passwordInput) {
        togglePwdBtn.addEventListener('click', () => {
            const isPwd = passwordInput.type === 'password';
            passwordInput.type = isPwd ? 'text' : 'password';
            togglePwdBtn.querySelector('span').textContent = isPwd ? 'visibility_off' : 'visibility';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appState.loggedIn = false;
            
            // Reset fields
            loginForm.reset();
            if (passwordInput) passwordInput.type = 'password';
            if (togglePwdBtn) togglePwdBtn.querySelector('span').textContent = 'visibility';
            
            appShell.classList.add('transition-opacity', 'duration-300', 'opacity-0');
            setTimeout(() => {
                appShell.classList.add('hidden');
                loginView.classList.remove('hidden');
                loginView.offsetHeight;
                loginView.classList.remove('opacity-0');
                loginView.classList.add('opacity-100');
                
                showToast('Successfully logged out of your session.', 'info');
            }, 300);
        });
    }

    // --- 4. Sidebar Collapsible Controls ---

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            appState.sidebarCollapsed = !appState.sidebarCollapsed;
            const iconSpan = sidebarToggleBtn.querySelector('span');

            if (appState.sidebarCollapsed) {
                sidebar.classList.add('sidebar-collapsed');
                mainContent.classList.add('main-content-expanded');
                if (iconSpan) iconSpan.textContent = 'last_page';
            } else {
                sidebar.classList.remove('sidebar-collapsed');
                mainContent.classList.remove('main-content-expanded');
                if (iconSpan) iconSpan.textContent = 'first_page';
            }
        });
    }


    // --- 5. Single Page Tab Navigation Routes ---

    function switchTab(tabId) {
        if (!tabId) return;
        appState.activeTab = tabId;

        // Hide all views and show target
        tabContents.forEach(content => {
            if (content.id === `${tabId}-view`) {
                content.classList.remove('hidden');
                content.classList.add('active');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active');
            }
        });

        // Update active class state on navigation buttons
        tabTriggers.forEach(btn => {
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === tabId) {
                btn.classList.add('border-l-4', 'border-primary', 'bg-[#1E293B]', 'text-primary');
                btn.classList.remove('text-slate-400');
                const symbol = btn.querySelector('.material-symbols-outlined');
                if (symbol) symbol.style.fontVariationSettings = "'FILL' 1";
            } else {
                btn.classList.remove('border-l-4', 'border-primary', 'bg-[#1E293B]', 'text-primary');
                btn.classList.add('text-slate-400');
                const symbol = btn.querySelector('.material-symbols-outlined');
                if (symbol) symbol.style.fontVariationSettings = "'FILL' 0";
            }
        });

        // Set Breadcrumb Header Context
        if (breadcrumbActive) {
            const nameMapping = {
                dashboard: 'Dashboard',
                sustainability: 'Sustainability Monitoring',
                environment: 'Environmental Metrics',
                social: 'Social Module',
                governance: 'Governance Module',
                compliance: 'Compliance Reports',
                scoring: 'ESG Scoring Breakdown',
                settings: 'Platform Settings'
            };
            breadcrumbActive.textContent = nameMapping[tabId] || tabId;
        }

        // Auto-scroll content back to top smoothly
        if (viewsWrapper) {
            viewsWrapper.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = trigger.getAttribute('data-tab');
            switchTab(tabId);
        });
    });


    // --- 6. Modal Interactions ---

    function openModal() {
        if (!addDataModal) return;
        addDataModal.classList.remove('pointer-events-none', 'opacity-0');
        addDataModal.classList.add('pointer-events-auto');
        const contentPanel = document.getElementById('modal-content-panel');
        if (contentPanel) {
            contentPanel.classList.remove('scale-95');
            contentPanel.classList.add('scale-100');
        }
    }

    function closeModal() {
        if (!addDataModal) return;
        addDataModal.classList.add('pointer-events-none', 'opacity-0');
        addDataModal.classList.remove('pointer-events-auto');
        const contentPanel = document.getElementById('modal-content-panel');
        if (contentPanel) {
            contentPanel.classList.remove('scale-100');
            contentPanel.classList.add('scale-95');
        }
        if (addDataForm) addDataForm.reset();
    }

    if (addDataHeaderBtn) addDataHeaderBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);


    // --- 7. Data Submissions, Storing, and Render Engines ---

    if (addDataForm) {
        addDataForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract inputs
            const facility = document.getElementById('input-facility').value;
            const region = document.getElementById('input-region').value;
            const scope1 = parseFloat(document.getElementById('input-scope1').value) || 0;
            const scope2 = parseFloat(document.getElementById('input-scope2').value) || 0;
            const scope3 = parseFloat(document.getElementById('input-scope3').value) || 0;
            const energy = parseFloat(document.getElementById('input-energy').value) || 0;
            const water = parseFloat(document.getElementById('input-water').value) || 0;
            const waste = parseFloat(document.getElementById('input-waste').value) || 0;
            const compliance = document.getElementById('input-compliance').value;

            // Formulate new facility log entity
            const newRecord = {
                id: 'fac_' + Date.now(),
                name: facility,
                region: region,
                scope1: scope1,
                scope2: scope2,
                scope3: scope3,
                energy: energy,
                water: water,
                waste: waste,
                compliance: compliance
            };

            // Store in central array state
            appState.facilityData.push(newRecord);

            // Re-render components
            renderFacilityTable();
            updateSustainabilityStats();

            // Log activity event
            logActivity(`Logged ESG telemetry data for ${facility}`);

            // Complete modal session
            closeModal();
            showToast(`Telemetry successfully logged for ${facility}!`, 'success');
        });
    }

    function renderFacilityTable() {
        if (!facilityTableBody) return;
        
        const filterQuery = facilitySearchInput ? facilitySearchInput.value.toLowerCase().trim() : '';
        const filteredData = appState.facilityData.filter(item => {
            return item.name.toLowerCase().includes(filterQuery) || 
                   item.region.toLowerCase().includes(filterQuery);
        });

        facilityTableBody.innerHTML = '';

        if (filteredData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="6" class="p-8 text-center text-on-surface-variant font-semibold text-body-md">
                    No facility telemetry matching logs. Click "Add ESG Data" to begin.
                </td>
            `;
            facilityTableBody.appendChild(tr);
            return;
        }

        filteredData.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/30';
            if (appState.tableDensityCompact) {
                tr.classList.add('compact-table');
            }

            const totalEmissions = item.scope1 + item.scope2 + item.scope3;
            const isAudit = item.compliance === 'Audit Due';
            const badgeClass = isAudit ? 'bg-error-container text-on-error-container' : 'bg-[#DCFCE7] text-[#166534]';

            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-lg">factory</span>
                        </div>
                        <span class="font-bold text-on-surface">${item.name}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-on-surface-variant font-medium">${item.region}</td>
                <td class="px-6 py-4 font-semibold">${totalEmissions.toFixed(1)}</td>
                <td class="px-6 py-4 font-semibold">${item.energy.toLocaleString()}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-0.5 rounded-full text-label-sm font-bold ${badgeClass}">${item.compliance}</span>
                </td>
                <td class="px-6 py-4 text-right pr-6">
                    <button class="text-primary hover:underline font-bold text-sm">View details</button>
                </td>
            `;
            facilityTableBody.appendChild(tr);
        });
    }

    function updateSustainabilityStats() {
        let totalScope1 = 0;
        let totalScope2 = 0;
        let totalScope3 = 0;
        let totalEnergy = 0;
        let totalWater = 0;
        let sumWaste = 0;

        appState.facilityData.forEach(item => {
            totalScope1 += item.scope1;
            totalScope2 += item.scope2;
            totalScope3 += item.scope3;
            totalEnergy += item.energy;
            totalWater += item.water;
            sumWaste += item.waste;
        });

        const totalEmissions = totalScope1 + totalScope2 + totalScope3;
        const averageWaste = appState.facilityData.length > 0 ? (sumWaste / appState.facilityData.length) : 0;

        // --- View Updates ---
        
        // 1. Dashboard Metrics
        const dbEmissions = document.getElementById('dashboard-emissions-value');
        if (dbEmissions) {
            dbEmissions.innerHTML = `${Math.round(totalEmissions).toLocaleString()} <span class="text-body-md font-normal text-on-surface-variant">tCO2e</span>`;
        }

        const dbWater = document.getElementById('dashboard-water-value');
        if (dbWater) {
            dbWater.innerHTML = `${Math.round(totalWater).toLocaleString()} <span class="text-body-md font-normal text-on-surface-variant">m³</span>`;
        }

        const dbEnergy = document.getElementById('dashboard-energy-value');
        if (dbEnergy) {
            dbEnergy.innerHTML = `${Math.round(totalEnergy).toLocaleString()} <span class="text-body-md font-normal text-on-surface-variant">MWh</span>`;
        }

        const dbWaste = document.getElementById('dashboard-waste-value');
        if (dbWaste) {
            dbWaste.textContent = `${Math.round(averageWaste)}%`;
        }

        // 2. Sustainability tab Metrics
        const totalEmissionsVal = document.getElementById('total-emissions-value');
        if (totalEmissionsVal) {
            totalEmissionsVal.textContent = Math.round(totalEmissions).toLocaleString();
        }

        const sustWater = document.getElementById('sustainability-water-value');
        if (sustWater) {
            sustWater.textContent = Math.round(totalWater).toLocaleString();
        }

        const sustWaste = document.getElementById('sustainability-waste-value');
        if (sustWaste) {
            sustWaste.textContent = `${Math.round(averageWaste)}%`;
        }

        // 3. Targets and Progress Bars
        const emissionsProgressBar = document.getElementById('emissions-progress-bar');
        if (emissionsProgressBar) {
            // Target is 2500 tCO2e
            const newPercentage = Math.min(Math.round((totalEmissions / 2500) * 100), 100);
            emissionsProgressBar.style.width = `${newPercentage}%`;
            const textEl = emissionsProgressBar.parentElement.nextElementSibling;
            if (textEl) {
                textEl.textContent = `${newPercentage}% of annual reduction target achieved`;
            }
        }

        const roadmapProgress = document.getElementById('roadmap-progress-indicator');
        const roadmapText = document.getElementById('roadmap-percentage-text');
        if (roadmapProgress && roadmapText) {
            const newPercentage = Math.min(Math.round((totalEmissions / 2500) * 100), 100);
            roadmapProgress.style.width = `${newPercentage}%`;
            roadmapText.textContent = `${newPercentage}% Completed`;
        }

        // 4. Emissions by Scope Details
        const scope1Text = document.getElementById('scope1-total-text');
        const scope1Bar = document.getElementById('scope1-progress-bar');
        if (scope1Text && scope1Bar) {
            scope1Text.textContent = `${Math.round(totalScope1).toLocaleString()} tCO2e`;
            const maxRef = Math.max(totalScope1, totalScope2, totalScope3, 100);
            scope1Bar.style.width = `${Math.round((totalScope1 / maxRef) * 100)}%`;
        }

        const scope2Text = document.getElementById('scope2-total-text');
        const scope2Bar = document.getElementById('scope2-progress-bar');
        if (scope2Text && scope2Bar) {
            scope2Text.textContent = `${Math.round(totalScope2).toLocaleString()} tCO2e`;
            const maxRef = Math.max(totalScope1, totalScope2, totalScope3, 100);
            scope2Bar.style.width = `${Math.round((totalScope2 / maxRef) * 100)}%`;
        }

        const scope3Text = document.getElementById('scope3-total-text');
        const scope3Bar = document.getElementById('scope3-progress-bar');
        if (scope3Text && scope3Bar) {
            scope3Text.textContent = `${Math.round(totalScope3).toLocaleString()} tCO2e`;
            const maxRef = Math.max(totalScope1, totalScope2, totalScope3, 100);
            scope3Bar.style.width = `${Math.round((totalScope3 / maxRef) * 100)}%`;
        }
    }


    // --- 8. Table Density toggler & filters ---

    if (densityToggleBtn) {
        densityToggleBtn.addEventListener('click', () => {
            appState.tableDensityCompact = !appState.tableDensityCompact;
            renderFacilityTable();
            showToast(appState.tableDensityCompact ? 'Table condensed.' : 'Table normal.', 'info');
        });
    }

    if (facilitySearchInput) {
        facilitySearchInput.addEventListener('input', () => {
            renderFacilityTable();
        });
        
        facilitySearchInput.addEventListener('focus', () => {
            facilitySearchInput.parentElement.classList.add('ring-2', 'ring-primary');
        });
        
        facilitySearchInput.addEventListener('blur', () => {
            facilitySearchInput.parentElement.classList.remove('ring-2', 'ring-primary');
        });
    }


    // --- 9. Activity Log Manager ---

    function logActivity(messageText) {
        if (!activityLogContainer) return;

        const dateStr = 'Just Now';
        const node = document.createElement('div');
        node.className = 'flex gap-4 relative';
        node.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center z-10 text-white">
                <span class="material-symbols-outlined text-[14px]">info</span>
            </div>
            <div>
                <p class="text-label-md font-bold">${messageText}</p>
                <p class="text-label-sm text-on-surface-variant">${dateStr}</p>
            </div>
        `;
        // Insert right below the absolute line overlay
        if (activityLogContainer.children.length > 1) {
            activityLogContainer.insertBefore(node, activityLogContainer.children[1]);
        } else {
            activityLogContainer.appendChild(node);
        }
    }


    // --- 10. Report Compilation Simulators ---

    if (loadingRow) {
        loadingRow.style.display = 'none';
    }

    function startReportGeneration() {
        if (!loadingRow) return;

        if (loadingRow.style.display === 'flex') {
            showToast('A report compilation sequence is already active.', 'warning');
            return;
        }

        // Navigate to compliance view if not active
        if (appState.activeTab !== 'compliance') {
            switchTab('compliance');
        }

        loadingRow.style.display = 'flex';
        simulatedProgress.style.width = '0%';
        showToast('Initiating compilation for framework disclosures...', 'info');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Add report to array
                appState.reportsCount++;
                appendCompiledReportCard();

                loadingRow.style.display = 'none';
                showToast('GRI Standard Report compiled successfully!', 'success');
                logActivity(`Compiled GRI Compliance Report #${appState.reportsCount}`);
            }
            simulatedProgress.style.width = `${progress}%`;
        }, 400);
    }

    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', startReportGeneration);
    }
    if (sidebarGenReportBtn) {
        sidebarGenReportBtn.addEventListener('click', startReportGeneration);
    }

    function appendCompiledReportCard() {
        if (!reportsListContainer) return;

        const placeholder = document.getElementById('no-reports-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const reportId = appState.reportsCount;
        const reportDiv = document.createElement('div');
        reportDiv.className = 'p-6 flex items-center hover:bg-white/40 transition-colors group border-b border-outline-variant/30';
        reportDiv.innerHTML = `
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">description</span>
            </div>
            <div class="ml-4 flex-1">
                <div class="flex items-center gap-2">
                    <h4 class="font-title-md text-on-surface font-bold">GRI Compliance Disclosure Report #${reportId}</h4>
                    <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Final</span>
                </div>
                <p class="text-body-md text-on-surface-variant">Framework: GRI 2023 • Generated Just Now</p>
            </div>
            <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Download PDF">
                    <span class="material-symbols-outlined">download</span>
                </button>
                <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Share Document">
                    <span class="material-symbols-outlined">share</span>
                </button>
            </div>
        `;
        reportsListContainer.insertBefore(reportDiv, reportsListContainer.firstChild);
    }


    // --- 11. Toast Notifications Alerts Utility ---

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast-alert ${type}-toast`;

        let icon = 'check_circle';
        if (type === 'error') icon = 'cancel';
        if (type === 'warning') icon = 'warning';
        if (type === 'info') icon = 'info';

        toast.innerHTML = `
            <span class="material-symbols-outlined text-lg">${icon}</span>
            <span class="text-body-md font-semibold">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Slide out and remove automatically
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }


    // --- 12. Micro-animations ---

    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0px)';
        });
    });
    // --- 13. Environmental Module Logic ---
    const envForm = document.getElementById('env-data-form');
    const envInputElec = document.getElementById('env-input-elec');
    const envInputWater = document.getElementById('env-input-water');
    const envInputFuel = document.getElementById('env-input-fuel');
    const envInputRenew = document.getElementById('env-input-renew');
    const envInputCarbon = document.getElementById('env-input-carbon');
    const envInputDate = document.getElementById('env-input-date');

    const pillAll = document.getElementById('env-pill-all');
    const pillVerified = document.getElementById('env-pill-verified');
    const pillPending = document.getElementById('env-pill-pending');

    function calculateEnvCarbon() {
        if (!envInputCarbon) return;
        const elec = parseFloat(envInputElec.value) || 0;
        const water = parseFloat(envInputWater.value) || 0;
        const fuel = parseFloat(envInputFuel.value) || 0;
        // Carbon estimation formula: Electricity (kWh) * 0.0004 + Water (Liters) * 0.0001 + Fuel (Units) * 0.0025
        const calcVal = (elec * 0.0004) + (water * 0.0001) + (fuel * 0.0025);
        if (calcVal === 0) {
            envInputCarbon.value = 'Calculated automatically';
        } else {
            envInputCarbon.value = `${calcVal.toFixed(3)} tCO2e`;
        }
    }

    if (envInputElec) envInputElec.addEventListener('input', calculateEnvCarbon);
    if (envInputWater) envInputWater.addEventListener('input', calculateEnvCarbon);
    if (envInputFuel) envInputFuel.addEventListener('input', calculateEnvCarbon);

    if (envForm) {
        envForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dateVal = envInputDate.value;
            const elecVal = parseFloat(envInputElec.value) || 0;
            const waterVal = parseFloat(envInputWater.value) || 0;
            const fuelVal = parseFloat(envInputFuel.value) || 0;
            const renewVal = parseFloat(envInputRenew.value) || 0;
            
            const newLogs = [];
            if (elecVal > 0) {
                newLogs.push({
                    id: 'env_' + Date.now() + '_e',
                    date: dateVal,
                    category: 'Electricity',
                    value: elecVal,
                    unit: 'kWh',
                    status: 'Verified'
                });
            }
            if (waterVal > 0) {
                newLogs.push({
                    id: 'env_' + Date.now() + '_w',
                    date: dateVal,
                    category: 'Water',
                    value: waterVal,
                    unit: 'Liters',
                    status: 'Verified'
                });
            }
            if (fuelVal > 0) {
                newLogs.push({
                    id: 'env_' + Date.now() + '_f',
                    date: dateVal,
                    category: 'Fuel',
                    value: fuelVal,
                    unit: 'Units',
                    status: 'Pending'
                });
            }
            if (renewVal > 0) {
                newLogs.push({
                    id: 'env_' + Date.now() + '_r',
                    date: dateVal,
                    category: 'Renewable',
                    value: renewVal,
                    unit: '% Mix',
                    status: 'Verified'
                });
            }

            if (newLogs.length === 0) {
                showToast('Please enter a value for at least one environmental metrics field.', 'warning');
                return;
            }

            appState.envLogs.unshift(...newLogs);
            updateEnvMetricCards();
            renderEnvLogsTable();
            showToast('Environmental metrics logged successfully!', 'success');
            logActivity(`Logged environmental resource telemetry metrics for date ${dateVal}`);
            
            envForm.reset();
            envInputCarbon.value = 'Calculated automatically';
        });
    }

    function updateEnvMetricCards() {
        let totalElec = 42850;
        let totalWater = 128400;
        let totalFuel = 1240;
        let totalCarbon = 452.1;
        let renewSum = 34.2;
        let renewCount = 1;

        appState.envLogs.forEach(log => {
            if (log.id === 'env_1' || log.id === 'env_2' || log.id === 'env_3' || log.id === 'env_4') {
                return;
            }
            if (log.category === 'Electricity') totalElec += log.value;
            if (log.category === 'Water') totalWater += log.value;
            if (log.category === 'Fuel') totalFuel += log.value;
            if (log.category === 'Renewable') {
                renewSum += log.value;
                renewCount++;
            }
            if (log.category === 'Electricity') totalCarbon += (log.value * 0.0004);
            if (log.category === 'Water') totalCarbon += (log.value * 0.0001);
            if (log.category === 'Fuel') totalCarbon += (log.value * 0.0025);
        });

        const cardElec = document.getElementById('env-card-elec-val');
        if (cardElec) cardElec.textContent = Math.round(totalElec).toLocaleString();

        const cardWater = document.getElementById('env-card-water-val');
        if (cardWater) cardWater.textContent = Math.round(totalWater).toLocaleString();

        const cardFuel = document.getElementById('env-card-fuel-val');
        if (cardFuel) cardFuel.textContent = Math.round(totalFuel).toLocaleString();

        const cardRenew = document.getElementById('env-card-renew-val');
        if (cardRenew) cardRenew.textContent = `${(renewSum / renewCount).toFixed(1)}%`;

        const cardCarbon = document.getElementById('env-card-carbon-val');
        if (cardCarbon) cardCarbon.textContent = totalCarbon.toFixed(1);

        const donutVal = document.getElementById('env-donut-center-val');
        if (donutVal) donutVal.textContent = Math.round(totalCarbon);
    }

    function renderEnvLogsTable() {
        const tbody = document.getElementById('env-logs-tbody');
        if (!tbody) return;

        const filtered = appState.envLogs.filter(log => {
            if (appState.envFilter === 'ALL') return true;
            return log.status.toUpperCase() === appState.envFilter;
        });

        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-on-surface-variant font-semibold text-body-md">
                        No environmental logs matching filter.
                    </td>
                </tr>
            `;
            const countText = document.getElementById('env-logs-count-text');
            if (countText) countText.textContent = `Showing 0 of ${appState.envLogs.length} records`;
            return;
        }

        filtered.forEach(log => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/30';
            
            const isPending = log.status === 'Pending';
            const badgeClass = isPending ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800';
            
            let catIcon = 'electric_bolt';
            let catColor = 'text-yellow-600 bg-yellow-50';
            if (log.category === 'Water') {
                catIcon = 'water_drop';
                catColor = 'text-blue-600 bg-blue-50';
            } else if (log.category === 'Fuel') {
                catIcon = 'local_gas_station';
                catColor = 'text-gray-600 bg-gray-50';
            } else if (log.category === 'Renewable') {
                catIcon = 'solar_power';
                catColor = 'text-emerald-600 bg-emerald-50';
            }

            tr.innerHTML = `
                <td class="px-6 py-4 font-medium">${formatDisplayDate(log.date)}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded flex items-center justify-center ${catColor}">
                            <span class="material-symbols-outlined text-sm">${catIcon}</span>
                        </div>
                        <span class="font-bold text-on-surface">${log.category}</span>
                    </div>
                </td>
                <td class="px-6 py-4 font-semibold">${log.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="px-6 py-4 text-on-surface-variant">${log.unit}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-0.5 rounded-full text-label-sm font-bold ${badgeClass}">${log.status}</span>
                </td>
                <td class="px-6 py-4 text-right pr-6">
                    <button class="text-primary hover:underline font-bold text-sm">Details</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const countText = document.getElementById('env-logs-count-text');
        if (countText) countText.textContent = `Showing ${filtered.length} of ${appState.envLogs.length} records`;
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parts[2];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[monthNum - 1]} ${parseInt(day, 10)}, ${year}`;
    }

    function selectEnvPill(activePill, filterName) {
        [pillAll, pillVerified, pillPending].forEach(pill => {
            if (pill) {
                pill.classList.remove('bg-primary', 'text-white', 'shadow-sm');
                pill.classList.add('text-on-surface-variant', 'hover:text-on-surface');
            }
        });
        if (activePill) {
            activePill.classList.add('bg-primary', 'text-white', 'shadow-sm');
            activePill.classList.remove('text-on-surface-variant', 'hover:text-on-surface');
        }
        appState.envFilter = filterName;
        renderEnvLogsTable();
    }

    if (pillAll) pillAll.addEventListener('click', () => selectEnvPill(pillAll, 'ALL'));
    if (pillVerified) pillVerified.addEventListener('click', () => selectEnvPill(pillVerified, 'VERIFIED'));
    if (pillPending) pillPending.addEventListener('click', () => selectEnvPill(pillPending, 'PENDING'));

    // --- 14. Social Module Logic ---

    const socialForm = document.getElementById('social-data-form');
    const socialInputEmployees = document.getElementById('soc-input-employees');
    const socialInputTraining = document.getElementById('soc-input-training');
    const socialInputVolunteer = document.getElementById('soc-input-volunteer');
    const socialInputSafety = document.getElementById('soc-input-safety');
    const socialInputNotes = document.getElementById('soc-input-notes');

    if (socialForm) {
        socialForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const empVal = parseFloat(socialInputEmployees.value) || 0;
            const trainVal = parseFloat(socialInputTraining.value) || 0;
            const volVal = parseFloat(socialInputVolunteer.value) || 0;
            const safeVal = parseFloat(socialInputSafety.value) || 0;
            const today = new Date().toISOString().split('T')[0];

            const newLogs = [];
            if (trainVal > 0) {
                newLogs.push({ id: 'soc_' + Date.now() + '_t', date: today, category: 'Training & Development', value: trainVal, unit: 'Hours', status: 'Verified' });
            }
            if (volVal > 0) {
                newLogs.push({ id: 'soc_' + Date.now() + '_v', date: today, category: 'Volunteer Program', value: volVal, unit: 'Hours', status: 'Verified' });
            }
            if (safeVal >= 0 && socialInputSafety.value !== '') {
                newLogs.push({ id: 'soc_' + Date.now() + '_s', date: today, category: 'Safety Audit', value: safeVal, unit: 'Incidents', status: safeVal > 0 ? 'Pending' : 'Verified' });
            }
            if (empVal > 0) {
                newLogs.push({ id: 'soc_' + Date.now() + '_e', date: today, category: 'Diversity & Inclusion', value: empVal, unit: '%', status: 'Verified' });
            }

            if (newLogs.length === 0) {
                showToast('Please fill in at least one social metric field.', 'warning');
                return;
            }

            appState.socialLogs.unshift(...newLogs);
            renderSocialLogsTable();
            showToast('Social metrics logged successfully!', 'success');
            logActivity(`Logged social responsibility metrics for ${today}`);

            socialForm.reset();
        });
    }

    function renderSocialLogsTable() {
        const tbody = document.getElementById('social-logs-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const logs = appState.socialLogs;

        if (logs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-on-surface-variant font-semibold">
                        No social records yet. Submit a record to begin.
                    </td>
                </tr>
            `;
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/30';

            const isPending = log.status === 'Pending';
            const badgeClass = isPending ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800';

            let catIcon = 'diversity_3';
            let catColor = 'text-purple-600 bg-purple-50';
            if (log.category === 'Training & Development') { catIcon = 'school'; catColor = 'text-amber-600 bg-amber-50'; }
            else if (log.category === 'Safety Audit') { catIcon = 'health_and_safety'; catColor = 'text-red-600 bg-red-50'; }
            else if (log.category === 'Volunteer Program') { catIcon = 'volunteer_activism'; catColor = 'text-green-600 bg-green-50'; }
            else if (log.category === 'Community Outreach') { catIcon = 'groups'; catColor = 'text-teal-600 bg-teal-50'; }

            tr.innerHTML = `
                <td class="px-5 py-4 font-medium text-xs">${formatDisplayDate(log.date)}</td>
                <td class="px-5 py-4">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded flex items-center justify-center ${catColor}">
                            <span class="material-symbols-outlined text-sm">${catIcon}</span>
                        </div>
                        <span class="font-bold text-on-surface text-xs">${log.category}</span>
                    </div>
                </td>
                <td class="px-5 py-4 font-semibold text-xs">${log.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}</td>
                <td class="px-5 py-4 text-on-surface-variant text-xs">${log.unit}</td>
                <td class="px-5 py-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}">${log.status}</span>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                            <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button class="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                            <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const countText = document.getElementById('social-logs-count-text');
        if (countText) countText.textContent = `Showing ${logs.length} of ${logs.length} records`;
    }

    // Render initial states on load
    renderFacilityTable();
    updateSustainabilityStats();
    renderEnvLogsTable();
    renderSocialLogsTable();
    renderGovAuditsTable();

    // --- 15. Governance Module Logic ---

    function renderGovAuditsTable() {
        const tbody = document.getElementById('gov-audits-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const audits = appState.govAudits;

        if (audits.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-on-surface-variant font-semibold text-sm">
                        No audit records found. Click "New Audit" to add one.
                    </td>
                </tr>
            `;
            return;
        }

        audits.forEach(audit => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low/50 transition-colors';

            let statusClass = 'bg-green-100 text-green-800';
            let statusIcon = 'check_circle';
            if (audit.status === 'In Progress') {
                statusClass = 'bg-blue-100 text-blue-800';
                statusIcon = 'pending';
            } else if (audit.status === 'Non-Compliant') {
                statusClass = 'bg-red-100 text-red-800';
                statusIcon = 'cancel';
            }

            tr.innerHTML = `
                <td class="px-6 py-4 text-xs font-medium text-on-surface-variant whitespace-nowrap">${formatDisplayDate(audit.date)}</td>
                <td class="px-6 py-4">
                    <div class="font-bold text-on-surface text-sm">${audit.name}</div>
                    <div class="text-[10px] text-on-surface-variant mt-0.5">${audit.category}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full ${audit.auditorColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0">${audit.auditorInitials}</div>
                        <span class="text-sm font-medium text-on-surface">${audit.auditor}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusClass}">
                        <span class="material-symbols-outlined text-[12px]">${statusIcon}</span>
                        ${audit.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="text-primary hover:underline font-bold text-xs">Review</button>
                        <button class="text-on-surface-variant hover:text-primary font-bold text-xs">Edit</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const countEl = document.getElementById('gov-audit-count-text');
        if (countEl) countEl.textContent = `Showing ${audits.length} of 24 records`;
    }

    const govNewAuditBtn = document.getElementById('gov-new-audit-btn');
    if (govNewAuditBtn) {
        govNewAuditBtn.addEventListener('click', () => {
            const name = prompt('Audit Name:');
            if (!name) return;
            const auditor = prompt('Auditor Name:') || 'Unknown';
            const category = prompt('Category (e.g., Internal Compliance):') || 'General';
            const initials = auditor.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const colors = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-green-500', 'bg-rose-500', 'bg-amber-500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const today = new Date().toISOString().split('T')[0];

            appState.govAudits.unshift({
                id: 'gov_' + Date.now(),
                date: today,
                name,
                category,
                auditor,
                auditorInitials: initials,
                auditorColor: color,
                status: 'In Progress'
            });

            renderGovAuditsTable();
            showToast(`New audit "${name}" created successfully!`, 'success');
            logActivity(`Created governance audit: ${name}`);
        });
    }

    // --- 16. Dashboard Interactivity ---

    // 16a. "View ESG Breakdown" → navigate to scoring tab
    const dashViewEsgBtn = document.getElementById('dash-view-esg-btn');
    if (dashViewEsgBtn) {
        dashViewEsgBtn.addEventListener('click', () => {
            switchTab('scoring');
            showToast('Navigated to ESG Scoring Breakdown', 'info');
        });
    }

    // 16b. Historical Records modal
    const historicalModal = document.getElementById('historical-modal');
    const historicalModalPanel = document.getElementById('historical-modal-panel');
    const historicalTableBody = document.getElementById('historical-table-body');
    const closeHistoricalModalBtn = document.getElementById('close-historical-modal-btn');
    const closeHistoricalFooterBtn = document.getElementById('close-historical-modal-footer-btn');
    const historicalModalBackdrop = document.getElementById('historical-modal-backdrop');

    function openHistoricalModal() {
        if (!historicalModal) return;
        // Populate table from facilityData
        if (historicalTableBody) {
            historicalTableBody.innerHTML = '';
            appState.facilityData.forEach(item => {
                const total = item.scope1 + item.scope2 + item.scope3;
                const isAudit = item.compliance === 'Audit Due';
                const badge = isAudit
                    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Audit Due</span>'
                    : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">Compliant</span>';
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-low/40 transition-colors';
                tr.innerHTML = `
                    <td class="px-6 py-3 font-bold text-on-surface text-xs whitespace-nowrap">${item.name}</td>
                    <td class="px-6 py-3 text-on-surface-variant text-xs">${item.region}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.scope1.toFixed(1)}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.scope2.toFixed(1)}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.scope3.toFixed(1)}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.energy.toLocaleString()}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.water.toLocaleString()}</td>
                    <td class="px-6 py-3 text-xs font-semibold">${item.waste}%</td>
                    <td class="px-6 py-3">${badge}</td>
                `;
                historicalTableBody.appendChild(tr);
            });
        }
        historicalModal.classList.remove('pointer-events-none', 'opacity-0');
        historicalModal.classList.add('pointer-events-auto');
        if (historicalModalPanel) {
            historicalModalPanel.classList.remove('scale-95');
            historicalModalPanel.classList.add('scale-100');
        }
    }

    function closeHistoricalModal() {
        if (!historicalModal) return;
        historicalModal.classList.add('pointer-events-none', 'opacity-0');
        historicalModal.classList.remove('pointer-events-auto');
        if (historicalModalPanel) {
            historicalModalPanel.classList.remove('scale-100');
            historicalModalPanel.classList.add('scale-95');
        }
    }

    const dashHistoricalBtn = document.getElementById('dash-historical-btn');
    if (dashHistoricalBtn) dashHistoricalBtn.addEventListener('click', openHistoricalModal);
    if (closeHistoricalModalBtn) closeHistoricalModalBtn.addEventListener('click', closeHistoricalModal);
    if (closeHistoricalFooterBtn) closeHistoricalFooterBtn.addEventListener('click', closeHistoricalModal);
    if (historicalModalBackdrop) historicalModalBackdrop.addEventListener('click', closeHistoricalModal);

    // 16c. Notifications bell toggle
    const notifBell = document.getElementById('notifications-bell');
    const notifPanel = document.getElementById('notifications-panel');
    const notifBadge = document.getElementById('notif-badge');
    const notifClearAll = document.getElementById('notif-clear-all');

    if (notifBell && notifPanel) {
        notifBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notifPanel.classList.toggle('hidden');
            // Remove red badge when opened
            if (!notifPanel.classList.contains('hidden') && notifBadge) {
                notifBadge.classList.add('hidden');
            }
        });
    }
    if (notifClearAll) {
        notifClearAll.addEventListener('click', () => {
            const notifList = document.getElementById('notif-list');
            if (notifList) {
                notifList.innerHTML = `<div class="p-8 text-center text-xs text-on-surface-variant font-semibold">No new notifications</div>`;
            }
            showToast('All notifications cleared', 'info');
        });
    }

    // 16d. Profile dropdown toggle
    const profileWidget = document.getElementById('profile-widget');
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');

    if (profileWidget && profileDropdown) {
        profileWidget.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
    }
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', () => {
            profileDropdown && profileDropdown.classList.add('hidden');
            logoutBtn && logoutBtn.click();
        });
    }

    // 16e. Global search
    const globalSearch = document.getElementById('global-search');
    const searchPanel = document.getElementById('search-results-panel');
    const searchResultsList = document.getElementById('search-results-list');
    const searchResultsLabel = document.getElementById('search-results-label');
    const closeSearchBtn = document.getElementById('close-search-btn');

    // Searchable data index — tabs + facilities
    const searchIndex = [
        { label: 'Executive Dashboard', icon: 'dashboard', tab: 'dashboard', type: 'Page' },
        { label: 'Sustainability Monitoring', icon: 'eco', tab: 'sustainability', type: 'Page' },
        { label: 'Environment Module', icon: 'thermostat', tab: 'environment', type: 'Page' },
        { label: 'Social Module', icon: 'diversity_3', tab: 'social', type: 'Page' },
        { label: 'Governance Module', icon: 'gavel', tab: 'governance', type: 'Page' },
        { label: 'Compliance Reports', icon: 'assignment', tab: 'compliance', type: 'Page' },
        { label: 'ESG Scoring', icon: 'analytics', tab: 'scoring', type: 'Page' },
        { label: 'Platform Settings', icon: 'settings', tab: 'settings', type: 'Page' },
        ...appState.facilityData.map(f => ({ label: f.name, icon: 'factory', tab: 'sustainability', type: 'Facility', sub: f.region }))
    ];

    function renderSearchResults(query) {
        if (!query || query.length < 2) {
            searchPanel && searchPanel.classList.add('hidden');
            return;
        }
        const q = query.toLowerCase();
        const results = searchIndex.filter(item => item.label.toLowerCase().includes(q) || (item.sub || '').toLowerCase().includes(q));
        if (!searchResultsList || !searchPanel) return;

        searchPanel.classList.remove('hidden');
        if (searchResultsLabel) searchResultsLabel.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;

        if (results.length === 0) {
            searchResultsList.innerHTML = `<div class="p-6 text-center text-xs text-on-surface-variant font-semibold">No results found</div>`;
            return;
        }

        searchResultsList.innerHTML = '';
        results.slice(0, 8).forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/60 cursor-pointer transition-colors';
            div.innerHTML = `
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined text-sm">${item.icon}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-on-surface truncate">${item.label}</p>
                    <p class="text-[10px] text-on-surface-variant">${item.type}${item.sub ? ' · ' + item.sub : ''}</p>
                </div>
                <span class="material-symbols-outlined text-outline text-sm">arrow_forward</span>
            `;
            div.addEventListener('click', () => {
                switchTab(item.tab);
                searchPanel.classList.add('hidden');
                globalSearch.value = '';
            });
            searchResultsList.appendChild(div);
        });
    }

    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => renderSearchResults(e.target.value));
        globalSearch.addEventListener('focus', (e) => { if (e.target.value.length >= 2) renderSearchResults(e.target.value); });
    }
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            searchPanel && searchPanel.classList.add('hidden');
            if (globalSearch) globalSearch.value = '';
        });
    }

    // 16f. Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (notifPanel && !notifBell?.contains(e.target)) notifPanel.classList.add('hidden');
        if (profileDropdown && !profileWidget?.contains(e.target)) profileDropdown.classList.add('hidden');
        if (searchPanel && !globalSearch?.contains(e.target) && !searchPanel.contains(e.target)) searchPanel.classList.add('hidden');
    });

    // 16g. Escape key closes all panels
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            notifPanel && notifPanel.classList.add('hidden');
            profileDropdown && profileDropdown.classList.add('hidden');
            searchPanel && searchPanel.classList.add('hidden');
            closeHistoricalModal();
        }
    });

});
