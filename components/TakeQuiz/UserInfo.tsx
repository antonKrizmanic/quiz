'use client';

import { useState } from 'react';
import BigGrayButton from '@/components/Buttons/BigGrayButton';
import BigRedButton from '../Buttons/BigRedButton';

interface UserInfoProps {
    onSubmit: (name, role) => void;
    onBack: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ onSubmit, onBack }) => {
    const [userName, setUserName] = useState<string>('');
    const [role, setRole] = useState<string | null>(null);

    const handleSubmit = async () => {
        onSubmit(userName, role);
    };

    const handleBack = () => {
        onBack();
    }

    return (
        <div>
            <div className="py-3">
                <p className="text-lg font-semibold">Tvoje ime</p>
            </div>
            <div className="mb-4">
                <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border border-gray-300 p-2 rounded block w-full"
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
                    className="border border-gray-300 p-2 rounded block w-full"
                    required
                >
                    <option value="Vozač">Vozač</option>
                    <option value="Volonter">Volonter</option>
                </select>
            </div>
            <div className="block bg-white py-3 px-3 -mx-3 -mb-2 rounded-b-lg flex items-center justify-between">
                <BigGrayButton onClick={handleBack}>
                    Prethodno pitanje
                </BigGrayButton>
                <BigRedButton disabled={!userName && !role} onClick={handleSubmit}>Završi</BigRedButton>
            </div>
        </div>
    );
};

export default UserInfo;