import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InvoiceHistory() {

  const API = import.meta.env.VITE_API_URL;
  const [invoices, setInvoices] =
    useState([]);


  const [parties, setParties] =
    useState([]);

  const [selectedParty, setSelectedParty] =
    useState("");

  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {

      const res = await axios.get(
        `${API}/invoices`
      );

      setInvoices(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchParties =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/parties`
          );

        setParties(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchInvoices();
      await fetchParties();
    };

    loadProducts();

  }, []);

  const filteredInvoices =
    invoices
      .filter((invoice) => {

        if (!selectedParty)
          return true;

        return (
          invoice.partyName ===
          selectedParty
        );
      })
  const totalSales =
    filteredInvoices.reduce(
      (acc, item) =>
        acc + item.grandTotal,
      0
    );

  return (

    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-4xl font-bold">
            Invoice History
          </h1>

          <p className="text-gray-500 mt-2">
            View all generated invoices
          </p>

        </div>

      </div>


      <div className="bg-white p-5 rounded-2xl shadow-sm mb-5">

        <h2 className="text-2xl font-bold text-[#2F9CAF]">

          Total Sales :
          ₹ {totalSales.toFixed(2)}

        </h2>

      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">

        <label className="block mb-2 font-medium">
          Search Party
        </label>

        <select
          value={selectedParty}
          onChange={(e) =>
            setSelectedParty(
              e.target.value
            )
          }
          className="w-full border border-gray-200 rounded-xl p-3"
        >

          <option value="">
            All Parties
          </option>

          {parties.map((party) => (

            <option
              key={party._id}
              value={party.name}
            >
              {party.name}
            </option>

          ))}

        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#F5F7FA]">

            <tr>

              <th className="text-left p-4">
                Invoice No
              </th>

              <th className="text-left p-4">
                Party Name
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Amount
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredInvoices.map((invoice) => (

              <tr
                key={invoice._id}
                className="border-t"
              >

                <td className="p-4">
                  {invoice.invoiceNo}
                </td>

                <td className="p-4">
                  {invoice.partyName}
                </td>

                <td className="p-4">

                  {
                    new Date(
                      invoice.createdAt
                    ).toLocaleDateString()
                  }

                </td>

                <td className="p-4">
                  ₹ {invoice.grandTotal}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-bold ${invoice.paymentStatus === "PAID"
                      ? "bg-green-500"
                      : invoice.paymentStatus === "PARTIAL"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                  >

                    {invoice.paymentStatus}

                  </span>

                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      navigate(
                        `/invoice-print/${invoice._id}`
                      )
                    }
                    className="bg-[#2F9CAF] cursor-pointer text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/edit-invoice/${invoice._id}`)
                    }
                    className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg ml-2"
                  >
                    Edit
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default InvoiceHistory;