import Navbar from "../Component/Navbar";
import { useState, useEffect, useRef } from "react";
import "../Styles/HomePagecss.css";
import Authfetch from "./Authfetch";
import toast, { Toaster } from 'react-hot-toast';
import { data, Link } from "react-router-dom";
import Product from "./Product";
import { useCart } from "./CartContext";

function Homepage() {

    const [products, setProducts] = useState([]);
    const [added, setAdded] = useState({})
    const [page, setPage] = useState(() => {
        return parseInt(localStorage.getItem("page")) || 1;
    });

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [maxPrice, setMaxPrice] = useState(1000);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState(null)
    const user_id = localStorage.getItem("user_id");
    const isloggedIn = !!localStorage.getItem("token");

    const productsSectionRef = useRef(null);

    const searchDebounceref = useRef(null)

    useEffect(() => {
        setProducts([]);
        for (let i = 1; i <= page; i++) {
            fetchProducts(i, selectedCategory);
        }
        if (isloggedIn) {
            fetchUserWishlist();
        }
    }, [selectedCategory]);


    const fetchUserWishlist = async () => {
        const response = await Authfetch(`http://localhost:8081/api/v2/get-wishlist?user_id=${user_id}`)
        const data = await response.json()

        if (response.ok) {
            const wishlistMap = {}
            data.forEach(item => {
                wishlistMap[item.product_id] = true
            })
            setAdded(wishlistMap)
        }
    }

    const fetchProducts = async (pageNum, catagory) => {
        console.log("user_id is " + localStorage.getItem("user_id"));

        let endpoint;
        if (catagory === "all") {

            endpoint = `http://localhost:8081/api/v2/allproducts?page=${pageNum}`;


        } else if (catagory === "women") {

            endpoint = `http://localhost:8081/api/v2/women-products?page=${pageNum}`;
        } else if (catagory === "kids") {
            endpoint = `http://localhost:8081/api/v2/kids-products?page=${pageNum}`;

        } else if (catagory === "men") {
            endpoint = `http://localhost:8081/api/v2/men-products?page=${pageNum}`;

        }
        try {

            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                // Avoid duplicating products if page-loop runs
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.product_id));
                    const filteredNew = data.filter(p => !existingIds.has(p.product_id));
                    return [...prev, ...filteredNew];
                });
            } else if(response.status == 429) {
                toast.error(data.message)
            }else{
                
                console.log("Token issues or page out of bounds.");
            }
        } catch (error) {
            toast.error("Server error: " + error.message);
            console.error(error);
        }
    };

    const { handleAddtoCart } = useCart();

    const handleCartClick = async (product_id, product_name, product_price, product_url) => {
        if (!isloggedIn) {
            toast.error("Please login first");
            return;
        }
        handleAddtoCart(product_id, product_name, product_price, product_url);
    };

    const handleShowMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        localStorage.setItem("page", nextPage);
        fetchProducts(nextPage, selectedCategory);
    };

    const scrollToProducts = () => {
        if (productsSectionRef.current) {
            productsSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const clearFilters = () => {
        setSelectedCategory("all");
        setMaxPrice(10000);
        setSearchText("");
        setSearchResult(null);
        toast.success("Filters cleared!");
    };
    const displayProducts = searchResult !== null ?searchResult : products;
   
    const filteredProducts = displayProducts.filter((item) => {


       return item.product_price<=maxPrice;
    });

    const handleAddtoWishlist = async (product_name, product_id, product_price, product_url) => {

        setAdded(prev => ({
            ...prev, [product_id]: true
        }))
        const response = await Authfetch("http://localhost:8081/api/v2/add-to-wishlist", {
            method: "POST",
            body: JSON.stringify({ product_name, product_id, product_price, product_url, user_id })
        })
        const data = await response.json()

        if (response.ok) {
            toast.success(data.message)
        } else {
            toast.error(data.message)
        }
    }

    const handleRemoveFromWishlist = async (product_id) => {
        const response = await Authfetch(`http://localhost:8081/api/v2/remove-from-wishlist?user_id=${user_id}&product_id=${product_id}`, {
            method: "DELETE"
        })
        const data = await response.json()

        if (response.ok) {
            setAdded(prev => ({ ...prev, [product_id]: false }))
            toast.success(data.message)

        } else {
            toast.error(data.message)
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchText(value)

        if (searchDebounceref.current) clearTimeout(searchDebounceref.current)

        if (value.trim() === "") {
            setSearchResult(null);
            return;

        }

        searchDebounceref.current = setTimeout(() => {
            fetchSearchResult(value)
        }, 400);
    }

    const fetchSearchResult = async (query) => {
        try {
            const response = await fetch(`http://localhost:8081/api/v2/search-products?query=${encodeURIComponent(query)}`, {
                method: "GET"
            })

            if (response.ok) {

                const data = await response.json()
                setSearchResult(data)
            }
        } catch (error) {
            console.error(error)
            console.log("search not working ")
        }
    }


    return (
        <div className="app-container">
            {/* Toast System Notification */}
            <Toaster position="top-right" />

            {/* Navbar Header Container */}
            <header className="app-header">
                <Navbar />
            </header>

            {/* Hero Banner Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Step Into Style</h1>
                    <p>Discover our latest collection of premium sneakers</p>
                    <button className="cta-button" onClick={scrollToProducts}>
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Main Application Content Area */}
            <main ref={productsSectionRef} className="app-content container">

                {/* Section Header */}
                <div className="section-header">
                    <h2>Our Premium Collection</h2>
                    <p className="section-subheader">Explore style combined with high-performance engineering</p>
                </div>

                {/* Main Shop Layout: Filters Sidebar + Dynamic Grid */}
                <div className="shop-layout">

                    {/* Filters Sidebar */}
                    <aside className="sidebar" aria-label="Product Filters">

                        {/* Category Fast-Switch Tabs */}
                        <div className="filter-group">
                            <h3>Categories</h3>
                            <div className="category-pills">
                                {["all", "men", "women", "kids"].map((cat) => (
                                    <button
                                        key={cat}
                                        className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="filter-group">
                            <h3>Filter by Price</h3>
                            <input
                                type="range"
                                id="priceRange"
                                min="0"
                                max="1000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="range-slider"
                            />
                            <p className="price-display">
                                Max Price: <span>₹{maxPrice.toLocaleString()}</span>
                            </p>
                        </div>

                        {/* Text Search Input */}
                        <div className="filter-group">
                            <h3>Search Sneakers</h3>
                            <input
                                type="search"
                                placeholder="Search by model name..."
                                value={searchText}
                                onChange={handleSearchChange}
                                className="search-input-field"
                            />
                        </div>

                        {/* Clear Active Filters */}
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    </aside>

                    {/* Products Grid Content */}
                    <div className="grid-content-area">
                        {filteredProducts.length > 0 ? (
                            <div className="product-grid">
                                {filteredProducts.map((item) => (
                                    <div key={item.product_id} className="product-card">

                                        {/* Elegant Absolute Positioned Wishlist Action Wrapper */}
                                        <div className="wishlist-action-overlay">
                                            {!added[item.product_id] ? (
                                                <button
                                                    className="btn-wishlist btn-wishlist-add"
                                                    onClick={() => handleAddtoWishlist(item.product_name, item.product_id, item.product_price, item.product_url)}
                                                    aria-label="Add to wishlist"
                                                >
                                                    <span className="heart-icon">♡</span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-wishlist btn-wishlist-remove"
                                                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <span className="heart-icon">♥</span>
                                                </button>
                                            )}
                                        </div>

                                        <Link to={`/Product/${item.product_id}`} className="product-image-wrapper">
                                            <img
                                                src={`http://localhost:8081${item.product_url}`}
                                                alt={item.product_name}
                                                className="product-image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60";
                                                }}
                                            />
                                        </Link>

                                        {/* Product Informational & Action Body */}
                                        <div className="product-info">
                                            <h3 className="product-title">{item.product_name}</h3>
                                            <p className="product-category-tag">
                                                {item.category ? item.category.toUpperCase() : "PREMIUM"}
                                            </p>
                                            <p className="product-price">₹{item.product_price.toLocaleString()}</p>

                                            <button
                                                className="btn-add-to-cart"
                                                onClick={() => handleCartClick(
                                                    item.product_id,
                                                    item.product_name,
                                                    item.product_price,
                                                    item.product_url
                                                )}
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-products-fallback">
                                <h3>No sneakers match your selection</h3>
                                <p>Try adjusting your search keywords, price thresholds, or category filters.</p>
                                <button className="clear-filters-btn" onClick={clearFilters} style={{ maxWidth: '200px', margin: '15px auto 0' }}>
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination Trigger Container */}
                        <div className="show-more-container">
                            <button
                                className="btn-show-more"
                                onClick={handleShowMore}
                            >
                                Show More
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Premium Footing Section */}
            <footer className="app-footer">
                <div className="footer-links-grid container">
                    <div className="footer-col">
                        <h4>About SneakerStore</h4>
                        <p>Delivering high-performance, comfortable, and elite tier athletic footwear globally.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Support Lines</h4>
                        <p>Email: assist@sneakerstore.com</p>
                        <p>Hours: Mon - Fri | 9 AM - 6 PM</p>
                    </div>
                    <div className="footer-col">
                        <h4>Academics & Tech</h4>
                        <p>© 2026 Malwa Institute of Science and Technology | Department of Computer Science</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Homepage;