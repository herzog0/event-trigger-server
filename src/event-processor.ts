import client from "./db";
import {EventQueue, ListenerPayload} from "./types";

async function tagEventAsProcessed(args: { eventId: number }) {
  await client.query(`
      UPDATE audit.event_queue
      SET processed= TRUE,
          processed_at=NOW(),
          attempts=attempts + 1
      WHERE event_id = ${args.eventId};
  `)
}

async function getEventData({eventId}: { eventId: number }) {
  const result = await client.query(`
      UPDATE audit.event_queue
      SET attempts    = attempts + 1,
          retry_after = now() + ((attempts + 1)::TEXT || ' minutes')::INTERVAL
      WHERE event_id = (SELECT event_id
                        FROM audit.event_queue
                        WHERE processed = false
                          AND (retry_after IS NULL OR retry_after < now())
                          AND event_id = ${eventId}
                            FOR UPDATE SKIP LOCKED
                        )
      RETURNING *;
  `)

  const event: EventQueue | null = result.rows[0] ?? null

  return event
}

export async function eventProcessor(payload: ListenerPayload<EventQueue>, cb: (e: ListenerPayload<EventQueue>) => Promise<void>) {
  const eventData = await getEventData({eventId: payload.data.event_id})
  if (!eventData) {
    console.log(`Not processing event ${payload.data.event_id} taken by concurrent instances. `)
    return
  }
  console.log(`Processing event ${payload.data.event_id} from table ${payload.table}`)
  await cb({
    table: payload.table,
    data: eventData
  })
  await tagEventAsProcessed({eventId: payload.data.event_id})
}
