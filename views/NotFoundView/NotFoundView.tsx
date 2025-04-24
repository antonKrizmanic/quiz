// Styles import
import { Button, Typography } from '@mui/material';

/**
 * Function representing the view corresponding to the 404 page.
 *
 * @returns NotFoundView component
 */
export default function NotFoundView() {
    return (
        <>
            <Typography variant="h1" gutterBottom>404</Typography>
            <Typography variant="h6" gutterBottom>Ops, ova stranica ne postoji!</Typography>
            <Button variant="outlined" href="/">Natrag na početnu</Button>

        </>
    );
}
