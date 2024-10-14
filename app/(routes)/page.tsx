'use client';

import { useRouter } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';

function HomePage() {
    const router = useRouter();

    const handleThemeSelection = (theme: string) => {
        router.push(`/categories?theme=${theme}`);
    };

    return (
        <>
            <Typography variant="h1" gutterBottom>Odaberite temu kviza</Typography>
            <Stack spacing={1}>
                {/* <Button
                    onClick={() => handleThemeSelection('100')} 
                    variant="outlined">
                        Prva pomoć
                </Button> */}
                <Button onClick={() => handleThemeSelection('200')} variant="outlined">Pokret Crvenog križa</Button>
            </Stack>
        </>
    );
}

export default HomePage;