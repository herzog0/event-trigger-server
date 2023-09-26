export type PostgresError = {
  code: string
}

export const DUPLICATE_OBJECT_ERROR_CODE = "42710"

export const isPostgresError = (e: unknown): e is PostgresError => {
  return e != null && typeof e === "object" && "code" in e && e.code != null && typeof e.code === "string"
}
