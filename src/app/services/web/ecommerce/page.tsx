import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * eCommerce service page
 * Dynamically renders content from Sanity CMS
 */
export default function EcommercePage() {
  return (
    <DynamicPage 
      slug="services/web/ecommerce"
      fallbackTitle="eCommerce"
      fallbackDescription="Placeholder for eCommerce-løsninger. Her samler vi vores tilgang til shops, headless arkitektur, integrationer og vækstplaner for CLV."
    />
  );
}

export const revalidate = 60;
