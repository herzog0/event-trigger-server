import client from "./db";
import {EventQueue, ListenerPayload} from "./types";

async function getNextUnprocessedEvent() {
  const result = await client.query(`
      UPDATE audit.event_queue
      SET attempts = attempts + 1
      WHERE event_id = (SELECT event_id
                        FROM audit.event_queue
                        WHERE processed = false
                        ORDER BY event_id
                            FOR UPDATE SKIP LOCKED
                        LIMIT 1)
      RETURNING *;
  `)

  const event: EventQueue | null = result.rows[0] ?? null

  if (event) {
    console.log(`Found unprocessed event ${event.event_id}`)
  } else {
    console.log(`Found no unprocessed events`)
  }

  return event
}

export async function initialize(cb: (e: ListenerPayload<EventQueue>) => Promise<void>) {
  let event = await getNextUnprocessedEvent()
  while (event) {
    await cb({
      table: "unprocessed_events",
      data: event
    })
    event = await getNextUnprocessedEvent()
  }
}
