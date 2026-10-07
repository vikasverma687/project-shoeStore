import logo from './logo.svg';
import './App.css';

import Navbar from './Component/Navbar';
import { Routes, Route, BrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import PasswordReset from './Pages/PasswordReset';
import Register from './Pages/Register';
import Homepage from './Pages/Homepage';
import Cart from './Pages/Cart';
import ForgotPassword from './Pages/ForgotPassword';
import AdminPanel from './Pages/AdminPanel';
import YourOrders from './Pages/YourOrders';
import Product from './Pages/Product';
import { CartProvider } from './Pages/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import Aboutus from './Pages/About-us';
import WishList from './Pages/WishList';


const ProtectedRoute = ({ children }) => {

  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    alert("not authorized for this action");
    return <Navigate to="/" replace />
  }
  return children;
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {

    toast.error("please login first");
      return <Navigate to="/" replace />
  
  }
  return children;


}


function App() {

  return (
    <CartProvider>
      <Toaster position="top-right" />
      <div >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/WishList" element={<WishList />} />


        <Route path="/Aboutus" element={<Aboutus />} />
          
          

          <Route path="/cart" element={<PrivateRoute> <Cart/> </PrivateRoute>} />

          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Product/:id" element={<Product />} />

          <Route path="/AdminPanel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute >} />

          <Route path="/YourOrders" element={<PrivateRoute> <YourOrders /></PrivateRoute>} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
