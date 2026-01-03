import React, { useState } from 'react';
import StudyInput from './components/StudyInput';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import MnemonicsMode from './components/MnemonicsMode';
import AboutPage from './components/AboutPage';
import { generateContent } from './services/groq';
import { BrainCircuit, Info } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('input'); // 'input', 'flashcards', 'quiz', 'mnemonics', 'about'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('general');

  const themes = {
    general: {
      bg: 'bg-slate-50',
      bgImage: null,
      blob: 'bg-purple-200',
      blob2: 'bg-yellow-200',
      blob3: 'bg-pink-200',
      accent: 'from-blue-600 to-purple-600',
      cardBack: 'from-blue-600 to-indigo-600',
      button: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    films: {
      bg: 'bg-stone-900',
      bgImage: '/films.png',
      blob: 'bg-red-500',
      blob2: 'bg-amber-500',
      blob3: 'bg-orange-500',
      accent: 'from-red-600 to-amber-500',
      cardBack: 'from-red-700 to-stone-800',
      button: 'text-red-500 bg-stone-800 border-red-900'
    },
    jobs: {
      bg: 'bg-slate-50',
      bgImage: '/jobs.png',
      blob: 'bg-blue-200',
      blob2: 'bg-cyan-200',
      blob3: 'bg-indigo-200',
      accent: 'from-blue-600 to-cyan-500',
      cardBack: 'from-blue-700 to-slate-800',
      button: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    companies: {
      bg: 'bg-gray-50',
      bgImage: '/companies.png',
      blob: 'bg-emerald-200',
      blob2: 'bg-teal-200',
      blob3: 'bg-gray-300',
      accent: 'from-emerald-600 to-teal-600',
      cardBack: 'from-emerald-700 to-gray-800',
      button: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    science: {
      bg: 'bg-black',
      bgImage: '/science.png',
      blob: 'bg-violet-600',
      blob2: 'bg-fuchsia-600',
      blob3: 'bg-cyan-600',
      accent: 'from-violet-500 to-cyan-400',
      cardBack: 'from-violet-900 to-black',
      button: 'text-cyan-400 bg-gray-900 border-cyan-900'
    },
    history: {
      bg: 'bg-amber-50',
      bgImage: '/history.png',
      blob: 'bg-amber-200',
      blob2: 'bg-orange-200',
      blob3: 'bg-yellow-200',
      accent: 'from-amber-700 to-orange-600',
      cardBack: 'from-amber-800 to-stone-800',
      button: 'text-amber-700 bg-amber-100/50 border-amber-200'
    }
  };

  const currentTheme = themes[category] || themes.general;

  const handleGenerate = async (apiKey, userTopic, type) => {
    setLoading(true);
    setError('');

    try {
      const result = await generateContent(apiKey, type, userTopic);
      if (result && result.length > 0) {
        setData(result);
        setCurrentView(type);
      } else {
        setError('Failed to generate study materials. Please try a different topic.');
      }
    } catch (err) {
      console.error("App Error:", err);
      // Show the actual error message if available, otherwise default
      setError(err.message || 'An error occurred. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} text-gray-800 font-sans relative overflow-hidden selection:bg-blue-200 transition-colors duration-500 bg-cover bg-center bg-no-repeat bg-fixed`}
      style={{ backgroundImage: currentTheme.bgImage ? `url(${currentTheme.bgImage})` : 'none' }}
    >
      {/* Overlay for readability if image is present */}
      {currentTheme.bgImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>}

      {/* Animated Background Blobs - Hide if image is present to reduce noise, or keep with lower opacity? Let's hide them if image exists for cleaner look, or keep them behind overlay. Let's keep them but lower z-index. The overlay is z-0. Blobs are -z-10. So Blobs are behind overlay. */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${currentTheme.blob} rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob transition-colors duration-500`}></div>
        <div className={`absolute top-0 right-1/4 w-96 h-96 ${currentTheme.blob2} rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 transition-colors duration-500`}></div>
        <div className={`absolute -bottom-8 left-1/3 w-96 h-96 ${currentTheme.blob3} rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 transition-colors duration-500`}></div>
      </div>

      <nav className="p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${currentTheme.accent}`}>
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.accent}`}>
            MindFlow
          </span>
        </div>
        <button
          onClick={() => setCurrentView('about')}
          className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-500 hover:text-blue-600"
          title="About Team"
        >
          <Info className="w-6 h-6" />
        </button>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {currentView === 'input' && (
          <StudyInput
            onGenerate={handleGenerate}
            loading={loading}
            onCategoryChange={setCategory}
            currentCategory={category}
            theme={currentTheme}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardMode
            cards={data}
            onBack={() => setCurrentView('input')}
            theme={currentTheme}
          />
        )}

        {currentView === 'quiz' && (
          <QuizMode
            questions={data}
            onBack={() => setCurrentView('input')}
            theme={currentTheme}
          />
        )}

        {currentView === 'mnemonics' && (
          <MnemonicsMode
            items={data}
            onBack={() => setCurrentView('input')}
            theme={currentTheme}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onBack={() => setCurrentView('input')}
            theme={currentTheme}
          />
        )}
      </main>
    </div>
  );
}

export default App;
