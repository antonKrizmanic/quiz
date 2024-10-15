import { Button } from '@mui/material';

import styles from './InternalServerErrorView.module.scss';

/**
 * Function representing the view corresponding to the internal server error page.
 *
 * @returns InternalServerError component
 */
export default function InternalServerError() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title} data-testid="heading">
                500
            </h1>
            <h2 className={styles.subtitle}>
                Ooops, nešto je pošlo po krivu.
            </h2>
            <Button variant="outlined" href="/">Natrag na početnu</Button>
        </div>
    );
}
