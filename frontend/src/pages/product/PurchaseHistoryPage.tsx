import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type PurchaseHistory = {
    productName: string;
    purchaseDate: number;
    unitListPrice: number;
    totalListPrice: number;
    unitBuyPrice: number;
    totalBuyPrice: number;
    unitBuyDiscount: number;
    purchasedQuantity: number;
    expiryDate: number;
    supplierName: string;
};

type PurchaseHistoryPageResponse = {
    data: PurchaseHistory[];
    nextPageState: string | null;
    hasNext: boolean;
};

function PurchaseHistoryPage() {
    const navigate = useNavigate();
    const { productName } = useParams();

    const [history, setHistory] = useState<PurchaseHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Error state added

    // Search and Delete states (Jaise ProductsPage me tha)
    const [searchText, setSearchText] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]); // Array of unique identifiers (e.g., supplierName+date)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Cassandra paging state
    const [pageState, setPageState] = useState<string | null>(null);
    const [pageStateStack, setPageStateStack] = useState<string[]>([]);
    const [hasNext, setHasNext] = useState(false);

    const pageSize = 5;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API = `${BASE_URL}/product-mgmt/api/v1`;

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getExpiryColor = (expiryDate: number): string => {
        const expiry = new Date(expiryDate);
        const today = new Date();

        // Ignore time
        expiry.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays =
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) {
            // Already expired
            return "text-red-500";
        }

        if (diffDays <= 20) {
            // Expires within next 20 days
            return "text-yellow-400";
        }

        // More than 20 days remaining
        return "text-green-400";
    };

    const formatValue = (value?: number | null) => {
        if (value === null || value === undefined) return "-";
        return value;
    };

    // ---------------- FETCH PURCHASE HISTORY ----------------
    const fetchHistory = async (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/purchase-history/${productName}`,
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
                throw new Error("Failed to fetch history");
            }

            const data: PurchaseHistoryPageResponse = await response.json();
            setHistory(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack(prev => [...prev, nextState]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error fetching history");
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- SEARCH HISTORY ----------------
    const searchHistory = async (
        query: string,
        nextState: string | null = null,
        isNext: boolean = true
    ) => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            // Assuming standard endpoint or query param structure for history search
            const response = await fetch(
                `${API}/search-purchase-history-with-pagination?productName=${productName}&supplierName=${encodeURIComponent(query)}`,
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
                throw new Error("Search failed");
            }

            const data: PurchaseHistoryPageResponse = await response.json();
            setHistory(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack(prev => [...prev, nextState]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Search error");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- DELETE HISTORY RECORDS ----------------
    const deleteHistoryRecords = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/delete-purchase-history?productName=${productName}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(selectedRecords), // Array of IDs or Unique Composite Keys
                }
            );

            // Pehle hi popup ko close kar dete hain taki user experience kharab na ho
            setShowDeleteConfirm(false);

            if (!response.ok) {
                setError(`Failed to delete history records. Please try again.`);
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            }

            setSelectedRecords([]);

            // Reload exact page state
            if (isSearchMode) {
                searchHistory(searchText, null, false);
            } else {
                fetchHistory(null, false);
            }
        } catch (err: any) {
            // Agar koi network issue ya catch block me error aata hai, tab bhi popup close ho jaye
            setShowDeleteConfirm(false);
            setError(err.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- SEARCH HANDLER ----------------
    const handleSearch = () => {
        setPageState(null);
        setPageStateStack([]);
        const trimmedSearch = searchText.trim();

        if (trimmedSearch === "") {
            setIsSearchMode(false);
            fetchHistory(null, false);
        } else {
            setIsSearchMode(true);
            searchHistory(trimmedSearch, null, false);
        }
    };

    useEffect(() => {
        if (productName) {
            setPageState(null);
            setPageStateStack([]);
            fetchHistory(null, false);
        }
    }, [productName]);

    // ---------------- NEXT PAGE ----------------
    const handleNext = () => {
        if (!hasNext || !pageState) return;
        if (isSearchMode) {
            searchHistory(searchText, pageState, true);
        } else {
            fetchHistory(pageState, true);
        }
    };

    // ---------------- PREV PAGE ----------------
    const handlePrev = () => {
        const stack = [...pageStateStack];
        stack.pop();
        const prevState = stack.length > 0 ? stack[stack.length - 1] : null;
        setPageStateStack(stack);

        if (isSearchMode) {
            searchHistory(searchText, prevState, false);
        } else {
            fetchHistory(prevState, false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/products")}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
                >
                    &larr; Back
                </button>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-green-400 mb-2">
                Purchase History
            </h1>
            <h2 className="text-lg text-cyan-300 mb-6">
                Product: {productName}
            </h2>

            {/* SEARCH CONTAINER (Jaise ProductsPage me tha) */}
            <div className="flex justify-end mb-6">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search supplier..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* ERROR & LOADING STATUS */}
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {loading && <p className="text-cyan-400 mb-4">Processing...</p>}

            {/* PURCHASE HISTORY — BOX FORMAT */}
            {history.length === 0 && !loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
                    No purchase history found.
                </div>
            ) : (
                <div className="space-y-5">
                    {history.map((h, index) => {
                        const recordId = `${h.supplierName}-${h.purchaseDate}`;
                        const selected = selectedRecords.includes(recordId);

                        return (
                            <div
                                key={index}
                                className={`rounded-2xl border bg-white/[0.03] p-5 transition-colors ${
                                    selected
                                        ? "border-cyan-400/50 bg-cyan-500/5"
                                        : "border-white/10 hover:border-white/20"
                                }`}
                            >
                                {/* Header */}
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRecords((prev) => [...prev, recordId]);
                                                } else {
                                                    setSelectedRecords((prev) =>
                                                        prev.filter((id) => id !== recordId)
                                                    );
                                                }
                                            }}
                                            className="mt-1.5 h-4 w-4 cursor-pointer shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold text-white truncate">
                                                {h.supplierName || "Unknown Supplier"}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Purchased{" "}
                                                <span className="text-slate-200">
                                                    {formatDate(h.purchaseDate)}
                                                </span>
                                                {" · "}
                                                Qty{" "}
                                                <span className="text-cyan-300 font-semibold">
                                                    {formatValue(h.purchasedQuantity)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-yellow-300">
                                            Buy ₹{formatValue(h.totalBuyPrice)}
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                                            List ₹{formatValue(h.totalListPrice)}
                                        </span>
                                    </div>
                                </div>

                                {/* Info boxes */}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-300">
                                            List Pricing
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Unit List</span>
                                                <span className="font-medium text-slate-200">
                                                    ₹{formatValue(h.unitListPrice)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Total List</span>
                                                <span className="font-semibold text-cyan-300">
                                                    ₹{formatValue(h.totalListPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                                            Buy Pricing
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Unit Buy</span>
                                                <span className="font-medium text-green-300">
                                                    ₹{formatValue(h.unitBuyPrice)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Total Buy</span>
                                                <span className="font-semibold text-yellow-300">
                                                    ₹{formatValue(h.totalBuyPrice)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Discount</span>
                                                <span className="font-medium text-pink-300">
                                                    ₹{formatValue(h.unitBuyDiscount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-rose-300">
                                            Dates &amp; Qty
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Purchase</span>
                                                <span className="font-medium text-slate-200">
                                                    {formatDate(h.purchaseDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Expiry</span>
                                                <span className={`font-semibold ${getExpiryColor(h.expiryDate)}`}>
                                                    {formatDate(h.expiryDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <span className="text-slate-400">Quantity</span>
                                                <span className="font-semibold text-slate-100">
                                                    {formatValue(h.purchasedQuantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* DELETE SELECTION CONTAINER */}
            {selectedRecords.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition"
                    >
                        Delete Selected ({selectedRecords.length})
                    </button>
                </div>
            )}

            {/* PAGINATION PANEL */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={pageStateStack.length === 0}
                    onClick={handlePrev}
                    className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-40 transition"
                >
                    Prev
                </button>
                <button
                    disabled={!hasNext}
                    onClick={handleNext}
                    className="px-4 py-2 bg-cyan-600 rounded-xl disabled:opacity-40 transition"
                >
                    Next
                </button>
            </div>

            {/* CONFIRM DELETE MODAL */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-zinc-900 p-6 rounded-2xl w-[450px] border border-white/10">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Delete</h2>
                        <p className="mb-6">
                            Are you sure you want to delete {selectedRecords.length} selected history record(s)?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteHistoryRecords}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PurchaseHistoryPage;