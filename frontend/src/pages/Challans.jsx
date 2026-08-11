import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Challans() {
    const [challans, setChallans] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        customerId: "",
        productId: "",
        quantity: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [
                challansResponse,
                customersResponse,
                productsResponse,
            ] = await Promise.all([
                api.get("/challans"),
                api.get("/customers"),
                api.get("/products"),
            ]);

            setChallans(
                challansResponse.data.challans || []
            );

            setCustomers(
                customersResponse.data.customers || []
            );

            setProducts(
                productsResponse.data.products || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load challan data"
            );
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const createChallan = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await api.post(
                "/challans",
                {
                    customerId: Number(form.customerId),
                    items: [
                        {
                            productId: Number(form.productId),
                            quantity: Number(form.quantity),
                        },
                    ],
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to create challan"
                );
            }

            setMessage(
                "Challan created successfully"
            );

            setForm({
                customerId: "",
                productId: "",
                quantity: "",
            });

            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create challan"
            );
        } finally {
            setLoading(false);
        }
    };

    const confirmChallan = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to confirm this challan? Stock will be reduced."
        );

        if (!confirmed) return;

        setMessage("");
        setError("");

        try {
            const response = await api.post(
                `/challans/${id}/confirm`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to confirm challan"
                );
            }

            setMessage(
                "Challan confirmed successfully"
            );

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to confirm challan"
            );
        }
    };

    const cancelChallan = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this challan?"
        );

        if (!confirmed) return;

        setMessage("");
        setError("");

        try {
            const response = await api.post(
                `/challans/${id}/cancel`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to cancel challan"
                );
            }

            setMessage(
                "Challan cancelled successfully"
            );

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to cancel challan"
            );
        }
    };

    const selectedProduct = products.find(
        (product) =>
            product.id === Number(form.productId)
    );

    const estimatedTotal =
        selectedProduct && form.quantity
            ? Number(selectedProduct.unitPrice) *
            Number(form.quantity)
            : 0;

    return (
        <div className="erp-layout">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-logo">
                        M
                    </div>

                    <div>
                        <h2>Mini ERP</h2>
                        <span>Operations</span>
                    </div>

                </div>

                <div className="sidebar-label">
                    MAIN MENU
                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/"
                        className="sidebar-link"
                    >
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
                        className="sidebar-link"
                    >
                        <span>◫</span>
                        Inventory
                    </Link>

                    <Link
                        to="/challans"
                        className="sidebar-link active"
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

                        <h1>Sales Challans</h1>

                        <p>
                            Create and manage customer delivery
                            challans
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
                            : "+ Create Challan"}
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

                {/* CREATE CHALLAN */}

                {showForm && (

                    <section className="entity-form">

                        <div className="form-title">

                            <div>

                                <h2>
                                    Create New Challan
                                </h2>

                                <p>
                                    Select customer, product and
                                    quantity
                                </p>

                            </div>

                        </div>

                        <form onSubmit={createChallan}>

                            <div className="entity-form-grid">

                                <div className="input-group">

                                    <label>
                                        Customer *
                                    </label>

                                    <select
                                        name="customerId"
                                        value={form.customerId}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select customer
                                        </option>

                                        {customers.map(
                                            (customer) => (

                                                <option
                                                    key={customer.id}
                                                    value={customer.id}
                                                >
                                                    {customer.name}
                                                    {customer.businessName
                                                        ? ` — ${customer.businessName}`
                                                        : ""}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

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
                                                    {product.sku}{" "}
                                                    ({product.currentStock} in stock)
                                                </option>

                                            )
                                        )}

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
                                        Estimated Total
                                    </label>

                                    <div className="calculated-total">
                                        ₹{estimatedTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>

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
                                        : "Create Draft Challan"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {/* CHALLAN LIST */}

                <section className="entity-panel">

                    <div className="entity-panel-header">

                        <div>

                            <h2>
                                Challan Records
                            </h2>

                            <p>
                                {challans.length} challan
                                {challans.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>

                        </div>

                    </div>

                    {challans.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🧾
                            </div>

                            <h3>
                                No challans found
                            </h3>

                            <p>
                                Create your first sales challan.
                            </p>

                        </div>

                    ) : (

                        <div className="challan-list">

                            {challans.map(
                                (challan) => (

                                    <div
                                        className="challan-card"
                                        key={challan.id}
                                    >

                                        <div className="challan-card-header">

                                            <div className="challan-number">

                                                <div className="challan-icon">
                                                    🧾
                                                </div>

                                                <div>

                                                    <strong>
                                                        {challan.challanNumber}
                                                    </strong>

                                                    <span>
                                                        Created{" "}
                                                        {new Date(
                                                            challan.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                            <span
                                                className={`challan-status ${challan.status.toLowerCase()}`}
                                            >
                                                {challan.status}
                                            </span>

                                        </div>

                                        <div className="challan-info-grid">

                                            <div>

                                                <span className="info-label">
                                                    CUSTOMER
                                                </span>

                                                <strong>
                                                    {challan.customer?.name ||
                                                        "Unknown"}
                                                </strong>

                                                <small>
                                                    {challan.customer
                                                        ?.businessName || ""}
                                                </small>

                                            </div>

                                            <div>

                                                <span className="info-label">
                                                    TOTAL QUANTITY
                                                </span>

                                                <strong>
                                                    {challan.totalQuantity}
                                                </strong>

                                                <small>
                                                    item
                                                    {challan.totalQuantity !==
                                                        1
                                                        ? "s"
                                                        : ""}
                                                </small>

                                            </div>

                                            <div>

                                                <span className="info-label">
                                                    TOTAL VALUE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {challan.items
                                                        ?.reduce(
                                                            (
                                                                total,
                                                                item
                                                            ) =>
                                                                total +
                                                                Number(
                                                                    item.total
                                                                ),
                                                            0
                                                        )
                                                        .toLocaleString(
                                                            "en-IN"
                                                        )}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="challan-items">

                                            {challan.items?.map(
                                                (item) => (

                                                    <div
                                                        className="challan-item"
                                                        key={item.id}
                                                    >

                                                        <div>

                                                            <strong>
                                                                {item.productNameSnapshot}
                                                            </strong>

                                                            <span>
                                                                {item.skuSnapshot}
                                                            </span>

                                                        </div>

                                                        <div>
                                                            ×{" "}
                                                            {item.quantity}
                                                        </div>

                                                        <div>
                                                            ₹
                                                            {Number(
                                                                item.total
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                        {challan.status ===
                                            "DRAFT" && (

                                                <div className="challan-actions">

                                                    <button
                                                        className="confirm-btn"
                                                        onClick={() =>
                                                            confirmChallan(
                                                                challan.id
                                                            )
                                                        }
                                                    >
                                                        ✓ Confirm Challan
                                                    </button>

                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() =>
                                                            cancelChallan(
                                                                challan.id
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Challans;