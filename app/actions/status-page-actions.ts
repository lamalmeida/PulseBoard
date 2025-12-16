"use server";

import { WorkerAPI } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function getStatusPages() {
    try {
        return await WorkerAPI.getStatusPages();
    } catch (error) {
        console.error("Error fetching status pages:", error);
        return [];
    }
}

export async function getStatusPage(id: string) {
    try {
        return await WorkerAPI.getStatusPage(id);
    } catch (error) {
        console.error("Error fetching status page:", error);
        return null;
    }
}

export async function createStatusPage(data: {
    title: string;
    slug: string;
    description?: string;
    is_public?: boolean;
    endpoint_ids: string[];
}) {
    try {
        const result = await WorkerAPI.createStatusPage({
            title: data.title,
            slug: data.slug,
            description: data.description,
            is_public: data.is_public,
            endpoint_ids: data.endpoint_ids,
        });

        revalidatePath("/protected/status-pages");
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateStatusPage(id: string, data: {
    title?: string;
    slug?: string;
    description?: string;
    is_public?: boolean;
    endpoint_ids?: string[];
}) {
    try {
        await WorkerAPI.updateStatusPage(id, data);

        revalidatePath("/protected/status-pages");
        revalidatePath(`/protected/status-pages/${id}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteStatusPage(id: string) {
    try {
        await WorkerAPI.deleteStatusPage(id);
        revalidatePath("/protected/status-pages");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
