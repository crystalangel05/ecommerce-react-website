import { useState , useEffect} from "react";


const initialCustomers = [
  {
    id: "CUS-001",
    name: "Crystal",
    email: "crystal@gmail.com",
    phone: "0771234567",
    orders: 3,
  },
  {
    id: "CUS-002",
    name: "Sarah",
    email: "sarah@gmail.com",
    phone: "0772345678",
    orders: 2,
  },
  {
    id: "CUS-003",
    name: "John",
    email: "john@gmail.com",
    phone: "0773456789",
    orders: 1,
  },
];

export default function Customers() {

const [searchTerm, setSearchTerm] = useState("");
const [loyaltyFilter, setLoyaltyFilter] = useState("All");
const [sortOption, setSortOption] = useState("name");
const [showCustomerForm, setShowCustomerForm] = useState(false);
const [customerName, setCustomerName] = useState("");
const [customerEmail, setCustomerEmail] = useState("");
const [customerPhone, setCustomerPhone] = useState("");
const [customers, setCustomers] = useState(() => {
  const savedCustomers = localStorage.getItem("orderflow_customers");
  return savedCustomers
    ? JSON.parse(savedCustomers)
    : initialCustomers;
});
const [editingCustomerId, setEditingCustomerId] = useState(null);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [savedOrders, setSavedOrders] = useState(() => {
  const orders = localStorage.getItem("orderflow_orders");
  return orders ? JSON.parse(orders) : [];
});


const customersData = [
  {
    id: "CUS-001",
    name: "Crystal",
    email: "crystal@gmail.com",
    phone: "0771234567",
    orders: 3,
  },
  {
    id: "CUS-002",
    name: "Sarah",
    email: "sarah@gmail.com",
    phone: "0772345678",
    orders: 2,
  },
  {
    id: "CUS-003",
    name: "John",
    email: "john@gmail.com",
    phone: "0773456789",
    orders: 1,
  },
];


const customersWithOrderCounts = customers.map((customer) => {
  const customerOrders = savedOrders.filter(
    (order) =>
      order.customer.toLowerCase() === customer.name.toLowerCase() &&
      order.orderStatus !== "Cancelled"
  );

  const orderCount = customerOrders.length;

  const totalSpent = customerOrders.reduce(
    (total, order) => total + Number(order.total),
    0
  );


  const loyaltyStatus =
  orderCount >= 5
    ? "Loyal Customer"
    : orderCount >= 2
    ? "Returning Customer"
    : "New Customer";

return {
  ...customer,
  orders: orderCount,
  totalSpent: totalSpent,
  loyaltyStatus: loyaltyStatus,
}; });



const totalCustomerRevenue = customersWithOrderCounts.reduce(
  (total, customer) => total + customer.totalSpent,
  0
);

const topCustomers = [...customersWithOrderCounts]
  .filter((customer) => customer.totalSpent > 0)
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5);

const filteredCustomers = customersWithOrderCounts.filter((customer) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    customer.name.toLowerCase().includes(search) ||
    customer.email.toLowerCase().includes(search) ||
    customer.phone.includes(search);

  const matchesLoyalty =
    loyaltyFilter === "All" ||
    customer.loyaltyStatus === loyaltyFilter;

  return matchesSearch && matchesLoyalty;
});

const sortedCustomers = [...filteredCustomers].sort((a, b) => {
  if (sortOption === "name") {
    return a.name.localeCompare(b.name);
  }

  if (sortOption === "spent") {
    return b.totalSpent - a.totalSpent;
  }

  if (sortOption === "orders") {
    return b.orders - a.orders;
  }

  return 0;
});


useEffect(() => {
  localStorage.setItem("orderflow_customers", JSON.stringify(customers));
}, [customers]);

useEffect(() => {
  const orders = localStorage.getItem("orderflow_orders");
  setSavedOrders(orders ? JSON.parse(orders) : []);
}, [customers]);

const handleEditCustomer = (customer) => {
  setEditingCustomerId(customer.id);
  setCustomerName(customer.name);
  setCustomerEmail(customer.email);
  setCustomerPhone(customer.phone);
  setShowCustomerForm(true);
};

const handleUpdateCustomer = (event) => {
  event.preventDefault();

  const cleanName = customerName.trim();
  const cleanEmail = customerEmail.trim();
  const cleanPhone = customerPhone.trim();

  if (!cleanName || !cleanEmail || !cleanPhone) {
    alert("Please fill in all customer fields.");
    return;
  }

  setCustomers((previousCustomers) =>
    previousCustomers.map((customer) =>
      customer.id === editingCustomerId
        ? {
            ...customer,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
          }
        : customer
    )
  );

  window.dispatchEvent(new Event("customersUpdated"));

  setEditingCustomerId(null);
  setCustomerName("");
  setCustomerEmail("");
  setCustomerPhone("");
  setShowCustomerForm(false);
};

const handleAddCustomer = (event) => {
  event.preventDefault();

  const cleanName = customerName.trim();
  const cleanEmail = customerEmail.trim();
  const cleanPhone = customerPhone.trim();

  if (!cleanName || !cleanEmail || !cleanPhone) {
    alert("Please fill in all customer fields.");
    return;
  }

  const newCustomer = {
    id: `CUS-${String(Date.now()).slice(-6)}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    orders: 0,
  };

  setCustomers((previousCustomers) => [
    ...previousCustomers,
    newCustomer,
  ]); 
  window.dispatchEvent(new Event("customersUpdated"));

  setCustomerName("");
  setCustomerEmail("");
  setCustomerPhone("");
  setShowCustomerForm(false);
};

const handleDeleteCustomer = (customerId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmed) return;

  setCustomers((previousCustomers) =>
    previousCustomers.filter((customer) => customer.id !== customerId)
  );

window.dispatchEvent(new Event("customersUpdated"));
};


return ( <div className="customers-page">
   <div className="customers-header"> 
<div> <h1>Customers</h1> <p>Manage your customers and their information.</p> </div>
    <button
  className="add-customer-button"
  onClick={() => setShowCustomerForm(true)}
>
  + Add Customer
</button>
  </div>

  <div className="customer-stat-card">
  <h3>Total Customer Revenue</h3>
  <p>${totalCustomerRevenue.toFixed(2)}</p>
</div>
<div className="top-customers-card">
  <h2>Top Customers</h2>
  {topCustomers.length > 0 ? (
    topCustomers.map((customer, index) => (
      <div className="top-customer-item" key={customer.id}>
        <div>
          <strong>#{index + 1} {customer.name}</strong>
          <p>{customer.orders} orders</p>
        </div>
        <strong>${customer.totalSpent.toFixed(2)}</strong>
      </div>
    ))
  ) : (
    <p>No customer spending data available yet.</p>
  )}
</div>
  <div className="customers-controls">
    <select
  value={loyaltyFilter}
  onChange={(event) => setLoyaltyFilter(event.target.value)}
>
  <option value="All">All Customers</option>
  <option value="New Customer">New Customers</option>
  <option value="Returning Customer">Returning Customers</option>
  <option value="Loyal Customer">Loyal Customers</option>
</select>
<select
  value={sortOption}
  onChange={(event) => setSortOption(event.target.value)}
>
  <option value="name">Name (A–Z)</option>
  <option value="spent">Highest Spending</option>
  <option value="orders">Most Orders</option>
</select>
  <input
    type="text"
    placeholder="Search by name, email, or phone..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />
</div>

{showCustomerForm && (
  <div className="customer-form-container">
    <div className="customer-form-header">
      <h2>{editingCustomerId ? "Edit Customer" : "Add New Customer"}</h2>

      <button
        type="button"
        onClick={() => setShowCustomerForm(false)}
      >
        ✕
      </button>
    </div>

    <form className="customer-form" onSubmit={editingCustomerId ? handleUpdateCustomer : handleAddCustomer}>
      <label>
        Customer Name
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
        />
      </label>

      <label>
        Email Address
        <input
          type="email"
          placeholder="Enter email address"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Phone Number
        <input
          type="tel"
          placeholder="Enter phone number"
          value={customerPhone}
          onChange={(event) => setCustomerPhone(event.target.value)}
          required
        />
      </label>
<button type="submit">
  {editingCustomerId ? "Update Customer" : "Save Customer"}
</button>
    </form>
  </div>
)}
{selectedCustomer && (
  <div className="customer-order-history">
    {(() => {
  const customerOrders = savedOrders.filter(
    (order) =>
      order.customer?.toLowerCase() ===
        selectedCustomer.name.toLowerCase() &&
      order.orderStatus !== "Cancelled"
  );

  const totalSpent = customerOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const lastOrder = customerOrders
    .filter((order) => order.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

  return (
    <div className="customer-profile-summary">
      <p>Total Orders: {customerOrders.length}</p>
      <p>Total Spent: ${totalSpent.toFixed(2)}</p>
      <p>
        Last Order:{" "}
        {lastOrder
          ? new Date(lastOrder.createdAt).toLocaleDateString()
          : "No orders yet"}
      </p>
    </div>
  );
})()}
    <h2>Orders for {selectedCustomer.name}</h2>

    <button onClick={() => setSelectedCustomer(null)}>
      Close
    </button>

    {savedOrders.filter(
      (order) =>
        order.customer &&
        order.customer.toLowerCase() ===
          selectedCustomer.name.toLowerCase()
    ).length === 0 ? (
      <p>No orders found for this customer.</p>
    ) : (
      savedOrders
        .filter(
          (order) =>
            order.customer &&
            order.customer.toLowerCase() ===
              selectedCustomer.name.toLowerCase()
        )
        .map((order) => (
          <div key={order.id}>
            <p>Order ID: {order.id}</p>
<p>Product: {order.productName}</p>

<p>
  Order Date:{" "}
  {order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "Date unavailable"}
</p>

<p>Total: ${Number(order.total).toFixed(2)}</p>
<p>
  Status:{" "}
  <span className={`order-status-badge ${order.orderStatus.toLowerCase()}`}>
    {order.orderStatus}
  </span>
</p>
<p>
  Payment:{" "}
  <span className={`payment-status-badge ${(order.paymentStatus || "pending").toLowerCase().replace(/\s+/g, "-")}`}>
    {order.paymentStatus || "Pending"}
  </span>
</p>
          </div>
        ))
    )}
  </div>
)}
  <div className="customers-table-container">
    <table className="customers-table">
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Orders</th>
          <th>Total Spent</th>
          <th>Loyalty Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
  {filteredCustomers.length > 0 ? (
   sortedCustomers.map((customer) => (
      <tr key={customer.id}>
        <td>{customer.id}</td>
        <td>{customer.name}</td>
        <td>{customer.email}</td>
        <td>{customer.phone}</td>
        <td>{customer.orders}</td>
        <td>${customer.totalSpent.toFixed(2)}</td>
        <td> <span className={`loyalty-badge ${customer.loyaltyStatus.toLowerCase().replace(/\s+/g, "-")}`}>
    {customer.loyaltyStatus}
  </span> </td>
        <td>
  <div className="customer-actions">
    <button
      type="button"
      className="edit-customer-button"
      onClick={() => handleEditCustomer(customer)}
    >
      Edit
    </button>

    <button
      type="button"
      className="delete-customer-button"
      onClick={() => handleDeleteCustomer(customer.id)}
    >
      Delete
    </button>

    <button
      type="button"
      className="view-orders-button"
      onClick={() => setSelectedCustomer(customer)}
    >
      View Orders
    </button>
  </div>
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="no-orders">
        No customers found. Try another search.
      </td>
    </tr>
  )}

</tbody>
       
    </table>
  </div>
</div>

);
}
