// Helper to safely access environment variables
export function getEnvVar(key: string): string {
  const value = import.meta.env[key] || process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

// EmailJS configuration
export const emailJSConfig = {
  serviceId: getEnvVar('VITE_EMAILJS_SERVICE_ID'),
  templateId: getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
  publicKey: getEnvVar('VITE_EMAILJS_PUBLIC_KEY'),
};
