const PROVINCES = [
  'Buenos Aires',
  'Capital Federal',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

export default function ProvinceFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="province" className="text-sm font-bold">
        Provincia:
      </label>
      <select
        id="province"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-none border-2 border-ink bg-white px-2 py-1 font-mono text-sm focus:outline-2 focus:outline-offset-2 focus:outline-ink"
      >
        <option value="">Todas</option>
        {PROVINCES.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>
    </div>
  )
}
