"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightLeft, Ruler, Scale, Thermometer, 
  Copy, Check, Hash, Info 
} from "lucide-react";
import { ToolHeader, ToolCard } from "@/app/components/ui/ToolPageElements";

type UnitType = "length" | "weight" | "temperature";

export function UnitConverter() {
  const [activeTab, setActiveTab] = useState<UnitType>("length");
  
  const [inputValue, setInputValue] = useState<string>("5");
  const [inputInches, setInputInches] = useState<string>("4"); 
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>("ft");
  const [toUnit, setToUnit] = useState<string>("cm");
  const [copied, setCopied] = useState(false);

  // Configuration for all units
  const unitConfig: any = {
    length: {
      units: ["ft", "cm", "in", "m", "mi", "km"],
      factors: { ft: 30.48, cm: 1, in: 2.54, m: 100, mi: 160934.4, km: 100000 }
    },
    weight: {
      units: ["kg", "lb", "g", "oz", "st"],
      factors: { kg: 1, lb: 0.453592, g: 0.001, oz: 0.0283495, st: 6.35029 }
    },
    temperature: {
      units: ["c", "f", "k"]
    }
  };

  useEffect(() => { convert(); }, [inputValue, inputInches, fromUnit, toUnit, activeTab]);

  // Reset units when switching tabs
  const handleTabChange = (tab: UnitType) => {
    setActiveTab(tab);
    setFromUnit(unitConfig[tab].units[0]);
    setToUnit(unitConfig[tab].units[1]);
    setInputValue("1");
    setInputInches("0");
  };

  const convert = () => {
    let val = parseFloat(inputValue) || 0;

    // 1. Handle Input Normalization
    if (activeTab === "length" && fromUnit === "ft") {
      const inches = parseFloat(inputInches) || 0;
      val = val + (inches / 12); 
    }

    if (isNaN(val)) return setOutputValue("0");

    // 2. Conversion Logic
    if (activeTab === "temperature") {
      let celsius = val;
      // Convert to Celsius first
      if (fromUnit === "f") celsius = (val - 32) * 5 / 9;
      if (fromUnit === "k") celsius = val - 273.15;
      
      let result = celsius;
      // Convert from Celsius to Target
      if (toUnit === "f") result = (celsius * 9 / 5) + 32;
      if (toUnit === "k") result = celsius + 273.15;
      
      setOutputValue(result.toFixed(2));
    } else {
      const fromFactor = unitConfig[activeTab].factors[fromUnit];
      const toFactor = unitConfig[activeTab].factors[toUnit];
      const result = (val * fromFactor) / toFactor;
      
      setOutputValue(
        result < 0.01 
          ? result.toExponential(4) 
          : result.toLocaleString(undefined, { maximumFractionDigits: 4 })
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <ToolHeader 
        title="Measurement Studio" 
        description="Convert Length, Weight, and Temperature with high precision."
        icon={ArrowRightLeft}
      />

      {/* Tab Navigation */}
      <div className="flex p-1.5 bg-gray-200/50 backdrop-blur-md rounded-3xl mb-8 max-w-md mx-auto">
        {[
          { id: "length", icon: Ruler },
          { id: "weight", icon: Scale },
          { id: "temperature", icon: Thermometer }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as UnitType)}
            className={`flex-1 py-3 rounded-2xl font-bold capitalize transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id ? "bg-black text-white shadow-xl" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.id}</span>
          </button>
        ))}
      </div>

      <ToolCard className="p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col md:flex-row">
          
          {/* Input Section */}
          <div className="flex-1 p-8 md:p-12 space-y-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Hash className="h-3 w-3" /> FROM: {fromUnit.toUpperCase()}
            </label>
            
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-transparent text-5xl md:text-7xl font-black outline-none"
                placeholder="0"
              />
              {activeTab === "length" && fromUnit === "ft" && (
                <>
                  <span className="text-4xl font-black text-gray-300">'</span>
                  <input 
                    type="number" 
                    value={inputInches}
                    onChange={(e) => setInputInches(e.target.value)}
                    className="w-full bg-transparent text-5xl md:text-7xl font-black outline-none text-orange-500"
                    placeholder="0"
                  />
                  <span className="text-4xl font-black text-gray-300">"</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {unitConfig[activeTab].units.map((u: string) => (
                <button
                  key={u}
                  onClick={() => setFromUnit(u)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${fromUnit === u ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-transparent"}`}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center bg-gray-50 md:bg-transparent py-4">
            <button 
              onClick={() => { const temp = fromUnit; setFromUnit(toUnit); setToUnit(temp); }} 
              className="p-4 rounded-full bg-white shadow-lg hover:rotate-180 transition-all duration-500 active:scale-90"
            >
              <ArrowRightLeft className="h-6 w-6" />
            </button>
          </div>

          {/* Output Section */}
          <div className="flex-1 p-8 md:p-12 bg-gray-50/50 space-y-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">TO: {toUnit.toUpperCase()}</label>
            <div className="text-5xl md:text-7xl font-black text-black break-all">
              {outputValue}
              <span className="text-xl ml-2 text-gray-400 uppercase font-bold">{toUnit}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {unitConfig[activeTab].units.map((u: string) => (
                <button
                  key={u}
                  onClick={() => setToUnit(u)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${toUnit === u ? "bg-black text-white border-black" : "bg-white text-gray-300 border-gray-100"}`}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info & Copy Bar */}
        <div className="bg-black p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-xs font-bold px-4 flex items-center gap-2">
            <Info className="h-3 w-3" />
            {activeTab === 'length' && fromUnit === 'ft' 
              ? `Formatting ${inputValue}'${inputInches}" into ${toUnit.toUpperCase()}` 
              : `Converting ${fromUnit.toUpperCase()} to ${toUnit.toUpperCase()}`}
          </div>
          <button 
            onClick={() => { 
              navigator.clipboard.writeText(outputValue); 
              setCopied(true); 
              setTimeout(() => setCopied(false), 2000); 
            }}
            className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "COPIED!" : "COPY RESULT"}
          </button>
        </div>
      </ToolCard>
    </div>
  );
}