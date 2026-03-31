import { useEffect, useRef, useState } from "react";
import { HeartStraight } from "@phosphor-icons/react";
import axios from "axios";
import API from "../../api/api";
import toast from "react-hot-toast";
import { UserRole } from "../../types/userRole";
import "./dashboard.css";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type Product = {
  _id: string;
  name: string;
  address: string;
  price: number;
  imageUrl: string;
};

type Favourite = {
  _id: string;
  productId: Product;
};

type DashboardProps = {
  token: string;
  user: User | null;
};

const Dashboard = ({ token, user }: DashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favs, setFavs] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showBuyerDetails, setShowBuyerDetails] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const productImageInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  const fetchProducts = async () => {
    const productResponse = await API.get("/products", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const productList = Array.isArray(productResponse.data?.data)
      ? (productResponse.data.data as Product[])
      : [];
    setProducts(productList);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await fetchProducts();

        if (!isAdmin) {
          const favouriteResponse = await API.get("/fav/lists", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavs(favouriteResponse.data?.data ?? []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Unable to load dashboard products.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [isAdmin, token]);

  useEffect(() => {
    if (!productImage) {
      setImagePreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(productImage);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [productImage]);

  const createProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !address.trim() || !price.trim()) {
      toast.error("Please fill in name, address, and price.");
      return;
    }

    if (!productImage) {
      toast.error("Please choose a product image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("price", price);
      formData.append("productImage", productImage);

      const response = await API.post("/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdProduct = response.data?.data as Product | undefined;
      if (createdProduct) {
        await fetchProducts();
      }

      toast.success("Product created successfully.");
      setName("");
      setAddress("");
      setPrice("");
      setProductImage(null);
      if (productImageInputRef.current) {
        productImageInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error creating product:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message || "Unable to create product.",
        );
      } else {
        toast.error("Unable to create product.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isFavourite = (productId: string) =>
    favs.some((fav) => fav.productId?._id === productId);

  const toggleFavourite = async (productId: string) => {
    try {
      const response = await API.post(
        "/fav/toggle",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setFavs(response.data?.data ?? []);
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          {isAdmin ? (
            <p className="dashboard-subtitle">
              {user?.name} (Admin)
            </p>
          ) : (
            <button
              className="buyer-name-trigger"
              onClick={() => setShowBuyerDetails((prev) => !prev)}
              type="button"
            >
              {user?.name} (Buyer)
            </button>
          )}
        </div>

        <div className="dashboard-actions">
          {!isAdmin && (
            <button
              className={`favourite-toggle ${showFavourites ? "active" : ""}`}
              onClick={() => setShowFavourites((prev) => !prev)}
              type="button"
              aria-label="Toggle favourites"
            >
              <HeartStraight size={20} weight={showFavourites ? "fill" : "regular"} />
              <span className="favourite-count">{favs.length}</span>
            </button>
          )}

          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!isAdmin && showBuyerDetails && (
        <section className="buyer-details-panel">
          <p className="buyer-eyebrow">Buyer Details</p>
          <div className="buyer-detail-list">
            <div className="buyer-detail-item">
              <span>Name</span>
              <strong>{user?.name ?? "-"}</strong>
            </div>
            <div className="buyer-detail-item">
              <span>Email</span>
              <strong>{user?.email ?? "-"}</strong>
            </div>
            <div className="buyer-detail-item">
              <span>Role</span>
              <strong>Buyer</strong>
            </div>
          </div>
        </section>
      )}

      {isAdmin && (
        <div className="product-admin-panel">
          <section className="product-form-card">
            <h3>Add Product</h3>
            <form
              onSubmit={createProduct}
              className="product-form"
              encType="multipart/form-data"
              noValidate
            >
              <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
              <input
                ref={productImageInputRef}
                className="product-form-full"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setProductImage(event.target.files?.[0] ?? null)
                }
              />
              {productImage && (
                <div className="product-upload-meta">
                  <span className="product-upload-name">{productImage.name}</span>
                  {imagePreviewUrl && (
                    <img
                      className="product-upload-preview"
                      src={imagePreviewUrl}
                      alt="Selected product preview"
                    />
                  )}
                </div>
              )}
              <button className="product-submit" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add Product"}
              </button>
            </form>
          </section>

          <section className="product-table-card">
            <h3>Product Table</h3>
            <div className="product-table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No products found in the database yet.</td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            className="product-thumb"
                            src={product.imageUrl}
                            alt={product.name}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.address}</td>
                        <td>Rs. {product.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {!isAdmin && (
        <div className="buyer-dashboard">
          {showFavourites && (
            <section className="buyer-favourites-section">
              <div className="section-heading">
                <h3>My Favourite List</h3>
              </div>

              {favs.length === 0 && !loading && (
                <div className="buyer-empty-card">
                  No favourites yet. Start adding products you want to revisit.
                </div>
              )}

              <div className="buyer-card-grid">
                {favs.map((fav) => (
                  <article
                    key={fav._id}
                    className="buyer-product-card buyer-favourite-card"
                  >
                    <img
                      src={fav.productId.imageUrl}
                      alt={fav.productId.name}
                      className="buyer-product-image"
                    />
                    <div className="buyer-product-content">
                      <h4>{fav.productId.name}</h4>
                      <p>{fav.productId.address}</p>
                      <strong>Rs. {fav.productId.price}</strong>
                    </div>
                    <button
                      className="buyer-action-button buyer-action-button-secondary"
                      onClick={() => toggleFavourite(fav.productId._id)}
                    >
                      Remove Favourite
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!showFavourites && (
            <section className="buyer-products-section">
              <div className="section-heading">
                <h3>Available Products</h3>
              </div>

              <div className="buyer-card-grid">
                {products.map((product) => (
                  <article key={product._id} className="buyer-product-card">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="buyer-product-image"
                    />
                    <div className="buyer-product-content">
                      <h4>{product.name}</h4>
                      <p>{product.address}</p>
                      <strong>Rs. {product.price}</strong>
                    </div>
                    <button
                      className="buyer-action-button"
                      onClick={() => toggleFavourite(product._id)}
                    >
                      {isFavourite(product._id) ? "Remove Favourite" : "Add Favourite"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
