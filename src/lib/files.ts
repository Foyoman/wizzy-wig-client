import { File } from "../types/FileTypes";
import { findById } from "../store/helpers";

let fileSys: File[] = [
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

// const populateFiles = async (files: File[] = fileSys) => {
// 	for (let file of files) {
// 		if (!file.isFolder) {
// 			const mdFile = await import(`../files/${file.id}.md`);
// 			await fetch(mdFile).then((response) => response.text()).then((string) => {
// 				file.content = 'wait';
// 			});
// 		} else if (file.isFolder && file.children) {
// 			await populateFiles(file.children);
// 		}
// 	}
// };

// const populateFiles = async (files: File[] = fileSys) => {
//   for (let file of files) {
//     if (!file.isFolder) {
//       const mdFile = await import(`../files/${file.id}.md`);
//       const response = await fetch(mdFile.default);
//       const string = await response.text();
//       file.content = string;
//     } else if (file.isFolder && file.children) {
//       await populateFiles(file.children);
//     }
//   }
// };

// await populateFiles(fileSys);

const populateFiles = async (files: File[] = fileSys) => {
	for (const file of files) {
		if (!file.isFolder) {
			const mdFile = await import(`../files/${file.id}.md`);
			await fetch(mdFile).then((response) => response.text()).then((string) => {
				file.content = string;
			});
		} else if (file.isFolder && file.children) {
			await populateFiles(file.children);
		}
	}
};

async function setup() {
  await populateFiles(fileSys);
  // export default fileSys;
}

setup();

export default fileSys;