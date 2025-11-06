import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import Settings from "./routes/Settings";

export default function App() {
    return (
        <BrowserRouter>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
                <Link className="navbar-brand fw-semibold" to="/">Strudel Reactor</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navCollapse"
                    aria-controls="navCollapse"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse show" id="navCollapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/settings">Settings</Link></li>
                    </ul>
                </div>
            </nav>

            {/* Routed pages */}
            <div className="container py-3">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
