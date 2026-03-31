import { useEffect, useState } from "react";
import API from "../../api/api";

type Favourite = {
  _id: string;
  propertyId: string;
};

const Dashboard = () => {
  const [favs, setFavs] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [token] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;

    const fetchFavs = async () => {
      try {
        setLoading(true);

        const res = await API.get("/favourites", {
          headers: { Authorization: token },
        });

        setFavs(res.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [token]);

  const addFav = async (id: string) => {
    if (!token) return;

    try {
      await API.post(
        "/favourites/add",
        { propertyId: id },
        {
          headers: { Authorization: token },
        },
      );

      setFavs((prev) => [
        ...prev,
        { _id: Date.now().toString(), propertyId: id },
      ]);
    } catch (error) {
      console.error("Error adding favourite:", error);
    }
  };

  const removeFav = async (id: string) => {
    if (!token) return;

    try {
      await API.post(
        "/favourites/remove",
        { propertyId: id },
        {
          headers: { Authorization: token },
        },
      );

      setFavs((prev) => prev.filter((f) => f.propertyId !== id));
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {loading && <p>Loading...</p>}

      <h3>My Favourites</h3>
      {favs.length === 0 && !loading && <p>No favourites yet</p>}

      {favs.map((f) => (
        <div key={f._id} style={{ marginBottom: "10px" }}>
          Property {f.propertyId}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => removeFav(f.propertyId)}
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Properties</h3>
      {["101", "102", "103"].map((id) => (
        <div key={id} style={{ marginBottom: "10px" }}>
          Property {id}
          <button style={{ marginLeft: "10px" }} onClick={() => addFav(id)}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
