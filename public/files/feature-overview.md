# Feature Overview

## Saving
Take note of the save state you see in the top left navbar, your files will only be saved when the state shows 'saved -'. Please don't close out of the browser tab containing your `wizzy wig` until you your save state is confirmed. 

## Tabs
Speaking of tabs, you also have a tab system to multitask between notes! They work just like regular browser tabs, scroll up/down left/right on the tab bar when you for some reason have enough tabs open. Tabs are set with the file system on the left. 

## File System
Create folders as well as md files, everything can be nested and sorted - test it out with the toolbar at the top, the functionality was really fun to write!
> Please refresh the page if you delete the login/signup button and can't get it back

## GitHub flavoured markdown with code block syntax highlighting
The markdown preview you're reading uses a flavour of GitHub markdown styling and syntax highlighting was configured with [Prism](#)'s `syntax-highlighter` and React's `react-markdown`.

```ts
interface Human extends Animal {
	thoughts: Thought[] | null;
}
```

## Microsoft's Monaco Editor
The adjacent editor uses the browser-capable version of the same IDE used for VS Code. Expect a lot of it's vanilla functionality and keyboard shortcuts. My favourite is `Ctrl/Cmd + D`.