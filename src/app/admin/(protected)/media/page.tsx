import { getAdminMediaOptions } from "@/lib/cms/admin-data";
import MediaManager from "./MediaManager";

export default async function AdminMediaPage() {
  const media = await getAdminMediaOptions();
  return <MediaManager media={media} />;
}
