import React, { useRef } from 'react';
import { ArrowLeft, Users, Star, UserCircle2, Code2, Rocket, BrainCircuit } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutPage = ({ onBack, theme }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    const team = [
        {
            name: "M BHUVAN",
            role: "Team Lead & Lead Developer",
            icon: <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />,
            gradient: "from-yellow-400 to-orange-500",
            desc: "Architected the core application and integrated the AI engine."
        },
        {
            name: "K VENKAT",
            role: "Frontend Developer",
            icon: <Code2 className="w-8 h-8 text-blue-400" />,
            gradient: "from-blue-400 to-cyan-500",
            desc: "Crafted the responsive UI and smooth animations."
        },
        {
            name: "MD ASHRAF",
            role: "Backend Specialist",
            icon: <Rocket className="w-8 h-8 text-purple-400" />,
            gradient: "from-purple-400 to-pink-500",
            desc: "Optimized data handling and API performance."
        },
        {
            name: "SYED ASIF",
            role: "UI/UX Designer",
            icon: <BrainCircuit className="w-8 h-8 text-green-400" />,
            gradient: "from-green-400 to-emerald-500",
            desc: "Designed the user experience and visual themes."
        }
    ];

    return (
        <div className="w-full h-[85vh] max-w-5xl mx-auto relative overflow-hidden bg-white/10 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/20">
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-center bg-gradient-to-b from-black/10 to-transparent">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-800 hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg font-bold group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            {/* Scrollable Content */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth"
            >
                {/* Hero Section */}
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 pt-32 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${theme.accent} rounded-3xl rotate-3 shadow-2xl flex items-center justify-center`}>
                            <Users className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-slate-700 to-gray-900 mb-6 drop-shadow-sm">
                            The Team
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
                            Four minds, one mission. Building the future of learning with AI.
                        </p>
                    </motion.div>
                </div>

                {/* Team Grid */}
                <div className="min-h-screen p-8 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
                                <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${member.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {member.icon}
                                        </div>
                                        {index === 0 && (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-full border border-yellow-200">
                                                Team Lead
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-800 mb-1 tracking-tight">{member.name}</h3>
                                    <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${member.gradient} mb-4`}>
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {member.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pb-12 text-gray-500 font-medium">
                    <p>&copy; 2024 MindFlow AI. Built with ❤️ by the team.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
