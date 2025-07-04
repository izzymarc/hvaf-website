
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <motion.section
      className="bg-primary py-16 md:py-24"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="container-custom text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Make a Difference Today
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          Your support can help transform lives and communities. Join us in our mission to create a better world for all.
        </motion.p>
        <motion.div
          className="flex gap-2 md:gap-4 justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <Button asChild size="lg" variant="secondary" className="bg-accent border-accent hover:bg-accent-600">
            <Link to="/donate">Donate Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
            <Link to="/contact">Get Involved</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
