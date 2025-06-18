const InvoiceList = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-indigo-600">
          <span className="material-icons text-3xl">receipt_long</span>
          <h2 className="text-2xl font-bold text-gray-800">Invoice List</h2>
        </div>
        {/* <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none">
          <span className="material-icons text-base">add</span>
          Add Invoice
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {[
                "No",
                "Name",
                "Phone",
                "Total",
                "Vat",
                "Discount",
                "Payable",
                "Action",
              ].map((head, idx) => (
                <th key={idx} className="px-5 py-3 font-semibold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 dark:hover:bg-neutral-700 group transition">
              <td className="px-5 py-3 text-gray-700">1</td>
              <td className="px-5 py-3 text-gray-700">vvvvvv</td>
              <td className="px-5 py-3 text-gray-700">111111</td>
              <td className="px-5 py-3 text-gray-700">1111</td>
              <td className="px-5 py-3 text-gray-700">1</td>
              <td className="px-5 py-3 text-gray-700">11</td>
              <td className="px-5 py-3 text-gray-700">222</td>
              <td className="px-5 py-3 flex items-center gap-3">
                <button
                  className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md transition"
                  title="View"
                >
                  <span className="material-icons text-sm">visibility</span>
                </button>
                <button
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition"
                  title="Delete"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <p>Showing 1 of 10 entries</p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
            <span className="material-icons text-sm">chevron_left</span>
            Prev
          </button>
          <button className="flex items-center gap-1 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
            Next
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
