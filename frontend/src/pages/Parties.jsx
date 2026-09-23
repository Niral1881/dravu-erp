// import {
//   useEffect,
//   useState,
// } from "react";

// import axios from "axios";

// function Parties() {

//   const API = import.meta.env.VITE_API_URL;

//   const [parties, setParties] =
//     useState([]);

//   const [showModal, setShowModal] =
//     useState(false);

//   const [formData, setFormData] =
//     useState({

//       agent: "",

//       // BILLING ADDRESS
//       name: "",
//       gstin: "",
//       mobile: "",
//       address: "",
//       city: "",
//       state: "",


//       // DELIVERY ADDRESS
//       deliveryName: "",
//       deliveryGstin: "",
//       deliveryMobile: "",
//       deliveryAddress: "",
//       deliveryCity: "",
//       deliveryState: "",
//       deliveryStateCode: "",
//       deliveryPincode: "",
//     });

//   const [editId, setEditId] =
//     useState(null);

//   const fetchParties = async () => {
//     try {

//       const res = await axios.get(
//         `${API}/parties`
//       );

//       setParties(res.data);

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchParties();
//     };

//     loadProducts();

//   }, []);

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData({
//       ...formData,

//       [name]:
//         typeof value === "string"
//           ? value.toUpperCase()
//           : value,
//     });
//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       if (editId) {

//         await axios.put(
//           `${API}/parties/${editId}`,
//           formData
//         );

//       } else {

//         await axios.post(
//           `${API}/parties`,
//           formData
//         );
//       }

//       fetchParties();

//       setShowModal(false);

//       setEditId(null);

//       setFormData({
//         name: "",
//         agent: "",
//         gstin: "",
//         mobile: "",
//         address: "",
//         city: "",
//         state: "",

//         deliveryName: "",
//         deliveryGstin: "",
//         deliveryMobile: "",
//         deliveryAddress: "",
//         deliveryCity: "",
//         deliveryState: "",
//       });

//     } catch (error) {

//       console.log(error);
//     }
//   };


//   const handleDelete = async (id) => {

//     const confirmDelete =
//       window.confirm(
//         "Delete this party?"
//       );

//     if (!confirmDelete) return;

//     try {

//       await axios.delete(
//         `${API}/parties/${id}`
//       );

//       fetchParties();

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   return (
//     <div>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//             Parties
//           </h1>

//           <p className="text-gray-500">
//             Manage all customers & wholesalers
//           </p>
//         </div>

//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-[#2F9CAF] cursor-pointer text-white px-4 md:px-5 py-2 md:my-3 text-sm md:text-base  rounded-xl hover:bg-[#238293] w-full md:w-auto"
//         >
//           {editId ? "Edit Party" : "Add Party"}
//         </button>

//       </div>

//       {/* Search */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm mb-5">

//         <input
//           type="text"
//           placeholder="Search party..."
//           className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
//         />

//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

//         <table className="min-w-[900px] w-full">

//           <thead className="bg-gray-100">

//             <tr>
//               <th className="text-left p-4">Party Name</th>
//               <th className="text-left p-4">
//                 Agent
//               </th>
//               <th className="text-left p-4">Mobile</th>

//               <th className="text-left p-4">City</th>
//               <th className="text-left p-4">
//                 State
//               </th>

//               <th className="text-left p-4">Action</th>
//             </tr>

//           </thead>

//           <tbody>

//             {parties
//               .sort((a, b) =>
//                 a.name.localeCompare(b.name)
//               )
//               .map((party) => (
//                 <tr
//                   key={party._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >

//                   <td className="p-4 font-medium">
//                     {party.name}
//                   </td>

//                   <td className="p-4">
//                     {party.agent}
//                   </td>

//                   <td className="p-4">
//                     {party.mobile}
//                   </td>

//                   <td className="p-4">
//                     {party.city}
//                   </td>

//                   <td className="p-4">
//                     {party.state}
//                   </td>



//                   <td className="p-4">

//                     <div className="flex gap-2">

//                       <button
//                         onClick={() => {

//                           setEditId(party._id);

//                           setFormData({
//                             name: party.name || "",
//                             gstin: party.gstin || "",
//                             mobile: party.mobile || "",
//                             address: party.address || "",
//                             city: party.city || "",
//                             state: party.state || "",

//                             deliveryName: party.deliveryName || "",
//                             deliveryGstin: party.deliveryGstin || "",
//                             deliveryMobile: party.deliveryMobile || "",
//                             deliveryAddress: party.deliveryAddress || "",
//                             deliveryCity: party.deliveryCity || "",
//                             deliveryState: party.deliveryState || "",

//                           });

//                           setShowModal(true);
//                         }}
//                         className="bg-blue-100 cursor-pointer text-blue-600 px-4 py-2 rounded-lg"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleDelete(party._id)
//                         }
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

//             <div className="bg-white p-4 md:p-6 rounded-2xl w-[95%] md:w-[500px] max-h-[90vh] overflow-auto">

//               <h2 className="text-2xl font-bold mb-5">
//                 Add Party
//               </h2>

//               <form onSubmit={handleSubmit}>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Party Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="agent"
//                     placeholder="Agent Name"
//                     value={formData.agent}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="mobile"
//                     placeholder="Mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="gstin"
//                     placeholder="GSTIN"
//                     value={formData.gstin}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <textarea
//                     name="address"
//                     placeholder="Address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl col-span-2 uppercase"
//                   ></textarea>

//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={formData.state}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />


//                 </div>

//                 {/* DELIVERY ADDRESS */}

//                 <h3 className="text-lg font-bold text-[#2F9CAF] mb-2">
//                   Delivery Address
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="deliveryName"
//                     placeholder="Delivery Name"
//                     value={formData.deliveryName}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="deliveryMobile"
//                     placeholder="Delivery Mobile"
//                     value={formData.deliveryMobile}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="deliveryGstin"
//                     placeholder="GSTIN"
//                     value={formData.deliveryGstin}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl"
//                   />

//                   <textarea
//                     name="deliveryAddress"
//                     placeholder="Delivery Address"
//                     value={formData.deliveryAddress}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl col-span-2 uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="deliveryCity"
//                     placeholder="Delivery City"
//                     value={formData.deliveryCity}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />

//                   <input
//                     type="text"
//                     name="deliveryState"
//                     placeholder="Delivery State"
//                     value={formData.deliveryState}
//                     onChange={handleChange}
//                     className="border p-3 rounded-xl uppercase"
//                   />
//                 </div>



//                 <div className="flex justify-end gap-3 mt-6">

//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-5 py-2 cursor-pointer rounded-xl bg-gray-200"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     className="px-5 py-2 cursor-pointer rounded-xl bg-[#2F9CAF] text-white"
//                   >
//                     {editId ? "Update Party" : "Save Party"}
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

// export default Parties;



import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUsers,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";


function Parties() {

  const API = import.meta.env.VITE_API_URL;


  // =====================================================
  // STATE
  // =====================================================

  const [parties, setParties] = useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const emptyForm = {
    name: "",
    agent: "",
    gstin: "",
    mobile: "",
    address: "",
    city: "",
    state: "",

    deliveryName: "",
    deliveryGstin: "",
    deliveryMobile: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "",
  };


  const [formData, setFormData] =
    useState(emptyForm);


  // =====================================================
  // FETCH PARTIES
  // =====================================================

  const fetchParties = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          `${API}/parties`
        );

      setParties(
        res.data || []
      );

    } catch (error) {

      console.error(
        "Fetch parties error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchParties();

  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        typeof value === "string"
          ? value.toUpperCase()
          : value,
    }));

  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddParty = () => {

    setEditId(null);

    setFormData(emptyForm);

    setShowModal(true);

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (party) => {

    setEditId(party._id);

    setFormData({
      name: party.name || "",
      agent: party.agent || "",
      gstin: party.gstin || "",
      mobile: party.mobile || "",
      address: party.address || "",
      city: party.city || "",
      state: party.state || "",

      deliveryName:
        party.deliveryName || "",

      deliveryGstin:
        party.deliveryGstin || "",

      deliveryMobile:
        party.deliveryMobile || "",

      deliveryAddress:
        party.deliveryAddress || "",

      deliveryCity:
        party.deliveryCity || "",

      deliveryState:
        party.deliveryState || "",
    });

    setShowModal(true);

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {

    setShowModal(false);

    setEditId(null);

    setFormData(emptyForm);

  };


  // =====================================================
  // SAVE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

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

      await fetchParties();

      handleCloseModal();

    } catch (error) {

      console.error(
        "Save party error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save party"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const party = parties.find(
      (item) => item._id === id
    );

    const confirmDelete =
      window.confirm(
        `Delete party "${party?.name || ""}"?`
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setLoading(true);

      await axios.delete(
        `${API}/parties/${id}`
      );

      setParties((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

    } catch (error) {

      console.error(
        "Delete party error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete party"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FILTER PARTIES
  // =====================================================

  const filteredParties =
    useMemo(() => {

      const text =
        search
          .trim()
          .toLowerCase();

      if (!text) {
        return [...parties].sort(
          (a, b) =>
            (a.name || "").localeCompare(
              b.name || ""
            )
        );
      }

      return parties
        .filter((party) => {

          const name =
            String(
              party.name || ""
            ).toLowerCase();

          const mobile =
            String(
              party.mobile || ""
            ).toLowerCase();

          const city =
            String(
              party.city || ""
            ).toLowerCase();

          const gstin =
            String(
              party.gstin || ""
            ).toLowerCase();

          const agent =
            String(
              party.agent || ""
            ).toLowerCase();

          return (
            name.includes(text) ||
            mobile.includes(text) ||
            city.includes(text) ||
            gstin.includes(text) ||
            agent.includes(text)
          );

        })
        .sort(
          (a, b) =>
            (a.name || "").localeCompare(
              b.name || ""
            )
        );

    }, [
      parties,
      search,
    ]);


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-[#2F9CAF] text-white flex items-center justify-center shadow-sm">
            <FaUsers size={21} />
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Parties
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage customers, wholesalers and delivery addresses
            </p>

          </div>

        </div>


        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchParties}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >

            <FaSyncAlt
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          <button
            type="button"
            onClick={handleAddParty}
            className="flex items-center justify-center gap-2 bg-[#2F9CAF] text-white px-5 py-3 rounded-xl hover:bg-[#238293] transition"
          >

            <FaPlus />

            Add Party

          </button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <p className="text-sm text-gray-500">
            Total Parties
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {parties.length}
          </h2>

        </div>


        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <p className="text-sm text-gray-500">
            Showing
          </p>

          <h2 className="text-3xl font-bold text-[#2F9CAF] mt-2">
            {filteredParties.length}
          </h2>

        </div>


        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <p className="text-sm text-gray-500">
            Delivery Details
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {
              parties.filter(
                (party) =>
                  party.deliveryName ||
                  party.deliveryAddress
              ).length
            }
          </h2>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">

        <div className="relative">

          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search party, mobile, GSTIN, city or agent..."
            className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/20"
          />


          {search && (

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>

          )}

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">

          <h2 className="text-lg font-bold text-gray-900">
            Party List
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {filteredParties.length} party
            {filteredParties.length !== 1
              ? "ies"
              : ""}
            displayed
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead>

              <tr className="bg-black text-white">

                <th className="text-center p-4">
                  No.
                </th>

                <th className="text-left p-4">
                  Party Name
                </th>

                <th className="text-left p-4">
                  Agent
                </th>

                <th className="text-left p-4">
                  Mobile
                </th>

                <th className="text-left p-4">
                  GSTIN
                </th>

                <th className="text-left p-4">
                  City
                </th>

                <th className="text-left p-4">
                  State
                </th>

                <th className="text-center p-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredParties.map(
                (party, index) => (

                  <tr
                    key={party._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >

                    <td className="p-4 text-center text-gray-500 font-semibold">
                      {index + 1}
                    </td>


                    <td className="p-4">

                      <div className="font-bold text-gray-900">
                        {party.name || "-"}
                      </div>

                      {party.address && (

                        <div className="text-xs text-gray-400 mt-1 max-w-[220px] truncate">
                          {party.address}
                        </div>

                      )}

                    </td>


                    <td className="p-4 text-gray-600">
                      {party.agent || "-"}
                    </td>


                    <td className="p-4 font-medium">
                      {party.mobile || "-"}
                    </td>


                    <td className="p-4 text-gray-600">
                      {party.gstin || "-"}
                    </td>


                    <td className="p-4">
                      {party.city || "-"}
                    </td>


                    <td className="p-4">
                      {party.state || "-"}
                    </td>


                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          title="Edit Party"
                          onClick={() =>
                            handleEdit(party)
                          }
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        >
                          <FaEdit />
                        </button>


                        <button
                          type="button"
                          title="Delete Party"
                          onClick={() =>
                            handleDelete(
                              party._id
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}


              {filteredParties.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    className="p-12 text-center"
                  >

                    <div className="text-gray-300 text-5xl mb-3">
                      <FaUsers className="mx-auto" />
                    </div>

                    <p className="font-semibold text-gray-700">
                      No parties found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Try another search or add a new party.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">


            {/* MODAL HEADER */}

            <div className="sticky top-0 bg-white z-10 px-5 md:px-6 py-4 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editId
                    ? "Edit Party"
                    : "Add Party"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter billing and delivery information
                </p>

              </div>


              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="p-5 md:p-6"
            >


              {/* =========================================
                  BILLING INFORMATION
              ========================================= */}

              <div className="mb-6">

                <h3 className="text-lg font-bold text-[#2F9CAF] mb-4">
                  Billing Information
                </h3>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Party Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Party Name"
                      required
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Agent Name
                    </label>

                    <input
                      type="text"
                      name="agent"
                      value={formData.agent}
                      onChange={handleChange}
                      placeholder="Agent Name"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile
                    </label>

                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Mobile"
                      className="w-full border p-3 rounded-xl mt-1 outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      GSTIN
                    </label>

                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="GSTIN"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div className="md:col-span-2">

                    <label className="text-sm font-medium text-gray-600">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Billing Address"
                      rows="3"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />

                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>

                </div>

              </div>


              {/* =========================================
                  DELIVERY INFORMATION
              ========================================= */}

              <div className="border-t pt-6">

                <h3 className="text-lg font-bold text-[#2F9CAF] mb-4">
                  Delivery Address
                </h3>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery Name
                    </label>

                    <input
                      type="text"
                      name="deliveryName"
                      value={
                        formData.deliveryName
                      }
                      onChange={handleChange}
                      placeholder="Delivery Name"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery Mobile
                    </label>

                    <input
                      type="text"
                      name="deliveryMobile"
                      value={
                        formData.deliveryMobile
                      }
                      onChange={handleChange}
                      placeholder="Delivery Mobile"
                      className="w-full border p-3 rounded-xl mt-1 outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery GSTIN
                    </label>

                    <input
                      type="text"
                      name="deliveryGstin"
                      value={
                        formData.deliveryGstin
                      }
                      onChange={handleChange}
                      placeholder="GSTIN"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery City
                    </label>

                    <input
                      type="text"
                      name="deliveryCity"
                      value={
                        formData.deliveryCity
                      }
                      onChange={handleChange}
                      placeholder="Delivery City"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>


                  <div className="md:col-span-2">

                    <label className="text-sm font-medium text-gray-600">
                      Delivery Address
                    </label>

                    <textarea
                      name="deliveryAddress"
                      value={
                        formData.deliveryAddress
                      }
                      onChange={handleChange}
                      placeholder="Delivery Address"
                      rows="3"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />

                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery State
                    </label>

                    <input
                      type="text"
                      name="deliveryState"
                      value={
                        formData.deliveryState
                      }
                      onChange={handleChange}
                      placeholder="Delivery State"
                      className="w-full border p-3 rounded-xl mt-1 uppercase outline-none focus:border-[#2F9CAF]"
                    />
                  </div>

                </div>

              </div>


              {/* =========================================
                  BUTTONS
              ========================================= */}

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#2F9CAF] text-white hover:bg-[#238293] disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editId
                      ? "Update Party"
                      : "Save Party"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}

export default Parties;