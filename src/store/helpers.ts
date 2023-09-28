import { SortFunction, File } from "../types/FileTypes";

export const sortFileSystem: SortFunction = (fileSystem, sortKey, reverse) => {
  const [folders, files] = fileSystem.reduce(
    (acc, item) => {
      if (item.is_folder) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }
      return acc;
    },
    [[], []] as [File[], File[]]
  );

  const sortedFolders = folders
    .map((folder) => {
      const sortedChildren = sortFileSystem(
        folder.children || [],
        sortKey,
        reverse
      );
      return { ...folder, children: sortedChildren };
    })
    .sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      } else {
        const dateA = a[sortKey];
        const dateB = b[sortKey];
        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
      }
    });

  let sortedFiles: File[];
  if (sortKey === "title") {
    sortedFiles = files.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    sortedFiles = files.sort((a, b) => {
      const dateA = a[sortKey];
      const dateB = b[sortKey];
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    });
  }

  if (reverse) {
    return [...sortedFolders.reverse(), ...sortedFiles.reverse()];
  } else {
    return [...sortedFolders, ...sortedFiles];
  }
};

export const appendChild = (item: File, child: File) => {
  if (!item.is_folder) {
    throw new Error(`Item with id: ${item.id} is not a folder.`);
  }
  if (item.children) {
    item.children.push(child);
  } else {
    item.children = [child];
  }
};

export const findById = (
  items: File[],
  key: "append" | "update" | "delete",
  needle: File,
  child?: File | null,
  updatedContent?: File["content"],
  emit?: boolean
): any => {
  const append = key === "append";
  const update = key === "update";
  const destroy = key === "delete";

  if (append && !needle && child) {
    items.push(child);
    return items;
  }

  for (const item of items) {
    if (!item) {
      console.log("item not found");
      return;
    }

    const helper = (item: File) => {
      if (destroy) {
        const itemIndex = items.indexOf(item);
        items.splice(itemIndex, 1);
      } else if (append && child) {
        appendChild(item, child);
      } else if (update) {
        item.content = updatedContent;
        return items;
      } else {
        return item;
      }
    };

    if (item.id === needle.id) {
      helper(item);
    }

    if (item.is_folder && item.children) {
      const foundItem = findById(
        item.children,
        key,
        needle,
        child,
        updatedContent
      );
      if (foundItem) {
        helper(item);
      }
    }
  }

  if (emit) return items;
};
