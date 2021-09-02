import { Command } from "../types"
import tiktok from "tiktok-scraper";

export default {
    name: "say",
    aliases: ["talk"],
    async run({ args: [acc], message: { channel: { send }} }) {
        
    }
} as Command