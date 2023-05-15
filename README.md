# Le Documentaire

- Manage all your documents in one place, for the workspace.
---

### Setup Project

- Clone this repository to your desktop using the command `$ git clone https://github.com/LWanjiru/le-documentaire.git`

- Change directories into the repository directory using command `$ cd le-documentaire`

- For the current branch `$ git checkout feature/148963113/build-backend-with-tdd` and then install the dependencies using `$ npm install`

- Ensure that you have [Postgresql](https://www.postgresql.org) installed and set up, and a client like [Postico](https://eggerapps.at/postico/) running to connect to your database.

- We will also be using the promise-based ORM [Sequelize](http://docs.sequelizejs.com) and the [Sequalize cli](http://docs.sequelizejs.com/manual/tutorial/migrations.html), which we already installed with the other `npm` packages.

- Once you have set up your `PostgreSQL` database; I've named mine `documentor-dev`.  (See server/config/config.json for database configurations). and change the `username` with your useraname and the `password` too, if you choose to have one.  

- Run `$ sequelize db:migrate && sequelize db:seed:all` . This will create Role, User and Document tables in your database, alongside a SequelizeMeta table which contains details of the migration files. The second part will populate the `Role` and `user` tables with `admin` & `regular` roles, and a corresponding user for each role in the `User` table.

- Create a file named `config.js` in the `server/config` folder and create your `secret` which will be used when signing your token for authentication. `NOTE`: This file should be added to `.gitignore` as it contains authentication information.

- You will need [Postman](https://www.getpostman.com/postman) to view the endpoints and see how they work, and also to be able to login with your token credentials and access the protected routes.


- Now that you are done with the set up, use `$ nodemon`(if you have it installed globally) or run `$ npm run start-server` to start the server.

- Go to `Postman`, select `GET` and use the address `http://localhost:8000/` and you should see the following message:

 ```
{
    "message": "No Public documents. Sign up to create one."
}
```
- You are now connected to the server. Checkout the `server/routes/Routes.js` file for the currently available routes and the required permissions. 
-  You can also check out the Documentation here [app.apiary.io/ledocumentaire](apiary.apib)

```
NB: To use the login `token` provided. Add it as an `x-access-token` attributes in your header after each login as a different user. 

```
---

### Testing

- Make sure that you have your databases for the different environments configured as per the guidance in the `Setup` section of this README document.

- Run `$ npm test` to view the tests and the test coverage.
---

[![Build Status](https://travis-ci.org/LWanjiru/le-documentaire.svg?branch=master)](https://travis-ci.org/LWanjiru/le-documentaire)
[![CodeFactor](https://www.codefactor.io/repository/github/lwanjiru/le-documentaire/badge/master)](https://www.codefactor.io/repository/github/lwanjiru/le-documentaire/overview/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b3c503b6f009d7af676c/maintainability)](https://codeclimate.com/github/LWanjiru/le-documentaire/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b3c503b6f009d7af676c/test_coverage)](https://codeclimate.com/github/LWanjiru/le-documentaire/test_coverage)
[![Issue Count](https://codeclimate.com/github/LWanjiru/le-documentaire/badges/issue_count.svg)](https://codeclimate.com/github/LWanjiru/le-documentaire)
