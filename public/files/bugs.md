<!-- #### All bugs currently resolved  
If you find a new bug please email me at [edwardtdo@gmail.com](mailto:edwardtdo@gmail.com) -->
  
# Bugs

- Creating a new file within a folder then deleting the folder won't filter the newly created file from the open tabs upon deletion. 

  This is because the delete function depends on `selectedItem`, which doesn't get updated whenever a new file is created. 
  
  Recreate the bug by creating a new file within a folder, leaving the new file open in a tab, and deleting it's containing folder. 
  
  Creating a file within a folder, then reselecting the containing folder *will* filter the newly created file.
	

- Deleting a folder then creating a new file will create the new file in an open tab but it will not be present in the file system, supposedly because the file is attempting to be placed in the deleted folder.
  
  Recreate the bug by deleting a folder, and without deselecting or selecting any other file/folder, create a new file.

- Deleting an edited new file will not filter it from tabs

  Recreate the bug by: create a new file, edit it, switch tabs, select it from the fs, then delete it.