import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Visualization from './components/Visualization';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AdvancedVoiceWidget from './components/AdvancedVoiceWidget';

function App() {
  return (
    <div className="min-h-screen bg-neutral-lightBg">
      <Navigation />
      <Hero />
      <Features />
      <Visualization />
      <HowItWorks />
      <Pricing />
      <Footer />
      <AdvancedVoiceWidget />
    </div>
  );
}

export default App;
