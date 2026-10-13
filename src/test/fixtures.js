export function makeCar(overrides = {}) {
  return {
    id: 1,
    title: 'Toyota Corolla 1.8 XEI',
    year: 2018,
    mileage: 119000,
    price: 11000,
    currency: 'USD',
    province: 'Córdoba',
    source_site: 'motordil',
    original_url: 'https://motordil.com/autos/1',
    ...overrides,
  }
}

export function makeCars(count, firstId = 1) {
  return Array.from({ length: count }, (_, index) =>
    makeCar({
      id: firstId + index,
      title: `Auto ${firstId + index}`,
      original_url: `https://motordil.com/autos/${firstId + index}`,
    }),
  )
}
