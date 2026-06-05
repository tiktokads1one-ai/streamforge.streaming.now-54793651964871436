import { Outlet } from 'react-router-dom';
import { HomeNavbar } from './HomeNavbar';
import { useEffect } from 'react';

export function Layout() {
  useEffect(() => {
    document.body.classList.add('bg-[#EDECF5]', 'text-[#12131A]');
    document.body.classList.remove('bg-[#0F0F17]', 'text-white');
  }, []);

  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
