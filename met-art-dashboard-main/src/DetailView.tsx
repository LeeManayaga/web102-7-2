import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";
import Sidebar from "./Sidebar";

interface Artwork {
  objectID: number;
  title?: string;
  objectName?: string;
  objectDate?: string;
  medium?: string;
  artistDisplayName?: string;
  artistDisplayBio?: string;
  primaryImage?: string;
  dimensions?: string;
  creditLine?: string;
  repository?: string;
}

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const [art, setArt] = useState<Artwork | null>(null);
  const [centuryData, setCenturyData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );
      const data = await res.json();
      setArt(data);

      const year = parseInt(data.objectDate?.match(/\d{4}/)?.[0]);
      if (!isNaN(year)) {
        const century = Math.ceil(year / 100);
        const deptRes = await fetch(
          "https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11"
        );
        const deptData = await deptRes.json();
        const ids = deptData.objectIDs.slice(0, 25);

        const artworks = await Promise.all(
          ids.map((id: number) =>
            fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            ).then((r) => r.json())
          )
        );

        const countPerCentury = artworks.reduce((acc: Record<string, number>, a) => {
          const yr = parseInt(a.objectDate?.match(/\d{4}/)?.[0]);
          if (!isNaN(yr)) {
            const c = Math.ceil(yr / 100);
            const label = `${c}00s`;
            acc[label] = (acc[label] || 0) + 1;
          }
          return acc;
        }, {});

        setCenturyData(Object.entries(countPerCentury).map(([name, value]) => ({ name, value })));
      }

      setLoading(false);
    };
    fetchArtwork();
  }, [id]);

  if (loading) return <p className="loading">Loading artwork details...</p>;
  if (!art) return <p>❌ Artwork not found.</p>;

  return (
    <div className="with-sidebar">
      <Sidebar />

      <div className="App detail-view">
        <Link to="/" className="back-btn">← Back to Dashboard</Link>

        <h1>{art.title || "Untitled"}</h1>
        <p className="subtitle">{art.artistDisplayName || "Unknown Artist"}</p>

        {art.primaryImage && (
          <img src={art.primaryImage} alt={art.title} className="detail-image" />
        )}

        <div className="detail-info">
          <p><strong>Type:</strong> {art.objectName || "Unknown"}</p>
          <p><strong>Date:</strong> {art.objectDate || "Unknown"}</p>
          <p><strong>Medium:</strong> {art.medium || "Unknown"}</p>
          <p><strong>Dimensions:</strong> {art.dimensions || "—"}</p>
          <p><strong>Credit Line:</strong> {art.creditLine || "—"}</p>
          <p><strong>Repository:</strong> {art.repository || "—"}</p>
        </div>

        <div className="chart-container">
          <h3>📈 Artworks By Century (Comparison)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centuryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0077b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
