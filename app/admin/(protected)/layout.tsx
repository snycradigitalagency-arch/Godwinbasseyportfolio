import { requireEditor } from "@/lib/auth/require-role";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireEditor();

  return (
    <div className="flex bg-bg font-body">
      <Sidebar userName={profile?.full_name} />
      <div className="flex-1 overflow-y-auto px-10 py-10">{children}</div>
    </div>
  );
}
