import { render } from '@testing-library/react'
import { CatalogPage } from '../CatalogPage'

test('CatalogPage renders', () => {
  render(
    <CatalogPage
      products={[]}
      categories={[]}
      brands={[]}
      favoriteIds={[]}
      compareIds={[]}
      selectedCategoryId={null}
      selectedBrandIds={[]}
      priceRange={[0, 1000000]}
      minRating={0}
      inStock={false}
      sortBy="default"
      onProductClick={() => {}}
      onToggleFavorite={() => {}}
      onToggleCompare={() => {}}
      onAddToCart={() => {}}
      onCategoryChange={() => {}}
      onBrandChange={() => {}}
      onPriceRangeChange={() => {}}
      onRatingChange={() => {}}
      onInStockChange={() => {}}
      onSortChange={() => {}}
      onCompareClick={() => {}}
      isLoading={false}
      currentPage={0}
      totalPages={0}
      onPageChange={() => {}}
      searchQuery=""
      onSearchChange={() => {}}
      onSearchSubmit={() => {}}
    />
  )
})
