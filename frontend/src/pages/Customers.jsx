import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        businessName: "",
        gstNumber: "",
        customerType: "RETAIL",
        address: "",
        status: "LEAD",
        followUpDate: "",
        notes: "",
    });

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = async (searchValue = "") => {
        try {
            const response = await api.get("/customers", {
                params: searchValue
                    ? { search: searchValue }
                    : {},
            });

            setCustomers(response.data.customers || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load customers"
            );
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        getCustomers(value);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const createCustomer = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post(
                "/customers",
                form
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to create customer"
                );
            }

            setMessage("Customer created successfully");

            setForm({
                name: "",
                mobile: "",
                email: "",
                businessName: "",
                gstNumber: "",
                customerType: "RETAIL",
                address: "",
                status: "LEAD",
                followUpDate: "",
                notes: "",
            });

            setShowForm(false);

            getCustomers();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create customer"
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
                        className="sidebar-link active"
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

            </aside>

            {/* MAIN */}

            <main className="main-content">

                <header className="top-header">

                    <div>
                        <h1>Customers</h1>

                        <p>
                            Manage your customer relationships
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
                            : "+ Add Customer"}
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

                {/* ADD CUSTOMER FORM */}

                {showForm && (

                    <section className="entity-form">

                        <div className="form-title">
                            <div>
                                <h2>Add New Customer</h2>

                                <p>
                                    Enter customer information below
                                </p>
                            </div>
                        </div>

                        <form onSubmit={createCustomer}>

                            <div className="form-section-title">
                                Basic Information
                            </div>

                            <div className="entity-form-grid">

                                <div className="input-group">
                                    <label>
                                        Customer Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        Mobile *
                                    </label>

                                    <input
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter mobile number"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="customer@example.com"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Business Name</label>

                                    <input
                                        name="businessName"
                                        value={form.businessName}
                                        onChange={handleChange}
                                        placeholder="Enter business name"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>GST Number</label>

                                    <input
                                        name="gstNumber"
                                        value={form.gstNumber}
                                        onChange={handleChange}
                                        placeholder="GST number"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Customer Type *</label>

                                    <select
                                        name="customerType"
                                        value={form.customerType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="RETAIL">
                                            Retail
                                        </option>

                                        <option value="WHOLESALE">
                                            Wholesale
                                        </option>

                                        <option value="DISTRIBUTOR">
                                            Distributor
                                        </option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option value="LEAD">
                                            Lead
                                        </option>

                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                        <option value="INACTIVE">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Follow-up Date</label>

                                    <input
                                        type="date"
                                        name="followUpDate"
                                        value={form.followUpDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Address *</label>

                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Customer address"
                                        required
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Notes</label>

                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        placeholder="Additional notes..."
                                        rows="3"
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
                                        : "Create Customer"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {/* CUSTOMER LIST */}

                <section className="entity-panel">

                    <div className="entity-panel-header">

                        <div>
                            <h2>Customer List</h2>

                            <p>
                                {customers.length} customer
                                {customers.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>
                        </div>

                        <div className="search-box">

                            <span>⌕</span>

                            <input
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search customers..."
                            />

                        </div>

                    </div>

                    {customers.length === 0 ? (

                        <div className="empty-state">
                            <div className="empty-icon">
                                👥
                            </div>

                            <h3>No customers found</h3>

                            <p>
                                Add your first customer to get started.
                            </p>
                        </div>

                    ) : (

                        <div className="entity-table-wrapper">

                            <table className="entity-table">

                                <thead>

                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Business</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Follow-up</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {customers.map(
                                        (customer) => (

                                            <tr key={customer.id}>

                                                <td>

                                                    <div className="customer-cell">

                                                        <div className="customer-avatar">
                                                            {customer.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {customer.name}
                                                            </strong>

                                                            <span>
                                                                ID #{customer.id}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="contact-cell">

                                                        <strong>
                                                            {customer.mobile}
                                                        </strong>

                                                        <span>
                                                            {customer.email ||
                                                                "No email"}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td>
                                                    {customer.businessName ||
                                                        "—"}
                                                </td>

                                                <td>

                                                    <span className="type-badge">
                                                        {customer.customerType}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${customer.status.toLowerCase()}`}
                                                    >
                                                        {customer.status}
                                                    </span>

                                                </td>

                                                <td>

                                                    {customer.followUpDate
                                                        ? new Date(
                                                            customer.followUpDate
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "—"}

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

export default Customers;