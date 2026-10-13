import CarCard from './CarCard.jsx'

export default function CarGrid({ cars }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map((car) => (
        <li key={car.id}>
          <CarCard car={car} />
        </li>
      ))}
    </ul>
  )
}
