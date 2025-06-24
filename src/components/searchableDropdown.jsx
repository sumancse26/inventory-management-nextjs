import { useState } from "react";

const SearchableDropdown = ({
  options,
  onSelect,
  labelKey = "name",
  valueKey = "mobile",
  placeholder = "Search...",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Check if query is exactly equal to selected item's label
  const isMatchingSelected =
    selected &&
    query.trim().toLowerCase() ===
      `${selected[labelKey]} - ${selected[valueKey]}`.toLowerCase();

  // Filtered results only when typing, not when selected
  const filtered = isMatchingSelected
    ? options
    : options.filter((item) =>
        `${item[labelKey]} ${item[valueKey]}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(`${item[labelKey]} - ${item[valueKey]}`);
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
      />

      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-lg shadow max-h-60 overflow-y-auto w-full">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-sm text-gray-700"
              >
                {item[labelKey]} - {item[valueKey]}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-400">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
