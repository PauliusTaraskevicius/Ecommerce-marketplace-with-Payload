import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/components/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | undefined;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const { maxPrice, minPrice, tags } = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      maxPrice,
      minPrice,
      tags,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
}
