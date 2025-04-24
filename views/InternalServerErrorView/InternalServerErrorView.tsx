import { Button, Typography } from '@mui/material';

/**
 * Function representing the view corresponding to the internal server error page.
 *
 * @returns InternalServerError component
 */
export default function InternalServerError() {
    return (
        <>
            <Typography variant="h1" gutterBottom>500</Typography>
            <Typography variant="h6" gutterBottom>Ooops, nešto je pošlo po krivu.</Typography>
            <Button variant="outlined" href="/">Natrag na početnu</Button>
        </>
    );
}
