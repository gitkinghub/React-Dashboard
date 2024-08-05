import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./products.css";

const ITEMS_PER_PAGE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editForm, setEditForm] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    category: "",
    createdAt: "",
    available: false
  });

  const [newProductForm, setNewProductForm] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    category: "",
    createdAt: new Date().toISOString(),
    available: false
  });

  const [filterField, setFilterField] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditForm({
      image: product.image,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      createdAt: product.createdAt,
      available: product.available
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/products/${editingProduct.id}`,
        editForm
      );
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...editForm }
            : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Error editing product", err);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewProductForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        newProductForm
      );
      setProducts([...products, response.data]);
      setAddingProduct(false);
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // export products
  const navigate = useNavigate();
  const handleExport = () => {
    const dataToExport = displayedProducts;
    localStorage.removeItem("exportedData"); // Clear previous data
    localStorage.setItem(
      "exportedData",
      JSON.stringify({ type: "products", data: dataToExport })
    );
    navigate("/reports");
  };

  // Filter and search logic
  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearchQuery =
        searchQuery === "" ||
        Object.keys(product).some((key) =>
          product[key]
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        filterField === "" ||
        product[filterField]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesSearchQuery && matchesFilter;
    })
    .sort((a, b) => {
      if (filterField === "") return 0;
      if (a[filterField] < b[filterField]) return -1;
      if (a[filterField] > b[filterField]) return 1;
      return 0;
    });

  const pageCount = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );
  const displayedProducts = filteredAndSortedProducts.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-container">
      <div className="header">
        <h1>Products</h1>
        <button
          className="add-product-button"
          onClick={() => setAddingProduct(true)}
        >
          Add Product
        </button>
      </div>

      {/* Search and filter inputs */}
      <div className="filters">
        <div className="search-container">
          <img src="/search.svg" alt="" className="icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search here ..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-container">
          <label className="filter-label">Filter</label>
          <select
            value={filterField}
            onChange={handleFilterFieldChange}
            className="filter-select"
          >
            <option value="">Select field</option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="description">Description</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
            <option value="createdAt">Created At</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="products-table responsive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td data-label="name">{product.name}</td>
                <td data-label="description">{product.description}</td>
                <td data-label="price">{product.price}</td>
                <td data-label="category">{product.category}</td>
                <td data-label="createdAt">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td data-label="available">
                  <span
                    className={`status ${
                      product.available ? "available" : "not-available"
                    }`}
                  >
                    {product.available ? "Yes" : "No"}
                  </span>
                </td>
                <td data-label="actions">
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                  <button onClick={() => startEditing(product)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page === pageCount - 1}
        >
          Next
        </button>
        <button className="export-button" onClick={handleExport}>
          Export
        </button>
      </div>

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Available:</label>
                <select
                  name="available"
                  value={editForm.available}
                  onChange={handleEditChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {addingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Add Product</h2>
            <form onSubmit={handleAddSubmit}>
              <div>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={newProductForm.image}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newProductForm.name}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={newProductForm.description}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={newProductForm.price}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={newProductForm.category}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Available:</label>
                <select
                  name="available"
                  value={newProductForm.available}
                  onChange={handleAddChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setAddingProduct(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
