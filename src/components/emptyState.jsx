const EmptyState = ({
    title = 'Nothing here yet',
    message = 'Start by adding your first item.',
    buttonText = 'Add New',
    onButtonClick
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* SVG Icon */}
            <div className="mb-6">
                <svg
                    className="w-16 h-16 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m0 3.75h.008v-.008H12v.008zm9-3.75a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

            {/* Message */}
            <p className="text-gray-500 mb-6">{message}</p>

            {/* Optional Action Button */}
            {onButtonClick && (
                <button
                    onClick={onButtonClick}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow hover:from-purple-600 hover:to-indigo-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
