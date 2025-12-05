"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createStatusPage, updateStatusPage } from "@/app/actions/status-page-actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

type Endpoint = {
    id: string;
    name: string;
    url: string;
};

type StatusPageData = {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    is_public: boolean;
    endpoint_ids: string[];
};

export function StatusPageForm({
    initialData,
    endpoints,
}: {
    initialData?: StatusPageData;
    endpoints: Endpoint[];
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<StatusPageData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        is_public: initialData?.is_public || false,
        endpoint_ids: initialData?.endpoint_ids || [],
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Auto-generate slug if it hasn't been manually edited or if we are creating new
        if (!initialData && (formData.slug === "" || formData.slug === formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))) {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            setFormData(prev => ({ ...prev, title, slug }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (initialData?.id) {
                // Update
                const result = await updateStatusPage(initialData.id, formData);
                if (result.success) {
                    toast.success("Status page updated");
                    router.push("/protected/status-pages");
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to update status page");
                }
            } else {
                // Create
                const result = await createStatusPage(formData);
                if (result.success) {
                    toast.success("Status page created");
                    router.push("/protected/status-pages");
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to create status page");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleEndpoint = (endpointId: string) => {
        setFormData(prev => {
            const currentIds = prev.endpoint_ids;
            if (currentIds.includes(endpointId)) {
                return { ...prev, endpoint_ids: currentIds.filter(id => id !== endpointId) };
            } else {
                return { ...prev, endpoint_ids: [...currentIds, endpointId] };
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="My Status Page"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">/status/</span>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            placeholder="my-status-page"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="System status and operational updates."
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="public-mode"
                        checked={formData.is_public}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                    />
                    <Label htmlFor="public-mode">Make Public</Label>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Included Endpoints</h3>
                <Card>
                    <CardContent className="p-4 grid gap-4 max-h-60 overflow-y-auto">
                        {endpoints.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No endpoints found.</p>
                        ) : (
                            endpoints.map(endpoint => (
                                <div key={endpoint.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`endpoint-${endpoint.id}`}
                                        checked={formData.endpoint_ids.includes(endpoint.id)}
                                        onCheckedChange={() => toggleEndpoint(endpoint.id)}
                                    />
                                    <Label htmlFor={`endpoint-${endpoint.id}`} className="cursor-pointer">
                                        {endpoint.name} <span className="text-muted-foreground text-xs">({endpoint.url})</span>
                                    </Label>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Save Changes" : "Create Status Page"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
