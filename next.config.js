/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com', 'images.pexel.com'],
  },
}

module.exports = nextConfig
