export default function Head() {
  return (
    <>
      {/* Warm Sanity CDN to reduce first-image latency */}
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      {/* Hint image formats the app prefers */}
      <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
    </>
  );
}

