import { AddEndpointForm } from "@/ui/organisms/add-endpoint-form";

export default function AddEndpointPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full pl-12 lg:pl-0">
        <h1 className="text-3xl font-bold mb-2">Add New Endpoint</h1>
        <p className="text-muted-foreground">
          Monitor the health of your APIs and services
        </p>
      </div>

      <div className="max-w-2xl">
        <AddEndpointForm />
      </div>
    </div>
  );
}