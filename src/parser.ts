import { CATEGORIES } from "okapi-xyz-sdk";
import { projectQuery } from "rootdata";

import type { PageInfo, cmcBaseInfo, twitterBaseInfo } from "./interface";
import { categoryMapping } from "./constant";
import { CMCMapping } from "./config";

async function fetchPageInfo(project_id: number): Promise<PageInfo> {
  try {
    const project = await projectQuery({ project_id });
    if (!project) throw new Error(`找不到 ${project_id}`);

    const introduceText = (project.one_liner as string).replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );

    let officialLink = project.social_media.website;
    let twitterLink = project.social_media.X;
    let twitterLogoLink = "";
    let discordServerId = "";
    let categories = "";
    const tags = project.tags;

    if (tags.length === 0) {
      console.warn("No tags available, consider adding manually");
    } else {
      categories = tags
        .map((tag) => categoryMapping[tag] || tag)
        .filter((tag) => CATEGORIES[Number(tag)])
        .map((tag) => `${tag}: "${CATEGORIES[Number(tag)]}"`)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(", ");
    }

    // get twitter infomation
    if (twitterLink) {
      const displayTwitterName = twitterLink.split("/").pop();
      if (!process.env.APIDANCE_KEY) {
        throw new Error("APIDANCE_KEY not found");
      }
      const apiUrl = `https://api.apidance.pro/graphql/UserByScreenName?variables={"screen_name":"${displayTwitterName}"}`;
      const options = {
        method: "GET",
        headers: {
          apikey: process.env.APIDANCE_KEY,
        },
      };
      const res = await fetch(apiUrl, options);
      const resJson = (await res.json()) as twitterBaseInfo;
      twitterLogoLink = resJson.data.user.result.legacy.profile_image_url_https;
    }

    // get discord server id
    const discordLink = project.social_media.discord || "";
    if (discordLink && discordLink != "") {
      try {
        const response = await fetch(discordLink);
        const html = await response.text();
        const regex = /<meta property="og:image" content="([^"]+)"\/>/;
        const match = html.match(regex);
        if (match && match[1]) {
          discordServerId = match[1].split("/")[4];
        }
      } catch (error) {
        console.warn("Fetching Discord page failed", error);
      }
    }

    // get token address
    let tokenContractAddress = "";
    const tokenSymbol = project.token_symbol;
    if (!process.env.CMC_KEY) {
      throw new Error("CMC_KEY not found");
    }
    if (tokenSymbol && tokenSymbol != "") {
      const slug = CMCMapping[tokenSymbol.toLowerCase()];
      const cmcApi = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=${slug}`;
      const cmcOptions = {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_KEY,
        },
      };
      const cmcRes = await fetch(cmcApi, cmcOptions);
      let resJson = (await cmcRes.json()) as cmcBaseInfo;

      if (resJson.status.error_message == null && resJson.data) {
        tokenContractAddress = Object.values(resJson.data)
          .filter((data) => data?.platform?.token_address)
          .map(
            (data) =>
              `$${data.symbol}:${data.platform.token_address}:${data.platform.slug}`
          )
          .join(", ");
      }
    }

    return {
      nameText: project.project_name,
      detailIntroText: project.description,
      introduceText,
      officialLink,
      twitterLink,
      twitterLogoLink,
      discordLink,
      discordServerId,
      telegramLink: "",
      ecosystem: project.ecosystem || "",
      categories,
      tokenContractAddress,
      nftContractAddress: "",
      protocolContractAddresses: "",
    } as PageInfo;
  } catch (error) {
    console.error("出错了: ", error);
    throw error;
  }
}

export { fetchPageInfo };
