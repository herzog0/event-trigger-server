import {deliverToEndpointCallback} from "./callbacks/deliver-to-endpoint";
import client from "./db";
import "./health"
import {setupEventQueueListener} from "./pubsub";
import {initialize} from "./startup";


async function main() {
  await client.connect()
  await initialize(deliverToEndpointCallback)
  await setupEventQueueListener(deliverToEndpointCallback)
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

