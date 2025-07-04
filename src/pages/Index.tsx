
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import LatestMedia from '@/components/home/LatestMedia';
import Stats from '@/components/home/Stats';
import Services from '@/components/home/Services';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <LatestMedia />
      <Stats />
      <Services />
      <CallToAction />
    </Layout>
  );
};

export default Index;
