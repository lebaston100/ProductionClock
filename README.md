# Production Clock

This is a fairly simple web-client based countdown timer and clock that follows a predefined rundown with an "unlimited" number of cues. It's not 100% stand-alone but runs on top of node-red for the backend/web server and the uibuilder node with the help of vue.js/bootstrap.

Features:
- Rundown is pulled via the google api from any google sheet that you have edit access to or from a local csv file
- Rundown and settings can be updated on the fly at any time
- It supports multiple different countdowns at the same time over multiple different frontends that run from the same server
- Time is always synced from the node-red server and does not rely on the web-clients local time
- All cues are always timed to milliseconds but are naturally only calculated for each client frame render
- Timezone can be configured on the server side so every client uses the same time
- Time can be offset by any number of seconds in any direction to compensate for stuff like stream delivery delay
- Realtime Clock can be shown or hidden on a per-cue basis
- Countdown can overflow into negative numbers if configured before going to the next cue
- Rundown and settings polling interval can be configured
- Displayed time "resolution" defaults to 1 second but displaying milliseconds can be enabled
- Realtime Clock always uses the sane 24h time system  

Demo Video:
[![Example image/video](/exampleimage.jpg?raw=true)](https://youtu.be/Vnax76UUxAQ)

## Setup
The overall first time setup involves quite a few steps if you are starting from scratch. There is also not only one right way of doing things for a lot of steps. Having some basic knowledge on how to handle nodejs related stuff and maybe even node-red helps.

#### Rough overview (Using google sheets):
- Create Google api application, service user and authentication credentials
- Install Node.js and node-red
- Install needed node-red modules
- Import files and flows from github
- Import google api auth
- Configure sheet data source

#### Rough overview (Using local files):
- Install Node.js and node-red
- Install needed node-red modules
- Import files and flows from github
- Configure file locations

#### Required node-red/uibuilder modules for the people who want to skip a few setup steps and know their stuff
node-red:
- [node-red-contrib-google-sheets](https://flows.nodered.org/node/node-red-contrib-google-sheets) (install this even if you don't use the google sheets option)
- [node-red-contrib-uibuilder](https://flows.nodered.org/node/node-red-contrib-uibuilder)

uibuilder:
- [vue@v2-latest](https://www.npmjs.com/package/vue)
- [bootstrap-vue](https://www.npmjs.com/package/bootstrap-vue)

#### Ready? Let's go:  
In case you want to use the local file option you can ignore all the steps that have to do with google.  
 1. Google API Stuff  
 1.1. Head to the [Google cloud console service user page](https://console.cloud.google.com/iam-admin/serviceaccounts)  
 1.2. If you already have a project you can use an existing one otherwise click on "create project" on the top right. Give the project some name or leave the default one.  
 1.3. After creating or selecting the project click the "+ create service account" button on the top of the service accounts page  
 1.4. Give the service user some name like "node-red" and click "done"  
 1.5. Click on the newly created entry in the list and choose "keys". Click on "add key" -> "create new key", select "JSON" and click "create".  
 1.6. You will now get a download for the login settings .json. Save that on a secure place for now, we later need to import it's contents into node-red  
 1.7. Also copy and save the displayed email address for the service user for later  
 1.7. Type "Google Sheets API" into the search box on the top of the cloud console and select the entry with the "API" logo.  
 1.8. Click the blue "enable" button to enable the google sheets api for this project  
 1.9. That is the google api setup part. It's also descibed on the [node-red-contrib-google-sheets](https://flows.nodered.org/node/node-red-contrib-google-sheets) page  
 2. Setting up node-red (skip this if you already have a node-red instance)  
 2.1. I will not go into detail about how to install or run node-red as the node-red project has done a much better job as i would be able to already [in their documentation](https://nodered.org/docs/getting-started/). You can host it wherever and however you like. There is not really anything special that you have to do except all clients beeing able to reach the server. Personally i run it either locally on windows or in a docker container for development
 2.2. Come back to the next step after you installed it and you can reach the flow editor  
 3. Preparing node-red  
 3.1. Open the flow editor in your browser  
 3.2. Click on the hamburger menu on the top right and choose "Manage palette" and select the "Install" tab  
 3.3. In the seach bar copy-paste "node-red-contrib-uibuilder" and click on the "install"(search result list) -> "Install"(install popup) buttons. Wait a bit until node-red reports that it finished installing.  
 3.4. Repeat this process again for "node-red-contrib-google-sheets" (install this even if you don't plan to use the google sheets option)  
 4. Installing the production clock project  
 4.1. Download and unzip the [master branch zip](https://github.com/lebaston100/ProductionClock/archive/refs/heads/main.zip) or use you favorite git client to clone the repo  
 4.2. Head back to the node-red dashboard. In the hamburger menu (top right) select "Import" and click "select a file to import". Now select the "flows.json" in the projects "flow" folder and click the "Import Button".  
 4.3. Now click the big red "Deploy" button on the top right to start the flow  
 4.4. In the node-red flow editor choose the "Settings/Rundown API" tab  
 4.5. Double click the "Get Gsheet Rundown Data" node to open it's settings (you will need this again later)  
 4.6. In the first line where it says "cred" click on the pen icon to open the credential node settings  
 4.7. Open the .json file you downloaded earlier from the google website with a text editor and copy-paste everything from the file into the big "Creds" textbox in node-red  
 4.8. Click "Update" -> "Done" and "Deploy". Node-Red should now be able to authenticate to the google api.  
 4.9. Switch to the "Clock UI" tab and double click the "clock" node in the middle  
 4.10. "OK" the warning message(if one appears) and click on "Manage front-end libraries"  
 4.11. Click the little "+add" button and type "vue" into the "Name:" text box and "@v2-latest" into the "Tag:" text box. Now click the "Install" button and wait for it to finish installing  
 4.12. Repeat the last step but this time type "bootstrap-vue"("Name:") into the box (And nothing in the "Tag:" box)
 4.13. Now click "Done" and "Deploy" again  
 4.14. Open the node-red installation folder with a file explorer. There should already be a "uibuilder" folder besides the "node_modules" and "lib" folder.  
 4.15. Grab the "uibuilder" folder you downloaded from github and overwrite the existing folder with it overwriting all lose files in the process. Alternatively you can go down into the "clock" folder in node-red and overwrite the preexisting 3 files with all the lose files from the github "uibuilder\clock\src" subfolder.  
5. Setting up the spreadsheet  
5.1. Clone the [template](https://docs.google.com/spreadsheets/d/1vuk6D56GfGpQ8ZVcVkTZMTHZln62enbjQTnc_ASXXFw/edit?usp=sharing) into your own account.  
5.2. Open the share dialog and share the document with the google service user email you copied earlier. Make sure the user has edit permission.  
5.3. Copy the spreadsheet id that is displayed in the url bar, for the template this would be "1vuk6D56GfGpQ8ZVcVkTZMTHZln62enbjQTnc_ASXXFw"  
5.4. Head back to the node-red flow editor and double click the "Get Gsheet Rundown Data" again in the "Settings/Rundown API" tab  
5.5. In the field that says "SpreadsheetID" remove everything and paste the spreadsheet id  
5.6. Click "Done" and repeat the process for the "Get Gsheet Settings Data" pasting the id into the field  
5.7.  Finish the setup by clicking "Deploy" again  
6. Setting up the local file option instead of google sheets  
6.1. Export the both sheets of the linked template google sheet as .csv or use the included template .csv files  
6.2. Copy both files into your .node-red folder or any folder that node-red can access  
6.3 Open the node-red flow editor  
6.4 In the "Settings/Rundown API" Tab double click each of the "read file" and "watch local file changes" nodes and replace the value in "File(s)" (watch node) and "Filename" (file in node) with the path and filename for the csv files (can even be relative paths)  
6.5. To disable the google sheets stuff either delete the "Trigger * Sheet Update" and "Get Gsheet * Data" nodes by clicking them once and pressing DEL or just remove the "wires" after the 2 blue inject nodes  

This should do with initial setup.
 
## Usage

### The rundown/settings sheet
The rundown and settings are stored in the same google sheet document but on different sheets("pages/tabs/whatever"). The rundown one has to be called "Rundown" and the settings one "Settings".  
**I highly suggest you just clone the template provided here for ease-of-use:** [google sheets template here](https://docs.google.com/spreadsheets/d/1vuk6D56GfGpQ8ZVcVkTZMTHZln62enbjQTnc_ASXXFw/edit?usp=sharing)  
The template is also included in the git as "ProductionClockTemplate.ods"  
If you use the csv each has to have the same format as the google sheets. Unlike the google sheets the local file will automatically detect if the file was modified and read it again.

Rundown:  
The first row conains the header that should not be modified (or else parsing the document will no longer work). Row 2 and following contain the actual rundown. There is no limit on how many rows you can have but the template is configured for 998 cues which i would guess is more then enough.  
The "**Cue Name**" can be anything as it's not used internally. Might be usable for cue numbering.  
The "**Timer-Text**" is the text that is displayed on the timer page while the cue is active. Keep this below 50 chars including spaces.  
The "**Timer-End-Time**" is the date and time when the timer should hit 0. Make sure to use the same exact format as used in the template (DD.MM.YYYY HH:MM:SS.s). Numbers < 10 can be 0-padded but don't have to be.  
"**Negative-Overrun**" is the number of seconds after the cue has ended where the display will not switch to the next cue yet which will lead to the timer counting into the negative and changing the color to red.  
"**Show-Current-Time**" can either be "Yes" or "No". Setting it to "No" will hide the Realtime clock box while that cue is active.  
The "**Clock-ID**" is where you specify in which clock you want the cue to show up in. It's either a single number or a comma seperated list. Little example: Imagine you have a stage clock display(ID 1) and a production teams clock display(ID 2). If you set the "Clock-ID" to "1,2" the cue will show up in both of the displays. Setting it to "1" will make the cue only be shown in the stage display. Defaults to "0" if left empty.

Settings:  
"**RealTimeOffset**": How many ms to offset the realtime in case you want to compensate for output delivery delay (Default 0)  
"**TimeZoneOffset**": Timezone offset from GMT in hours (Default 0)  
"**MilliResolution**": How many digits of the milliseconds should be displayed. Set to 0 to turn MS off (Default 0)  
"**ShowHours**": If the countdown timer should show hours instead of > 59 minutes. Yes/No (Default No)

### Controlling from node-red
There are a few things that you an control from within the node-red flow editor.  
The default setting to polling the rundown is 1 minute. This can be changed by editing the "Trigger Rundown Sheet Update" node in the "Sheets API" tab. You can trigger it manually by clicking the blue button on the left side of the node.  
The default for polling settings is 10 minutes. This can be changed by editing the "Trigger Settings Sheet Update" node in the "Sheets API" tab. You can also trigger it manually by clicking the blue button on the left side of the node.  
Rundown and settings will automtically pushed to all connected clients.  
If something doesn't work open the debug panel by clicking on the "bug" icon on the top right. This will show log outputs. For the spreadsheet data there are a few basic checks built into it that will alert you if any important values are filled in wrong. Google api errors will also show up here.  
Any of the other stuff you basically don't want to touch if you don't know what you are doing.  
But if you know what you are doing you can use the provided link nodes to trigger a rundown/settings update from somewhere else like the node-red-dashboard  


### Opening the clock
The clock page should be available on http://\<node-red-server-ip\>:1880/clock/  
If you want to use the clock id feature then use http://\<node-red-server-ip\>:1880/clock/?id=\<clock-id\>  
\<\> are placeholders that you need to replace with your own values.  

And now stop reading this readme and get back to production.

If you have any problems, just open a Github issue or join the [Discord Server](https://discord.gg/PCYQJwX).
In case you want something simpler to setup with a gui check out [Ontime](https://github.com/cpvalente/ontime).