import { File } from "../types/FileTypes";

export const fileSys: File[] = [
  {
    id: 1,
    title: "Welcome",
    content: "",
    date_created: new Date("03/20/23").toISOString(),
    last_modified: new Date("03/24/23").toISOString(),
    is_folder: false,
  },
  {
    id: 2,
    title: "About Me",
    content: "",
    date_created: new Date("03/20/23").toISOString(),
    last_modified: new Date("03/20/23").toISOString(),
    is_folder: false,
  },
  {
    id: 3,
    title: "Documentation",
    date_created: new Date("03/21/23").toISOString(),
    last_modified: new Date("03/21/23").toISOString(),
    is_folder: true,
    children: [
      {
        id: 4,
        title: "Bugs",
        content: "",
        date_created: new Date("04/09/23").toISOString(),
        last_modified: new Date("04/09/23").toISOString(),
        is_folder: false,
      },
      {
        id: 5,
        title: "Practical Recursion",
        content: "",
        date_created: new Date("03/21/23").toISOString(),
        last_modified: new Date("03/24/23").toISOString(),
        is_folder: false,
      },
      {
        id: 6,
        title: "Feature Overview",
        content: "",
        date_created: new Date("03/21/23").toISOString(),
        last_modified: new Date("03/22/23").toISOString(),
        is_folder: false,
      },
      {
        id: 7,
        title: "Features",
        date_created: new Date("03/21/23").toISOString(),
        last_modified: new Date("03/22/23").toISOString(),
        is_folder: true,
        children: [
          {
            id: 8,
            title: "Markdown Preview",
            content: "",
            date_created: new Date("03/22/23").toISOString(),
            last_modified: new Date("03/22/23").toISOString(),
            is_folder: false,
          },
        ],
      },
    ],
  },
];
