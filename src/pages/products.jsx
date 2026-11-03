import { useState , useEffect} from "react";


export default function Products() {
const [showProductForm, setShowProductForm] = useState(false);

const [productName, setProductName] = useState("");
const [productCategory, setProductCategory] = useState("");
const [productPrice, setProductPrice] = useState("");
const [productStock, setProductStock] = useState("");
const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem("orderflow_products");

  return savedProducts ? JSON.parse(savedProducts) : [];
});
const [editingProductId, setEditingProductId] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const categories = [
  "All",
  ...new Set(products.map((product) => product.category)),
];
const [sortOption, setSortOption] = useState("name");

useEffect(() => {
  localStorage.setItem("orderflow_products", JSON.stringify(products));
}, [products]);

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

const totalProducts = products.length;

const lowStock = products.filter(
  (product) => product.stock > 0 && product.stock <= 5
).length;

const outOfStock = products.filter(
  (product) => product.stock === 0
).length;

const filteredProducts = products.filter((product) => {
  const matchesSearch =
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortOption === "name") {
    return a.name.localeCompare(b.name);
  }

  if (sortOption === "price-low") {
    return a.price - b.price;
  }

  if (sortOption === "price-high") {
    return b.price - a.price;
  }

  if (sortOption === "stock") {
    return a.stock - b.stock;
  }

  return 0;
});

const handleAddProduct = (event) => {
  event.preventDefault();

  const cleanName = productName.trim();
  const cleanCategory = productCategory.trim();
  const numericPrice = Number(productPrice);
  const numericStock = Number(productStock);

  if (
    !cleanName ||
    !cleanCategory ||
    productPrice === "" ||
    productStock === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0 ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    alert("Please enter valid product details.");
    return;
  }

  const newProduct = {
    id: `PROD-${String(Date.now()).slice(-6)}`,
    name: cleanName,
    category: cleanCategory,
    price: numericPrice,
    stock: numericStock,
  };

  setProducts((previousProducts) => [
    ...previousProducts,
    newProduct,
  ]);

  setProductName("");
  setProductCategory("");
  setProductPrice("");
  setProductStock("");
  setShowProductForm(false);
};

const handleEditProduct = (product) => {
  setEditingProductId(product.id);
  setProductName(product.name);
  setProductCategory(product.category);
  setProductPrice(String(product.price));
  setProductStock(String(product.stock));
  setShowProductForm(true);
};

const handleUpdateProduct = (event) => {
  event.preventDefault();

  const cleanName = productName.trim();
  const cleanCategory = productCategory.trim();
  const numericPrice = Number(productPrice);
  const numericStock = Number(productStock);

  if (
    !cleanName ||
    !cleanCategory ||
    productPrice === "" ||
    productStock === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0 ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    alert("Please enter valid product details.");
    return;
  }

  setProducts((previousProducts) =>
    previousProducts.map((product) =>
      product.id === editingProductId
        ? {
            ...product,
            name: cleanName,
            category: cleanCategory,
            price: numericPrice,
            stock: numericStock,
          }
        : product
    )
  );

  setEditingProductId(null);
  setProductName("");
  setProductCategory("");
  setProductPrice("");
  setProductStock("");
  setShowProductForm(false);
};


const handleDeleteProduct = (productId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  setProducts((previousProducts) =>
    previousProducts.filter((product) => product.id !== productId)
  );
};


  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your footwear inventory and stock.</p>
        </div>

        <button className="add-product-button" onClick={() => setShowProductForm(true)}>
          + Add Product
        </button>
      </div>

{showProductForm && (
  <div className="product-form-card">
  <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>

    <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
      <div className="product-form-group">
        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="Enter product name"
        />
      </div>

      <div className="product-form-group">
        <label>Category</label>
        <input
          type="text"
          value={productCategory}
          onChange={(event) => setProductCategory(event.target.value)}
          placeholder="e.g. Sneakers, Sandals"
        />
      </div>

      <div className="product-form-group">
        <label>Price ($)</label>
        <input
          type="number"
          value={productPrice}
          onChange={(event) => setProductPrice(event.target.value)}
          placeholder="Enter price"
        />
      </div>

      <div className="product-form-group">
        <label>Stock Quantity</label>
        <input
          type="number"
          value={productStock}
          onChange={(event) => setProductStock(event.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <div className="product-form-actions">
        <button type="submit">
  {editingProductId ? "Update Product" : "Save Product"}
</button>

        <button
          type="button"
          onClick={() => setShowProductForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
      <div className="products-stats">
        <div className="product-stat-card">
          <h3>Total Products</h3>
         <p>{totalProducts}</p>
        </div>

        <div className="product-stat-card">
          <h3>Low Stock</h3>
       <p>{lowStock}</p>
        </div>

        <div className="product-stat-card">
          <h3>Out of Stock</h3>
         <p>{outOfStock}</p>
        </div>
      </div>
      <div className="products-table-card">
  <h2>All Products</h2>
  <div className="products-controls">
  <select
  value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
>
  {categories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

<select
  value={sortOption}
  onChange={(event) => setSortOption(event.target.value)}
>
  <option value="name">Name (A–Z)</option>
  <option value="price-low">Price (Low to High)</option>
  <option value="price-high">Price (High to Low)</option>
  <option value="stock">Stock (Lowest First)</option>
</select>
  <input
  type="text"
  placeholder="Search products by name or category..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
</div>
  <table className="products-table">
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Stock Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {products.length === 0 ? (
        <tr>
          <td colSpan="6">No products added yet.</td>
        </tr>
      ) : (
      sortedProducts.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>{product.stock}</td>
            <td>
  <span
    className={
      product.stock === 0
        ? "stock-out"
        : product.stock <= 5
        ? "stock-low"
        : "stock-in"
    }
  >
    {product.stock === 0
      ? "Out of Stock"
      : product.stock <= 5
      ? "Low Stock"
      : "In Stock"}
  </span>
</td>
            <td>
  <button
    type="button"
    onClick={() => handleEditProduct(product)}
  >
    Edit
  </button>
  <button
  type="button"
  onClick={() => handleDeleteProduct(product.id)}
>
  Delete
</button>
</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}