import { useEffect, useState } from "react";
import axios from "axios";

function Returns() {

  const [invoices, setInvoices] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [invoiceNo, setInvoiceNo] =
    useState("");

  const [partyName, setPartyName] =
    useState("");

  const [productId, setProductId] =
    useState("");

  const [qty, setQty] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [returnDate, setReturnDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );
  const [returns, setReturns] =
    useState([]);

  const fetchData =
    async () => {

      try {

        const invoiceRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/invoices`
          );

        const productRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/products`
          );

        const returnRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/returns`
          );

        setReturns(
          returnRes.data
        );

        setInvoices(
          invoiceRes.data
        );

        setProducts(
          productRes.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchData();
    };

    loadProducts();

  }, []);

  const selectedInvoice =
    invoices.find(
      (inv) =>
        inv.invoiceNo ===
        invoiceNo
    );

  const handleInvoiceChange =
    (value) => {

      setInvoiceNo(value);

      const invoice =
        invoices.find(
          (inv) =>
            inv.invoiceNo === value
        );

      if (invoice) {

        setPartyName(
          invoice.partyName
        );
      }
    };

  const handleSaveReturn =
    async () => {

      try {

        const selectedProduct =
          products.find(
            (p) =>
              p._id === productId
          );

        const returnData = {

          invoiceNo,

          partyName,

          productId,

          productName:
            selectedProduct?.name,

          qty:
            Number(qty),

          reason,

          returnDate,
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/returns`,
          returnData
        );

        alert(
          "Return Saved Successfully"
        );

        setInvoiceNo("");

        setPartyName("");

        setProductId("");

        setQty("");

        setReason("");

      } catch (error) {

        console.log(error);

        alert(
          "Return Save Failed"
        );
      }
    };



  return (

    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-[#2E3A3F]">
          Product Return
        </h1>

        <p className="text-gray-500">
          Manage returned products
        </p>

      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-5">

        {/* Invoice */}
        <div>

          <label className="block mb-2 font-medium">
            Invoice No
          </label>

          <select
            value={invoiceNo}
            onChange={(e) =>
              handleInvoiceChange(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          >

            <option value="">
              Select Invoice
            </option>

            {invoices.map(
              (invoice) => (

                <option
                  key={invoice._id}
                  value={
                    invoice.invoiceNo
                  }
                >
                  {
                    invoice.invoiceNo
                  }
                </option>
              )
            )}

          </select>

        </div>

        {/* Party */}
        <div>

          <label className="block mb-2 font-medium">
            Party Name
          </label>

          <input
            type="text"
            value={partyName}
            readOnly
            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100"
          />

        </div>

        {/* Product */}
        <div>

          <label className="block mb-2 font-medium">
            Product
          </label>

          <select
            value={productId}
            onChange={(e) =>
              setProductId(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          >

            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (

                <option
                  key={product._id}
                  value={
                    product._id
                  }
                >
                  {product.name}
                </option>
              )
            )}

          </select>

        </div>

        {/* Qty */}
        <div>

          <label className="block mb-2 font-medium">
            Return Qty
          </label>

          <input
            type="number"
            value={qty}
            onChange={(e) =>
              setQty(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

        {/* Date */}
        <div>

          <label className="block mb-2 font-medium">
            Return Date
          </label>

          <input
            type="date"
            value={returnDate}
            onChange={(e) =>
              setReturnDate(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

        {/* Reason */}
        <div>

          <label className="block mb-2 font-medium">
            Reason
          </label>

          <input
            type="text"
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
            placeholder="Reason"
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

      </div>

      {/* Invoice Details */}
      {selectedInvoice && (

        <div className="bg-white mt-6 p-5 rounded-2xl shadow-sm">

          <h2 className="text-xl font-bold mb-4">
            Invoice Details
          </h2>

          <p>
            <span className="font-semibold">
              Party :
            </span>

            {" "}
            {
              selectedInvoice.partyName
            }
          </p>

          <p>
            <span className="font-semibold">
              Invoice :
            </span>

            {" "}
            {
              selectedInvoice.invoiceNo
            }
          </p>

        </div>

      )}

      {/* Save */}
      <div className="mt-6">

        <button
          onClick={
            handleSaveReturn
          }
          className="bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293]"
        >
          Save Return
        </button>

        <div className="bg-white mt-8 rounded-2xl shadow-sm overflow-auto">

          <div className="p-5 border-b">

            <h2 className="text-2xl font-bold text-[#2E3A3F]">
              Return History
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Party
                </th>

                <th className="p-4 text-left">
                  Invoice
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Qty
                </th>

                <th className="p-4 text-left">
                  Reason
                </th>

              </tr>

            </thead>

            <tbody>

              {returns.map(
                (item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      {
                        new Date(
                          item.returnDate
                        ).toLocaleDateString(
                          "en-GB"
                        )
                      }

                    </td>

                    <td className="p-4 font-medium">

                      {item.partyName}

                    </td>

                    <td className="p-4">

                      {item.invoiceNo}

                    </td>

                    <td className="p-4">

                      {item.productName}

                    </td>

                    <td className="p-4 text-green-600 font-bold">

                      {item.qty}

                    </td>

                    <td className="p-4">

                      {item.reason || "-"}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>



    </div>
  );
}

export default Returns;