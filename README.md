# Online website for online voting

<img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/public/images/voteme-logo.png">

## Things you should know.
1. This project is implementing on Express JS and EJS template.
2. If you read my code, you will find someting interesting.
3. The code is a small maze.
4. The candidate is kinda static. You can have only 2 candidates. However, if you want to add more, I recommend you to look at 
    - /front-end
      - vote-page.ejs
      - script.js and chart.js
    - /back-end
      - I think back-end is fine.

This project, involved reCAPTCHA v2 from Google(https://www.google.com/recaptcha/) and Mailtrap(https://mailtrap.io/). If you want to clone this repository, I recommended you register on both platforms. Don't know where to start [How to set up](https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/wiki/How-to-set-up)

## Features
1. Email verfication.  
2. reCAPTCHA at login page.

## Simplest Database design.
<img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/public/images/election_db_diagram.png">
The user is an anonymous vote, as you can see from my complex database. You can only tell if a user has voted or not, but you can't tell who voted for whom.

## Enviroment file

```bash
#reCAPTCHA v2
RECAPTHA_SECRETKEY = <Get if from Google reCAPTCHA>
#MySQL local dB
DB_HOST = ""
DB_USER = ""
DB_PASSWORD = ""
DB_NAME = ""
#session
SESSION_SECRET = <Your secret code>
#jwt
JWT_SECRET = <Your secret code>
#mailtrap
MAIL_USER = <Get if from Mailtrap>
MAIL_PASS = <Get if from Mailtrap>
```

## Example of the UI

### Homepage
<p align="center"><img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/giphy-homepage.gif"></p>

### Login
<p align="center"><img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/giphy-login.gif"></p>

### Register
<p align="center"><img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/giphy-register.gif"></p>

### Vote
<p align="center"><img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/giphy-vote-page.gif"></p>


## Important thing. 
You can support the developer by(If you live in Thailand). just kindding, it's totally free.
<p align="center"><img src="https://github.com/itsmebabysmiley/online-voting-nodejs-ejs/blob/main/public/images/donate/donateQR.jpg" width="250px"></p>
