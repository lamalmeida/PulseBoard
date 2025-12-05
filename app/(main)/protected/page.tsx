import { redirect } from "next/navigation";

export default function ProtectedPage() {
  redirect("/protected/endpoints");
}