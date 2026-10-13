const buttonClass =
  'cursor-pointer rounded-sm border-2 border-ink bg-white px-3 py-1 text-sm font-bold hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 disabled:hover:bg-white disabled:hover:text-neutral-400'

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Paginación" className="mt-6 flex items-center justify-center gap-4">
      <button type="button" className={buttonClass} disabled={page === 0} onClick={() => onChange(page - 1)}>
        ← Anterior
      </button>
      <span className="font-mono text-sm">
        Página {page + 1} de {pageCount}
      </span>
      <button
        type="button"
        className={buttonClass}
        disabled={page >= pageCount - 1}
        onClick={() => onChange(page + 1)}
      >
        Siguiente →
      </button>
    </nav>
  )
}
