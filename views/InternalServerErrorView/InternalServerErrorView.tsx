import { Button } from "@/components/ui/button";

/**
 * Function representing the view corresponding to the internal server error page.
 *
 * @returns InternalServerError component
 */
export default function InternalServerError() {
    return (
        <div className="space-y-6 text-center">
            <h1 className="text-6xl font-bold text-destructive">500</h1>
            <h2 className="text-xl font-medium">Ooops, nešto je pošlo po krivu.</h2>
            <Button variant="outline" asChild>
                <a href="/">Natrag na početnu</a>
            </Button>
        </div>
    );
}
