import OrdersTable from "../components/ordersTable.jsx";
import ordersData from "../data/ordersData";
import { useState , useEffect  } from "react";



export default function Orders() {

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [showOrderForm, setShowOrderForm] = useState(false);
const [orders, setOrders] = useState(() => {
  const savedOrders = localStorage.getItem("orderflow_orders");
  return savedOrders ? JSON.parse(savedOrders) : ordersData;
});
  const [customer, setCustomer] = useState("");
const [total, setTotal] = useState("");
const [paymentStatus, setPaymentStatus] = useState("Pending");
const [newOrderStatus, setNewOrderStatus] = useState("Pending");
const [editingOrderId, setEditingOrderId] = useState(null);

useEffect(() => {
  localStorage.setItem("orderflow_orders", JSON.stringify(orders));
}, [orders]);


const handleAddOrder = (event) => {
  event.preventDefault();
 const cleanCustomer = customer.trim();
const numericTotal = Number(total);

if (!cleanCustomer || !Number.isFinite(numericTotal) || numericTotal <= 0) {
  alert("Please enter a valid customer name and a total greater than zero.");
  return;
}
  const newOrder = {
    id: `ORD-${String(Date.now()).slice(-6)}`,
    customer: cleanCustomer,
total: numericTotal,
    status: paymentStatus,
    orderStatus: newOrderStatus,
    createdAt: new Date().toISOString(),
  };

  setOrders((previousOrders) => [...previousOrders, newOrder]);

  setCustomer("");
  setTotal("");
  setPaymentStatus("Pending");
  setNewOrderStatus("Pending");
  setShowOrderForm(false);
};

const handleEditOrder = (order) => {
  setEditingOrderId(order.id);
  setCustomer(order.customer);
  setTotal(String(order.total));
  setPaymentStatus(order.status);
  setNewOrderStatus(order.orderStatus);
  setShowOrderForm(true);
};

const handleUpdateOrder = (event) => {
  event.preventDefault();

  const cleanCustomer = customer.trim();
  const numericTotal = Number(total);

  if (
    !cleanCustomer ||
    !Number.isFinite(numericTotal) ||
    numericTotal <= 0
  ) {
    alert("Please enter a valid customer name and a total greater than zero.");
    return;
  }

  setOrders((previousOrders) =>
    previousOrders.map((order) =>
      order.id === editingOrderId
        ? {
            ...order,
            customer: cleanCustomer,
            total: numericTotal,
            status: paymentStatus,
            orderStatus: newOrderStatus,
          }
        : order
    )
  );

  setEditingOrderId(null);
  setCustomer("");
  setTotal("");
  setPaymentStatus("Pending");
  setNewOrderStatus("Pending");
  setShowOrderForm(false);
};

const handleCancelOrder = (orderId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) {
    return;
  }

  setOrders((previousOrders) =>
    previousOrders.map((order) =>
      order.id === orderId
        ? { ...order, orderStatus: "Cancelled" }
        : order
    )
  );
};

 const filteredOrders = orders.filter((order) => {
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

      <button  className="add-order-button"
  onClick={() => setShowOrderForm(true)}>
          + Add Order
        </button>

{showOrderForm && (

  <div className="order-form-container">
    <div className="order-form-header">
      <h2>{editingOrderId ? "Edit Order" : "Add New Order"}</h2>

  <button
    type="button"
    onClick={() => setShowOrderForm(false)}
  >
    ✕
  </button>
</div>

<form className="order-form" onSubmit={editingOrderId ? handleUpdateOrder : handleAddOrder}>
  <label>
    Customer Name
    <input
      type="text"
      placeholder="Enter customer name"
      value={customer}
  onChange={(event) => setCustomer(event.target.value)}
      required
    />
  </label>

  <label>
    Total Amount ($)
    <input
  type="number"
  min="0.01"
  step="0.01"
  placeholder="Enter total amount"
  value={total}
  onChange={(event) => setTotal(event.target.value)}
  required
/>
  </label>

  <label>
    Payment Status
    <select
  value={paymentStatus}
  onChange={(event) => setPaymentStatus(event.target.value)}
>
  <option value="Pending">Pending</option>
  <option value="Paid">Paid</option>
  <option value="Partially Paid">Partially Paid</option>
</select>
  </label>

  <label>
    Order Status
    <select
  value={newOrderStatus}
  onChange={(event) => setNewOrderStatus(event.target.value)}
>
  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
  </label>

  <button type="submit" className="add-order-button">
     {editingOrderId ? "Save Changes" : "Create Order"}
  </button>
</form>

  </div>
)}

       <OrdersTable orders={filteredOrders} title="All Orders" onEditOrder={handleEditOrder}  onCancelOrder={handleCancelOrder} />

    </div>
   
  )
}