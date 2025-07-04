// Mailchimp Newsletter Subscription Utility

export interface SubscriptionData {
    email: string;
    firstName?: string;
    lastName?: string;
    consent: boolean;
}

export interface MailchimpResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Since we're in a client-side environment, we'll use a serverless function approach
// This function will call your backend API endpoint that handles Mailchimp integration
export const subscribeToNewsletter = async (data: SubscriptionData): Promise<MailchimpResponse> => {
    try {
        // Validate consent
        if (!data.consent) {
            return {
                success: false,
                message: 'You must consent to receive our newsletter to subscribe.'
            };
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                success: false,
                message: 'Please enter a valid email address.'
            };
        }

        // Check if Mailchimp credentials are configured
        if (!validateMailchimpConfig()) {
            console.log('Using demo mode - Mailchimp credentials not configured');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate occasional failures for testing
            if (Math.random() < 0.1) { // 10% failure rate for testing
                return {
                    success: false,
                    message: 'Subscription failed. Please try again later.'
                };
            }

            return {
                success: true,
                message: 'Successfully subscribed to newsletter! (Demo mode)',
                data: {
                    email: data.email,
                    status: 'subscribed',
                    timestamp: new Date().toISOString()
                }
            };
        }

        // Production: Use direct Mailchimp form submission (no backend required)
        return await submitToMailchimpForm(data);

    } catch (error) {
        console.error('Newsletter subscription error:', error);

        return {
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        };
    }
};

// Client-side Mailchimp integration using their embedded forms
export const getMailchimpEmbedUrl = (listId: string, userId: string): string => {
    return `https://${userId}.usX.list-manage.com/subscribe/post?u=${userId}&id=${listId}`;
};

// Validate Mailchimp configuration
export const validateMailchimpConfig = (): boolean => {
    const apiKey = import.meta.env.VITE_MAILCHIMP_API_KEY;
    const listId = import.meta.env.VITE_MAILCHIMP_LIST_ID;
    const serverPrefix = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX;

    // Debug logging to help troubleshoot configuration
    console.log('Mailchimp Config Check:', {
        hasApiKey: !!apiKey,
        hasListId: !!listId,
        hasServerPrefix: !!serverPrefix,
        apiKey: apiKey ? `${apiKey.substring(0, 6)}...` : 'missing',
        listId: listId ? `${listId.substring(0, 6)}...` : 'missing',
        serverPrefix: serverPrefix || 'missing'
    });

    return !!(apiKey && listId && serverPrefix);
};

// Get Mailchimp configuration from environment variables
export const getMailchimpConfig = () => {
    return {
        apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
        listId: import.meta.env.VITE_MAILCHIMP_LIST_ID,
        serverPrefix: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX,
    };
};

// Test function to verify Mailchimp URL format
export const testMailchimpUrl = () => {
    const config = getMailchimpConfig();
    const testUrl = `https://${config.serverPrefix}.list-manage.com/subscribe/post-json?u=${config.apiKey}&id=${config.listId}&EMAIL=test@example.com&c=test_callback`;

    console.log('Test Mailchimp URL:', testUrl);
    console.log('URL Components:', {
        serverPrefix: config.serverPrefix,
        userIdLength: config.apiKey?.length,
        listIdLength: config.listId?.length,
        fullUrl: testUrl
    });

    return testUrl;
};

// Direct Mailchimp form submission (no backend required)
export const submitToMailchimpForm = async (data: SubscriptionData): Promise<MailchimpResponse> => {
    const config = getMailchimpConfig();

    if (!validateMailchimpConfig()) {
        // In development or if config is missing, use demo mode
        console.log('Using demo mode - Mailchimp config not found');
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (Math.random() < 0.1) {
            return {
                success: false,
                message: 'Subscription failed. Please try again later.'
            };
        }

        return {
            success: true,
            message: 'Successfully subscribed to newsletter! (Demo mode)',
            data: { email: data.email, status: 'subscribed' }
        };
    }

    try {
        // Use JSONP approach for cross-origin requests to Mailchimp
        const callbackName = `mailchimp_callback_${Date.now()}`;

        return new Promise((resolve) => {
            // Create callback function
            (window as any)[callbackName] = (response: any) => {
                // Clean up
                delete (window as any)[callbackName];
                const script = document.getElementById(callbackName);
                if (script) {
                    script.remove();
                }

                if (response.result === 'success') {
                    console.log('Mailchimp Success Response:', response);
                    resolve({
                        success: true,
                        message: 'Successfully subscribed to newsletter!',
                        data: { email: data.email, status: 'subscribed', mailchimpResponse: response }
                    });
                } else {
                    // Handle Mailchimp errors
                    console.log('Mailchimp Error Response:', response);
                    let message = 'Failed to subscribe. Please try again later.';
                    if (response.msg) {
                        if (response.msg.includes('already subscribed')) {
                            message = 'You are already subscribed to our newsletter!';
                        } else if (response.msg.includes('invalid email')) {
                            message = 'Please enter a valid email address.';
                        } else {
                            message = response.msg.replace(/\d+ - /, ''); // Remove error codes
                        }
                    }

                    resolve({
                        success: response.msg && response.msg.includes('already subscribed'),
                        message: message,
                        data: { mailchimpResponse: response }
                    });
                }
            };

            // Build URL with parameters
            const params = new URLSearchParams({
                u: config.apiKey || '',
                id: config.listId || '',
                EMAIL: data.email,
                c: callbackName
            });

            if (data.firstName) params.append('FNAME', data.firstName);
            if (data.lastName) params.append('LNAME', data.lastName);

            const url = `https://${config.serverPrefix}.list-manage.com/subscribe/post-json?${params.toString()}`;

            // Debug logging
            console.log('Mailchimp Subscription Attempt:', {
                url: url,
                serverPrefix: config.serverPrefix,
                userIdLength: config.apiKey?.length,
                listIdLength: config.listId?.length,
                email: data.email
            });

            // Create script tag for JSONP
            const script = document.createElement('script');
            script.id = callbackName;
            script.src = url;
            script.onerror = (error) => {
                console.error('Script loading error:', error);
                console.error('Failed URL:', url);
                delete (window as any)[callbackName];
                script.remove();
                resolve({
                    success: false,
                    message: 'Network error. Please check your Mailchimp credentials and try again.'
                });
            };

            document.head.appendChild(script);

            // Timeout after 10 seconds
            setTimeout(() => {
                if ((window as any)[callbackName]) {
                    delete (window as any)[callbackName];
                    script.remove();
                    resolve({
                        success: false,
                        message: 'Request timed out. Please try again.'
                    });
                }
            }, 10000);
        });

    } catch (error) {
        console.error('Mailchimp form submission error:', error);
        return {
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        };
    }
}; 