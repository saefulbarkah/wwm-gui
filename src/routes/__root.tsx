import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="antialiased bg-background text-white min-h-screen font-sans">
      <div className="relative z-10">
        <Navbar />
        <Sidebar />
        <main className="ml-56 mt-18 p-5 min-h-screen mb-10">
          <Outlet />
        </main>
        <Footer />
      </div>
      <div className="fixed inset-0 z-50 pointer-events-none select-none opacity-85">
        <img src={"./blur-pink.png"} alt="blur1" className="absolute inset-0 pointer-events-none" />
      </div>
      <div
        className="fixed inset-0 w-full h-full -translate-x-[50%]
        translate-y-[50%] pointer-events-none select-none opacity-85"
      >
        <img src="./blur-blue.png" alt="blur1" className="absolute inset-0 pointer-events-none" />
      </div>
      <div
        className="fixed inset-0 w-full h-full translate-x-[50%]
        translate-y-[50%] z-50 pointer-events-none select-none opacity-85"
      >
        <img src="./blur-red.png" alt="blur1" className="absolute inset-0 pointer-events-none" />
      </div>
      <TanStackRouterDevtools />
    </div>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
