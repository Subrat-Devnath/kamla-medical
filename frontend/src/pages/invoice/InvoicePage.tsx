import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Invoice = {
    invoiceNumber: string;
    customerName: string;
    customerAddress: string;
    totalPrice: number;
    status: "DRAFT" | "COMPLETED";
};

type InvoicePageResponse = {
    data: Invoice[];
    nextPageState: string | null;
    hasNext: boolean;
};

function InvoicePage() {

    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API = `${BASE_URL}/product-mgmt/api/v1`;

    const pageSize = 5;

    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("");

    const [pageState, setPageState] = useState<string | null>(null);
    const [pageStateStack, setPageStateStack] = useState<string[]>([]);
    const [hasNext, setHasNext] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");

    const resetForm = () => {

        setCustomerName("");
        setCustomerAddress("");

    };

    //----------------------------------------
    // COMMON FETCH METHOD
    //----------------------------------------

    const fetchInvoiceData = async (
        url: string,
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pageSize,
                    pageState: nextState,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch invoices");
            }

            const data: InvoicePageResponse = await response.json();

            setInvoices(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack(prev => [...prev, nextState]);
            }

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }

        } finally {

            setLoading(false);

        }

    };

    //----------------------------------------
    // FETCH INVOICES
    //----------------------------------------

    const fetchInvoices = (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        fetchInvoiceData(
            `${API}/invoices-with-pagination`,
            nextState,
            isNext
        );

    };

    //----------------------------------------
    // SEARCH
    //----------------------------------------

    const searchInvoice = (
        customer: string,
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        fetchInvoiceData(
            `${API}/search-invoices-with-pagination?customerName=${encodeURIComponent(customer)}`,
            nextState,
            isNext
        );

    };

    //----------------------------------------
    // CREATE INVOICE
    //----------------------------------------

    const createInvoice = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/invoice`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        customerName,
                        customerAddress,
                        status: "DRAFT",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create invoice");
            }

            const invoice: Invoice = await response.json();

            resetForm();
            setShowAddModal(false);

            navigate(`/invoice-items/${invoice.invoiceNumber}/${invoice.customerName}`);

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }

        } finally {

            setLoading(false);

        }

    };

    //----------------------------------------

    const handleNext = () => {

        if (loading || !pageState || !hasNext) {
            return;
        }

        if (isSearchMode) {
            searchInvoice(searchText, pageState, true);
        } else {
            fetchInvoices(pageState, true);
        }

    };

    // intial loding
    useEffect(() => {
        fetchInvoices(null, false);
    }, []);

    //----------------------------------------

    const handlePrev = () => {

        if (loading || pageStateStack.length === 0) {
            return;
        }

        const stack = [...pageStateStack];

        stack.pop();

        const prevState =
            stack.length > 0
                ? stack[stack.length - 1]
                : null;

        setPageStateStack(stack);

        if (isSearchMode) {
            searchInvoice(searchText, prevState, false);
        } else {
            fetchInvoices(prevState, false);
        }

    };


    return (

        <div className="min-h-screen bg-black text-white p-6">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-6">

                <button
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20"
                >
                    ← Back
                </button>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500"
                >
                    + Create Invoice
                </button>

            </div>

            <h1 className="text-3xl font-bold text-cyan-400 mb-6">
                Manage Invoices
            </h1>

            {/* SEARCH */}
            <div className="flex justify-end mb-6">

                <div className="flex gap-2">

                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                    />

                    <button
                        onClick={() => {

                            setPageState(null);
                            setPageStateStack([]);

                            if (searchText.trim() === "") {
                                setIsSearchMode(false);
                                fetchInvoices(null, false);
                            } else {
                                setIsSearchMode(true);
                                searchInvoice(searchText, null, false);
                            }

                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500"
                    >
                        Search
                    </button>

                </div>

            </div>

            {error && (
                <p className="text-red-400 mb-4">{error}</p>
            )}

            {loading && (
                <p className="text-cyan-400 mb-4">Loading...</p>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">

                <table className="w-full">

                    <thead className="bg-sky-500 text-white">

                        <tr>

                            <th className="p-4 text-left">Invoice No</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Address</th>
                            <th className="p-4 text-center">Total</th>
                            <th className="p-4 text-center">Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {invoices.map((invoice) => (

                            <tr
                                key={invoice.invoiceNumber}
                                className="border-t border-white/10 hover:bg-white/5"
                            >

                                <td className="p-4">

                                    <button
                                        onClick={() => navigate(`/invoice-items/${invoice.invoiceNumber}/${invoice.customerName}`)}
                                        className="text-cyan-300 hover:text-cyan-400"
                                    >
                                        {invoice.invoiceNumber}
                                    </button>

                                </td>

                                <td className="p-4">
                                    {invoice.customerName}
                                </td>

                                <td className="p-4">
                                    {invoice.customerAddress}
                                </td>

                                <td className="p-4 text-center">
                                    ₹ {invoice.totalPrice}
                                </td>

                                <td className="p-4 text-center">

                                    <span
                                        className={
                                            invoice.status === "COMPLETED"
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                        }
                                    >
                                        {invoice.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-8">

                <button
                    disabled={loading || pageStateStack.length === 0}
                    onClick={handlePrev}
                    className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-40"
                >
                    Prev
                </button>

                <button
                    disabled={loading || !hasNext}
                    onClick={handleNext}
                    className="px-4 py-2 bg-cyan-600 rounded-xl disabled:opacity-40"
                >
                    Next
                </button>

            </div>

            {/* CREATE MODAL */}
            {showAddModal && (

                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

                    <div className="bg-zinc-900 p-6 rounded-2xl w-[500px] border border-white/10">

                        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                            Create Invoice
                        </h2>

                        <div className="space-y-4">

                            <input
                                placeholder="Customer Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            <textarea
                                placeholder="Customer Address"
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                        </div>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={createInvoice}
                                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500"
                            >
                                Create
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default InvoicePage;