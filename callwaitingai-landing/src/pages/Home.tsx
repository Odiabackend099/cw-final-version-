import Hero from '../components/Hero';
import Features from '../components/Features';
import Visualization from '../components/Visualization';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
  return (
    <div className="relative">
      {/* Fixed Background Image - Only thing that stays fixed at 10% opacity */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hhhh.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 0.1,
        }}
      >
      </div>
      
      {/* All content scrolls over the fixed background */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <Visualization />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </div>
    </div>
  );
};

export default Home;
