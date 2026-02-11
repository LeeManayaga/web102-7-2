import { Link } from "react-router-dom";
import "./App.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <Link to="/">Dashboard</Link>
      <a href="https://metmuseum.org" target="_blank" rel="noreferrer">
        The Met Collection
      </a>
    </div>
  );
}
