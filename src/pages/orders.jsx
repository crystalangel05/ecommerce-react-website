import OrdersTable from "../components/ordersTable.jsx";


export default function Orders() {
  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders</h1>
        <p>Manage and track your customer orders.</p>
      </div>
      <button className="add-order-button">
          + Add Order
        </button>

           <OrdersTable />

    </div>
   
  )
}