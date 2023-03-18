export interface File {
	id?: string;
	title: string;
	dateCreated: Date;
	lastUpdated: Date;
	isFolder: boolean;
	content?: string;
	fileId?: string;
	children?: File[];
}

export type SortKeys = "title" | "dateCreated" | "lastUpdated";

export type SortFunction = (
	files: File[], 
	sortKey: SortKeys,
	reverse: boolean
) => any;