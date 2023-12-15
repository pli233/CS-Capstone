# Easy doctor

Easy doctor is a Chrome extention to help patients or relatives to simplify the complicated doctor notes

## Installation

### Server

git clone this repo

```bash
git clone https://github.com/pli233/CS-Capstone.git
cd CS-Capstone
```

Go to the node folder and use manager to install

#### Linux
```bash
cd node
sudo apt-get install nodejs npm
npm install
```

#### Mac
```bash
cd node
brew install nodejs npm
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

## License

[MIT](https://choosealicense.com/licenses/mit/)
