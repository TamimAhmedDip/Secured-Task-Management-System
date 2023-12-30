import { Link, Outlet } from "react-router-dom";
export default function Layout() {
    return (
        <div className={`body-area`}>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/create-task">Create Task</Link>
            </nav>
            <Outlet />
        </div>
    );
}
