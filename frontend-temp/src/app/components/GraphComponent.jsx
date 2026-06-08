import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { monthlyTokens, activityBreakdown } from "../data/dashboardData";
import { TrendingUp, BarChart3 } from "lucide-react";

// Color mapping matching the categories on the dashboard:
// 1. Blue (Transport)
// 2. Yellow (Electricity)
// 3. Orange (Solar)
// 4. Green (Other / Plantation)
const COLORS = ["#3B82F6", "#EAB308", "#F97316", "#10B981"];

export default function GraphComponent() {
  const totalTokens = monthlyTokens.reduce((sum, m) => sum + m.tokens, 0);
  const lastMonthTokens = monthlyTokens[monthlyTokens.length - 2].tokens;
  const currentMonthTokens = monthlyTokens[monthlyTokens.length - 1].tokens;

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-emerald-50/45 backdrop-blur-xl border border-emerald-500/20 p-6 sm:p-8 mt-8 rounded-[2rem] shadow-[0_15px_50px_rgba(27,94,32,0.04)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 to-emerald-600" />
      <h3 className="text-2xl font-black mb-6 text-emerald-950 flex items-center gap-2 relative z-10">
        <BarChart3 className="w-6 h-6 text-emerald-600" />
        Activity & Token Analytics
      </h3>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className="card bg-gradient-to-br from-emerald-50/50 to-teal-50/10 hover:from-emerald-50 hover:to-teal-50 border border-emerald-100/60 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Tokens Earned</h4>
          <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-850 mt-2">{totalTokens}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-50/50 to-emerald-50/10 hover:from-green-50 hover:to-emerald-50 border border-green-100/60 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
          <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider">Last Month</h4>
          <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-850 mt-2">{lastMonthTokens}</p>
        </div>
        <div className="card bg-gradient-to-br from-lime-50/50 to-lime-50/10 hover:from-lime-50 hover:to-lime-50 border border-lime-100/60 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
          <h4 className="text-xs font-bold text-lime-800 uppercase tracking-wider">Current Month</h4>
          <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-lime-700 to-emerald-850 mt-2">{currentMonthTokens}</p>
        </div>
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Line Chart */}
        <div className="bg-white/95 border border-slate-100/80 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-emerald-500/10 transition-all duration-300">
          <h4 className="text-base font-bold mb-6 text-emerald-950 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Monthly Green Tokens Earned
          </h4>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyTokens}>
              <Line type="monotone" dataKey="tokens" stroke="#10B981" strokeWidth={3.5} dot={{ r: 5, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/95 border border-slate-100/80 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-emerald-500/10 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold mb-6 text-emerald-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Token Breakdown by Activity
            </h4>
            <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
              <PieChart>
                <Pie
                  data={activityBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 70 : 90}
                  innerRadius={isMobile ? 45 : 55}
                  paddingAngle={4}
                  fill="#10B981"
                  dataKey="value"
                  label={isMobile ? false : ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Responsive Legend */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4 px-2 pb-2 transition-all duration-300 border-t border-slate-100 pt-4">
            {activityBreakdown.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-950">
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
                <span className="text-emerald-700/60 font-medium">({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}