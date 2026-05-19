import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}