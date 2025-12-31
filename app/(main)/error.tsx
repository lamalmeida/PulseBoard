'use client';

import { useEffect } from 'react';
import { Button } from '@/ui/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/atoms/card';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-background">
            <Card className="max-w-md w-full border-destructive/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive flex items-center gap-2">
                        Something went wrong
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {error.message || "An unexpected error occurred"}
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <Button onClick={reset} className="w-full" variant="default">
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
