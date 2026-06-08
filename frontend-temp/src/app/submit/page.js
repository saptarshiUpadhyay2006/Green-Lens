'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Leaf, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer.jsx';

export default function MethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const router = useRouter();

  const methods = [
    { id: 'electricity', label: 'Electricity Bills' },
    { id: 'solar', label: 'Solar Power' },
    { id: 'transport', label: 'Transport Mode' },
    { id: 'plantation', label: 'Tree Plantation' },
    { id: 'purchase', label: 'Purchase of Eco-Friendly Products' }
  ];

  const handleContinue = () => {
    if (selectedMethod) router.push(`/submit/${selectedMethod}-form`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f9f6] via-[#eef7f2] to-[#e6f4f1] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-between">
      <div className="max-w-3xl w-full mx-auto flex-grow flex flex-col justify-center py-6">
        
        {/* Navigation & Header */}
        <div className="flex justify-start mb-6 w-full">
          <button
            onClick={() => router.push("/home")}
            className="group flex items-center gap-2 text-sm font-bold text-emerald-900 bg-white/60 hover:bg-white border border-white/80 hover:border-emerald-500/20 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
        </div>

        <motion.div
          className="w-full bg-emerald-50/40 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col items-center gap-8 border border-emerald-500/20 backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 text-center tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Track Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Green Impact</span>
          </motion.h1>

          <p className="text-sm sm:text-base text-slate-500 font-semibold text-center -mt-2">
            Choose an activity below to calculate, verify, and log your carbon reduction on the Sepolia blockchain.
          </p>

          <div className="w-full flex flex-col gap-4 mt-2">
            {methods.map((method) => (
              <motion.label
                key={method.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 250 }}
                className={`w-full cursor-pointer p-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-300 ${
                  selectedMethod === method.id
                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-md shadow-emerald-500/5'
                    : 'bg-white/50 border-white hover:border-emerald-500/20 hover:bg-white/95 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="accent-emerald-600 w-5 h-5 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-bold">
                    {method.label}
                  </span>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </motion.label>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedMethod}
            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-extrabold shadow-lg transition-all duration-300 ${
              selectedMethod
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-[0_4px_25px_rgba(16,185,129,0.15)]'
                : 'bg-slate-350 cursor-not-allowed text-slate-400'
            }`}
          >
            <Leaf className="w-5 h-5" />
            Continue to Form
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
