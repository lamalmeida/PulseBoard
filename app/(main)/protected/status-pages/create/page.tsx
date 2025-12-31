import { WorkerAPI } from "@/lib/api-client";
import { StatusPageForm } from "@/ui/organisms/status-page-form";

export const dynamic = 'force-dynamic';

async function getEndpoints() {
    try {
        const endpoints = await WorkerAPI.getEndpoints();
        return endpoints || [];
    } catch (error) {
        console.error("Error fetching endpoints:", error);
        return [];
    }
}

export default async function CreateStatusPage() {
    const endpoints = await getEndpoints();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Status Page</h1>
                <p className="text-muted-foreground">
                    Configure a public page to display status for selected endpoints.
                </p>
            </div>
            <StatusPageForm endpoints={endpoints} />
        </div>
    );
}
