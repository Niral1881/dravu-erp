import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Parties() {

  const API = import.meta.env.VITE_API_URL;

  const [parties, setParties] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      agent: "",
      gstin: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [editId, setEditId] =
    useState(null);

  const fetchParties = async () => {
    try {

      const res = await axios.get(
        `${API}/parties`
      );

      setParties(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchParties();
    };

    loadProducts();

  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,

      [name]:
        typeof value === "string"
          ? value.toUpperCase()
          : value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        await axios.put(
          `${API}/parties/${editId}`,
          formData
        );

      } else {

        await axios.post(
          `${API}/parties`,
          formData
        );
      }

      fetchParties();

      setShowModal(false);

      setEditId(null);

      setFormData({
        name: "",
        agent: "",
        gstin: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

    } catch (error) {

      console.log(error);
    }
  };


  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this party?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API}/parties/${id}`
      );

      fetchParties();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Parties
          </h1>

          <p className="text-gray-500">
            Manage all customers & wholesalers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2F9CAF] cursor-pointer text-white px-4 md:px-5 py-2 md:my-3 text-sm md:text-base  rounded-xl hover:bg-[#238293] w-full md:w-auto"
        >
          {editId ? "Edit Party" : "Add Party"}
        </button>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-5">

        <input
          type="text"
          placeholder="Search party..."
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
        />

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="min-w-[900px] w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">Party Name</th>
              <th className="text-left p-4">
                Agent
              </th>
              <th className="text-left p-4">Mobile</th>

              <th className="text-left p-4">City</th>
              <th className="text-left p-4">
                State
              </th>

              <th className="text-left p-4">
                Pincode
              </th>
              <th className="text-left p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {parties
              .sort((a, b) =>
                a.name.localeCompare(b.name)
              )
              .map((party) => (
                <tr
                  key={party._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {party.name}
                  </td>

                  <td className="p-4">
                    {party.agent}
                  </td>

                  <td className="p-4">
                    {party.mobile}
                  </td>

                  <td className="p-4">
                    {party.city}
                  </td>

                  <td className="p-4">
                    {party.state}
                  </td>

                  <td className="p-4">
                    {party.pincode}
                  </td>


                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() => {

                          setEditId(party._id);

                          setFormData({
                            name: party.name || "",
                            gstin: party.gstin || "",
                            mobile: party.mobile || "",
                            address: party.address || "",
                            city: party.city || "",
                            state: party.state || "",
                            pincode: party.pincode || "",
                          });

                          setShowModal(true);
                        }}
                        className="bg-blue-100 cursor-pointer text-blue-600 px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(party._id)
                        }
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

            <div className="bg-white p-4 md:p-6 rounded-2xl w-[95%] md:w-[500px] max-h-[90vh] overflow-auto">

              <h2 className="text-2xl font-bold mb-5">
                Add Party
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="name"
                    placeholder="Party Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                  <input
                    type="text"
                    name="agent"
                    placeholder="Agent Name"
                    value={formData.agent}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                  <input
                    type="text"
                    name="gstin"
                    placeholder="GSTIN"
                    value={formData.gstin}
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border p-3 rounded-xl col-span-2 uppercase"
                  ></textarea>

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="border p-3 rounded-xl uppercase"
                  />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 cursor-pointer rounded-xl bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 cursor-pointer rounded-xl bg-[#2F9CAF] text-white"
                  >
                    {editId ? "Update Party" : "Save Party"}
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

export default Parties;