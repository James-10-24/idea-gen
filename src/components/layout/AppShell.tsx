import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <TopBar />
      <main className="mx-auto max-w-lg px-4 pb-20 pt-5">{children}</main>
    </div>
  );
}
