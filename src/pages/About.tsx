import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from "react";


const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <Layout>
      <motion.section
        className="py-16 bg-neutral-100"
        initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 0 } : { opacity: 0, y: 60 }}
        whileInView={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brown-700">About Us</h1>
            <p className="text-lg text-brown-600">
              Dedicated to creating sustainable solutions for communities in need worldwide.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <h2 className="text-3xl font-bold mb-6 text-brown-700">Our Mission</h2>
              <p className="text-lg mb-6 text-brown-600">
                Our mission at Humanity Verse Aid Foundation is to uplift underserved communities by providing essential support across education, and health sectors while empowering targeted populations with sustainable initiatives.
              </p>
              <p className="text-lg mb-6 text-brown-600">
                We aim to empower the less privileged through targeted programs, fostering self-sufficiency and sustainable well-being. By addressing pressing needs in education, health, and economic empowerment, we seek to alleviate suffering, reduce poverty, and improve sustainable outcomes for every individual.
              </p>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white mt-4">
                <Link to="/contact">Get Involved</Link>
              </Button>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full"></div>
              <motion.img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Volunteers helping communities"
                className="rounded-lg shadow-xl relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-neutral-100"
        initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 0 } : { opacity: 0, y: 60 }}
        whileInView={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1 relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full"></div>
              <motion.img
                src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                alt="Team meeting"
                className="rounded-lg shadow-xl relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <h2 className="text-3xl font-bold mb-6 text-brown-700">Our Vision</h2>
              <p className="text-lg mb-6 text-brown-600">
                To be a transformative force and leading non-governmental organization in Nigeria, recognized for improving lives through comprehensive programs, impactful community projects, and strategic partnerships.
              </p>
              <p className="text-lg mb-6 text-brown-600">
                Through collaboration with local partners, governments, and other stakeholders,
                we aim to create lasting change that transforms lives and empowers communities.
              </p>
              <Button asChild className="bg-primary hover:bg-primary-600 mt-4">
                <Link to="/services">Our Services</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-brown-700">Our Values</h2>
            <p className="text-lg mb-12 text-brown-600">
              Our work is guided by a set of core values that define who we are and how we operate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[

              {
                title: "Compassion",
                description: "We act with empathy and respect for the dignity and worth of every person."
              },
              {
                title: "Integrity",
                description: "We are committed to transparency, accountability, and ethical behavior in all our actions."
              },
              {
                title: "Collaboration",
                description: "We work together with communities and partners to achieve common goals."
              },
              {
                title: "Innovation",
                description: "We seek creative solutions to complex challenges and continuously improve our approaches."
              },
              {
                title: "Sustainability",
                description: "We design programs that create lasting positive change and protect the environment."
              },
              {
                title: "Equity",
                description: "We prioritize justice, equality, and inclusion in all our work and interactions."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-primary">{value.title}</h3>
                <p className="text-brown-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section
        className="py-16 bg-neutral-100"
        ref={ref}
        id="team"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-brown-700">Meet Our Team</h2>
            <p className="text-lg mb-12 text-brown-600">
              Our dedicated team brings a wealth of experience and passion to our mission of creating sustainable solutions for communities in need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                position: "Executive Director",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                description: "Leading our organization with vision and compassion"
              },
              {
                name: "Michael Chen",
                position: "Program Director",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                description: "Managing our community development programs"
              },
              {
                name: "Sophia Patel",
                position: "Communications Director",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                description: "Sharing our impact with the world"
              },
              {
                name: "James Wilson",
                position: "Development Director",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                description: "Building partnerships and support"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 0 } : { opacity: 0, y: 40 }}
                whileInView={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
              >
                <div className="relative aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <p className="text-white text-sm">{member.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-brown-700 mb-1">{member.name}</h3>
                  <p className="text-brown-600">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Together, we can make a significant impact in the lives of vulnerable communities.
            There are many ways you can support our work.
          </p>
          <div className="flex gap-2 md:gap-4 justify-center">
            <Button asChild variant="secondary" className="bg-accent text-white hover:bg-accent-600">
              <Link to="/donate">Make a Donation</Link>
            </Button>
            <Button asChild variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default About;
