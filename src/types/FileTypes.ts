export interface File {
  user?: number;
  id: number;
  title: string;
  content?: string | null;
  date_created: string;
  last_modified: string;
  is_folder: boolean;
  parent?: number | null;
  children?: File[] | null;
}

export type SortKeys = "title" | "date_created" | "last_modified";

export type SortFunction = (
  files: File[],
  sortKey: SortKeys,
  reverse: boolean
) => any;

export type SaveStates = "saved" | "modified" | "saving";
