import { AdminShell } from "@/components/admin/admin-shell";
export const metadata = { title: "Administração demonstrativa" };
export default function Layout({ children }: { children: React.ReactNode }) { return <AdminShell>{children}</AdminShell>; }
