import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { BrandDTO } from '../types/api';
import { useRef, useState } from 'react';

interface FilterSidebarProps {
  brands: BrandDTO[];
  selectedBrandIds: number[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  onBrandChange: (brandIds: number[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onInStockChange: (inStock: boolean) => void;
  variant: 'desktop' | 'mobile';
}

const MIN_PRICE = 0;
const MAX_PRICE = 1_000_000;

export function FilterSidebar({
  brands,
  selectedBrandIds,
  priceRange,
  minRating,
  inStock,
  onBrandChange,
  onPriceRangeChange,
  onRatingChange,
  onInStockChange,
  variant,
}: FilterSidebarProps) {
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const applyFilters = () => {
    const min = Math.max(
      MIN_PRICE,
      Number(minRef.current?.value || priceRange[0])
    );
    const max = Math.min(
      MAX_PRICE,
      Number(maxRef.current?.value || priceRange[1])
    );

    onPriceRangeChange([min, Math.max(min, max)]);
    setOpen(false); // 🔥 CLOSE SHEET
  };

  const resetFilters = () => {
    onBrandChange([]);
    onPriceRangeChange([MIN_PRICE, MAX_PRICE]);
    onRatingChange(0);
    onInStockChange(false);

    if (minRef.current) minRef.current.value = '';
    if (maxRef.current) maxRef.current.value = '';
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* PRICE */}
      <div className="space-y-3">
        <Label>Цена, BYN</Label>
        <div className="flex gap-2">
          <Input
            ref={minRef}
            type="text"
            inputMode="numeric"
            placeholder="От"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''))
            }
          />
          <Input
            ref={maxRef}
            type="text"
            inputMode="numeric"
            placeholder="До"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''))
            }
          />
        </div>
      </div>

      <Separator />

      {/* BRANDS */}
      <div className="space-y-3">
        <Label>Бренд</Label>
        {brands.map((brand) => (
          <div key={brand.id} className="flex gap-2 items-center">
            <Checkbox
              checked={selectedBrandIds.includes(brand.id)}
              onCheckedChange={() =>
                onBrandChange(
                  selectedBrandIds.includes(brand.id)
                    ? selectedBrandIds.filter((id) => id !== brand.id)
                    : [...selectedBrandIds, brand.id]
                )
              }
            />
            <span>{brand.name}</span>
          </div>
        ))}
      </div>

      <Separator />

      {/* RATING */}
      <div className="space-y-3">
        <Label>Рейтинг</Label>
        {[5, 4, 3, 2, 1].map((r) => (
          <div key={r} className="flex gap-2 items-center">
            <Checkbox
              checked={minRating === r}
              onCheckedChange={() => onRatingChange(minRating === r ? 0 : r)}
            />
            <span>от {r} ★</span>
          </div>
        ))}
      </div>

      <Separator />

      {/* STOCK */}
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={inStock}
          onCheckedChange={(v) => onInStockChange(Boolean(v))}
        />
        <span>В наличии</span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 pt-4">
        <Button onClick={applyFilters}>Применить</Button>
        <Button variant="outline" onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );

  if (variant === 'desktop') {
    return (
      <aside className="hidden lg:block w-64 shrink-0 bg-white border rounded-lg p-4 sticky top-24">
        <FilterContent />
      </aside>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="
          w-[90vw]
          max-w-[360px]
          px-4
          pt-6
          pb-24
          overflow-y-auto
          [padding-top:env(safe-area-inset-top)]
          [padding-bottom:env(safe-area-inset-bottom)]
        "
      >
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  );
}
