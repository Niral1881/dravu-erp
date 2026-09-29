import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Labour() {
  const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const emptyForm = {
    name: "",
    mobile: "",
    workType: "",
    rateType: "PER_PIECE",
    defaultRate: "",
    address: "",
    joiningDate: new Date().toISOString().split("T")[0],
    status: "ACTIVE",
    notes: "",
  };

  const [labours, setLabours] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);

  // ================================
  // FETCH LABOUR
  // ================================
  const fetchLabours = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/labour`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.labours ||
        res.data?.data ||
        [];

      setLabours(data);
    } catch (error) {
      console.error("GET LABOUR ERROR:", error);

      alert("Unable to load labour.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  // ================================
  // FORM CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // OPEN ADD
  // ================================
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ================================
  // OPEN EDIT
  // ================================
  const handleEdit = (labour) => {
    setEditingId(labour._id);

    setFormData({
      name: labour.name || "",
      mobile: labour.mobile || "",
      workType: labour.workType || "",
      rateType: labour.rateType || "PER_PIECE",
      defaultRate: labour.defaultRate ?? "",
      address: labour.address || "",
      joiningDate:
        labour.joiningDate ||
        new Date().toISOString().split("T")[0],
      status: labour.status || "ACTIVE",
      notes: labour.notes || "",
    });

    setShowModal(true);
  };

  // ================================
  // CLOSE MODAL
  // ================================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // ================================
  // SAVE / UPDATE
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter labour name.");
      return;
    }

    if (!formData.mobile.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (!formData.workType.trim()) {
      alert("Please select work type.");
      return;
    }

    if (
      formData.defaultRate === "" ||
      Number(formData.defaultRate) < 0
    ) {
      alert("Please enter valid rate.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        defaultRate: Number(
          formData.defaultRate || 0
        ),
      };

      if (editingId) {
        await axios.put(
          `${API}/labour/${editingId}`,
          payload
        );
      } else {
        await axios.post(
          `${API}/labour`,
          payload
        );
      }

      await fetchLabours();

      closeModal();
    } catch (error) {
      console.error("SAVE LABOUR ERROR:", error);

      alert(
        error?.response?.data?.message ||
        "Unable to save labour."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this labour?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(
        `${API}/labour/${id}`
      );

      await fetchLabours();
    } catch (error) {
      console.error(
        "DELETE LABOUR ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to delete labour."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FILTER
  // ================================
  const filteredLabours = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return [...labours]
      .filter((labour) => {
        const matchesSearch =
          !keyword ||
          String(labour.name || "")
            .toLowerCase()
            .includes(keyword) ||
          String(labour.mobile || "")
            .toLowerCase()
            .includes(keyword) ||
          String(labour.workType || "")
            .toLowerCase()
            .includes(keyword);

        const matchesStatus =
          statusFilter === "ALL" ||
          labour.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [labours, search, statusFilter]);

  // ================================
  // SUMMARY
  // ================================
  const totalLabour = labours.length;

  const activeLabour = labours.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const inactiveLabour = labours.filter(
    (item) => item.status === "INACTIVE"
  ).length;

  const totalDefaultRate =
    labours.reduce(
      (sum, item) =>
        sum +
        Number(item.defaultRate || 0),
      0
    );

  // ================================
  // RATE LABEL
  // ================================
  const rateTypeLabel = (type) => {
    const labels = {
      PER_PIECE: "Per Piece",
      PER_DOZEN: "Per Dozen",
      PER_DAY: "Per Day",
      FIXED: "Fixed",
    };

    return labels[type] || type;
  };

  return (
    <div className="space-y-6">

      {/* ================================
          HEADER
      ================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Labour
          </h1>

          <p className="text-gray-500 mt-1">
            Manage karigar and labour information.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchLabours}
            disabled={loading}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            ↻ Refresh
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-[#2F9CAF] text-white font-semibold hover:bg-[#238293] transition cursor-pointer"
          >
            + Add Labour
          </button>

        </div>
      </div>

      {/* ================================
          SUMMARY
      ================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Labour
              </p>

              <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
                {totalLabour}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              👷
            </div>

          </div>

        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active Labour
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-1">
                {activeLabour}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* Inactive */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inactive Labour
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-1">
                {inactiveLabour}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
              ⏸
            </div>

          </div>

        </div>

        {/* Rate */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Default Rate
              </p>

              <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
                ₹{" "}
                {totalDefaultRate.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              ₹
            </div>

          </div>

        </div>

      </div>

      {/* ================================
          SEARCH
      ================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search labour, mobile or work type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="lg:w-48 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#2F9CAF] bg-white"
          >
            <option value="ALL">
              All Labour
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

        </div>

        <div className="mt-3 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredLabours.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {labours.length}
          </span>{" "}
          labour
        </div>

      </div>

      {/* ================================
          TABLE
      ================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-[#F7F9FA] border-b border-gray-200">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Labour
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Mobile
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Work Type
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Rate
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Joining Date
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading &&
                labours.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    Loading labour...
                  </td>
                </tr>

              ) : filteredLabours.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-14"
                  >

                    <div className="text-4xl mb-3">
                      👷
                    </div>

                    <h3 className="font-semibold text-gray-700">
                      No labour found
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Add your first labour/karigar.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredLabours.map(
                  (labour) => (
                    <tr
                      key={labour._id}
                      className="border-b border-gray-100 hover:bg-[#FAFCFC] transition"
                    >

                      {/* Name */}
                      <td className="px-5 py-4">

                        <div className="font-bold text-gray-800">
                          {labour.name}
                        </div>

                        {labour.address && (
                          <div className="text-xs text-gray-400 mt-1 max-w-[220px] truncate">
                            {labour.address}
                          </div>
                        )}

                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 text-gray-700">
                        {labour.mobile || "-"}
                      </td>

                      {/* Work */}
                      <td className="px-5 py-4">

                        <span className="inline-flex px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                          {labour.workType}
                        </span>

                      </td>

                      {/* Rate */}
                      <td className="px-5 py-4">

                        <div className="font-bold text-gray-800">
                          ₹{" "}
                          {Number(
                            labour.defaultRate || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                          {rateTypeLabel(
                            labour.rateType
                          )}
                        </div>

                      </td>

                      {/* Joining */}
                      <td className="px-5 py-4 text-gray-600">
                        {labour.joiningDate
                          ? new Date(
                            labour.joiningDate
                          ).toLocaleDateString(
                            "en-IN"
                          )
                          : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${labour.status ===
                            "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {labour.status ===
                            "ACTIVE"
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEdit(
                                labour
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                labour._id
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

      {/* ================================
    MODAL
================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-3 sm:p-4">

          {/* MODAL CONTAINER */}
          <div className="mx-auto flex h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* =================================
          MODAL HEADER
      ================================= */}
            <div className="shrink-0 border-b border-gray-100 bg-white px-5 py-4 sm:px-6 sm:py-5">

              <div className="flex items-center gap-3">

                {/* BACK BUTTON */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 items-center gap-2 rounded-xl bg-gray-100 px-4 text-gray-700 font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  <span className="text-xl leading-none">
                    ←
                  </span>

                  <span>
                    Back
                  </span>
                </button>

                {/* TITLE */}
                <div className="flex-1 min-w-0">

                  <h2 className="text-lg sm:text-2xl font-bold text-[#2E3A3F] truncate">
                    {editingId
                      ? "Edit Labour"
                      : "Add Labour"}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Add karigar or labour details.
                  </p>

                </div>

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* =================================
          FORM
      ================================= */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >

              {/* =================================
            SCROLLABLE CONTENT
        ================================= */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

                <div className="p-5 sm:p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* =================================
                  LABOUR NAME
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Labour Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        placeholder="ENTER LABOUR NAME"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 uppercase"
                      />

                    </div>

                    {/* =================================
                  MOBILE
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number *
                      </label>

                      <input
                        type="tel"
                        name="mobile"
                        placeholder="ENTER MOBILE NUMBER"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength="10"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                      />

                    </div>

                    {/* =================================
                  WORK TYPE
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Type *
                      </label>

                      <select
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 bg-white uppercase"
                      >

                        <option value="">
                          SELECT WORK TYPE
                        </option>

                        <option value="Stitching">
                          STITCHING
                        </option>

                        <option value="Cutting">
                          CUTTING
                        </option>

                        <option value="Embroidery">
                          EMBROIDERY
                        </option>

                        <option value="Finishing">
                          FINISHING
                        </option>

                        <option value="Checking">
                          CHECKING
                        </option>

                        <option value="Packing">
                          PACKING
                        </option>

                        <option value="Other">
                          OTHER
                        </option>

                      </select>

                    </div>

                    {/* =================================
                  RATE TYPE
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rate Type
                      </label>

                      <select
                        name="rateType"
                        value={formData.rateType}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 bg-white"
                      >

                        <option value="PER_PIECE">
                          PER PIECE
                        </option>

                        <option value="PER_DOZEN">
                          PER DOZEN
                        </option>

                        <option value="PER_DAY">
                          PER DAY
                        </option>

                        <option value="FIXED">
                          FIXED
                        </option>

                      </select>

                    </div>

                    {/* =================================
                  DEFAULT RATE
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Default Rate
                      </label>

                      <div className="relative">

                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="defaultRate"
                          placeholder="ENTER RATE"
                          value={formData.defaultRate}
                          onChange={handleChange}
                          className="w-full border border-gray-200 p-3 pl-9 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                        />

                      </div>

                    </div>

                    {/* =================================
                  JOINING DATE
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Joining Date
                      </label>

                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                      />

                    </div>

                    {/* =================================
                  STATUS
              ================================= */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status
                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 bg-white"
                      >

                        <option value="ACTIVE">
                          ACTIVE
                        </option>

                        <option value="INACTIVE">
                          INACTIVE
                        </option>

                      </select>

                    </div>

                    {/* =================================
                  ADDRESS
              ================================= */}
                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>

                      <textarea
                        name="address"
                        rows="3"
                        placeholder="ENTER ADDRESS"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 resize-none"
                      />

                    </div>

                    {/* =================================
                  NOTES
              ================================= */}
                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes
                      </label>

                      <textarea
                        name="notes"
                        rows="3"
                        placeholder="ADDITIONAL NOTES..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10 resize-none"
                      />

                    </div>

                  </div>

                  {/* BOTTOM SPACE */}
                  <div className="h-5" />

                </div>

              </div>

              {/* =================================
            STICKY FOOTER
        ================================= */}
              <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">

                <div className="flex items-center justify-between gap-3">

                  {/* BACK */}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer transition"
                  >
                    <span className="text-lg">
                      ←
                    </span>

                    Back
                  </button>

                  {/* RIGHT BUTTONS */}
                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold cursor-pointer disabled:opacity-60 transition"
                    >
                      {loading
                        ? "Saving..."
                        : editingId
                          ? "Update Labour"
                          : "Save Labour"}
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Labour;