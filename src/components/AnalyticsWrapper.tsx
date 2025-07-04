import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { initGA } from '@/utils/analytics';

interface AnalyticsWrapperProps {
    children: React.ReactNode;
}

const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
    // Initialize Google Analytics on component mount
    useEffect(() => {
        // Only initialize in production or when explicitly enabled
        const isProduction = import.meta.env.PROD;
        const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

        if (isProduction || analyticsEnabled) {
            initGA();
        }
    }, []);

    // Use the analytics hook to track page views
    useAnalytics();

    return <>{children}</>;
};

export default AnalyticsWrapper; 