"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStatusPages() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from("status_pages")
        .select("*, status_page_endpoints(endpoint_id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching status pages:", error);
        return [];
    }

    return data;
}

export async function getStatusPage(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("status_pages")
        .select("*, status_page_endpoints(endpoint_id)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching status page:", error);
        return null;
    }

    return data;
}

export async function createStatusPage(data: {
    title: string;
    slug: string;
    description?: string;
    is_public?: boolean;
    endpoint_ids: string[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
        .from("status_pages")
        .select("id")
        .eq("slug", data.slug)
        .single();

    if (existing) {
        return { success: false, error: "Slug already exists" };
    }

    // Insert status page
    const { data: statusPage, error: insertError } = await supabase
        .from("status_pages")
        .insert({
            user_id: user.id,
            title: data.title,
            slug: data.slug,
            description: data.description,
            is_public: data.is_public || false,
        })
        .select()
        .single();

    if (insertError) {
        return { success: false, error: insertError.message };
    }

    // Insert endpoints
    if (data.endpoint_ids.length > 0) {
        const endpointsToInsert = data.endpoint_ids.map(id => ({
            status_page_id: statusPage.id,
            endpoint_id: id,
        }));

        const { error: endpointsError } = await supabase
            .from("status_page_endpoints")
            .insert(endpointsToInsert);

        if (endpointsError) {
            // Cleanup status page if endpoints fail? Or just report error?
            // For now, report error. Ideally transaction.
            console.error("Error linking endpoints:", endpointsError);
            return { success: true, warning: "Status page created but endpoints failed to link" };
        }
    }

    revalidatePath("/protected/status-pages");
    return { success: true, data: statusPage };
}

export async function updateStatusPage(id: string, data: {
    title?: string;
    slug?: string;
    description?: string;
    is_public?: boolean;
    endpoint_ids?: string[];
}) {
    const supabase = await createClient();

    // Update status page fields
    const updates: any = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.description !== undefined) updates.description = data.description;
    if (data.is_public !== undefined) updates.is_public = data.is_public;

    if (Object.keys(updates).length > 0) {
        const { error } = await supabase
            .from("status_pages")
            .update(updates)
            .eq("id", id);

        if (error) return { success: false, error: error.message };
    }

    // Update endpoints if provided
    if (data.endpoint_ids !== undefined) {
        // Delete existing
        const { error: deleteError } = await supabase
            .from("status_page_endpoints")
            .delete()
            .eq("status_page_id", id);

        if (deleteError) return { success: false, error: deleteError.message };

        // Insert new
        if (data.endpoint_ids.length > 0) {
            const endpointsToInsert = data.endpoint_ids.map(endpointId => ({
                status_page_id: id,
                endpoint_id: endpointId,
            }));

            const { error: insertError } = await supabase
                .from("status_page_endpoints")
                .insert(endpointsToInsert);

            if (insertError) return { success: false, error: insertError.message };
        }
    }

    revalidatePath("/protected/status-pages");
    revalidatePath(`/protected/status-pages/${id}`);
    return { success: true };
}

export async function deleteStatusPage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("status_pages")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/protected/status-pages");
    return { success: true };
}
