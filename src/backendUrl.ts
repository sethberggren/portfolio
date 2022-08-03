export default function backendUrl(url: keyof typeof apiRoutes) {
  return `http://localhost:8080${apiRoutes[url]}`;
}

const apiRoutes = {
  contact: "/contact",
  waves: "/waves",
  iceberg: "/iceberg",
} as const;
