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

const appendChild = (item: File, child: File) => {
  if (!item.is_folder) {
    throw new Error(`Item with id: ${item.id} is not a folder.`);
  }
  if (item.children) {
    item.children.push(child);
  } else {
    item.children = [child];
  }
};

export const findById = ({
  items,
  key,
  needle,
  child,
  updatedContent,
  updatedId,
}: {
  items: File[];
  key: "append" | "update" | "delete" | "find";
  needle: File["id"] | null;
  child?: File | null;
  updatedContent?: File["content"];
  updatedId?: File["id"];
}): any => {
  const append = key === "append";
  const update = key === "update";
  const destroy = key === "delete";
  const find = key === "find";

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
        if (updatedContent) {
          item.content = updatedContent;
        } else if (updatedId) {
          item.id = updatedId;
        }
        return items;
      } else {
        return item;
      }
    };

    if (item.id === needle) {
      if (find) return { ...item };
      helper(item);
    }

    if (item.is_folder && item.children) {
      const foundItem = findById({
        items: item.children,
        key: key,
        needle: needle,
        child: child,
        updatedContent: updatedContent,
        updatedId: updatedId,
      });
      if (foundItem) {
        if (find) return foundItem;
        helper(item);
      }
    }
  }
};

export const getFileDetails = (items: File[], id: File["id"] | null | undefined): File | null => {
  const fileDetails = findById({
    items: items,
    key: "find",
    needle: id,
  })

  if (fileDetails) {
    return fileDetails;
  } else {
    return null;
  }
}