# <img src="/docs/icon/icon.png?raw=true" height="48"> Fitbit METAR
A METAR app for the Fitbit Ionic and Versa.

## Build and install

### In Fitbit Studio

- Create a new project in Fitbit Studio, then drag and drop the contents of `src` into the side bar.
- Connect to the Fitbit Developer Bridge from your phone (tap your watch, then developer menu, then toggle on Developer Bridge), and your watch (Settings app, scroll down, tap on Developer Bridge).
- Click the Build button to build and install.

### Using Command Line Tools

Prerequisite: You'll need NPM installed.

- In the src directory (`cd src`), run `npx fitbit-build` and `npx fitbit`.
- Connect to the Fitbit Developer Bridge from your phone (tap your watch, then developer menu, then toggle on Developer Bridge), and your watch (Settings app, scroll down, tap on Developer Bridge).
- Once both are connected, back to the computer. At the Fitbit prompt, run `connect phone`, `connect device`, then `install` to install the app on the Ionic, Versa, and companion on your phone.
- To build, run `build` at the Fitbit prompt.

## Gallery

![METAR main menu](/docs/screenshots/METAR_main~Ionic.png?raw=true)
![METAR display](/docs/screenshots/METAR_pane1~Ionic.png?raw=true)
![METAR metadata](/docs/screenshots/METAR_pane2~Ionic.png?raw=true)
![METAR Translation](/docs/screenshots/METAR_pane3~Ionic.png?raw=true)
![METAR Remarks Translation](/docs/screenshots/METAR_pane4~Ionic.png?raw=true)

![METAR main menu](/docs/screenshots/METAR_main~Versa.png?raw=true)
![METAR display](/docs/screenshots/METAR_pane1~Versa.png?raw=true)
![METAR metadata](/docs/screenshots/METAR_pane2~Versa.png?raw=true)
![METAR Translation](/docs/screenshots/METAR_pane3~Versa.png?raw=true)
![METAR Remarks Translation](/docs/screenshots/METAR_pane4~Versa.png?raw=true)
