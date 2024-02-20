import { chromium, type Browser, type Page } from "playwright";
import { category, categoryMapping, chain } from "./constant";
import type { PageInfo, cmcBaseInfo, twitterBaseInfo } from "./interface";

async function fetchPageInfo(url: string): Promise<PageInfo> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(url);

    const detailDiv = await page.$(".detail");
    if (!detailDiv) throw new Error("找不到 class 为 'detail' 的 div。");

    const baseInfoDiv = await detailDiv.$("div:nth-child(1) .base_info");
    if (!baseInfoDiv) throw new Error("找不到 class 为 'base_info' 的 div。");

    const logoSrc = await baseInfoDiv.$eval("img.logo", (img) => img.src);
    const nameText = await baseInfoDiv.$eval(".name", (div) => div.innerText);
    const introduceTextSource = await baseInfoDiv.$eval(
      ".detail_intro",
      (div) => div.innerText
    );
    const introduceText = (introduceTextSource as string).replace(
      /\w\S*/g,
      (w) => w.replace(/^\w/, (c) => c.toUpperCase())
    );

    const detailIntroText = await baseInfoDiv.$eval(".introduce", (div) =>
      div.innerText.replace(/Details\n\n/g, "")
    ); // TODO max 1024 char

    const linksDiv = await detailDiv.$("div:nth-child(1) .links");
    if (!linksDiv) throw new Error("找不到 class 为 'links' 的 div。");

    const links = await linksDiv.$$eval("a", (links) =>
      links.map((link) => ({
        text: link.textContent?.trim(),
        href: link.href,
      }))
    );

    let officialLink = "";
    let twitterLink = "";
    let twitterLogoLink = "";
    let discordLink = "";
    let telegramLink = "";
    let cmcLink = "";
    let tokenContractAddress = "";
    let discordServerId = "";

    for (let i = 0; i < links.length; i++) {
      if (/^[^ "]+\.[^ "]+$/.test(links[i].text)) {
        officialLink = links[i].href;
      } else if (links[i].text === "X") {
        twitterLink = links[i].href;
      } else if (links[i].text === "Discord") {
        discordLink = links[i].href;
      } else if (links[i].text === "Telegram") {
        telegramLink = links[i].href;
      } else if (links[i].text === "CMC") {
        cmcLink = links[i].href;
      }
    }

    // side bar
    const sideBarDiv = await page.$(".side_bar_info");

    if (!sideBarDiv)
      throw new Error("找不到 class 为 'side_bar_info' 的 div。");

    // get tags
    let categories = "";
    let added = new Set<number>();
    const tags: string[] = await sideBarDiv.$$eval(
      "div:nth-child(2) a",
      (elements) => elements.map((e) => e.textContent.trim())
    );
    console.log(tags);
    if (tags.length == 0) {
      console.warn("无tags, 考虑手动添加，跳过");
    } else {
      let result = "";
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        if (categoryMapping[tag]) {
          tag = category[categoryMapping[tag]];
        } else {
          console.warn(`无法找到 ${tag} 的对应值，跳过`);
          continue;
        }
        const tagId = Object.keys(category).find(
          (key) => category[Number(key)] === tag
        );
        if (!added.has(Number(tagId))) {
          result += `${tagId}: "${tag}", `;
          console.log(`找到 ${result}`);
          added.add(Number(tagId));
        }
      }
      categories = result.trim();
    }

    // get twitter infomation
    let displayTwitterName = twitterLink.split("/")[3];
    console.log(displayTwitterName);

    // ecosystem
    let ecosystem = ""; // should be chain
    const ecosystemArray = await sideBarDiv.$$eval(
      "div:nth-child(1) a span:nth-child(1)",
      (elements) => elements.map((e) => e.textContent.trim())
    );
    if (ecosystemArray.length == 0) {
      console.warn("无ecosystem, 考虑手动添加，已添加other");
      ecosystem = '72: "Other"';
    } else {
      let result = "";
      for (let i = 0; i < ecosystemArray.length; i++) {
        let chainName = ecosystemArray[i];
        if (chainName === "BNB Chain") {
          chainName = "BSC";
        }
        if (chainName === "Bitcoin") {
          chainName = "BTC";
        }
        const chainId = Object.keys(chain).find(
          (key) => chain[Number(key)] === chainName
        );
        result += `${chainId}: "${chainName}", `;
      }
      ecosystem = result.trim();
    }

    // for twitter name changed
    // if (displayTwitterName == "xNFT_Backpack") {
    //   displayTwitterName = "Backpack";
    // }
    const apiUrl = `https://api.apidance.pro/graphql/UserByScreenName?variables={"screen_name":"${displayTwitterName}"}`;
    const options = {
      method: "GET",
      headers: {
        apikey: process.env.APIDANCE_KEY as string,
      },
    };
    const res = await fetch(apiUrl, options);
    const resJson = await res.json();
    twitterLogoLink = (resJson as twitterBaseInfo).data.user.result.legacy
      .profile_image_url_https;

    // get discord server id
    try {
      await page.goto(discordLink);
      const metaContent = await page.$eval(
        'meta[property="og:image"]',
        (element) => element.getAttribute("content")
      );
      discordServerId = metaContent.split("/")[4];
    } catch (error) {
      console.error("discord server id 获取失败, 跳过");
      discordServerId = "";
    }

    // get token address
    if (cmcLink != "") {
      const slug = cmcLink.split("/")[4];
      const cmcApi = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=${slug}`;
      const cmcOptions = {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_KEY as string,
        },
      };
      const cmcRes = await fetch(cmcApi, cmcOptions);
      const resJson = (await cmcRes.json()) as cmcBaseInfo;
      const keys = Object.keys(resJson.data);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const data = resJson.data[key];
        if (
          data == null ||
          data.platform == null ||
          data.platform.token_address == null
        ) {
          // TODO: failed parse CMC for https://www.rootdata.com/Projects/detail/Cardano?k=NTA%3D
          continue;
        }
        const tokenAddress = data.platform.token_address;
        const chain = data.platform.slug;
        const symbol = data.symbol;
        tokenContractAddress += `$${symbol}:${tokenAddress}:${chain}`;
      }
    } else {
      console.warn("无CMC和token, 跳过或手动添加");
    }

    return {
      logoSrc,
      nameText,
      detailIntroText,
      introduceText,
      officialLink,
      twitterLink,
      twitterLogoLink,
      discordLink,
      discordServerId,
      telegramLink,
      cmcLink,
      ecosystem,
      categories,
      tokenContractAddress,
      nftContractAddress: "",
      protocolContractAddresses: "",
    } as PageInfo;
  } catch (error) {
    console.error("出错了: ", error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

export { fetchPageInfo };
