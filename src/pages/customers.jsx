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
  const orderCount = savedOrders.filter(
    (order) =>
      order.customer.toLowerCase() === customer.name.toLowerCase()
  ).length;

  return {
    ...customer,
    orders: orderCount,
  };
});


 const filteredCustomers = customersWithOrderCounts.filter((customer) => {
  const search = searchTerm.toLowerCase();

  return (
    customer.name.toLowerCase().includes(search) ||
    customer.email.toLowerCase().includes(search) ||
    customer.phone.includes(search)
  );
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
  <div className="customers-controls">
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

  <div className="customers-table-container">
    <table className="customers-table">
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Orders</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer) => (
      <tr key={customer.id}>
        <td>{customer.id}</td>
        <td>{customer.name}</td>
        <td>{customer.email}</td>
        <td>{customer.phone}</td>
        <td>{customer.orders}</td>
        <td>
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
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="no-orders">
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
