'use client';

import BigRedButton from '@/components/Buttons/BigRedButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HomePage = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme);
    router.push(`/categories?theme=${theme}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Odaberite temu kviza</h2>
      <div className="flex flex-col space-y-4">
        <BigRedButton          
          onClick={() => handleThemeSelection('100')}
        >
          Prva pomoć
        </BigRedButton>
        <BigRedButton
          className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-300"
          onClick={() => handleThemeSelection('200')}
        >
          Pokret Crvenog križa
        </BigRedButton>
      </div>
    </div>
  );
};

export default HomePage;