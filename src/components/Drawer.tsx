import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";

function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        {/* Sidebar content */}
        {/* NOTE: xl:min-h-fit is to prevent overflow-y when 
                  displayed as sidebar. not drawer */}
        <div className="bg-base-100 min-h-full w-64 space-y-4 p-4 xl:min-h-fit">
          <SearchForm className="md:hidden" />

          <nav>
            <ul className="menu w-full">
              <li>
                <Link to={"/"}>Lorem</Link>
              </li>
              <li>
                <Link to={"/"}>Ipsum</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
