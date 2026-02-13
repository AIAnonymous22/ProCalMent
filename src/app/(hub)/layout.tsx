import { FloatingNav } from "@/components/ui/floating-nav";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mesh">
      <FloatingNav />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
