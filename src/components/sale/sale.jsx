const Sale = () => {
  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-150px)]">
        {/* Invoice Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 animate-fadeIn flex flex-col">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Billed To
              </h2>
              <p className="text-sm text-gray-600">
                Name: <span className="text-indigo-700">gggg</span>
              </p>
              <p className="text-sm text-gray-600">
                Email: <span className="text-indigo-700">555</span>
              </p>
              <p className="text-sm text-gray-600">
                User ID: <span className="text-indigo-700">111</span>
              </p>
            </div>
            <div className="text-center">
              <img className="w-14 mx-auto" src="/images/logo.png" alt="Logo" />
              <p className="font-semibold text-gray-700 mt-2">Invoice</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto my-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="w-1/12 px-2 py-1">SL</th>
                  <th className="w-6/12 px-2 py-1">Name</th>
                  <th className="w-1/12 px-2 py-1">Qty</th>
                  <th className="w-3/12 px-2 py-1 text-right">Total</th>
                  <th className="w-1/12"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 group">
                  <td className="px-2 py-2">1</td>
                  <td className="px-2 py-2">name</td>
                  <td className="px-2 py-2">20</td>
                  <td className="px-2 py-2 text-right">2000</td>
                  <td className="text-center">
                    <button className="bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition">
                      ✕
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
            <p>
              Sub Total: <span className="text-indigo-700">subTotal</span>
            </p>
            <p>
              Payable: <span className="text-indigo-700">subTotal</span>
            </p>
            <p>
              VAT: <span className="text-indigo-700">0%</span>
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="discount" className="w-24">
                Discount:
              </label>
              <input
                type="number"
                id="discount"
                className="flex-1 px-2 py-1 outline-none border border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="w-full py-2 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform">
              Confirm
            </button>
          </div>
        </div>

        {/* Product Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 animate-fadeIn flex flex-col">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Search Products
          </h3>
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 px-3 py-2 outline-none border border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="w-2/12 px-2 py-1">SL</th>
                  <th className="w-8/12 px-2 py-1">Name</th>
                  <th className="w-2/12"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2">1</td>
                  <td className="px-2 py-2">name</td>
                  <td className="px-2 py-2 text-right">
                    <button className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full hover:bg-purple-200">
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <button className="hover:underline">Previous</button>
            <button className="hover:underline">Next</button>
          </div>
        </div>

        {/* Customer Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 animate-fadeIn flex flex-col">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Search Customers
          </h3>
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 px-3 py-2 outline-none border border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="w-2/12 px-2 py-1">SL</th>
                  <th className="w-8/12 px-2 py-1">Name</th>
                  <th className="w-2/12"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2">1</td>
                  <td className="px-2 py-2">name</td>
                  <td className="px-2 py-2 text-right">
                    <button className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full hover:bg-purple-200">
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <button className="hover:underline">Previous</button>
            <button className="hover:underline">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;
