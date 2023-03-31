# Chat AI Plugin

This is a free project that you can use to practice your skills with ChatGPT.

This version is free and it's my first project where I want to share my knowledge about artificial intelligence.

## About The Plugin

The plugin is made for Wordpress using PHP and React.js in the frontend with nex structure of folders

```
/ 
/ chat-ai.php: config of WordPress
/ admin.php: panel from admin of wordpress when will config the content of the company and will set the api of OpenAI
/ frontend/: Folder project on React, I will comment the code in the future
/ dist/: generated code from ReactJs project. this folder is detected from frontend.php file and you could generate all versions and it will be detected because php will call to manifest.json to know the generated files names 
/ assets/: has images 
```

## Init react.js project

```sh 
npm install
```

## Generate react.js project

```sh 
npm run build
```

## Test your reactjs project without to build it 


- BUILD_PATH: path where the project will generate
- REACT_APP_PLUGIN_PATH: url from your plugin is run and dirige it to assets folder

```plaintext
BUILD_PATH=../dist
REACT_APP_PLUGIN_PATH=http://portfolio.local/wp-content/plugins/chat-plugin-ai/assets

```

## Other information

The plugin sometimes has error because the connection is lost, I will code it in the future