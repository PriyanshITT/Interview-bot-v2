import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const QuestionDetails = ({ date, questions, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
        >
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Details for {date}
                    </h2>
                    <motion.button
                        className="bg-blue-400 text-white px-4 py-1.5 rounded-md"
                        whileHover={{ scale: 1.1, opacity: 0.9 }}
                        onClick={onClose}
                    >
                        Close
                    </motion.button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 rounded-lg shadow-lg">
                        <thead className="bg-purple-400 text-white">
                            <tr>
                                <th className="px-6 py-3">Question</th>
                                <th className="px-6 py-3">Answer</th>
                                <th className="px-6 py-3">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                >
                                    <td className="px-6 py-4">{q.question}</td>
                                    <td className="px-6 py-4">{q.answer}</td>
                                    <td className="px-6 py-4">{q.marks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default QuestionDetails;