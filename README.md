# Le Documentaire
---
Manage all your documents in one place, for the workspace.

### Pivotal Tracker Stories
---
https://www.pivotaltracker.com/n/projects/2072191

### Setup Project
---

- Clone this repository to your desktop using the command `$ git clone https://github.com/LWanjiru/le-documentaire.git`

- Change directories into the repository directory using command `$ cd le-documentaire`

- For the current branch `$ git checkout feature/148963113/build-backend-with-tdd` and then install the dependencies using `$ npm install`

- Ensure that you have [Postgresql](https://www.postgresql.org) installed and set up, and a client like [Postico](https://eggerapps.at/postico/) running to connect to your database.

- We will also be using the promised based ORM [Sequelize](http://docs.sequelizejs.com) and the [Sequalize cli](http://docs.sequelizejs.com/manual/tutorial/migrations.html), which we already installed with the other `npm` packages.

- Once you have set up your `PostgreSQL` database; I've named mine `documentor-dev`.  (See server/config/config.json for database configurations). and change the `username` with your useraname and the `password` too, if you choose to have one.  

- Run `$ sequelize db:migrate && sequelize db:seed:all` . This will create Role, User and Document tables in your database, alongside a SequelizeMeta table which contains details of the migration files. The second part will populate the `Role` and `user` tables with `admin` & `regular` roles, and a corresponding user for each role in the `User` table.

- Create a file named `config.js` in the `server/config` folder and create your `secret` which will be used when signing your token for authentication. 

- You will need [Postman](https://www.getpostman.com/postman) to view the endpoints and how they work, and also to be able to login with your token credentials and access the protected routes.


- Now that you are done with the set up, use `$ nodemon` to start the server and on `Postman` select `GET` and use the address `http://localhost:8000/` and you should see the following message:

 ```
{
    "message": "No Public documents. Sign up to create one."
}
```
- You are now connected to the server. Checkout the `server/routes/Routes.js` file for the currently available routes and the required permissions. 
-  You can also check out the Documentation here app.apiary.io/ledocumentaire 

```
NB: To use the login `token` provided. Add it as an `x-access-token` attributes in your header after each login as a different user. 

```


[![Build Status](https://travis-ci.org/LWanjiru/le-documentaire.svg?branch=master)](https://travis-ci.org/LWanjiru/le-documentaire)
[![Code Climate](https://codeclimate.com/github/LWanjiru/le-documentaire/badges/gpa.svg)](https://codeclimate.com/github/LWanjiru/le-documentaire)
[![Test Coverage](https://codeclimate.com/github/LWanjiru/le-documentaire/badges/coverage.svg)](https://codeclimate.com/github/LWanjiru/le-documentaire/coverage)
[![Issue Count](https://codeclimate.com/github/LWanjiru/le-documentaire/badges/issue_count.svg)](https://codeclimate.com/github/LWanjiru/le-documentaire)