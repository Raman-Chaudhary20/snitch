import React, { useState, useEffect, useRef } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const AllProducts = () => {
  const { handleGetProduct, handleUpdateProduct } = useProduct();
  const navigate = useNavigate();
  
  const { sellerProducts, loading, error } = useSelector((state) => state.product);

  // Modal and Edit states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriceAmount, setEditPriceAmount] = useState("");
  const [editPriceCurrency, setEditPriceCurrency] = useState("INR");
  const [retainedImages, setRetainedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // UI state
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);

  // Theme support
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return (
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return true;
  });

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load products on mount
  useEffect(() => {
    handleGetProduct().catch((err) => console.log("Failed to fetch products:", err));
  }, []);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  // Modal controls
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditPriceAmount(product.price?.amount || "");
    setEditPriceCurrency(product.price?.currency || "INR");
    setRetainedImages(product.images || []);
    setNewImages([]);
    setNewImagePreviews([]);
    setValidationError("");
    setModalSuccess(false);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "";
  };

  // Image helpers
  const handleAddFiles = (fileList) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      setValidationError("Only image files are allowed.");
      return;
    }

    const totalCurrentCount = retainedImages.length + newImages.length;
    if (totalCurrentCount + imageFiles.length > 7) {
      setValidationError("Maximum limit of 7 images exceeded.");
      return;
    }

    setValidationError("");
    setNewImages((prev) => [...prev, ...imageFiles]);
    const previews = imageFiles.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAddFiles(e.target.files);
    }
  };

  const removeRetainedImage = (index) => {
    setRetainedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    const previewUrl = newImagePreviews[index];
    URL.revokeObjectURL(previewUrl);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      setValidationError("Product title is required.");
      return;
    }
    if (!editDescription.trim()) {
      setValidationError("Product description is required.");
      return;
    }
    if (!editPriceAmount.trim() || isNaN(editPriceAmount) || parseFloat(editPriceAmount) <= 0) {
      setValidationError("Please enter a valid price greater than 0.");
      return;
    }
    if (retainedImages.length + newImages.length === 0) {
      setValidationError("Please have at least one product image.");
      return;
    }

    setValidationError("");

    const formData = new FormData();
    formData.append("title", editTitle.trim());
    formData.append("description", editDescription.trim());
    formData.append("priceAmount", editPriceAmount.trim());
    formData.append("priceCurrency", editPriceCurrency);
    
    // We send retained images as stringified JSON so the backend knows what to keep
    formData.append("existingImages", JSON.stringify(retainedImages));
    
    // Append new uploaded images
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await handleUpdateProduct(selectedProduct._id, formData);
      setModalSuccess(true);
      // Refresh the product list
      await handleGetProduct();
      setTimeout(() => {
        closeEditModal();
      }, 2000);
    } catch (err) {
      // Errors handled by hook / Redux slice
    }
  };
  

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-300 font-body text-neutral-600 dark:text-neutral-400 pb-24 pt-20">
      {/* Top Navbar */}
      <header className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900/60 fixed top-0 w-full z-50 transition-colors duration-300">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tighter text-primary cursor-pointer font-display select-none transition-opacity hover:opacity-90"
          >
            Snitch
          </div>
          
          <div className="flex items-center space-x-6 text-xs font-semibold">
            <button
              onClick={() => navigate("/seller/createProduct")}
              className="text-neutral-500 hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Listing</span>
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-neutral-600 dark:text-neutral-500 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer select-none font-bold"
            >
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block transition-all duration-300 ${darkMode ? "bg-primary shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-neutral-400 dark:bg-neutral-600"}`}
              ></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900/60 pb-6">
          <div>
            <h1 className="font-display text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-2">
              All Products
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Manage your fashion listings, track pricing, and update descriptions.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/seller/createProduct")}
            className="self-start sm:self-center bg-primary hover:bg-primary-dark text-neutral-950 font-bold px-5 py-3 rounded-lg text-sm transition-all shadow-md shadow-primary/10 flex items-center gap-2 select-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Listing</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        {loading && sellerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-primary rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-sm font-semibold">Loading listings...</p>
          </div>
        ) : error && sellerProducts.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
            <p className="font-semibold text-sm mb-2">{error}</p>
            <button
              onClick={handleGetProduct}
              className="text-xs text-primary font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : sellerProducts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl border border-neutral-200 dark:border-neutral-900">
            <svg
              className="w-12 h-12 text-neutral-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <p className="font-bold text-neutral-900 dark:text-white mb-2 font-display text-lg">
              No products found
            </p>
            <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
              You haven't listed any fashion products yet. Create your first listing to start selling!
            </p>
            <button
              onClick={() => navigate("/seller/createProduct")}
              className="bg-primary hover:bg-primary-dark text-neutral-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
            >
              Create Product Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/5 dark:bg-neutral-950/20 backdrop-blur-md border border-neutral-200 dark:border-neutral-900 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg dark:hover:border-neutral-800"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-black/5 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900/60">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5-1.5v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                  {/* Overlay Status */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border border-neutral-800 text-primary flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> 
                    Active
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-black text-neutral-900 dark:text-white leading-snug tracking-tight">
                      {product.title}
                    </h2>
                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-widest">
                      Seller Listing
                    </p>
                  </div>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between pt-4 border-t border-neutral-200 dark:border-neutral-900/60">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
                        Price Amount
                      </span>
                      <span className="text-primary font-black text-2xl tracking-tight">
                        {product.price?.currency === "INR" ? "₹" : product.price?.currency === "USD" ? "$" : product.price?.currency === "EUR" ? "€" : product.price?.currency === "GBP" ? "£" : "¥"}
                        {parseFloat(product.price?.amount || 0).toLocaleString()}
                        <span className="text-xs text-primary/70 font-bold ml-1">{product.price?.currency || "INR"}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-transparent border border-primary hover:bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 select-none"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal Overlay & Slide-up Sheet */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] transition-opacity duration-300 animate-in fade-in"
            onClick={closeEditModal}
          ></div>
          
          <div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-950 shadow-2xl transform transition-transform duration-300 z-[70] max-h-[92vh] flex flex-col sm:max-w-xl sm:mx-auto sm:rounded-t-3xl animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab" onClick={closeEditModal}>
              <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-800 rounded-full"></div>
            </div>

            <div className="px-6 pb-8 pt-2 overflow-y-auto flex-grow relative space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-950 sticky top-0 bg-white dark:bg-neutral-900 z-10">
                <h3 className="font-display text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Edit Product
                </h3>
                <button
                  className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  onClick={closeEditModal}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalSuccess ? (
                /* Success State */
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                    Product Updated
                  </h4>
                  <p className="text-sm text-neutral-500 text-center max-w-xs leading-relaxed">
                    Your changes have been saved successfully and are now live in the marketplace.
                  </p>
                </div>
              ) : loading ? (
                /* Loading State */
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-neutral-500 text-sm font-semibold">Saving changes...</p>
                </div>
              ) : (
                /* Edit Form */
                <form onSubmit={handleUpdateSubmit} className="space-y-5">
                  {validationError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm flex items-start gap-2.5 animate-in fade-in">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Product Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="editTitle">
                      Product Title
                    </label>
                    <input
                      id="editTitle"
                      type="text"
                      placeholder="Product Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="editDescription">
                      Description
                    </label>
                    <textarea
                      id="editDescription"
                      rows="4"
                      placeholder="Product Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-neutral-400 resize-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="editPrice">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 font-bold text-sm">
                          {editPriceCurrency === "INR" ? "₹" : editPriceCurrency === "USD" ? "$" : editPriceCurrency === "EUR" ? "€" : editPriceCurrency === "GBP" ? "£" : "¥"}
                        </span>
                        <input
                          id="editPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={editPriceAmount}
                          onChange={(e) => setEditPriceAmount(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 rounded-lg pl-8 pr-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-neutral-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="editCurrency">
                        Currency
                      </label>
                      <select
                        id="editCurrency"
                        value={editPriceCurrency}
                        onChange={(e) => setEditPriceCurrency(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm cursor-pointer"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </div>

                  {/* Media (Retained and New Images) */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Product Media ({retainedImages.length + newImages.length}/7)
                      </label>
                    </div>

                    {/* Previews Row */}
                    <div className="flex flex-wrap gap-3 pb-1">
                      {/* Retained images */}
                      {retainedImages.map((image, index) => (
                        <div
                          key={`retained-${image._id || index}`}
                          className="h-20 w-20 rounded-xl overflow-hidden relative border border-neutral-200 dark:border-neutral-850 group bg-neutral-100 dark:bg-neutral-950"
                        >
                          <img src={image.url} alt="Product" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeRetainedImage(index)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer select-none"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* New images */}
                      {newImagePreviews.map((url, index) => (
                        <div
                          key={`new-${url}`}
                          className="h-20 w-20 rounded-xl overflow-hidden relative border border-primary/30 group bg-neutral-100 dark:bg-neutral-950"
                        >
                          <img src={url} alt="New Upload" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer select-none"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute top-0.5 left-0.5 bg-primary text-[8px] text-neutral-950 font-bold px-1 rounded">
                            New
                          </div>
                        </div>
                      ))}

                      {/* Add Image Button */}
                      {retainedImages.length + newImages.length < 7 && (
                        <button
                          type="button"
                          onClick={triggerFileSelect}
                          className="h-20 w-20 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center text-neutral-400 hover:text-primary hover:border-primary/50 transition-colors bg-neutral-50 dark:bg-neutral-950/20 cursor-pointer select-none"
                        >
                          <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[10px] font-bold">Add Photo</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800/40 active:scale-95 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-primary text-neutral-950 font-bold hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/10 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-neutral-100/40 dark:bg-black/40 border-t border-neutral-200 dark:border-neutral-900/60 py-6 transition-colors duration-300 mt-20">
        <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-xs">
          <div className="font-bold text-primary font-display">Snitch</div>
          <div className="text-neutral-500 dark:text-neutral-600 font-label transition-colors duration-300">
            © 2026 Snitch Marketplace. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">
              Privacy Policy
            </a>
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">
              Terms of Service
            </a>
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllProducts;