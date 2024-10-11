'use client';

import BigRedButton from '@/components/Buttons/BigRedButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";


const HomePage = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme);
    router.push(`/categories?theme=${theme}`);
  };

  return (
    <>
      <Typography type="h2">Odaberite temu kviza</Typography>      
      
      <div className="mt-3">
        <Button isFullWidth className="mt-3"  onClick={() => handleThemeSelection('100')} variant="outline" size={'lg'}>Prva pomoć</Button>
        <Button isFullWidth className="mt-3" onClick={() => handleThemeSelection('200')} variant="outline" size={'lg'}>Pokret Crvenog križa</Button>
      </div>
    </>
  );
};

export default HomePage;