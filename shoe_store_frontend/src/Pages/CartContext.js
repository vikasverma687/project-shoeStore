import { createContext, useContext } from "react";
import Authfetch from "./Authfetch";

import toast, { Toaster } from "react-hot-toast";

const cartContext = createContext();

export function CartProvider({ children }) {
    const user_id = localStorage.getItem("user_id");

    const handleAddtoCart = async (product_id, product_name,product_price,product_url) => {

        try {
            const response = await Authfetch("http://localhost:8081/api/v2/addtocart", {
                method: "POST",
                body: JSON.stringify({product_id, product_name,product_price,product_url , user_id})
            })

            const data = await response.json();

            if (response.ok) {
                toast.success("item added into cart")
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err)

        }

    }

    return(
        <cartContext.Provider value={{handleAddtoCart}}>
            {children}
            <Toaster position="top-right"/>
        </cartContext.Provider>
    );

}
export function useCart(){
    return useContext(cartContext);
}