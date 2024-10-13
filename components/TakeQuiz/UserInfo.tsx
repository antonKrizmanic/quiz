'use client';

import { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


interface UserInfoProps {
    onSubmit: (name, role) => void;
    onBack: () => void;
}

function UserInfo({ onSubmit, onBack }:UserInfoProps) {
    const [userName, setUserName] = useState<string>('');
    const [role, setRole] = useState<string | null>(null);

    const handleSubmit = async () => {
        onSubmit(userName, role);
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <>
            <InputLabel htmlFor="userName">
                Tvoje ime
            </InputLabel>
            <TextField id="userName"
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                sx={{ marginBottom: 3 }}/>
            <InputLabel htmlFor="user-role">
                Ti si
            </InputLabel>
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <Select
                    id="user-role"
                    value={role}
                    displayEmpty
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem key={1} value={1}>
                        Volonter
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                        Vozač
                    </MenuItem>
                </Select>
            </FormControl>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button onClick={handleBack} variant="outlined">Prethodno pitanje</Button>
                <Button onClick={handleSubmit}
                    disabled={!userName && !role}
                    variant="outlined">Završi</Button>
            </Box>
        </>
    );
}

export default UserInfo;