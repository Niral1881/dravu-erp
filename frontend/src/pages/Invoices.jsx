import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Invoices({ isEdit }) {

  const API = import.meta.env.VITE_API_URL;

  const [invoiceNo, setInvoiceNo] =
    useState("");

  const [invoiceDate, setInvoiceDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [dateOfSupply, setDateOfSupply] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [items, setItems] = useState([
    {
      productId: "",
      product: "",
      qty: "",
      rate: "",
      total: 0,
    },
  ]);

  const [partyId, setPartyId] =
    useState("");

  const [products, setProducts] = useState([]);

  const [partyName, setPartyName] =
    useState("");

  const [parties, setParties] =
    useState([]);

  const [selectedParty, setSelectedParty] =
    useState(null);


  const [discountPercent, setDiscountPercent] =
    useState(0);

  const [gstPercent, setGstPercent] =
    useState(0);

  const { id } = useParams();


  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {

      const res = await axios.get(
        `${API}/products`
      );

      const partyRes = await axios.get(
        `${API}/parties`
      );

      const invoiceRes = await axios.get(
        `${API}/invoices`
      );

      const invoices = invoiceRes.data;

      if (invoices.length > 0) {

        const lastInvoice =
          invoices[invoices.length - 1];

        const lastNumber =
          Number(
            lastInvoice.invoiceNo.split("-")[1]
          );

        const nextNumber =
          String(lastNumber + 1).padStart(4, "0");

        setInvoiceNo(`INV-${nextNumber}`);

      } else {

        setInvoiceNo("INV-0001");
      }

      setParties(partyRes.data);

      setProducts(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchInvoice = async () => {

    try {

      const res = await axios.get(
        `${API}/invoices/${id}`
      );

      const data = res.data;

      const matchedParty = parties.find(
        (p) => p.name === data.partyName
      );

      if (matchedParty) {

        setSelectedParty(matchedParty);

        setPartyId(matchedParty._id);
      }

      setPartyName(data.partyName);

      setInvoiceDate(data.date);

      setItems(data.items);

      setDiscountPercent(
        data.discountPercent
      );

      setGstPercent(
        data.gstPercent
      );

      setDateOfSupply(
        data.dateOfSupply
      );

      setInvoiceNo(
        data.invoiceNo
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchProducts();
      if (isEdit && id) {
        await fetchInvoice();
      }
    };
    loadProducts();

  }, []);

  const handleChange = (index, field, value) => {

    const updatedItems = [...items];

    updatedItems[index][field] = value;

    const qty =
      Number(updatedItems[index].qty) || 0;

    const rate =
      Number(updatedItems[index].rate) || 0;

    updatedItems[index].total =
      qty * rate;

    setItems(updatedItems);
  };

  const addRow = () => {

    setItems([
      ...items,

      {
        productId: "",
        product: "",
        qty: "",
        rate: "",
        total: 0,
      },
    ]);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const discountAmount =
    (subtotal * discountPercent) / 100;

  const afterDiscount =
    subtotal - discountAmount;

  const gstAmount =
    (afterDiscount * gstPercent) / 100;


  const grandTotal =
    afterDiscount + gstAmount;

  const roundedTotal =
    Math.ceil(grandTotal || 0);

  const roundOff =
    roundedTotal -
    (grandTotal || 0);




  const handleSaveInvoice = async () => {

    try {

      const invoiceData = {

        invoiceNo,

        partyName,

        partyAddress:
          selectedParty?.address || "",

        partyCity:
          selectedParty?.city || "",

        partyState:
          selectedParty?.state || "",

        partyPincode:
          selectedParty?.pincode || "",

        partyMobile:
          selectedParty?.mobile || "",

        partyGstin:
          selectedParty?.gstin || "",

        date: invoiceDate,

        dateOfSupply,

        items,

        subtotal,

        discountPercent,

        gstPercent,

        discountAmount,

        gstAmount,

        roundOff,

        roundedTotal,

        grandTotal:
          afterDiscount + gstAmount,

        paidAmount: 0,

        pendingAmount:
          roundedTotal,

        paymentStatus:
          "UNPAID",
      };

      let res;

      if (isEdit && id) {

        res = await axios.put(
          `${API}/invoices/${id}`,
          invoiceData
        );

      } else {

        res = await axios.post(
          `${API}/invoices`,
          invoiceData
        );
      }

      navigate(
        `/invoice-print/${res.data._id}`
      );


    } catch (error) {

      console.log(error);

      alert("Invoice save failed");
    }
  };



  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Create Invoice
          </h1>

          <p className="text-gray-500">
            Generate new sales invoice
          </p>
        </div>

        <button
          onClick={handleSaveInvoice}
          className="bg-[#2F9CAF] cursor-pointer text-white px-5 py-3 rounded-xl hover:bg-[#238293] w-full md:w-auto"
        >
          Save Invoice
        </button>

      </div>

      {/* Invoice Form */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">

        {/* Top Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

          <div>
            <label className="block mb-2 font-medium">
              Invoice No
            </label>

            <input
              type="text"
              value={invoiceNo}
              readOnly
              className="w-full border border-gray-200 rounded-xl p-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Party Name
            </label>

            <select
              value={partyId}
              onChange={(e) => {

                const party = parties.find(
                  (p) => p._id === e.target.value
                );

                if (!party) return;

                setPartyId(party._id);

                setPartyName(party.name);

                setSelectedParty(party);
              }}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none autoFocus focus:border-[#2F9CAF]"
            >

              <option value="">
                Select Party
              </option>

              {parties.map((party) => (

                <option
                  key={party._id}
                  value={party._id}
                >
                  {party.name}
                </option>
              ))}

            </select>

            {
              selectedParty && (

                <div className="bg-white p-4 rounded-xl border mt-4 space-y-2">

                  <p>
                    <span className="font-bold">
                      Address :
                    </span>

                    {" "}
                    {selectedParty.address}
                  </p>

                  <p>
                    <span className="font-bold">
                      City :
                    </span>

                    {" "}
                    {selectedParty.city}
                  </p>

                  <p>
                    <span className="font-bold">
                      State :
                    </span>

                    {" "}
                    {selectedParty.state}
                  </p>

                  <p>
                    <span className="font-bold">
                      Pincode :
                    </span>

                    {" "}
                    {selectedParty.pincode}
                  </p>

                  <p>
                    <span className="font-bold">
                      Mobile :
                    </span>

                    {" "}
                    {selectedParty.mobile}
                  </p>

                  <p>
                    <span className="font-bold">
                      GSTIN :
                    </span>

                    {" "}
                    {selectedParty.gstin}
                  </p>


                </div>
              )
            }

          </div>

          <div>
            <label className="block mb-2 font-medium">
              Date
            </label>

            <input
              type="date"
              value={invoiceDate}
              onChange={(e) =>
                setInvoiceDate(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-3 outline-none"
            />

          </div>

          <div className="mt-4">

            <label className="block mb-2 font-medium">
              Date Of Supply
            </label>

            <input
              type="date"
              value={dateOfSupply}
              onChange={(e) =>
                setDateOfSupply(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-3 outline-none"
            />

          </div>

        </div>

        {/* Items Table */}
        <div className="overflow-auto">

          <table className="min-w-[900px] w-full mb-5">

            <thead className="bg-gray-100">

              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Qty</th>
                <th className="text-left p-4">Rate</th>
                <th className="text-left p-4">Total</th>
              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => (
                <tr key={index} className="border-b">

                  <td className="p-4">
                    <select
                      value={item.productId}
                      onChange={(e) => {

                        const selectedProduct = products.find(
                          (p) => p._id === e.target.value
                        );

                        if (!selectedProduct) return;

                        const updatedItems = [...items];

                        updatedItems[index].productId =
                          selectedProduct._id;

                        updatedItems[index].product =
                          selectedProduct.name;

                        updatedItems[index].rate =
                          selectedProduct.rate;

                        const qty =
                          Number(updatedItems[index].qty) || 0;

                        const rate =
                          Number(selectedProduct.rate) || 0;

                        updatedItems[index].total =
                          qty * rate;

                        setItems(updatedItems);
                      }}
                      className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
                    >

                      <option value="">
                        Select Product
                      </option>

                      {products.map((product) => (
                        <option
                          key={product._id}
                          value={product._id}
                        >
                          {product.name} ({product.size})
                        </option>
                      ))}

                    </select>
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "qty",
                          (e.target.value)
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
                    />
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "rate",
                          (e.target.value)
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
                    />
                  </td>

                  <td className="p-4 font-semibold">
                    <div className="text-sm text-gray-500">

                      {item.product}

                    </div>
                    ₹ {item.total}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Add Row */}
        <button
          onClick={addRow}
          className="bg-[#2F9CAF] cursor-pointer text-white px-4 py-2 rounded-lg mb-6"
        >
          + Add Item
        </button>

        {/* Summary */}
        <div className="flex justify-end">

          <div className="w-full md:w-96 bg-gray-50 rounded-2xl p-5">

            {/* Discount */}
            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Overall Discount %
              </label>

              <input
                type="number"
                value={discountPercent}
                onChange={(e) =>
                  setDiscountPercent(
                    (e.target.value)
                  )
                }
                className="p-2 md:p-3"
              />

            </div>

            {/* GST */}
            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Overall GST %
              </label>

              <input
                type="number"
                value={gstPercent}
                onChange={(e) =>
                  setGstPercent(
                    (e.target.value)
                  )
                }
                className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
              />

            </div>

            {/* Totals */}
            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>
                ₹ {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mb-3 text-red-500">

              <span>Discount</span>

              <span>
                ₹ {discountAmount.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between mb-3 text-green-600">

              <span>GST</span>

              <span>
                ₹ {gstAmount.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between mb-3 text-gray-500">

              <span>
                Round Off
              </span>

              <span>
                ₹ {roundOff.toFixed(2)}
              </span>

            </div>

            <div className="border-t pt-3 flex justify-between text-2xl font-bold">

              <span>Grand Total</span>

              <span className="text-[#2F9CAF]">

                ₹ {roundedTotal.toFixed(2)}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Invoices;