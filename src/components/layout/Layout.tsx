import { Outlet } from 'react-router-dom';
import { HomeNavbar } from './HomeNavbar';
import { BottomTabBar } from './BottomTabBar';

export function Layout() {
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
