const ConfirmDialog = ({ message, onOk, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in">
                <div className="flex flex-col items-center text-center space-y-4 ">
                    <div className="flex bg-purple-100 p-3 rounded-full">
                        <span className="material-icons  text-purple-600 text-3xl">info</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
                </div>

                <div className="mt-10 flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button
                        onClick={onOk}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow hover:shadow-lg transition">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
