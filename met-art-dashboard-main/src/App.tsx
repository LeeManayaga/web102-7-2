import { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Charts from "./Charts";
import Sidebar from "./Sidebar";


interface Artwork {
  objectID: number;
  title?: string;
  objectName?: string;
  objectDate?: string;
  medium?: string;
  artistDisplayName?: string;
  primaryImageSmall?: string;
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let ignore = false;

  const fetchArtworksByDept = async (deptId: number) => {
    try {
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${deptId}`
      );
      const data = await res.json();
      if (!data.objectIDs || data.objectIDs.length === 0) return null;

      const ids = data.objectIDs.slice(0, 20);
      const artworksData = await Promise.all(
        ids.map((id: number) =>
          fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          ).then((r) => r.json())
        )
      );
      return artworksData.filter(Boolean);
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const departments = [11, 6, 13, 1, 4];
      let artworksData: Artwork[] | null = null;

      // 🔹 Try multiple departments
      for (const dept of departments) {
        artworksData = await fetchArtworksByDept(dept);
        if (artworksData && artworksData.length > 0) {
          console.log(`✅ Loaded ${artworksData.length} artworks from dept ${dept}`);
          break;
        }
      }

      // 🔹 Backup: if still nothing, use known stable IDs
      if (!artworksData || artworksData.length === 0) {
        console.warn("⚠️ API failed — loading backup artworks locally...");
        const backupIDs = [436121, 437133, 459123, 436840, 435875];
        const backupArtworks = await Promise.all(
          backupIDs.map((id) =>
            fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            ).then((res) => res.json())
          )
        );
        artworksData = backupArtworks;
      }

      if (!ignore && artworksData && artworksData.length > 0) {
        setArtworks(artworksData);
      } else {
        console.error("❌ Still no artworks found.");
      }
    } catch (error) {
      console.error("🚨 Error fetching artworks:", error);
    } finally {
      if (!ignore) setLoading(false);
    }
  };

  fetchData();
  return () => {
    ignore = true;
  };
}, []);


  const filteredArtworks = artworks
    .filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      filter ? item.objectName?.toLowerCase() === filter.toLowerCase() : true
    );

  const total = artworks.length;
  const uniqueTypes = new Set(artworks.map((a) => a.objectName)).size;

return (
  <div className="with-sidebar">
    <Sidebar />

    <div className="App">
      <h1>🖼 The Met Art Dashboard</h1>

      <div className="stats">
        <p>Total Artworks: {total}</p>
        <p>Unique Types: {uniqueTypes}</p>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">All Types</option>
        <option value="painting">Painting</option>
        <option value="print">Print</option>
        <option value="ceramic">Ceramic</option>
        <option value="sculpture">Sculpture</option>
      </select>

      {!loading && artworks.length > 0 && <Charts artworks={artworks} />}

      {loading ? (
        <p className="loading">Loading artworks...</p>
      ) : artworks.length === 0 ? (
        <p>⚠️ No artworks found. Try refreshing again in a few seconds.</p>
      ) : (
        <div className="art-list">
          {filteredArtworks.slice(0, 50).map((art) => (
            <Link
              to={`/art/${art.objectID}`}
              key={art.objectID}
              className="art-card"
            >
              <h3>{art.title || "Untitled"}</h3>
              <p><strong>Type:</strong> {art.objectName || "Unknown"}</p>
              <p><strong>Artist:</strong> {art.artistDisplayName || "Unknown"}</p>
              <p><strong>Date:</strong> {art.objectDate || "Unknown"}</p>
              <p><strong>Medium:</strong> {art.medium || "Unknown"}</p>

              {art.primaryImageSmall && (
                <img
                  src={art.primaryImageSmall}
                  alt={art.title}
                  width="200"
                  style={{ marginTop: "10px" }}
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default App;
