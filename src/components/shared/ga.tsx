"use client";
import Script from "next/script";

export function GA() {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!id) return null;
  return (
    <>
      <Script id="ga4-base" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
