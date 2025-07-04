declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js' | 'consent',
            targetId: string | Date,
            config?: {
                page_title?: string;
                page_location?: string;
                custom_map?: { [key: string]: string };
                [key: string]: any;
            }
        ) => void;
    }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-HCH2BG3MYN';

// Initialize Google Analytics (if not already loaded via HTML)
export const initGA = () => {
    // Check if gtag is already available (loaded via HTML)
    if (typeof window.gtag !== 'undefined') {
        return;
    }

    // Fallback: Load the Google Analytics script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        (window as any).dataLayer = (window as any).dataLayer || [];
        // eslint-disable-next-line prefer-rest-params
        (window as any).dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
    });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_location: url,
            page_title: title || document.title,
        });
    }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track donations
export const trackDonation = (amount: number, currency: string = 'USD') => {
    trackEvent('donate', 'engagement', `${currency} ${amount}`, amount);
};

// Track contact form submissions
export const trackContactForm = () => {
    trackEvent('contact_form_submit', 'engagement', 'contact_page');
};

// Track newsletter signups
export const trackNewsletterSignup = () => {
    trackEvent('newsletter_signup', 'engagement', 'email_subscription');
};

// Track file downloads (for reports, documents, etc.)
export const trackDownload = (fileName: string) => {
    trackEvent('download', 'engagement', fileName);
};

// Track outbound links
export const trackOutboundLink = (url: string) => {
    trackEvent('outbound_link', 'engagement', url);
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
    trackEvent('social_click', 'engagement', platform);
}; 