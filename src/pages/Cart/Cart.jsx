// src/pages/Cart/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
// import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    loading
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const shippingCost = getCartTotal() > 100 ? 0 : 9.99;
  const tax = getCartTotal() * 0.08; // 8% tax
  const finalTotal = getCartTotal() + shippingCost + tax;

  if (loading) {
    return (
      <div className="cart-loading">
        <LoadingSpinner size="large" text="Loading your cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ShoppingBag size={64} className="empty-cart-icon" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your cart is empty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Start shopping to add items to your cart
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Total</span>
              <span></span>
            </div>

            <div className="cart-items">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    {/* Product Info */}
                    <div className="product-info">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop'}
                        alt={item.product?.title}
                        className="product-image"
                      />
                      <div className="product-details">
                        <h3 className="product-title">{item.product?.title}</h3>
                        <p className="product-category">{item.product?.category?.name}</p>
                        <p className="product-sku">SKU: {item.product?.sku}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.product?.stock || 10)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Unit Price */}
                    <div className="unit-price">
                      ${item.product?.price}
                    </div>

                    {/* Total Price */}
                    <div className="total-price">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Actions */}
            <motion.div
              className="cart-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/products" className="continue-shopping-btn">
                <ArrowRight size={16} className="rotate-180" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="clear-cart-btn"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="order-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-items">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="summary-item">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="summary-item">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="promo-section">
              <input
                type="text"
                placeholder="Enter promo code"
                className="promo-input"
              />
              <button className="promo-btn">Apply</button>
            </div>

            {/* Checkout Button */}
            <motion.button
              className="checkout-btn"
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </motion.button>

            {/* Security Badge */}
            <div className="security-badge">
              <Shield className="security-icon" />
              <span>Secure checkout • 256-bit SSL encryption</span>
            </div>

            {/* Free Shipping Progress */}
            {getCartTotal() < 100 && (
              <div className="shipping-progress">
                <div className="progress-text">
                  Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping!
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(getCartTotal() / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;