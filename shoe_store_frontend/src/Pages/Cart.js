import { useEffect, useState } from "react";
import "../Styles/Cartcss.css";
import Navbar from "../Component/Navbar";
import Authfetch from "./Authfetch";
import toast from "react-hot-toast";

function Cart() {
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);

    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        getCart();
    }, []);

    const getCart = async () => {

        const response = await Authfetch(`http://localhost:8081/api/v2/getcart?user_id=${user_id}`, {
            method: "GET"
        })

        const data = await response.json();

        if (response.ok) {

            if (data.length === 0) {
                setMessage("cart is empty!")
            } else {
                console.log(data);
                setItems(data);

            }
        } else if (response.status === 429) {
            toast.error(data.title)
        }else {
            setMessage("backend issue");
        }
    }

    const handleDelete = async (product_id) => {
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/deleteitem?user_id=${user_id}&product_id=${product_id}`, {
                method: "DELETE"

            })
            const data = await response.json();

            if (response.ok) {

                setItems(items.filter(item => item.product_id !== product_id));
                setMessage("item deleted!")

                setTimeout(() => setMessage(""), 1500);

            } else {
                setMessage(data.message);

                setTimeout(() => setMessage(""), 1500);
            }
        } catch (error) {
            setMessage("frontend problem!");
            console.error(error);
        }

    }

    const handleAllDelete = async () => {

        const response = await Authfetch(`http://localhost:8081/api/v2/alldelete?user_id=${user_id}`, {
            method: "DELETE"
        })
        const data = await response.json();

        if (response.ok) {

            setItems([]);

            setMessage("all item deleted!")

            setTimeout(() => setMessage(""), 1500);

        } else {
            setMessage(data.message);
        }
    }

    const handleCheckOut = async () => {
        try {
            const response = await Authfetch(`http://localhost:8081/api/v2/orders/place-orders?user_id=${user_id}`, {
                method: "POST",

            })

            const data = await response.json();

            if (response.ok) {
                setItems([]);
                await getCart();
                setMessage("placed successfully, check Your Orders ");
            } else {
                setMessage(data.message);

            }
        } catch (err) {
            setMessage("server error" + err)
        }
    }

    return (

        <div className="app-container">
            <header className="app-header">
                <Navbar />
            </header>

            <main className="app-content">
                <h2 className="cart-title">Your Shopping Cart</h2>
                <div className="cart-list">
                    {items.map((item) => (
                        <div key={item.product_id} className="cart-item">
                            {/* Vertical Image Container */}
                            <div className="product-image-sm">
                                <img src={`http://localhost:8081${item.product_url}`} alt={item.product_name} />
                            </div>

                            <div className="product-details">
                                <div className="info-top">
                                    <h3>{item.product_name}</h3>
                                    <p className="price">{item.product_price}₹</p>
                                </div>
                                <button
                                    className="btn-remove"
                                    onClick={() => handleDelete(item.product_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center" }}>
                    <button onClick={() => handleCheckOut()} className="checkout-btn">prodeed to checkout</button>
                </div>
                {items.length > 0 && (
                    <div className="cart-footer">
                        <button className="btn-clear-all" onClick={handleAllDelete}>
                            Delete All Items
                        </button>

                    </div>
                )}
                <h1>{message}</h1>
            </main>

            <footer className="app-footer">
                <p>© 2024 College Name | Department of Computer Science</p>
            </footer>
        </div>

    );
}

export default Cart;