import client from "./db";
import env from "./env"
import {EventPayload, EventQueue, ListenerPayload} from "./types";

export async function postEventToSqs(payload: ListenerPayload<EventQueue>) {
  console.log(`Posting event ${payload.data.event_id} into SQS`)

  const result = await client.query(`
      select event_id, action, row_data, changed_fields, table_name
      from audit.logged_actions
      where event_id = ${payload.data.event_id};
  `)

  const loggedActionData: EventPayload | null = result.rows[0] ?? null

  if (!loggedActionData) {
    console.error(`Could not find the corresponding logged action of event_id ${payload.data.event_id}`)
    return
  }

  const response = await fetch(env.DELIVERY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loggedActionData),
  })

  if (!response.ok) {
    throw new Error(JSON.stringify({
      status: response.statusText,
      code: response.status,
      error: response.body,
      eventId: payload.data.event_id
    }))
  }
}
