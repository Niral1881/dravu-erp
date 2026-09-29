import {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

function LabourWork() {
  const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const emptyForm = {
    labourId: "",
    productId: "",
    design: "",
    productName: "",
    workType: "",
    workDate: new Date()
      .toISOString()
      .split("T")[0],
    quantity: "",
    rate: "",
    notes: "",
  };

  const [works, setWorks] = useState([]);
  const [labours, setLabours] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // FETCH DATA
  // =====================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        workRes,
        labourRes,
        productRes,
      ] = await Promise.all([
        axios.get(`${API}/labour-work`),
        axios.get(`${API}/labour`),
        axios.get(`${API}/products`),
      ]);

      const workData = Array.isArray(
        workRes.data
      )
        ? workRes.data
        : workRes.data?.data || [];

      const labourData = Array.isArray(
        labourRes.data
      )
        ? labourRes.data
        : labourRes.data?.labours ||
        labourRes.data?.data ||
        [];

      const productData = Array.isArray(
        productRes.data
      )
        ? productRes.data
        : productRes.data?.products ||
        productRes.data?.data ||
        [];

      setWorks(workData);
      setLabours(labourData);
      setProducts(productData);
    } catch (error) {
      console.error(
        "FETCH LABOUR WORK DATA ERROR:",
        error
      );

      alert(
        "Unable to load labour work data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================
  // FORM CHANGE
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // LABOUR SELECT
  // =====================================
  const handleLabourChange = (e) => {
    const labourId = e.target.value;

    const labour = labours.find(
      (item) => item._id === labourId
    );

    setFormData((prev) => ({
      ...prev,

      labourId,

      rate: labour
        ? labour.defaultRate
        : "",
    }));
  };

  // =====================================
  // PRODUCT SELECT
  // =====================================
  const handleProductChange = (e) => {
    const productId = e.target.value;

    const product = products.find(
      (item) => item._id === productId
    );

    setFormData((prev) => ({
      ...prev,

      productId,

      design: product?.design || "",

      productName:
        product?.name || "",
    }));
  };

  // =====================================
  // AMOUNT
  // =====================================
  const quantity =
    Number(formData.quantity) || 0;

  const rate =
    Number(formData.rate) || 0;

  const amount = quantity * rate;

  // =====================================
  // OPEN ADD
  // =====================================
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // =====================================
  // EDIT
  // =====================================
  const handleEdit = (work) => {
    setEditingId(work._id);

    setFormData({
      labourId: work.labourId || "",
      productId: work.productId || "",
      design: work.design || "",
      productName:
        work.productName || "",
      workType:
        work.workType || "",
      workDate:
        work.workDate ||
        new Date()
          .toISOString()
          .split("T")[0],
      quantity:
        work.quantity ?? "",
      rate:
        work.rate ?? "",
      notes:
        work.notes || "",
    });

    setShowModal(true);
  };

  // =====================================
  // CLOSE
  // =====================================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =====================================
  // SAVE
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.labourId) {
      alert("Please select labour.");
      return;
    }

    if (!formData.productId) {
      alert("Please select product.");
      return;
    }

    if (!formData.workType) {
      alert("Please select work type.");
      return;
    }

    if (quantity <= 0) {
      alert(
        "Quantity must be greater than 0."
      );
      return;
    }

    if (rate < 0) {
      alert("Rate cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const labour = labours.find(
        (item) =>
          item._id === formData.labourId
      );

      const payload = {
        labourId:
          formData.labourId,

        labourName:
          labour?.name || "",

        productId:
          formData.productId,

        design:
          formData.design,

        productName:
          formData.productName,

        workType:
          formData.workType,

        workDate:
          formData.workDate,

        quantity,

        rate,

        amount,

        notes:
          formData.notes,
      };

      if (editingId) {
        await axios.put(
          `${API}/labour-work/${editingId}`,
          payload
        );
      } else {
        await axios.post(
          `${API}/labour-work`,
          payload
        );
      }

      await fetchData();

      closeModal();
    } catch (error) {
      console.error(
        "SAVE LABOUR WORK ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to save labour work."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this labour work?"
      );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(
        `${API}/labour-work/${id}`
      );

      await fetchData();
    } catch (error) {
      console.error(
        "DELETE LABOUR WORK ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to delete labour work."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILTER
  // =====================================
  const filteredWorks = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return [...works]
      .filter((work) => {
        if (!keyword) return true;

        return (
          String(
            work.labourName || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          String(
            work.design || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          String(
            work.productName || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          String(
            work.workType || ""
          )
            .toLowerCase()
            .includes(keyword)
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.workDate
          ) -
          new Date(a.workDate)
      );
  }, [works, search]);

  // =====================================
  // SUMMARY
  // =====================================
  const totalQuantity =
    works.reduce(
      (sum, work) =>
        sum + Number(work.quantity || 0),
      0
    );

  const totalAmount =
    works.reduce(
      (sum, work) =>
        sum + Number(work.amount || 0),
      0
    );

  const totalEntries =
    works.length;

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  return (
    <div className="space-y-6">

      {/* =================================
          HEADER
      ================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Labour Work
          </h1>

          <p className="text-gray-500 mt-1">
            Record labour production and calculate labour cost.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchData}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
          >
            ↻ Refresh
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold cursor-pointer"
          >
            + Add Work
          </button>

        </div>

      </div>

      {/* =================================
          SUMMARY
      ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Entries
          </p>

          <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
            {totalEntries}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Quantity
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            {totalQuantity.toLocaleString(
              "en-IN"
            )}{" "}
            pcs
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Labour Cost
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            ₹ {formatMoney(totalAmount)}
          </h2>

        </div>

      </div>

      {/* =================================
          SEARCH
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search labour, design, product or work type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2F9CAF]"
          />

        </div>

      </div>

      {/* =================================
          TABLE
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[1200px] w-full">

            <thead className="bg-[#F7F9FA] border-b border-gray-200">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Date
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Labour
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Design
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Product
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Work
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Qty
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Rate
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredWorks.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center py-14"
                  >

                    <div className="text-4xl mb-3">
                      👷
                    </div>

                    <h3 className="font-semibold text-gray-700">
                      No labour work found
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Add your first labour work entry.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredWorks.map(
                  (work) => (
                    <tr
                      key={work._id}
                      className="border-b border-gray-100 hover:bg-[#FAFCFC]"
                    >

                      <td className="px-5 py-4 text-gray-600">
                        {work.workDate
                          ? new Date(
                            work.workDate
                          ).toLocaleDateString(
                            "en-IN"
                          )
                          : "-"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {work.labourName}
                      </td>

                      <td className="px-5 py-4">

                        <span className="font-bold text-[#2F9CAF]">
                          {work.design}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {work.productName}
                      </td>

                      <td className="px-5 py-4">

                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                          {work.workType}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right font-semibold">
                        {Number(
                          work.quantity || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        ₹{" "}
                        {formatMoney(
                          work.rate
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-green-700">
                        ₹{" "}
                        {formatMoney(
                          work.amount
                        )}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEdit(work)
                            }
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                work._id
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm cursor-pointer"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-[#2E3A3F]">
                  {editingId
                    ? "Edit Labour Work"
                    : "Add Labour Work"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Record production work completed by labour.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Labour */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Labour *
                  </label>

                  <select
                    name="labourId"
                    value={formData.labourId}
                    onChange={
                      handleLabourChange
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] bg-white"
                  >

                    <option value="">
                      Select Labour
                    </option>

                    {labours
                      .filter(
                        (labour) =>
                          labour.status ===
                          "ACTIVE"
                      )
                      .map((labour) => (
                        <option
                          key={labour._id}
                          value={labour._id}
                        >
                          {labour.name} -{" "}
                          {
                            labour.workType
                          }
                        </option>
                      ))}

                  </select>

                </div>

                {/* Product */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product / Design *
                  </label>

                  <select
                    name="productId"
                    value={
                      formData.productId
                    }
                    onChange={
                      handleProductChange
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] bg-white"
                  >

                    <option value="">
                      Select Product
                    </option>

                    {products.map(
                      (product) => (
                        <option
                          key={
                            product._id
                          }
                          value={
                            product._id
                          }
                        >
                          {product.design} -{" "}
                          {product.name}{" "}
                          {product.size
                            ? `(${product.size})`
                            : ""}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Design */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Design No.
                  </label>

                  <input
                    type="text"
                    value={
                      formData.design
                    }
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-gray-600"
                  />

                </div>

                {/* Work Type */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Type *
                  </label>

                  <select
                    name="workType"
                    value={
                      formData.workType
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] bg-white"
                  >

                    <option value="">
                      Select Work Type
                    </option>

                    <option value="Stitching">
                      Stitching
                    </option>

                    <option value="Cutting">
                      Cutting
                    </option>

                    <option value="Embroidery">
                      Embroidery
                    </option>

                    <option value="Finishing">
                      Finishing
                    </option>

                    <option value="Checking">
                      Checking
                    </option>

                    <option value="Packing">
                      Packing
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* Date */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Date *
                  </label>

                  <input
                    type="date"
                    name="workDate"
                    value={
                      formData.workDate
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF]"
                  />

                </div>

                {/* Quantity */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={
                      formData.quantity
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF]"
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
                      value={
                        formData.rate
                      }
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 pl-9 rounded-xl outline-none focus:border-[#2F9CAF]"
                    />

                  </div>

                </div>

                {/* Amount */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Labour Amount
                  </label>

                  <div className="w-full bg-green-50 border border-green-200 p-3 rounded-xl text-green-700 font-bold">
                    ₹{" "}
                    {formatMoney(amount)}
                  </div>

                </div>

                {/* Notes */}
                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    rows="2"
                    placeholder="Enter notes..."
                    value={
                      formData.notes
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] resize-none"
                  />

                </div>

              </div>

              {/* Calculation */}
              <div className="mt-5 bg-gray-50 rounded-xl p-4">

                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Quantity
                  </span>

                  <span className="font-semibold">
                    {quantity} pcs
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>
                    Rate
                  </span>

                  <span className="font-semibold">
                    ₹{" "}
                    {formatMoney(rate)}
                  </span>
                </div>

                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">

                  <span className="font-bold text-gray-800">
                    Total Labour Cost
                  </span>

                  <span className="font-bold text-green-700">
                    ₹{" "}
                    {formatMoney(
                      amount
                    )}
                  </span>

                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

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
                      ? "Update Work"
                      : "Save Work"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default LabourWork;