import { FsFile } from "../types/FsTypes";

export const fsFiles: FsFile[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-2012 00:03:44'),
		lastUpdated: new Date('01-01-2021 00:03:44'),
		fileId: 'dsk238',
		isFolder: false,
	},
	{
		id: '1',
		title: 'directory',
		dateCreated: new Date('12-02-1998 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		isFolder: true,
		children: [
			{
				id: '2',
				title: 'subdirectory',
				dateCreated: new Date('01-01-2001 00:03:44'),
				lastUpdated: new Date('01-01-2002 00:03:44'),
				isFolder: true,
				children: [
					{
						id: '1241',
						title: 'zeppo',
						dateCreated: new Date('01-01-2022 00:03:44'),
						lastUpdated: new Date('01-01-2023 00:03:44'),
						isFolder: false,
					},
					{
						id: '3',
						title: 'chico',
						dateCreated: new Date('01-01-2003 00:03:44'),
						lastUpdated: new Date('01-01-2004 00:03:44'),
						isFolder: false,
					},
					{
						id: '32423',
						title: 'hotdogs',
						dateCreated: new Date('01-01-1983 00:03:44'),
						lastUpdated: new Date('01-01-2004 00:03:44'),
						isFolder: false,
					},
					{
						id: '821',
						title: 'zebra',
						dateCreated: new Date('01-01-1983 00:03:44'),
						lastUpdated: new Date('01-01-2004 00:03:44'),
						isFolder: true,
						children: [
							{
								id: '69',
								title: 'django',
								dateCreated: new Date('01-01-1983 00:03:44'),
								lastUpdated: new Date('01-01-2004 00:03:44'),
								isFolder: false,
							},	
						]
					},
					{
						id: '7',
						title: 'truncated',
						dateCreated: new Date('01-01-2005 00:03:44'),
						lastUpdated: new Date('01-01-2006 00:03:44'),
						isFolder: true,
						children: [
							{
								id: '8',
								title: 'flabbergasat',
								dateCreated: new Date('01-01-2007 00:03:44'),
								lastUpdated: new Date('01-01-2008 00:03:44'),
								isFolder: true,
								children: [
									{
										id: '99',
										title: 'daniel',
										dateCreated: new Date('01-01-2009 00:03:44'),
										lastUpdated: new Date('01-01-2010 00:03:44'),
										isFolder: true,
										children: [
											{
												id: '98',
												title: 'doors',
												dateCreated: new Date('01-01-2011 00:03:44'),
												lastUpdated: new Date('01-01-2012 00:03:44'),
												isFolder: false,
											},	
										]
									},
									{
										id: '321',
										title: 'jason',
										dateCreated: new Date('01-01-2009 00:03:44'),
										lastUpdated: new Date('01-01-2010 00:03:44'),
										isFolder: true,
										children: [
											{
												id: '928',
												title: 'derrick',
												dateCreated: new Date('01-01-2011 00:03:44'),
												lastUpdated: new Date('01-01-2012 00:03:44'),
												isFolder: false,
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
		dateCreated: new Date('01-01-2017 00:03:44'),
		lastUpdated: new Date('01-01-2019 00:03:44'),
		isFolder: false,
		fileId: "ts1",
	},
	{
		id: '5',
		title: 'folder',
		dateCreated: new Date('01-01-2003 00:03:44'),
		lastUpdated: new Date('01-01-2003 00:03:45'),
		isFolder: true,
		children: [
			{
				id: '6',
				title: 'subfile',
				dateCreated: new Date('01-01-1999 00:03:44'),
				lastUpdated: new Date('01-01-2000 00:03:44'),
				isFolder: false,
			}
		]
	},
	{
		id: '6542',
		title: 'empty',
		dateCreated: new Date('01-01-2003 00:03:44'),
		lastUpdated: new Date('01-01-2003 00:03:44'),
		isFolder: true,
	}
]

export const fsFiles2: FsFile[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1995 00:03:44'),
		lastUpdated: new Date('01-01-2020 00:03:44'),
		fileId: 'dsk238',
		isFolder: false,
	},
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		fileId: 'dsk238',
		isFolder: false,
	},
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-2000 00:03:44'),
		lastUpdated: new Date('01-01-2010 00:03:44'),
		fileId: 'dsk238',
		isFolder: false,
	},
]