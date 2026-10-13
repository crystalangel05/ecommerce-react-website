import { Link } from "react-router-dom" 

export default function OrdersTable ({orders = [], title="Orders"}) {
  return (
    <div className="recent-orders-section">
      <div className="recent-orders-header">
        <h2>{title}</h2>
        <Link to="/orders" className="view-all-orders">
    View All Orders →
  </Link>
      </div>

      <table className="orders-table">
       <thead>
  <tr>
    <th>Order ID</th>
    <th>Customer</th>
    <th>Total</th>
    <th>Payment Status</th>
    <th>Order Status</th>
  </tr>
</thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>
  <span className={`order-status status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>
    {order.status}
  </span>
</td>

<td>
  <span className={`order-status status-${order.orderStatus.toLowerCase()}`}>
    {order.orderStatus}
  </span>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}