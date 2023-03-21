import { File } from "../types/FileTypes";
import { findById } from "../store/helpers";

let fileSys: File[] = [
	{
		id: 'intro',
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

const populateFiles = (files: File[]) => {
	files.forEach((file) => {
		const filename = file.id;
		if (!file.isFolder) {
			const mdFile = require(`../files/${filename}.md`);
			let content: string;
			fetch(mdFile).then((response) => response.text()).then((string) => {
				content = string;
				findById(fileSys, "update", { id: filename } as File, null, content, true);
			});
		} if (file.isFolder && file.children) {
			populateFiles(file.children);
		}
	})
};

populateFiles(fileSys);

export default fileSys;