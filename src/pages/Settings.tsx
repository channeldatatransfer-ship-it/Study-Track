import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Save, UserCircle, Trash2, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

export default function Settings() {
    const { userProfile, updateProfile, resetData, exportData, importData } = useStudy();
    const [name, setName] = useState(userProfile.name);
    const [grade, setGrade] = useState(userProfile.grade);

    const handleSave = () => {
        updateProfile({ name, grade });
        alert('Profile updated successfully!'); // Simple feedback
    };

    return (
        <AnimatedPage className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <UserCircle className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-800">My Profile Settings</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade</label>
                    <input
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="e.g. HSC 2026"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Save className="w-5 h-5" />
                        Save Profile
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4"
            >
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Download className="w-5 h-5 text-slate-500" />
                    Data Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={exportData}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export Backup
                    </button>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Import Backup
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const result = event.target?.result as string;
                                        if (importData(result)) {
                                            alert('Data imported successfully!');
                                            // Ideally reload or force update, but context state update should trigger re-render
                                        }
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                        />
                    </label>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 rounded-2xl border border-red-100 p-6 mt-8"
            >
                <h3 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                </h3>
                <p className="text-red-600/80 text-sm mb-4">
                    This will permanently delete all your subjects, chapters, and progress data. This action cannot be undone.
                </p>
                <button
                    onClick={() => {
                        if (confirm('Are you absolutely sure? This cannot be undone.')) {
                            resetData();
                        }
                    }}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors text-sm"
                >
                    Reset All Data
                </button>
            </motion.div>
        </AnimatedPage>
    );
}
