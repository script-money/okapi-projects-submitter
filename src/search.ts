import { twitterScoreUrl } from "./constant";
import type { ProjectProps } from "./interface";

interface HotProjectsDataProps {
  data: {
    profile_name: string;
  }[];
}

let keywordList: string[] = [];
let finalList: string[] = [];

(async () => {
  const hotProjects = await fetch(twitterScoreUrl, {
    method: "GET",
  });

  const hotProjectsData = (await hotProjects.json()) as HotProjectsDataProps;
  for (const project of hotProjectsData.data) {
    keywordList.push(project.profile_name.split(" ")[0]);
  }
  console.log(keywordList);

  keywordList.forEach(async (keyword) => {
    const res = await fetch("https://app.okapi.xyz/api/project/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword,
      }),
    });

    const resJson = (await res.json()) as ProjectProps;

    if (resJson.payload.projects?.length != null) {
      // console.log(resJson.payload.projects[0].name, " found");
    } else {
      console.log(keyword, "not found");
      finalList.push(keyword);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
})();
