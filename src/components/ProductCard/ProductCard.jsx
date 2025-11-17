// src/components/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      console.log('Added to cart successfully');
    } else {
      console.error('Failed to add to cart:', result.error);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}

          <img
            src={product.images?.[0] || defaultImage}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Quick Actions Overlay */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-200"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
            >
              <Heart
                size={18}
                fill={isWishlisted ? 'currentColor' : 'none'}
              />
            </motion.button>

            <motion.button
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={18} />
            </motion.button>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.button
            className="absolute bottom-3 left-3 right-3 bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 opacity-0 transform translate-y-4 transition-all duration-300 hover:bg-red-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {product.category?.name || 'Uncategorized'}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${
                    star <= (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>

          {/* Stock Status */}
          {product.stock > 0 ? (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock < 10
                ? 'text-orange-700 bg-orange-50'
                : 'text-green-700 bg-green-50'
            }`}>
              {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
            </div>
          ) : (
            <div className="text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;