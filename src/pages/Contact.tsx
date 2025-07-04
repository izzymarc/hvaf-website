import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useRef } from "react";
import { useInView } from "framer-motion";
import { emailJSConfig } from "@/utils/env";
import { trackContactForm } from '@/utils/analytics';
import { trackNewsletterSignup } from '@/utils/analytics';
import { subscribeToNewsletter } from '@/utils/mailchimp';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { Checkbox } from '@/components/ui/checkbox';

// Initialize EmailJS with your public key
console.log('EmailJS Config:', emailJSConfig);
emailjs.init(emailJSConfig.publicKey);

const Contact = () => {
  const { toast } = useToast();
  const ref = useRef(null);
  const form = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0); // Add key to force form re-render
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    organization: '',
    lga: '',
    state: '',
    country: '',
    message: '',
    subscribeToNewsletter: false
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if form reference exists
      if (!form.current) {
        throw new Error('Form reference is missing');
      }

      // Log the form data for debugging
      console.log('Form data being submitted:', formData);

      // Check EmailJS configuration
      if (!emailJSConfig.serviceId || !emailJSConfig.templateId || !emailJSConfig.publicKey) {
        const missing = [];
        if (!emailJSConfig.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
        if (!emailJSConfig.templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
        if (!emailJSConfig.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
        throw new Error(`Missing EmailJS configuration: ${missing.join(', ')}`);
      }

      // Log FormData for debugging
      if (form.current) {
        const fd = new FormData(form.current);
        for (let [key, value] of fd.entries()) {
          console.log('SENDING FIELD:', key, value);
        }
      }

      try {
        const response = await emailjs.sendForm(
          emailJSConfig.serviceId,
          emailJSConfig.templateId,
          form.current,
          emailJSConfig.publicKey
        );

        // Track contact form submission in Google Analytics
        trackContactForm();

        // Store newsletter subscription preference before clearing form
        const shouldSubscribeToNewsletter = formData.subscribeToNewsletter;
        const userEmail = formData.email;
        const userName = formData.name;

        // Clear the form IMMEDIATELY after successful email send
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          organization: '',
          lga: '',
          state: '',
          country: '',
          message: '',
          subscribeToNewsletter: false
        });

        // Force form re-render to reset Select components
        setFormKey(prev => prev + 1);

        // Reset the form element to ensure all fields are cleared
        if (form.current) {
          form.current.reset();
        }

        // Handle newsletter subscription if opted in (after form is cleared)
        let newsletterSubscribed = false;
        if (shouldSubscribeToNewsletter) {
          try {
            const subscriptionResult = await subscribeToNewsletter({
              email: userEmail,
              firstName: userName.split(' ')[0],
              lastName: userName.split(' ').slice(1).join(' '),
              consent: true
            });

            if (subscriptionResult.success) {
              trackNewsletterSignup();
              newsletterSubscribed = true;
            }
          } catch (error) {
            console.error('Newsletter subscription error:', error);
            // Don't fail the contact form if newsletter subscription fails
          }
        }

        // Show success message
        toast({
          title: "Message Sent!",
          description: shouldSubscribeToNewsletter && newsletterSubscribed
            ? "Thank you for contacting us. We'll respond as soon as possible. You've also been subscribed to our newsletter!"
            : shouldSubscribeToNewsletter && !newsletterSubscribed
              ? "Thank you for contacting us. We'll respond as soon as possible. There was an issue with the newsletter subscription, but your message was sent successfully."
              : "Thank you for contacting us. We'll respond as soon as possible.",
        });
        return response;
      } catch (error) {
        console.error('EmailJS Error Details:', {
          name: error.name,
          message: error.message,
          status: error.status,
          response: error.response
        });
        throw error;
      }
    } catch (error: any) {
      console.error('Error sending email:', {
        error,
        message: error.message,
        status: error.status,
        text: error.text,
        stack: error.stack
      });

      let errorMessage = "There was an error sending your message. ";

      if (error.status) {
        errorMessage += `Status: ${error.status}. `;
      }

      if (error.text) {
        try {
          const errorData = JSON.parse(error.text);
          errorMessage += errorData.message || error.text;
        } catch (e) {
          errorMessage += error.text;
        }
      } else if (error.message) {
        errorMessage += error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Layout>
        <motion.section
          className="py-16 bg-neutral-100"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="container-custom">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brown-700">Contact Us</h1>
              <p className="text-lg text-brown-600">
                Have questions or want to get involved? Reach out to us.
              </p>

            </motion.div>
          </div>
        </motion.section>

        <section
          className="py-16"
          ref={ref}
          id="contact"
        >
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <h2 className="text-3xl font-bold mb-6 text-brown-700">Get in Touch</h2>
                <p className="text-lg mb-8 text-brown-600">
                  We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary-100 text-primary flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-brown-700">Address</h3>
                      <p className="text-brown-600">Doka close, Narayi Highcost, Kaduna state, 800244</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary-100 text-primary flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-brown-700">Email</h3>
                      <p className="text-brown-600">Info@hvafoundation.org</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary-100 text-primary flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-brown-700">Phone</h3>
                      <p className="text-brown-600">+234 808 811 7603 <br />
                        +234 805 099 4771
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-brown-700">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/share/1B1NDMgeBP/?mibextid=wwXIfr" aria-label="Facebook" className="p-3 rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                    </a>
                    <a href="https://x.com/hvafoundation?t=oMXACTiiX32uX6gYmU9CMw&s=08" aria-label="Twitter" className="p-3 rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/hvaf_foundation?igsh=MWFsZjBpcTdjdHlxcQ%3D%3D&utm_source=qr" aria-label="Instagram" className="p-3 rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.44.7-2.1 1.37-.67.67-1.07 1.33-1.37 2.1-.3.76-.5 1.64-.56 2.91C.05 8.33.04 8.74.04 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.7 1.44 1.37 2.1.67.67 1.33 1.07 2.1 1.37.76.3 1.64.5 2.91.56C8.33 23.95 8.74 24 12 24s3.67-.05 4.95-.11c1.27-.06 2.15-.26 2.91-.56.78-.3 1.44-.7 2.1-1.37.67-.67 1.07-1.33 1.37-2.1.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.78-.7-1.44-1.37-2.1a5.41 5.41 0 0 0-2.1-1.37c-.76-.3-1.64-.5-2.91-.56C15.67.05 15.26.04 12 .04zm0 5.84c-3.34 0-6.05 2.71-6.05 6.05s2.71 6.05 6.05 6.05 6.05-2.71 6.05-6.05c0-3.34-2.71-6.05-6.05-6.05zm0 10c-2.17 0-3.94-1.77-3.94-3.94s1.77-3.94 3.94-3.94 3.94 1.77 3.94 3.94-1.77 3.94-3.94 3.94zm6.29-11.07c-.79 0-1.43.64-1.43 1.43s.64 1.43 1.43 1.43 1.43-.64 1.43-1.43-.64-1.43-1.43-1.43z" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn" className="p-3 rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                      </svg>
                    </a>
                    <a href="https://www.tiktok.com/@humanityverseaid?_t=ZS-8wfISLIy95O&_r=1" aria-label="TikTok" className="p-3 rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-2 text-brown-700">Send Us a Message</h2>
                <p className="text-sm text-gray-500 mb-6">Fields marked with <span className="text-red-500">*</span> are required.</p>
                <motion.form
                  key={formKey}
                  ref={form}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  className="space-y-2"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <Select
                        name="subject"
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                          <SelectItem value="Enquiry">General Enquiry</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Hidden input to ensure subject is included in EmailJS form submission */}
                      <input type="hidden" name="subject" value={formData.subject} />
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium mb-1">Organization</label>
                      <Input
                        id="organization"
                        name="organization"
                        placeholder="Your organization (if any)"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="lga" className="block text-sm font-medium mb-1">LGA</label>
                      <Input
                        id="lga"
                        name="lga"
                        placeholder="Local Government Area"
                        value={formData.lga}
                        onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message <span className="text-red-500">*</span></label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Write your message here..."
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter-consent-contact"
                      checked={formData.subscribeToNewsletter}
                      onCheckedChange={(checked) => setFormData({ ...formData, subscribeToNewsletter: !!checked })}
                      className="mt-1"
                    />
                    <label
                      htmlFor="newsletter-consent-contact"
                      className="text-sm text-brown-600 leading-relaxed cursor-pointer"
                    >
                      I would like to subscribe to the Humanity Verse Aid Foundation newsletter to receive updates on your work and ways I can help.
                      I understand that I can unsubscribe at any time.
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </Button>
                </motion.form>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-16 bg-primary-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <NewsletterSubscription
                variant="inline"
                showNameFields={true}
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brown-700">Frequently Asked Questions</h2>
                <p className="text-lg text-brown-600 mb-8">Find answers to common questions (FAQs)</p>
              </motion.div>
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-neutral-200">
                    <AccordionTrigger className="text-lg font-semibold text-brown-700 hover:text-primary transition-colors">
                      How can I donate to your organization?
                    </AccordionTrigger>
                    <AccordionContent className="text-brown-600">
                      You can donate through our website using various payment methods including credit card, PayPal, and bank transfer. All donations are tax-deductible where applicable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-neutral-200">
                    <AccordionTrigger className="text-lg font-semibold text-brown-700 hover:text-primary transition-colors">
                      What is your organization's mission?
                    </AccordionTrigger>
                    <AccordionContent className="text-brown-600">
                      Our mission is to create sustainable solutions for communities in need worldwide, focusing on education, healthcare, and economic development.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-neutral-200">
                    <AccordionTrigger className="text-lg font-semibold text-brown-700 hover:text-primary transition-colors">
                      How are donations used?
                    </AccordionTrigger>
                    <AccordionContent className="text-brown-600">
                      All donations go directly to our programs and projects. We maintain low administrative costs to ensure maximum impact for every dollar donated.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-b border-neutral-200">
                    <AccordionTrigger className="text-lg font-semibold text-brown-700 hover:text-primary transition-colors">
                      Can I volunteer?
                    </AccordionTrigger>
                    <AccordionContent className="text-brown-600">
                      Yes! We welcome volunteers for both local and international projects. Please visit our volunteer page to learn more about opportunities.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-b border-neutral-200">
                    <AccordionTrigger className="text-lg font-semibold text-brown-700 hover:text-primary transition-colors">
                      How can I stay updated on your work?
                    </AccordionTrigger>
                    <AccordionContent className="text-brown-600">
                      Follow us on social media, sign up for our newsletter, and check our website regularly for updates on our projects and impact.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </div>

          </div>
        </section>

        <motion.section className="py-16 bg-neutral-100">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6 text-brown-700">Visit Our Office</h2>
            <p className="text-lg mb-8 text-brown-600 max-w-2xl mx-auto">
              We're located in the heart of Global City, easily accessible by public transportation.
            </p>
            <div className="aspect-[16/9] max-w-4xl mx-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.2!2d7.4507!3d10.4710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDI4JzE1LjYiTiA3wrAyNycwMi41IkU!5e0!3m2!1sen!2sng!4v1663234283449!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map - Narayi Highcost, Kaduna"
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>
        </motion.section>
      </Layout>
    </>
  );
};

export default Contact;
