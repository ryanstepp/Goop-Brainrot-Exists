export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <span>Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder="Type a Brainrot name..."
      />
    </label>
  );
}
