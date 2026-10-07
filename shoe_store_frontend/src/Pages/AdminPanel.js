import { useState } from "react";
import Authfetch from "./Authfetch";
import "../Styles/AdminPanel.css";
import Navbar from "../Component/Navbar";
import toast from "react-hot-toast";

function AdminPanel() {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [product_name, setProduct_name] = useState("");
    const [url, setUrl] = useState("");
    const [product_price, setProduct_price] = useState("");
    const [product_id, setProduct_id] = useState("");
    const [message, setMessage] = useState("");
    const [product_info, setProductInfo] = useState("");
    const [rating, setRating] = useState("");
    const [id, setId] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleAddProduct = async () => {
        if (!image) return setMessage("Please select an image");

        const formdata = new FormData();
        formdata.append("file", image);

        try {
            const uploadResponse = await Authfetch("http://localhost:8081/api/admin/files/upload", {
                method: "POST",
                body: formdata
            });

            if (!uploadResponse.ok) return setMessage("Image upload failed!");

            const uploadData = await uploadResponse.json();
            const imageurl = uploadData.url;

            const productResponse = await Authfetch("http://localhost:8081/api/admin/files/add-product", {
                method: "POST",
                body: JSON.stringify({ product_id, product_name, product_price, imageurl, product_info, rating })
            });

            const productData = await productResponse.json();

            if (productResponse.ok) {
                setMessage("Product added successfully!");
                setUrl(imageurl);
                // Clear form fields
                setProduct_name("");
                setProduct_price("");
                setProduct_id("");
                setProductInfo("");
                setRating("");
                setImage(null);
                setPreviewUrl(null);
            } else {
                setMessage(productData.message);
            }
        } catch (err) {
            setMessage("An error occurred.");
        }
    };

    const handleRemoveProduct = async () => {
        if (!id) return toast.error("Please enter a product ID");

        try {
            const response = await Authfetch(`http://localhost:8081/api/admin/files/remove-product?product_id=${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Product removed successfully!");
                setId(""); // Clear input
            } else {
                toast.error(data.message || "Failed to remove product");
            }
        } catch (err) {
            toast.error("An error occurred while deleting.");
        }
    };

    return (
        <div className="container">
            <Navbar />
            <div className="admin-container">
                <div className="admin-card">
                    <h2>Add New Product</h2>

                    {message && <div className={`alert ${message.includes("failed") || message.includes("error") ? "error" : "success"}`}>{message}</div>}

                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" placeholder="e.g. Wireless Headphones" value={product_name} onChange={(e) => setProduct_name(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input type="number" placeholder="0.00" value={product_price} onChange={(e) => setProduct_price(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Product ID</label>
                            <input type="text" placeholder="ID-101" value={product_id} onChange={(e) => setProduct_id(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product Description</label>
                        <input type="text" placeholder="Write product info..." value={product_info} onChange={(e) => setProductInfo(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Rating (1-5)</label>
                        <input type="number" min="1" max="5" placeholder="e.g. 4.5" value={rating} onChange={(e) => setRating(e.target.value)} />
                    </div>

                    <div className="image-section">
                        <label className="file-label">
                            <span>Upload Product Image</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </label>

                        {(previewUrl || url) && (
                            <div className="image-preview">
                                <img src={previewUrl || `http://localhost:8081${url}`} alt="preview" />
                            </div>
                        )}
                    </div>

                    <button className="submit-btn" onClick={handleAddProduct}>Add Product</button>

                    <hr className="divider" />

                    <div className="delete-section">
                        <h3>Remove Product</h3>
                        <div className="form-group">
                            <label>Product ID to Remove</label>
                            <div className="delete-input-group">
                                <input type="text" placeholder="Enter product ID" value={id} onChange={(e) => setId(e.target.value)} />
                                <button className="delete-btn" onClick={handleRemoveProduct}>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;