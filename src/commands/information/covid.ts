import { Command } from "../../types";
import covid from "novelcovid";
import moment from "moment";
import { Message, MessageEmbed } from "discord.js";

export default {
  name: "covid",
  category: "Information",
  aliases: ["corona"],
  usage: "<country>",
  example: "UK",
  async run({ message, args }) {
    try {

      if (!args[0]) return message.channel.send("No country specified")
      const country = args.join(" ");

      const information = await getCovid(country);

      const embed = new MessageEmbed()
        .setColor("RED")
        .addField(
          "Cases:",
          information?.cases?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Deaths:",
          information?.deaths?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Tests:",
          information?.tests?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Recovered:",
          information?.recovered?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Active:",
          information?.active?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Critical:",
          information?.critical?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Today's Cases:",
          information?.todayCases?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Today's Deaths:",
          information?.todayDeaths?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Today's Recovered:",
          information?.todayRecovered?.toLocaleString() || "Cannot find",
          true
        )

        .addField(
          "Cases per 1 Million:",
          information?.casesPerOneMillion?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Deaths per 1 Million:",
          information?.deathsPerOneMillion?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Recovered per 1 Million:",
          information?.recoveredPerOneMillion?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Critical per 1 Million:",
          information?.criticalPerOneMillion?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Population:",
          information?.population?.toLocaleString() || "Cannot find",
          true
        )
        .addField(
          "Probability of dying:",
          information?.cases && information?.deaths ? ((information?.deaths * 100) / information?.cases).toLocaleString() +
            "%" : "Cannot find",
          true
        )
        .setFooter(`Updated in ${information.updated || "?"}`);

      if (!country)
        return message.reply({
          embeds: [embed.setAuthor("Covid General Information")],
        });
      else
        return message.reply({
          embeds: [
            embed.setAuthor(
              information.country + " General Information",
              information.countryInfo?.flag
            ),
          ],
        });
    } catch (e) {
      sendError(message);
      return
    }

    return
  },
} as Command;

declare module "novelcovid" {
  function all(
    opts?:
      | {
          allowNull: boolean;
        }
      | undefined
  ): Promise<any>;
}

async function getCovid(country: string | undefined | null) {
  try {
    let information;
    if (country)
      information = await covid.countries({
        country,
        allowNull: false,
        sort: "",
        strict: false,
      });
    else information = await covid.all();

    information.updated = moment(information.updated).format(
      "MMMM Do YYYY, HH:MM:ss"
    );

    return information;
  } catch (e) {
    throw new Error();
  }
}

function sendError(message: Message) {
  message.reply({
    content: "Couldn't find the country you are looking for",
  });
}