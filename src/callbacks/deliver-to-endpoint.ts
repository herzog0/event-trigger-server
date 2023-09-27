import {eventProcessor} from "../event-processor";
import {deliverToEndpoint} from "../handlers/deliver-to-endpoint";
import {EventQueue, ListenerPayload} from "../types";

export const deliverToEndpointCallback = async (e: ListenerPayload<EventQueue>) => {
  try {
    await eventProcessor(e, deliverToEndpoint)
  } catch (e) {
    console.error(e)
  }
}
