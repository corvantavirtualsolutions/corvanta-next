import type { Metadata } from "next";
import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "E-commerce Support | Corvanta Virtual Solutions",
  description:
    "From order processing to inventory updates, e-commerce VAs handle your marketplace operations so you can focus on growing your brand.",
};

export default function EcommerceSupportPage() {
  return (
    <ServicePageLayout
      title="E-commerce Support"
      headline="Keep your store running at full speed"
      lead="From order processing to inventory updates, e-commerce VAs handle your marketplace operations so you can focus on growing your brand."
      color="#EA580C"
      bg="rgba(234,88,12,0.10)"
      includes={[
        {
          title: "Order Processing & Tracking",
          body: "Process orders, update customers, and manage fulfilment from click to delivery.",
        },
        {
          title: "Product Listing Creation",
          body: "Write titles, descriptions, and bullet points optimised for search and conversion.",
        },
        {
          title: "Inventory Management",
          body: "Track stock levels, flag low inventory, and coordinate restock with suppliers.",
        },
        {
          title: "Marketplace Account Management",
          body: "Manage your Amazon, eBay, Etsy, or Shopify accounts daily.",
        },
        {
          title: "Returns & Refund Handling",
          body: "Process returns efficiently and turn a negative experience into a loyal customer.",
        },
        {
          title: "Supplier Coordination",
          body: "Communicate with suppliers, chase purchase orders, and manage lead times.",
        },
      ]}
      whoFor={[
        "Amazon & eBay Sellers",
        "Shopify Store Owners",
        "Direct-to-Consumer Brands",
        "Wholesale Businesses",
      ]}
      ctaEyebrow="RUN YOUR STORE SMARTER"
      ctaHeadline="Scale your store without scaling your stress."
      ctaSubtext="An e-commerce VA keeps your listings, orders, and inventory running so you can focus on growth."
    />
  );
}
