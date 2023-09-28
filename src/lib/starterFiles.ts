import { File } from "../types/FileTypes";

export const fileSys: File[] = [
  {
    id: 1,
    title: "Welcome",
    date_created: new Date("03/20/23").toISOString(),
    last_modified: new Date("03/24/23").toISOString(),
    is_folder: false,
    content: "",
  },
  {
    id: 2,
    title: "About Me",
    date_created: new Date("03/20/23").toISOString(),
    last_modified: new Date("03/20/23").toISOString(),
    is_folder: false,
    content: "",
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
        date_created: new Date("04/09/23").toISOString(),
        last_modified: new Date("04/09/23").toISOString(),
        is_folder: false,
        content: "",
      },
      {
        id: 5,
        title: "Practical Recursion",
        date_created: new Date("03/21/23").toISOString(),
        last_modified: new Date("03/24/23").toISOString(),
        is_folder: false,
        content: "",
      },
      {
        id: 6,
        title: "Feature Overview",
        date_created: new Date("03/21/23").toISOString(),
        last_modified: new Date("03/22/23").toISOString(),
        is_folder: false,
        content: "",
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
            date_created: new Date("03/22/23").toISOString(),
            last_modified: new Date("03/22/23").toISOString(),
            is_folder: false,
            content: "",
          },
        ],
      },
    ],
  },
];
