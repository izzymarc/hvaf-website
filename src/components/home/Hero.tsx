import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-100 to-white pt-20 pb-16 md:pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
      <div className="container-custom flex flex-col-reverse md:flex-row gap-8 items-center justify-between px-4 md:px-8 lg:px-20">
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="mb-4 text-brown-700 text-center md:text-left leading-tight md:text-5xl text-2xl">
            Empowering <span className="text-primary">Lives</span> Building <span className="text-primary">Future</span>
          </h1>
          <p className="text-lg md:text-xl text-center md:text-left text-brown-600 mb-8 max-w-lg">
            Humanity Verse Aid Foundation works globally to provide sustainable solutions,
            emergency relief, and long-term development for vulnerable communities.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-600 text-lg">
              <Link to="/about">Learn More</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white text-lg">
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative flex justify-center block md:hidden lg:block lg:justify-end animate-fade-in">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 md:w-32 md:h-32 bg-accent/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-primary/20 rounded-full"></div>
              <motion.img
                src="/logo.png"
                alt="Humanity Verse Aid Foundation"
                className="relative z-10 w-40 md:w-96 rounded-lg"
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent-100 rounded-full opacity-40 blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;
