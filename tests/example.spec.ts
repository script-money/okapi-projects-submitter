import { expect, test } from "@playwright/test";
import { fetchPageInfo } from "../src/parser";

test("get first rootdata link", async ({ page }) => {
  // const shouldBeData = {
  //   Name: "Nine Chronicles",
  //   Website: "https://nine-chronicles.com/",
  //   "Twitter Handle (optional)": "https://twitter.com/NineChronicles",
  //   "Discord (optional)": "https://discord.com/invite/planetarium",
  //   "Telegram (optional)": "",
  //   "CoinMarketCap (optional)":
  //     "https://coinmarketcap.com/currencies/wrapped-ncg/",
  //   "Short Description (128 chars)": "A Decentralized Fantasy World",
  //   "Long Description (1024 chars)":
  //     "Nine Chronicles is a decentralized RPG, set in a vast fantasy world powered by groundbreaking technology. It gives players the freedom to explore, craft, mine, or govern in a uniquely moddable, open-source adventure. Conquer dangerous dungeons to gather rare resources for trading; specialize in crafting the finest equipment; or pass legislation with the support of other players to inhabit this realm.",
  //   Category: '3: "GameFi",',
  //   Chains: '2: "BSC", 4: "Polygon",',
  //   "Token Contract Address":
  //     "$WNCG: 0xf203ca1769ca8e9e8fe1da9d147db68b6c919817:ethereum",
  //   "NFT Contract Address": "",
  //   "Community: NFT Contract Address":
  //     "DCC: 0xCEa65a86195c911912CE48B6636ddd365C208130:ethereum",
  //   "User: Contract Address Website": "",
  //   "Protocol Contract Addresses": "",
  //   LogoUrl:
  //     "https://pbs.twimg.com/profile_images/1717412881497788416/27KiOFG__400x400.jpg",
  //   "Discord Server ID": 539405872346955788,
  // };

  const shouldBeData = {
    nameText: "Nine Chronicles",
    officialLink: "https://nine-chronicles.com/",
    twitterLink: "https://twitter.com/NineChronicles",
    discordLink: "https://discord.com/invite/planetarium",
    telegramLink: "",
    cmcLink: "https://coinmarketcap.com/currencies/wrapped-ncg/",
    introduceText: "A Decentralized Fantasy World",
    detailIntroText:
      "Nine Chronicles is a decentralized RPG, set in a vast fantasy world powered by groundbreaking technology. It gives players the freedom to explore, craft, mine, or govern in a uniquely moddable, open-source adventure. Conquer dangerous dungeons to gather rare resources for trading; specialize in crafting the finest equipment; or pass legislation with the support of other players to inhabit this realm.",
    tag: '3: "GameFi",',
    ecosystem: '2: "BSC", 4: "Polygon",',
    tokenContractAddress:
      "$WNCG: 0xf203ca1769ca8e9e8fe1da9d147db68b6c919817:ethereum; $WNCG: 0x52242cbAb41e290E9E17CCC50Cc437bB60020a9d:bnb",
    nftContractAddress: "",
    communityNftContractAddress:
      "DCC: 0xCEa65a86195c911912CE48B6636ddd365C208130:ethereum",
    userContractAddressWebsite: "",
    protocolContractAddresses: "",
    logoSrc:
      "https://pbs.twimg.com/profile_images/1717412881497788416/27KiOFG__400x400.jpg",
    discordServerId: "539405872346955788",
  };

  const url =
    "https://www.rootdata.com/Projects/detail/Seedworld?k=OTE0Mg%3D%3D";
  const pageInfo = await fetchPageInfo(url);
  console.log(pageInfo);
  expect(pageInfo.logoSrc).toBeDefined();
  expect(pageInfo.nameText).toBeDefined();
  expect(pageInfo.detailIntroText).toBeDefined();
  expect(pageInfo.introduceText).toBeDefined();
  expect(pageInfo.officialLink).toBeDefined();
  expect(pageInfo.twitterLink).toBeDefined();
  expect(pageInfo.twitterLogoLink).toBeDefined();
  expect(pageInfo.discordLink).toBeDefined();
  expect(pageInfo.telegramLink).toBeDefined();
  expect(pageInfo.cmcLink).toBeDefined();
  expect(pageInfo.ecosystem).toBeDefined();
});
