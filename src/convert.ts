import * as fs from "fs";
import * as path from "path";
import { parse } from "json2csv";

const getJsonFiles = (jsonPath: string): string[] => {
  let jsonFiles: string[] = [];
  const files = fs.readdirSync(jsonPath);
  files.forEach((item) => {
    console.log(item);

    const fPath = path.join(jsonPath, item);
    const stat = fs.statSync(fPath);
    if (stat.isDirectory() === true) {
      jsonFiles = jsonFiles.concat(getJsonFiles(fPath));
    } else if (path.extname(fPath) === ".json") {
      jsonFiles.push(fPath);
    }
  });
  return jsonFiles;
};

const readJsonFiles = (jsonFiles: string[]): any[] => {
  const jsonData: any[] = [];
  jsonFiles.forEach((jsonFile) => {
    const data = fs.readFileSync(jsonFile, "utf-8");
    const json = JSON.parse(data);
    const transformedData = {
      nameText: json.nameText,
      ProjectID: "",
      officialLink: json.officialLink,
      twitterLink: json.twitterLink,
      discordLink: json.discordLink,
      telegramLink: json.telegramLink,
      cmcLink: json.cmcLink,
      introduceText: json.introduceText, // TODO: every word should be UpperCase first
      detailIntroText: json.detailIntroText,
      categories: json.categories,
      ecosystem: json.ecosystem,
      tokenContractAddress: json.tokenContractAddress,
      nftContractAddress: json.nftContractAddress,
      communityNftContractAddress: json.communityNftContractAddress,
      contractAddressWebsite: "",
      protocolContractAddresses: "",
      twitterLogoLink: json.twitterLogoLink.replace("_normal", "_400x400"),
      discordServerId: json.discordServerId,
    };
    jsonData.push(transformedData);
  });
  return jsonData;
};

const jsonToCsv = (jsonData: any[], csvFilePath: string) => {
  const csv = parse(jsonData);
  fs.writeFileSync(csvFilePath, csv);
};

const jsonPath = "./data";
const date = new Date();
const dateString = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;
const csvFilePath = `./final/${dateString}.csv`;
const jsonFiles = getJsonFiles(jsonPath);
const jsonData = readJsonFiles(jsonFiles);
jsonToCsv(jsonData, csvFilePath);
