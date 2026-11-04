import { Link } from "react-router-dom" 

export default function OrdersTable({ orders = [], title = "Orders", onEditOrder, onCancelOrder,}) {
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
  <th>Customer</th>
<th>Total</th>
<th>Amount Paid</th>
<th>Balance Due</th>
<th>Payment Status</th>
  </tr>
</thead>
        <tbody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.customer}</td>
        <td>${order.total}</td>
        <td>${(order.amountPaid ?? 0).toFixed(2)}</td>
<td>${(order.balance ?? order.total).toFixed(2)}</td>
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
  <div className="order-actions">
    <button
      type="button"
      className="edit-order-button"
      onClick={() => onEditOrder(order)}
    >
      Edit
    </button>

    <button
      type="button"
      className="cancel-order-button"
      onClick={() => onCancelOrder(order.id)}
      disabled={order.orderStatus === "Cancelled"}
    >
      {order.orderStatus === "Cancelled" ? "Cancelled" : "Cancel"}
    </button>
  </div>
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="no-orders">
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