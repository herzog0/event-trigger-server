// event_id          bigserial primary key,
// schema_name       text                     not null,
// table_name        text                     not null,
// relid             oid                      not null,
// session_user_name text,
// action_tstamp_tx  TIMESTAMP WITH TIME ZONE NOT NULL,
// action_tstamp_stm TIMESTAMP WITH TIME ZONE NOT NULL,
// action_tstamp_clk TIMESTAMP WITH TIME ZONE NOT NULL,
// transaction_id    bigint,
// application_name  text,
// client_addr       inet,
// client_port       integer,
// client_query      text,
// action            TEXT                     NOT NULL CHECK (action IN ('I', 'D', 'U', 'T')),
// row_data          jsonb,
// changed_fields    jsonb,
// statement_only    boolean                  not null,
// processed         boolean                  not null default false,
// attempts          integer                  not null default 0,
// processed_at      TIMESTAMP(3)

export type ListenerPayload<T> = {
  table: string
  data: T
}

export type EventQueue = {
  created_at: string
  event_id: number
  processed: boolean
  attempts: boolean
  processed_at: string | null
}

export type EventPayload = {
  table_name: string
  event_id: number
  action: "I" | "U" | "D" | "T"
  row_data: Record<string, any> | null
  changed_fields: Partial<Record<string, any>> | null
}

export type LoggedAction = {
  event_id: number
  schema_name: string
  table_name: string
  action: string
  action_tstamp_tx: string
  row_data: any
  changed_fields: any
  processed: boolean
  attempts: number
  processed_at: string | null
}
