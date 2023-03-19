export interface File {
	id?: string;
	title: string;
	dateCreated: Date;
	lastUpdated: Date;
	isFolder: boolean;
	content?: string | null;
	fileId?: string;
	children?: File[] | null;
}

export type SortKeys = "title" | "dateCreated" | "lastUpdated";

export type SortFunction = (
	files: File[], 
	sortKey: SortKeys,
	reverse: boolean
) => any;