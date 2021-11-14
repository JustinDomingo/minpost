# MiniPost

Want to express your ideas? Got random thoughts in your head that you want to share? Use MiniPost!

https://minpost.herokuapp.com/

## What is MiniPost?

MiniPost is a Facebook and Twitter-like social media application that allows registered users to share text posts with one another. When you first register an account, the application uses Express to utilize the 'bcrypt' and 'validate' package to validate the inputted user data. If the user data is valid, it will be pushed into a mongoDB database as a document and the user will be granted a session. From there, you will be taken to the home screen where you can view posts by other users. You can use the "Create Post" feature to post anything you want, just do not leave the text field blank. You can also delete and edit your own posts, but no one else's.

## Features

- Registration and login with Node authentication
- Sessions
- Create unique posts that are pushed to a mongoDB database
- Edit your posts
- Delete your posts

## Technologies Used
- #### Vanilla JavaScript
- #### Express
- #### Node
- #### MongoDB
- #### EJS
- #### CSS
- #### Sessions/Cookies

## API

### Base URL
```
https://minpost.herokuapp.com/api/
```

### Get Registered Users
```
GET method

/api/users
```
### Get Single User
```
GET method

/api/user/ENTERUSERNAMEHERE

/api/user/ENTERUSERIDHERE
```

### Get Posts
```
GET method

/api/data
```

### Validation Feature
```
POST method

/api/register
```
- This endpoint will validate the JSON user data that was sent. If it passes the validation, the API will respond with a JWT along with the validated user data. Note that the user data does not get pushed into a database, this endpoint is just for validation of user-inputted data.

### Login
```
POST method

/api/login
```
- This endpoint will check if the JSON user data that was sent matches the one saved in the "MiniPost" mongoDB database.

### Register
```
POST method

/api/react-register
```
- This endpoint will also validate the JSON data with the same technologies stated in the validation feature however, it will push the validated user data into the "MiniPost" mongoDB database.

