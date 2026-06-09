import { useMemo, useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import PageLayout from "@/components/layout/PageLayout";
import ProductGrid from "@/features/products/components/ProductGrid";
import SearchBar from "@/features/products/components/SearchBar";

const mockProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "Premium sound quality with noise cancellation.",
    price: 4999,
    category: "Electronics",
    image: "",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Track health metrics and stay connected on the go.",
    price: 2999,
    category: "Wearables",
    image: "",
  },
  {
    id: 3,
    title: "Running Shoes",
    description: "Comfortable and lightweight shoes for daily training.",
    price: 1999,
    category: "Fashion",
    image: "",
  },
  {
    id: 4,
    title: "Backpack",
    description: "Durable everyday backpack with multiple compartments.",
    price: 1499,
    category: "Accessories",
    image: "",
  },
  {
    id: 5,
    title: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 2499,
    category: "Electronics",
    image: "",
  },
  {
    id: 6,
    title: "Laptop Sleeve",
    description: "Protective sleeve for laptops and tablets.",
    price: 899,
    category: "Accessories",
    image: "",
  },
];

function Shop() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return mockProducts;

    const keyword = searchTerm.toLowerCase();

    return mockProducts.filter((product) => {
      const title = (product.title || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      const description = (product.description || "").toLowerCase();

      return (
        title.includes(keyword) ||
        category.includes(keyword) ||
        description.includes(keyword)
      );
    });
  }, [searchTerm]);

  return (
    <PageLayout
      title="Shop"
      description="Search and browse all available products."
    >
      <div className="space-y-6">
        <SearchBar onSearch={setSearchTerm} />

        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            title="No products found"
            description={`No products matched "${searchTerm}". Try another keyword.`}
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        )}
      </div>
    </PageLayout>
  );
}

export default Shop;