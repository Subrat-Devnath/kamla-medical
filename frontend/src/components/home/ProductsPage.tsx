import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Product = {
    productName: string;
    productQuantity: number;
    category: string;
};

type ProductPageResponse = {
    products: Product[];
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
    const [supplierName, setSupplierName] = useState("");

    const [totalQuantity, setTotalQuantity] = useState("");

    // pricing
    const [unitListPrice, setUnitListPrice] = useState("");
    const [unitBuyPrice, setUnitBuyPrice] = useState("");
    const [unitSellPrice, setUnitSellPrice] = useState("");

    // dates
    const [purchaseDate, setPurchaseDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    // Cassandra paging state
    const [pageState, setPageState] = useState<string | null>(null);

    // history for prev button
    const [pageStateStack, setPageStateStack] = useState<string[]>([]);

    const [hasNext, setHasNext] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);

    const pageSize = 5;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const API = `${BASE_URL}/product-mgmt/api/v1`;

    const navigate = useNavigate();

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

            setProducts(data.products || []);
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
                `${API}/search-products-with-pagination?productName=${encodeURIComponent(name)}`,
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

            setProducts(data.products || []);
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
        setSupplierName("");

        setTotalQuantity("");

        setUnitListPrice("");
        setUnitBuyPrice("");
        setUnitSellPrice("");

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
                supplierName,

                totalQuantity: quantity,
                purchasedQuantity: quantity,
                remainingQuantity: quantity,
                soldQuantity: 0,

                // pricing
                unitListPrice: Number(unitListPrice),
                unitBuyPrice: Number(unitBuyPrice),
                unitSellPrice: Number(unitSellPrice),

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
                    + Add Product
                </button>

            </div>

            <h1 className="text-3xl font-bold text-cyan-400 mb-6">
                Manage Products
            </h1>

            {/* SEARCH */}
            <div className="flex justify-end mb-6">

                <div className="flex gap-2 items-center">

                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400"
                    />

                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500"
                    >
                        Search
                    </button>

                </div>

            </div>

            {/* ERROR */}
            {error && (
                <p className="text-red-400 mb-4">{error}</p>
            )}

            {/* LOADING */}
            {loading && (
                <p className="text-cyan-400 mb-4">Loading...</p>
            )}

            {/* PRODUCTS */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">

                {/* HEADER */}
                <div className="grid grid-cols-3 bg-cyan-700 text-white font-semibold p-4">

                    <div>Product Name</div>

                    <div className="text-center">
                        Quantity
                    </div>

                    <div className="text-right">
                        Product Type
                    </div>

                </div>

                {/* ROWS */}
                {products.map((p, index) => (

                    <div
                        key={index}
                        className="grid grid-cols-3 items-center p-4 border-t border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >

                        {/* PRODUCT NAME */}
                        <button
                            onClick={() =>
                                navigate(`/purchase-history/${p.productName}`)
                            }
                            className="text-left"
                        >

                            <span className="text-cyan-300 font-medium hover:text-cyan-400">
                                {p.productName}
                            </span>

                        </button>

                        {/* QUANTITY */}
                        <div className="text-center text-green-400 font-medium">
                            {p.productQuantity}
                        </div>

                        {/* CATEGORY */}
                        <div className="text-right text-purple-400 font-medium">
                            {p.category}
                        </div>

                    </div>

                ))}

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

            {/* ADD PRODUCT MODAL */}
            {showAddModal && (

                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

                    <div className="bg-zinc-900 p-6 rounded-2xl w-[650px] border border-white/10">

                        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                            Add Product
                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            <input
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            <input
                                placeholder="Supplier Name"
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            <input
                                type="number"
                                placeholder="Total Quantity"
                                value={totalQuantity}
                                onChange={(e) => setTotalQuantity(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            {/* UNIT LIST PRICE */}
                            <input
                                type="number"
                                placeholder="Unit List Price"
                                value={unitListPrice}
                                onChange={(e) => setUnitListPrice(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            {/* UNIT BUY PRICE */}
                            <input
                                type="number"
                                placeholder="Unit Buy Price"
                                value={unitBuyPrice}
                                onChange={(e) => setUnitBuyPrice(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            {/* UNIT SELL PRICE */}
                            <input
                                type="number"
                                placeholder="Unit Sell Price"
                                value={unitSellPrice}
                                onChange={(e) => setUnitSellPrice(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            />

                            {/* PURCHASE DATE */}
                            <div>

                                <label className="text-sm text-gray-300">
                                    Purchase Date
                                </label>

                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                                />

                            </div>

                            {/* EXPIRY DATE */}
                            <div>

                                <label className="text-sm text-gray-300">
                                    Expiry Date
                                </label>

                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                                />

                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addProduct}
                                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500"
                            >
                                Save Product
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ProductsPage;