import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ProductDTO, CategoryDTO, BrandDTO } from '../types/api';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CatalogPageProps {
  products: ProductDTO[];
  categories: CategoryDTO[];
  brands: BrandDTO[];
  favoriteIds: number[];
  compareIds: number[];
  selectedCategoryId: number | null;
  selectedBrandIds: number[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  sortBy: string;
  onProductClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onAddToCart: (id: number) => void;
  onCategoryChange: (id: number | null) => void;
  onBrandChange: (ids: number[]) => void;
  onPriceRangeChange: (r: [number, number]) => void;
  onRatingChange: (r: number) => void;
  onInStockChange: (v: boolean) => void;
  onSortChange: (s: string) => void;
  onCompareClick: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
}

export function CatalogPage(props: CatalogPageProps) {
  const {
    products,
    categories,
    brands,
    favoriteIds,
    compareIds,
    selectedCategoryId,
    selectedBrandIds,
    priceRange,
    minRating,
    inStock,
    sortBy,
    onProductClick,
    onToggleFavorite,
    onToggleCompare,
    onAddToCart,
    onCategoryChange,
    onBrandChange,
    onPriceRangeChange,
    onRatingChange,
    onInStockChange,
    onSortChange,
    onCompareClick,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    searchQuery,
    onSearchChange,
    onSearchSubmit,
  } = props;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEARCH */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 max-w-2xl">
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            />
            <Button onClick={onSearchSubmit}>
              <Search className="h-4 w-4 mr-2" />
              Найти
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto py-4">
            <Button
              variant={selectedCategoryId === null ? 'default' : 'outline'}
              onClick={() => onCategoryChange(null)}
            >
              Все товары
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={selectedCategoryId === c.id ? 'default' : 'outline'}
                onClick={() => onCategoryChange(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* DESKTOP FILTER */}
        <FilterSidebar
          variant="desktop"
          brands={brands}
          selectedBrandIds={selectedBrandIds}
          priceRange={priceRange}
          minRating={minRating}
          inStock={inStock}
          onBrandChange={onBrandChange}
          onPriceRangeChange={onPriceRangeChange}
          onRatingChange={onRatingChange}
          onInStockChange={onInStockChange}
        />

        <div className="flex-1 min-w-0">
          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex justify-between mb-6">
            <p>Найдено товаров: {products.length}</p>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[220px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price,asc">Цена ↑</SelectItem>
                <SelectItem value="price,desc">Цена ↓</SelectItem>
                <SelectItem value="averageRating,desc">Рейтинг</SelectItem>
                <SelectItem value="title,asc">Название</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex lg:hidden justify-between mb-4">
            <FilterSidebar
              variant="mobile"
              brands={brands}
              selectedBrandIds={selectedBrandIds}
              priceRange={priceRange}
              minRating={minRating}
              inStock={inStock}
              onBrandChange={onBrandChange}
              onPriceRangeChange={onPriceRangeChange}
              onRatingChange={onRatingChange}
              onInStockChange={onInStockChange}
            />

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[160px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price,asc">Цена ↑</SelectItem>
                <SelectItem value="price,desc">Цена ↓</SelectItem>
                <SelectItem value="averageRating,desc">Рейтинг</SelectItem>
                <SelectItem value="title,asc">Название</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCTS */}
          {isLoading ? (
            <p className="text-center py-12">Загрузка...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isFavorite={favoriteIds.includes(p.id)}
                    isInCompare={compareIds.includes(p.id)}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCompare={onToggleCompare}
                    onAddToCart={onAddToCart}
                    onClick={onProductClick}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-8">
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <span>
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => onPageChange(currentPage + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
