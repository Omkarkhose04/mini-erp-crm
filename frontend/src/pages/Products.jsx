import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Products() {
    const [products, setProducts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        currentStock: "",
        minimumStock: "",
        warehouseLocation: "",
    });

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const response = await api.get("/products");

            setProducts(response.data.products || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load products"
            );
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const createProduct = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post(
                "/products",
                {
                    ...form,
                    unitPrice: Number(form.unitPrice),
                    currentStock: Number(form.currentStock),
                    minimumStock: Number(form.minimumStock),
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to create product"
                );
            }

            setMessage("Product created successfully");

            setForm({
                name: "",
                sku: "",
                category: "",
                unitPrice: "",
                currentStock: "",
                minimumStock: "",
                warehouseLocation: "",
            });

            setShowForm(false);

            getProducts();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create product"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="erp-layout">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-logo">M</div>

                    <div>
                        <h2>Mini ERP</h2>
                        <span>Operations</span>
                    </div>
                </div>

                <div className="sidebar-label">
                    MAIN MENU
                </div>

                <nav className="sidebar-nav">

                    <Link to="/" className="sidebar-link">
                        <span>▦</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/customers"
                        className="sidebar-link"
                    >
                        <span>♙</span>
                        Customers
                    </Link>

                    <Link
                        to="/products"
                        className="sidebar-link active"
                    >
                        <span>▣</span>
                        Products
                    </Link>

                    <Link
                        to="/inventory"
                        className="sidebar-link"
                    >
                        <span>◫</span>
                        Inventory
                    </Link>

                    <Link
                        to="/challans"
                        className="sidebar-link"
                    >
                        <span>▤</span>
                        Challans
                    </Link>

                </nav>

            </aside>

            {/* MAIN */}

            <main className="main-content">

                <header className="top-header">

                    <div>
                        <h1>Products</h1>

                        <p>
                            Manage products and warehouse stock
                        </p>
                    </div>

                    <button
                        className="top-action-btn"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >
                        {showForm
                            ? "✕ Close"
                            : "+ Add Product"}
                    </button>

                </header>

                {/* MESSAGES */}

                {message && (
                    <div className="success-message">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="page-error">
                        {error}
                    </div>
                )}

                {/* CREATE PRODUCT */}

                {showForm && (

                    <section className="entity-form">

                        <div className="form-title">

                            <div>
                                <h2>Add New Product</h2>

                                <p>
                                    Enter product and inventory details
                                </p>
                            </div>

                        </div>

                        <form onSubmit={createProduct}>

                            <div className="form-section-title">
                                Product Information
                            </div>

                            <div className="entity-form-grid">

                                <div className="input-group">

                                    <label>
                                        Product Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        SKU *
                                    </label>

                                    <input
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        placeholder="e.g. WM-001"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Category *
                                    </label>

                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="Electronics"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Unit Price *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="unitPrice"
                                        value={form.unitPrice}
                                        onChange={handleChange}
                                        placeholder="599"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Current Stock *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="currentStock"
                                        value={form.currentStock}
                                        onChange={handleChange}
                                        placeholder="20"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Minimum Stock *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="minimumStock"
                                        value={form.minimumStock}
                                        onChange={handleChange}
                                        placeholder="5"
                                        required
                                    />

                                </div>

                                <div className="input-group full-width">

                                    <label>
                                        Warehouse Location *
                                    </label>

                                    <input
                                        name="warehouseLocation"
                                        value={form.warehouseLocation}
                                        onChange={handleChange}
                                        placeholder="Warehouse A"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="top-action-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Product"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {/* PRODUCT LIST */}

                <section className="entity-panel">

                    <div className="entity-panel-header">

                        <div>
                            <h2>Product Inventory</h2>

                            <p>
                                {products.length} product
                                {products.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                in catalog
                            </p>
                        </div>

                    </div>

                    {products.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📦
                            </div>

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Add your first product to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="entity-table-wrapper">

                            <table className="entity-table">

                                <thead>

                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Unit Price</th>
                                        <th>Stock</th>
                                        <th>Minimum</th>
                                        <th>Location</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {products.map(
                                        (product) => {

                                            const lowStock =
                                                product.currentStock <=
                                                product.minimumStock;

                                            return (
                                                <tr key={product.id}>

                                                    <td>

                                                        <div className="customer-cell">

                                                            <div className="product-avatar">
                                                                📦
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {product.name}
                                                                </strong>

                                                                <span>
                                                                    ID #{product.id}
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {product.sku}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <span className="type-badge">
                                                            {product.category}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        ₹{product.unitPrice}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                lowStock
                                                                    ? "stock-badge low"
                                                                    : "stock-badge good"
                                                            }
                                                        >
                                                            {product.currentStock}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {product.minimumStock}
                                                    </td>

                                                    <td>
                                                        {product.warehouseLocation}
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Products;