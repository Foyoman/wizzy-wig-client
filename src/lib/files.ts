import { File } from "../types/FileTypes";

export const fileSys: File[] = [
	{
		id: 'welcome',
		title: 'Welcome',
		dateCreated: new Date('03/20/23'),
		lastUpdated: new Date('03/20/23'),
		isFolder: false,
		content: ''
	},
	{
		id: 'aboutme',
		title: 'About Me',
		dateCreated: new Date('03/20/23'),
		lastUpdated: new Date('03/20/23'),
		isFolder: false,
		content: ''
	},
	{
		id: 'directory',
		title: 'Directory',
		dateCreated: new Date('03/20/23'),
		lastUpdated: new Date('03/20/23'),
		isFolder: true,
		children: [
			{
				id: 'practical-recursion-map',
				title: 'Practical recursion: mapping components',
				dateCreated: new Date('03/20/23'),
				lastUpdated: new Date('03/20/23'),
				isFolder: false,
				content: ''
			},
			{
				id: 'subdirectory',
				title: 'Subdirectory',
				dateCreated: new Date('03/20/23'),
				lastUpdated: new Date('03/20/23'),
				isFolder: true,
				children: [
					{
						id: 'practical-recursion-sort',
						title: 'Practical recursion: sorting files',
						dateCreated: new Date('03/20/23'),
						lastUpdated: new Date('03/20/23'),
						isFolder: false,
						content: ''
					}
				]
			}
		]
	}
]

// async function getFileContents(filePath: string) {
//   const response = await fetch(filePath);
//   const fileContents = await response.text();
//   return fileContents;
// }

// const populateFiles = async (files: File[] = fileSys) => {
// 	for (let file of files) {
// 		if (!file.isFolder) {
// 			const filePath = `localhost:3000/files/${file.id}.md`
// 			const content = await getFileContents(filePath);
// 			file.content = content;
// 		} else if (file.isFolder && file.children) {
// 			await populateFiles(file.children);
// 		}
// 	}

// 	return files;
// };