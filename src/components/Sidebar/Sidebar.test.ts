/* eslint-disable jest/no-mocks-import */
import { sortFileSystem } from "../../store/helpers";
import { File } from "../../types/FileTypes";

import { files, files2 } from "../../__mocks__/Files"

import { findById } from "../../store/helpers";

const sampleSorted: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		fileId: 'friend',
		isFolder: false,
		content: 'angelas content'
	},
	{
		id: '1',
		title: 'joe',
		dateCreated: new Date('01-01-1995 00:03:44'),
		lastUpdated: new Date('01-01-2020 00:03:44'),
		fileId: 'good',
		isFolder: false,
		content: 'joe mama'
	},
	{
		id: '2',
		title: 'bianca',
		dateCreated: new Date('01-01-2000 00:03:44'),
		lastUpdated: new Date('01-01-2010 00:03:44'),
		fileId: 'danger',
		isFolder: false,
		content: 'biancas content'
	},
]

const needle: File = {
	id: '1',
	title: 'joe',
	dateCreated: new Date('01-01-1995 00:03:44'),
	lastUpdated: new Date('01-01-2020 00:03:44'),
	fileId: 'good',
	isFolder: false,
	content: 'joe mama'
}

const updated: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		fileId: 'friend',
		isFolder: false,
		content: 'angelas content'
	},
	{
		id: '1',
		title: 'joe',
		dateCreated: new Date('01-01-1995 00:03:44'),
		lastUpdated: new Date('01-01-2020 00:03:44'),
		fileId: 'good',
		isFolder: false,
		content: 'updatedcontent'
	},
	{
		id: '2',
		title: 'bianca',
		dateCreated: new Date('01-01-2000 00:03:44'),
		lastUpdated: new Date('01-01-2010 00:03:44'),
		fileId: 'danger',
		isFolder: false,
		content: 'biancas content'
	},
]

const testFs: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		fileId: 'friend',
		isFolder: false,
		content: 'angelas content'
	},
]

const testNeedle: File = {
	id: '0',
	title: 'angela',
	dateCreated: new Date('01-01-1990 00:03:44'),
	lastUpdated: new Date('01-01-2000 00:03:44'),
	fileId: 'friend',
	isFolder: false,
	content: 'angelas content'
}

const testResult: File[] = [
	{
		id: '0',
		title: 'angela',
		dateCreated: new Date('01-01-1990 00:03:44'),
		lastUpdated: new Date('01-01-2000 00:03:44'),
		fileId: 'friend',
		isFolder: false,
		content: 'jest'
	},
]

describe('file system functions', () => {
	// it('sorts alphabetically, seperating files and folders', () => {
	// 	expect(sortFileSystem(files, "title", false)).toBe(sortedFiles);
	// });

	// it('sorts by date created, seperating files and folders', () => {
	// 	expect(sortFileSystem(files2, "dateCreated", false)).toStrictEqual(sampleSorted);
	// });
	it('updates a file', () => {
		// eslint-disable-next-line testing-library/await-async-query
		expect(findById(testFs, "update", testNeedle, null, "jest")).toStrictEqual(testResult);
		// findById(state.files, "update", fileToUpdate as File, null, state.markdown);
	});
})

