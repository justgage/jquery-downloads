#Kdown
_Kyani download interface_

Created: December 2013
By:      Gage Peterson (@justgage on github / twitter)

__status__: Beta.

##To Do
- make individual file page.
- test for ajax errors.

#Things to know

##Files
- `kdown.js` the place where the bulk of the application is held
- `index.php` the main page
- `api.php` my mock api for looking up files.
- `console_fix.js` fixes the console errors in IE.
- `dl.css` some styles needed for the page (including css3 animations for sidebar / search bar.)
- `libs/` all the JS librarys are held.
- `libs/bubpub/bubpub.js` JavaScript library for pubsubish system. <https://github.com/justgage/bubpub.js>
- `files/` all files 

##bubpub
_bubpbub is a pub sub system with the twist that it uses the setTimout to make it non-blocking and a que that doesn't duplicate events._
for more information see the bubpub repo. https://github.com/justgage/bubpub.js
##Terms
`cat` refers to the categories that files can be devided in. 
`market` is the kyani market (usually a country but not always).


`Kdown` is the singleton that holds the whole program.

`$ui` is the jquery objects cache.

`view` holds actions for manipulating the DOM.

`db` is the main database that holds all the information about the aplication including the file list and the state of the page.

`kobj` is a costom object that validates the values it changes to, and publishes any changes with bubpub. 

`server` is what handles the AJAX calls to the server. 








