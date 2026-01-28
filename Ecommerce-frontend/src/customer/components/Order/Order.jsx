import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";
import OrderCard from "./OrderCard";
import { Package, Filter, X, CheckCircle2, Truck, XCircle, RotateCcw, Search } from "lucide-react";

const orderStatus = [
    { label: "On The Way", value: "on_the_way", icon: Truck, color: "blue" },
    { label: "Delivered", value: "delivered", icon: CheckCircle2, color: "green" },
    { label: "Cancelled", value: "cancelled", icon: XCircle, color: "red" },
    { label: "Returned", value: "returned", icon: RotateCcw, color: "orange" },
];

const Order = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { order } = useSelector(store => store);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        dispatch(getOrderHistory({ jwt }));
    }, [jwt, dispatch]);

    const handleFilterChange = (value) => {
        setSelectedFilters(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
    };

    const filteredOrders = selectedFilters.length === 0 
        ? order.orders 
        : order.orders?.filter(ord => {
            const orderStatusLower = ord.orderStatus?.toLowerCase().replace(/_/g, ' ');
            return selectedFilters.some(filter => 
                orderStatusLower === filter.replace(/_/g, ' ')
            );
        });

    const getStatusColor = (value) => {
        const status = orderStatus.find(s => s.value === value);
        return status?.color || "gray";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Package className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {order.orders?.length || 0} total orders
                                </p>
                            </div>
                        </div>
                        
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">Filters</span>
                            {selectedFilters.length > 0 && (
                                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {selectedFilters.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} w-full lg:w-72 flex-shrink-0`}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                            {/* Filter Header */}
                            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-slate-700" />
                                        <h2 className="font-semibold text-slate-900">Filters</h2>
                                    </div>
                                    {selectedFilters.length > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filter Options */}
                            <div className="p-5">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                    Order Status
                                </h3>
                                <div className="space-y-2">
                                    {orderStatus.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = selectedFilters.includes(option.value);
                                        
                                        return (
                                            <label
                                                key={option.value}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? 'bg-indigo-50 border-2 border-indigo-200' 
                                                        : 'border-2 border-transparent hover:bg-slate-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleFilterChange(option.value)}
                                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                                                />
                                                <Icon className={`w-5 h-5 text-${option.color}-600`} />
                                                <span className={`text-sm font-medium ${
                                                    isSelected ? 'text-slate-900' : 'text-slate-700'
                                                }`}>
                                                    {option.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {selectedFilters.length > 0 && (
                                <div className="p-5 bg-slate-50 border-t border-slate-200">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        Active Filters
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFilters.map((filter) => {
                                            const status = orderStatus.find(s => s.value === filter);
                                            return (
                                                <button
                                                    key={filter}
                                                    onClick={() => handleFilterChange(filter)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    {status?.label}
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Orders List */}
                    <main className="flex-1 min-w-0">
                        {!order.orders || order.orders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <div className="max-w-sm mx-auto">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
                                    <p className="text-slate-500">
                                        When you place orders, they will appear here
                                    </p>
                                </div>
                            </div>
                        ) : filteredOrders && filteredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredOrders.map((orderItem) => {
                                    return orderItem?.orderItems?.map((item, index) => (
                                        <OrderCard 
                                            key={`${orderItem.id}-${item.id || index}`} 
                                            item={item} 
                                            order={orderItem} 
                                        />
                                    ));
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <div className="max-w-sm mx-auto">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Filter className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No matching orders</h3>
                                    <p className="text-slate-500 mb-4">
                                        Try adjusting your filters to see more results
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Order;