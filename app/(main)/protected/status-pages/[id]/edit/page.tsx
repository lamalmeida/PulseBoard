import { WorkerAPI } from "@/lib/api-client";
import { StatusPageForm } from "@/ui/organisms/status-page-form";
import { getStatusPage } from "@/app/actions/status-page-actions";
import { notFound } from "next/navigation";

async function getEndpoints() {
    try {
        const endpoints = await WorkerAPI.getEndpoints();
        return endpoints || [];
    } catch (error) {
        console.error("Error fetching endpoints:", error);
        return [];
    }
}

export default async function EditStatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [statusPage, endpoints] = await Promise.all([
        getStatusPage(id),
        getEndpoints()
    ]);

    if (!statusPage) {
        notFound();
    }

    // Transform status page data for form
    const initialData = {
        id: statusPage.id,
        title: statusPage.title,
        slug: statusPage.slug,
        description: statusPage.description,
        is_public: statusPage.is_public,
        endpoint_ids: statusPage.status_page_endpoints?.map((spe: any) => spe.endpoint_id) || [],
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Status Page</h1>
                <p className="text-muted-foreground">
                    Update your public status page configuration.
                </p>
            </div>
            <StatusPageForm initialData={initialData} endpoints={endpoints} />
        </div>
    );
}
