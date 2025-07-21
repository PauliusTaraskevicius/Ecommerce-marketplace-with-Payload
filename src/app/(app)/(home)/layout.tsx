import { Category } from "@/payload-types";
import Footer from "./footer";
import Navbar from "./navbar";
import SearchFilters from "./search-filters";

import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // populate subcategories, subcategories[0] will be a type of category
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of depth 1 we are confident doc will be a type of category
      ...(doc as Category),
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
