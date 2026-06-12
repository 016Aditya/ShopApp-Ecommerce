import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm bg-white py-24 text-center shadow-sm">
        <span className="text-6xl mb-4">🔍</span>
        <p className="text-lg font-semibold text-slate-600">No products found</p>
        <p className="mt-1 text-sm text-slate-400">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;