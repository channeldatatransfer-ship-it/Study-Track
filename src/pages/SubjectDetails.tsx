import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import AddChapterModal from '../components/AddChapterModal';
import AnimatedPage from '../components/AnimatedPage';
import ChapterItem from '../components/ChapterItem';

export default function SubjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subjects, deleteSubject } = useStudy();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

    const subject = subjects.find(s => s.id === id);

    if (!subject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Subject Not Found</h2>
                <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Go Back Home
                </Link>
            </div>
        );
    }

    const handleDeleteSubject = () => {
        if (confirm(`Are you sure you want to delete ${subject.name}? ALL progress will be lost.`)) {
            deleteSubject(subject.id);
            navigate('/');
        }
    };

    const toggleExpand = (chapId: string) => {
        setExpandedChapters(prev => ({ ...prev, [chapId]: !prev[chapId] }));
    };

    const totalChapters = subject.chapters.length;
    const completedChapters = subject.chapters.filter(c => c.isCompleted).length;

    // Calculate progress as average of all chapter progresses
    let totalProgressSum = 0;
    subject.chapters.forEach(chapter => {
        if (chapter.topics && chapter.topics.length > 0) {
            totalProgressSum += (chapter.topics.filter(t => t.isCompleted).length / chapter.topics.length) * 100;
        } else {
            totalProgressSum += chapter.isCompleted ? 100 : 0;
        }
    });

    const progress = totalChapters === 0 ? 0 : Math.round(totalProgressSum / totalChapters);

    return (
        <AnimatedPage className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 ${subject.color}`}>
                            <BookOpen className="w-3 h-3" />
                            {subject.name}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{subject.name}</h1>
                        <p className="text-slate-500 mt-2">
                            {completedChapters} of {totalChapters} chapters completed
                        </p>
                    </div>

                    <button
                        onClick={handleDeleteSubject}
                        className="self-start text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Subject"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold text-slate-800">{progress}%</span>
                        <span className="text-sm font-medium text-slate-400">Progress</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${subject.color}`}
                        />
                    </div>
                </div>
            </div>

            {/* Chapters Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Syllabus / Chapters</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddOpen(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Chapter
                    </motion.button>
                </div>

                <div className="divide-y divide-slate-50">
                    {subject.chapters.length > 0 ? (
                        subject.chapters.map((chapter) => (
                            <ChapterItem
                                key={chapter.id}
                                subjectId={subject.id}
                                chapter={chapter}
                                isExpanded={!!expandedChapters[chapter.id]}
                                onToggle={() => toggleExpand(chapter.id)}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <BookOpen className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-slate-500 mb-4">No chapters added yet.</p>
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Add your first chapter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isAddOpen && <AddChapterModal subjectId={subject.id} onClose={() => setIsAddOpen(false)} />}
        </AnimatedPage>
    );
}
