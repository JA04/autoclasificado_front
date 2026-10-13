export default function Header() {
  return (
    <header className="border-b-2 border-ink bg-white">
      <div className="flex items-center gap-3 px-3 py-2">
        <span aria-hidden="true" className="h-4 w-4 shrink-0 border-2 border-ink bg-white" />
        <span aria-hidden="true" className="titlebar-stripes h-4 flex-1" />
        <h1 className="shrink-0 px-1 text-base font-bold tracking-wide">Autoclasificado</h1>
        <span aria-hidden="true" className="titlebar-stripes h-4 flex-1" />
      </div>
      <p className="border-t border-ink px-3 py-1 font-mono text-xs text-neutral-600">
        Autos usados de motordil y v6, en un solo lugar.
      </p>
    </header>
  )
}
