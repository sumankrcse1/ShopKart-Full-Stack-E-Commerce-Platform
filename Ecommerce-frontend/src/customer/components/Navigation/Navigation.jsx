import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserCircleIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon as ShoppingCartOutline,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { ShoppingCart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem, Badge, InputBase, Paper, IconButton } from "@mui/material";
import { navigation } from "../../../config/navigationMenu";
import AuthModal from "../../Auth/AuthModel";
import { useDispatch, useSelector } from "react-redux";
import { deepPurple, purple } from "@mui/material/colors";
import { getUser, logout } from "../../../Redux/Auth/Action";
import { getCart } from "../../../Redux/Customers/Cart/Action";
import { findProducts } from "../../../Redux/Customers/Product/Action";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, cart } = useSelector((store) => store);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart(jwt));
    }
  }, [jwt, dispatch]);

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenAuthModal(true);
  };

  const handleClose = () => {
    setOpenAuthModal(false);
  };

  const handleCategoryClick = (category, section, item, close) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
    close();
  };

  useEffect(() => {
    if (auth.user) {
      handleClose();
    }
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate(-1);
    }
  }, [auth.user]);

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate("/");
  };

  const handleMyOrderClick = () => {
    handleCloseUserMenu();
    navigate("/account/order");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 group" onClick={() => setOpen(false)}>
                      <div className="relative">
                        <ShoppingCart className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={2.5} />
                        <SparklesIcon className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <span className="text-2xl font-bold text-white drop-shadow-md">
                        Shop<span className="text-yellow-300">Kart</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="rounded-full p-2 text-white/90 hover:bg-white/20 transition-all backdrop-blur-sm"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="px-4 py-4 bg-gradient-to-b from-gray-50 to-white">
                  <form onSubmit={handleSearch}>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 blur group-focus-within:opacity-20 transition-opacity" />
                    </div>
                  </form>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200 bg-white sticky top-[88px] z-10 shadow-sm">
                    <Tab.List className="-mb-px flex space-x-8 px-4 overflow-x-auto">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                                : "border-transparent text-gray-700 hover:text-indigo-600 hover:border-gray-300",
                              "flex-shrink-0 whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition-all rounded-t-lg"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-8 px-4 pb-8 pt-8 bg-gradient-to-b from-white to-gray-50"
                      >
                        {category.sections.map((section, idx) => (
                          <div key={section.name} className="animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                            <p className="font-bold text-gray-900 mb-4 flex items-center text-base">
                              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mr-3" />
                              {section.name}
                            </p>
                            <ul className="space-y-2">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  <button
                                    onClick={() => handleCategoryClick(category, section, item, () => setOpen(false))}
                                    className="group flex w-full items-center gap-x-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 transition-all shadow-sm">
                                      <span className="text-gray-600 group-hover:text-white font-semibold text-sm transition-colors">
                                        {item.name.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="font-medium">{item.name}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                {!auth.user && (
                  <div className="border-t border-gray-200 px-4 py-6 mt-auto bg-gradient-to-b from-white to-gray-50">
                    <Button
                      onClick={() => {
                        handleOpen();
                        setOpen(false);
                      }}
                      variant="contained"
                      fullWidth
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5568d3 0%, #63408a 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 20px rgba(102, 126, 234, 0.4)",
                        },
                        textTransform: "none",
                        py: 1.8,
                        borderRadius: 3,
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
        : "bg-white"
        }`}>
        {/* Top Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex h-10 items-center justify-center px-4 text-sm font-semibold text-white">
            <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
            Get free delivery on orders over ₹500
            <SparklesIcon className="h-4 w-4 ml-2 animate-pulse" />
          </div>
        </div>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="group rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-2.5 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 lg:hidden transition-all hover:shadow-md active:scale-95"
              onClick={() => setOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Logo */}
            <div className="flex lg:ml-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <ShoppingCart className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <SparklesIcon className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <span className="text-2xl font-bold hidden sm:block">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Shop</span>
                  <span className="text-yellow-300">Kart</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <Popover.Group className="hidden lg:flex lg:gap-x-1 lg:ml-8">
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="relative">
                  {({ open, close }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "relative flex items-center gap-x-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 outline-none group"
                        )}
                      >
                        {category.name}
                        <svg
                          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-2 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-2 scale-95"
                      >
                        <Popover.Panel className="fixed left-40 right-40 z-50 mt-3 px-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 border border-gray-100">
                            <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                              {/* Decorative element */}
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8 w-full">
                                {category.sections.map((section, idx) => (
                                  <div
                                    key={section.name}
                                    className="animate-fadeIn min-w-0"
                                    style={{ animationDelay: `${idx * 75}ms` }}
                                  >
                                    <p className="font-bold text-gray-900 mb-4 flex items-center text-sm sticky top-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-2">
                                      <span className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 flex-shrink-0" />
                                      <span className="truncate">{section.name}</span>
                                    </p>
                                    <ul className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
                                      {section.items.map((item) => (
                                        <li key={item.name}>
                                          <button
                                            onClick={() => handleCategoryClick(category, section, item, close)}
                                            className="group flex w-full items-center gap-x-3 rounded-xl p-2.5 hover:bg-white transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                          >
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all shadow-sm">
                                              <span className="text-gray-600 group-hover:text-white font-semibold text-xs transition-colors">
                                                {item.name.charAt(0)}
                                              </span>
                                            </div>
                                            <span className="text-sm text-gray-700 group-hover:text-indigo-600 font-medium transition-colors truncate">
                                              {item.name}
                                            </span>
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}

              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.href}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-all relative group"
                >
                  {page.name}
                </Link>
              ))}
            </Popover.Group>

            {/* Right side actions */}
            <div className="flex items-center gap-x-2 ml-auto">
              {auth.user?.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="hidden lg:flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:from-amber-600 hover:to-orange-700 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </button>
              )}
              {/* Search */}
              <div className="hidden lg:block">
                {!isSearchOpen ? (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="group p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:shadow-md"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                ) : (
                  <form onSubmit={handleSearch} className="relative group">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        setTimeout(() => setIsSearchOpen(false), 200);
                      }}
                      autoFocus
                      className="w-72 px-4 py-2.5 pl-11 rounded-xl border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-lg"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-xl" />
                  </form>
                )}
              </div>


              {/* User Menu */}
              {auth.user ? (
                <div className="hidden lg:block">
                  <button
                    onClick={handleUserClick}
                    className="group flex items-center gap-x-2 hover:opacity-90 transition-all"
                  >
                    <div className="relative">
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          width: 42,
                          height: 42,
                          fontSize: "1rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
                          }
                        }}
                      >
                        {auth.user?.firstName?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                  </button>
                  <Menu
                    anchorEl={anchorEl}
                    open={openUserMenu}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 3,
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                      }
                    }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                      <p className="text-sm font-semibold text-gray-900">{auth.user?.firstName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{auth.user?.email}</p>
                    </div>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" }
                      }}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">Profile</span>
                    </MenuItem>
                    <MenuItem
                      onClick={handleMyOrderClick}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" }
                      }}
                    >
                      <ShoppingCartOutline className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">My Orders</span>
                    </MenuItem>
                    <div className="my-1 h-px bg-gray-200 mx-2" />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 2,
                        color: "#dc2626",
                        "&:hover": { bgcolor: "rgba(220, 38, 38, 0.08)" }
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">Logout</span>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <Button
                  onClick={handleOpen}
                  variant="outlined"
                  className="hidden lg:flex"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.2,
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5568d3 0%, #63408a 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign In
                </Button>
              )}

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group hover:shadow-md"
              >
                <ShoppingBagIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {cart.cart?.totalItem > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-bounce ring-2 ring-white">
                    {cart.cart.totalItem}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal handleClose={handleClose} open={openAuthModal} />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5568d3 0%, #63408a 100%);
        }
      `}</style>
    </div>
  );
}