/** Next.js config for static export (App Router) */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  // Optional: generate folder-per-route HTML (useful on static hosts)
  trailingSlash: true
};

module.exports = nextConfig;
