// import { useEffect, useState } from "react";
// import axios from "axios";

// function Products() {

//   const API = import.meta.env.VITE_API_URL;

//   const [products, setProducts] = useState([]);

//   const [showModal, setShowModal] = useState(false);

//   const [formData, setFormData] = useState({
//     design: "",
//     name: "",
//     size: "",
//     color: "",
//     stock: "",
//     rate: "",
//   });

//   const [editingId, setEditingId] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };



//   const fetchProducts = async () => {
//     try {

//       const res = await axios.get(
//         `${API}/products`
//       );

//       setProducts(res.data);

//     } catch (error) {

//       console.log(error);
//     }
//   };


//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchProducts();
//     };

//     loadProducts();

//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {

//       if (editingId) {

//         await axios.put(
//           `${API}/products/${editingId}`,
//           formData
//         );

//       } else {

//         await axios.post(
//           `${API}/products`,
//           formData
//         );
//       }

//       fetchProducts();

//       setShowModal(false);

//       setEditingId(null);

//       setFormData({
//         design: "",
//         name: "",
//         size: "",
//         color: "",
//         stock: "",
//         rate: "",
//       });

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   const handleDelete = async (id) => {

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );

//     if (!confirmDelete) return;

//     try {

//       await axios.delete(
//         `${API}/products/${id}`
//       );

//       fetchProducts();

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   const handleEdit = (product) => {

//     setEditingId(product._id);

//     setFormData({
//       design: product.design,
//       name: product.name,
//       size: product.size,
//       color: product.color,
//       stock: product.stock,
//       rate: product.rate,
//     });

//     setShowModal(true);
//   };

//   return (
//     <div>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//             Products
//           </h1>

//           <p className="text-gray-500">
//             Manage kurti stock & inventory
//           </p>
//         </div>

//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-[#2F9CAF] cursor-pointer text-white px-5 py-3 rounded-xl hover:bg-[#238293]"
//         >
//           {editingId ? "Edit Product" : "Add Product"}
//         </button>

//       </div>

//       {/* Search */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm mb-5">

//         <input
//           type="text"
//           placeholder="Search product..."
//           className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
//         />

//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

//         <table className="min-w-[900px] w-full">

//           <thead className="bg-gray-100">

//             <tr>
//               <th className="text-left p-4">Design No</th>
//               <th className="text-left p-4">Product</th>
//               <th className="text-left p-4">Size</th>
//               <th className="text-left p-4">Color</th>
//               <th className="text-left p-4">Stock</th>
//               <th className="text-left p-4">Rate</th>
//               <th className="text-left p-4">Action</th>
//             </tr>

//           </thead>

//           <tbody>

//             {products
//               .sort((a, b) =>
//                 a.name.localeCompare(b.name)
//               )
//               .map((product) => (
//                 <tr
//                   key={product.id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >

//                   <td className="p-4 font-medium">
//                     {product.design}
//                   </td>

//                   <td className="p-4">
//                     {product.name}
//                   </td>

//                   <td className="p-4">
//                     {product.size}
//                   </td>

//                   <td className="p-4">
//                     {product.color}
//                   </td>

//                   <td className="p-4">

//                     <span
//                       className={`px-3 py-1 rounded-full text-sm ${product.stock < 50
//                         ? "bg-red-100 text-red-600"
//                         : "bg-green-100 text-green-600"
//                         }`}
//                     >
//                       {product.stock} pcs
//                     </span>

//                   </td>

//                   <td className="p-4 font-semibold">
//                     ₹ {product.rate}
//                   </td>

//                   <td className="p-4">

//                     <div className="flex gap-2">

//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="bg-blue-100 cursor-pointer text-blue-600 px-4 py-2 rounded-lg"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="bg-red-100 cursor-pointer text-red-600 px-4 py-2 rounded-lg"
//                       >
//                         Delete
//                       </button>

//                     </div>

//                   </td>

//                 </tr>
//               ))}

//           </tbody>

//         </table>

//       </div>

//       {
//         showModal && (

//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//             <div className="bg-white rounded-2xl p-4 md:p-6 w-[95%] md:w-[500px] max-h-[90vh] overflow-auto">

//               <h2 className="text-2xl font-bold mb-5">
//                 Add Product
//               </h2>

//               <form onSubmit={handleSubmit}>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                   <input
//                     type="text"
//                     name="design"
//                     placeholder="Design No"
//                     value={formData.design}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Product Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <select
//                     name="size"
//                     value={formData.size}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   >

//                     <option value="">
//                       Select Size
//                     </option>

//                     <option value="XS">XS</option>
//                     <option value="S">S</option>
//                     <option value="M">M</option>
//                     <option value="L">L</option>
//                     <option value="XL">XL</option>
//                     <option value="XXL">XXL</option>
//                     <option value="3XL">3XL</option>
//                     <option value="4XL">4XL</option>
//                     <option value="5XL">5XL</option>

//                   </select>

//                   <input
//                     type="text"
//                     name="color"
//                     placeholder="Color"
//                     value={formData.color}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <input
//                     type="number"
//                     name="stock"
//                     placeholder="Stock"
//                     value={formData.stock}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <input
//                     type="number"
//                     name="rate"
//                     placeholder="Rate"
//                     value={formData.rate}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">

//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-5 cursor-pointer py-2 rounded-xl bg-gray-200"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     className="px-5 py-2 cursor-pointer rounded-xl bg-[#2F9CAF] text-white"
//                   >
//                     {editingId ? "Update Product" : "Save Product"}
//                   </button>

//                 </div>

//               </form>

//             </div>

//           </div>
//         )
//       }

//     </div>
//   );
// }

// export default Products;


import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Products() {
  const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    design: "",
    name: "",
    stock: "",
    rate: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.products || res.data?.data || [];

      setProducts(data);
    } catch (error) {
      console.error("GET PRODUCTS ERROR:", error);
      alert("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =========================
  // SAVE / UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.design.trim()) {
      alert("Please enter Design No.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter Product Name.");
      return;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      alert("Please enter valid Stock.");
      return;
    }

    if (formData.rate === "" || Number(formData.rate) < 0) {
      alert("Please enter valid Rate.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        stock: Number(formData.stock),
        rate: Number(formData.rate),
      };

      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, payload);
      } else {
        await axios.post(`${API}/products`, payload);
      }

      await fetchProducts();

      closeModal();
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      alert(
        error?.response?.data?.message ||
        "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      design: product.design || "",
      name: product.name || "",
      stock: product.stock ?? "",
      rate: product.rate ?? "",
    });

    setShowModal(true);
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(`${API}/products/${id}`);

      await fetchProducts();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert(
        error?.response?.data?.message ||
        "Unable to delete product."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER + SORT
  // =========================
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch =
          !keyword ||
          String(product.design || "")
            .toLowerCase()
            .includes(keyword) ||
          String(product.name || "")
            .toLowerCase()
            .includes(keyword) ||
          String(product.color || "")
            .toLowerCase()
            .includes(keyword) ||
          String(product.size || "")
            .toLowerCase()
            .includes(keyword);

        const stock = Number(product.stock || 0);

        let matchesStock = true;

        if (stockFilter === "LOW") {
          matchesStock = stock > 0 && stock < 10;
        }

        if (stockFilter === "OUT") {
          matchesStock = stock <= 0;
        }

        if (stockFilter === "AVAILABLE") {
          matchesStock = stock > 0;
        }

        return matchesSearch && matchesStock;
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [products, search, stockFilter]);

  // =========================
  // SUMMARY
  // =========================
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) < 10
  ).length;

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // =========================
  // STOCK STATUS
  // =========================
  const getStockStatus = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (value < 10) {
      return {
        label: "Low Stock",
        className: "bg-orange-100 text-orange-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your kurti products, stock, sizes and rates.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            ↻ Refresh
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-[#2F9CAF] text-white font-semibold hover:bg-[#238293] transition cursor-pointer shadow-sm"
          >
            + Add Product
          </button>

        </div>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
                {totalProducts}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              📦
            </div>

          </div>
        </div>

        {/* Stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Stock
              </p>

              <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
                {totalStock.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              📊
            </div>

          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Low Stock
              </p>

              <h2 className="text-2xl font-bold text-orange-600 mt-1">
                {lowStockProducts}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              ⚠️
            </div>

          </div>
        </div>

        {/* Out of stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Out of Stock
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-1">
                {outOfStockProducts}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
              🚫
            </div>

          </div>
        </div>

      </div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by design, product, size or color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
            />

          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="lg:w-48 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#2F9CAF] bg-white"
          >
            <option value="ALL">All Stock</option>
            <option value="AVAILABLE">Available</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>

        </div>

        <div className="mt-3 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {products.length}
          </span>{" "}
          products
        </div>

      </div>

      {/* =========================
          PRODUCT TABLE
      ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[1050px] w-full">

            <thead className="bg-[#F7F9FA] border-b border-gray-200">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Design
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Product
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Stock
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Rate
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading && products.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>

              ) : filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-14"
                  >

                    <div className="text-4xl mb-3">
                      📦
                    </div>

                    <h3 className="font-semibold text-gray-700">
                      No products found
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Try changing your search or stock filter.
                    </p>

                  </td>
                </tr>

              ) : (

                filteredProducts.map((product) => {

                  const stockStatus = getStockStatus(
                    product.stock
                  );

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 hover:bg-[#FAFCFC] transition"
                    >

                      {/* Design */}
                      <td className="px-5 py-4">

                        <span className="font-bold text-[#2F9CAF]">
                          {product.design || "-"}
                        </span>

                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">

                        <div className="font-semibold text-gray-800">
                          {product.name || "-"}
                        </div>

                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">

                        <div className="flex flex-col items-start gap-1">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${stockStatus.className}`}
                          >
                            {stockStatus.label}
                          </span>

                          <span className="text-sm font-semibold text-gray-700">
                            {Number(
                              product.stock || 0
                            ).toLocaleString("en-IN")}{" "}
                            pcs
                          </span>

                        </div>

                      </td>

                      {/* Rate */}
                      <td className="px-5 py-4">

                        <span className="font-bold text-gray-800">
                          ₹ {formatMoney(product.rate)}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEdit(product)
                            }
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm cursor-pointer transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product._id)
                            }
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm cursor-pointer transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-[#2E3A3F]">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter product and inventory details.
                </p>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Design */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Design No.
                  </label>

                  <input
                    type="text"
                    name="design"
                    placeholder="e.g. D-T101"
                    value={formData.design}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                </div>

                {/* Product Name */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                </div>

                {/* Stock */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stock"
                    placeholder="Enter quantity"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                </div>

                {/* Rate */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rate
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="rate"
                      placeholder="Enter rate"
                      value={formData.rate}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 pl-9 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                    />

                  </div>

                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold cursor-pointer disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;