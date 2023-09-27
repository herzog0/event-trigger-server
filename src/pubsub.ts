import client from "./db";
import {DUPLICATE_OBJECT_ERROR_CODE, isPostgresError} from "./guards";
import {EventQueue, ListenerPayload} from "./types";

async function createNotifyChangeFunction() {
  await client.query(`
  CREATE OR REPLACE FUNCTION audit.notify_change() RETURNS trigger AS $$
DECLARE
    payload JSON;
BEGIN
    IF NEW.processed IS TRUE THEN
      RETURN NULL;
    END IF;
    
    -- Prepare the notification payload
    payload := json_build_object(
            'table', TG_TABLE_NAME,
            'data', NEW
        );

    -- Notify the channel with the payload
    PERFORM pg_notify('record_change', payload::text);

    -- Result is ignored since this is an AFTER trigger
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;`)
}

async function createNotifyChangeTrigger() {
  try {
    await client.query(`
      DROP TRIGGER IF EXISTS queue_updated ON audit.event_queue;
    `)
    await client.query(`
    CREATE TRIGGER queue_updated
      AFTER INSERT OR UPDATE OR DELETE ON audit.event_queue
      FOR EACH ROW EXECUTE FUNCTION audit.notify_change();
    `)
  } catch (e) {
    if (isPostgresError(e) && e.code === DUPLICATE_OBJECT_ERROR_CODE) {
      console.warn("Trigger already exists")
    } else {
      throw e
    }
  }
}

export async function setupEventQueueListener(cb: (e: ListenerPayload<EventQueue>) => Promise<void>) {
  await createNotifyChangeFunction()
  await createNotifyChangeTrigger()

  console.log("Subscribing to events")
  client.on('notification', async (message) => {

    const payload: ListenerPayload<EventQueue> = JSON.parse(message.payload!);
    await cb(payload);
  });

  console.log("Querying LISTEN statement")
  await client.query('LISTEN record_change');
}
