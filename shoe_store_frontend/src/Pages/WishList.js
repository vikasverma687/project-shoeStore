import { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Authfetch from "./Authfetch";
import "../Styles/Wishlist.css"
import toast, { Toaster } from "react-hot-toast";

function WishList() {


    const [message, setMessage] = useState()
    const [items, setItems] = useState([])
    const user_id = localStorage.getItem("user_id")
    

    useEffect(() => {
        console.log("userid is" + user_id);
        fetchWishList()
    }, [])

    const fetchWishList = async () => {

        console.log("userid is" + user_id);
        const response = await Authfetch(`http://localhost:8081/api/v2/get-wishlist?user_id=${user_id}`,
            { method: "GET" }
        )
        const data = await response.json();

        if (response.ok) {
            setItems(data)
            toast.success("fetched successfully")
        } else {
            toast.error("facing backend")
        }
        console.log(data.message)
    }
    
    const handleRemove = async(product_id)=>{

    setItems(prev => prev.filter(item => item.product_id !== product_id));
        const response = await Authfetch(`http://localhost:8081/api/v2/remove-from-wishlist?user_id=${user_id}&product_id=${product_id}`,
            { method: "DELETE" }
        )
        const data = await response.json();

        if (response.ok) {
            
            toast.success("fetched successfully")
        } else {
            toast.error("facing backend")
        }
   
    }
    


return (
        <div className="app-content">
        
            <Navbar />
            
            <h2 className="cart-title">Your Wishlist</h2>

            <main className="cart-list">
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <div className="cart-item" key={item.product_id}>
                            {/* Premium Container for Image */}
                            <div className="product-image-sm">
                                <img 
                                    src={`http://localhost:8081${item.product_url}`} 
                                    alt={item.product_name || "Sneaker Preview"} 
                                />
                            </div>

                            {/* Clean UI Details matching CSS rules */}
                            <div className="product-details">
                                <div className="info-top">
                                    <h3>{item.product_name}</h3>
                                    <p className="price">${item.product_price}</p>
                                </div>
                                
                                <button className="btn-remove" type="button" onClick={()=> handleRemove(item.product_id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1>Your wishlist is empty</h1>
                )}
            </main>
        </div>
    );
}
export default WishList;