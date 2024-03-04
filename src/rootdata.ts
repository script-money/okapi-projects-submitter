import { search } from "rootdata";

import { keywordList } from "./config";
import { fetchPageInfo } from "./parser";

if (keywordList.length == 0) {
  console.warn("No keywords found, use search.ts or config.ts to add keywords");
  process.exit(1);
}

for (const keyword of keywordList) {
  const projects = await search(keyword);
  if (projects && projects.length > 0) {
    const project_id = projects[0].id;
    console.log(`Fetching ${projects[0].name}...`);
    const pageInfo = await fetchPageInfo(project_id);
    await Bun.write(`data/${pageInfo.nameText}.json`, JSON.stringify(pageInfo));
  }
}
