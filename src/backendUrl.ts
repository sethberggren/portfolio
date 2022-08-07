export default function backendUrl(url: keyof typeof apiRoutes) {
  return `https://api.iceberggren.com${apiRoutes[url]}`;
}

const apiRoutes = {
  contact: "/contact",
  waves: "/waves",
  iceberg: "/iceberg",
} as const;
