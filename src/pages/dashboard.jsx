import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, } from "recharts";
import OrdersTable from "../components/ordersTable";
import ordersData from "../data/ordersData";
import { useState } from "react";

export default function Dashboard() {

const [orders] = useState(() => {
  const savedOrders = localStorage.getItem("orderflow_orders");

  return savedOrders ? JSON.parse(savedOrders) : ordersData;
});

const revenueData = orders.reduce((months, order) => {
  if (!order.createdAt || order.orderStatus === "Cancelled") {
    return months;
  }

  const date = new Date(order.createdAt);

  if (Number.isNaN(date.getTime())) {
    return months;
  }

  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
  const existingMonth = months.find((item) => item.monthKey === monthKey);

  if (existingMonth) {
    existingMonth.revenue += Number(order.total || 0);
  } else {
    months.push({
      monthKey,
      month: date.toLocaleString("en-US", { month: "short" }),
      revenue: Number(order.total || 0),
      timestamp: new Date(date.getFullYear(), date.getMonth()).getTime(),
    });
  }

  return months;
}, []).sort((a, b) => a.timestamp - b.timestamp);


  return (   
<div className="dashboard-container">
  <div className="dashboard-header">
    <h1>Dashboard</h1>
  <p>Here's what's happening with your business today.</p>
  </div>
  <div className="dashboard-stats">
    <p className="dashboard-card-value">
  ${orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0)
    .toLocaleString()}
</p>
    <div className="dashboard-card">
  <h2>Total Orders</h2>
  <p className="dashboard-card-value">{orders.length}</p>
  <span className="dashboard-card-description">
    Orders received so far
  </span>
</div>
    <div className="dashboard-card">
  <h2>Pending Orders</h2>
  <p className="dashboard-card-value">
    {orders.filter((order) => order.orderStatus === "Pending").length}
  </p>
  <span className="dashboard-card-description">
    Orders awaiting completion
  </span>
</div>
    <div className="dashboard-card">
      <h2>Low Stock Products</h2>
      <p className="dashboard-card-value">15</p>
      <span className="dashboard-card-description">
    Products that need restocking
  </span>
    </div>
  </div>  
  
  {/* Revenue overview section */}

  <div className="revenue-section">
  <h2>Revenue Overview</h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} /> 

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip formatter={(value) => `$${value}`} />

      <Bar
        dataKey="revenue"
        fill="#2563eb"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
<OrdersTable
  orders={orders.slice(-5).reverse()}
  title="Recent Orders"
/>
</div>
   
  )
}