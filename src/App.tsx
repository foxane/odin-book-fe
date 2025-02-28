import { Outlet } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "./utils/services";
import UserCard from "./components/UserCard";
import Drawer from "./components/Drawer";
import Navbar from "./components/Navbar";
import useUserInfinite from "./hooks/useUserInfinite";
import { Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const userQuery = useInfiniteQuery({
    queryKey: ["users"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => userService.getMany(pageParam),
    getNextPageParam: (prevPages) =>
      prevPages.length < 10 ? undefined : prevPages.at(-1)?.id.toString(),
  });
  const users = userQuery.data?.pages.flat() ?? [];
  const { follow } = useUserInfinite(["users"]);

  return (
    <div className="bg-base-200 min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <Drawer />

        <main className="border-base-content/10 mt-20 border-0 border-x px-2 pb-6">
          <Outlet />
        </main>

        <div className="hidden h-full space-y-20 px-2 lg:block">
          <section className="sticky top-0 space-y-3 pt-20">
            {users.map((el) => (
              <UserCard follow={follow.mutate} user={el} key={el.id} />
            ))}
          </section>
        </div>
      </div>
      <ToastContainer
        theme={useTheme().isDark ? "dark" : "light"}
        position="bottom-right"
        transition={Slide}
        hideProgressBar
        closeButton
        closeOnClick
      />
    </div>
  );
}
