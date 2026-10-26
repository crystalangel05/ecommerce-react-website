
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

const monthlyRevenue = orders.reduce((months, order) => {
  if (!order.createdAt || order.orderStatus === "Cancelled") {
    return months;
  }

  const date = new Date(order.createdAt);
  if (Number.isNaN(date.getTime())) {
    return months;
  }

  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const monthKey = `${year}-${date.getMonth()}`;

  const existingMonth = months.find((item) => item.monthKey === monthKey);

  if (existingMonth) {
    existingMonth.revenue += Number(order.total || 0);
  } else {
    months.push({
      monthKey,
      month: `${month} ${year}`,
      revenue: Number(order.total || 0),
    });
  }

  return months;
}, []).sort((a, b) => {
  const [yearA, monthA] = a.monthKey.split("-").map(Number);
  const [yearB, monthB] = b.monthKey.split("-").map(Number);
  return yearA - yearB || monthA - monthB;
});


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
      </div>

      <div className="analytics-chart-card">
  <h2>Monthly Revenue</h2>

  {monthlyRevenue.length === 0 ? (
    <p>No dated orders available yet.</p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyRevenue}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
    </div>
  );
}