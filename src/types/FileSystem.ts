export interface FsFile {
	id: number;
	title: string;
	dateCreated: Date;
	lastUpdated: Date;
	isFolder: boolean;
	fileId?: string;
	children?: FsFile[];
}

export type SortKeys = "title" | "dateCreated" | "lastUpdated";

export type SortFunction = (
	files: FsFile[], 
	sortKey: SortKeys,
	reverse: boolean
) => any;