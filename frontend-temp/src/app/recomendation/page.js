'use client';
import React from "react";
import { TreeDeciduous, ArrowLeft, Leaf, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer.jsx";

const recommendations = [
  {
    id: 1,
    title: "Switch to Renewable Energy",
    description:
      "Install solar panels or opt for a renewable energy provider to cut your emissions significantly.",
    image: "/solar-energy.png",
  },
  {
    id: 2,
    title: "Use Public Transport",
    description:
      "Reduce carbon emissions by choosing buses, trains, cycling, or carpooling instead of solo drives.",
    image: "/train.png",
  },
  {
    id: 3,
    title: "Reduce Food Waste",
    description:
      "Plan your meals, store food properly, and compost organic waste to lower methane emissions.",
    image: "/compost.png",
  },
  {
    id: 4,
    title: "Switch to Reusable Items",
    description:
      "Replace single-use plastics with reusable bottles, bags, and containers for everyday use.",
    image: "/recycle.png",
  },
  {
    id: 5,
    title: "Plant a Tree",
    description:
      "Join local tree-planting drives — every tree absorbs about 22 kg of CO₂ per year.",
    image: "/plant.png",
  },
  {
    id: 6,
    title: "Buy Local Products",
    description:
      "Support local farmers and reduce transport emissions by choosing local and seasonal produce.",
    image: "/healthy.png",
  },
];

const RecommendationPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f9f6] via-[#eef7f2] to-[#e6f4f1] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-between">
      <div className="max-w-[1200px] w-full mx-auto flex-grow">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-10 w-full">
          <button
            onClick={() => router.push("/home")}
            className="group flex items-center gap-2 text-sm font-bold text-emerald-900 bg-white/60 hover:bg-white border border-white/80 hover:border-emerald-500/20 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
        </div>

        {/* Hero title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100/50 border border-emerald-200/50 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-4">
            <TreeDeciduous className="w-3.5 h-3.5" />
            Reduction Guide
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 leading-tight mb-4">
            Recommendations to <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Reduce Your Carbon Footprint</span>
          </h1>
          <p className="text-base text-emerald-900/70 font-semibold leading-relaxed">
            Adopt these simple daily changes to cut your carbon footprints, live more sustainably, and earn green rewards.
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="group flex flex-col justify-between w-full bg-emerald-50/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] shadow-[0_10px_35px_rgba(27,94,32,0.03)] hover:bg-emerald-50/65 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:border-emerald-500/35 hover:-translate-y-1.5 transition-all duration-500 p-6 md:p-8 cursor-default"
            >
              <div>
                {/* Image / Icon Container */}
                <div className="w-16 h-16 bg-emerald-50/80 border border-emerald-100/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-100 transition-colors">
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-xl font-bold text-emerald-950 mb-3 leading-tight group-hover:text-emerald-900 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-sm text-emerald-900/70 font-medium leading-relaxed mb-6">
                  {rec.description}
                </p>
              </div>

              {/* Action Button */}
              <div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold py-3 px-5 rounded-2xl shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecommendationPage;