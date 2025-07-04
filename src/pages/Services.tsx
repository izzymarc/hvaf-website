import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion, useInView } from 'framer-motion';
import { useRef } from "react";

const Services = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brown-700">Our Services</h1>
            <p className="text-lg text-brown-600">
              Comprehensive programs designed to create sustainable change and empower communities worldwide.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16 bg-neutral-50" id="services">
        <div className="container-custom">
          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-10 text-brown-700 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Broad Program Areas and Initiatives
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}
          >
            {[{
              title: "Healthcare Assistance",
              items: [
                "Covering medical bills and essential medications",
                "Access to preventive care services.",
                "Fibroid Care Initiative: Providing comprehensive support for African women with fibroids, particularly focusing on black women disproportionately affected by this condition.",
                "Epilepsy and Seizure Relief Project: Subsidizing medications and offering support services for patients facing the financial burden of managing epilepsy and seizures."
              ]
            }, {
              title: "Entrepreneurial Empowerment & Capacity Building",
              items: [
                "Empowering individuals through vocational training, business startup support, and skills development to promote self-sufficiency.",
                "Relief Distribution: Supplying food and other essential relief items to needy communities and households.",
                "CSR Project Management: Facilitating CSR charity initiatives for private and government organizations, ensuring the execution of impactful social responsibility projects."
              ]
            }, {
              title: "Educational Support",
              items: [
                "School Funding essentials, including uniforms, fees, books, and exam registrations, to give disadvantaged children access to quality education.",
                "Relief Distribution initiative."
              ]
            }].map((section, idx) => (
              <motion.div
                key={section.title}
                className="bg-white rounded-lg shadow-md p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-primary">{section.title}</h3>
                <ul className="list-disc pl-5 space-y-2 text-brown-700">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-10 text-brown-700 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Core Health Initiatives
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}
          >
            {[{
              title: "Fibroid Care Initiative",
              desc: "Our Fibroid Care Initiative addresses the pressing health needs of women suffering from fibroids, with an emphasis on preventative and post-operative care.",
              items: [
                "Diagnostic Services: Comprehensive health screenings and ultrasounds.",
                "Counseling: Offering emotional support and education on managing fibroid health.",
                "Surgical Support: Providing funding and logistical support for fibroid surgeries.",
                "Aftercare: Access to post-surgical recovery services."
              ]
            }, {
              title: "Epilepsy & Seizure Relief Project",
              desc: "In response to the soaring costs of essential medications like Epilim, Humanity Verse Aid Foundation aims to bridge the affordability gap for patients needing lifelong seizure medication.",
              items: [
                "Medication Support: Subsidizing medication costs for those unable to afford necessary treatments.",
                "Healthcare Partnerships: Working with local health centers to ensure consistent access to care and support for epilepsy patients."
              ]
            }, {
              title: "Additional Programs",
              desc: null,
              items: [
                "Youth Career Building: Offering training in photography, digital design, garment-making, marketing, and internship placements to reduce youth unemployment.",
                "Food Security & Basic Needs: Providing ongoing access to nutritious food and essential supplies to under-resourced communities."
              ]
            }].map((section, idx) => (
              <motion.div
                key={section.title}
                className="bg-white rounded-lg shadow-md p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.1 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-primary">{section.title}</h3>
                {section.desc && <p className="mb-2 text-brown-700">{section.desc}</p>}
                <ul className="list-disc pl-5 space-y-2 text-brown-700">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}
          >
            {[{
              title: "Program Departments",
              items: [
                "Finance",
                "Administration",
                "Entrepreneurial Empowerment: Training individuals to launch or grow small businesses and achieve financial independence.",
                "Healthcare Assistance: Focusing on both preventative and curative health measures.",
                "Educational Support: Covering expenses for books, fees, exams, and scholarships.",
                "Housing Assistance: Supporting stable housing initiatives for low-income families.",
                "Food & Essentials: Providing vital sustenance to communities in need."
              ]
            }, {
              title: "Funding Sources",
              items: [
                "Corporate Social Responsibility (CSR): Partnering with organizations to manage and execute their CSR projects in alignment with our mission.",
                "Donations: Contributions from individual and corporate donors.",
                "Grants: Seeking national and international grants to support our initiatives.",
                "Crowdfunding: Engaging in regular fundraising campaigns to expand our reach."
              ]
            }, {
              title: "Outreach and Promotions",
              items: [
                "Website: A professional online platform to showcase projects, accept donations, and share impact stories.",
                "Fund Request Communications: Sending tailored letters and email newsletters to potential donors and partners.",
                "Collaborations & Merchandise: Creating awareness and raising funds through partnerships, merchandise, and project-related promotions."
              ]
            }].map((section, idx) => (
              <motion.div
                key={section.title}
                className="flex flex-col h-full bg-white rounded-lg shadow-md p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.1 }}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-5 text-brown-700 text-center">{section.title}</h2>
                <ul className="list-disc pl-5 space-y-2 text-brown-700">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        className="py-16 bg-primary text-white"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">How We Work</h2>
          <p className="text-lg mb-12 max-w-3xl mx-auto">
            Our approach is community-centered, collaborative, and focused on creating sustainable solutions that respect local cultures and contexts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Assess",
                description: "We conduct thorough needs assessments with community participation."
              },
              {
                title: "Plan",
                description: "We develop tailored solutions with local stakeholders."
              },
              {
                title: "Implement",
                description: "We deliver programs with local partners and community engagement."
              },
              {
                title: "Evaluate",
                description: "We measure impact and continuously improve our approaches."
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/90">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Services;
