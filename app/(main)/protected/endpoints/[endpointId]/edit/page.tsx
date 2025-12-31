import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditEndpointForm } from "@/ui/organisms/edit-endpoint-form";

export default async function EditEndpointPage({
    params,
}: {
    params: Promise<{ endpointId: string }>;
}) {
    const { endpointId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: endpoint } = await supabase
        .from("endpoints")
        .select("*")
        .eq("id", endpointId)
        .eq("user_id", user.id)
        .single();

    if (!endpoint) {
        notFound();
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8">
            <div className="w-full pl-12 lg:pl-0">
                <h1 className="text-3xl font-bold mb-2">Edit Endpoint</h1>
                <p className="text-muted-foreground">
                    Manage settings for {endpoint.name}
                </p>
            </div>

            <div className="max-w-4xl">
                <EditEndpointForm endpoint={endpoint} />
            </div>
        </div>
    );
}
