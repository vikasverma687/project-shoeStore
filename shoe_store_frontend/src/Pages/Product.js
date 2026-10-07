import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Authfetch from "./Authfetch";
import { useCart } from "./CartContext";
import Navbar from "../Component/Navbar";
import { toast } from "react-hot-toast";
import "../Styles/Productcss.css";

function Product() {

    const { id } = useParams();
    const [productInfo, setProductinfo] = useState("");
    const [message, setMessage] = useState("");
    const [url, setUrl] = useState("");
    const [rating, setRating] = useState();
    const [data, setData] = useState(null);
    const [price, setPrice] = useState();
    const [product_id, setProductId] = useState();
    const [cmtvisible, setCmtVisible] = useState(false);
    const [info, setInfo] = useState({});

    const isloggedIn = !!localStorage.getItem("token");

    const { handleAddtoCart } = useCart();

    const handleCartClick = async (product_id, product_name, product_price, product_url) => {

        console.log("user id is " + localStorage.getItem("user_id"))
        if (!isloggedIn) {
            toast.error("please login first");
        }
        handleAddtoCart(product_id, product_name, product_price, product_url);

    }

    useEffect(() => {
        handleproduct();
    }, []);

    const handleproduct = async () => {
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/product?product_id=${parseInt(id)}`);
            const prdata = await response.json();
            const result = prdata.data;

            if (response.ok) {
                setData(result);
                setProductinfo(result.product_info);
                setUrl(result.product_url);
                setRating(result.rating);
                setPrice(result.product_price);
                setProductId(result.product_id);
            } else {
                setMessage(result.message + ": possible backend issue");
            }
        } catch (err) {
            setMessage("Server error");
        }
    };

    const handleViewComment = async (product_id) => {
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/view-comment?product_id=${product_id}`);
            const result = await response.json();

            if (response.ok) {

                const data = result.data;

                setInfo(data);
                console.log(data.comment)

                setCmtVisible(true);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to load comments");
        }
    };

    return (
        <div className="product-page-container">
            <Navbar />



            <div className="product-detail-card">
                {/* Image */}
                <div className="product-image-wrapper">
                    <img src={`http://localhost:8081${url}`} alt="product" />
                </div>


                {/* Details */}
                <div className="product-detail-info">



                    <span className="product-detail-tag">Your Product</span>
                    <h1 className="product-detail-title">{productInfo}</h1>
                    <p className="product-detail-price">{price}₹</p>
                    <div className="product-detail-rating">⭐ {rating} / 5</div>
                    <p style={{ fontWeight: '300', color: '#888', fontSize: '12px' }}>
                        Product ID: {product_id}
                    </p>

                    <div className="product-detail-actions">
                        {data ? (
                            <button
                                className="product-btn product-btn-primary"
                                onClick={() => handleCartClick(data.product_id, data.product_name, data.product_price, data.product_url)}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <p className="loading-text">Loading product details...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments */}
            <div className="comments-section">
                {cmtvisible ? (
                    info.length > 0 ? (
                        <div className="comments-list">
                            <h3>Community Reviews</h3>
                            {info.map((item, idx) => (
                                <div key={idx} className="comment-bubble">
                                    <span>{item.comment} </span>
                                    <span>@{item.user_name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-comments">No comments yet!</p>
                    )
                ) : (
                    <button
                        className="product-btn product-btn-secondary"
                        onClick={() => handleViewComment(data?.product_id)}
                    >
                        See what people say about the product
                    </button>
                )}
            </div>
        </div>
    );
}

export default Product;