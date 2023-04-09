export interface File {
	id?: string;
	title: string;
	dateCreated: string;
	lastUpdated: string;
	isFolder: boolean;
	content?: string | null;
	children?: File[] | null;
}

export type SortKeys = "title" | "dateCreated" | "lastUpdated";

export type SortFunction = (
	files: File[], 
	sortKey: SortKeys,
	reverse: boolean
) => any;

export type SaveStates = "saved" | "modified" | "saving";