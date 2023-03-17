import { SortFunction, FsFile } from "../types/FsTypes";

export const sortFileSystem: SortFunction = (fileSystem, sortKey, reverse) => {
	const [folders, files] = fileSystem.reduce(
		(acc, item) => {
			if (item.isFolder) {
				acc[0].push(item);
			} else {
				acc[1].push(item);
			}
			return acc;
		},
		[[], []] as [FsFile[], FsFile[]]
	);

	const sortedFolders = folders
		.map((folder) => {
			const sortedChildren = sortFileSystem(folder.children || [], sortKey, reverse);
			return { ...folder, children: sortedChildren };
		})
		.sort((a, b) => { 
			if (sortKey === "title") {
				return a.title.localeCompare(b.title)
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
	
	let sortedFiles: FsFile[];
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
}

export const appendChild = (item: FsFile, child: FsFile) => {
	if (!item.isFolder) {
    throw new Error(`Item with id: ${item.id} is not a folder.`);
  }
	if (item.children) {
		item.children.push(child);
	} else {
		item.children = [child];
	}
}

export const appendById = (
	items: FsFile[],
	child: FsFile,
	parent?: FsFile,
): FsFile | null => {
	if (!parent) { 
		items.push(child);
	} else {
		for (const item of items) {
			if (item.id === parent.id) {
				appendChild(item, child);
			}
	
			if (item.isFolder && item.children) {
				const foundItem = appendById(item.children, child, parent);
				if (foundItem) {
					appendChild(foundItem, child);
				}
			}
		}
	}
	return null;
}