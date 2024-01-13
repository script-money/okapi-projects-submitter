import readline from "readline";
import { fetchPageInfo } from "./parser";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async () => {
  const url = await new Promise((resolve) => {
    rl.question("请输入一个链接: ", (url) => {
      resolve(url);
    });
  });
  const pageInfo = await fetchPageInfo(url as string);
  console.log(pageInfo);
  // TODO: save json to file, name use pageInfo.nameText
  await Bun.write(`data/${pageInfo.nameText}.json`, JSON.stringify(pageInfo));

  rl.close();
};

askQuestion();
