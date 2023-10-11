export interface File {
  user?: number;
  id?: number;
  temp_id?: number | null;
  title: string;
  content?: string | null;
  date_created: string;
  last_modified: string;
  is_folder: boolean;
  parent?: number | null;
  children?: File[] | null;
}

// This type removes `date_created` and `last_modified` from File.
type FileWithoutDates = Omit<File, "date_created" | "last_modified">;

// This type makes those properties optional.
export type NewFile = Partial<FileWithoutDates> & {
  date_created?: string;
  last_modified?: string;
};

export type SortKeys = "title" | "date_created" | "last_modified";

export type SortFunction = (
  files: File[],
  sortKey: SortKeys,
  reverse: boolean
) => any;

export type SaveStates = "saved" | "modified" | "saving" | "error";

export type RegisterStatus = {
  username?: Array<string>;
  email?: Array<string>;
  password?: Array<string>;
} | null;

export type ClickEvent = (
  e?: Event | React.MouseEvent<HTMLElement | HTMLAnchorElement, MouseEvent>
) => void;
