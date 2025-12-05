import { createClient } from "@/lib/supabase/server";
import { StatusPageForm } from "@/components/status-page-form";

async function getEndpoints() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("endpoints")
        .select("id, name, url")
        .eq("user_id", user.id)
        .order("name");

    return data || [];
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
