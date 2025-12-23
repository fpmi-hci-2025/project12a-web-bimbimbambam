import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductDetailsDTO } from '../types/api';

interface ComparePageProps {
  products: ProductDetailsDTO[];
  onRemove: (id: number) => void;
  onProductClick?: (id: number) => void;
}

export function ComparePage({
  products,
  onRemove,
  onProductClick,
}: ComparePageProps) {
  const navigate = useNavigate();

  /* ---------------------------------------------
     EMPTY STATE
  --------------------------------------------- */
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>

        <div className="text-center py-12">
          <h2 className="mb-4 text-xl font-semibold">
            Список сравнения пуст
          </h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары для сравнения их характеристик
          </p>
          <Button onClick={() => navigate('/')}>
            Перейти к каталогу
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     COLLECT ATTRIBUTES
  --------------------------------------------- */
  const allAttributes = Array.from(
    new Set(
      products.flatMap(
        (p) => p.attributes?.map((a) => a.name) ?? []
      )
    )
  );

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </Button>

      <h1 className="mb-6 text-2xl font-semibold">
        Сравнение товаров
      </h1>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {/* Attribute column */}
                  <th className="px-6 py-4 text-left bg-gray-50 sticky left-0 z-10 min-w-[220px]">
                    Характеристика
                  </th>

                  {/* Product headers */}
                  {products.map((product) => (
                    <th
                      key={product.id}
                      className="px-6 py-4 min-w-[260px] text-left align-top"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Image */}
                        <div className="relative h-[220px] w-full bg-gray-100 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() =>
                              onProductClick
                                ? onProductClick(product.id)
                                : navigate(`/product/${product.id}`)
                            }
                          />

                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={() => onRemove(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col min-h-[90px]">
                          <p className="text-sm text-gray-500">
                            {product.brandName}
                          </p>
                          <p className="font-medium line-clamp-2">
                            {product.title}
                          </p>
                          <p className="text-primary mt-auto">
                            {product.price.toLocaleString()} BYN
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Attributes */}
                {allAttributes.map((attrName, index) => (
                  <tr
                    key={attrName}
                    className={index % 2 === 0 ? 'bg-gray-50' : ''}
                  >
                    <td className="px-6 py-4 text-gray-600 sticky left-0 z-10 bg-inherit border-r">
                      {attrName}
                    </td>

                    {products.map((product) => {
                      const attr = product.attributes?.find(
                        (a) => a.name === attrName
                      );

                      return (
                        <td
                          key={product.id}
                          className="px-6 py-4"
                        >
                          {attr?.value ?? '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Rating */}
                <tr className="border-t-2">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white border-r text-gray-600">
                    Рейтинг
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.id}
                      className="px-6 py-4"
                    >
                      ⭐{' '}
                      {product.averageRating?.toFixed(1) ??
                        '—'}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr>
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white border-r text-gray-600">
                    Описание
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.id}
                      className="px-6 py-4 text-sm"
                    >
                      {product.description || '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hint */}
      {products.length < 4 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Вы можете добавить ещё{' '}
            {4 - products.length} товар(ов) для сравнения
          </p>
        </div>
      )}
    </div>
  );
}
