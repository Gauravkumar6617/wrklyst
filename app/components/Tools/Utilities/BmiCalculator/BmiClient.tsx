"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, RefreshCw, Info, Scale, Ruler, ChevronRight } from "lucide-react";
import { ToolHeader, ToolCard } from "@/app/components/ui/ToolPageElements";

export function BMIClient() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string; percent: number } | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (w > 0 && h > 0) {
      const bmiValue = parseFloat((w / (h * h)).toFixed(1));
      let category = "";
      let color = "";
      let percent = 0;

      // Logic for Visual Gauge (capped at 40 for percentage)
      percent = Math.min(Math.max(((bmiValue - 15) / (40 - 15)) * 100, 5), 95);

      if (bmiValue < 18.5) {
        category = "Underweight";
        color = "bg-blue-500";
      } else if (bmiValue < 25) {
        category = "Healthy Weight";
        color = "bg-green-500";
      } else if (bmiValue < 30) {
        category = "Overweight";
        color = "bg-orange-500";
      } else {
        category = "Obese";
        color = "bg-red-500";
      }

      setResult({ bmi: bmiValue, category, color, percent });
    }
  };

  const categories = [
    { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
    { label: "Healthy", range: "18.5 - 24.9", color: "bg-green-500" },
    { label: "Overweight", range: "25 - 29.9", color: "bg-orange-500" },
    { label: "Obese", range: "≥ 30", color: "bg-red-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <ToolHeader 
        title="BMI Calculator" 
        description="Calculate your Body Mass Index instantly to track your health metrics."
        icon={Calculator}
      />

      <ToolCard className="p-5 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <Scale className="h-3 w-3" /> Weight
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black/5 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">kg</span>
            </div>
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <Ruler className="h-3 w-3" /> Height
            </label>
            <div className="relative">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black/5 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">cm</span>
            </div>
          </div>
        </div>

        <button
          onClick={calculateBMI}
          disabled={!weight || !height}
          className="w-full mt-6 md:mt-8 bg-black text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-black/10 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-30 transition-all flex items-center justify-center gap-3"
        >
          Calculate Result <ChevronRight className="h-6 w-6" />
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 space-y-6 overflow-hidden"
            >
              <div className="p-6 md:p-8 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your BMI Score</p>
                <h2 className="text-7xl font-black my-2 tracking-tighter">{result.bmi}</h2>
                <div className={`inline-block px-4 py-1 rounded-full text-white font-bold text-sm ${result.color}`}>
                  {result.category}
                </div>

                {/* Visual Gauge */}
                <div className="relative h-3 w-full bg-gray-200 rounded-full mt-8 mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.percent}%` }}
                    className={`absolute top-0 left-0 h-full rounded-full ${result.color} transition-all`}
                  />
                  <div className="absolute top-[-8px] left-[18.5%] h-5 w-0.5 bg-white z-10" />
                  <div className="absolute top-[-8px] left-[40%] h-5 w-0.5 bg-white z-10" />
                  <div className="absolute top-[-8px] left-[65%] h-5 w-0.5 bg-white z-10" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>Under</span>
                  <span>Healthy</span>
                  <span>Over</span>
                  <span>Obese</span>
                </div>
              </div>

              {/* Reference Table */}
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {categories.map((cat) => (
                  <div key={cat.label} className="bg-white border border-gray-100 p-3 rounded-2xl text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${cat.color}`} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{cat.label}</p>
                    <p className="text-xs font-black">{cat.range}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setWeight(""); setHeight(""); setResult(null); }}
                className="flex items-center gap-2 mx-auto text-sm font-bold text-gray-400 hover:text-black transition-colors py-2"
              >
                <RefreshCw className="h-4 w-4" /> Start New Calculation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </ToolCard>

      <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col md:flex-row gap-4 text-blue-800">
        <div className="bg-blue-100 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
          <Info className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <p className="font-bold">Important Information</p>
          <p className="text-sm leading-relaxed opacity-80">
            Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults. It is defined as the weight in kilograms divided by the square of the height in metres ($kg/m^2$).
          </p>
        </div>
      </div>
    </div>
  );
}