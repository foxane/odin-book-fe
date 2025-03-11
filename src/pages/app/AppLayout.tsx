import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import DrawerLeft from "../../components/common/DrawerLeft";
import DrawerRight from "../../components/common/DrawerRight";

export default function AppLayout() {
  return (
    <div className="relative mx-auto lg:container">
      <DrawerLeft>
        <DrawerRight>
          <Navbar />
          <main className="mx-auto mt-3 w-full max-w-3xl px-2">
            <Outlet />
          </main>
        </DrawerRight>
      </DrawerLeft>
    </div>
  );
}
