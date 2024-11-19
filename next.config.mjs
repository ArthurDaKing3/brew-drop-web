// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: [
//     "antd",
//     "rc-util",
//     "@babel/runtime",
//     "@ant-design/icons",
//     "@ant-design/icons-svg",
//     "rc-pagination",
//     "rc-picker",
//     "rc-tree",
//     "rc-table",
//   ],
// };

// export default nextConfig;

import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "rc-util",
    "@babel/runtime",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ]
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);

