import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50/80">
      <TopBar />
      <main className="safe-bottom mx-auto max-w-lg px-5 pb-24 pt-5">
        {children}
      </main>
    </div>
  );
}
