import { ProductListView } from "@/modules/products/ui/components/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | undefined;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { category } = await params;

  const { maxPrice, minPrice, tags } = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      maxPrice,
      minPrice,
      tags,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
}
