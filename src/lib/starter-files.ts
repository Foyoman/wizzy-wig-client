import { File } from "../types/FileTypes";

export const fileSys: File[] = [
  {
    id: "welcome",
    title: "Welcome",
    dateCreated: new Date("03/20/23").toISOString(),
    lastUpdated: new Date("03/24/23").toISOString(),
    isFolder: false,
    content: "",
  },
  {
    id: "aboutme",
    title: "About Me",
    dateCreated: new Date("03/20/23").toISOString(),
    lastUpdated: new Date("03/20/23").toISOString(),
    isFolder: false,
    content: "",
  },
  {
    id: "documentation",
    title: "Documentation",
    dateCreated: new Date("03/21/23").toISOString(),
    lastUpdated: new Date("03/21/23").toISOString(),
    isFolder: true,
    children: [
      {
        id: "bugs",
        title: "Bugs",
        dateCreated: new Date("04/09/23").toISOString(),
        lastUpdated: new Date("04/09/23").toISOString(),
        isFolder: false,
        content: "",
      },
      {
        id: "practical-recursion",
        title: "Practical Recursion",
        dateCreated: new Date("03/21/23").toISOString(),
        lastUpdated: new Date("03/24/23").toISOString(),
        isFolder: false,
        content: "",
      },
      {
        id: "feature-overview",
        title: "Feature Overview",
        dateCreated: new Date("03/21/23").toISOString(),
        lastUpdated: new Date("03/22/23").toISOString(),
        isFolder: false,
        content: "",
      },
      {
        id: "features",
        title: "Features",
        dateCreated: new Date("03/21/23").toISOString(),
        lastUpdated: new Date("03/22/23").toISOString(),
        isFolder: true,
        children: [
          {
            id: "md-preview",
            title: "Markdown Preview",
            dateCreated: new Date("03/22/23").toISOString(),
            lastUpdated: new Date("03/22/23").toISOString(),
            isFolder: false,
            content: "",
          },
        ],
      },
    ],
  },
];
