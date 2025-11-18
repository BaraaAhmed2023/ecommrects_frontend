// src/pages/Cart/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

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
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" text="Loading your cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <ShoppingBag size={64} className="text-gray-400" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold"
        >
          Your cart is empty
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500"
        >
          Start shopping to add items to your cart
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-5 text-gray-400 font-semibold mb-2">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
              <span></span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="grid grid-cols-5 items-center gap-4 bg-gray-50 p-4 rounded-md shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 col-span-2">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop'}
                        alt={item.product?.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{item.product?.title}</h3>
                        <p className="text-gray-500 text-sm">{item.product?.category?.name}</p>
                        <p className="text-gray-400 text-xs">SKU: {item.product?.sku}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.product?.stock || 10)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Unit Price */}
                    <div className="text-right font-medium">${item.product?.price}</div>

                    {/* Total Price */}
                    <div className="text-right font-semibold">${(item.product?.price * item.quantity).toFixed(2)}</div>

                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-red-700"
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
              className="flex justify-between items-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/products"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ArrowRight size={16} className="rotate-180" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:underline"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="w-full lg:w-96 bg-white rounded-lg shadow p-6 flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold border-b pb-2">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t my-2"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <motion.button
              className="bg-green-600 text-white py-3 px-4 rounded flex items-center justify-center gap-2 mt-4 hover:bg-green-700 transition"
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </motion.button>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
              <Shield size={16} />
              <span>Secure checkout • 256-bit SSL encryption</span>
            </div>

            {/* Free Shipping Progress */}
            {getCartTotal() < 100 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">
                  Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
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
