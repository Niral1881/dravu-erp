import { useEffect, useState } from "react";
import axios from "axios";

function Ledger() {

  const API = import.meta.env.VITE_API_URL;

  const [parties, setParties] =
    useState([]);

  const [selectedParty, setSelectedParty] =
    useState("");

  const [ledger, setLedger] =
    useState([]);

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [summary, setSummary] =
    useState({
      totalInvoice: 0,
      totalPayment: 0,
      balance: 0,
    });



  const fetchParties =
    async () => {

      try {

        const res =
          await axios.get(
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

  const fetchLedger =
    async (partyName) => {

      try {

        const invoiceRes =
          await axios.get(
            `${API}/invoices`
          );

        const paymentRes =
          await axios.get(
            `${API}/payments`
          );

        const invoices =
          invoiceRes.data
            .filter(
              (inv) =>
                inv.partyName ===
                partyName
            )
            .map((inv) => ({
              date: inv.date,
              type: "Invoice",
              invoiceNo:
                inv.invoiceNo,
              debit:
                inv.roundedTotal ||
                inv.grandTotal,
              credit: 0,
            }));

        const payments =
          paymentRes.data
            .filter(
              (pay) =>
                pay.partyName ===
                partyName
            )
            .map((pay) => ({
              date:
                pay.paymentDate,
              type: "Payment",
              invoiceNo:
                pay.invoiceNo,
              debit: 0,
              credit:
                pay.amount,
            }));

        const merged = [
          ...invoices,
          ...payments,
        ];

        const filtered =
          merged.filter((item) => {

            if (!fromDate || !toDate)
              return true;

            return (
              new Date(item.date) >=
              new Date(fromDate) &&

              new Date(item.date) <=
              new Date(toDate)
            );
          });

        filtered.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

        let runningBalance = 0;

        const updatedLedger =
          filtered.map((item) => {

            runningBalance +=
              item.debit -
              item.credit;

            return {
              ...item,
              balance:
                runningBalance,
            };
          });

        const totalInvoice =
          invoices.reduce(
            (acc, item) =>
              acc + item.debit,
            0
          );

        const totalPayment =
          payments.reduce(
            (acc, item) =>
              acc + item.credit,
            0
          );

        setSummary({
          totalInvoice,
          totalPayment,
          balance:
            totalInvoice -
            totalPayment,
        });

        setLedger(
          updatedLedger
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="p-3 md:p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
          Party Ledger
        </h1>

        <p className="text-gray-500">
          View party balance and transactions
        </p>

      </div>

      {/* Select Party */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">

        <label className="block mb-2 font-medium">
          Select Party
        </label>

        <select
          value={selectedParty}
          onChange={(e) => {

            setSelectedParty(
              e.target.value
            );

            fetchLedger(
              e.target.value
            );
          }}
          className="w-full border border-gray-200 rounded-xl p-3"
        >

          <option value="">
            Select Party
          </option>

          {parties
            .sort((a, b) =>
              a.name.localeCompare(b.name)
            )
            .map((party) => (
              <option
                key={party._id}
                value={party.name}
              >
                {party.name}
              </option>

            ))}

        </select>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

        <div>

          <label className="block mb-2 font-medium">
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <h3 className="text-gray-500 mb-2">
            Total Invoice
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-red-500">
            ₹ {
              summary.totalInvoice.toFixed(
                2
              )
            }
          </p>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <h3 className="text-gray-500 mb-2">
            Total Payment
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-green-600">
            ₹ {
              summary.totalPayment.toFixed(
                2
              )
            }
          </p>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <h3 className="text-gray-500 mb-2">
            Pending Amount
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-[#2F9CAF]">
            ₹ {
              summary.balance.toFixed(
                2
              )
            }
          </p>

        </div>

      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm mb-5">

        <h2 className="text-xl md:text-2xl font-bold text-[#2F9CAF]">

          {selectedParty}

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">

          <div>

            <p className="text-gray-500">
              Total Invoice
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-red-500">

              ₹ {
                summary.totalInvoice.toFixed(2)
              }

            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Total Payment
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-green-600">

              ₹ {
                summary.totalPayment.toFixed(2)
              }

            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Pending Amount
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-[#2F9CAF]">

              ₹ {
                summary.balance.toFixed(2)
              }

            </h3>

          </div>

        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="min-w-[900px] w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Type
              </th>

              <th className="text-left p-4">
                Invoice No
              </th>

              <th className="text-left p-4">
                Debit
              </th>

              <th className="text-left p-4">
                Credit
              </th>

              <th className="text-left p-4">
                Pending
              </th>

            </tr>

          </thead>

          <tbody>

            {ledger.map(
              (
                item,
                index
              ) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="p-4">

                    {
                      new Date(
                        item.date
                      ).toLocaleDateString(
                        "en-GB"
                      )
                    }

                  </td>

                  <td className="p-4">

                    <span
                      className={
                        item.type === "Invoice"
                          ? "text-red-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >

                      {item.type}

                    </span>

                  </td>

                  <td className="p-4">

                    {
                      item.invoiceNo
                    }

                  </td>

                  <td className="p-4 text-red-500 font-semibold">

                    {
                      item.debit > 0
                        ? `₹ ${item.debit}`
                        : "-"
                    }

                  </td>

                  <td className="p-4 text-green-600 font-semibold">

                    {
                      item.credit > 0
                        ? `₹ ${item.credit}`
                        : "-"
                    }

                  </td>

                  <td className="p-4 font-bold text-[#2F9CAF]">

                    <span
                      className={
                        item.balance > 0
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >

                      ₹ {item.balance}

                    </span>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Ledger;