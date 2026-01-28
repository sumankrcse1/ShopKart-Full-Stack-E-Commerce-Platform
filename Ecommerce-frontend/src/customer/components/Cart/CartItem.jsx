import React, { useState } from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem } from "../../../Redux/Customers/Cart/Action";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const CartItem = ({ item, showButton }) => {
    const dispatch = useDispatch();
    const [isRemoving, setIsRemoving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRemoveItemFromCart = () => {
        setIsRemoving(true);
        setTimeout(() => {
            dispatch(removeCartItem(item.id));
        }, 300);
    };

    const handleUpdateCartItem = (num) => {
        setIsUpdating(true);
        const updatedData = { quantity: item.quantity + num };
        dispatch(updateCartItem(item.id, updatedData));
        setTimeout(() => setIsUpdating(false), 300);
    };

    return (
        <div 
            className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 ${
                isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{
                transform: isRemoving ? 'translateX(-100%)' : 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-500 pointer-events-none" />
            
            {/* Discount badge */}
            {item?.product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                    <LocalOfferIcon style={{ fontSize: '14px' }} />
                    {item?.product.discountPercent}% OFF
                </div>
            )}

            <div className="relative p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-md group-hover:shadow-xl transition-all duration-500">
                            <img
                                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                                src={item?.product.imageUrl}
                                alt={item?.product?.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Product Info */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-bold text-lg lg:text-xl text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                                    {item?.product?.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                    Size: {item?.size}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium text-gray-500">Seller:</span>
                                <span className="font-semibold text-gray-900 px-3 py-1 bg-gray-50 rounded-lg">
                                    {item?.product?.brand}
                                </span>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{item?.product.discountPrice}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                    ₹{item?.product.price}
                                </span>
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                                    Save ₹{item?.product.price - item?.product.discountPrice}
                                </span>
                            </div>
                        </div>

                        {/* Actions Section */}
                        {showButton && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600 mr-2">Qty:</span>
                                    <div className={`flex items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-1 shadow-inner ${
                                        isUpdating ? 'scale-95' : 'scale-100'
                                    } transition-transform duration-300`}>
                                        <IconButton
                                            onClick={() => handleUpdateCartItem(-1)}
                                            disabled={item?.quantity <= 1}
                                            size="small"
                                            className="hover:bg-white transition-all duration-300"
                                            style={{
                                                color: item?.quantity <= 1 ? '#d1d5db' : '#9333ea',
                                            }}
                                        >
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>

                                        <span className="px-6 py-2 font-bold text-lg text-gray-900 min-w-[60px] text-center bg-white rounded-lg mx-1 shadow-sm">
                                            {item?.quantity}
                                        </span>

                                        <IconButton
                                            onClick={() => handleUpdateCartItem(1)}
                                            size="small"
                                            className="hover:bg-white transition-all duration-300"
                                            style={{ color: '#9333ea' }}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                    onClick={handleRemoveItemFromCart}
                                    variant="outlined"
                                    startIcon={<DeleteOutlineIcon />}
                                    className="group/btn relative overflow-hidden rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        borderColor: '#ef4444',
                                        color: '#ef4444',
                                        textTransform: 'none',
                                        padding: '10px 24px',
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            borderColor: '#ef4444',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
                                        },
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    );
};

export default CartItem;