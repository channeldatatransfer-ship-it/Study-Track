import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string; // e.g., "text-amber-500"
    bgClass: string; // e.g., "bg-amber-50"
    delay?: number;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    colorClass,
    bgClass,
    delay = 0
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring' }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <h3 className="text-slate-400 font-medium text-sm flex items-center gap-1.5 mb-2">
                    <Icon className={`w-4 h-4 ${colorClass}`} /> {title}
                </h3>
                <div className="text-3xl font-bold text-slate-800">{value}</div>
            </div>
            <div className={`w-12 h-12 ${bgClass} rounded-full flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </motion.div>
    );
}
