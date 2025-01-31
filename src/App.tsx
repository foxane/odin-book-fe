import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <header>This is header</header>

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </div>
  );
}

export default App;
