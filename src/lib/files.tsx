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

const populateFiles = (files: File[] = fileSys) => {
	files.forEach((file) => {
		if (!file.isFolder) {
			const mdFile = require(`../files/${file.id}.md`);
			fetch(mdFile).then((response) => response.text()).then((string) => {
				findById(files, "update", { id: file.id } as File, null, string, false);
			});
		} else if (file.isFolder && file.children) {
			populateFiles(file.children);
		}
	})
};

populateFiles(fileSys);

export default fileSys;