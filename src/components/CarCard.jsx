const numberFormat = new Intl.NumberFormat('es-AR')

const EMPTY = '—'

export default function CarCard({ car }) {
  const { title, year, mileage, price, currency, province, source_site, original_url } = car

  return (
    <a
      href={original_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col border-2 border-ink bg-white hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <div className="flex items-center justify-between gap-2 border-b border-ink px-3 py-1 font-mono text-xs uppercase group-hover:border-white">
        <span>{source_site}</span>
        <span aria-hidden="true">↗</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 py-3">
        <h2 className="text-sm leading-snug font-bold">{title}</h2>

        <dl className="grid grid-cols-2 gap-x-3 font-mono text-xs">
          <div>
            <dt className="text-neutral-500 group-hover:text-neutral-400">Año</dt>
            <dd>{year ?? EMPTY}</dd>
          </div>
          <div>
            <dt className="text-neutral-500 group-hover:text-neutral-400">Kilometraje</dt>
            <dd>{mileage != null ? `${numberFormat.format(mileage)} km` : EMPTY}</dd>
          </div>
        </dl>

        <p className="mt-auto font-mono text-lg font-bold">
          {price != null ? `${currency ?? ''} ${numberFormat.format(price)}`.trim() : 'Consultar'}
        </p>
      </div>

      <div className="border-t border-ink px-3 py-1 text-xs group-hover:border-white">
        {province ?? 'Provincia sin informar'}
      </div>
    </a>
  )
}
