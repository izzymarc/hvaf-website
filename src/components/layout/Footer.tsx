
import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSubscription from '@/components/NewsletterSubscription';

const Footer = () => {

  return (
    <footer className="bg-brown-100 text-brown-700 pt-8 pb-4">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Humanity Verse Aid Foundation Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg text-primary">Humanity Verse Aid</span>
            </div>
            <p className="text-sm text-brown-600">
              Empowering Lives, Building Future.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/share/1B1NDMgeBP/?mibextid=wwXIfr" aria-label="Facebook" className="text-brown-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a href="https://x.com/hvafoundation?t=oMXACTiiX32uX6gYmU9CMw&s=08" aria-label="Twitter" className="text-brown-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/hvaf_foundation?igsh=MWFsZjBpcTdjdHlxcQ%3D%3D&utm_source=qr" aria-label="Instagram" className="text-brown-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.44.7-2.1 1.37-.67.67-1.07 1.33-1.37 2.1-.3.76-.5 1.64-.56 2.91C.05 8.33.04 8.74.04 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.7 1.44 1.37 2.1.67.67 1.33 1.07 2.1 1.37.76.3 1.64.5 2.91.56C8.33 23.95 8.74 24 12 24s3.67-.05 4.95-.11c1.27-.06 2.15-.26 2.91-.56.78-.3 1.44-.7 2.1-1.37.67-.67 1.07-1.33 1.37-2.1.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.78-.7-1.44-1.37-2.1a5.41 5.41 0 0 0-2.1-1.37c-.76-.3-1.64-.5-2.91-.56C15.67.05 15.26.04 12 .04zm0 5.84c-3.34 0-6.05 2.71-6.05 6.05s2.71 6.05 6.05 6.05 6.05-2.71 6.05-6.05c0-3.34-2.71-6.05-6.05-6.05zm0 10c-2.17 0-3.94-1.77-3.94-3.94s1.77-3.94 3.94-3.94 3.94 1.77 3.94 3.94-1.77 3.94-3.94 3.94zm6.29-11.07c-.79 0-1.43.64-1.43 1.43s.64 1.43 1.43 1.43 1.43-.64 1.43-1.43-.64-1.43-1.43-1.43z" />
                </svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-brown-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@humanityverseaid?_t=ZS-8wfISLIy95O&_r=1" aria-label="TikTok" className="text-brown-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Site Map */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold mb-2">Site Map</h3>
            <div className="grid grid-cols-2">
              <div>
                <ul className="space-y-1">
                  <li><Link to="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/services" className="text-sm hover:text-primary transition-colors">Our Services</Link></li>
                  <li><Link to="/gallery" className="text-sm hover:text-primary transition-colors">Gallery</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-1">
                  <li><Link to="/contact" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
                  <li><Link to="/donate" className="text-sm hover:text-primary transition-colors">Donate</Link></li>
                  <li><Link to="/admin" className="text-sm hover:text-primary transition-colors">Admin</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Doka close, Narayi Highcost, Kaduna state, 800244</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@hvafoundation.org</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+234 808 811 7603 <br />
                  +234 805 099 4771
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <NewsletterSubscription variant="footer" />
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-brown-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Humanity Verse Aid Foundation. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm hover:text-primary mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
