export default {
  DELIVERY_URL: process.env.DELIVERY_URL ?? "",
  DB: {
    USER: process.env.DB_USER ?? "",
    HOST: process.env.DB_HOST ?? "",
    NAME: process.env.DB_NAME ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  }
}
