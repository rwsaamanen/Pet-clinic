import { Outlet } from "react-router-dom";
import { Navigation } from "../dashboard/components/navigation";


const DashboardLayout = () => {
  return (
    <div className="h-screen flex text-black">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
