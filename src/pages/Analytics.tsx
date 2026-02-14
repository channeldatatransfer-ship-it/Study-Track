import { useStudy } from '../context/StudyContext';
import { BarChart3, TrendingUp, BookOpen, Award, Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import StatCard from '../components/StatCard';
import { calculateOverallStats, calculateActivityData, calculateStreak } from '../lib/calculateAnalytics';

export default function Analytics() {
    const { subjects } = useStudy();

    const { totalChapters, completedChapters, totalTopics, completedTopics } = calculateOverallStats(subjects);
    const { activityData, maxCount } = calculateActivityData(subjects);
    const calcStreak = calculateStreak(subjects);

    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };



    return (
        <AnimatedPage className="max-w-4xl mx-auto pb-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Study Analytics
            </h1>

            {/* Overview Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="sm:col-span-1">
                    <StatCard
                        title="Total Streak"
                        value={`${calcStreak} days`}
                        icon={Award}
                        colorClass="text-orange-500"
                        bgClass="bg-orange-50"
                        delay={0.1}
                    />
                </div>
                <div className="sm:col-span-1">
                    <StatCard
                        title="Topics Done"
                        value={`${completedTopics} / ${totalTopics}`}
                        icon={BookOpen}
                        colorClass="text-blue-500"
                        bgClass="bg-blue-50"
                        delay={0.2}
                    />
                </div>
                <div className="sm:col-span-1">
                    <StatCard
                        title="Chapters Done"
                        value={`${completedChapters} / ${totalChapters}`}
                        icon={Trophy}
                        colorClass="text-amber-500"
                        bgClass="bg-amber-50"
                        delay={0.3}
                    />
                </div>
                <div className="sm:col-span-1">
                    <StatCard
                        title="Completion"
                        value={`${completionPercentage}%`}
                        icon={CheckCircle2}
                        colorClass="text-emerald-500"
                        bgClass="bg-emerald-50"
                        delay={0.4}
                    />
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                        Last 7 Days Activity
                    </h2>
                    <div className="flex items-end justify-between gap-2 h-48">
                        {activityData.map((data, index) => (
                            <div key={data.date} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(data.count / maxCount) * 100}%` }}
                                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                                        className="w-full bg-blue-500 rounded-t-lg transition-colors duration-300 group-hover:bg-blue-600 relative"
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {data.count} Topics
                                        </div>
                                    </motion.div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                    {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Subject Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        Subject Progress
                    </h2>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {subjects.map(sub => {
                            const sTotal = sub.chapters.reduce((acc, c) => acc + (c.topics?.length || 0), 0);
                            const sDone = sub.chapters.reduce((acc, c) => acc + (c.topics?.filter(t => t.isCompleted).length || 0), 0);
                            const sProg = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0;

                            return (
                                <div key={sub.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                                        <span className="text-xs text-slate-400">{sProg}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sProg}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full ${sub.color}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {subjects.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-8">
                                No subjects added.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
}
