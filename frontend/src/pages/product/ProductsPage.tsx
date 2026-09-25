import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FlaskConical,
  History,
  Package,
  PackageSearch,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
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
  TextInput,
} from "@/components/hud";
import { cn } from "@/lib/utils";

type Product = {
    productName: string;
    expiryDate: number;
    productQuantity: number;
    category: string;
    formula: string;
};

type ProductPageResponse = {
    data: Product[];
    nextPageState: string | null;
    hasNext: boolean;
};

function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [searchText, setSearchText] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // add product modal
    const [showAddModal, setShowAddModal] = useState(false);

    // form
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [formula, setFormula] = useState("");
    const [supplierName, setSupplierName] = useState("");

    const [totalQuantity, setTotalQuantity] = useState("");

    // pricing
    const [unitListPrice, setUnitListPrice] = useState("");
    const [unitBuyPrice, setUnitBuyPrice] = useState("");

    // dates
    const [purchaseDate, setPurchaseDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    // Cassandra paging state
    const [pageState, setPageState] = useState<string | null>(null);

    // history for prev button
    const [pageStateStack, setPageStateStack] = useState<string[]>([]);

    const [hasNext, setHasNext] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const pageSize = 5;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const API = `${BASE_URL}/product-mgmt/api/v1`;

    const navigate = useNavigate();

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

    const getExpiryStatus = (expiryDate?: number) => {
        if (!expiryDate) return null;

        const expiry = new Date(expiryDate);
        const today = new Date();

        expiry.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays =
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return { tone: "rose" as const, label: "Expired" };
        if (diffDays <= 20)
            return { tone: "amber" as const, label: `${Math.round(diffDays)}d left` };

        return { tone: "emerald" as const, label: "In date" };
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ---------------- FETCH PRODUCTS ----------------
    const fetchProducts = async (
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/products-with-pagination`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize: pageSize,
                        pageState: nextState,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data: ProductPageResponse = await response.json();

            setProducts(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack((prev) => [...prev, nextState]);
            }

        } catch (err: any) {

            setError(err.message || "Error loading products");

        } finally {

            setLoading(false);
        }
    };

    // ---------------- SEARCH PRODUCT ----------------
    const searchProduct = async (
        name: string,
        nextState: string | null = null,
        isNext: boolean = true
    ) => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/search-products-with-pagination?productNameOrFormula=${encodeURIComponent(name)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageSize: pageSize,
                        pageState: nextState,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data: ProductPageResponse = await response.json();

            setProducts(data.data || []);
            setPageState(data.nextPageState);
            setHasNext(data.hasNext);

            if (isNext && nextState) {
                setPageStateStack((prev) => [...prev, nextState]);
            }

        } catch (err: any) {

            setError(err.message || "Search error");

        } finally {

            setLoading(false);
        }
    };

    // ---------------- RESET FORM ----------------
    const resetForm = () => {

        setProductName("");
        setCategory("");
        setFormula("");
        setSupplierName("");

        setTotalQuantity("");

        setUnitListPrice("");
        setUnitBuyPrice("");

        setPurchaseDate("");
        setExpiryDate("");
    };

    // ---------------- ADD PRODUCT ----------------
    const addProduct = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            // convert date -> epoch
            const purchaseEpoch =
                purchaseDate
                    ? new Date(purchaseDate).getTime()
                    : null;

            const expiryEpoch =
                expiryDate
                    ? new Date(expiryDate).getTime()
                    : null;

            const quantity = Number(totalQuantity);

            const payload = {

                productName,
                category,
                formula,
                supplierName,

                totalQuantity: quantity,
                purchasedQuantity: quantity,
                remainingQuantity: quantity,
                soldQuantity: 0,

                // pricing
                unitListPrice: Number(unitListPrice),
                unitBuyPrice: Number(unitBuyPrice),

                purchaseDate: purchaseEpoch,
                expiryDate: expiryEpoch,
            };

            const response = await fetch(
                `${API}/product`,
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
                throw new Error("Failed to add product");
            }

            resetForm();

            setShowAddModal(false);

            fetchProducts(null, false);

        } catch (err: any) {

            setError(err.message || "Add product failed");

        } finally {

            setLoading(false);
        }
    };

    const deleteProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                `${API}/delete-product-and-history`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(selectedProducts),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete products");
            }

            setSelectedProducts([]);
            setShowDeleteConfirm(false);

            if (isSearchMode) {
                searchProduct(searchText, null, false);
            } else {
                fetchProducts(null, false);
            }

        } catch (err: any) {

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

            fetchProducts(null, false);

        } else {

            setIsSearchMode(true);

            searchProduct(trimmedSearch, null, false);
        }
    };

    // initial load
    useEffect(() => {
        fetchProducts(null, false);
    }, []);

    // ---------------- NEXT PAGE ----------------
    const handleNext = () => {

        if (!hasNext || !pageState) {
            return;
        }

        if (isSearchMode) {

            searchProduct(searchText, pageState, true);

        } else {

            fetchProducts(pageState, true);
        }
    };

    // ---------------- PREV PAGE ----------------
    const handlePrev = () => {

        const stack = [...pageStateStack];

        stack.pop();

        const prevState =
            stack.length > 0
                ? stack[stack.length - 1]
                : null;

        setPageStateStack(stack);

        if (isSearchMode) {

            searchProduct(searchText, prevState, false);

        } else {

            fetchProducts(prevState, false);
        }
    };

    return (
        <PageShell>
            <PageHeader
                eyebrow="Inventory"
                title="Manage Products"
                icon={Package}
                backTo="/home"
                subtitle="Track stock, formulas and expiry dates across your catalogue."
                actions={
                    <>
                        {selectedProducts.length > 0 && (
                            <NeonButton
                                variant="danger"
                                icon={Trash2}
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete ({selectedProducts.length})
                            </NeonButton>
                        )}

                        <NeonButton
                            variant="primary"
                            icon={Plus}
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Product
                        </NeonButton>
                    </>
                }
            />

            <SearchBar
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
                placeholder="Search product or formula…"
                className="sm:justify-end"
            />

            {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

            {loading && <LoadingStrip label="Loading products…" />}

            {products.length === 0 && !loading ? (
                <EmptyState
                    icon={PackageSearch}
                    title="No products found"
                    description={
                        isSearchMode
                            ? "No product matches your search. Try a different name or formula."
                            : "Add your first product to start tracking stock and expiry."
                    }
                    action={
                        <NeonButton
                            variant="primary"
                            icon={Plus}
                            onClick={() => setShowAddModal(true)}
                            className="mt-2"
                        >
                            Add Product
                        </NeonButton>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {products.map((p) => {
                        const selected = selectedProducts.includes(p.productName);
                        const expiryStatus = getExpiryStatus(p.expiryDate);

                        return (
                            <Panel
                                key={p.productName}
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
                                            aria-label={`Select ${p.productName}`}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts((prev) => [...prev, p.productName]);
                                                } else {
                                                    setSelectedProducts((prev) =>
                                                        prev.filter((name) => name !== p.productName)
                                                    );
                                                }
                                            }}
                                            className="hud-checkbox"
                                        />
                                    </label>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-base leading-snug font-bold text-white sm:text-lg">
                                            {p.productName}
                                        </h2>

                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <Pill tone="cyan" icon={Package}>
                                                Qty {p.productQuantity}
                                            </Pill>
                                            {p.category && (
                                                <Pill tone="violet">{p.category}</Pill>
                                            )}
                                            {expiryStatus && (
                                                <Pill tone={expiryStatus.tone} icon={CalendarDays}>
                                                    {expiryStatus.label}
                                                </Pill>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info boxes */}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <InfoBox tone="violet" label="Inventory" icon={Package}>
                                        <InfoRow
                                            label="Stock"
                                            value={p.productQuantity}
                                            valueClassName="text-emerald-400 font-semibold"
                                        />
                                        <InfoRow
                                            label="Category"
                                            value={p.category || "—"}
                                            valueClassName="text-violet-300"
                                        />
                                    </InfoBox>

                                    <InfoBox tone="amber" label="Composition" icon={FlaskConical}>
                                        <InfoRow
                                            label="Formula"
                                            value={p.formula || "N/A"}
                                            valueClassName="text-amber-300"
                                        />
                                        <InfoRow label="Product" value={p.productName} />
                                    </InfoBox>

                                    <InfoBox tone="rose" label="Expiry" icon={CalendarDays}>
                                        <InfoRow
                                            label="Date"
                                            value={formatDate(p.expiryDate)}
                                            valueClassName={cn(
                                                "font-semibold",
                                                getExpiryColor(p.expiryDate),
                                            )}
                                        />
                                        <InfoRow
                                            label="Status"
                                            value={expiryStatus?.label ?? "—"}
                                            valueClassName={getExpiryColor(p.expiryDate)}
                                        />
                                    </InfoBox>
                                </div>

                                {/* Actions */}
                                <div className="mt-4">
                                    <NeonButton
                                        size="sm"
                                        icon={History}
                                        onClick={() => navigate(`/purchase-history/${p.productName}`)}
                                        className="w-full sm:w-auto"
                                    >
                                        View Purchase History
                                    </NeonButton>
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

            {/* ---------------- DELETE CONFIRM ---------------- */}
            <Modal
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                description="This also removes the linked purchase history."
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
                            onClick={deleteProducts}
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
                        {selectedProducts.length}
                    </span>{" "}
                    selected product(s)? This action cannot be undone.
                </p>
            </Modal>

            {/* ---------------- ADD PRODUCT ---------------- */}
            <Modal
                open={showAddModal}
                onClose={() => {
                    resetForm();
                    setShowAddModal(false);
                }}
                title="Add Product"
                description="Register a new medicine into your inventory."
                icon={Plus}
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
                            icon={Save}
                            onClick={addProduct}
                            loading={loading}
                        >
                            Save Product
                        </NeonButton>
                    </div>
                }
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Product Name">
                        <TextInput
                            placeholder="e.g. Paracetamol 500mg"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Field>

                    <Field label="Category">
                        <TextInput
                            placeholder="e.g. Tablet"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Field>

                    <Field label="Formula">
                        <TextInput
                            placeholder="e.g. Acetaminophen"
                            value={formula}
                            onChange={(e) => setFormula(e.target.value)}
                        />
                    </Field>

                    <Field label="Supplier Name">
                        <TextInput
                            placeholder="e.g. MediSupply Co."
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                        />
                    </Field>

                    <Field label="Total Quantity">
                        <TextInput
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={totalQuantity}
                            onChange={(e) => setTotalQuantity(e.target.value)}
                            className="no-spin"
                        />
                    </Field>

                    <Field label="Unit List Price">
                        <TextInput
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={unitListPrice}
                            onChange={(e) => setUnitListPrice(e.target.value)}
                            className="no-spin"
                        />
                    </Field>

                    <Field label="Unit Buy Price">
                        <TextInput
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={unitBuyPrice}
                            onChange={(e) => setUnitBuyPrice(e.target.value)}
                            className="no-spin"
                        />
                    </Field>

                    <Field label="Purchase Date">
                        <TextInput
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                    </Field>

                    <Field label="Expiry Date">
                        <TextInput
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </Field>
                </div>
            </Modal>
        </PageShell>
    );
}

export default ProductsPage;
