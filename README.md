# Upload Photos Web App

![Upload Photos Web App Screenshot](https://github.com/louisefindlay23/photo-uploading/assets/26024131/24b5213b-963a-4d7c-a5f8-0838d9fbdeab)

## Purpose

Develop a simple Node.js web app to upload photos as an example for a future tutorial.

## Technologies

The web app uses Node.js with Express as the web server. 

Multer uploads a photo, Sharp resizes the photo to 300px, and fs saves the photo in the `/public/img/uploads` directory. Then, the file's information is stored in a MongoDB collection, the user is redirected back to the homepage, and the photo gallery is displayed using EJS templating. 

The PlainCSS framework is used for input and text styling.

<div>
    <img src="https://api.iconify.design/devicon:nodejs.svg" width="64px" />
    <img src="https://api.iconify.design/devicon:express.svg" width="64px" />
    <img src="https://www.svgrepo.com/show/373574/ejs.svg" width="64px" />
    <img src="https://api.iconify.design/devicon:mongodb.svg" width="64px" />
</div>
