'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Coins, Tag, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleRedeem = () => {
    router.push(`/redeem?productId=${product.id}`);
  };

  return (
    <div className="group flex flex-col justify-between w-full bg-emerald-50/40 backdrop-blur-xl border border-emerald-500/10 rounded-[2rem] shadow-[0_10px_35px_rgba(27,94,32,0.03)] hover:bg-emerald-50/65 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:border-emerald-500/35 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden cursor-default">
      <div>
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-white/40">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle green gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-emerald-50/80 border border-emerald-100/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 backdrop-blur-sm">
              <Tag className="w-3 h-3 text-emerald-600" />
              {product.ngo}
            </span>
          </div>

          <h3 className="text-xl font-bold text-emerald-950 mb-2 leading-tight group-hover:text-emerald-900 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-emerald-900/70 font-medium leading-relaxed mb-4">
            {product.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-2">
        <button
          onClick={handleRedeem}
          className="w-full relative overflow-hidden group/btn flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <span className="flex items-center gap-2 text-sm tracking-wide">
            <Coins className="w-4 h-4 animate-pulse" />
            Redeem Item
          </span>
          <span className="flex items-center gap-1.5 bg-white/20 border border-white/10 px-3 py-1 rounded-xl text-xs font-black tracking-wider shadow-sm">
            {product.price} GT
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

