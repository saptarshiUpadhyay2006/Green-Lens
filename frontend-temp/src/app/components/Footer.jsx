'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Github, Leaf, Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-emerald-50/45 backdrop-blur-xl border-t border-emerald-500/20 rounded-t-[3rem] py-12 px-6 sm:px-12 md:px-20 mt-16 relative z-10 shadow-[0_-15px_40px_rgba(27,94,32,0.02)] cursor-default"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 border-b border-slate-200/50">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="p-1.5 bg-emerald-100 rounded-xl text-emerald-700">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-900">
              GreenLens
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 max-w-sm leading-relaxed mx-auto md:mx-0">
            Empowering individuals and organizations to track carbon footprints, verify sustainability logs on-chain, and earn rewards for supporting our planet.
          </p>
          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-start mt-2">
            <a href="#" className="w-9 h-9 bg-white/80 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 hover:-translate-y-0.5 shadow-sm transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/80 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 hover:-translate-y-0.5 shadow-sm transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/80 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 hover:-translate-y-0.5 shadow-sm transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/80 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 hover:-translate-y-0.5 shadow-sm transition-all duration-300">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dynamic Navigation Column */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Navigation</h4>
          <div className="flex flex-col gap-2.5 text-sm font-semibold text-emerald-950/80">
            {isLandingPage ? (
              <>
                <a href="#hero" className="hover:text-emerald-600 transition-colors duration-200">Home Hero</a>
                <a href="#about" className="hover:text-emerald-600 transition-colors duration-200">Carbon Footprint</a>
                <a href="#impact" className="hover:text-emerald-600 transition-colors duration-200">Our Impact</a>
                <a href="#how-it-works" className="hover:text-emerald-600 transition-colors duration-200">How It Works</a>
                <a href="#connect" className="hover:text-emerald-600 transition-colors duration-200">NGO Partnership</a>
              </>
            ) : (
              <>
                <a href="/home" className="hover:text-emerald-600 transition-colors duration-200">Dashboard</a>
                <a href="/store" className="hover:text-emerald-600 transition-colors duration-200">Sustainability Store</a>
                <a href="/redeem" className="hover:text-emerald-600 transition-colors duration-200">Redeem Rewards</a>
                <a href="/recomendation" className="hover:text-emerald-600 transition-colors duration-200">Carbon Recommendations</a>
                <a href="/submit" className="hover:text-emerald-600 transition-colors duration-200">Log Sustainable Action</a>
              </>
            )}
          </div>
        </div>

        {/* Platform Status & Contact */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Contact & Support</h4>
          <div className="flex flex-col gap-3.5 text-sm font-semibold text-slate-600">
            <a href="mailto:support@greenlens.org" className="inline-flex items-center gap-2 justify-center md:justify-start hover:text-emerald-600 transition-colors duration-200">
              <Mail className="w-4 h-4 text-emerald-600/70" />
              support@greenlens.org
            </a>
            
            {/* On-Chain Status Badging */}
            <div className="inline-flex items-center gap-2.5 justify-center md:justify-start bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mt-1 max-w-xs mx-auto md:mx-0 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Status</span>
                <span className="text-xs font-bold text-emerald-950">Sepolia Testnet Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright notes */}
      <div className="max-w-[1400px] mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
        <span>© {new Date().getFullYear()} GreenLens. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made with 🌱 in India
        </span>
      </div>
    </motion.footer>
  );
}
