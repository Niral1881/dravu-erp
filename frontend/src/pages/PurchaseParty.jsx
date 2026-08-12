import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PurchaseParty() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    partyName: "",
    mobile: "",
    address: "",
    city: "",
    state: "GUJARAT",
    pincode: "",
    gstin: "",
    openingBalance: 0,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.partyName.trim()) {
      alert("Please enter Purchase Party Name");
      return;
    }

    try {
      setSaving(true);

      await axios.post(`${API}/parties`, {
        name: form.partyName.trim().toUpperCase(),
        mobile: form.mobile.trim(),
        address: form.address.trim().toUpperCase(),
        city: form.city.trim().toUpperCase(),
        state: form.state.trim().toUpperCase(),
        pincode: form.pincode.trim(),
        gstin: form.gstin.trim().toUpperCase(),
        openingBalance: Number(form.openingBalance) || 0,
        partyType: "PURCHASE",
      });

      alert("Purchase Party saved successfully");

      navigate("/debit-note");

    } catch (error) {
      console.error("Purchase party save error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to save Purchase Party"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Add Purchase Party
            </h1>

            <p className="text-gray-500 mt-1">
              Add supplier / purchase party details
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6"
        >

          {/* PARTY INFORMATION */}
          <div className="mb-8">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Purchase Party Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* PARTY NAME */}
              <div className="md:col-span-2">

                <label className="block mb-2 font-medium">
                  Purchase Party Name *
                </label>

                <input
                  type="text"
                  name="partyName"
                  value={form.partyName}
                  onChange={handleChange}
                  placeholder="ENTER PURCHASE PARTY NAME"
                  className="w-full border rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />

              </div>

              {/* MOBILE */}
              <div>

                <label className="block mb-2 font-medium">
                  Mobile
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="ENTER MOBILE NUMBER"
                  maxLength="10"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* GSTIN */}
              <div>

                <label className="block mb-2 font-medium">
                  GSTIN
                </label>

                <input
                  type="text"
                  name="gstin"
                  value={form.gstin}
                  onChange={handleChange}
                  placeholder="ENTER GSTIN"
                  maxLength="15"
                  className="w-full border rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* ADDRESS */}
              <div className="md:col-span-2">

                <label className="block mb-2 font-medium">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="ENTER FULL ADDRESS"
                  rows="3"
                  className="w-full border rounded-lg px-4 py-3 uppercase resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* CITY */}
              <div>

                <label className="block mb-2 font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="ENTER CITY"
                  className="w-full border rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* STATE */}
              <div>

                <label className="block mb-2 font-medium">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="ENTER STATE"
                  className="w-full border rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* PINCODE */}
              <div>

                <label className="block mb-2 font-medium">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="ENTER PINCODE"
                  maxLength="6"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

              {/* OPENING BALANCE */}
              <div>

                <label className="block mb-2 font-medium">
                  Opening Balance
                </label>

                <input
                  type="number"
                  name="openingBalance"
                  value={form.openingBalance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

              </div>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 border-t pt-6">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-400 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 bg-[#2F9CAF] text-white rounded-lg hover:bg-[#25899b] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Purchase Party"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default PurchaseParty;