import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, Brain } from 'lucide-react';

const MnemonicsMode = ({ items, onBack, theme }) => {
    if (!Array.isArray(items)) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 text-center">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm mx-auto"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                </button>
                <div className="bg-red-50 text-red-600 p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-2">Oops! Memory Lapse</h2>
                    <p>We couldn't generate mnemonics this time. Please try again with a different topic.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                </button>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold text-white uppercase tracking-wider bg-gradient-to-r ${theme.accent} shadow-md`}>
                    Memory Hacks
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg`}>
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.type}</span>
                                <h3 className="text-lg font-bold text-gray-800 leading-tight">{item.concept}</h3>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl ${theme.bg} border-2 border-dashed border-gray-200 mb-4 bg-opacity-50`}>
                            <p className={`text-xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r ${theme.accent}`}>
                                {item.mnemonic}
                            </p>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">How it works: </span>
                            {item.explanation}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MnemonicsMode;
