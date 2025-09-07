import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, Heart, Users } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ThemeView() {
    const router = useRouter();

    const handleThemeSelection = (theme: string) => {
        router.push(`/category/${theme}`);
    };

    return (
        <div className="space-y-8 mb-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                    Odaberite temu kviza
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Testirajte svoje znanje iz područja prve pomoći i pokreta Crvenog križa
                </p>
            </div>

            {/* Theme Cards */}
            <div className="space-y-6">
                {/* Red Cross Movement Theme */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary-300 bg-card">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center space-x-6 space-y-6 md:space-y-0">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 group-hover:scale-110 transition-all duration-300">
                                    <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                                    Pokret Crvenog križa
                                </h3>
                                <p className="text-muted-foreground text-lg">
                                    Saznajte više o povijesti, principima i aktivnostima Crvenog križa
                                </p>
                            </div>
                            <Button
                                onClick={() => handleThemeSelection('200')}
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Započni kviz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {/* First Aid Theme */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary-300 bg-card">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center space-x-6 space-y-6 md:space-y-0">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 group-hover:scale-110 transition-all duration-300">
                                    <Ambulance className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                                    Prva pomoć
                                </h3>
                                <p className="text-muted-foreground text-lg">
                                    Testirajte svoje znanje o prvoj pomoći
                                </p>
                            </div>
                            <Button
                                onClick={() => handleThemeSelection('200')}
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Započni kviz
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Footer Info */}
            <div className="text-center pt-8">
                <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
                    <Heart className="h-4 w-4 text-primary-500" />
                    <span>Podržano od GDCK Buje</span>
                </div>
            </div>
        </div>
    );
}