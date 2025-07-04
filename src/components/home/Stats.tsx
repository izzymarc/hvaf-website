import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface StatProps {
  value: number;
  label: string;
  icon: React.ReactNode;
}

import { useInView } from 'framer-motion';

const StatCard: React.FC<StatProps> = ({ value, label, icon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (end === 0) {
        setDisplayValue(0);
        return;
      }
      let startTimestamp: number | null = null;
      const duration = 1200; // ms
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setDisplayValue(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="mb-4 text-primary w-16 h-16 flex items-center justify-center rounded-full bg-primary-100">
            {icon}
          </div>
          <h3 className="text-4xl font-bold mb-2 text-primary">
            {displayValue.toLocaleString()}
          </h3>
          <p className="text-lg text-brown-600">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Stats = () => {
  const [stats, setStats] = useState({
    childrenHelped: 0,
    programsRunning: 0,
    successRate: 0,
    partnerOrganizations: 0
  });

  useEffect(() => {
    const db = getFirestore(app);
    const statsRef = doc(db, 'site', 'statistics');
    
    const fetchStats = async () => {
      try {
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats({
            childrenHelped: Number(data.childrenHelped) || 0,
            programsRunning: Number(data.programsRunning) || 0,
            successRate: Number(data.successRate) || 0,
            partnerOrganizations: Number(data.partnerOrganizations) || 0
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast({
          title: "Error",
          description: "Couldn't load statistics",
          variant: "destructive"
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.section
      className="py-16 md:py-24 bg-neutral-100"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brown-700">Our Impact</h2>
          <p className="text-lg text-brown-600">
            For over a decade, we've been making a real difference in communities across the globe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            value={stats.childrenHelped} 
            label="Children Helped" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard 
            value={stats.programsRunning} 
            label="Programs Running" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2M8 12v2m8-2v2m-8-6V6a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            } 
          />
          <StatCard 
            value={stats.successRate} 
            label="Success Rate (%)" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z" />
              </svg>
            } 
          />
          <StatCard 
            value={stats.partnerOrganizations} 
            label="Partner Organizations" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002-5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            } 
          />
        </div>
      </div>
    </motion.section>
  );
};

export default Stats;
