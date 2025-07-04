
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingContact = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="fixed bottom-8 right-6 z-40">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        whileInView={{ scale: [1, 1.05, 1] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        onClick={handleContactClick} 
        className="rounded-full w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all"
        aria-label="Contact us"
      >
        <MailIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default FloatingContact;
