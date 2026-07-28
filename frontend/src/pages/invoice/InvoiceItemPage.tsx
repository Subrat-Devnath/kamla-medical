import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type InvoiceItem = {
    invoiceItemId: string;
    productName: string;
    quantity: number;
    unitListPrice: number;
    unitSellPrice: number;
    unitSellDiscount: number;
    totalSellPrice: number;
    totalSellDiscount: number;
};

type Product = {
    productName: string;
    productQuantity: number;
    category: string;
    formula: string;
    unitListPrice: number;
};

type PaginationResponse<T> = {
    data: T[];
    nextPageState: string | null;
    hasNext: boolean;
};

function InvoiceItemPage() {
    const { invoiceNumber, customerName } = useParams();
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const PRODUCT_API = `${BASE_URL}/product-mgmt/api/v1`;

    const pageSize = 5;

    // -----------------------------
    // Invoice Item State
    // -----------------------------
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const [pageState, setPageState] = useState<string | null>(null);
    const [pageStateStack, setPageStateStack] = useState<string[]>([]);
    const [hasNext, setHasNext] = useState(false);

    // -----------------------------
    // Product data State
    // -----------------------------
    const [products, setProducts] = useState<Product[]>([]);
    const [productPageState, setProductPageState] = useState<string | null>(null);
    const [productPageStateStack, setProductPageStateStack] = useState<string[]>([]);
    const [productHasNext, setProductHasNext] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");

    // -----------------------------
    // UI State
    // -----------------------------
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showProductModal, setShowProductModal] = useState(false);

    // -----------------------------
    // Inline Editing State
    // -----------------------------
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editFields, setEditFields] = useState({
        quantity: 1,
        unitSellPrice: 0,
        unitSellDiscount: 0,
    });

    const [invoiceStatus, setInvoiceStatus] = useState("");
    const isInvoiceLocked = invoiceStatus === "COMPLETED";

    // -------------------------------------------------------
    // Fetch Invoice Items
    // -------------------------------------------------------
    const fetchInvoiceItems = async (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${PRODUCT_API}/invoice-items-with-pagination/${invoiceNumber}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize,
                        pageState: nextState,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch invoice items");
            }

            const data: PaginationResponse<InvoiceItem> = await response.json();
            setInvoiceItems(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack(prev => [...prev, nextState]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Fetch Products (Modal View Only)
    // -------------------------------------------------------
    const fetchProducts = async (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${PRODUCT_API}/products-with-pagination`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize,
                        pageState: nextState,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load products listing");
            }

            const data: PaginationResponse<Product> = await response.json();
            setProducts(data.data || []);
            setProductPageState(data.nextPageState);
            setProductHasNext(data.hasNext);

            if (isNext && nextState) {
                setProductPageStateStack(prev => [...prev, nextState]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Search Products by Name/Formula
    // -------------------------------------------------------
    const searchProducts = async (
        query: string,
        nextState: string | null = null,
        isNext: boolean = true
    ) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${PRODUCT_API}/search-products-with-pagination?productNameOrFormula=${encodeURIComponent(query)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize,
                        pageState: nextState,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to filter products");
            }

            const data: PaginationResponse<Product> = await response.json();
            setProducts(data.data || []);
            setProductPageState(data.nextPageState);
            setProductHasNext(data.hasNext);

            if (isNext && nextState) {
                setProductPageStateStack(prev => [...prev, nextState]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${PRODUCT_API}/invoice?invoiceId=${invoiceNumber}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch invoice.");
            }

            const data = await response.json();
            setInvoiceStatus(data.status);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const addInvoiceItem = async (product: Product) => {
        try {
            if (isInvoiceLocked) {
                setError("This invoice has already been completed and cannot be modified.");
                return;
            }
            setLoading(true);
            setError("");

            // 1. STOCK GUARD: Block if backend count is 0 or completely missing
            if (product.productQuantity === undefined || product.productQuantity <= 0) {
                throw new Error(`Out of Stock: "${product.productName}" is currently unavailable.`);
            }

            const token = localStorage.getItem("accessToken");

            const checkResponse = await fetch(
                `${PRODUCT_API}/invoice-items-with-pagination/${invoiceNumber}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize: 1000,
                        pageState: null,
                    }),
                }
            );

            if (!checkResponse.ok) throw new Error("Failed to scan current invoice records.");
            const checkData: PaginationResponse<InvoiceItem> = await checkResponse.json();
            const fullInvoiceItems = checkData.data || [];

            const existingItem = fullInvoiceItems.find(
                (item) => item.productName === product.productName
            );

            let payload: any;

            if (existingItem) {
                const updatedQuantity = existingItem.quantity + 1;

                // 2. CAPACITY GUARD: Prevent incremental additions from exceeding physical stock counts
                if (updatedQuantity > product.productQuantity) {
                    setError(
                        `Cannot add more! Only ${product.productQuantity} units of "${product.productName}" are left in stock.`
                    );

                    setTimeout(() => {
                        setError("");
                    }, 5000);
                    return;
                }

                // Calculate based on existing sell pricing structure or default back to base list mapping
                const currentUnitSellPrice = existingItem.unitSellPrice ?? product.unitListPrice;
                const currentUnitDiscount = existingItem.unitSellDiscount ?? 0;

                const totalDiscount = currentUnitDiscount * updatedQuantity;
                const totalPrice = (currentUnitSellPrice * updatedQuantity) - totalDiscount;

                payload = {
                    invoiceItemId: existingItem.invoiceItemId,
                    invoiceNumber,
                    productName: product.productName,
                    quantity: updatedQuantity,
                    unitListPrice: product.unitListPrice,
                    unitSellPrice: currentUnitSellPrice,
                    unitSellDiscount: currentUnitDiscount,
                    totalSellPrice: totalPrice,
                    totalSellDiscount: totalDiscount
                };
            } else {
                payload = {
                    invoiceNumber,
                    productName: product.productName,
                    quantity: 1,
                    unitListPrice: product.unitListPrice,
                    unitSellPrice: product.unitListPrice,
                    unitSellDiscount: 0,
                    totalSellPrice: product.unitListPrice,
                    totalSellDiscount: 0
                };
            }

            const response = await fetch(
                `${PRODUCT_API}/invoice-items`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to map item onto current invoice");
            }

            setShowProductModal(false);
            fetchInvoiceItems(null, false);
        } catch (err: any) {
            // Catches custom out-of-stock errors and updates the error banner
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Inline Item Editing Core Handlers
    // -------------------------------------------------------
    const startInlineEditing = (index: number, item: InvoiceItem) => {
        setEditingIndex(index);

        // 1. Ensure quantity is never 0 or undefined
        const currentQuantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

        // 2. Get the actual sell price, fallback to list price if not set
        const currentSellPrice = item.unitSellPrice ?? item.unitListPrice ?? 0;

        // 3. Calculate the discount per item strictly based on list price vs sell price
        const listPrice = item.unitListPrice ?? 0;
        const currentDiscountPerItem = Math.max(0, listPrice - currentSellPrice);

        setEditFields({
            quantity: currentQuantity,
            unitSellPrice: currentSellPrice,
            unitSellDiscount: currentDiscountPerItem,
        });
    };

    const handleEditFieldChange = (field: string, rawValue: string, unitListPrice?: number) => {
        setEditFields(prev => {
            // 1. If the user clears the input completely, preserve empty string so they can type
            if (rawValue === "") {
                return {
                    ...prev,
                    [field]: "",
                    // Dynamically reset discount if sell price is wiped out
                    ...(field === "unitSellPrice" ? { unitSellDiscount: unitListPrice ?? 0 } : {})
                };
            }

            // 2. Parse the string value into a clean number (removes leading zeroes like 01 -> 1)
            const parsedValue = parseFloat(rawValue);
            if (isNaN(parsedValue)) return prev;

            const updatedFields = { ...prev, [field]: parsedValue };

            // 3. Automatically adjust the read-only discount when sell price changes
            if (field === "unitSellPrice" && unitListPrice !== undefined) {
                updatedFields.unitSellDiscount = Math.max(0, unitListPrice - parsedValue);
            }

            return updatedFields;
        });
    };

    const saveInlineEdit = async (item: InvoiceItem) => {
        try {
            if (isInvoiceLocked) {
                setError("This invoice has already been completed and cannot be modified.");
                return;
            }
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const totalDiscount = editFields.unitSellDiscount * editFields.quantity;
            const totalPrice = (editFields.unitSellPrice * editFields.quantity) - totalDiscount;

            const payload = {
                invoiceItemId: item.invoiceItemId,
                invoiceNumber,
                productName: item.productName,
                quantity: editFields.quantity,
                unitListPrice: item.unitListPrice,
                unitSellPrice: editFields.unitSellPrice,
                unitSellDiscount: editFields.unitSellDiscount,
                totalSellPrice: totalPrice,
                totalSellDiscount: totalDiscount
            };

            const response = await fetch(`${PRODUCT_API}/invoice-items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save item revisions.");
            }

            setEditingIndex(null);
            // Reload the exact active page to reflect calculations cleanly
            const activePageState = pageStateStack[pageStateStack.length - 1] || null;
            fetchInvoiceItems(activePageState, false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Generate Invoice API and Open PDF Handler
    // -------------------------------------------------------
    const handleGenerateInvoice = async () => {
        try {
            if (isInvoiceLocked) {
                setError("This invoice has already been completed and cannot be modified.");
                return;
            }
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${PRODUCT_API}/invoice/${invoiceNumber}/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to process billing document generation.");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

            const previewWindow = window.open(downloadUrl);
            if (!previewWindow) {
                const anchorLink = document.createElement('a');
                anchorLink.href = downloadUrl;
                anchorLink.download = `Invoice_${invoiceNumber}.pdf`;
                anchorLink.click();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Action Event Handlers
    // -------------------------------------------------------
    const handleProductSearch = () => {
        setProductPageStateStack([]);
        setProductPageState(null);

        if (searchText.trim() === "") {
            setIsSearchMode(false);
            fetchProducts(null, false);
        } else {
            setIsSearchMode(true);
            searchProducts(searchText, null, false);
        }
    };

    const handleProductNext = () => {
        if (!productHasNext || !productPageState) return;

        if (isSearchMode) {
            searchProducts(searchText, productPageState, true);
        } else {
            fetchProducts(productPageState, true);
        }
    };

    const handleProductPrev = () => {
        if (productPageStateStack.length === 0) return;
        const stack = [...productPageStateStack];
        stack.pop();
        const prevState = stack.length > 0 ? stack[stack.length - 1] : null;
        setProductPageStateStack(stack);

        if (isSearchMode) {
            searchProducts(searchText, prevState, false);
        } else {
            fetchProducts(prevState, false);
        }
    };

    const handleNext = () => {
        if (!hasNext || !pageState) return;
        setEditingIndex(null); // Clear editing view state context bounds safely
        fetchInvoiceItems(pageState, true);
    };

    const handlePrev = () => {
        if (pageStateStack.length === 0) return;
        setEditingIndex(null);
        const stack = [...pageStateStack];
        stack.pop();
        const prevState = stack.length > 0 ? stack[stack.length - 1] : null;
        setPageStateStack(stack);
        fetchInvoiceItems(prevState, false);
    };

    const openProductModal = () => {
        if (isInvoiceLocked) {
            setError("This invoice has already been completed and cannot be modified.");
            return;
        }
        setSearchText("");
        setIsSearchMode(false);
        setProductPageState(null);
        setProductPageStateStack([]);
        setProductHasNext(false);
        fetchProducts(null, false);
        setShowProductModal(true);
    };

    useEffect(() => {
        fetchInvoice();
        fetchInvoiceItems(null, false);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                {/* FIXED HIGHLY VISIBLE HEADER ROW WITH ACTIONS */}
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate("/invoices")}
                            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Invoice Items
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                            <p>Customer: <span className="text-slate-200 font-semibold">{customerName || "N/A"}</span></p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* Add Product */}
                        <div className="relative group">
                            <button
                                onClick={openProductModal}
                                disabled={isInvoiceLocked}
                                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                            >
                                + Add Product
                            </button>

                            {isInvoiceLocked && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg z-50">
                                    Invoice is locked. You cannot add products.
                                </div>
                            )}
                        </div>

                        {/* Generate Invoice */}
                        <div className="relative group">
                            <button
                                onClick={handleGenerateInvoice}
                                disabled={loading || isInvoiceLocked || invoiceItems.length === 0}
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                            >
                                Generate Invoice
                            </button>

                            {isInvoiceLocked && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg z-50">
                                    Invoice is locked. You cannot generate the invoice.
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* ERROR/LOADING STATES */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                        Processing request...
                    </div>
                )}

                {/* INVOICE ITEMS TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-sky-500 text-white">
                                <tr>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4 text-center">Qty</th>
                                    <th className="p-4 text-right">List Price</th>
                                    <th className="p-4 text-right">Sell Price</th>
                                    <th className="p-4 text-right">Discount (Per Item)</th>
                                    <th className="p-4 text-right">Total Price</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-sm">
                                {invoiceItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            No products mapped onto this invoice yet. Click "+ Add Product" to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    invoiceItems.map((item, index) => {
                                        const isEditing = editingIndex === index;

                                        return (
                                            <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                                                <td className="p-4 font-medium text-slate-200">{item.productName}</td>

                                                {/* QUANTITY FIELD - TYPEABLE ONLY */}
                                                <td className="p-4 text-center">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className="w-20 text-center px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            value={editFields.quantity}
                                                            onKeyDown={(e) => {
                                                                if (["-", "+", "e", "E"].includes(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                // Allow empty value while editing
                                                                if (value === "") {
                                                                    handleEditFieldChange("quantity", value, item.unitListPrice);
                                                                    return;
                                                                }

                                                                // Only allow positive integers
                                                                if (/^\d+$/.test(value) && Number(value) >= 1) {
                                                                    handleEditFieldChange("quantity", value, item.unitListPrice);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="font-semibold text-slate-300">{item.quantity}</span>
                                                    )}
                                                </td>

                                                <td className="p-4 text-right text-slate-400">
                                                    ₹{(item.unitListPrice ?? 0).toLocaleString('en-IN')}
                                                </td>

                                                {/* SELL PRICE FIELD - TYPEABLE ONLY */}
                                                <td className="p-4 text-right text-slate-200">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="w-28 text-right px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            value={editFields.unitSellPrice}
                                                            // Fix: Pass raw string value directly
                                                            onChange={(e) => handleEditFieldChange("unitSellPrice", e.target.value, item.unitListPrice)}
                                                        />
                                                    ) : (
                                                        `₹${(item.unitSellPrice ?? 0).toLocaleString('en-IN')}`
                                                    )}
                                                </td>

                                                {/* DISCOUNT FIELD (READ-ONLY) */}
                                                <td className="p-4 text-right text-amber-400/90">
                                                    {isEditing ? (
                                                        <span>
                                                            ₹{(Number(editFields.unitSellDiscount || 0)).toLocaleString('en-IN')}
                                                            <span className="text-xs text-slate-500 block">
                                                                {/* Safe live calculation fallback for total discount */}
                                                                (Tot: ₹{(Number(editFields.unitSellDiscount || 0) * Number(editFields.quantity || 0)).toLocaleString('en-IN')})
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        `₹${(item.unitSellDiscount ?? 0).toLocaleString('en-IN')} (Tot: ₹${(item.totalSellDiscount ?? 0).toLocaleString('en-IN')})`
                                                    )}
                                                </td>

                                                {/* LIVE DYNAMIC TOTAL DISPLAY */}
                                                <td className="p-4 text-right font-bold text-emerald-400">
                                                    {isEditing ? (
                                                        <span>
                                                            ₹{(
                                                                (Number(editFields.unitSellPrice || 0) * Number(editFields.quantity || 0))
                                                            ).toLocaleString('en-IN')}
                                                        </span>
                                                    ) : (
                                                        `₹${(item.totalSellPrice ?? 0).toLocaleString('en-IN')}`
                                                    )}
                                                </td>

                                                {/* ACTION CONTROL BUTTONS */}
                                                <td className="p-4 text-center">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => saveInlineEdit(item)}
                                                                className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingIndex(null)}
                                                                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (


                                                        <button
                                                            onClick={() => startInlineEditing(index, item)}
                                                            disabled={isInvoiceLocked}
                                                            className="px-3 py-1 text-xs font-semibold rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all"
                                                        >
                                                            Edit
                                                        </button>


                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MAIN PAGINATION */}
                <div className="flex justify-end gap-3 border-t border-slate-900 pt-4">
                    <button
                        disabled={pageStateStack.length === 0}
                        onClick={handlePrev}
                        className="px-4 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        Previous
                    </button>
                    <button
                        disabled={!hasNext}
                        onClick={handleNext}
                        className="px-4 py-2 text-xs font-semibold bg-cyan-600 rounded-xl text-white hover:bg-cyan-500 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md"
                    >
                        Next
                    </button>
                </div>

                {/* MODAL WINDOW */}
                {showProductModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
                        <div className="bg-slate-900 rounded-2xl w-full max-w-4xl border border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">

                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Select Inventory Product
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">Pick a product profile to directly register onto this draft bill layout.</p>
                                </div>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    &#10005;
                                </button>
                            </div>

                            {/* MODAL SEARCH BAR */}
                            <div className="p-6 pb-2 flex gap-3">
                                <input
                                    placeholder="Search Product Name or Formula..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleProductSearch()}
                                    className="flex-1 px-4 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200 placeholder-slate-600 transition-all"
                                />
                                <button
                                    onClick={handleProductSearch}
                                    className="px-5 py-2 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>

                            {/* MODAL TABLE OVERFLOW LISTING */}
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/40">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                            <tr>
                                                <th className="p-3">Product Name</th>
                                                <th className="p-3">Formula</th>
                                                <th className="p-3 text-center">Category</th>
                                                <th className="p-3 text-right">Unit List Price</th>
                                                <th className="p-3 text-center">Stock Available</th>
                                                <th className="p-3 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {products.map((product, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                                    <td className="p-3 font-medium text-slate-200">{product.productName}</td>
                                                    <td className="p-3 font-mono text-xs text-slate-400">{product.formula || "N/A"}</td>
                                                    <td className="p-3 text-center text-xs"><span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">{product.category}</span></td>
                                                    <td className="p-3 text-right font-semibold text-slate-200">₹{(product.unitListPrice ?? 0).toLocaleString('en-IN')}</td>
                                                    <td className="p-3 text-center text-amber-400 font-medium">{product.productQuantity}</td>
                                                    <td className="p-3 text-center">
                                                        <button
                                                            onClick={() => addInvoiceItem(product)}
                                                            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {products.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                                        No verified master product records matches criteria scope.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* MODAL FOOTER PAGINATION */}
                            <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-center gap-3">
                                <button
                                    disabled={productPageStateStack.length === 0}
                                    onClick={handleProductPrev}
                                    className="px-4 py-1.5 text-xs font-semibold bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-20 transition-all"
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={!productHasNext}
                                    onClick={handleProductNext}
                                    className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 disabled:opacity-20 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InvoiceItemPage;
