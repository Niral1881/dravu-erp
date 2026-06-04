import { useEffect, useState } from "react";
import axios from "axios";

function Products() {

  const API = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    design: "",
    name: "",
    size: "",
    color: "",
    stock: "",
    rate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const fetchProducts = async () => {
    try {

      const res = await axios.get(
        `${API}/products`
      );

      setProducts(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    const loadProducts = async () => {
      await fetchProducts();
    };

    loadProducts();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await axios.put(
          `${API}/products/${editingId}`,
          formData
        );

      } else {

        await axios.post(
          `${API}/products`,
          formData
        );
      }

      fetchProducts();

      setShowModal(false);

      setEditingId(null);

      setFormData({
        design: "",
        name: "",
        size: "",
        color: "",
        stock: "",
        rate: "",
      });

    } catch (error) {

      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API}/products/${id}`
      );

      fetchProducts();

    } catch (error) {

      console.log(error);
    }
  };

  const handleEdit = (product) => {

    setEditingId(product._id);

    setFormData({
      design: product.design,
      name: product.name,
      size: product.size,
      color: product.color,
      stock: product.stock,
      rate: product.rate,
    });

    setShowModal(true);
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-[#2E3A3F]">
            Products
          </h1>

          <p className="text-gray-500">
            Manage kurti stock & inventory
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2F9CAF] cursor-pointer text-white px-5 py-3 rounded-xl hover:bg-[#238293]"
        >
          {editingId ? "Edit Product" : "Add Product"}
        </button>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-5">

        <input
          type="text"
          placeholder="Search product..."
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
        />

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">Design No</th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Size</th>
              <th className="text-left p-4">Color</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Rate</th>
              <th className="text-left p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-4 font-medium">
                  {product.design}
                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.size}
                </td>

                <td className="p-4">
                  {product.color}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${product.stock < 50
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                      }`}
                  >
                    {product.stock} pcs
                  </span>

                </td>

                <td className="p-4 font-semibold">
                  {product.rate}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-100 cursor-pointer text-blue-600 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-100 cursor-pointer text-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {
        showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-[500px]">

              <h2 className="text-2xl font-bold mb-5">
                Add Product
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="design"
                    placeholder="Design No"
                    value={formData.design}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  >

                    <option value="">
                      Select Size
                    </option>

                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="3XL">3XL</option>
                    <option value="3XL">4XL</option>
                    <option value="3XL">5XL</option>

                  </select>

                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 cursor-pointer py-2 rounded-xl bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 cursor-pointer rounded-xl bg-[#2F9CAF] text-white"
                  >
                    {editingId ? "Update Product" : "Save Product"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Products;