import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { subscribeToNewsletter, SubscriptionData } from '@/utils/mailchimp';
import { trackNewsletterSignup } from '@/utils/analytics';

interface NewsletterSubscriptionProps {
    variant?: 'footer' | 'inline' | 'modal';
    showNameFields?: boolean;
    className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
    variant = 'footer',
    showNameFields = false,
    className = ''
}) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        consent: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive"
            });
            return;
        }

        if (!formData.consent) {
            toast({
                title: "Consent Required",
                description: "Please consent to receive our newsletter.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const subscriptionData: SubscriptionData = {
                email: formData.email,
                firstName: formData.firstName || undefined,
                lastName: formData.lastName || undefined,
                consent: formData.consent
            };

            const result = await subscribeToNewsletter(subscriptionData);

            if (result.success) {
                // Track newsletter signup in Google Analytics
                trackNewsletterSignup();

                toast({
                    title: "Subscription Successful!",
                    description: result.message,
                });

                // Reset form
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    consent: false
                });
            } else {
                toast({
                    title: "Subscription Failed",
                    description: result.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConsentChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            consent: checked
        }));
    };

    // Footer variant (compact)
    if (variant === 'footer') {
        return (
            <div className={className}>
                <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                <p className="text-sm mb-4">
                    Subscribe to our newsletter to receive updates on our work and ways you can help.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white/80"
                        required
                    />

                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="newsletter-consent"
                            checked={formData.consent}
                            onCheckedChange={handleConsentChange}
                            className="mt-1"
                        />
                        <label
                            htmlFor="newsletter-consent"
                            className="text-xs text-brown-600 leading-tight cursor-pointer"
                        >
                            I consent to receive newsletters and updates from Humanity Verse Aid Foundation.
                            You can unsubscribe at any time.
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-600"
                        disabled={isLoading || !formData.consent}
                    >
                        {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                </form>
            </div>
        );
    }

    // Inline variant (for pages)
    if (variant === 'inline') {
        return (
            <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
                <h3 className="text-2xl font-bold mb-4 text-brown-700">Stay Updated</h3>
                <p className="text-brown-600 mb-6">
                    Subscribe to our newsletter to receive the latest updates on our humanitarian work and impact.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {showNameFields && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </div>
                    )}

                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                    />

                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="newsletter-consent-inline"
                            checked={formData.consent}
                            onCheckedChange={handleConsentChange}
                            className="mt-1"
                        />
                        <label
                            htmlFor="newsletter-consent-inline"
                            className="text-sm text-brown-600 leading-relaxed cursor-pointer"
                        >
                            I consent to receive newsletters, updates, and promotional emails from Humanity Verse Aid Foundation.
                            I understand that I can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us directly.
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-600 py-3"
                        disabled={isLoading || !formData.consent}
                    >
                        {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        We respect your privacy. Your information will never be shared with third parties.
                    </p>
                </form>
            </div>
        );
    }

    // Modal variant (for popups)
    return (
        <div className={`p-6 ${className}`}>
            <h3 className="text-xl font-bold mb-3 text-brown-700">Join Our Newsletter</h3>
            <p className="text-brown-600 mb-4">
                Get the latest updates on our humanitarian work delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                />

                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="newsletter-consent-modal"
                        checked={formData.consent}
                        onCheckedChange={handleConsentChange}
                        className="mt-1"
                    />
                    <label
                        htmlFor="newsletter-consent-modal"
                        className="text-xs text-brown-600 leading-tight cursor-pointer"
                    >
                        I consent to receive newsletters from Humanity Verse Aid Foundation.
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-600"
                    disabled={isLoading || !formData.consent}
                >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </form>
        </div>
    );
};

export default NewsletterSubscription; 