import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdvancedChatWidget from './components/AdvancedChatWidget';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SignUp from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-lightBg">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
        <AdvancedChatWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
