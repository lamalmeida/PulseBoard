"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { Textarea } from "@/ui/atoms/textarea";
import { Label } from "@/ui/atoms/label";
import { Switch } from "@/ui/atoms/switch";
import { createStatusPage, updateStatusPage } from "@/app/actions/status-page-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { parseStatusPageDescription, stringifyStatusPageConfig, GroupConfig } from "@/lib/status-page-utils";
import { GroupEditor } from "@/ui/organisms/group-editor";
import { v4 as uuidv4 } from "uuid";

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

    // Parse initial description to separate text and group config
    const initialConfig = parseStatusPageDescription(initialData?.description);

    // State for description text (user visible)
    const [descriptionText, setDescriptionText] = useState(initialConfig.description);
    // State for groups
    const [groups, setGroups] = useState<GroupConfig[]>(initialConfig.groups);
    // State for logo
    const [logoUrl, setLogoUrl] = useState(initialConfig.logoUrl || "");

    const [formData, setFormData] = useState<StatusPageData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "", // Will be overwritten on submit
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

    const handleGroupEditorChange = (data: { endpoint_ids: string[]; groups: GroupConfig[] }) => {
        setFormData(prev => ({ ...prev, endpoint_ids: data.endpoint_ids }));
        setGroups(data.groups);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // serialize description + groups + logo
        const finalDescription = stringifyStatusPageConfig(descriptionText, groups, logoUrl);
        const finalData = { ...formData, description: finalDescription };

        try {
            if (initialData?.id) {
                // Update
                const result = await updateStatusPage(initialData.id, finalData);
                if (result.success) {
                    toast.success("Status page updated");
                    router.push("/protected/status-pages");
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to update status page");
                }
            } else {
                // Create
                const result = await createStatusPage(finalData);
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
                    <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                    <Input
                        id="logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                    />
                    <p className="text-[10px] text-muted-foreground">URL to your logo image. Will replace the default logo and favicon.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
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

            <GroupEditor
                allEndpoints={endpoints}
                initialGroups={groups}
                initialSelectedEndpointIds={formData.endpoint_ids}
                onChange={handleGroupEditorChange}
            />

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
