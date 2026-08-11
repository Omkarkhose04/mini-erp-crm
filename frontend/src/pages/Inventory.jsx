import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Inventory() {
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        productId: "",
        quantity: "",
        movementType: "IN",
        reason: "",
    });

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const [productsResponse, movementsResponse] =
                await Promise.all([
                    api.get("/products"),
                    api.get("/inventory/movements"),
                ]);

            setProducts(
                productsResponse.data.products || []
            );

            setMovements(
                movementsResponse.data.movements || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load inventory"
            );
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const createMovement = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await api.post(
                "/inventory/movements",
                {
                    productId: Number(form.productId),
                    quantity: Number(form.quantity),
                    movementType: form.movementType,
                    reason: form.reason,
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to create movement"
                );
            }

            setMessage(
                `Stock ${form.movementType === "IN" ? "added" : "removed"} successfully`
            );

            setForm({
                productId: "",
                quantity: "",
                movementType: "IN",
                reason: "",
            });

            setShowForm(false);

            await loadInventory();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create stock movement"
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
                        className="sidebar-link"
                    >
                        <span>▣</span>
                        Products
                    </Link>

                    <Link
                        to="/inventory"
                        className="sidebar-link active"
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
                        <h1>Inventory</h1>

                        <p>
                            Manage stock levels and movements
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
                            : "+ Stock Movement"}
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

                {/* STOCK MOVEMENT FORM */}

                {showForm && (

                    <section className="entity-form">

                        <div className="form-title">

                            <div>
                                <h2>Record Stock Movement</h2>

                                <p>
                                    Add incoming stock or record outgoing stock
                                </p>
                            </div>

                        </div>

                        <form onSubmit={createMovement}>

                            <div className="entity-form-grid">

                                <div className="input-group">

                                    <label>
                                        Product *
                                    </label>

                                    <select
                                        name="productId"
                                        value={form.productId}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select product
                                        </option>

                                        {products.map(
                                            (product) => (
                                                <option
                                                    key={product.id}
                                                    value={product.id}
                                                >
                                                    {product.name} —{" "}
                                                    {product.sku}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="input-group">

                                    <label>
                                        Movement Type *
                                    </label>

                                    <select
                                        name="movementType"
                                        value={form.movementType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="IN">
                                            IN — Stock Received
                                        </option>

                                        <option value="OUT">
                                            OUT — Stock Dispatched
                                        </option>
                                    </select>

                                </div>

                                <div className="input-group">

                                    <label>
                                        Quantity *
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder="Enter quantity"
                                        required
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Reason *
                                    </label>

                                    <input
                                        name="reason"
                                        value={form.reason}
                                        onChange={handleChange}
                                        placeholder={
                                            form.movementType === "IN"
                                                ? "New purchase"
                                                : "Sales dispatch"
                                        }
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
                                        ? "Saving..."
                                        : "Record Movement"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {/* CURRENT STOCK */}

                <section className="entity-panel">

                    <div className="entity-panel-header">

                        <div>
                            <h2>Current Stock</h2>

                            <p>
                                Current inventory levels
                            </p>
                        </div>

                    </div>

                    <div className="entity-table-wrapper">

                        <table className="entity-table">

                            <thead>

                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Current Stock</th>
                                    <th>Minimum Stock</th>
                                    <th>Status</th>
                                    <th>Warehouse</th>
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
                                                    {product.sku}
                                                </td>

                                                <td>

                                                    <strong
                                                        className={
                                                            lowStock
                                                                ? "stock-number-low"
                                                                : "stock-number-good"
                                                        }
                                                    >
                                                        {product.currentStock}
                                                    </strong>

                                                </td>

                                                <td>
                                                    {product.minimumStock}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            lowStock
                                                                ? "status-badge low-stock-status"
                                                                : "status-badge stock-status"
                                                        }
                                                    >
                                                        {lowStock
                                                            ? "LOW STOCK"
                                                            : "HEALTHY"}
                                                    </span>

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

                </section>

                {/* MOVEMENT HISTORY */}

                <section
                    className="entity-panel inventory-history"
                >

                    <div className="entity-panel-header">

                        <div>
                            <h2>Movement History</h2>

                            <p>
                                Recent stock transactions
                            </p>
                        </div>

                    </div>

                    {movements.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📊
                            </div>

                            <h3>
                                No movements yet
                            </h3>

                            <p>
                                Stock movement history will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="entity-table-wrapper">

                            <table className="entity-table">

                                <thead>

                                    <tr>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Reason</th>
                                        <th>Created By</th>
                                        <th>Date</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {movements.map(
                                        (movement) => (

                                            <tr key={movement.id}>

                                                <td>

                                                    <div className="customer-cell">

                                                        <div className="product-avatar">
                                                            📦
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {movement.product?.name ||
                                                                    `Product #${movement.productId}`}
                                                            </strong>

                                                            <span>
                                                                {movement.product?.sku ||
                                                                    ""}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            movement.movementType ===
                                                                "IN"
                                                                ? "movement-in"
                                                                : "movement-out"
                                                        }
                                                    >
                                                        {movement.movementType ===
                                                            "IN"
                                                            ? "↓ IN"
                                                            : "↑ OUT"}
                                                    </span>

                                                </td>

                                                <td>

                                                    <strong
                                                        className={
                                                            movement.movementType ===
                                                                "IN"
                                                                ? "movement-positive"
                                                                : "movement-negative"
                                                        }
                                                    >
                                                        {movement.movementType ===
                                                            "IN"
                                                            ? "+"
                                                            : "-"}
                                                        {movement.quantity}
                                                    </strong>

                                                </td>

                                                <td>
                                                    {movement.reason}
                                                </td>

                                                <td>
                                                    {movement.createdBy?.name ||
                                                        "Admin"}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        movement.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                            </tr>

                                        )
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

export default Inventory;