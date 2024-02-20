import { keywordList } from "./config";
import type { ProjectProps } from "./interface";

let finalList: string[] = [];

(async () => {
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
      console.log(resJson.payload.projects[0].name, " found");
    } else {
      finalList.push(keyword);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
})();
