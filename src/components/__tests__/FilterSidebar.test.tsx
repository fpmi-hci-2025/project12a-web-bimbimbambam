import { render } from '@testing-library/react'
import { FilterSidebar } from '../FilterSidebar'

test('FilterSidebar renders (desktop)', () => {
  render(
    <FilterSidebar
      variant="desktop"
      brands={[]}
      selectedBrandIds={[]}
      priceRange={[0, 1000000]}
      minRating={0}
      inStock={false}
      onBrandChange={() => {}}
      onPriceRangeChange={() => {}}
      onRatingChange={() => {}}
      onInStockChange={() => {}}
    />
  )
})

test('FilterSidebar renders (mobile)', () => {
  render(
    <FilterSidebar
      variant="mobile"
      brands={[]}
      selectedBrandIds={[]}
      priceRange={[0, 1000000]}
      minRating={0}
      inStock={false}
      onBrandChange={() => {}}
      onPriceRangeChange={() => {}}
      onRatingChange={() => {}}
      onInStockChange={() => {}}
    />
  )
})
