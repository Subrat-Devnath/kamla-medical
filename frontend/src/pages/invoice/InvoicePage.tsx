import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Hash,
  MapPin,
  Plus,
  ReceiptText,
  User,
  Wallet,
} from "lucide-react";

import {
  EmptyState,
  ErrorBanner,
  Field,
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
  TextArea,
  TextInput,
} from "@/components/hud";

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

    const handleSearch = () => {

        setPageState(null);
        setPageStateStack([]);

        if (searchText.trim() === "") {
            setIsSearchMode(false);
            fetchInvoices(null, false);
        } else {
            setIsSearchMode(true);
            searchInvoice(searchText, null, false);
        }

    };

    return (
        <PageShell>
            <PageHeader
                eyebrow="Billing"
                title="Manage Invoices"
                icon={ReceiptText}
                backTo="/home"
                subtitle="Draft, itemise and finalise customer bills."
                actions={
                    <NeonButton
                        variant="primary"
                        icon={Plus}
                        onClick={() => setShowAddModal(true)}
                    >
                        Create Invoice
                    </NeonButton>
                }
            />

            <SearchBar
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
                placeholder="Search customer…"
                className="sm:justify-end"
            />

            {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

            {loading && <LoadingStrip label="Loading invoices…" />}

            {invoices.length === 0 && !loading ? (
                <EmptyState
                    icon={ReceiptText}
                    title="No invoices found"
                    description={
                        isSearchMode
                            ? "No invoice matches that customer name."
                            : "Create your first invoice to start billing."
                    }
                    action={
                        <NeonButton
                            variant="primary"
                            icon={Plus}
                            onClick={() => setShowAddModal(true)}
                            className="mt-2"
                        >
                            Create Invoice
                        </NeonButton>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {invoices.map((invoice) => (
                        <Panel
                            key={invoice.invoiceNumber}
                            interactive
                            className="p-4 sm:p-5"
                        >
                            {/* Header */}
                            <div className="mb-4 min-w-0">
                                <h2 className="text-base leading-snug font-bold text-white sm:text-lg">
                                    {invoice.customerName}
                                </h2>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <Pill tone="cyan" icon={Hash}>
                                        {invoice.invoiceNumber?.slice(0, 10)}
                                    </Pill>
                                    <Pill
                                        tone={
                                            invoice.status === "COMPLETED" ? "emerald" : "amber"
                                        }
                                    >
                                        {invoice.status}
                                    </Pill>
                                    <Pill tone="emerald" icon={Wallet}>
                                        {invoice.totalPrice != null
                                            ? `₹ ${invoice.totalPrice}`
                                            : "—"}
                                    </Pill>
                                </div>
                            </div>

                            {/* Info boxes */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <InfoBox tone="violet" label="Customer" icon={User}>
                                    <InfoRow label="Name" value={invoice.customerName} />
                                    <InfoRow
                                        label="Address"
                                        value={invoice.customerAddress?.trim() || "—"}
                                        valueClassName="text-sky-300"
                                    />
                                </InfoBox>

                                <InfoBox tone="amber" label="Invoice" icon={Hash}>
                                    <InfoRow
                                        label="Number"
                                        value={invoice.invoiceNumber?.slice(0, 10)}
                                        valueClassName="font-mono text-cyan-300"
                                    />
                                    <InfoRow
                                        label="Status"
                                        value={invoice.status}
                                        valueClassName={
                                            invoice.status === "COMPLETED"
                                                ? "font-semibold text-emerald-400"
                                                : "font-semibold text-amber-300"
                                        }
                                    />
                                </InfoBox>

                                <InfoBox tone="emerald" label="Amount" icon={Wallet}>
                                    <p className="tabular text-2xl font-bold text-emerald-300">
                                        {invoice.totalPrice != null
                                            ? `₹${invoice.totalPrice.toLocaleString("en-IN")}`
                                            : "—"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Invoice total
                                    </p>
                                </InfoBox>
                            </div>

                            {/* Actions */}
                            <div className="mt-4">
                                <NeonButton
                                    size="sm"
                                    icon={ArrowRight}
                                    onClick={() =>
                                        navigate(
                                            `/invoice-items/${invoice.invoiceNumber}/${invoice.customerName}`
                                        )
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    View Details
                                </NeonButton>
                            </div>
                        </Panel>
                    ))}
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

            {/* CREATE MODAL */}
            <Modal
                open={showAddModal}
                onClose={() => {
                    resetForm();
                    setShowAddModal(false);
                }}
                title="Create Invoice"
                description="Start a draft bill for a customer."
                icon={ReceiptText}
                size="sm"
                footer={
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <NeonButton
                            onClick={() => {
                                resetForm();
                                setShowAddModal(false);
                            }}
                        >
                            Cancel
                        </NeonButton>
                        <NeonButton
                            variant="success"
                            icon={Plus}
                            onClick={createInvoice}
                            loading={loading}
                        >
                            Create
                        </NeonButton>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Field label="Customer Name">
                        <TextInput
                            icon={User}
                            placeholder="e.g. Ramesh Kumar"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </Field>

                    <Field label="Customer Address">
                        <TextArea
                            placeholder="Street, city, pincode"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                        />
                    </Field>

                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin size={12} />
                        The invoice opens in draft mode so you can add products next.
                    </p>
                </div>
            </Modal>
        </PageShell>
    );
}

export default InvoicePage;
