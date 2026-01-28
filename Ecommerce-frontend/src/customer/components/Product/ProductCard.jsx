import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { addItemToCart } from '../../../Redux/Customers/Cart/Action';
import { Dialog, DialogPanel, DialogTitle, RadioGroup } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Rating from '@mui/material/Rating';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleNavigate = () => {
    navigate(`/product/${product?.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      // Open size selection modal
      setShowSizeModal(true);
      setSelectedSize(null);
    } else {
      // If no sizes, add directly to cart
      const data = { productId: product.id, size: 'FREE' };
      dispatch(addItemToCart(data));
      // navigate('/cart');
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const data = { productId: product.id, size: selectedSize.name };
    dispatch(addItemToCart(data));
    setShowSizeModal(false);
    // navigate('/cart');
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product?.id}`);
  };

  return (
    <>
      <div
        onClick={handleNavigate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            src={product.imageUrl}
            alt={product.title}
          />

          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-lg">
              -{product.discountPercent}%
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={handleQuickView}
              className="p-1.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-1.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-1.5">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              {product.brand}
            </p>
          </div>

          {/* Title */}
          <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug h-8 group-hover:text-indigo-600 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              ₹{product.discountedPrice || product.discountPrice}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{product.price}
            </span>
          </div>

          {/* Savings & Delivery */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-green-600">
              Save ₹{product.price - (product.discountedPrice || product.discountPrice)}
            </span>
            <span className="text-xs text-gray-500">
              {product.price >= 500 ? 'Free Delivery' : 'Delivery Charges Apply'}
            </span>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Size Selection Modal */}
      <Dialog
        open={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-2xl">
            <div className="relative p-6">
              {/* Close Button */}
              <button
                onClick={() => setShowSizeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Modal Content */}
              <DialogTitle className="text-xl font-bold text-gray-900 mb-4">
                Select Size
              </DialogTitle>

              <div className="mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover object-top rounded-lg"
                />
              </div>

              <p className="text-sm text-gray-600 mb-2 font-semibold">{product.brand}</p>
              <p className="text-sm text-gray-800 mb-4 line-clamp-2">{product.title}</p>

              <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes && product.sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      disabled={size.quantity === 0}
                      className={({ active, checked }) =>
                        classNames(
                          size.quantity > 0
                            ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                            : "cursor-not-allowed bg-gray-50 text-gray-200",
                          active ? "ring-2 ring-indigo-500" : "",
                          checked ? "border-indigo-600 ring-2 ring-indigo-500" : "border-gray-200",
                          "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none"
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">
                            {size.name}
                          </RadioGroup.Label>
                          {size.quantity === 0 && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              <button
                onClick={handleConfirmAddToCart}
                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ProductCard;