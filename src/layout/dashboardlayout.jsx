import { NavLink , Outlet } from "react-router-dom";
import Navbar from "../components/navbar.jsx";


export default function DashboardLayout() { 
return (
  <div className="dashboard-layout">
    <aside>

      <div className="sidebar-container">
        <div className="logo">
          <h1>OrderFlow</h1>
        </div>
        <div className="sidebar-content">
          <NavLink to="dashboard" className="sidebar-link">Dashboard</NavLink>
           <NavLink to="products" className="sidebar-link">Products</NavLink>
           <NavLink to="orders" className="sidebar-link">Orders</NavLink>
               <NavLink to="customers" className="sidebar-link">Customers</ NavLink>
          <NavLink to="analytics" className="sidebar-link">Analytics</NavLink>
          <NavLink to="settings" className="sidebar-link"> Settings</NavLink>
        </div>
      </div>

    </aside>
    <div className="dashboard-main">
      <Navbar/>
      <main className="dashboard-content">
        <Outlet/>
      </main>
    </div>


  </div>
)
}