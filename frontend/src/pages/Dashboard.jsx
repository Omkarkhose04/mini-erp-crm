import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [challans, setChallans] = useState([]);
    const [movements, setMovements] = useState([]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [
                customersResponse,
                productsResponse,
                challansResponse,
                movementsResponse,
            ] = await Promise.all([
                api.get("/customers"),
                api.get("/products"),
                api.get("/challans"),
                api.get("/inventory/movements"),
            ]);

            setCustomers(customersResponse.data.customers || []);
            setProducts(productsResponse.data.products || []);
            setChallans(challansResponse.data.challans || []);
            setMovements(movementsResponse.data.movements || []);
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const lowStockProducts = products.filter(
        (product) => product.currentStock <= product.minimumStock
    );

    const confirmedChallans = challans.filter(
        (challan) => challan.status === "CONFIRMED"
    );

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

                    <Link
                        to="/"
                        className="sidebar-link active"
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
                        className="sidebar-link"
                    >
                        <span>▤</span>
                        Challans
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="avatar">
                            {(user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="sidebar-user-info">
                            <strong>
                                {user.name || "User"}
                            </strong>

                            <span>
                                {user.role || "USER"}
                            </span>
                        </div>

                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}

            <main className="main-content">

                {/* TOP HEADER */}

                <header className="top-header">

                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Overview of your business operations
                        </p>
                    </div>

                    <div className="header-right">

                        <div className="header-date">
                            <span>Today</span>
                            <strong>
                                {new Date().toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </strong>
                        </div>

                        <div className="header-avatar">
                            {(user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </header>

                {/* WELCOME BANNER */}

                <section className="welcome-banner">

                    <div>
                        <span className="welcome-label">
                            GOOD TO SEE YOU 👋
                        </span>

                        <h2>
                            Welcome back, {user.name || "User"}
                        </h2>

                        <p>
                            Here's a quick overview of what's
                            happening across your business today.
                        </p>
                    </div>

                    <div className="welcome-decoration">
                        ◈
                    </div>

                </section>

                {/* STATISTICS */}

                <section className="stats-grid">

                    <div className="stat-card blue-card">

                        <div className="stat-top">
                            <div className="stat-icon">
                                👥
                            </div>

                            <span className="stat-label">
                                CUSTOMERS
                            </span>
                        </div>

                        <h3>{customers.length}</h3>

                        <p>Total registered customers</p>

                    </div>

                    <div className="stat-card purple-card">

                        <div className="stat-top">
                            <div className="stat-icon">
                                📦
                            </div>

                            <span className="stat-label">
                                PRODUCTS
                            </span>
                        </div>

                        <h3>{products.length}</h3>

                        <p>Products in inventory</p>

                    </div>

                    <div className="stat-card green-card">

                        <div className="stat-top">
                            <div className="stat-icon">
                                🧾
                            </div>

                            <span className="stat-label">
                                CONFIRMED CHALLANS
                            </span>
                        </div>

                        <h3>{confirmedChallans.length}</h3>

                        <p>Successfully processed</p>

                    </div>

                    <div className="stat-card orange-card">

                        <div className="stat-top">
                            <div className="stat-icon">
                                ⚠
                            </div>

                            <span className="stat-label">
                                LOW STOCK
                            </span>
                        </div>

                        <h3>{lowStockProducts.length}</h3>

                        <p>Products need attention</p>

                    </div>

                </section>

                {/* QUICK ACTIONS */}

                <section className="dashboard-block">

                    <div className="block-heading">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>
                                Frequently used operations
                            </p>
                        </div>
                    </div>

                    <div className="actions-grid">

                        <Link
                            to="/customers"
                            className="action-card"
                        >
                            <div className="action-icon blue-icon">
                                👥
                            </div>

                            <div>
                                <strong>
                                    Manage Customers
                                </strong>

                                <span>
                                    View and add customers
                                </span>
                            </div>

                            <b>→</b>
                        </Link>

                        <Link
                            to="/products"
                            className="action-card"
                        >
                            <div className="action-icon purple-icon">
                                📦
                            </div>

                            <div>
                                <strong>
                                    Manage Products
                                </strong>

                                <span>
                                    View product catalog
                                </span>
                            </div>

                            <b>→</b>
                        </Link>

                        <Link
                            to="/inventory"
                            className="action-card"
                        >
                            <div className="action-icon green-icon">
                                📊
                            </div>

                            <div>
                                <strong>
                                    Stock Management
                                </strong>

                                <span>
                                    Track stock movements
                                </span>
                            </div>

                            <b>→</b>
                        </Link>

                        <Link
                            to="/challans"
                            className="action-card"
                        >
                            <div className="action-icon orange-icon">
                                🧾
                            </div>

                            <div>
                                <strong>
                                    Sales Challans
                                </strong>

                                <span>
                                    Create and manage challans
                                </span>
                            </div>

                            <b>→</b>
                        </Link>

                    </div>

                </section>

                {/* LOWER CONTENT */}

                <div className="dashboard-columns">

                    {/* LOW STOCK */}

                    <section className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Low Stock Alerts</h2>
                                <p>
                                    Products requiring attention
                                </p>
                            </div>

                            <Link to="/products">
                                View all
                            </Link>

                        </div>

                        {lowStockProducts.length === 0 ? (

                            <div className="success-empty">

                                <div>✓</div>

                                <strong>
                                    Stock levels look good
                                </strong>

                                <span>
                                    No products are below their
                                    minimum stock level.
                                </span>

                            </div>

                        ) : (

                            <div className="alert-list">

                                {lowStockProducts
                                    .slice(0, 5)
                                    .map((product) => (

                                        <div
                                            className="alert-item"
                                            key={product.id}
                                        >

                                            <div className="alert-product-icon">
                                                !
                                            </div>

                                            <div className="alert-product-info">

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <span>
                                                    SKU: {product.sku}
                                                </span>

                                            </div>

                                            <div className="alert-stock">

                                                <strong>
                                                    {product.currentStock}
                                                </strong>

                                                <span>
                                                    / {product.minimumStock} min
                                                </span>

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        )}

                    </section>

                    {/* RECENT MOVEMENTS */}

                    <section className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Recent Movements</h2>
                                <p>
                                    Latest inventory activity
                                </p>
                            </div>

                            <Link to="/inventory">
                                View all
                            </Link>

                        </div>

                        {movements.length === 0 ? (

                            <div className="empty-panel">
                                No movements found.
                            </div>

                        ) : (

                            <div className="movement-list">

                                {movements
                                    .slice(0, 5)
                                    .map((movement) => (

                                        <div
                                            className="movement-item"
                                            key={movement.id}
                                        >

                                            <div
                                                className={
                                                    movement.movementType === "IN"
                                                        ? "movement-icon in"
                                                        : "movement-icon out"
                                                }
                                            >
                                                {movement.movementType === "IN"
                                                    ? "↓"
                                                    : "↑"}
                                            </div>

                                            <div className="movement-info">

                                                <strong>
                                                    {movement.product?.name}
                                                </strong>

                                                <span>
                                                    {movement.reason}
                                                </span>

                                            </div>

                                            <div
                                                className={
                                                    movement.movementType === "IN"
                                                        ? "movement-quantity in-text"
                                                        : "movement-quantity out-text"
                                                }
                                            >
                                                {movement.movementType === "IN"
                                                    ? "+"
                                                    : "-"}
                                                {movement.quantity}
                                            </div>

                                        </div>

                                    ))}

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;