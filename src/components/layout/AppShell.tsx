import { ProgressHeader } from '../pss/ProgressHeader';

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export function AppShell({ children, showHeader = true }: { children: React.ReactNode; showHeader?: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <ProgressHeader />
      )}
      <main>{children}</main>
    </div>
  );
}
