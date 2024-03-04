import { test } from "bun:test";

test("get dc serverId", async () => {
  let discordLink = "https://discord.gg/EuKrxxbQfX";
  let discordServerId = "";
  try {
    const response = await fetch(discordLink);
    const html = await response.text();
    const regex = /<meta property="og:image" content="([^"]+)"\/>/;
    const match = html.match(regex);
    console.log(match);
    if (match && match[1]) {
      discordServerId = match[1].split("/")[4];
    } else {
      console.log("No match found");
      return;
    }
  } catch (error) {
    console.error("Fetching Discord page failed", error);
  }
  console.log(discordServerId); // Moved outside of the fetch block to ensure it logs after the fetch is complete
});
