import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import Settings from "./routes/Settings";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            {/* App shell */}
            <div className="app-shell d-flex flex-column min-vh-100">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
                    <div className="container-xxl">
                        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                            <span className="brand-mark" aria-hidden></span>
                            <span className="fw-semibold">Strudel Reactor</span>
                        </Link>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainNav"
                            aria-controls="mainNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>

                        <div className="collapse navbar-collapse" id="mainNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <NavLink
                                        end
                                        to="/"
                                        className={({ isActive }) =>
                                            "nav-link px-3" + (isActive ? " active fw-semibold" : "")
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            "nav-link px-3" + (isActive ? " active fw-semibold" : "")
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/settings"
                                        className={({ isActive }) =>
                                            "nav-link px-3" + (isActive ? " active fw-semibold" : "")
                                        }
                                    >
                                        Settings
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Routed pages */}
                <main className="flex-grow-1">
                    <div className="container-xxl py-4">
                        <div className="content-card card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-top">
                    <div className="container-xxl small py-3 d-flex justify-content-between flex-wrap gap-2 text-body-secondary">
                        <span>© {new Date().getFullYear()} Strudel Reactor</span>
                        <span>Built with React + Bootstrap 5</span>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}
