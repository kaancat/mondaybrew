import localFont from "next/font/local";

export const heywow = localFont({
  src: [
    { path: "../public/fonts/heywow/HeyWowLight.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowBook.ttf", weight: "350", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowRegular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowMedium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowSemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowBold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/heywow/HeyWowHeavy.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const sailec = localFont({
  src: [
    { path: "../public/fonts/sailec/Sailec Thin.ttf", weight: "200", style: "normal" },
    { path: "../public/fonts/sailec/Sailec Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/sailec/Sailec Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/sailec/Sailec Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/sailec/Sailec Regular Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

