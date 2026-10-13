import OrdersTable from "../components/ordersTable.jsx";
import ordersData from "../data/ordersData";
import { useState } from "react";


export default function Orders() {

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");


 const filteredOrders = ordersData.filter((order) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    order.id.toLowerCase().includes(search) ||
    order.customer.toLowerCase().includes(search);

  const matchesPayment =
    paymentFilter === "All" || order.status === paymentFilter;

  const matchesOrderStatus =
    orderStatusFilter === "All" ||
    order.orderStatus === orderStatusFilter;

  return matchesSearch && matchesPayment && matchesOrderStatus;
});



  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders</h1>
        <p>Manage and track your customer orders.</p>
      </div>
      <div className="orders-controls">
        <input type="text" placeholder="search by customer or order ID" 
        value={searchTerm}
        onChange={(event) =>setSearchTerm(event.target.value)}/>
        <select value={paymentFilter}
         onChange={(event) => setPaymentFilter(event.target.value)}>

          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partially Paid">Partially Paid</option>
        </select>
        <select
  value={orderStatusFilter}
  onChange={(event) => setOrderStatusFilter(event.target.value)}
>
  <option value="All">All Order Statuses</option>
  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
      </div>

      <button className="add-order-button">
          + Add Order
        </button>

         <OrdersTable orders={filteredOrders} title="All Orders" />

    </div>
   
  )
}