import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Library, BrainCircuit, Key, MessageCircle, Film, Briefcase, Building2, FlaskConical, Hourglass } from 'lucide-react';

const StudyInput = ({ onGenerate, loading, onCategoryChange, currentCategory, theme }) => {
    const [topic, setTopic] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('groq_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const categories = [
        { id: 'films', label: '🎬 Films', placeholder: 'e.g. The history of Pixar, Christopher Nolan movies...', color: 'text-red-600 bg-red-50 border-red-200' },
        { id: 'jobs', label: '💼 Jobs', placeholder: 'e.g. Software Engineer interview prep, Marketing basics...', color: 'text-blue-600 bg-blue-50 border-blue-200' },
        { id: 'companies', label: '🏢 Companies', placeholder: 'e.g. Google business model, Apple vs Microsoft...', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { id: 'science', label: '🧬 Science', placeholder: 'e.g. Quantum Physics, DNA replication...', color: 'text-purple-600 bg-purple-50 border-purple-200' },
        { id: 'history', label: '📜 History', placeholder: 'e.g. The Roman Empire, World War II...', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    ];

    const handleCategoryClick = (catId, placeholder) => {
        onCategoryChange(catId);
        // Optional: Pre-fill topic slightly or just change placeholder
        // setTopic((prev) => prev ? prev : ''); 
    };

    const getPlaceholder = () => {
        const active = categories.find(c => c.id === currentCategory);
        return active ? active.placeholder : "e.g. The Marvel Cinematic Universe, Software Engineering roles...";
    };

    const handleAction = (e, type) => {
        e.preventDefault();
        const cleanKey = apiKey.trim();
        if (cleanKey) {
            localStorage.setItem('groq_api_key', cleanKey);
            onGenerate(cleanKey, topic, type);
        } else {
            alert("Please enter your Groq API Key to continue! 🔑");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 transition-all duration-500">
            <div className="text-center mb-8">
                <div className={`bg-gradient-to-br ${theme.accent} p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg transform -rotate-6 transition-all duration-500`}>
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.accent} transition-all duration-500`}>Start Your Journey</h2>
                <p className="text-gray-500 mt-2 font-medium">Choose a category or enter your own topic</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.id, cat.placeholder)}
                        className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all transform hover:scale-105 active:scale-95 ${currentCategory === cat.id
                            ? `${cat.color} ring-2 ring-offset-2 ring-gray-200 scale-105 shadow-md`
                            : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <form className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-sm font-bold text-gray-700">
                            Groq API Key
                        </label>
                        <a
                            href="https://console.groq.com/keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                        >
                            Get Key 🔑
                        </a>
                    </div>
                    <div className="relative group">
                        <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:${theme.button.split(' ')[0]} transition-colors`} />
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="gsk_..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-opacity-50 focus:ring-4 focus:ring-opacity-20 transition-all outline-none bg-gray-50 focus:bg-white"
                            style={{ borderColor: 'transparent', '--tw-ring-color': theme.accent.split(' ')[1].replace('to-', '') }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Topic or Notes
                    </label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="w-full p-5 rounded-xl border-2 border-gray-100 focus:border-opacity-50 focus:ring-4 focus:ring-opacity-20 transition-all h-40 resize-none outline-none bg-gray-50 focus:bg-white text-lg"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        type="button"
                        onClick={(e) => handleAction(e, 'flashcards')}
                        disabled={loading || !topic.trim()}
                        className={`py-4 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${theme.accent} hover:shadow-xl`}
                    >
                        <Library className="w-6 h-6" />
                        <span>Flashcards</span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleAction(e, 'quiz')}
                        disabled={loading || !topic.trim()}
                        className={`py-4 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${theme.accent} hover:shadow-xl`}
                    >
                        <BrainCircuit className="w-6 h-6" />
                        <span>Take Quiz</span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleAction(e, 'mnemonics')}
                        disabled={loading || !topic.trim()}
                        className={`py-4 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${theme.accent} hover:shadow-xl`}
                    >
                        <Sparkles className="w-6 h-6" />
                        <span>Memory Hacks</span>
                    </button>
                </div>
            </form>
        </div>
    );
};
export default StudyInput;
