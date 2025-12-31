import { Button } from "@/ui/atoms/button";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { getStatusPages } from "@/app/actions/status-page-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/ui/atoms/card";
import { Badge } from "@/ui/atoms/badge";

export const dynamic = 'force-dynamic';

export default async function StatusPagesList() {
    const statusPages = await getStatusPages();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Status Pages</h1>
                <Button asChild>
                    <Link href="/protected/status-pages/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Status Page
                    </Link>
                </Button>
            </div>

            {statusPages.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-4">
                        No status pages yet. Create one to share your endpoints status.
                    </p>
                    <Button asChild>
                        <Link href="/protected/status-pages/create">Create Status Page</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {statusPages.map((page: any) => (
                        <Card key={page.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start gap-2">
                                    <span className="truncate">{page.title}</span>
                                    {page.is_public ? (
                                        <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Public</Badge>
                                    ) : (
                                        <Badge variant="neutral">Private</Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                    {page.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                    <p>{page.status_page_endpoints?.length || 0} endpoints monitored</p>
                                    <p className="text-xs mt-2">Slug: {page.slug}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 border-t pt-4">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href={`/protected/status-pages/${page.id}/edit`}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                {page.is_public && (
                                    <Button variant="secondary" size="sm" className="flex-1" asChild>
                                        <Link href={`/status/${page.slug}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
