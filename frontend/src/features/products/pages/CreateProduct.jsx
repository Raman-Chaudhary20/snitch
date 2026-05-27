import React, { useState, useEffect, useRef } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.product);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priceAmount, setPriceAmount] = useState("");
    const [priceCurrency, setPriceCurrency] = useState("INR");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // UI states
    const [validationError, setValidationError] = useState("");
    const [success, setSuccess] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Initialize theme mode matching Login.jsx
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

    // Sync theme mode with document element
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    // Cleanup object URLs on unmount to prevent leaks
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList);

        // Check files are indeed images
        const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));
        if (imageFiles.length !== newFiles.length) {
            setValidationError("Only image files are allowed.");
            return;
        }

        // Check total limit of 7 images
        if (images.length + imageFiles.length > 7) {
            setValidationError("You can upload a maximum of 7 images.");
            return;
        }

        setValidationError("");
        setImages((prev) => [...prev, ...imageFiles]);

        const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleRemoveImage = (index) => {
        const urlToRemove = imagePreviews[index];
        URL.revokeObjectURL(urlToRemove);

        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Frontend validation
        if (!title.trim()) {
            setValidationError("Product title is required.");
            return;
        }
        if (!description.trim()) {
            setValidationError("Product description is required.");
            return;
        }
        if (!priceAmount.trim() || isNaN(priceAmount) || parseFloat(priceAmount) <= 0) {
            setValidationError("Please enter a valid price amount greater than 0.");
            return;
        }
        if (images.length === 0) {
            setValidationError("Please upload at least one image of your product.");
            return;
        }

        setValidationError("");

        // Create form data payload
        const data = new FormData();
        data.append("title", title.trim());
        data.append("description", description.trim());
        data.append("priceAmount", priceAmount.trim());
        data.append("priceCurrency", priceCurrency);

        images.forEach((file) => {
            data.append("images", file);
        });

        console.log(title, description, priceAmount, priceCurrency, images);


        try {
            setSuccess(true);
            console.log(data);
            await handleCreateProduct(data);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            // API errors are handled by redux slice & displayed via the `error` state selector
            const errMsg = err.message || "Failed to create product. Please try again."
        }finally{
            setSuccess(false);
        }

    };

    if (success) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6 selection:bg-primary/30 selection:text-primary transition-colors duration-300">
                <div className="w-full max-w-md text-center p-8 md:p-12 glass-panel rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-display text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
                        Listing Created
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 font-body text-sm leading-relaxed">
                        Your product has been successfully created and published to the marketplace.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-600 font-body animate-pulse">
                        Redirecting to home page...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-300 font-body text-neutral-600 dark:text-neutral-400 relative pb-24 pt-20">
            {/* Top Navbar */}
            <header className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900/60 fixed top-0 w-full z-50 transition-colors duration-300">
                <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate("/")}
                        className="text-neutral-500 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-sm"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </button>

                    <div className="text-lg font-black tracking-tight text-neutral-900 dark:text-white font-display">
                        New Listing
                    </div>

                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="text-neutral-600 dark:text-neutral-500 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer select-none font-bold text-xs"
                        >
                            <span>{darkMode ? "Light" : "Dark"}</span>
                            <span
                                className={`w-2.5 h-2.5 rounded-full inline-block transition-all duration-300 ${darkMode ? "bg-primary shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-neutral-400 dark:bg-neutral-600"}`}
                            ></span>
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary hover:bg-primary-dark text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-3.5 w-3.5 text-neutral-950" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <span>Publish</span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="max-w-3xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="text-center mb-2">
                    <h1 className="font-display text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-3 transition-colors duration-300">
                        Create a New Product
                    </h1>
                    <p className="text-neutral-500 max-w-md mx-auto text-sm leading-relaxed">
                        Fill out the form below to list your fashion item in the marketplace.
                    </p>
                </div>

                {/* Display Validation or Submission Error */}
                {(validationError || error) && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm flex items-start gap-2.5 animate-in fade-in duration-300">
                        <svg
                            className="w-5 h-5 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span>{validationError || error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details Section */}
                    <section className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden transition-all duration-300 space-y-6">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60"></div>
                        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                            Basic Details
                        </h2>

                        {/* Product Title */}
                        <div className="space-y-2">
                            <label
                                className="block text-xs font-bold uppercase tracking-widest text-neutral-500"
                                htmlFor="title"
                            >
                                Product Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g. Vintage Leather Aviator Jacket"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label
                                className="block text-xs font-bold uppercase tracking-widest text-neutral-500"
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Describe your item's style, fit, condition, materials..."
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm resize-none"
                            />
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden transition-all duration-300 space-y-6">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60"></div>
                        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                            Pricing
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Price Amount */}
                            <div className="sm:col-span-2 space-y-2">
                                <label
                                    className="block text-xs font-bold uppercase tracking-widest text-neutral-500"
                                    htmlFor="priceAmount"
                                >
                                    Price Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 font-bold text-sm">
                                        {priceCurrency === "INR" ? "₹" : priceCurrency === "USD" ? "$" : priceCurrency === "EUR" ? "€" : priceCurrency === "GBP" ? "£" : "¥"}
                                    </span>
                                    <input
                                        id="priceAmount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={priceAmount}
                                        onChange={(e) => setPriceAmount(e.target.value)}
                                        className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg pl-8 pr-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Price Currency */}
                            <div className="space-y-2">
                                <label
                                    className="block text-xs font-bold uppercase tracking-widest text-neutral-500"
                                    htmlFor="priceCurrency"
                                >
                                    Currency
                                </label>
                                <select
                                    id="priceCurrency"
                                    value={priceCurrency}
                                    onChange={(e) => setPriceCurrency(e.target.value)}
                                    className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm cursor-pointer select-none"
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Media Upload Section */}
                    <section className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden transition-all duration-300 space-y-6">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60"></div>

                        <div className="flex justify-between items-center">
                            <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                                Product Media
                            </h2>
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-display">
                                {images.length}/7 images
                            </span>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={onButtonClick}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive
                                ? "border-primary bg-primary/5"
                                : "border-neutral-300 dark:border-neutral-800 hover:border-primary/60 hover:bg-neutral-100/10 dark:hover:bg-neutral-900/10"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <svg
                                className={`w-10 h-10 mb-3 transition-colors ${dragActive ? "text-primary" : "text-neutral-400 dark:text-neutral-600"}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>

                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                Drag &amp; drop your product photos here
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                                or click to browse from your device (supporting PNG, JPG, WEBP)
                            </p>
                        </div>

                        {/* Previews Grid */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 pt-2">
                                {imagePreviews.map((url, index) => (
                                    <div
                                        key={url}
                                        className="relative aspect-square rounded-lg overflow-hidden group border border-neutral-200 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-950"
                                    >
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-1 rounded-full text-white cursor-pointer select-none transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Position indicator */}
                                        <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                                            #{index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Submit Action (Alternative) */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-neutral-950 font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-neutral-950" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Creating Listing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Product Listing</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

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

export default CreateProduct;