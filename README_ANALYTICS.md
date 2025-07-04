# Google Analytics Setup for Humanity Verse Aid Foundation

## Overview
This project has been configured with Google Analytics (GA4) to track user interactions and website performance using your measurement ID: `G-HCH2BG3MYN`.

## Features Implemented

### 1. Automatic Page Tracking
- Tracks page views automatically when users navigate between pages
- Uses React Router integration for SPA tracking
- Tracks page titles and URLs

### 2. Event Tracking
The following events are automatically tracked:
- **Donations**: Amount, currency, and success/failure
- **Contact Form Submissions**: When users submit the contact form
- **Newsletter Signups**: Email subscription tracking
- **File Downloads**: Document downloads (if implemented)
- **Outbound Links**: External link clicks
- **Social Media Clicks**: Social platform engagement

### 3. Custom Events
Additional trackable events include:
- Form interactions
- Button clicks
- User engagement metrics

## File Structure

```
src/
├── utils/
│   └── analytics.ts          # Core GA configuration and tracking functions
├── hooks/
│   └── useAnalytics.ts       # React hooks for analytics
├── components/
│   └── AnalyticsWrapper.tsx  # Component that initializes GA
└── pages/
    ├── Donate.tsx           # Donation tracking implemented
    └── Contact.tsx          # Contact form tracking implemented
```

## Environment Configuration

Create a `.env` file in your project root with:

```env
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-HCH2BG3MYN
VITE_ENABLE_ANALYTICS=true
```

## How It Works

### 1. Initialization
- Google Analytics is loaded via script tag in `index.html` for optimal performance
- The `AnalyticsWrapper` component initializes tracking when the app loads
- Only loads in production or when `VITE_ENABLE_ANALYTICS=true`

### 2. Page Tracking
- The `useAnalytics` hook automatically tracks page changes
- Wrapped around all routes in `App.tsx`

### 3. Event Tracking
- Import tracking functions from `@/utils/analytics`
- Call appropriate tracking functions on user actions
- Example: `trackDonation(amount, currency)` after successful payment

## Usage Examples

### Track Custom Events
```typescript
import { trackEvent } from '@/utils/analytics';

// Track a custom event
trackEvent('button_click', 'engagement', 'header_donate_button');
```

### Track Donations
```typescript
import { trackDonation } from '@/utils/analytics';

// Track successful donation
trackDonation(100, 'USD');
```

### Track Contact Form
```typescript
import { trackContactForm } from '@/utils/analytics';

// Track contact form submission
trackContactForm();
```

## Best Practices Implemented

1. **Privacy-First**: Only tracks in production unless explicitly enabled
2. **Type Safety**: Full TypeScript support with proper type definitions
3. **Error Handling**: Graceful degradation if GA fails to load
4. **Performance**: Script loaded asynchronously in HTML head
5. **Flexible**: Environment variable configuration for different environments

## Monitoring and Debugging

### Development
- Set `VITE_ENABLE_ANALYTICS=true` in your `.env` file
- Check browser console for tracking calls
- Use Google Analytics Debug View

### Production
- Analytics automatically enabled
- Monitor real-time data in Google Analytics dashboard
- Set up goals and conversions for key actions

## Key Metrics to Monitor

1. **Page Views**: Most visited pages and user flow
2. **Donations**: Conversion rates, amounts, and currencies
3. **Contact Forms**: Lead generation and user engagement
4. **User Demographics**: Geographic and device data
5. **Session Duration**: User engagement metrics

## Next Steps

1. Set up Google Analytics Goals for:
   - Donation completions
   - Contact form submissions
   - Newsletter signups

2. Configure Enhanced Ecommerce for detailed donation tracking

3. Set up custom dimensions for:
   - Donation types (one-time vs monthly)
   - User types (donor vs volunteer)
   - Content categories

4. Create custom dashboards for foundation-specific metrics

## Support

The analytics implementation follows Google Analytics 4 best practices and is configured for optimal tracking of humanitarian organization metrics. 