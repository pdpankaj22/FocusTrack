import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-canvas text-ink font-sans selection:bg-forest-light selection:text-ink">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 z-30">
        <Sidebar />
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen bg-canvas">
        <div className="flex-1 pb-20 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}
