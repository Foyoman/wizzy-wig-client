# `wizzy wig` - [Create an account](#signupEl) or [Login](#loginEl) (currently not functional)
Welcome! 	`wizzy wig` is an in browser note-taking app with code block syntax highlighting, a file system, and a tab system. 

## Edit this file! I dare you! Click the... wait it doesn't work like that... (dev update inc)
Open the editor, and just mess around with it. Edit a file, switch files, and see if your changes are still there. Test the limits. Open a million tabs. Why not? This single page web app uses [static props](/files/welcome.md) `¡middle click to open in a new tab!`  to populate state - when you create an account and start making your own files, your file system will be automatically saved to the server. 

## Feature Overview
This app was developed with a focus on a fluid and intuitive experience with file navigation and tab management. Major features of `wizzy wig` include:
- What You See Is What You Get (WYSIWYG) markdown parsing
- Browser-like tab management
- A file system to store saved files
- Autosaving  

Read more about features in `~/Documentation/Feature Overview.md` 

## Credits
## `<MdPreview />`
This markdown parser couldn't be put together without the help of `react-markdown` and `react-syntax-highlighter`. Awesome tutorial goes to [Amir Adalan](https://amirardalan.com/blog/syntax-highlight-code-in-markdown). Thanks also to GitHub and their public markdown CSS.

```ts
import { hug, relieve, caress } from '@/experiences/soul';
import { squeeze } from '@/experiences/physical';

const hug = (participants: Person[]) => {
	participants.forEach((person) => {
		caress(person.soul);
		squeeze(person.body);
		if (person.doubts.length) {
			relieve(person);
		}
	});

	console.log(`${person.name}, you are loved <3`);
};
```
  
## `<MdEditor />`
Props goes out to Microsoft for their monaco editor. Specifically `@monaco-editor/react` for making the editor possible. Some extra props go into configuration but basically their entire functionality. Debounce kicks in after only about 500 characters, `useMemo()` is in effect but not sure if I'm using it in it's most optimised method.  

## `<FileSystem />`
Big credits go to Microsoft's Material UI and ChatGPT3 for helping me figure out sort functions and general recursive functions. Big pat on the back goes out to me for figuring out the recursive function for MUI's nested tree view of files and folders on my own! It was very fun to code :)

## `<edwardtdo />`
If you're reading this far down, between just me and you, I really appreciate you giving this project the time of day. I made `wizzy-wig` out of passion for programming - a lot of the code was genuinely fun to write. And on passions, my dream is to combine my two biggest passions and to live a digitally nomadic lifestyle, and as long as this is here to be read, I am currently chasing that dream. So if you are or know a connection to get a shoe in in this field of software development, I would love to hear from you. If I could just make you do a little work, my contact info is in `~/About Me.md`. Or it should already be an opened tab.