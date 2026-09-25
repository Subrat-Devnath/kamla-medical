import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Check,
  FileText,
  Hash,
  Layers,
  Lock,
  Package,
  PackageSearch,
  Pencil,
  Plus,
  Tag,
  Trash2,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react";

import {
  EmptyState,
  ErrorBanner,
  InfoBox,
  InfoRow,
  LoadingStrip,
  Modal,
  NeonButton,
  PageHeader,
  PageShell,
  Pagination,
  Panel,
  Pill,
  SearchBar,
  Toast,
  type ToastState,
} from "@/components/hud";
import { cn } from "@/lib/utils";

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
    const [toast, setToast] = useState<ToastState>(null);
    const [deleteTarget, setDeleteTarget] = useState<InvoiceItem | null>(null);

    // Toasts float above everything (including the full-screen product picker
    // sheet on mobile), so use them for feedback that happens while a modal is
    // open — the page's ErrorBanner would otherwise be hidden behind it.
    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

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
                showToast("error", "This invoice has already been completed and cannot be modified.");
                return;
            }
            setLoading(true);

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
                    showToast(
                        "error",
                        `Cannot add more! Only ${product.productQuantity} units of "${product.productName}" are left in stock.`
                    );
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

            showToast(
                "success",
                existingItem
                    ? `Updated "${product.productName}" — now ${payload.quantity} in the invoice.`
                    : `Added "${product.productName}" to the invoice.`
            );

            setShowProductModal(false);
            fetchInvoiceItems(null, false);
        } catch (err: any) {
            // Catches out-of-stock / capacity errors and shows them as a toast,
            // since the page's ErrorBanner is hidden behind the picker sheet.
            showToast("error", err.message || "Failed to add product to invoice.");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Delete Invoice Item
    // -------------------------------------------------------
    const confirmDeleteItem = async () => {
        if (!deleteTarget) return;

        if (isInvoiceLocked) {
            showToast("error", "This invoice has already been completed and cannot be modified.");
            setDeleteTarget(null);
            return;
        }

        const itemToDelete = deleteTarget;
        const remainingOnPage = invoiceItems.length - 1;

        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${PRODUCT_API}/invoice-items/${invoiceNumber}/${itemToDelete.invoiceItemId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || "Failed to remove item from invoice.");
            }

            showToast("success", `Removed "${itemToDelete.productName}" from the invoice.`);
            setDeleteTarget(null);

            // If that was the last item on this page and an earlier page exists,
            // step back a page instead of showing an empty list.
            if (remainingOnPage === 0 && pageStateStack.length > 0) {
                handlePrev();
            } else {
                const activePageState = pageStateStack[pageStateStack.length - 1] || null;
                fetchInvoiceItems(activePageState, false);
            }
        } catch (err: any) {
            showToast("error", err.message || "Failed to remove item from invoice.");
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
        <>
            <Toast toast={toast} />

        <PageShell>
            <PageHeader
                eyebrow="Billing"
                title="Invoice Items"
                icon={FileText}
                backTo="/invoices"
                subtitle={
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Pill tone="violet">{customerName || "N/A"}</Pill>
                        {invoiceNumber && (
                            <Pill tone="cyan" icon={Hash}>
                                {invoiceNumber.slice(0, 10)}
                            </Pill>
                        )}
                        {invoiceStatus && (
                            <Pill tone={isInvoiceLocked ? "emerald" : "amber"}>
                                {invoiceStatus}
                            </Pill>
                        )}
                    </div>
                }
                actions={
                    <>
                        <NeonButton
                            icon={Plus}
                            onClick={openProductModal}
                            disabled={isInvoiceLocked}
                        >
                            Add Product
                        </NeonButton>

                        <NeonButton
                            variant="success"
                            icon={FileText}
                            onClick={handleGenerateInvoice}
                            disabled={
                                loading || isInvoiceLocked || invoiceItems.length === 0
                            }
                        >
                            Generate Invoice
                        </NeonButton>
                    </>
                }
            />

            {isInvoiceLocked && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-700 sm:p-4 dark:border-amber-400/25 dark:text-amber-200">
                    <Lock size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p>
                        This invoice is completed and locked. Items can no longer be added
                        or edited.
                    </p>
                </div>
            )}

            {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

            {loading && <LoadingStrip label="Processing request…" />}

            {invoiceItems.length === 0 && !loading ? (
                <EmptyState
                    icon={PackageSearch}
                    title="No products on this invoice"
                    description="Add a product from your inventory to start building this bill."
                    action={
                        <NeonButton
                            variant="primary"
                            icon={Plus}
                            onClick={openProductModal}
                            disabled={isInvoiceLocked}
                            className="mt-2"
                        >
                            Add Product
                        </NeonButton>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {invoiceItems.map((item, index) => {
                        const isEditing = editingIndex === index;
                        const liveTotal = isEditing
                            ? Number(editFields.unitSellPrice || 0) * Number(editFields.quantity || 0)
                            : item.totalSellPrice ?? 0;
                        const liveDiscount = isEditing
                            ? Number(editFields.unitSellDiscount || 0)
                            : item.unitSellDiscount ?? 0;
                        const liveTotalDiscount = isEditing
                            ? Number(editFields.unitSellDiscount || 0) * Number(editFields.quantity || 0)
                            : item.totalSellDiscount ?? 0;

                        return (
                            <Panel
                                key={item.invoiceItemId || index}
                                interactive
                                className={cn(
                                    "p-4 sm:p-5",
                                    isEditing &&
                                        "border-cyan-600/50 bg-cyan-500/[0.08] dark:border-cyan-400/50 dark:bg-cyan-400/[0.06]",
                                )}
                            >
                                <div className="mb-4 min-w-0">
                                    <h2 className="text-base leading-snug font-bold text-slate-900 sm:text-lg dark:text-slate-100">
                                        {item.productName}
                                    </h2>

                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <Pill tone="slate" icon={Tag}>
                                            List ₹{(item.unitListPrice ?? 0).toLocaleString("en-IN")}
                                        </Pill>
                                        <Pill tone="cyan" icon={Layers}>
                                            Qty {isEditing ? editFields.quantity || "—" : item.quantity}
                                        </Pill>
                                        <Pill tone="emerald" icon={Wallet}>
                                            ₹{liveTotal.toLocaleString("en-IN")}
                                        </Pill>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <InfoBox tone="violet" label="Quantity" icon={Layers}>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="shrink-0 text-slate-500 dark:text-slate-400">Units</span>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    aria-label="Quantity"
                                                    className="hud-input no-spin tabular w-24 px-2.5 py-1.5 text-center"
                                                    value={editFields.quantity}
                                                    onKeyDown={(e) => {
                                                        if (["-", "+", "e", "E"].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "") {
                                                            handleEditFieldChange("quantity", value, item.unitListPrice);
                                                            return;
                                                        }
                                                        if (/^\d+$/.test(value) && Number(value) >= 1) {
                                                            handleEditFieldChange("quantity", value, item.unitListPrice);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <span className="font-semibold text-slate-800 tabular dark:text-slate-200">
                                                    {item.quantity}
                                                </span>
                                            )}
                                        </div>

                                        <InfoRow
                                            label="List price"
                                            value={`₹${(item.unitListPrice ?? 0).toLocaleString("en-IN")}`}
                                        />
                                    </InfoBox>

                                    <InfoBox tone="amber" label="Pricing" icon={Tag}>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="shrink-0 text-slate-500 dark:text-slate-400">Sell price</span>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    aria-label="Unit sell price"
                                                    className="hud-input no-spin tabular w-28 px-2.5 py-1.5 text-right"
                                                    value={editFields.unitSellPrice}
                                                    onChange={(e) =>
                                                        handleEditFieldChange(
                                                            "unitSellPrice",
                                                            e.target.value,
                                                            item.unitListPrice
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className="font-medium text-slate-800 tabular dark:text-slate-200">
                                                    ₹{(item.unitSellPrice ?? 0).toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>

                                        <InfoRow
                                            label="Discount / item"
                                            value={`₹${liveDiscount.toLocaleString("en-IN")}`}
                                            valueClassName="text-amber-700 dark:text-amber-300"
                                        />
                                        <InfoRow
                                            label="Total discount"
                                            value={`₹${liveTotalDiscount.toLocaleString("en-IN")}`}
                                            valueClassName="text-amber-700/90 dark:text-amber-400/90"
                                        />
                                    </InfoBox>

                                    <InfoBox tone="emerald" label="Totals" icon={Wallet}>
                                        <InfoRow
                                            label="Line total"
                                            value={`₹${liveTotal.toLocaleString("en-IN")}`}
                                            valueClassName="font-bold text-emerald-600 dark:text-emerald-400"
                                        />
                                        <InfoRow
                                            label="Customer saves"
                                            value={`₹${liveTotalDiscount.toLocaleString("en-IN")}`}
                                            valueClassName="text-amber-700 dark:text-amber-300"
                                        />
                                    </InfoBox>
                                </div>

                                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                    {isEditing ? (
                                        <>
                                            <NeonButton
                                                variant="success"
                                                size="sm"
                                                icon={Check}
                                                onClick={() => saveInlineEdit(item)}
                                                loading={loading}
                                            >
                                                Save
                                            </NeonButton>
                                            <NeonButton
                                                size="sm"
                                                icon={X}
                                                onClick={() => setEditingIndex(null)}
                                            >
                                                Cancel
                                            </NeonButton>
                                        </>
                                    ) : (
                                        <>
                                            <NeonButton
                                                size="sm"
                                                icon={Pencil}
                                                onClick={() => startInlineEditing(index, item)}
                                                disabled={isInvoiceLocked}
                                            >
                                                Edit item
                                            </NeonButton>
                                            <NeonButton
                                                variant="danger"
                                                size="sm"
                                                icon={Trash2}
                                                onClick={() => setDeleteTarget(item)}
                                                disabled={isInvoiceLocked}
                                            >
                                                Remove
                                            </NeonButton>
                                        </>
                                    )}
                                </div>
                            </Panel>
                        );
                    })}
                </div>
            )}

            <Pagination
                canPrev={pageStateStack.length > 0}
                canNext={hasNext}
                onPrev={handlePrev}
                onNext={handleNext}
                loading={loading}
                className="pt-2"
            />

            {/* ---------------- PRODUCT PICKER ---------------- */}
            <Modal
                open={showProductModal}
                onClose={() => setShowProductModal(false)}
                title="Select Inventory Product"
                description="Pick a product to register onto this draft bill."
                icon={Package}
                size="lg"
                footer={
                    <Pagination
                        canPrev={productPageStateStack.length > 0}
                        canNext={productHasNext}
                        onPrev={handleProductPrev}
                        onNext={handleProductNext}
                        loading={loading}
                    />
                }
            >
                <div className="space-y-4">
                    <SearchBar
                        value={searchText}
                        onChange={setSearchText}
                        onSubmit={handleProductSearch}
                        placeholder="Search product name or formula…"
                        fullWidth
                    />

                    {products.length === 0 ? (
                        <div className="rounded-2xl border border-slate-900/10 p-8 text-center text-sm text-slate-500 dark:border-white/10">
                            No product matches this search.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {products.map((product, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-slate-900/10 bg-slate-900/[0.02] p-4 transition-colors hover:border-cyan-600/30 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30"
                                >
                                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm leading-snug font-bold text-slate-900 sm:text-base dark:text-slate-100">
                                                {product.productName}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Formula{" "}
                                                <span className="font-mono text-slate-700 dark:text-slate-300">
                                                    {product.formula || "N/A"}
                                                </span>
                                            </p>
                                        </div>

                                        <NeonButton
                                            variant={product.productQuantity > 0 ? "success" : "danger"}
                                            size="sm"
                                            icon={product.productQuantity > 0 ? Plus : TriangleAlert}
                                            onClick={() => addInvoiceItem(product)}
                                            disabled={product.productQuantity <= 0}
                                            className="w-full sm:w-auto"
                                        >
                                            {product.productQuantity > 0 ? "Select" : "Out of Stock"}
                                        </NeonButton>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-3">
                                        <InfoBox
                                            tone="violet"
                                            label="Category"
                                            className="py-2.5"
                                        >
                                            <InfoRow
                                                label="Type"
                                                value={product.category || "—"}
                                            />
                                        </InfoBox>

                                        <InfoBox tone="amber" label="List Price" className="py-2.5">
                                            <InfoRow
                                                label="Unit"
                                                value={`₹${(product.unitListPrice ?? 0).toLocaleString("en-IN")}`}
                                                valueClassName="font-semibold"
                                            />
                                        </InfoBox>

                                        <InfoBox tone="emerald" label="Stock" className="py-2.5">
                                            <InfoRow
                                                label="Available"
                                                value={product.productQuantity}
                                                valueClassName={
                                                    product.productQuantity > 0
                                                        ? "font-semibold text-emerald-600 dark:text-emerald-300"
                                                        : "font-semibold text-rose-600 dark:text-rose-400"
                                                }
                                            />
                                        </InfoBox>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>

            {/* ---------------- REMOVE ITEM CONFIRM ---------------- */}
            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Remove Item"
                description="This removes the product line from the current draft invoice."
                icon={TriangleAlert}
                size="sm"
                footer={
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <NeonButton onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </NeonButton>
                        <NeonButton
                            variant="danger"
                            icon={Trash2}
                            onClick={confirmDeleteItem}
                            loading={loading}
                        >
                            Remove
                        </NeonButton>
                    </div>
                }
            >
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {deleteTarget?.productName}
                    </span>{" "}
                    from this invoice?
                </p>
            </Modal>
        </PageShell>
        </>
    );
}

export default InvoiceItemPage;
