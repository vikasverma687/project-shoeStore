import { useEffect, useState } from "react";
import Authfetch from "./Authfetch";
import Navbar from "../Component/Navbar";
import { toast, Toaster } from "react-hot-toast";
import "../Styles/YourOrders.css"

function YourOrders() {
    const user_id = localStorage.getItem("user_id");
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [makeCom, setMakeCom] = useState({});
    const [comment, setComment] = useState({});
    const [makesubmit, setMakeSubmit] = useState({});
    const [bought, setBought] = useState({});
    const username = localStorage.getItem("username");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/orders/fetch-orders?user_id=${user_id}`);
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
            } else {
                setItems(data.data);
                setVisible(data.data.length === 0);
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Server error: " + err);
        }
    };

    const handleRemove = async (product_id) => {
        const response = await Authfetch(`http://localhost:8081/api/v2/orders/remove-item?user_id=${user_id}&product_id=${product_id}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (response.ok) {
            fetchOrders();
        }
        setMessage(data.message);
    };

    const handleDeleteAll = async () => {
        const response = await Authfetch(`http://localhost:8081/api/v2/orders/delete-all?user_id=${user_id}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (response.ok) {
            fetchOrders();
            setVisible(true);
        }
        setMessage(data.message);
    };

    const handleBuyit = async (product_id , product_name, product_price) => {
        setMakeCom(prev => ({ ...prev, [product_id]: true }));
        setBought(prev => ({ ...prev, [product_id]: true }));

        console.log(product_id , product_name)

        const response = await Authfetch(`http://localhost:8081/api/v2/orders/buy-it?user_id=${user_id}`,{
            method : "POST",
            body : JSON.stringify( {product_id ,product_name , product_price})
            
        })

        const data = await response.json();

        if (response.ok){
            console.log("you just bought it!!" + data.message)
        }else{
            console.log(response.status + "problematic backend")
        }
    };

    const handleSubmit = async (product_id) => {
        const productcomment = comment[product_id];
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/submit-comment?comment=${productcomment}&product_id=${product_id}&username=${username}`, {
                method: "POST"
            });
            const data = await response.json();

            if (response.ok) {

                setMakeSubmit(prev => ({ ...prev, [product_id]: true }));
                toast.success(data.message);

            } else {
                toast.error("Couldn't submit");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    return (
        <div className="orders-page-container">
            <Navbar />
            <Toaster position="top-right" />

            <div className="orders-content">


                <div className="orders-header-row">
                    <h2>Your Orders Dashboard</h2>
                    {items.length > 0 && (
                        <button
                            className="btn-danger-outline"
                            onClick={handleDeleteAll}
                            disabled={visible}
                        >
                            Discard All Orders
                        </button>
                    )}
                </div>

                <div className="orders-list">
                    {items.map((item) => (
                        <div key={item.id} className="order-item-card">
                            <div className="order-item-image-wrapper">
                                <img src={`http://localhost:8081${item.product_url}`} alt={item.product_name} />
                            </div>

                            <div className="order-item-details">
                                <h3 className="item-name">{item.product_name}</h3>
                                <p className="item-price">{item.product_price}₹</p>

                                <div className="order-item-actions">
                                    <button className="btn-text-danger" onClick={() => handleRemove(item.product_id)}>
                                        Remove Item
                                    </button>

                                    {bought[item.product_id] ? (
                                        <span className="success-badge">✓ Purchased! It's on its way.</span>
                                    ) : (
                                        <button className="btn-primary-sm" onClick={() => handleBuyit(item.product_id , item.product_name , item.product_price)}>
                                            Buy It Instantly
                                        </button>
                                    )}
                                </div>

                                <div className="feedback-section">
                                    {makeCom[item.product_id] ? (
                                        <div className="comment-box-group">
                                            <input
                                                type="text"
                                                className="comment-input"
                                                placeholder="What did you think of this product?"
                                                value={comment[item.product_id] || ""}
                                                onChange={(e) => setComment(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                                            />
                                            {makesubmit[item.product_id] ? (
                                                <p className="thanks-msg">Thank you for purchasing our product!</p>
                                            ) : (
                                                <button className="btn-secondary-sm" onClick={() => handleSubmit(item.product_id)}>
                                                    Submit Review
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="locked-feature-text">Leave a comment after your purchase.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default YourOrders;