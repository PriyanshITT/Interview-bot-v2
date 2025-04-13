import React, { useState, useEffect } from 'react';
import { makeAuthenticatedRequest } from '../../services/auth.service';
import DateSummary from './DateSummary';

const DataFetcher = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const id = JSON.parse(localStorage.getItem('user')).id;
            try {
                const response = await makeAuthenticatedRequest(`/api/question-answers/get-sorted/${id}`);
                setData(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center gap-y-4 min-h-[50vh] bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
                <p className="text-lg font-semibold text-white">Loading leaderboard...</p>
            </div>
        );
    if (error)
        return (
            <div className="text-center text-white font-semibold min-h-[50vh] bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
                <p>Error: {error}</p>
            </div>
        );

    return <DateSummary data={data} />;
};

export default DataFetcher;