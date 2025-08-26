'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, User, Users } from "lucide-react";
import { useState } from 'react';

interface UserInfoProps {
    onSubmit: (name, role) => void;
    onBack: () => void;
}

function UserInfo({ onSubmit, onBack }: UserInfoProps) {
    const [userName, setUserName] = useState<string>('');
    const [role, setRole] = useState<string | null>(null);

    const handleSubmit = async () => {
        onSubmit(userName, role);
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    Gotov si!
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Unesite svoje podatke da biste vidjeli rezultat kviza
                </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="userName" className="text-lg font-medium text-foreground">
                        Tvoje ime
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Upišite svoje ime..."
                            className="w-full pl-10 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="user-role" className="text-lg font-medium text-foreground">
                        Ti si
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <Select value={role || ""} onValueChange={(value) => setRole(value)}>
                            <SelectTrigger className="w-full pl-10 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                                <SelectValue placeholder="Odaberite svoju ulogu..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Volonter</SelectItem>
                                <SelectItem value="2">Vozač</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4">
                <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                            <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                            Prethodno pitanje
                        </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!userName || !role}
                    size="lg"
                    className="w-full sm:w-auto text-lg py-6 md:py-3 sm:text-sm group relative overflow-hidden transition-all duration-300 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Završi kviz
                </Button>
            </div>
        </div>
    );
}

export default UserInfo;