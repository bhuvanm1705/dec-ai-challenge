import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowLeft, RotateCcw, Award, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

const HighlightedText = ({ text, highlightRange }) => {
    if (!highlightRange) return <>{text}</>;

    const { charIndex, charLength } = highlightRange;
    const before = text.slice(0, charIndex);
    const match = text.slice(charIndex, charIndex + charLength);
    const after = text.slice(charIndex + charLength);

    return (
        <span>
            {before}
            <span className="bg-yellow-200 text-blue-900 rounded px-0.5 transition-colors duration-100 dark:bg-yellow-500/30">
                {match}
            </span>
            {after}
        </span>
    );
};

const QuizMode = ({ questions, onBack, theme }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [highlightRange, setHighlightRange] = useState(null);
    const [showTrivia, setShowTrivia] = useState(false);

    const currentUtteranceRef = useRef(null);

    const currentQuestion = questions[currentIndex];

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setHighlightRange(null);
        currentUtteranceRef.current = null;
    }, []);

    const speak = useCallback((text) => {
        if (!soundEnabled) return;
        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        currentUtteranceRef.current = utterance;

        utterance.onboundary = (event) => {
            if (currentUtteranceRef.current !== utterance) return;
            if (event.name === 'word') {
                setHighlightRange({
                    charIndex: event.charIndex,
                    charLength: event.charLength
                });
            }
        };

        utterance.onend = () => {
            if (currentUtteranceRef.current === utterance) {
                setHighlightRange(null);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [soundEnabled, stopSpeaking]);

    // Read question automatically on load
    useEffect(() => {
        if (!quizCompleted && !showResult) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                speak(currentQuestion.question);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, quizCompleted, showResult, speak, currentQuestion]);

    // Read trivia when result is shown
    useEffect(() => {
        if (showResult && currentQuestion.trivia) {
            const timer = setTimeout(() => {
                speak(currentQuestion.trivia);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showResult, speak, currentQuestion]);

    useEffect(() => {
        return () => stopSpeaking();
    }, [stopSpeaking]);


    const handleOptionClick = (index) => {
        if (selectedOption !== null) return;

        stopSpeaking(); // Stop reading question
        setSelectedOption(index);

        const isCorrect = index === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        }

        setTimeout(() => {
            setShowResult(true);
            setShowTrivia(true);
        }, 500);
    };

    const handleNext = () => {
        stopSpeaking();
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
            setShowTrivia(false);
        } else {
            setQuizCompleted(true);
            if (score === questions.length) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const replayAudio = (e) => {
        e.stopPropagation();
        if (showResult && currentQuestion.trivia) {
            speak(currentQuestion.trivia);
        } else {
            speak(currentQuestion.question);
        }
    };

    if (quizCompleted) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl text-center border border-white/50">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${theme.accent} shadow-lg`}>
                    <Award className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">Quiz Completed!</h2>
                <p className="text-xl text-gray-600 mb-8 font-medium">
                    You scored <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.accent} font-black text-3xl`}>{score}</span> out of <span className="font-bold">{questions.length}</span>
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className={`text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.accent}`}
                    >
                        <RotateCcw className="w-4 h-4" /> Try Another Topic
                    </button>
                    {/* Add Retry Same Quiz Button if needed later */}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Exit Quiz
                </button>

                <button
                    onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        if (soundEnabled) stopSpeaking();
                    }}
                    className={`flex items-center px-4 py-2 rounded-full transition-colors font-medium border ${soundEnabled ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                >
                    {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                    {soundEnabled ? 'Sound On' : 'Sound Off'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Question Section */}
                <div className="w-full md:w-2/3 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Question {currentIndex + 1} / {questions.length}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${theme.accent}`}>
                            Score: {score}
                        </div>
                    </div>

                    <div className="relative">
                        <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
                            <HighlightedText text={currentQuestion.question} highlightRange={!showResult ? highlightRange : null} />
                        </h3>
                        <button
                            onClick={replayAudio}
                            className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Replay Audio"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            let stateStyle = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                            if (selectedOption !== null) {
                                if (index === currentQuestion.correctAnswer) {
                                    stateStyle = "border-green-500 bg-green-50 ring-2 ring-green-200";
                                } else if (index === selectedOption) {
                                    stateStyle = "border-red-500 bg-red-50 ring-2 ring-red-200";
                                } else {
                                    stateStyle = "border-gray-100 opacity-50";
                                }
                            }

                            return (
                                <motion.button
                                    key={index}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOptionClick(index)}
                                    disabled={selectedOption !== null}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between group ${stateStyle}`}
                                >
                                    <span className="font-medium text-gray-700 text-lg">{option}</span>
                                    {selectedOption !== null && index === currentQuestion.correctAnswer && (
                                        <div className="bg-green-100 p-1 rounded-full">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                    )}
                                    {selectedOption === index && index !== currentQuestion.correctAnswer && (
                                        <div className="bg-red-100 p-1 rounded-full">
                                            <X className="w-5 h-5 text-red-600" />
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Next Button Footer */}
                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 flex justify-end"
                        >
                            <button
                                onClick={handleNext}
                                className={`text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 bg-gradient-to-r ${theme.accent}`}
                            >
                                Next Question <ArrowLeft className="w-5 h-5 rotate-180" />
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Trivia Side Panel (Quiz Version) */}
                <AnimatePresence>
                    {showResult && currentQuestion.trivia && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            className="w-full md:w-1/3 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col overflow-hidden"
                        >
                            <div className="flex items-center gap-2 mb-4 text-amber-500">
                                <Lightbulb className="w-6 h-6 fill-amber-500" />
                                <span className="font-bold text-lg uppercase tracking-wider">Trivia Time!</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-4">
                                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                    <HighlightedText text={currentQuestion.trivia} highlightRange={showResult ? highlightRange : null} />
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => speak(currentQuestion.trivia)}
                                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Replay Trivia
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuizMode;
