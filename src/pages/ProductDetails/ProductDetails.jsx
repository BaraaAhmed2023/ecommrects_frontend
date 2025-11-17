// src/pages/ProductDetails/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { productsAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
// import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productsAPI.getRelated(id);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      // Show success notification
      console.log('Added to cart successfully');
    } else {
      // Show error notification
      console.error('Failed to add to cart:', result.error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show copied notification
    }
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <LoadingSpinner size="large" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images || [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop'
  ];

  return (
    <div className="product-details">
      <div className="product-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="main-image-img"
              />
            </div>

            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="thumbnail-img"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <motion.div
              className="product-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="product-title">{product.title}</h1>

              <div className="product-meta">
                <div className="rating">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`rating-star ${
                          star <= (product.rating || 4) ? 'filled' : ''
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating || 4.0} • {product.reviewCount || 24} reviews
                  </span>
                </div>

                <div className="product-sku">
                  SKU: {product.sku || 'N/A'}
                </div>
              </div>

              <div className="product-price-section">
                <span className="current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>
            </motion.div>

            <motion.div
              className="product-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p>{product.description}</p>
            </motion.div>

            {/* Stock Status */}
            <motion.div
              className="stock-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.stock > 0 ? (
                <div className="in-stock">
                  <div className="stock-indicator"></div>
                  {product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock'}
                </div>
              ) : (
                <div className="out-of-stock">Out of Stock</div>
              )}
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              className="quantity-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="action-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                className="add-to-cart-btn primary"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
              >
                Add to Cart
              </button>

              <button
                className="buy-now-btn"
                disabled={!product.stock || product.stock === 0}
              >
                Buy Now
              </button>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              className="secondary-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button
                className="action-btn wishlist-btn"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              <button
                className="action-btn share-btn"
                onClick={handleShare}
              >
                <Share2 size={20} />
                Share
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="product-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="feature">
                <Truck size={20} />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="feature">
                <Shield size={20} />
                <span>2-year warranty included</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <p>Experience premium quality and exceptional comfort with this carefully crafted product. Designed to meet the highest standards of excellence.</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Material</span>
                    <span className="spec-value">Premium Cotton</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Color</span>
                    <span className="spec-value">As shown</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Size</span>
                    <span className="spec-value">One Size</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Care</span>
                    <span className="spec-value">Machine wash cold</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Customer Reviews</h3>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="tab-panel">
                <h3>Shipping & Returns</h3>
                <p>Free standard shipping on orders over $100. Express shipping available. 30-day return policy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;