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

    const [pageState, setPageState] = useState<string | null>(null);

    const [pageStateStack, setPageStateStack] = useState<string[]>([]);

    const [hasNext, setHasNext] = useState(false);

    const pageSize = 8;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const API = `${BASE_URL}/product-mgmt/api/v1`;

    const formatDate = (timestamp?: number) => {

        if (!timestamp) {
            return "-";
        }

        return new Date(timestamp).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatValue = (value?: number | null) => {

        if (value === null || value === undefined) {
            return "-";
        }

        return value;
    };

    const fetchHistory = async (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        try {

            setLoading(true);

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

            const data: PurchaseHistoryPageResponse =
                await response.json();

            setHistory(data.data || []);

            setPageState(data.nextPageState);

            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack(prev => [...prev, nextState]);
            }

        } catch (err) {

            console.error(err);

            setHistory([]);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (productName) {

            setPageState(null);

            setPageStateStack([]);

            fetchHistory(null, false);
        }

    }, [productName]);

    const handleNext = () => {

        if (!hasNext || !pageState) {
            return;
        }

        fetchHistory(pageState, true);
    };

    const handlePrev = () => {

        const stack = [...pageStateStack];

        stack.pop();

        const prevState =
            stack.length > 0
                ? stack[stack.length - 1]
                : null;

        setPageStateStack(stack);

        fetchHistory(prevState, false);
    };

    return (

        <div className="min-h-screen bg-black text-white p-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/products")}
                className="mb-6 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
            >
                ← Back
            </button>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-green-400 mb-2">
                Purchase History
            </h1>

            <h2 className="text-lg text-cyan-300 mb-6">
                Product: {productName}
            </h2>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-400">
                    Loading history...
                </p>
            )}

            {/* PURCHASE HISTORY GRID */}
            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
                <table className="w-full text-sm">
                    <thead className="bg-cyan-700 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Purchase Date</th>
                            <th className="px-4 py-3 text-left">Expiry Date</th>
                            <th className="px-4 py-3 text-right">Qty</th>
                            <th className="px-4 py-3 text-right">Unit List</th>
                            <th className="px-4 py-3 text-right">Total List</th>
                            <th className="px-4 py-3 text-right">Unit Buy</th>
                            <th className="px-4 py-3 text-right">Total Buy</th>
                            <th className="px-4 py-3 text-right">Discount</th>
                            <th className="px-4 py-3 text-left">Supplier</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-10 text-center text-slate-400"
                                >
                                    Loading purchase history...
                                </td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-10 text-center text-slate-400"
                                >
                                    No purchase history found.
                                </td>
                            </tr>
                        ) : (
                            history.map((h, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-slate-700 hover:bg-slate-800 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        {formatDate(h.purchaseDate)}
                                    </td>

                                    <td className="px-4 py-3 text-red-300">
                                        {formatDate(h.expiryDate)}
                                    </td>

                                    <td className="px-4 py-3 text-right font-semibold">
                                        {formatValue(h.purchasedQuantity)}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        ₹{formatValue(h.unitListPrice)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-cyan-300 font-medium">
                                        ₹{formatValue(h.totalListPrice)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-green-300 font-medium">
                                        ₹{formatValue(h.unitBuyPrice)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-yellow-300 font-medium">
                                        ₹{formatValue(h.totalBuyPrice)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-pink-300">
                                        ₹{formatValue(h.unitBuyDiscount)}
                                    </td>

                                    <td className="px-4 py-3 text-blue-300">
                                        {h.supplierName || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-8">

                <button
                    disabled={pageStateStack.length === 0}
                    onClick={handlePrev}
                    className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-40"
                >
                    Prev
                </button>

                <button
                    disabled={!hasNext}
                    onClick={handleNext}
                    className="px-4 py-2 bg-cyan-600 rounded-xl disabled:opacity-40"
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default PurchaseHistoryPage;