import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 300);
          if (window.location.pathname === '/') {
            navigate('/');
          }
        }
        return newProgress;
      });
    }, 3000 / 100); // 3 seconds total, 100 steps

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'linear-gradient(135deg, #f5e9da 0%, #f7fafc 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated floating background shapes */}
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
            animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ zIndex: 1 }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"
            animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{ zIndex: 1 }}
          />
          <div className="flex flex-col items-center relative z-10">
            <motion.img
              src="/logo.png"
              alt="Humanity Verse Aid Foundation Logo"
              className="h-28 w-auto mb-4 drop-shadow-xl"
              initial={{ scale: 0, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.3 }}
            />
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-brown-700 mb-1 tracking-tight drop-shadow-lg"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              Humanity Verse
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-accent mb-6 drop-shadow"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            >
              Aid Foundation
            </motion.h2>
            {/* Animated progress bar */}
            <div className="w-72 mt-6">
              <div className="bg-brown-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-primary bg-gradient-to-r from-accent to-primary h-3 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.3 }}
                  style={{ boxShadow: '0 0 12px 2px #e1c089' }}
                />
              </div>
              <motion.p
                className="text-sm text-brown-600 mt-2 font-medium tracking-wide text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Loading... {progress}% complete
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
