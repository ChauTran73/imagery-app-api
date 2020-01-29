# Imagery App Server
Imagery is a social app where user can log in to see a showcase of beautifully displayed images posted by other users. User is able to interact with the app through posting their own images, saving images to their personal wall,and commenting on their own and others' images. 

###### ***Creator***
  [Chau Tran](https://github.com/ChauTran73) <br />
 

## Links

[Live Link to App](https://imagery-app.cmtran7393.now.sh/) <br />  

Link to Client Repo
- [https://github.com/ChauTran73/imagery-app](https://github.com/ChauTran73/imagery-app)

Link to API Repo
- [https://github.com/ChauTran73/imagery-app-api](https://github.com/ChauTran73/imagery-app-api)

## Set up

Complete the following steps to clone the server:

1. Clone this repository to your local machine `git clone https://github.com/ChauTran73/imagery-app-api`
2. `cd` into the cloned repository
4. Install the node dependencies `npm i`
5. For the first time, create a database user `createuser --interactive dunder-mifflin`
6. Don't set a password for the database.
7. Create the database `createdb -U dunder-mifflin imagery-app`
8. Create the test database `createdb -U dunder-mifflin imagery-app-test`
9. Run the migrations `npm run migrate`


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run the migrations `npm run migrate`

Run migrations for test database `npm run migrate:test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch
