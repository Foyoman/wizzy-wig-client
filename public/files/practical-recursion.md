# Practical Recursion
One of the funnest and most exciting parts of writing the code for this project was stumbling across my first real world application of recursion. 

### `<FileSystem />`
```tsx
const mapDirectory = (items: File[], parent: File | null, nested: boolean) => {
	return items.map((item) => {
		if (item.isFolder) {
			return (
				<TreeItem>
				{ item.children?.length ? 
					mapDirectory(item.children, item, true) 
					: 
					<span style={{ display: 'none' }} />
				}
				</TreeItem>
			)
		} else {
			return (
				<TreeItem />
			)
		}
	})
}
	
const mappedItems = mapDirectory(items, null, false);

return (
	<TreeView >
		{ mappedItems }
	</TreeView>
)
```  

I was really proud of figuring out the recursive function for using MUI's `TreeView` to render a file system!  