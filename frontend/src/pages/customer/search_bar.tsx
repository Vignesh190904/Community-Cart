import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="customer-search-bar">
      <img
        src="/customer/assets/icons/search.svg"
        alt="Search"
        className="customer-search-icon"
      />
      <input
        type="text"
        className="customer-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
