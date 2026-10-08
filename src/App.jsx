
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Analytics from './pages/analytics.jsx'
import Auth from './pages/auth.jsx'
import Dashboard from './pages/dashboard.jsx'
import Orders from './pages/orders.jsx'
import Products from './pages/products.jsx'
import Settings from './pages/settings.jsx'
import Customers from './pages/customers.jsx'
import DashboardLayout from './layout/dashboardlayout.jsx'

function App() {
 
  return (
    <>
    <BrowserRouter>
            <Routes>

              <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="customers" element={<Customers/>} />
              </Route>
              
              <Route path="/auth" element={<Auth />} />

              </Routes>
        </BrowserRouter> 
      
    </>
  )
}

export default App
