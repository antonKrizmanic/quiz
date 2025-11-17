import { Button } from '@/components/ui/button';

/**
 * Function representing the view corresponding to the 404 page.
 *
 * @returns NotFoundView component
 */
export default function NotFoundView() {
    return (
        <div className="space-y-6 text-center">
            <h1 className="text-6xl font-bold text-destructive">404</h1>
            <h2 className="text-xl font-medium">
                Ops, ova stranica ne postoji!
            </h2>
            <Button variant="outline" asChild>
                <a href="/">Natrag na početnu</a>
            </Button>
        </div>
    );
}
