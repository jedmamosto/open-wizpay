(function () {
    const WIDGET_CLASS = 'wizpay-storefront';

    // Theme color mappings to match backend and look premium
    const themes = {
        slate: {
            bg: '#F9F4EB',
            text: '#171004',
            accent: '#6366F1', // Premium Indigo
            button: '#6366F1',
            buttonHover: '#4F46E5',
            cardBg: '#FFFFFF',
            borderColor: '#E0DCD4'
        },
        azure: {
            bg: '#EBF5F9',
            text: '#041017',
            accent: '#12C4F0',
            button: '#12C4F0',
            buttonHover: '#10B0D8',
            cardBg: '#FFFFFF',
            borderColor: '#D4E0E4'
        },
        emerald: {
            bg: '#00180c',
            text: '#c8ebd5',
            accent: '#ccf15a',
            button: '#ccf15a',
            buttonHover: '#b0d440',
            cardBg: '#062517',
            borderColor: '#1d3a2c'
        },
        ruby: {
            bg: '#F9EBEB',
            text: '#170404',
            accent: '#F01212',
            button: '#F01212',
            buttonHover: '#D81010',
            cardBg: '#FFFFFF',
            borderColor: '#E4D4D4'
        },
        amethyst: {
            bg: '#F0EBF9',
            text: '#0A0417',
            accent: '#9812F0',
            button: '#9812F0',
            buttonHover: '#8A10D8',
            cardBg: '#FFFFFF',
            borderColor: '#D9D4E4'
        },
        amber: {
            bg: '#F9F1EB',
            text: '#170A04',
            accent: '#F08A12',
            button: '#F08A12',
            buttonHover: '#D87C10',
            cardBg: '#FFFFFF',
            borderColor: '#E4DCD4'
        }
    };

    const fontFamilies = {
        inter: "'Inter', sans-serif",
        playfair: "'Playfair Display', Georgia, serif",
        nunito: "'Nunito', sans-serif",
        work: "'Work Sans', sans-serif"
    };

    function init() {
        const containers = document.querySelectorAll(`.${WIDGET_CLASS}`);
        if (containers.length === 0) {
            console.warn(`WizPay: No elements with class "${WIDGET_CLASS}" found.`);
            return;
        }

        // Determine current app domain based on script source
        const scriptElement = document.querySelector(`script[src*="/sdk/wizpay.js"]`);
        let apiHost = '';
        if (scriptElement) {
            try {
                const url = new URL(scriptElement.src);
                apiHost = url.origin;
            } catch (e) {
                apiHost = window.location.origin;
            }
        } else {
            apiHost = window.location.origin;
        }

        containers.forEach(container => {
            // Avoid double initialization
            if (container.getAttribute('data-wizpay-initialized') === 'true') {
                return;
            }
            container.setAttribute('data-wizpay-initialized', 'true');

            const formId = container.getAttribute('data-form-id');
            if (!formId) {
                container.innerHTML = '<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">WizPay Error: Missing data-form-id attribute.</div>';
                return;
            }

            // Fetch sanitized public payment form info
            fetch(`${apiHost}/api/v1/forms/${formId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Form not found or server error');
                    return res.json();
                })
                .then(data => {
                    render(container, data, formId, apiHost);
                })
                .catch(err => {
                    console.error('WizPay SDK load error:', err);
                    container.innerHTML = `<div style="color: #ef4444; padding: 16px; border: 1px solid #fee2e2; background-color: #fef2f2; border-radius: 8px; font-family: sans-serif;">Failed to load WizPay catalog. Verify form ID is correct.</div>`;
                    container.removeAttribute('data-wizpay-initialized'); // Allow retry on failure
                });
        });
    }

    function render(container, form, formId, apiHost) {
        const appearance = form.appearance || { colorScheme: 'slate', fontFamily: 'inter' };
        
        // Resolve theme
        let theme = themes[appearance.colorScheme] || themes.slate;
        if (appearance.colorScheme === 'custom' && appearance.customColors) {
            theme = {
                bg: appearance.customColors.background || '#F9F4EB',
                text: appearance.customColors.text || '#171004',
                accent: appearance.customColors.accent || '#6366F1',
                button: appearance.customColors.buttonBg || '#6366F1',
                buttonHover: appearance.customColors.buttonHoverBg || '#4F46E5',
                cardBg: appearance.customColors.card || '#FFFFFF',
                borderColor: appearance.customColors.borderColor || '#E0DCD4'
            };
        }

        // Resolve font and load dynamically if not preset
        let font = fontFamilies[appearance.fontFamily] || fontFamilies.inter;
        if (!fontFamilies[appearance.fontFamily] && appearance.fontFamily) {
            font = `'${appearance.fontFamily}', sans-serif`;
            loadGoogleFont(appearance.fontFamily);
        } else {
            if (appearance.fontFamily === 'nunito') {
                loadGoogleFont('Nunito:wght@400;600;700');
            } else if (appearance.fontFamily === 'work') {
                loadGoogleFont('Work+Sans:wght@400;500;600;700');
            } else if (appearance.fontFamily === 'playfair') {
                loadGoogleFont('Playfair+Display:wght@400;600;700');
            } else {
                loadGoogleFont('Inter:wght@400;500;600;700');
            }
        }

        // Visual properties
        const borderRadius = appearance.borderRadius || (appearance.buttonShape === 'pill' ? '9999px' : appearance.buttonShape === 'sharp' ? '0px' : '12px');
        const borderWidth = appearance.cardBorderWidth || '2px';
        const shadow = appearance.shadowSize === 'none' ? 'none'
                     : appearance.shadowSize === 'sm' ? '0 1px 2px 0 rgba(0,0,0,0.05)'
                     : appearance.shadowSize === 'md' ? '0 4px 6px -1px rgba(0,0,0,0.1)'
                     : appearance.shadowSize === 'lg' ? '0 10px 15px -3px rgba(0,0,0,0.1)'
                     : appearance.shadowSize === 'xl' ? '0 20px 25px -5px rgba(0,0,0,0.1)'
                     : appearance.shadowSize === '2xl' ? '0 25px 50px -12px rgba(0,0,0,0.25)'
                     : '0 4px 6px -1px rgba(0,0,0,0.05)';

        // Inject Styles
        const styles = `
            .wizpay-widget-wrapper {
                font-family: ${font};
                color: ${theme.text};
                background-color: ${theme.bg};
                padding: 24px;
                border-radius: ${borderRadius};
                border: ${borderWidth} solid ${theme.borderColor};
                max-width: 800px;
                margin: 0 auto;
                box-shadow: ${shadow};
            }
            .wizpay-header {
                margin-bottom: 24px;
                text-align: center;
            }
            .wizpay-title {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 8px 0;
            }
            .wizpay-desc {
                font-size: 14px;
                opacity: 0.8;
                margin: 0;
            }
            .wizpay-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 24px;
            }
            @media(min-width: 600px) {
                .wizpay-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            .wizpay-card {
                background: ${theme.cardBg};
                border: ${borderWidth} solid ${theme.borderColor};
                border-radius: ${borderRadius};
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
            }
            .wizpay-card:hover {
                border-color: ${theme.accent};
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            }
            .wizpay-card.selected {
                border-color: ${theme.accent};
                background: ${theme.cardBg};
                box-shadow: 0 0 0 1px ${theme.accent};
            }
            .wizpay-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            .wizpay-prod-name {
                font-weight: 600;
                font-size: 16px;
                margin: 0;
                padding-right: 8px;
            }
            .wizpay-prod-price {
                font-weight: 700;
                font-size: 16px;
                color: ${theme.accent};
                margin: 0;
                white-space: nowrap;
            }
            .wizpay-prod-desc {
                font-size: 13px;
                opacity: 0.75;
                margin: 0 0 16px 0;
                flex-grow: 1;
            }
            .wizpay-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                font-weight: 500;
            }
            .wizpay-checkbox {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 2px solid ${theme.borderColor};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s ease;
            }
            .wizpay-card.selected .wizpay-checkbox {
                background-color: ${theme.accent};
                border-color: ${theme.accent};
            }
            .wizpay-checkbox-icon {
                width: 10px;
                height: 10px;
                fill: none;
                stroke: #ffffff;
                stroke-width: 3px;
                stroke-linecap: round;
                stroke-linejoin: round;
                display: none;
            }
            .wizpay-card.selected .wizpay-checkbox-icon {
                display: block;
            }
            .wizpay-footer {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
                border-top: 1px solid ${theme.borderColor};
                padding-top: 20px;
            }
            @media(min-width: 600px) {
                .wizpay-footer {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }
            .wizpay-summary {
                font-size: 16px;
            }
            .wizpay-summary-total {
                font-weight: 700;
                color: ${theme.accent};
                font-size: 18px;
            }
            .wizpay-btn {
                background-color: ${theme.button};
                color: ${appearance.colorScheme === 'emerald' ? '#161e00' : '#FFFFFF'};
                border: none;
                padding: 12px 24px;
                font-size: 15px;
                font-weight: 600;
                border-radius: ${borderRadius};
                cursor: pointer;
                transition: background-color 0.2s ease, transform 0.1s ease;
                min-width: 160px;
                text-align: center;
                min-height: 48px; /* Mobile accessibility */
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .wizpay-btn:hover {
                background-color: ${theme.buttonHover};
            }
            .wizpay-btn:active {
                transform: scale(0.98);
            }
            .wizpay-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = styles;
        document.head.appendChild(styleTag);

        // Inject custom raw CSS block if provided
        if (appearance.customCSS) {
            const customStyleTag = document.createElement('style');
            customStyleTag.textContent = appearance.customCSS;
            document.head.appendChild(customStyleTag);
        }

        // Render HTML structure
        let productsHtml = '';
        form.paymentFormProducts.forEach((prod, index) => {
            const showDesc = appearance.showProductDescription !== false && prod.productDescription;
            productsHtml += `
                <div class="wizpay-card" data-index="${index}" data-name="${encodeURIComponent(prod.productName)}">
                    <div class="wizpay-card-header">
                        <h4 class="wizpay-prod-name">${escapeHtml(prod.productName)}</h4>
                        <p class="wizpay-prod-price">₱${prod.productPrice.toFixed(2)}</p>
                    </div>
                    ${showDesc ? `<p class="wizpay-prod-desc">${escapeHtml(prod.productDescription || '')}</p>` : ''}
                    <div class="wizpay-checkbox-wrapper">
                        <div class="wizpay-checkbox">
                            <svg class="wizpay-checkbox-icon" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span>Select Product</span>
                    </div>
                </div>
            `;
        });

        const btnText = appearance.checkoutButtonText || 'Checkout Now';

        container.innerHTML = `
            <div class="wizpay-widget-wrapper">
                <div class="wizpay-header">
                    <h3 class="wizpay-title">${escapeHtml(form.paymentFormTitle)}</h3>
                    <p class="wizpay-desc">${escapeHtml(form.paymentFormDescription)}</p>
                </div>
                <div class="wizpay-grid">
                    ${productsHtml}
                </div>
                <div class="wizpay-footer">
                    <div class="wizpay-summary">
                        Selected: <span id="wizpay-summary-count">0</span> items | Total: <span class="wizpay-summary-total" id="wizpay-summary-total">₱0.00</span>
                    </div>
                    <button class="wizpay-btn" id="wizpay-checkout-btn" disabled>${escapeHtml(btnText)}</button>
                </div>
            </div>
        `;

        // Interactive Logic
        const cards = container.querySelectorAll('.wizpay-card');
        const selectedProducts = new Set();

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.getAttribute('data-index'));
                const product = form.paymentFormProducts[index];

                if (selectedProducts.has(product)) {
                    selectedProducts.delete(product);
                    card.classList.remove('selected');
                } else {
                    selectedProducts.add(product);
                    card.classList.add('selected');
                }

                updateSummary();
            });
        });

        function updateSummary() {
            let total = 0;
            selectedProducts.forEach(prod => {
                total += prod.productPrice;
            });

            const countEl = container.querySelector('#wizpay-summary-count');
            const totalEl = container.querySelector('#wizpay-summary-total');
            const btnEl = container.querySelector('#wizpay-checkout-btn');

            countEl.textContent = selectedProducts.size;
            totalEl.textContent = `₱${total.toFixed(2)}`;

            if (selectedProducts.size > 0) {
                btnEl.removeAttribute('disabled');
            } else {
                btnEl.setAttribute('disabled', 'true');
            }
        }

        const checkoutBtn = container.querySelector('#wizpay-checkout-btn');
        checkoutBtn.addEventListener('click', () => {
            if (selectedProducts.size === 0) return;
            const names = Array.from(selectedProducts).map(p => p.productName);
            const queryParam = encodeURIComponent(names.join(','));
            const checkoutUrl = `${apiHost}/payment-form/${formId}?products=${queryParam}`;
            
            // Redirect user to Checkout Form page
            window.location.href = checkoutUrl;
        });
    }

    function loadGoogleFont(fontName) {
        const id = 'wizpay-font-' + fontName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        if (document.getElementById(id)) return;

        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
        document.head.appendChild(link);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Expose global object for programmatic controls (SPAs)
    window.WizPay = { init };

    // Initialize once script loaded / DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }
})();
