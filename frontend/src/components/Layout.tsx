import { Outlet } from '@tanstack/react-router';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
