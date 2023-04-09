import { File } from "../types/FileTypes";

export const files: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-2012 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2021 00:03:44').toISOString(),
		isFolder: false,
		content: "angela's file"
	},
	{
		id: '1',
		title: 'directory',
		dateCreated: new Date('12-02-1998 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2000 00:03:44').toISOString(),
		isFolder: true,
		children: [
			{
				id: '2',
				title: 'subdirectory',
				dateCreated: new Date('01-01-2001 00:03:44').toISOString(),
				lastUpdated: new Date('01-01-2002 00:03:44').toISOString(),
				isFolder: true,
				children: [
					{
						id: '1241',
						title: 'zeppo',
						dateCreated: new Date('01-01-2022 00:03:44').toISOString(),
						lastUpdated: new Date('01-01-2023 00:03:44').toISOString(),
						isFolder: false,
						content: "zeppo's file"
					},
					{
						id: '3',
						title: 'chico',
						dateCreated: new Date('01-01-2003 00:03:44').toISOString(),
						lastUpdated: new Date('01-01-2004 00:03:44').toISOString(),
						isFolder: false,
						content: "chico's file"
					},
					{
						id: '32423',
						title: 'hotdogs',
						dateCreated: new Date('01-01-1983 00:03:44').toISOString(),
						lastUpdated: new Date('01-01-2004 00:03:44').toISOString(),
						isFolder: false,
						content: "hotdogs and all that"
					},
					{
						id: '821',
						title: 'zebra',
						dateCreated: new Date('01-01-1983 00:03:44').toISOString(),
						lastUpdated: new Date('01-01-2004 00:03:44').toISOString(),
						isFolder: true,
						children: [
							{
								id: '69',
								title: 'django',
								dateCreated: new Date('01-01-1983 00:03:44').toISOString(),
								lastUpdated: new Date('01-01-2004 00:03:44').toISOString(),
								isFolder: false,
								content: "django unchained"
							},	
						]
					},
					{
						id: '7',
						title: 'truncated',
						dateCreated: new Date('01-01-2005 00:03:44').toISOString(),
						lastUpdated: new Date('01-01-2006 00:03:44').toISOString(),
						isFolder: true,
						children: [
							{
								id: '8',
								title: 'flabbergasat',
								dateCreated: new Date('01-01-2007 00:03:44').toISOString(),
								lastUpdated: new Date('01-01-2008 00:03:44').toISOString(),
								isFolder: true,
								children: [
									{
										id: '99',
										title: 'daniel',
										dateCreated: new Date('01-01-2009 00:03:44').toISOString(),
										lastUpdated: new Date('01-01-2010 00:03:44').toISOString(),
										isFolder: true,
										children: [
											{
												id: '98',
												title: 'doors',
												dateCreated: new Date('01-01-2011 00:03:44').toISOString(),
												lastUpdated: new Date('01-01-2012 00:03:44').toISOString(),
												isFolder: false,
												content: "doors the who and all that"
											},	
										]
									},
									{
										id: '321',
										title: 'jason',
										dateCreated: new Date('01-01-2009 00:03:44').toISOString(),
										lastUpdated: new Date('01-01-2010 00:03:44').toISOString(),
										isFolder: true,
										children: [
											{
												id: '928',
												title: 'derrick',
												dateCreated: new Date('01-01-2011 00:03:44').toISOString(),
												lastUpdated: new Date('01-01-2012 00:03:44').toISOString(),
												isFolder: false,
												content: "derrick rose and his acl"
											},	
										]
									},
								]
							},	
						]
					},
				]
			},
		]
	},
	{
		id: '4',
		title: 'typescript',
		dateCreated: new Date('01-01-2017 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2019 00:03:44').toISOString(),
		isFolder: false,
		content: 'this aint it chief'
	},
	{
		id: '5',
		title: 'folder',
		dateCreated: new Date('01-01-2003 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2003 00:03:45').toISOString(),
		isFolder: true,
		children: [
			{
				id: '6',
				title: 'subfile',
				dateCreated: new Date('01-01-1999 00:03:44').toISOString(),
				lastUpdated: new Date('01-01-2000 00:03:44').toISOString(),
				isFolder: false,
				content: 'subfile poop'
			}
		]
	},
	{
		id: '6542',
		title: 'empty',
		dateCreated: new Date('01-01-2003 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2003 00:03:44').toISOString(),
		isFolder: true,
	}
]

export const files2: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1995 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2020 00:03:44').toISOString(),
		isFolder: false,
		content: "hey hey its me"
	},
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2000 00:03:44').toISOString(),
		isFolder: false,
		content: "angela's file"
	},
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-2000 00:03:44').toISOString(),
		lastUpdated: new Date('01-01-2010 00:03:44').toISOString(),
		isFolder: false,
		content: "angela's second file? witf"
	},
]