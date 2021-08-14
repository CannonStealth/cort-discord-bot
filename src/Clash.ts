import { ClashInterface, Awaited } from "./types";
import AbortController from "abort-controller";
import fetch from "node-fetch";

export default class Clash implements ClashInterface {
  public token: string;
  constructor(token: string) {
      this.token = token;
  }

  public async request(endpoint: string) { // request function to handler requests
    if (!this.token) throw new Error("No token was provided");
    const controller = new AbortController();

    setTimeout(() => {
      controller.abort();
    }, 1000);

    try {
      const response = await fetch(endpoint, {
        headers: {
          auth: this.token,
        },
        signal: controller.signal,
      });

      return response.json();
    } catch (err) {
      if (controller.signal.aborted)
        throw new Error("The client aborted a request");
      else throw new Error("Couldn't request\n" + err);
    }
  }
}
