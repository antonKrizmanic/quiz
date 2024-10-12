'use client';

import { Box, Button, FormControl, InputLabel, MenuItem, NativeSelect, Select, TextField } from '@mui/material';
import { useState } from 'react';


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
            <TextField id="userName" label="Tvoje ime" variant="outlined" value={userName} onChange={(e) => setUserName(e.target.value)} fullWidth />
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
                <Button onClick={handleBack} variant='outlined'>Prethodno pitanje</Button>
                <Button onClick={handleSubmit} disabled={!userName && !role} variant='outlined'>Završi</Button>
            </Box>
        </>
    );
};

export default UserInfo;