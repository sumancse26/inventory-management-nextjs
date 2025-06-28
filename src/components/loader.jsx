const Loader = () => {
    return (
        <svg className="h-5 w-5 animate-spin text-sky-400 ms-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
};

export default Loader;
