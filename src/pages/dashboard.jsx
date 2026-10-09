import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, } from "recharts";


const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 2400 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2800 },
];


export default function Dashboard() {
  return (   
<div className="dashboard-container">
  <div className="dashboard-header">
    <h1>Dashboard</h1>
  <p>Here's what's happening with your business today.</p>
  </div>
  <div className="dashboard-stats">
    <div className="dashboard-card">
      <h2>Total Revenue</h2>
      <p className="dashboard-card-value">$2,500</p>
      <span className="dashboard-card-description">
    Revenue from all orders
  </span>
    </div>
    <div className="dashboard-card">
      <h2>Total Orders</h2>
      <p className="dashboard-card-value">150</p>
      <span className="dashboard-card-description">
    Orders received so far
  </span>
    </div>
    <div className="dashboard-card">
      <h2>Pending Orders</h2>
      <p className="dashboard-card-value">75</p>
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
</div>
   
  )
}