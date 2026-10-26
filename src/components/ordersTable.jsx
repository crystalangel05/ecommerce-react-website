import { Link } from "react-router-dom" 

export default function OrdersTable({ orders = [], title = "Orders", onEditOrder,}) {
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
    <th>Actions</th>
  </tr>
</thead>
        <tbody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.customer}</td>
        <td>${order.total}</td>
        <td>
          <span
            className={`order-status status-${order.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {order.status}
          </span>
        </td>
        <td>
          <span
            className={`order-status status-${order.orderStatus.toLowerCase()}`}
          >
            {order.orderStatus}
          </span>
        </td>
        <td>
  <button
    type="button"
    className="edit-order-button"
    onClick={() => onEditOrder(order)}
  >
    Edit
  </button>
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="no-orders">
        <strong>No orders found</strong>
        <p>Try changing your search or filters.</p>
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}