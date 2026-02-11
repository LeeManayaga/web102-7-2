import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Artwork {
  objectName?: string;
  objectDate?: string;
}

export default function Charts({ artworks }: { artworks: Artwork[] }) {
  const [show, setShow] = useState<"type" | "century">("type");

  // 🎨 1️⃣ Chart by Type
  const typeData = [
    { name: "Painting", value: artworks.filter((a) => a.objectName === "Painting").length },
    { name: "Print", value: artworks.filter((a) => a.objectName === "Print").length },
    { name: "Sculpture", value: artworks.filter((a) => a.objectName === "Sculpture").length },
    { name: "Ceramic", value: artworks.filter((a) => a.objectName === "Ceramic").length },
  ];

  // 🕰️ 2️⃣ Chart by Century
  const centuryData = artworks.reduce((acc: Record<string, number>, art) => {
    const year = parseInt(art.objectDate?.match(/\d{4}/)?.[0]);
    if (!isNaN(year)) {
      const century = Math.ceil(year / 100);
      const label = `${century}00s`;
      acc[label] = (acc[label] || 0) + 1;
    }
    return acc;
  }, {});
  const formattedCenturyData = Object.entries(centuryData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"];

  return (
    <div className="charts">
      <h2>📊 Data Visualization</h2>
      <p style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "20px", color: "#555", lineHeight: "1.5" }}>
        This dashboard highlights the diversity of artworks within The Met collection. 
        The first chart shows the distribution of artwork types—revealing which forms of art are most common. 
        The second chart organizes artworks by the century they were created in, showing how the museum's collection spans multiple historical periods. 
        Together, these visualizations help illustrate how artistic production changes over time and across mediums.
      </p>
      <button
        className="toggle-btn"
        onClick={() => setShow(show === "type" ? "century" : "type")}
      >
        Toggle Chart ({show === "type" ? "Switch to Century" : "Switch to Type"})
      </button>

      {/* --- Bar Chart (Type Distribution) --- */}
      {show === "type" && (
        <div>
          <h3>🎨 Artwork Distribution by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0077b6" />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ marginTop: "10px", fontSize: "0.95rem", color: "#444" }}>
            This chart shows how many artworks belong to each major category, making it easy to see which artistic mediums are most common in the collection.
          </p>
        </div>
      )}

      {/* --- Pie Chart (Century Distribution) --- */}
      {show === "century" && (
        <div>
          <h3>🕰️ Artwork by Century</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedCenturyData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {formattedCenturyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p style={{ marginTop: "10px", fontSize: "0.95rem", color: "#444" }}>
            This chart organizes artworks by century, helping us understand which historical periods are most represented in The Met's collection.
          </p>
        </div>
      )}
    </div>
  );
}
