'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { post } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import BigGrayButton from '@/components/Buttons/BigGrayButton';


const UserNamePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quizId = searchParams.get('quizId');
    const [userName, setUserName] = useState<string>('');
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await post('/quizzes/submit', {
                quizId,
                userName,
                role,
                // Include the answers here
            });

            if (response.status === 200) {
                router.push(`/results?quizId=${quizId}`);
            } else {
                console.error('Error submitting quiz:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="lg:max-w-screen-md w-screen mx-auto md:px-6 mt-6">
            <div className="flex justify-center px-3">
                <div className="w-full">
                    <div className="bg-white shadow-md rounded-lg px-3">
                        <form onSubmit={handleSubmit}>
                            <div className="py-3">
                                <p className="text-lg font-semibold">Tvoje ime</p>
                            </div>
                            <div className="mb-4">
                                <input
                                    id="userName"                                    
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="pb-3">
                                <p className="text-lg font-semibold">Ti si</p>
                            </div>
                            <div className="mb-4">
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="Vozač">Vozač</option>
                                    <option value="Volonter">Volonter</option>
                                </select>
                            </div>
                            <div className="block bg-white py-3 px-3 -mx-3 -mb-2 rounded-b-lg flex items-center justify-between">
                                <BigGrayButton onClick={handleBack}>
                                    Natrag na kviz
                                </BigGrayButton>

                                <button type="submit"
                                    className="border border-red-500 text-red-500 text-center rounded-md px-4 py-2 transition duration-500 ease select-none hover:text-white hover:bg-red-600 focus:outline-none focus:shadow-outline">
                                    Završi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserNamePage;