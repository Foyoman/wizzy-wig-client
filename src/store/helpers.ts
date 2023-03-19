import { SortFunction, File } from "../types/FileTypes";

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
		[[], []] as [File[], File[]]
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
}

export const appendChild = (item: File, child: File) => {
	if (!item.isFolder) {
    throw new Error(`Item with id: ${item.id} is not a folder.`);
  }
	if (item.children) {
		item.children.push(child);
	} else {
		item.children = [child];
	}
}

export const findById = (
	items: File[],
	key: "append" | "update",
	needle: File,
	child?: File | null,
	updatedContent?: File["content"],
): any => {
	const append = key === "append";
	const update = key === "update";
	
	if (append && !needle && child) { 
		items.push(child);
		return items;
	}

	const helper = (
		item: File, 
		append: boolean, 
		update: boolean, 
		child?: File | null, 
		updatedContent?: File["content"],
	) => {
		if (append && child) {
			appendChild(item, child);
		} else if (update) {
			item.content = updatedContent;
			return items;
		} else {
			return item;
		}
	}

	for (const item of items) {
		console.log('item id:');
		console.log(item.id);
		console.log('needle id:');
		console.log(needle.id);
		if (item.id === needle.id) {
			return helper(item, append, update, child, updatedContent);
		}

		if (item.isFolder && item.children) {
			const foundItem = findById(item.children, key, needle, child, updatedContent);
			if (foundItem) {
				return helper(foundItem, append, update, child, updatedContent);
			}
		}
	} 
	
	return null;
}

// export const findById = (
// 	items: File[],
// 	child: File,
// 	parent?: File,
// ): File | null => {
// 	if (!parent) { 
// 		items.push(child);
// 	} else {
// 		for (const item of items) {
// 			if (item.id === parent.id) {
// 				appendChild(item, child);
// 			}
	
// 			if (item.isFolder && item.children) {
// 				const foundItem = appendById(item.children, child, parent);
// 				if (foundItem) {
// 					appendChild(foundItem, child);
// 				}
// 			}
// 		}
// 	}
// 	return null;
// }