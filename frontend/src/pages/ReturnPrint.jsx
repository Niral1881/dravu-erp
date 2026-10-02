import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa";


function ReturnPrint() {

  const API =
    import.meta.env.VITE_API_URL;

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [returnData, setReturnData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH RETURN
  // =====================================================

  useEffect(() => {

    const fetchReturn = async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `${API}/returns/${id}`
          );

        setReturnData(
          response.data
        );

      } catch (error) {

        console.error(
          "Fetch return error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to load return."
        );

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchReturn();
    }

  }, [id]);


  // =====================================================
  // MONEY
  // =====================================================

  const money = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };


  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "-";
    }

    return value.toLocaleDateString(
      "en-IN"
    );

  };


  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {

    window.print();

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="text-gray-500">
          Loading return...
        </div>

      </div>

    );

  }


  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!returnData) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <p className="text-gray-600 mb-4">
          Return record not found.
        </p>

        <button
          onClick={() =>
            navigate("/returns")
          }
          className="px-5 py-3 bg-[#2F9CAF] text-white rounded-xl"
        >
          Back to Returns
        </button>

      </div>

    );

  }


  const qty =
    Number(
      returnData.qty || 0
    );

  const rate =
    Number(
      returnData.rate || 0
    );

  const amount =
    qty * rate;


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-100 py-6 print:bg-white print:py-0">


      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div className="max-w-[900px] mx-auto mb-5 flex items-center justify-between print:hidden">

        <button
          onClick={() =>
            navigate("/returns")
          }
          className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
        >

          <FaArrowLeft />

          Back

        </button>


        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293]"
        >

          <FaPrint />

          Print Return

        </button>

      </div>


      {/* =================================================
          A4 PAGE
      ================================================= */}

      <div className="return-print-page max-w-[900px] mx-auto bg-white min-h-[1120px] shadow-lg px-10 py-10 print:shadow-none print:max-w-none print:min-h-0 print:px-8 print:py-8">


        {/* HEADER */}

        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-5">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              DRAVU FASHION HUB
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Fashion & Garment Business
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Surat, Gujarat
            </p>

            <p className="text-sm text-gray-600">
              +91 99092 78815
            </p>

          </div>


          <div className="text-right">

            <h2 className="text-2xl font-bold text-[#2F9CAF]">
              RETURN NOTE
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Return Date
            </p>

            <p className="font-bold text-gray-800">
              {formatDate(
                returnData.returnDate
              )}
            </p>

          </div>

        </div>


        {/* RETURN INFORMATION */}

        <div className="grid grid-cols-2 gap-6 mt-8">


          {/* PARTY */}

          <div className="border border-gray-200 rounded-xl p-5">

            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
              Customer / Party
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-2">
              {returnData.partyName || "-"}
            </h3>

          </div>


          {/* INVOICE */}

          <div className="border border-gray-200 rounded-xl p-5">

            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
              Original Invoice
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-2">
              {returnData.invoiceNo || "-"}
            </h3>

          </div>

        </div>


        {/* RETURN DETAILS */}

        <div className="mt-8">

          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Return Details
          </h3>


          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-900 text-white">

                <th className="border border-gray-900 px-4 py-3 text-left">
                  No.
                </th>

                <th className="border border-gray-900 px-4 py-3 text-left">
                  Product
                </th>

                <th className="border border-gray-900 px-4 py-3 text-center">
                  Qty
                </th>

                <th className="border border-gray-900 px-4 py-3 text-right">
                  Rate
                </th>

                <th className="border border-gray-900 px-4 py-3 text-right">
                  Amount
                </th>

              </tr>

            </thead>


            <tbody>

              <tr>

                <td className="border border-gray-300 px-4 py-4">
                  1
                </td>

                <td className="border border-gray-300 px-4 py-4 font-semibold">
                  {returnData.productName || "-"}
                </td>

                <td className="border border-gray-300 px-4 py-4 text-center">
                  {qty}
                </td>

                <td className="border border-gray-300 px-4 py-4 text-right">
                  {money(rate)}
                </td>

                <td className="border border-gray-300 px-4 py-4 text-right font-bold">
                  {money(amount)}
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* TOTAL */}

        <div className="flex justify-end mt-8">

          <div className="w-[320px]">

            <div className="flex justify-between py-3 border-b border-gray-200">

              <span className="font-semibold text-gray-600">
                Total Quantity
              </span>

              <span className="font-bold">
                {qty}
              </span>

            </div>


            <div className="flex justify-between py-4 border-b-2 border-gray-900">

              <span className="text-lg font-bold text-gray-900">
                Return Amount
              </span>

              <span className="text-lg font-bold text-[#2F9CAF]">
                {money(amount)}
              </span>

            </div>

          </div>

        </div>


        {/* REASON */}

        <div className="mt-8 border border-gray-200 rounded-xl p-5">

          <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
            Return Reason
          </p>

          <p className="text-gray-800 mt-2">
            {returnData.reason || "Not specified"}
          </p>

        </div>


        {/* FOOTER */}

        <div className="mt-16 pt-5 border-t border-gray-200 flex justify-between text-xs text-gray-500">

          <div>

            <p className="font-semibold text-gray-700">
              Dravu Fashion Hub
            </p>

            <p>
              Return record generated from ERP
            </p>

          </div>


          <div className="text-right">

            <p>
              Customer Return
            </p>

            <p className="mt-1">
              Invoice: {returnData.invoiceNo || "-"}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          PRINT CSS
      ================================================= */}

      <style>{`

        @page {
          size: A4;
          margin: 0;
        }

        @media print {

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .return-print-page {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

        }

      `}</style>

    </div>

  );

}

export default ReturnPrint;