import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QuestionDetails from './QuestionDetails';

const DateSummary = ({ data }) => {
    const groupedData = data.reduce((acc, curr) => {
        const date = curr.timestamp ? new Date(curr.timestamp).toLocaleDateString() : 'Unknown Date';
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {});

    const [selectedDate, setSelectedDate] = useState(null);

    const handleViewClick = (date) => {
        setSelectedDate(date);
    };

    const getResult = (marks, totalQuestions) => {
        const maxMarks = totalQuestions * 10;
        const percentage = (marks / maxMarks) * 100;

        if (percentage < 50) return 'Bad';
        if (percentage >= 50 && percentage < 70) return 'Average';
        if (percentage >= 70 && percentage < 90) return 'Good';
        return 'Best';
    };

    return (
        <motion.div
            className="mt-8 bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 rounded-lg shadow-lg">
                    <thead className="bg-purple-400 text-white">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Questions Attempted</th>
                            <th className="px-6 py-3">Total Marks</th>
                            <th className="px-6 py-3">Result</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedData).map((date) => {
                            const questions = groupedData[date];
                            const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
                            const result = getResult(totalMarks, questions.length);

                            return (
                                <tr
                                    key={date}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                >
                                    <td className="px-6 py-4">{date}</td>
                                    <td className="px-6 py-4">{questions.length}</td>
                                    <td className="px-6 py-4">{totalMarks}</td>
                                    <td className="px-6 py-4">{result}</td>
                                    <td className="px-6 py-4">
                                        <motion.button
                                            className="bg-blue-400 text-white px-4 py-1.5 rounded-md"
                                            whileHover={{ scale: 1.1, opacity: 0.9 }}
                                            onClick={() => handleViewClick(date)}
                                        >
                                            View
                                        </motion.button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {selectedDate && (
                <QuestionDetails
                    date={selectedDate}
                    questions={groupedData[selectedDate]}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </motion.div>
    );
};

export default DateSummary;