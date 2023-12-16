# Easy doctor

Easy doctor is a Chrome extention to help patients or relatives to simplify the complicated doctor notes

## Dependencies

### Node.js 18
### Mongodb
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

## What works & what doesn’t

Our current project streamlines the translation of medical information by providing users with a seamless interface for input. The accompanying plugin facilitates file uploading, allowing users to effortlessly translate medical content from saved PDF files. The translated information is stored, enabling users to conveniently access and review their search records. Quick retrieval of previous content is made possible through a simple click on the stored records, eliminating the need for repetitive searches and saving valuable time.

Given the sensitive nature of medical data, we prioritize user privacy. To safeguard information and prevent unauthorized access, we've implemented a secure login page. Users create individual accounts, complete with personalized passwords, to access and utilize the platform. The safeguarded environment ensures that previous search records and translations remain confidential until the user logs in.

In our commitment to enhancing user experience, we've integrated the translation feature into a floating chat bot. This intuitive design allows users to easily locate and minimize the chat bot when not in use, ensuring it doesn't interfere with other interface operations. This thoughtful approach optimizes efficiency and convenience for users engaging with medical records and information.

What doesn't work is that we cannot increase the speed of generating the translation result based on the current technological limitations, particularly in enhancing translation speed through our AI vendor. When users transmit a large amount of information to out chat bot, our AI vendor needs some time to process it, even though the waiting time is not too long. To alleviate this issue, we designed a rotating icon to enhance the user experience, allowing them to see the icon while waiting and let them know that we are translating for them.

## What would us work on next

Enhancing Translation Speed:
Address the challenge of translation speed by exploring ways to optimize the efficiency of the AI vendor. This may involve evaluating alternative technologies or methodologies to reduce processing times while maintaining translation accuracy.

Enable one click screenshot function:
Users can upload the entire medical information of the webpage to the chat bot and translate it by clicking the screenshot button on the chat bot. 

User Feedback and Experience:
Gather user feedback to understand their experience with the floating chatbot and the overall platform. Identify any pain points, suggestions, or additional features that users may find beneficial. This information can guide future enhancements to improve usability and satisfaction.

Incorporate Additional File Formats:
Consider expanding the file formats supported by the translation plugin. This could involve incorporating compatibility with various document types beyond PDF, ensuring that users can seamlessly translate medical content from a broader range of sources.






















