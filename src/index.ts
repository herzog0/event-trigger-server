import client from "./db";
import {eventProcessor} from "./event-processor";
import "./health"
import {postEventToSqs} from "./post-event-to-sqs";
import {setupEventQueueListener} from "./pubsub";
import {initialize} from "./startup";
import {EventQueue, ListenerPayload} from "./types";

const callback = async (e: ListenerPayload<EventQueue>) => {
  try {
    await eventProcessor(e, postEventToSqs)
  } catch (e) {
    console.error(e)
  }
}

async function main() {
  await client.connect()
  await initialize(callback)
  await setupEventQueueListener(callback)
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

