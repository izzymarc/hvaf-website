
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import FloatingContact from '../common/FloatingContact';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <ScrollToTop />
      <FloatingContact />
      <Footer />
    </div>
  );
};

export default Layout;
