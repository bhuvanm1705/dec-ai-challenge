import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Volume2, VolumeX, Shuffle, RotateCcw, Lightbulb, X } from 'lucide-react';

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

const FlashcardMode = ({ cards, onBack, theme }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [deck, setDeck] = useState(cards);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [highlightRange, setHighlightRange] = useState(null);
    const [showTrivia, setShowTrivia] = useState(false);

    // Ref to track current utterance to prevent zombie callbacks
    const currentUtteranceRef = useRef(null);

    useEffect(() => {
        setDeck(cards);
        setCurrentIndex(0);
        setShowTrivia(false); // Reset trivia on new deck
    }, [cards]);

    const currentCard = deck[currentIndex];

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setHighlightRange(null);
        currentUtteranceRef.current = null;
    }, []);

    const speak = useCallback((text) => {
        if (!soundEnabled) return;

        // Stop any current speech immediately
        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8; // Slower speech rate for better clarity
        currentUtteranceRef.current = utterance; // Track this utterance

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

    // Auto-speak effect for Main Card
    useEffect(() => {
        if (showTrivia) return; // Don't auto-speak card if trivia is open

        const textToSpeak = isFlipped ? currentCard.back : currentCard.front;
        // Small timeout to allow the flip animation to start before speaking
        const timer = setTimeout(() => {
            speak(textToSpeak);
        }, 300);

        return () => {
            clearTimeout(timer);
            stopSpeaking();
        };
    }, [currentIndex, isFlipped, speak, stopSpeaking, currentCard, showTrivia]);

    // Auto-speak effect for Trivia
    useEffect(() => {
        if (showTrivia && currentCard.trivia) {
            // Small delay for panel to slide in
            const timer = setTimeout(() => {
                speak(currentCard.trivia);
            }, 500);
            return () => {
                clearTimeout(timer);
                stopSpeaking();
            };
        }
    }, [showTrivia, speak, stopSpeaking, currentCard]);


    // Cleanup on unmount
    useEffect(() => {
        return () => stopSpeaking();
    }, [stopSpeaking]);


    const handleFlip = () => {
        if (showTrivia) setShowTrivia(false); // Close trivia on flip
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        stopSpeaking();
        setIsFlipped(false);
        setShowTrivia(false);
        setTimeout(() => setCurrentIndex((prev) => (prev + 1) % deck.length), 150);
    };

    const handlePrev = () => {
        stopSpeaking();
        setIsFlipped(false);
        setShowTrivia(false);
        setTimeout(() => setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length), 150);
    };

    const handleShuffle = () => {
        stopSpeaking();
        setShowTrivia(false);
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const replayAudio = (e, textOverride) => {
        e.stopPropagation();
        const text = textOverride || (isFlipped ? currentCard.back : currentCard.front);
        speak(text);
    };

    const handleTriviaToggle = (e) => {
        e.stopPropagation();
        setShowTrivia(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center relative min-h-[500px] md:min-h-[600px]">
            {/* Top Controls */}
            <div className="w-full flex justify-between items-center mb-8 relative z-20">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <div className="flex gap-2">
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

                    <button
                        onClick={handleShuffle}
                        className={`flex items-center px-4 py-2 rounded-full transition-colors font-medium border ${theme.button}`}
                    >
                        <Shuffle className="w-4 h-4 mr-2" />
                        Shuffle
                    </button>
                </div>
            </div>

            <div className="flex w-full justify-center gap-8 relative">
                {/* 3D Card Container */}
                <div className={`relative w-full max-w-xl aspect-[3/2] cursor-pointer perspective-1000 group z-10 transition-all duration-500 ${showTrivia ? '-translate-x-16 lg:-translate-x-32' : 'translate-x-0'}`}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full relative preserve-3d"
                            style={{ rotateX, rotateY, rotateZ: 0 }}
                            onClick={handleFlip}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                x.set(e.clientX - rect.left - rect.width / 2);
                                y.set(e.clientY - rect.top - rect.height / 2);
                            }}
                            onMouseLeave={() => {
                                x.set(0);
                                y.set(0);
                            }}
                        >
                            <motion.div
                                className="w-full h-full relative preserve-3d transition-all duration-700 ease-out-back"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                            >
                                {/* Front Face */}
                                <div className="absolute inset-0 backface-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <button
                                            onClick={(e) => replayAudio(e)}
                                            className="p-2 rounded-full hover:bg-gray-100/50 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Replay Audio"
                                        >
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${theme.button.split(' ')[0]}`}>Question</span>
                                    <p className="text-3xl font-bold text-slate-800 leading-tight">
                                        <HighlightedText text={currentCard.front} highlightRange={!isFlipped && !showTrivia ? highlightRange : null} />
                                    </p>
                                    <div className="absolute bottom-6 flex items-center text-slate-400 text-sm font-medium gap-2">
                                        <span>Tap to flip</span>
                                    </div>
                                </div>

                                {/* Back Face */}
                                <div
                                    className={`absolute inset-0 backface-hidden bg-gradient-to-br ${theme.cardBack} rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center justify-between p-6 text-center rotate-y-180 overflow-hidden`}
                                >

                                    <div className="absolute top-6 right-6 flex gap-2 z-10">
                                        <button
                                            onClick={(e) => replayAudio(e)}
                                            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
                                            title="Replay Audio"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="z-10 mt-6">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Answer</span>
                                    </div>

                                    <div className="z-10 flex-1 flex flex-col items-center justify-center gap-4">
                                        <p className="text-2xl font-bold text-white leading-relaxed drop-shadow-md px-4">
                                            <HighlightedText text={currentCard.back} highlightRange={isFlipped && !showTrivia ? highlightRange : null} />
                                        </p>
                                    </div>

                                    {/* Trivia Button */}
                                    <div className="z-10 mb-2">
                                        {currentCard.trivia && (
                                            <button
                                                onClick={handleTriviaToggle}
                                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-full transition-all border border-white/30 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
                                            >
                                                <Lightbulb className="w-4 h-4 text-yellow-300" />
                                                Want Trivia?
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Trivia Side Panel */}
                <AnimatePresence>
                    {showTrivia && currentCard.trivia && (
                        <motion.div
                            initial={{ opacity: 0, x: 50, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 320 }}
                            exit={{ opacity: 0, x: 20, width: 0 }}
                            className="bg-white/90 backdrop-blur-xl h-[400px] rounded-3xl shadow-2xl border border-white/50 p-6 flex flex-col relative overflow-hidden self-center"
                        >
                            <button
                                onClick={() => { setShowTrivia(false); stopSpeaking(); }}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mb-4 text-amber-500">
                                <Lightbulb className="w-6 h-6 fill-amber-500" />
                                <span className="font-bold text-lg uppercase tracking-wider">Did you know?</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    <HighlightedText text={currentCard.trivia} highlightRange={showTrivia ? highlightRange : null} />
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => replayAudio({ stopPropagation: () => { } }, currentCard.trivia)}
                                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Replay
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-8 mt-12 bg-white/40 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm border border-white/40 transition-transform">
                <button
                    onClick={handlePrev}
                    className="p-4 rounded-xl hover:bg-white/80 text-slate-600 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-700 font-mono">
                        {currentIndex + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        of {deck.length}
                    </span>
                </div>

                <button
                    onClick={handleNext}
                    className="p-4 rounded-xl hover:bg-white/80 text-slate-600 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FlashcardMode;
