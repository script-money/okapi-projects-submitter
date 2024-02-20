import type { ProjectJson, ResponseProps } from "./interface";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { exclude } from "./config";

(async () => {
  const dataPath = join(import.meta.dir, "..", "./data");
  const dataFiles = readdirSync(dataPath).filter(
    (file) => file.endsWith(".json") && !exclude.includes(file)
  );
  if (dataFiles.length === 0) {
    console.log("All projects submitted");
    return;
  }

  for (const file of dataFiles) {
    const rawData = readFileSync(join(dataPath, file), "utf-8");

    const projectData = JSON.parse(rawData);

    const project = {
      project_info: {
        chains: projectData.ecosystem
          .split(",")
          .map((e: string) => parseInt(e.split(":")[0]))
          .filter((chainId: number) => !isNaN(chainId)),
        categories: projectData.categories
          .split(",")
          .map((e: string) => parseInt(e.split(":")[0]))
          .filter((chainId: number) => !isNaN(chainId)),
        twitter: projectData.twitterLink,
        short_description: projectData.introduceText,
        long_description: projectData.detailIntroText,
        name: projectData.nameText,
        website_url: projectData.officialLink,
        logo_url: projectData.twitterLogoLink,
      },
      project_contracts: {
        NFT:
          projectData.nftContractAddress == ""
            ? []
            : projectData.nftContractAddress.split(";").map((e: string) => {
                const [address, chain] = e.split(":");
                return { address, chain };
              }),
        Token:
          projectData.tokenContractAddress == ""
            ? []
            : projectData.tokenContractAddress.split(";").map((e: string) => {
                const [name, address, chain] = e.split(":");
                return { name, address, chain };
              }),
        "System Contract Addresses":
          projectData.protocolContractAddresses == ""
            ? []
            : projectData.protocolContractAddresses
                .split(";")
                .map((e: string) => {
                  const [address, chain] = e.split(":");
                  return { address, chain };
                }),
      },
    } as ProjectJson;

    const response = await fetch(
      "https://app.okapi.xyz/api/project/create_user_project_info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(project),
      }
    );
    const json = (await response.json()) as ResponseProps;
    if (json.error_code != 0) {
      console.error(project.project_info.name, json.error_message);
    }
  }
})();
