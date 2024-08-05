// src/App.js
import React from "react";
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import Analytics from "./pages/analytics/Analytics";
import Reports from "./pages/reports/Reports";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "users", element: <Users /> },
        { path: "products", element: <Products /> },
        { path: "analytics", element: <Analytics /> },
        { path: "reports", element: <Reports /> }
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
