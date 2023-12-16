# Easy doctor

Easy doctor is a Chrome extention to help patients or relatives to simplify the complicated doctor notes

## Dependencies

### Node.js 18
### Mongodb 18
### React.js

## Installation

### Server

git clone this repo

```bash
git clone https://github.com/pli233/CS-Capstone.git
cd CS-Capstone
```

#### create a mongodb database
follow the instructions on [this site](https://www.mongodb.com/basics/create-database)

Go to the node folder and use nvm manager to install

copy the database uri into default.json file in config folder

#### Linux
```bash
cd node
sudo apt-get install nodejs npm
nvm install 18
nvm use 18
npm install
```

#### Mac
```bash
cd node
brew install nodejs npm
nvm install 18
nvm use 18
npm install
```

run the server

```bash
npm run server
```
Currently we do not have a public server. We may hold the server on AWS or Azure if possible in the future.

### Client


#### Linux
```bash
cd client
sudo apt-get install nodejs npm
npm install
```

#### Mac
```bash
cd client
brew install nodejs npm
npm install
```

#### Build the package
```bash
npm run build
```
#### Now you can see a folder build within the client folder

![Built file](https://lh3.googleusercontent.com/drive-viewer/AEYmBYS8Tjxv0LJ6zhxouHEh0Yk9fI8N14IKnHCUHCZ7s5W-IVnaUV6aLpjI6fjtG_1l1frcXK04f3HFtn_C-NQp-2r3wB5fJA=s2560)

#### Open chrome and open the option on the right top corner, click Manage Extention

![](https://lh3.googleusercontent.com/drive-viewer/AEYmBYRQ8SYGMiBbHYnl08NBXqVNzarngNONn7mvqjz-voiJyRChVrr3shq97iumfXgLC5lcdVcuIRuU2dHLxYrl0WGhX2gR=s1600)


#### In the extension page, turn on development mode, click the load unpacked, select the build folder mentioned above
![](https://lh3.googleusercontent.com/drive-viewer/AEYmBYSvyjkpgkiCOR61RQBUByHq1rFdRurpoCkp55mACT3uRAGfv72Xr_NoyHwVYuZVuBW0hrigO-ykMsezkgMrBoVadReq=s1600)

#### Now user has to manually upload the build folder onto extension. We are waiting for chrome store to verify our extension and hopefully it would be on aboard. 

## Usage

#### Open any page, right click on the page
![](https://lh3.googleusercontent.com/drive-viewer/AEYmBYSMmEM5kaCSASiT4QrmYQ_s_yvsMMY5LCcJpWtoumiFBAA7YTRH16jinq6yNtIkN6C4J3aiq4mu-edmmSG5XAKEA7nCXg=s2560)

#### Click the Easy doctor in the selection and then we can see the chatbot

![](https://lh3.googleusercontent.com/drive-viewer/AEYmBYTsJnmLGUGBUG7vanuqspjuw4AoGG3Q_bGGC8mu2dK_ifB64CM5NpCU2h-3gEfhO4xYOfKQWmjPXGrGwEAD8-e0bFk_=s1600)

[Video demo](https://drive.google.com/file/d/1NaEjaJHySwml7yJkE5sgYwD6cX4v_A2t/view?usp=drive_link)

## How the code works

### Server

For the backend as well as the server end, I use the Node.js and framework Express.js to serve the api. As you can see a folder named node, backend code is primarily in here. There are two types of interface.

#### Database

I use the mongodb as our persistence db. The user and query info would be stored in mongodb document. Since mongodb is mainly on cloud, it is easily to deploy and testing.

#### Interface
The interface is mainly built with REST API and communicate with frontend with HTTP/HTTPS
##### Credentials
One type of the api is for credentials such as creating an account, login, and verify user identity, which is in the auth.js and user.js. 
##### Post a query
Another type of the api is for user to post a query to the AI in file posts.js. And there are also two types api for query. The first api accepts text and images as a request body, and it would create a prompt in Chat-GPT and connect GPT using openai-api. Once successfully receives the response from AI, it would store the records in database and return the results to user.

The second api in posts.js allows user to fetch their history queries, so they do not need to make repetitive request if they have the same questions as before.

### Frontend

#### framework
React.js,
CSS,
HTML,
JS,

#### method

It is a little bit tricky since it is not a traditional web app but an extension app, so it should be installed as an extension into chrome. I use webpack to build the react files into the extension
#### Inject into original web
The file named contentScript.js in src could inject the react app into the originall webpage like a floating button, which is similar to an app named grammaly.
#### Communicate with server
The frontend using axios to post REST request to server end
#### Store the state
The frontend using redux to store the current state and variables
#### Route
Unlike traditional web route, I re-built the route method that would change the route of original web. The App.js is the main entrance for the app. And App.css is the UI design for the app.

#### Interaction

The app would authorized user first, which is a function in a file named auth.js in action folder. Only authorized user could use the app, otherwise they have to create a account

The Chatbox.js is the main structure of the UI, where user could chat with AI or fetch hitory records. User could type/paste words in the chatbox, or copy the image from somewhere else or by screenshot. The app would convert the image into base64 format and have a preview, then send to the backend.

The whole app is designed in a asynchrony method, the waiting time of the ai response would not block the user's operating 





## License

[MIT](https://choosealicense.com/licenses/mit/)
