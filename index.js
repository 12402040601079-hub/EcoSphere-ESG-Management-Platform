/**
 * EcoSphere ESG Management Platform - Interactivity Layer
 * Handles tab transitions, charts, modal data insertion, toasts, and simulated workloads.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State management ---
    const appState = {
        activeTab: 'dashboard',
        sidebarCollapsed: false,
        tableDensityCompact: false,
        facilityData: []
    };

    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const addEsgDataBtn = document.getElementById('add-esg-data-btn');
    
    // Modal elements
    const addDataModal = document.getElementById('add-data-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const addDataForm = document.getElementById('add-data-form');

    // Table elements
    const tableDensityBtn = document.getElementById('table-density-btn');
    const densityBtnText = document.getElementById('density-btn-text');
    const facilityTable = document.getElementById('facility-table');
    const facilityTableBody = document.getElementById('facility-table-body');

    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // --- 1. Tab Switching & Router Logic ---
    const tabTriggers = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const breadcrumbs = document.getElementById('header-breadcrumbs');

    function switchTab(tabId) {
        if (!tabId) return;
        appState.activeTab = tabId;

        // Hide all views and remove active state from buttons
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-view`) {
                content.classList.add('active');
            }
        });

        tabTriggers.forEach(btn => {
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === tabId) {
                btn.classList.add('border-l-4', 'border-primary', 'bg-[#1E293B]', 'text-primary');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('border-l-4', 'border-primary', 'bg-[#1E293B]', 'text-primary');
                btn.classList.add('text-slate-400');
            }
        });

        // Update breadcrumb navigation text to mirror focus area context
        if (breadcrumbs) {
            const links = breadcrumbs.querySelectorAll('a');
            if (tabId === 'dashboard') {
                links[0].textContent = 'Overview';
                links[1].textContent = 'Detailed Analysis';
                links[2].textContent = 'Frameworks';
            } else if (tabId === 'sustainability') {
                links[0].textContent = 'Facility Metrics';
                links[1].textContent = 'Emissions Mix';
                links[2].textContent = 'Log Audits';
            } else if (tabId === 'compliance') {
                links[0].textContent = 'Reporting Portals';
                links[1].textContent = 'Standards Check';
                links[2].textContent = 'Audit Disclosures';
            } else {
                links[0].textContent = 'Summary';
                links[1].textContent = 'Configurations';
                links[2].textContent = 'System Log';
            }
        }

        // Smooth scroll view to top
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Bind navigation click handlers
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = trigger.getAttribute('data-tab');
            switchTab(tabId);
            window.location.hash = tabId;
        });
    });

    // Check window hash on load for deep linking
    if (window.location.hash) {
        const hashTab = window.location.hash.replace('#', '');
        const matchingTab = document.querySelector(`[data-tab="${hashTab}"]`);
        if (matchingTab) {
            switchTab(hashTab);
        }
    }


    // --- 2. Collapsible Sidebar ---
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


    // --- 3. Dynamic Interactive SVG Charting ---
    const trendButtons = document.querySelectorAll('#trend-selector-grp .trend-btn');
    const chartLinePath = document.getElementById('chart-line-path');
    const chartAreaPath = document.getElementById('chart-area-path');

    // Mock trend paths to transition between
    const chartPaths = {
        esg: {
            line: "M0,160 Q80,140 160,150 T320,120 T480,90 T640,110 T800,70",
            area: "M0,160 Q80,140 160,150 T320,120 T480,90 T640,110 T800,70 L800,200 L0,200 Z"
        },
        emissions: {
            line: "M0,60 Q100,100 200,90 T400,120 T600,160 T800,180",
            area: "M0,60 Q100,100 200,90 T400,120 T600,160 T800,180 L800,200 L0,200 Z"
        },
        energy: {
            line: "M0,180 Q80,160 160,130 T320,100 T480,80 T640,50 T800,30",
            area: "M0,180 Q80,160 160,130 T320,100 T480,80 T640,50 T800,30 L800,200 L0,200 Z"
        }
    };

    trendButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            trendButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('text-on-surface-variant', 'hover:bg-surface-container');
            });
            // Add active style to target
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');

            const type = btn.getAttribute('data-type');
            if (chartLinePath && chartAreaPath && chartPaths[type]) {
                // Apply SVG path animations
                chartLinePath.setAttribute('d', chartPaths[type].line);
                chartAreaPath.setAttribute('d', chartPaths[type].area);
            }
        });
    });


    // --- 4. Modal Operations ---
    function openModal() {
        addDataModal.classList.remove('pointer-events-none', 'opacity-0');
        const contentPanel = document.getElementById('modal-content-panel');
        if (contentPanel) {
            contentPanel.classList.remove('scale-95');
            contentPanel.classList.add('scale-100');
        }
    }

    function closeModal() {
        addDataModal.classList.add('pointer-events-none', 'opacity-0');
        const contentPanel = document.getElementById('modal-content-panel');
        if (contentPanel) {
            contentPanel.classList.remove('scale-100');
            contentPanel.classList.add('scale-95');
        }
        addDataForm.reset();
    }

    if (addEsgDataBtn) addEsgDataBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);


    // --- 5. Form Submissions & Live Table Updating ---
    if (addDataForm) {
        addDataForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract input parameters
            const facility = document.getElementById('input-facility').value;
            const scope1 = parseFloat(document.getElementById('input-scope1').value);
            const scope2 = parseFloat(document.getElementById('input-scope2').value);
            const water = parseInt(document.getElementById('input-water').value, 10);
            const waste = parseInt(document.getElementById('input-waste').value, 10);

            // Create new record entity
            const newRecord = {
                name: facility,
                scope1: scope1,
                scope2: scope2,
                water: water,
                waste: waste
            };

            // Add to dataset
            appState.facilityData.push(newRecord);

            // Re-render table grid rows
            renderFacilityTable();

            // Update global dashboard statistics
            updateSustainabilityStats();

            // Close modal panel
            closeModal();

            // Notify user
            showToast(`ESG data point successfully logged for ${facility}!`, 'success');
        });
    }

    function renderFacilityTable() {
        if (!facilityTableBody) return;
        facilityTableBody.innerHTML = '';

        if (appState.facilityData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="6" class="p-8 text-center text-on-surface-variant font-semibold text-body-md">
                    No facility data logged yet. Click "Add ESG Data" to begin.
                </td>
            `;
            facilityTableBody.appendChild(tr);
            return;
        }

        appState.facilityData.forEach(item => {
            const tr = document.createElement('tr');
            if (appState.tableDensityCompact) {
                tr.classList.add('compact-table');
            }
            tr.innerHTML = `
                <td class="p-4 pl-6 font-bold text-on-surface">${item.name}</td>
                <td class="p-4">${item.scope1.toFixed(1)}</td>
                <td class="p-4">${item.scope2.toFixed(1)}</td>
                <td class="p-4">${item.water.toLocaleString()}</td>
                <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-green-100 text-green-800">${item.waste}%</span></td>
                <td class="p-4 text-right pr-6">
                    <button class="text-primary hover:underline font-semibold text-body-md mr-4">Edit</button>
                    <button class="text-red-600 hover:underline font-semibold text-body-md">Flag</button>
                </td>
            `;
            facilityTableBody.appendChild(tr);
        });
    }

    function updateSustainabilityStats() {
        // Compute new cumulative statistics
        let totalScope1 = 0;
        let totalScope2 = 0;
        appState.facilityData.forEach(item => {
            totalScope1 += item.scope1;
            totalScope2 += item.scope2;
        });

        const grandTotal = totalScope1 + totalScope2;
        const emissionsValueEl = document.getElementById('total-emissions-value');
        if (emissionsValueEl) {
            emissionsValueEl.textContent = Math.round(grandTotal).toLocaleString();
        }

        const dbEmissionsValueEl = document.getElementById('dashboard-emissions-value');
        if (dbEmissionsValueEl) {
            dbEmissionsValueEl.innerHTML = `${Math.round(grandTotal).toLocaleString()} <span class="text-body-md font-normal text-on-surface-variant">tCO2e</span>`;
        }

        // Dynamically increment target progress bar indicator
        const progressBar = document.getElementById('emissions-progress-bar');
        if (progressBar) {
            const newPercentage = Math.min(Math.round((grandTotal / 2500) * 100), 100);
            progressBar.style.width = `${newPercentage}%`;
            const textEl = progressBar.parentElement.nextElementSibling;
            if (textEl) {
                textEl.textContent = `${newPercentage}% of annual reduction target achieved`;
            }
        }
    }


    // --- 6. Table Density Configurer ---
    if (tableDensityBtn) {
        tableDensityBtn.addEventListener('click', () => {
            appState.tableDensityCompact = !appState.tableDensityCompact;
            
            if (appState.tableDensityCompact) {
                facilityTable.classList.add('compact-table');
                densityBtnText.textContent = 'Normal View';
                showToast('Table view condensed.', 'info');
            } else {
                facilityTable.classList.remove('compact-table');
                densityBtnText.textContent = 'Compact View';
                showToast('Table view expanded.', 'info');
            }
            renderFacilityTable();
        });
    }


    // --- 7. Toast Alerts System ---
    function showToast(message, type = 'success') {
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

        // Slide out and remove element automatically after timeout
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }


    // --- 8. Simulated Background Report Generation ---
    const generateBtn = document.getElementById('generate-report-btn');
    const loadingRow = document.getElementById('generating-report-progress-row');
    const simulatedProgress = document.getElementById('simulated-progress');
    const reportsListContainer = document.getElementById('reports-list-container');

    if (generateBtn && loadingRow && simulatedProgress) {
        // Hide loader initially until triggered
        loadingRow.style.display = 'none';

        generateBtn.addEventListener('click', () => {
            if (loadingRow.style.display === 'flex') {
                showToast('A compliance report is already generating.', 'warning');
                return;
            }

            loadingRow.style.display = 'flex';
            simulatedProgress.style.width = '0%';
            showToast('Generating new GRI Standards disclosure...', 'info');

            let progressValue = 0;
            const interval = setInterval(() => {
                progressValue += Math.floor(Math.random() * 15) + 5;
                if (progressValue >= 100) {
                    progressValue = 100;
                    clearInterval(interval);
                    
                    // Finalize disclosure compilation
                    loadingRow.style.display = 'none';
                    appendNewReportItem();
                    showToast('GRI Standards disclosure successfully compiled!', 'success');
                }
                simulatedProgress.style.width = `${progressValue}%`;
            }, 500);
        });
    }

    function appendNewReportItem() {
        if (!reportsListContainer) return;

        const placeholder = document.getElementById('no-reports-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const reportDiv = document.createElement('div');
        reportDiv.className = 'p-6 flex items-center hover:bg-surface-bright transition-colors group';
        reportDiv.innerHTML = `
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">description</span>
            </div>
            <div class="ml-4 flex-1">
                <div class="flex items-center gap-2">
                    <h4 class="font-title-md text-on-surface font-bold">GRI Disclosures Compiled Report</h4>
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
        
        // Insert report item right below header/top row
        reportsListContainer.insertBefore(reportDiv, reportsListContainer.firstChild);
    }


    // --- 9. Alert Settings Configuration Handler ---
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('ESG settings saved successfully.', 'success');
        });
    }


    // --- 10. Dashboard Card hover micro-animations ---
    document.querySelectorAll('.glass-card, .custom-shadow').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Initialize initial table view rendering
    renderFacilityTable();
    console.log('EcoSphere Dashboard System fully booted.');
});
