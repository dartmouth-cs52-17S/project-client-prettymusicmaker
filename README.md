# Pretty Music Maker
* Visit [PrettyMusicMaker.io](http://PrettyMusicMaker.io) for some <b>FUN</b>!

Pretty Music Maker aims is to make producing music accessible and intuitive through a simple and easy to use UI. In essence, we are benchmarking [this app](https://musiclab.chromeexperiments.com/Melody-Maker) but we want to give more fine tune control to the users. Our app will be click driven in which users click to set events on a timeline that would continuously loop over from start to finish. Our app’s point of differentiation from the pre-existing counterparts are the ability to save music and share. If a user shares the unique song URL with a friend who also has an account, the friend can update the original song too and have collaborations.

## Mockup Design
![](./images/welcome%20page.png)

![](./images/user%20profile.png)

![](./images/editor.png)

## Architecture

* There are two components to this project:
  * [Frontend](https://github.com/dartmouth-cs52-17S/project-client-prettymusicmaker)
  * [Backend](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker)

* Tools and libraries: Redux (react-redux redux-thunk), React, Babel, Eslint, [tone.js](https://github.com/Tonejs/Tone.js/), Passport (passport-local and passport-jwt), JWT (jwt-simple), Bcryptjs, Mongoose

* The Backend runs on [Heroku App server](https://prettymusicmaker.herokuapp.com) and uses mLab addon which is a sandbox for Mongodb. The Frontend uses react-redux.

* [Tone.js](https://tonejs.github.io/) is used to generate the sounds on the frontend

## Setup

Pull from the [client-prettymusicmaker](https://github.com/dartmouth-cs52-17S/project-client-prettymusicmaker) and [api-prettymusicmaker](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker) repos into separate directories. Make sure you've installed the necessary libraries and tools outlined above. In each of the directories, do npm install and package.json should have all you need.


## Deployment

Use npm start to run each of the applications locally. Properly configure the Frontend to either use the local or the Heroku backend.


## API endpoints & Backend

See the [README.md](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker/blob/master/README.md) in our [backend repo](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker)


## Authors

SeokJun Bing,
Ke Deng,
Van Nguyen,
Odon Orzik,
Dylan Scandinaro

## Acknowledgments
This project was inspired by [this app](https://musiclab.chromeexperiments.com/Melody-Maker).
