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
	},
	{
		id: 'documentation',
		title: 'Documentation',
		dateCreated: new Date('03/21/23'),
		lastUpdated: new Date('03/21/23'),
		isFolder: true,
		children: [
			{
				id: 'feature-overview',
				title: 'Feature Overview',
				dateCreated: new Date('03/21/23'),
				lastUpdated: new Date('03/21/23'),
				isFolder: false,
				content: ''
			},
			{
				id: 'features',
				title: 'Features',
				dateCreated: new Date('03/21/23'),
				lastUpdated: new Date('03/21/23'),
				isFolder: true,
				children: [
					{
						id: 'md-preview',
						title: 'Markdown Preview',
						dateCreated: new Date('03/20/23'),
						lastUpdated: new Date('03/20/23'),
						isFolder: false,
						content: ''
					},
				]
			},
		]
	}
]