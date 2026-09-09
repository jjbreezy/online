/**
 * Cookie Consent Banner — DIY implementation with Google Consent Mode v2
 * 
 * Reads/writes consent state to localStorage.
 * Shows banner if no consent decision has been recorded.
 * Updates Google Consent Mode signals on accept/reject.
 * 
 * IMPORTANT: The Consent Mode v2 'default deny' snippet must be placed
 * in the <head> BEFORE any Google tags (gtag.js / GTM). This script
 * handles the 'update' call after user interaction.
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'jjb_cookie_consent';

    /**
     * Read stored consent. Returns 'granted', 'denied', or null.
     */
    function getStoredConsent() {
        try {
            var val = localStorage.getItem(STORAGE_KEY);
            if (val === 'granted' || val === 'denied') return val;
        } catch (e) { /* localStorage unavailable */ }
        return null;
    }

    /**
     * Persist consent decision.
     */
    function storeConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) { /* silent fail */ }
    }

    /**
     * Push consent update to Google Consent Mode v2.
     */
    function updateGoogleConsent(granted) {
        if (typeof gtag !== 'function') return;
        var state = granted ? 'granted' : 'denied';
        gtag('consent', 'update', {
            'ad_storage': state,
            'analytics_storage': state,
            'ad_user_data': state,
            'ad_personalization': state
        });
    }

    /**
     * Hide the banner with a fade-out.
     */
    function hideBanner() {
        var banner = document.getElementById('cookie-consent-banner');
        if (!banner) return;
        var card = banner.querySelector('.consent-card');
        if (card) {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
        }
        setTimeout(function () {
            banner.classList.remove('visible');
        }, 260);
    }

    /**
     * Show the banner.
     */
    function showBanner() {
        var banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    }

    /**
     * Handle accept.
     */
    function handleAccept() {
        storeConsent('granted');
        updateGoogleConsent(true);
        hideBanner();
    }

    /**
     * Handle reject.
     */
    function handleReject() {
        storeConsent('denied');
        updateGoogleConsent(false);
        hideBanner();
    }

    /**
     * Initialize: check stored consent and either apply it silently
     * or show the banner for a first-time visitor.
     */
    function init() {
        var stored = getStoredConsent();

        if (stored === 'granted') {
            // Returning visitor who accepted — update consent silently
            updateGoogleConsent(true);
            return;
        }

        if (stored === 'denied') {
            // Returning visitor who rejected — nothing to do
            return;
        }

        // No stored decision — show the banner
        showBanner();

        // Bind buttons
        var acceptBtn = document.getElementById('consent-accept');
        var rejectBtn = document.getElementById('consent-reject');
        if (acceptBtn) acceptBtn.addEventListener('click', handleAccept);
        if (rejectBtn) rejectBtn.addEventListener('click', handleReject);
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
