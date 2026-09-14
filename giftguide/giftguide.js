/**
 * Gift Guide Password Protection & Session Management
 * Uses Web Crypto API SHA-256 hashing with sessionStorage persistence.
 * Compatible with static GitHub Pages hosting.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'jjb_giftguide_auth';
    // SHA-256 hash of 'holidays2025'
    const VALID_HASH = '37b0ba761e39a65ade97e0a4811c0f1dd7ab064aace9355df188d13598f0b41c';

    async function sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuf));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function isAuthenticated() {
        try {
            return sessionStorage.getItem(STORAGE_KEY) === 'authenticated';
        } catch (e) {
            return false;
        }
    }

    function setAuthenticated() {
        try {
            sessionStorage.setItem(STORAGE_KEY, 'authenticated');
        } catch (e) {
            console.error('sessionStorage write failed', e);
        }
    }

    function lockSession() {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        window.location.href = 'index.html';
    }

    // Expose lockSession globally
    window.lockGiftGuideSession = lockSession;

    document.addEventListener('DOMContentLoaded', () => {
        const isHub = document.getElementById('giftguide-hub') !== null;

        if (isHub) {
            initHub();
        } else {
            initProtectedSubpage();
        }
    });

    function initHub() {
        const lockScreen = document.getElementById('hub-lock-screen');
        const contentScreen = document.getElementById('hub-unlocked-content');
        const form = document.getElementById('password-form');
        const passInput = document.getElementById('guide-password');
        const errorMsg = document.getElementById('password-error');
        const lockBtn = document.getElementById('hub-lock-btn');
        const togglePassBtn = document.getElementById('toggle-pass-visibility');

        if (lockBtn) {
            lockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                lockSession();
            });
        }

        if (togglePassBtn && passInput) {
            togglePassBtn.addEventListener('click', () => {
                const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passInput.setAttribute('type', type);
                togglePassBtn.textContent = type === 'password' ? '👁️' : '🙈';
            });
        }

        function showUnlocked(instant = false) {
            if (instant) {
                if (lockScreen) lockScreen.style.display = 'none';
                if (contentScreen) {
                    contentScreen.style.display = 'block';
                    contentScreen.style.opacity = '1';
                }
            } else {
                if (lockScreen) {
                    lockScreen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    lockScreen.style.opacity = '0';
                    lockScreen.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        lockScreen.style.display = 'none';
                        if (contentScreen) {
                            contentScreen.style.display = 'block';
                            contentScreen.style.opacity = '0';
                            requestAnimationFrame(() => {
                                contentScreen.style.transition = 'opacity 0.4s ease';
                                contentScreen.style.opacity = '1';
                            });
                        }
                    }, 300);
                }
            }
        }

        function showLocked() {
            if (contentScreen) contentScreen.style.display = 'none';
            if (lockScreen) {
                lockScreen.style.display = 'flex';
                lockScreen.style.opacity = '1';
                lockScreen.style.transform = 'scale(1)';
            }
            if (passInput) passInput.focus();
        }

        if (isAuthenticated()) {
            // Check if there was a redirect query parameter
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            if (redirect && (redirect === '2025.html' || redirect === '2024.html')) {
                window.location.replace(redirect);
                return;
            }
            showUnlocked(true);
        } else {
            showLocked();
        }

        if (form && passInput) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const entered = passInput.value.trim().toLowerCase();
                if (!entered) return;

                const hash = await sha256(entered);
                if (hash === VALID_HASH) {
                    setAuthenticated();
                    if (errorMsg) errorMsg.style.display = 'none';

                    const params = new URLSearchParams(window.location.search);
                    const redirect = params.get('redirect');
                    if (redirect && (redirect === '2025.html' || redirect === '2024.html')) {
                        window.location.replace(redirect);
                    } else {
                        showUnlocked(false);
                    }
                } else {
                    if (errorMsg) {
                        errorMsg.style.display = 'block';
                        errorMsg.textContent = 'Incorrect password. Please try again.';
                    }
                    const card = form.closest('.lock-card');
                    if (card) {
                        card.classList.remove('shake');
                        void card.offsetWidth; // trigger reflow
                        card.classList.add('shake');
                    }
                    passInput.select();
                }
            });
        }
    }

    function initProtectedSubpage() {
        if (!isAuthenticated()) {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            window.location.replace('index.html?redirect=' + encodeURIComponent(currentPath));
        } else {
            // Reveal content if hidden by protection
            const protectedBody = document.body;
            if (protectedBody) {
                protectedBody.classList.remove('protected-hidden');
            }
        }
    }
})();
