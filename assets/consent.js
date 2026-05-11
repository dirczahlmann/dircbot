// ============== COOKIE / CONSENT BANNER ==============
// Shows on first visit. Stores consent in localStorage.
// Blocks chat function until consent given (DSGVO-compliant).

(function() {
  const CONSENT_KEY = 'dircbot-consent-v1';

  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch (e) {
      return false;
    }
  }

  function showBanner() {
    const banner = document.getElementById('consentBanner');
    if (banner) banner.classList.add('visible');
  }

  function hideBanner() {
    const banner = document.getElementById('consentBanner');
    if (banner) banner.classList.remove('visible');
  }

  window.acceptConsent = function() {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch (e) {}
    hideBanner();
  };

  window.hasUserConsent = hasConsent;

  // Show banner on load if no consent yet
  if (!hasConsent()) {
    // Wait until DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
