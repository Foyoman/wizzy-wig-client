import { File } from "../types/FileTypes";

export const fileSys: File[] = [
	{
		id: 'welcome',
		title: 'Welcome',
		dateCreated: new Date('03/20/23').toISOString(),
		lastUpdated: new Date('03/24/23').toISOString(),
		isFolder: false,
		content: ''
	},
	{
		id: 'aboutme',
		title: 'About Me',
		dateCreated: new Date('03/20/23').toISOString(),
		lastUpdated: new Date('03/20/23').toISOString(),
		isFolder: false,
		content: ''
	},
	{
		id: 'documentation',
		title: 'Documentation',
		dateCreated: new Date('03/21/23').toISOString(),
		lastUpdated: new Date('03/21/23').toISOString(),
		isFolder: true,
		children: [
			{
				id: 'practical-recursion',
				title: 'Practical Recursion',
				dateCreated: new Date('03/21/23').toISOString(),
				lastUpdated: new Date('03/24/23').toISOString(),
				isFolder: false,
				content: ''
			},
			{
				id: 'feature-overview',
				title: 'Feature Overview',
				dateCreated: new Date('03/21/23').toISOString(),
				lastUpdated: new Date('03/22/23').toISOString(),
				isFolder: false,
				content: ''
			},
			{
				id: 'src',
				title: 'src',
				dateCreated: new Date('03/22/23').toISOString(),
				lastUpdated: new Date('03/22/23').toISOString(),
				isFolder: true,
				children: [
					{
						id: 'components',
						title: 'components',
						dateCreated: new Date('03/22/23').toISOString(),
						lastUpdated: new Date('03/22/23').toISOString(),
						isFolder: true,
						children: [
							{
								id: 'app',
								title: 'App.tsx',
								dateCreated: new Date('03/22/23').toISOString(),
								lastUpdated: new Date('03/22/23').toISOString(),
								isFolder: false,
								content: ''
							},
						]
					},
				]
			},
			{
				id: 'features',
				title: 'Features',
				dateCreated: new Date('03/21/23').toISOString(),
				lastUpdated: new Date('03/22/23').toISOString(),
				isFolder: true,
				children: [
					{
						id: 'md-preview',
						title: 'Markdown Preview',
						dateCreated: new Date('03/22/23').toISOString(),
						lastUpdated: new Date('03/22/23').toISOString(),
						isFolder: false,
						content: ''
					},
				]
			},
		]
	}
]