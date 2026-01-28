import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import LinearProgress from '@mui/material/LinearProgress'
import ProductReviewCard from './ProductReviewCard'
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { findProductById, findProducts } from '../../../Redux/Customers/Product/Action'
import { getAllReviews, getAllRatings } from '../../../Redux/Customers/Review/Action'
import { addItemToCart } from '../../../Redux/Customers/Cart/Action'
import { RadioGroup } from '@headlessui/react'
import SimilarProductCard from '../SimilarProductCard/SimilarProductCard'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customersProduct, review } = useSelector((store) => store);
    const { productId } = useParams();
    const jwt = localStorage.getItem("jwt");

    const handleAddToCart = (e) => {
        e.preventDefault();

        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        const data = { productId: Number(productId), size: selectedSize.name };
        console.log("Adding to cart:", data);

        dispatch(addItemToCart(data));
        setAddedToCart(true);
        setTimeout(() => {
            navigate("/cart");
        }, 800);
    };

    useEffect(() => {
        const data = { productId: Number(productId), jwt };
        dispatch(findProductById(data));
        dispatch(getAllReviews(productId));
        dispatch(getAllRatings(productId));
    }, [productId, dispatch, jwt]);

    useEffect(() => {
        if (customersProduct.product) {
            const product = customersProduct.product;
            const category = product.category?.name ||
                product.category?.parentCategory?.name ||
                product.category?.parentCategory?.parentCategory?.name;

            if (category) {
                const filters = {
                    category: category,
                    colors: [],
                    sizes: [],
                    minPrice: 0,
                    maxPrice: 100000,
                    minDiscount: 0,
                    sort: 'price_low',
                    pageNumber: 0,
                    pageSize: 12
                };

                console.log("Fetching similar products with filters:", filters);
                dispatch(findProducts(filters));
            }
        }
    }, [customersProduct.product?.id, dispatch]);

    if (!customersProduct.product) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <div className="text-xl text-gray-600 font-medium">Loading amazing product...</div>
                </div>
            </div>
        );
    }

    const product = customersProduct.product;
    const reviews = review.reviews || [];
    const ratings = review.ratings || [];

    const similarProducts = (customersProduct.products?.content || [])
        .filter(p => p.id !== product.id)
        .slice(0, 10);

    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 4.6;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
        const rounded = Math.round(r.rating);
        if (rounded >= 1 && rounded <= 5) {
            ratingCounts[rounded]++;
        }
    });

    const totalRatings = ratings.length || 1;
    const ratingDistribution = [
        { label: "Excellent", value: (ratingCounts[5] / totalRatings) * 100, count: ratingCounts[5], color: "#10b981" },
        { label: "Very Good", value: (ratingCounts[4] / totalRatings) * 100, count: ratingCounts[4], color: "#3b82f6" },
        { label: "Good", value: (ratingCounts[3] / totalRatings) * 100, count: ratingCounts[3], color: "#f59e0b" },
        { label: "Average", value: (ratingCounts[2] / totalRatings) * 100, count: ratingCounts[2], color: "#f97316" },
        { label: "Poor", value: (ratingCounts[1] / totalRatings) * 100, count: ratingCounts[1], color: "#ef4444" },
    ];

    // Mock thumbnail images (in real app, these would come from product data)
    const productImages = [
        product.imageUrl,
        product.imageUrl,
        product.imageUrl,
        product.imageUrl
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
            
            <div className="pt-6 pb-12">
                {/* Modern Breadcrumb */}
                <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-8 mb-8">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <a href="/" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                                Home
                            </a>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li>
                            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                                {product.category?.parentCategory?.parentCategory?.name || 'Products'}
                            </a>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-semibold truncate max-w-[200px]">
                            {product.title}
                        </li>
                    </ol>
                </nav>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Enhanced Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className={`overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ${isImageZoomed ? 'scale-105' : ''}`}>
                                    <img
                                        src={productImages[selectedImage]}
                                        alt={product.title}
                                        className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                                        onClick={() => setIsImageZoomed(!isImageZoomed)}
                                    />
                                    {/* Wishlist Button */}
                                    <button className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all duration-300 group/heart">
                                        <svg className="w-6 h-6 group-hover/heart:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="grid grid-cols-4 gap-3">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                                            selectedImage === idx 
                                                ? 'ring-4 ring-indigo-600 shadow-lg scale-105' 
                                                : 'ring-2 ring-gray-200 hover:ring-indigo-400 hover:scale-105'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Product Features */}
                            <div className="grid grid-cols-3 gap-4 pt-6">
                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform">
                                    <div className="text-2xl mb-2">🚚</div>
                                    <div className="text-xs font-semibold text-indigo-900">Free Delivery</div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform">
                                    <div className="text-2xl mb-2">↩️</div>
                                    <div className="text-xs font-semibold text-emerald-900">Easy Returns</div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform">
                                    <div className="text-2xl mb-2">✨</div>
                                    <div className="text-xs font-semibold text-amber-900">Premium Quality</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Brand & Title */}
                            <div className="space-y-2">
                                <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                                    {product.brand}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {product.title}
                                </h1>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                                    <Rating
                                        name="read-only"
                                        value={averageRating}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">{ratings.length}</span> Ratings
                                </div>
                                <div className="text-sm">
                                    <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                                        {reviews.length} Reviews →
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl shadow-lg border border-indigo-100">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice}</span>
                                    <span className="text-2xl text-gray-400 line-through">₹{product.price}</span>
                                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                                        {product.discountPercent}% OFF
                                    </span>
                                </div>
                                <p className="text-sm text-green-600 font-semibold mt-2">
                                    💰 You save ₹{product.price - product.discountPrice}
                                </p>
                            </div>

                            {/* Size Selection */}
                            <form onSubmit={handleAddToCart} className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                                        <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                                            Size Guide →
                                        </button>
                                    </div>

                                    <RadioGroup
                                        value={selectedSize}
                                        onChange={setSelectedSize}
                                    >
                                        <RadioGroup.Label className="sr-only">
                                            Choose a size
                                        </RadioGroup.Label>
                                        <div className="grid grid-cols-4 gap-4">
                                            {product.sizes && product.sizes.map((size) => (
                                                <RadioGroup.Option
                                                    key={size.name}
                                                    value={size}
                                                    disabled={size.quantity === 0}
                                                    className={({ active, checked }) =>
                                                        classNames(
                                                            size.quantity > 0
                                                                ? checked
                                                                    ? "cursor-pointer bg-indigo-600 text-white"
                                                                    : "cursor-pointer bg-white text-gray-900 hover:bg-indigo-50"
                                                                : "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50",
                                                            checked 
                                                                ? "ring-4 ring-indigo-600 shadow-xl scale-110" 
                                                                : "ring-2 ring-gray-200",
                                                            "relative flex items-center justify-center rounded-xl py-4 text-base font-bold uppercase transition-all duration-300 transform hover:scale-105"
                                                        )
                                                    }
                                                >
                                                    {({ checked }) => (
                                                        <>
                                                            <RadioGroup.Label as="span">
                                                                {size.name}
                                                            </RadioGroup.Label>
                                                            {size.quantity === 0 && (
                                                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                                    <svg
                                                                        className="h-full w-full stroke-2 text-gray-300"
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
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={addedToCart}
                                        fullWidth
                                        className="transform hover:scale-[1.02] transition-all duration-300"
                                        sx={{
                                            padding: "1rem 2rem",
                                            fontSize: "1.125rem",
                                            fontWeight: "bold",
                                            borderRadius: "1rem",
                                            background: addedToCart 
                                                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                                : "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                                            boxShadow: "0 10px 40px rgba(79, 70, 229, 0.3)",
                                            textTransform: "none",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
                                                boxShadow: "0 15px 50px rgba(79, 70, 229, 0.4)",
                                            }
                                        }}
                                    >
                                        {addedToCart ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Added to Cart!
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add to Cart
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            {/* Product Details */}
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📦</span>
                                    Product Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Brand</span>
                                        <span className="text-gray-900 font-semibold">{product.brand}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Color</span>
                                        <span className="text-gray-900 font-semibold">{product.color}</span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                        <span className="text-gray-600 font-medium">Sizes</span>
                                        <span className="text-gray-900 font-semibold text-right">
                                            {product.sizes?.map(s => s.name).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || "High-quality product crafted with care and attention to detail. Experience premium comfort and style with this exceptional piece."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 max-h-50">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <span className="text-4xl">⭐</span>
                        Reviews & Ratings
                    </h2>

                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Ratings Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8 space-y-6">
                                    <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
                                        <div className="text-6xl font-bold text-indigo-600 mb-2">
                                            {averageRating.toFixed(1)}
                                        </div>
                                        <Rating value={averageRating} precision={0.5} readOnly size="large" />
                                        <p className="text-gray-600 font-medium mt-3">
                                            Based on {ratings.length} ratings
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {ratingDistribution.map((r, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-semibold text-gray-700">{r.label}</span>
                                                    <span className="text-gray-500">{r.count}</span>
                                                </div>
                                                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${r.value}%`,
                                                            backgroundColor: r.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="lg:col-span-2">
                                <div className="space-y-6">
                                    {reviews.length > 0 ? (
                                        reviews.map((review, i) => (
                                            <div key={review.id || i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                                                <ProductReviewCard item={review} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="text-6xl mb-4">📝</div>
                                            <p className="text-xl text-gray-600 font-medium mb-2">No reviews yet</p>
                                            <p className="text-gray-500">Be the first to review this product!</p>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    mt: 3,
                                                    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                                                    borderRadius: "0.75rem",
                                                    padding: "0.75rem 2rem",
                                                    textTransform: "none",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Write a Review
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="text-4xl">✨</span>
                                You Might Also Like
                            </h2>
                            <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 group">
                                View All
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {similarProducts.map((item, index) => (
                                <div key={item.id || index} className="transform hover:scale-105 transition-transform duration-300">
                                    <SimilarProductCard product={item} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}