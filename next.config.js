/** @type {import('next').NextConfig} */
const nextConfig = {
  // 如果你有用到外部圖片（如 Unsplash），建議加上這個設定，否則圖片會跑不出來
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;