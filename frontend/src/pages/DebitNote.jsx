import {
  useEffect,
  useState,

} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function DebitNote() {
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  // ======================================
  // STATE
  // ======================================

  const [debitNoteNo, setDebitNoteNo] =
    useState("");

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [parties, setParties] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [supplierId, setSupplierId] =
    useState("");

  const [selectedSupplier, setSelectedSupplier] =
    useState(null);

  const [gstPercent, setGstPercent] =
    useState(0);

  const [taxType, setTaxType] =
    useState("CGST_SGST");

  const [reason, setReason] = useState(
    "RAW MATERIAL PURCHASE"
  );

  const [note, setNote] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [items, setItems] = useState([
    {
      productId: "",
      product: "",
      qty: "",
      rate: "",
      total: 0,
    },
  ]);

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {

        // ==================================
        // LOAD PARTIES
        // ==================================

        const partyRes = await axios.get(
          `${API}/parties`
        );

        if (!cancelled) {
          const partyList =
            Array.isArray(partyRes.data)
              ? partyRes.data
              : [];

          console.log(
            "PURCHASE PARTY LIST:",
            partyList
          );

          setParties(partyList);
        }


        // ==================================
        // LOAD PRODUCTS
        // ==================================

        const productRes = await axios.get(
          `${API}/products`
        );

        if (!cancelled) {
          const productList =
            Array.isArray(productRes.data)
              ? productRes.data
              : [];

          setProducts(productList);
        }


        // ==================================
        // LOAD DEBIT NOTES
        // ==================================

        const debitRes = await axios.get(
          `${API}/debit-notes`
        );

        if (!cancelled) {
          const notes =
            Array.isArray(debitRes.data)
              ? debitRes.data
              : [];

          let nextNumber = 1;

          if (notes.length > 0) {

            const numbers = notes.map(
              (item) => {

                const match =
                  item.debitNoteNo?.match(
                    /\d+/
                  );

                return match
                  ? Number(match[0])
                  : 0;
              }
            );

            nextNumber =
              Math.max(...numbers) + 1;
          }

          setDebitNoteNo(
            `DN-${nextNumber}`
          );
        }

      } catch (error) {

        if (!cancelled) {
          console.error(
            "INITIAL LOAD ERROR:",
            error.response?.data ||
            error.message ||
            error
          );
        }

      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };

  }, [API]);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        // LOAD PARTIES
        const partyRes = await axios.get(
          `${API}/parties`
        );

        if (!cancelled) {
          const partyList = Array.isArray(partyRes.data)
            ? partyRes.data
            : [];

          console.log("PURCHASE PARTY LIST:", partyList);

          setParties(partyList);
        }

        // LOAD PRODUCTS
        const productRes = await axios.get(
          `${API}/products`
        );

        if (!cancelled) {
          const productList = Array.isArray(productRes.data)
            ? productRes.data
            : [];

          setProducts(productList);
        }

        // LOAD DEBIT NOTE NUMBER
        const debitRes = await axios.get(
          `${API}/debit-notes`
        );

        if (!cancelled) {
          const notes = Array.isArray(debitRes.data)
            ? debitRes.data
            : [];

          let nextNumber = 1;

          if (notes.length > 0) {
            const numbers = notes.map((item) => {
              const match =
                item.debitNoteNo?.match(/\d+/);

              return match
                ? Number(match[0])
                : 0;
            });

            nextNumber =
              Math.max(...numbers) + 1;
          }

          setDebitNoteNo(`DN-${nextNumber}`);
        }

      } catch (error) {
        if (!cancelled) {
          console.error(
            "INITIAL LOAD ERROR:",
            error.response?.data ||
            error.message ||
            error
          );
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };

  }, [API]);

  // ======================================
  // SELECT PURCHASE PARTY
  // ======================================

  const handleSupplierChange = (e) => {
    const id = e.target.value;

    setSupplierId(id);

    if (!id) {
      setSelectedSupplier(null);
      return;
    }

    const supplier = parties.find(
      (party) =>
        String(party._id) === String(id)
    );

    console.log(
      "SELECTED PURCHASE PARTY:",
      supplier
    );

    if (!supplier) {
      setSelectedSupplier(null);
      return;
    }

    setSelectedSupplier(supplier);
  };

  // ======================================
  // ITEM CHANGE
  // ======================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      const qty =
        Number(updated[index].qty) || 0;

      const rate =
        Number(updated[index].rate) || 0;

      updated[index].total =
        qty * rate;

      return updated;
    });
  };

  // ======================================
  // PRODUCT SELECT
  // ======================================

  const handleProductChange = (
    index,
    productId
  ) => {
    const product = products.find(
      (item) =>
        String(item._id) ===
        String(productId)
    );

    if (!product) {
      return;
    }

    setItems((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],

        productId:
          product._id,

        product:
          product.name || "",

        rate:
          Number(product.rate) || 0,
      };

      const qty =
        Number(updated[index].qty) || 0;

      const rate =
        Number(updated[index].rate) || 0;

      updated[index].total =
        qty * rate;

      return updated;
    });
  };

  // ======================================
  // ADD ITEM
  // ======================================

  const addItem = () => {
    setItems((prev) => [
      ...prev,

      {
        productId: "",
        product: "",
        qty: "",
        rate: "",
        total: 0,
      },
    ]);
  };

  // ======================================
  // REMOVE ITEM
  // ======================================

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ======================================
  // TOTALS
  // ======================================

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.total || 0),
    0
  );

  const gstAmount =
    subtotal *
    (Number(gstPercent) / 100);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (taxType === "CGST_SGST") {
    cgstAmount =
      gstAmount / 2;

    sgstAmount =
      gstAmount / 2;
  }

  if (taxType === "IGST") {
    igstAmount =
      gstAmount;
  }

  const grandTotal =
    subtotal +
    gstAmount;

  // ======================================
  // SAVE DEBIT NOTE
  // ======================================

  const handleSave = async () => {
    try {
      if (!supplierId) {
        alert(
          "Please select Purchase Party"
        );
        return;
      }

      if (!selectedSupplier) {
        alert(
          "Purchase Party not found"
        );
        return;
      }

      if (!date) {
        alert(
          "Please select date"
        );
        return;
      }

      for (const item of items) {
        if (!item.productId) {
          alert(
            "Please select material for every row"
          );
          return;
        }

        if (Number(item.qty) <= 0) {
          alert(
            "Quantity must be greater than 0"
          );
          return;
        }

        if (Number(item.rate) < 0) {
          alert(
            "Rate cannot be negative"
          );
          return;
        }
      }

      setSaving(true);

      const debitNoteData = {
        debitNoteNo,

        supplierId,

        supplierName:
          selectedSupplier.name || "",

        supplierAddress:
          selectedSupplier.address || "",

        supplierCity:
          selectedSupplier.city || "",

        supplierState:
          selectedSupplier.state || "",

        supplierPincode:
          selectedSupplier.pincode || "",

        supplierMobile:
          selectedSupplier.mobile || "",

        supplierGstin:
          selectedSupplier.gstin || "",

        date,

        reason,

        taxType,

        items: items.map(
          (item) => ({
            productId:
              item.productId,

            product:
              item.product,

            qty:
              Number(item.qty),

            rate:
              Number(item.rate),

            total:
              Number(item.total),
          })
        ),

        subtotal,

        gstPercent:
          Number(gstPercent),

        cgstAmount,

        sgstAmount,

        igstAmount,

        gstAmount,

        grandTotal,

        note,
      };

      console.log(
        "DEBIT NOTE DATA:",
        debitNoteData
      );

      const response =
        await axios.post(
          `${API}/debit-notes`,
          debitNoteData
        );

      console.log(
        "DEBIT NOTE SAVED:",
        response.data
      );

      navigate(
        `/debit-note-print/${response.data._id}`
      );

    } catch (error) {
      console.error("========== DEBIT NOTE SAVE ERROR ==========");
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);
      console.error("MESSAGE:", error.message);
      console.error("FULL ERROR:", error);
      console.error("==========================================");

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Debit Note save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Purchase Party Debit Note
          </h1>

          <p className="text-gray-500">
            Raw Material Purchase
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2F9CAF] text-white px-5 py-3 rounded-xl hover:bg-[#238293] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Debit Note"}
        </button>

      </div>


      <div className="bg-white rounded-2xl shadow-sm p-5">

        {/* TOP */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* DEBIT NOTE */}

          <div>
            <label className="block mb-2 font-medium">
              Debit Note No
            </label>

            <input
              value={debitNoteNo}
              onChange={(e) =>
                setDebitNoteNo(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>


          {/* PURCHASE PARTY */}

          <div>
            <label className="block mb-2 font-medium">
              Purchase Party
            </label>

            <select
              value={supplierId}
              onChange={
                handleSupplierChange
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="">
                Select Purchase Party
              </option>

              {parties
                .slice()
                .sort((a, b) =>
                  String(
                    a.name || ""
                  ).localeCompare(
                    String(
                      b.name || ""
                    )
                  )
                )
                .map((party) => (
                  <option
                    key={party._id}
                    value={party._id}
                  >
                    {party.name}
                  </option>
                ))}
            </select>

            {/* DEBUG */}

            {parties.length === 0 && (
              <p className="text-red-500 text-sm mt-2">
                No parties loaded
              </p>
            )}

          </div>


          {/* DATE */}

          <div>
            <label className="block mb-2 font-medium">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>


        {/* SUPPLIER DETAILS */}

        {selectedSupplier && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">

            <h3 className="font-semibold mb-3">
              Purchase Party Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <div>
                <b>Name:</b>{" "}
                {selectedSupplier.name}
              </div>

              <div>
                <b>Mobile:</b>{" "}
                {selectedSupplier.mobile ||
                  "-"}
              </div>

              <div>
                <b>GSTIN:</b>{" "}
                {selectedSupplier.gstin ||
                  "-"}
              </div>

              <div>
                <b>City:</b>{" "}
                {selectedSupplier.city ||
                  "-"}
              </div>

              <div className="md:col-span-2">
                <b>Address:</b>{" "}
                {selectedSupplier.address ||
                  "-"}
              </div>

            </div>

          </div>
        )}


        {/* REASON */}

        <div className="mt-6">
          <label className="block mb-2 font-medium">
            Reason
          </label>

          <input
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="w-full border rounded-xl p-3 uppercase"
          />
        </div>


        {/* ITEMS */}

        <div className="mt-8">

          <div className="flex justify-between items-center mb-3">

            <h2 className="text-xl font-semibold">
              Items
            </h2>

            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Item
            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full border">

              <thead className="bg-gray-100">

                <tr>

                  <th className="border p-3 text-left">
                    Product
                  </th>

                  <th className="border p-3">
                    Qty
                  </th>

                  <th className="border p-3">
                    Rate
                  </th>

                  <th className="border p-3">
                    Total
                  </th>

                  <th className="border p-3">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {items.map(
                  (item, index) => (
                    <tr key={index}>

                      <td className="border p-2">

                        <select
                          value={
                            item.productId
                          }
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-2"
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
                                {product.name}
                              </option>
                            )
                          )}

                        </select>

                      </td>


                      <td className="border p-2">

                        <input
                          type="number"
                          min="0"
                          value={
                            item.qty
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-2"
                        />

                      </td>


                      <td className="border p-2">

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            item.rate
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-2"
                        />

                      </td>


                      <td className="border p-2 text-right font-semibold">

                        ₹{" "}
                        {Number(
                          item.total || 0
                        ).toFixed(2)}

                      </td>


                      <td className="border p-2 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          disabled={
                            items.length ===
                            1
                          }
                          className="bg-red-500 text-white px-3 py-2 rounded-lg disabled:opacity-40"
                        >
                          Remove
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* GST */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              GST %
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={gstPercent}
              onChange={(e) =>
                setGstPercent(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Tax Type
            </label>

            <select
              value={taxType}
              onChange={(e) =>
                setTaxType(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="CGST_SGST">
                CGST + SGST
              </option>

              <option value="IGST">
                IGST
              </option>
            </select>
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Note
            </label>

            <input
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              className="w-full border rounded-xl p-3"
              placeholder="OPTIONAL NOTE"
            />
          </div>

        </div>


        {/* TOTALS */}

        <div className="mt-8 ml-auto max-w-md">

          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>
              ₹ {subtotal.toFixed(2)}
            </span>
          </div>


          <div className="flex justify-between py-2">
            <span>
              GST ({Number(gstPercent)}%)
            </span>
            <span>
              ₹ {gstAmount.toFixed(2)}
            </span>
          </div>


          {taxType ===
            "CGST_SGST" && (
              <>
                <div className="flex justify-between py-2">
                  <span>
                    CGST
                  </span>

                  <span>
                    ₹{" "}
                    {cgstAmount.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span>
                    SGST
                  </span>

                  <span>
                    ₹{" "}
                    {sgstAmount.toFixed(
                      2
                    )}
                  </span>
                </div>
              </>
            )}


          {taxType === "IGST" && (
            <div className="flex justify-between py-2">
              <span>
                IGST
              </span>

              <span>
                ₹{" "}
                {igstAmount.toFixed(
                  2
                )}
              </span>
            </div>
          )}


          <div className="border-t mt-3 pt-3 flex justify-between text-xl font-bold">
            <span>
              Grand Total
            </span>

            <span>
              ₹{" "}
              {grandTotal.toFixed(2)}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DebitNote;