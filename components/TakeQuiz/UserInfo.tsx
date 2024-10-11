'use client';

import { useState } from 'react';
import { Button } from "@material-tailwind/react";
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
        <>
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
                    <option value="1">Volonter</option>
                    <option value="2">Vozač</option>
                </select>
            </div>
            <div className="flex justify-between">
                <Button onClick={handleBack} variant='outline' size={'lg'}>Prethodno pitanje</Button>
                <Button onClick={handleSubmit} disabled={!userName && !role} variant='outline' size={'lg'}>Završi</Button>                
            </div>
        </>
    );
};

export default UserInfo;