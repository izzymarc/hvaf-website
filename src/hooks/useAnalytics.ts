import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';

// Custom hook to track page views automatically
export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view whenever the location changes
        const url = window.location.href;
        const title = document.title;

        // Small delay to ensure page title is updated
        setTimeout(() => {
            trackPageView(url, title);
        }, 100);
    }, [location]);
};

// Hook for tracking specific events with easy access
export const useAnalyticsEvents = () => {
    return {
        trackPageView,
        trackEvent: (action: string, category: string, label?: string, value?: number) => {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value,
                });
            }
        },
        trackDonation: (amount: number, currency: string = 'USD') => {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'donate', {
                    event_category: 'engagement',
                    event_label: `${currency} ${amount}`,
                    value: amount,
                    currency: currency,
                });
            }
        },
        trackContactForm: () => {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'contact_form_submit', {
                    event_category: 'engagement',
                    event_label: 'contact_page',
                });
            }
        },
    };
}; 