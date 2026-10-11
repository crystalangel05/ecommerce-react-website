import { Link } from "react-router-dom";


const recentOrders = [
  {id:"ORD-001", customer:"crystal" , total:30 ,status:"paid"},
  {id:"ORD-002", customer:"john" , total:10 ,status:"paid"},
  {id:"ORD-003", customer:"chris" , total:3 ,status:"pending"},
  {id:"ORD-004", customer:"chloe" , total:30 ,status:"paid"}
];



export default function OrdersTable () {
  return (
    <div className="recent-orders-section">
      <div className="recent-orders-header">
        <h2>Recent Orders</h2>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}