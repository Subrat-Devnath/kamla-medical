import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  History,
  Tag,
  Trash2,
  TriangleAlert,
  Truck,
  Wallet,
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
} from "@/components/hud";
import { cn } from "@/lib/utils";

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
            return "text-rose-400";
        }

        if (diffDays <= 20) {
            // Expires within next 20 days
            return "text-amber-300";
        }

        // More than 20 days remaining
        return "text-emerald-400";
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
        <PageShell>
            <PageHeader
                eyebrow="Supply Ledger"
                title="Purchase History"
                icon={History}
                backTo="/products"
                subtitle={
                    <span>
                        Product{" "}
                        <span className="font-semibold text-cyan-300">
                            {productName}
                        </span>
                    </span>
                }
                actions={
                    selectedRecords.length > 0 ? (
                        <NeonButton
                            variant="danger"
                            icon={Trash2}
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete ({selectedRecords.length})
                        </NeonButton>
                    ) : undefined
                }
            />

            <SearchBar
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
                placeholder="Search supplier…"
                className="sm:justify-end"
            />

            {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

            {loading && <LoadingStrip label="Processing…" />}

            {history.length === 0 && !loading ? (
                <EmptyState
                    icon={History}
                    title="No purchase history found"
                    description={
                        isSearchMode
                            ? "No record matches that supplier name."
                            : "Purchases recorded for this product will appear here."
                    }
                />
            ) : (
                <div className="space-y-4">
                    {history.map((h, index) => {
                        const recordId = `${h.supplierName}-${h.purchaseDate}`;
                        const selected = selectedRecords.includes(recordId);

                        return (
                            <Panel
                                key={index}
                                interactive
                                className={cn(
                                    "p-4 sm:p-5",
                                    selected && "border-cyan-400/50 bg-cyan-400/[0.06]",
                                )}
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-start gap-3">
                                    <label className="flex shrink-0 cursor-pointer items-center pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            aria-label={`Select purchase from ${h.supplierName}`}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRecords((prev) => [...prev, recordId]);
                                                } else {
                                                    setSelectedRecords((prev) =>
                                                        prev.filter((id) => id !== recordId)
                                                    );
                                                }
                                            }}
                                            className="hud-checkbox"
                                        />
                                    </label>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="flex items-center gap-2 text-base leading-snug font-bold text-white sm:text-lg">
                                            <Truck size={16} className="shrink-0 text-slate-500" />
                                            <span className="min-w-0">
                                                {h.supplierName || "Unknown Supplier"}
                                            </span>
                                        </h2>

                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <Pill tone="slate" icon={CalendarDays}>
                                                {formatDate(h.purchaseDate)}
                                            </Pill>
                                            <Pill tone="cyan">
                                                Qty {formatValue(h.purchasedQuantity)}
                                            </Pill>
                                            <Pill tone="amber">
                                                Buy ₹{formatValue(h.totalBuyPrice)}
                                            </Pill>
                                        </div>
                                    </div>
                                </div>

                                {/* Info boxes */}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <InfoBox tone="violet" label="List Pricing" icon={Tag}>
                                        <InfoRow
                                            label="Unit list"
                                            value={`₹${formatValue(h.unitListPrice)}`}
                                        />
                                        <InfoRow
                                            label="Total list"
                                            value={`₹${formatValue(h.totalListPrice)}`}
                                            valueClassName="text-cyan-300 font-semibold"
                                        />
                                    </InfoBox>

                                    <InfoBox tone="emerald" label="Buy Pricing" icon={Wallet}>
                                        <InfoRow
                                            label="Unit buy"
                                            value={`₹${formatValue(h.unitBuyPrice)}`}
                                            valueClassName="text-emerald-300"
                                        />
                                        <InfoRow
                                            label="Total buy"
                                            value={`₹${formatValue(h.totalBuyPrice)}`}
                                            valueClassName="text-amber-300 font-semibold"
                                        />
                                        <InfoRow
                                            label="Discount"
                                            value={`₹${formatValue(h.unitBuyDiscount)}`}
                                            valueClassName="text-pink-300"
                                        />
                                    </InfoBox>

                                    <InfoBox tone="rose" label="Dates & Qty" icon={CalendarDays}>
                                        <InfoRow
                                            label="Purchase"
                                            value={formatDate(h.purchaseDate)}
                                        />
                                        <InfoRow
                                            label="Expiry"
                                            value={formatDate(h.expiryDate)}
                                            valueClassName={cn(
                                                "font-semibold",
                                                getExpiryColor(h.expiryDate),
                                            )}
                                        />
                                        <InfoRow
                                            label="Quantity"
                                            value={formatValue(h.purchasedQuantity)}
                                            valueClassName="font-semibold text-slate-100"
                                        />
                                    </InfoBox>
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

            <Modal
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                description="Selected purchase records will be removed."
                icon={TriangleAlert}
                size="sm"
                footer={
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <NeonButton onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </NeonButton>
                        <NeonButton
                            variant="danger"
                            icon={Trash2}
                            onClick={deleteHistoryRecords}
                            loading={loading}
                        >
                            Delete
                        </NeonButton>
                    </div>
                }
            >
                <p className="text-sm text-slate-300">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-rose-300">
                        {selectedRecords.length}
                    </span>{" "}
                    selected history record(s)?
                </p>
            </Modal>
        </PageShell>
    );
}

export default PurchaseHistoryPage;
