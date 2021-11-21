import { Command } from "../../types";
import { MessageEmbed } from "discord.js";
// @ts-ignore
import { find } from "weather-js";

export default {
  name: "weather",
  description: "gives weather information of a location",
  category: "Information",
  usage: "<region>",
  example: "Dublin",

  run({ message, args, client: { toFahrenheit } }) {
    try {
      if (!args[0]) return message.channel.send("No region provided");
      let search = args.join(" ");
      find({ search, degreeType: "C" }, (err: unknown, result: any[]) => {
        if (err)
          return message.reply({
            content: "Couldn't find the weather information",
          });

        if (result) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Weather - ${result[0].location.name}`)
                .setColor("#ff2050")
                .addField(
                  "Temperature",
                  result[0].current.temperature
                    ? `${result[0].current.temperature
                        ?.toString()
                        .slice(0, 5)}°C (${toFahrenheit(
                        result[0].current.temperature
                      )
                        ?.toString()
                        .slice(0, 5)}°F)`
                    : "❓",
                  true
                )
                .addField("Sky", result[0].current.skytext || "❓", true)
                .addField("Humidity", result[0].current.humidity || "❓", true)
                .addField(
                  "Wind Speed",
                  result[0].current.windspeed || "❓",
                  true
                )
                .addField(
                  "Feels Like",
                  result[0].current.feelsLike
                    ? `${result[0].current.feelsLike
                        ?.toString()
                        .slice(0, 5)}°C (${toFahrenheit(
                        result[0].current.feelsLike
                      )
                        ?.toString()
                        .slice(0, 5)}°F)`
                    : "❓",
                  true
                )
                .addField(
                  "Wind Direction",
                  result[0].current.winddisplay || "❓",
                  true
                )
                .setThumbnail(result[0].current.imageUrl || "❓"),
            ],
          });
          return;
        }

        return message.reply({
          content: "Couldn't find the weather information",
        });
      });

      return;
    } catch {
      return message.reply({
        content: "Couldn't find the weather information",
      });
    }
  },
} as Command;
