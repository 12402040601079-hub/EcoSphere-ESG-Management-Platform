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
        facilityData: [],
        reportsCount: 0
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
    // Render initial states on load
    renderFacilityTable();
    updateSustainabilityStats();
});
