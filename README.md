# Pretty Music Maker

Pretty Music Maker aims is to make producing music accessible and intuitive through a simple and easy to use UI. In essence, we are benchmarking [this app](https://musiclab.chromeexperiments.com/Melody-Maker) but we want to give more fine tune control to the users. Our app will be click driven in which users click to set events on a timeline that would continuously loop over from start to finish. Our app’s point of differentiation from the pre-existing counterparts are the ability to save music and share.

![](./images/welcome%20page.png)

![](./images/user%20profile.png)

![](./images/editor.png)

## Architecture

TODO:  descriptions of code organization and tools and libraries used

There are two components to this project:
* [Frontend](https://github.com/dartmouth-cs52-17S/project-client-prettymusicmaker)
* [Backend](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker)

Tools and libraries: Redux, React, Babel, Eslint, [tone.js](https://github.com/Tonejs/Tone.js/)

The Backend runs on [Heroku App server](https://prettymusicmaker.herokuapp.com) and uses mLab addon which is a sandbox for Mongodb. The Frontend uses react-redux.

## Setup

TODO: how to get the project dev environment up and running, npm install etc

Pull from the [client-prettymusicmaker](https://github.com/dartmouth-cs52-17S/project-client-prettymusicmaker) and [api-prettymusicmaker](https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker) repos into separate directories. Make sure you've installed the necessary libraries and tools outlined above. In each of the directories, do npm install.


## Deployment

TODO: how to deploy the project

Use npm start to run each of the applications locally. Properly configure the Frontend to either use the local or the Heroku backend.

## API Documentation
TODO: document API endpoints here
These are the API endpoints we took from Lab5 and modified slightly for now... as we solidify our data structures our endpoints will change.
```
# all music get:
curl -X GET "http://localhost:9090/api/music"

# create new music
curl -X POST -H "Content-Type: application/json" -d '{
    "title": "music 1",
    "tags": "electronica",
    "content":  "this will likely change in the future",
    "cover_url": "https://media.giphy.com/media/uscuTAPrWqmqI/giphy.gif"
}' "http://localhost:9090/api/music"

# update by MUSIC_ID
curl -X PUT -H "Content-Type: application/json" -d '{
    "title": "new title"
}' "http://localhost:9090/api/music/MUSIC_ID"

# fetch 1 by MUSIC_ID
curl -X GET "http://localhost:9090/api/music/MUSIC_ID"

# delete by MUSIC_ID
curl -X DELETE -H "Content-Type: application/json" "http://localhost:9090/api/music/MUSIC_ID"
```

## Authors

SeokJun Bing,
Ke Deng,
Van Nguyen,
Odon Orzik,
Dylan Scandinaro

## Acknowledgments
* This project was inspired by [this app](https://musiclab.chromeexperiments.com/Melody-Maker).
* API side based on Jun's Lab 5 code
