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

