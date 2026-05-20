import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { VignetteAds } from '../VignetteAds';

export function Layout() {
  return (
    <>
      <VignetteAds />

      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />

      <MobileNav />
    </>
  );
}