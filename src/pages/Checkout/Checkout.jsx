// src/pages/Checkout/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
// import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',

    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',

    // Billing
    sameAsShipping: true,

    // Additional
    notes: ''
  });

  const shippingCost = getCartTotal() > 100 ? 0 : 9.99;
  const tax = getCartTotal() * 0.08;
  const finalTotal = getCartTotal() + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ordersAPI.create();
      setOrderData(response.data);
      setOrderComplete(true);
      await clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="checkout-complete">
        <div className="checkout-complete-container">
          <motion.div
            className="success-animation"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={64} className="success-icon" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Thank you for your purchase. Your order has been received.
          </motion.p>

          {orderData && (
            <motion.div
              className="order-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="order-info">
                <div className="info-item">
                  <span>Order Number:</span>
                  <strong>#{orderData.id}</strong>
                </div>
                <div className="info-item">
                  <span>Total Amount:</span>
                  <strong>${orderData.total_amount}</strong>
                </div>
                {orderData.daftra_invoice_id && (
                  <div className="info-item">
                    <span>Invoice ID:</span>
                    <strong>{orderData.daftra_invoice_id}</strong>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="completion-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <motion.div
          className="checkout-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/cart')}
            className="back-btn"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="checkout-title">Checkout</h1>
        </motion.div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Shipping Information */}
              <motion.section
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="section-title">
                  <span className="section-number">1</span>
                  Shipping Information
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </motion.section>

              {/* Payment Information */}
              <motion.section
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="section-title">
                  <span className="section-number">2</span>
                  Payment Information
                </h2>

                <div className="payment-methods">
                  <div className="payment-method active">
                    <CreditCard size={20} />
                    <span>Credit Card</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label htmlFor="cardName">Name on Card *</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="security-notice">
                  <Shield size={16} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </motion.section>

              {/* Order Notes */}
              <motion.section
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="section-title">
                  <span className="section-number">3</span>
                  Additional Information
                </h2>

                <div className="form-group">
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Any special instructions for your order..."
                  />
                </div>
              </motion.section>

              {/* Submit Button */}
              <motion.div
                className="form-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  type="submit"
                  disabled={loading || cartLoading}
                  className="submit-order-btn"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Complete Order · ${finalTotal.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="security-guarantee">
                  <Shield size={16} />
                  Your order is secure and encrypted
                </p>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            className="order-summary-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="summary-title">Order Summary</h3>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4 className="item-title">{item.product?.title}</h4>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {getCartTotal() < 100 && (
              <div className="shipping-progress">
                <p className="progress-text">
                  Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping!
                </p>
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

export default Checkout;