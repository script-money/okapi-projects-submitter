import { keywordList } from "./config";
import { twitterScoreUrl } from "./constant";
import type { ProjectProps } from "./interface";

interface HotProjectsDataProps {
  data: {
    profile_name: string;
  }[];
}

async function searchWeeklyHotProjects(
  keywordsPreload: string[] | undefined = undefined
): Promise<string[]> {
  const finalList: string[] = [];
  let keywordList: string[] = [];

  if (keywordsPreload == undefined || keywordsPreload.length == 0) {
    const hotProjectsResponse = await fetch(twitterScoreUrl);
    const hotProjectsData =
      (await hotProjectsResponse.json()) as HotProjectsDataProps;
    keywordList = hotProjectsData.data.map(
      (project) => project.profile_name.split(" ")[0].split(".")[0]
    );
  } else {
    keywordList = keywordsPreload;
  }

  for (const keyword of keywordList) {
    const res = await fetch("https://app.okapi.xyz/api/project/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });
    const resJson = (await res.json()) as ProjectProps;
    if (resJson.payload.projects?.length == null) {
      console.log(keyword, "not found");
      finalList.push(keyword); // Push not found keywords to finalList
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return finalList;
}

const projects = await searchWeeklyHotProjects(keywordList);
console.log(projects);
