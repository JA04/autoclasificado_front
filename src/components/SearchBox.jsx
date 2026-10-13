export default function SearchBox({ value, onChange }) {
  return (
    <div className="flex min-w-48 flex-1 items-center gap-2 sm:max-w-sm">
      <label htmlFor="search" className="text-sm font-bold">
        Modelo:
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej: Corolla"
        autoComplete="off"
        className="w-full min-w-0 rounded-none border-2 border-ink bg-white px-2 py-1 font-mono text-sm placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-2 focus:outline-ink"
      />
    </div>
  )
}
