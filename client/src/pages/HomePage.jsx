import React from 'react';
import { BrainCircuit, Gamepad2, Rocket, Globe, Twitter, Instagram } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import ctaButtonSound from '../assets/sounds/Button03.wav';

const HomePage = () => {
  const navigate = useNavigate();
  const [playCta] = useSound(ctaButtonSound, { volume: 0.25 });

  return (
    <div className="bg-deep-black text-white font-sans">
      <Navbar />

      {/* Main */}
      <main>
        {/* Hero */}
        <section
          className="h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 50% -30%, var(--color-electric-blue), var(--color-deep-black) 70%)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Ignite Their Future with <span className="text-cyan-green">AI-Powered</span>{' '}
              <span className="text-logo-yellow">Learning</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Explore the cosmos of knowledge with personalized lessons, interactive quests, and a
              universe of STEM concepts guided by our AI tutor.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 bg-cyan-green text-deep-black font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition animate-pulse-glow"
              onClick={(e) => {
                e.preventDefault();
                playCta();
                navigate('/dashboard');
              }}
            >
              <Rocket size={22} />
              Launch Your Journey
            </a>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="py-24 px-6 relative bg-gradient-to-b from-black via-deep-black to-black"
        >
          <div className="container mx-auto">
            <h2 className="text-center text-4xl font-bold mb-16">
              What Awaits You in the Cosmos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-8 rounded-xl bg-deep-black/90 border border-cyan-green/40 hover:border-cyan-green hover:shadow-[0_0_25px_rgba(46,243,209,0.6)] transition">
                <div className="text-cyan-green mb-4"><BrainCircuit size={48} /></div>
                <h3 className="text-2xl font-semibold text-cyan-green mb-3">AI-Personalized Paths</h3>
                <p className="text-white/80">Adaptive lessons tailored to your child’s learning pace and style.</p>
              </div>
              <div className="p-8 rounded-xl bg-deep-black/90 border border-electric-blue/40 hover:border-electric-blue hover:shadow-[0_0_25px_rgba(36,227,238,0.6)] transition">
                <div className="text-electric-blue mb-4"><Gamepad2 size={48} /></div>
                <h3 className="text-2xl font-semibold text-electric-blue mb-3">Interactive Game Quests</h3>
                <p className="text-white/80">Learning turned into an adventure with fun STEM quests and challenges.</p>
              </div>
              <div className="p-8 rounded-xl bg-deep-black/90 border border-logo-yellow/40 hover:border-logo-yellow hover:shadow-[0_0_25px_rgba(255,255,102,0.6)] transition">
                <div className="text-logo-yellow mb-4"><Rocket size={48} /></div>
                <h3 className="text-2xl font-semibold text-logo-yellow mb-3">Explore STEM from Afar</h3>
                <p className="text-white/80">Dive into Science, Technology, Engineering & Math with inspiring design.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold text-cyan-green mb-3">SpaceyTutor</h4>
            <p className="text-white/70 text-sm">
              Empowering kids with AI-driven learning across the cosmos of STEM.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-electric-blue mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#features" className="hover:text-cyan-green">Features</a></li>
              <li><a href="#about" className="hover:text-electric-blue">About</a></li>
              <li><a href="#contact" className="hover:text-logo-yellow">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-logo-yellow mb-3">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-5 text-xl">
              <a href="#" className="hover:text-cyan-green"><Globe size={20} /></a>
              <a href="#" className="hover:text-electric-blue"><Twitter size={20} /></a>
              <a href="#" className="hover:text-logo-yellow"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        <p className="text-center text-white/50 text-sm mt-8">
          © 2025 SpaceyTutor. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
