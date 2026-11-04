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
const [customers, setCustomers] = useState(() => {
  const savedCustomers = localStorage.getItem("orderflow_customers");
  return savedCustomers ? JSON.parse(savedCustomers) : [];
});
  const [customer, setCustomer] = useState("");
const [total, setTotal] = useState("");
const [paymentStatus, setPaymentStatus] = useState("Pending");
const [newOrderStatus, setNewOrderStatus] = useState("Pending");
const [amountPaid, setAmountPaid] = useState("");
const [editingOrderId, setEditingOrderId] = useState(null);

const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem("orderflow_products");
  return savedProducts ? JSON.parse(savedProducts) : [];
});

const [selectedProductId, setSelectedProductId] = useState("");
const [quantity, setQuantity] = useState("1");

const selectedProduct = products.find(
  (product) => product.id === selectedProductId
);

const calculatedTotal = selectedProduct
  ? selectedProduct.price * Number(quantity || 0)
  : 0;

useEffect(() => {
  localStorage.setItem("orderflow_orders", JSON.stringify(orders));
}, [orders]);

useEffect(() => {
  const syncProducts = () => {
    const savedProducts = localStorage.getItem("orderflow_products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  window.addEventListener("productsUpdated", syncProducts);

  return () => {
    window.removeEventListener("productsUpdated", syncProducts);
  };
}, []);

useEffect(() => {
  const syncCustomers = () => {
    const savedCustomers = localStorage.getItem("orderflow_customers");

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  };

  window.addEventListener("customersUpdated", syncCustomers);

  return () => {
    window.removeEventListener("customersUpdated", syncCustomers);
  };
}, []);



const handleAddOrder = (event) => {
  event.preventDefault();

  const cleanCustomer = customer.trim();
  const numericQuantity = Number(quantity);

  if (!cleanCustomer || !selectedProduct) {
    alert("Please enter a customer name and select a product.");
    return;
  }

  if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity <= 0 ||
    numericQuantity > selectedProduct.stock
  ) {
    alert("Please enter a valid quantity within available stock.");
    return;
  }

  const numericTotal = selectedProduct.price * numericQuantity;

  const numericAmountPaid = Number(amountPaid || 0);

  const calculatedPaymentStatus =
  numericAmountPaid === 0
    ? "Pending"
    : numericAmountPaid < numericTotal
    ? "Partially Paid"
    : "Paid";

if (
  !Number.isFinite(numericAmountPaid) ||
  numericAmountPaid < 0 ||
  numericAmountPaid > numericTotal
) {
  alert("Amount paid must be between $0 and the order total.");
  return;
}

  const newOrder = {
    id: `ORD-${String(Date.now()).slice(-6)}`,
    customer: cleanCustomer,
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    quantity: numericQuantity,
    unitPrice: selectedProduct.price,
    total: numericTotal,
    amountPaid: numericAmountPaid,
balance: numericTotal - numericAmountPaid,
status: calculatedPaymentStatus,
    orderStatus: newOrderStatus,
    createdAt: new Date().toISOString(),
  };

  setOrders((previousOrders) => [...previousOrders, newOrder]);

  const updatedProducts = products.map((product) =>
    product.id === selectedProduct.id
      ? { ...product, stock: product.stock - numericQuantity }
      : product
  );

  setProducts(updatedProducts);
  localStorage.setItem("orderflow_products", JSON.stringify(updatedProducts));
window.dispatchEvent(new Event("productsUpdated"));
  setCustomer("");
  setSelectedProductId("");
  setQuantity("1");
  setTotal("");
  setAmountPaid("");
  setPaymentStatus("Pending");
  setNewOrderStatus("Pending");
  setShowOrderForm(false);
};
  

const handleEditOrder = (order) => {
  setEditingOrderId(order.id);
  setCustomer(order.customer);
  setTotal(String(order.total));
  setPaymentStatus(order.status);
  setAmountPaid(String(order.amountPaid ?? 0));
  setNewOrderStatus(order.orderStatus);
  setShowOrderForm(true);
};

const handleUpdateOrder = (event) => {
  event.preventDefault();

  const cleanCustomer = customer.trim();
  const numericTotal = Number(total);
  const numericAmountPaid = Number(amountPaid || 0);

if (
  !Number.isFinite(numericAmountPaid) ||
  numericAmountPaid < 0 ||
  numericAmountPaid > numericTotal
) {
  alert("Amount paid must be between $0 and the order total.");
  return;
}

const calculatedPaymentStatus =
  numericAmountPaid === 0
    ? "Pending"
    : numericAmountPaid < numericTotal
    ? "Partially Paid"
    : "Paid";

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
  amountPaid: numericAmountPaid,
  balance: numericTotal - numericAmountPaid,
  status: calculatedPaymentStatus,
  orderStatus: newOrderStatus,
}
        : order
    )
  );

  setEditingOrderId(null);
  setCustomer("");
  setTotal("");
  setAmountPaid("");
  setPaymentStatus("Pending");
  setNewOrderStatus("Pending");
  setShowOrderForm(false);
};

const handleCancelOrder = (orderId) => {
  const orderToCancel = orders.find(
    (order) => order.id === orderId
  );

  if (!orderToCancel || orderToCancel.orderStatus === "Cancelled") {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;


  if (orderToCancel.productId) {
    const updatedProducts = products.map((product) =>
      product.id === orderToCancel.productId
        ? {
            ...product,
            stock: product.stock + orderToCancel.quantity,
          }
        : product
    );

    setProducts(updatedProducts);

    localStorage.setItem(
      "orderflow_products",
      JSON.stringify(updatedProducts)
    );

    window.dispatchEvent(new Event("productsUpdated"));
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
    <select
  value={customer}
  onChange={(event) => setCustomer(event.target.value)}
  required
>
  <option value="">Select a customer</option>

  {customers.map((customer) => (
    <option key={customer.id} value={customer.name}>
      {customer.name}
    </option>
  ))}
</select>
  </label>

<label>
  Product
  <select
    value={selectedProductId}
    onChange={(event) => setSelectedProductId(event.target.value)}
    required
  >
    <option value="">Select a product</option>

    {products.map((product) => (
      <option
        key={product.id}
        value={product.id}
        disabled={product.stock === 0}
      >
        {product.name} — ${product.price.toFixed(2)} ({product.stock} in stock)
      </option>
    ))}
  </select>
</label>

<label>
  Quantity
  <input
    type="number"
    min="1"
    step="1"
    value={quantity}
    onChange={(event) => setQuantity(event.target.value)}
    required
  />
</label>
  <label>
  Total Amount ($)
  <input
  type="number"
  value={
    editingOrderId
      ? orders.find((order) => order.id === editingOrderId)?.total.toFixed(2) || "0.00"
      : calculatedTotal.toFixed(2)
  }
  readOnly/>
</label>
<label>
  Amount Paid ($)
  <input
    type="number"
    min="0"
    step="0.01"
    value={amountPaid}
    onChange={(event) => setAmountPaid(event.target.value)}
    required
  />
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