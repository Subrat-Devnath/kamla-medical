import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Product = {
    productName: string;
    productQuantity: number;
    category: string;
    formula: string;
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
            <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-cyan-700">
                        <tr>
                            <th className="text-center p-4 w-12"> Select </th>
                            <th className="text-left p-4">Product Name</th>
                            <th className="text-center p-4">Quantity</th>
                            <th className="text-center p-4">Product Type</th>
                            <th className="text-left p-4">Formula</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p, index) => (
                            <tr
                                key={index}
                                className="border-t border-white/10 hover:bg-white/5"
                            >
                                <td className="p-4 text-center w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(p.productName)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts(prev => [...prev, p.productName]);
                                            } else {
                                                setSelectedProducts(prev =>
                                                    prev.filter(name => name !== p.productName)
                                                );
                                            }
                                        }}
                                        className="h-4 w-4 cursor-pointer"
                                    />
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() =>
                                            navigate(`/purchase-history/${p.productName}`)
                                        }
                                        className="text-cyan-300 hover:text-cyan-400"
                                    >
                                        {p.productName}
                                    </button>
                                </td>

                                <td className="p-4 text-center text-green-400">
                                    {p.productQuantity}
                                </td>

                                <td className="p-4 text-center text-purple-400">
                                    {p.category}
                                </td>

                                <td className="p-4 text-purple-400">
                                    {p.formula || "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProducts.length > 0 && (

                <div className="mt-4 flex justify-end">

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                    >
                        Delete Selected ({selectedProducts.length})
                    </button>

                </div>

            )}

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

            {showDeleteConfirm && (

                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

                    <div className="bg-zinc-900 p-6 rounded-2xl w-[450px] border border-white/10">

                        <h2 className="text-xl font-bold text-red-400 mb-4">
                            Confirm Delete
                        </h2>

                        <p className="mb-6">
                            Are you sure you want to delete
                            {" "}
                            {selectedProducts.length}
                            {" "}
                            selected product(s)?
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteProducts}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

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
                                placeholder="Formula"
                                value={formula}
                                onChange={(e) => setFormula(e.target.value)}
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