
import { useState , useEffect} from "react";
import ordersData from "../data/ordersData";
import { ResponsiveContainer, PieChart,BarChart,Bar,XAxis, YAxis,CartesianGrid, Pie, Cell, Tooltip, Legend,} from "recharts";



export default function Analytics() {
 const [orders, setOrders] = useState(() => {
  const savedOrders = localStorage.getItem("orderflow_orders");

  return savedOrders ? JSON.parse(savedOrders) : ordersData;
});

useEffect(() => {
  const savedOrders = localStorage.getItem("orderflow_orders");

  if (savedOrders) {
    const parsedOrders = JSON.parse(savedOrders);

    const ordersWithDates = parsedOrders.map((order, index) => ({
      ...order,
      createdAt:
        order.createdAt ||
        `2026-10-${String(index + 1).padStart(2, "0")}T10:00:00`,
    }));

    setOrders(ordersWithDates);
  }
}, []);

  const activeOrders = orders.filter(
    (order) => order.orderStatus !== "Cancelled"
  );

  const totalRevenue = activeOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

const monthlyRevenue = (() => {
  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, index) => ({
    monthKey: `${currentYear}-${index}`,
    month: new Date(currentYear, index).toLocaleString("en-US", {
      month: "short",
    }),
    revenue: 0,
  }));

  orders.forEach((order) => {
    if (!order.createdAt || order.orderStatus === "Cancelled") {
      return;
    }

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime()) || date.getFullYear() !== currentYear) {
      return;
    }

    const monthIndex = date.getMonth();

    months[monthIndex].revenue += Number(order.total) || 0;
  });

  return months;
})(); 


  const orderStatusData = [
  {
    name: "Pending",
    value: orders.filter((order) => order.orderStatus === "Pending").length,
  },
  {
    name: "Processing",
    value: orders.filter((order) => order.orderStatus === "Processing").length,
  },
  {
    name: "Completed",
    value: orders.filter((order) => order.orderStatus === "Completed").length,
  },
  {
    name: "Cancelled",
    value: orders.filter((order) => order.orderStatus === "Cancelled").length,
  },
];

const chartColors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p>Understand how your business is performing.</p>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="analytics-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>


        
      </div>

      <div className="analytics-chart-card">
  <h2>Monthly Revenue</h2>

  <div className="analytics-chart-card">
  <h2>Order Status Breakdown</h2>

  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie
        data={orderStatusData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {orderStatusData.map((entry, index) => (
          <Cell
            key={entry.name}
            fill={chartColors[index]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

  {monthlyRevenue.length === 0 ? (
    <p>No dated orders available yet.</p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyRevenue}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="revenue" fill="#B76E52" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
    </div>
  );
}