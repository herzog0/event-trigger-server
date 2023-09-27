import axios from "axios"
import client from "../db";
import env from "../env"
import {EventPayload, EventQueue, ListenerPayload} from "../types";

export async function deliverToEndpoint(payload: ListenerPayload<EventQueue>) {
  console.log(`Delivering event ${payload.data.event_id} to configured endpoint`)

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

  const response = await axios.post(env.DELIVERY_URL, loggedActionData, {
    validateStatus: () => true
  })

  const ok = 200 <= response.status && response.status <= 299

  if (!ok) {
    throw new Error(JSON.stringify({
      status: response.statusText,
      code: response.status,
      data: response.data,
      eventId: payload.data.event_id
    }))
  }
}
