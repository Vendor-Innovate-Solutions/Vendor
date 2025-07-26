import { useState, useEffect } from "react";
import { productService, categoryService } from "@/utils/icp-api";


export interface StockItem {
  productName: string;
  category: number;
  available: number;
  sold: number;
  demanded: number;
}

export interface CategoryItem {
  category_id: number;
  name: string;
  product_count: number;
  fill: string;
}

export const useStockData = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const companyId = localStorage.getItem("company_id");
        if (!companyId) {
          setError("No company selected");
          setLoading(false);
          return;
        }

        // Use ICP service to get products
        const products = await productService.getProductsByCompany(parseInt(companyId));
        console.log("Fetched stock data from ICP:", products);

        const formattedData = Array.isArray(products)
          ? products.map((item) => ({
              productName: item.name || "Unknown",
              category: item.categoryId || 0,
              available: item.quantity || 0,
              sold: 0, // TODO: Add sold quantity tracking to ICP backend
              demanded: 0, // TODO: Add demand tracking to ICP backend
            }))
          : [];

        setStockData((prevStockData) =>
          JSON.stringify(prevStockData) === JSON.stringify(formattedData)
            ? prevStockData
            : formattedData
        );

        setError(null);
      } catch (error) {
        console.error("Error fetching stock data from ICP:", error);
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData(); // Initial fetch
    const interval = setInterval(fetchStockData, 30000); // Polling every 30 sec (reduced frequency for ICP)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { stockData, loading, error };
};

export const useCategoryData = () => {
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Use ICP service to get categories
        const categories = await categoryService.getAllCategories();
        console.log("Fetched category data from ICP:", categories);

        const data = Array.isArray(categories) ? categories : [];

        const formattedData: CategoryItem[] = data.map(
          (category, index: number) => ({
            category_id: category.id,
            name: category.name,
            product_count: 0, // TODO: Add product count to category service
            fill: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AFF"][
              index % 5
            ],
          })
        );

        setCategoryData((prevCategoryData) =>
          JSON.stringify(prevCategoryData) === JSON.stringify(formattedData)
            ? prevCategoryData
            : formattedData
        );

        setError(null);
      } catch (error) {
        console.error("Error fetching category data from ICP:", error);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData(); // Initial fetch
    const interval = setInterval(fetchCategoryData, 30000); // Polling every 30 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { categoryData, loading, error };
};