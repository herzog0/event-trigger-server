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

export async function eventProcessor(payload: ListenerPayload<EventQueue>, cb: (e: ListenerPayload<EventQueue>) => Promise<void>) {
  console.log(`Processing event ${payload.data.event_id} from table ${payload.data.processed}`)
  await cb(payload)
  await tagEventAsProcessed({eventId: payload.data.event_id})
}
