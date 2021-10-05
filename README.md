<h1 align='center'>
  <img src='.github/rentx_logo.png'>
</h1>

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img alt="License MIT" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
</div>

<p align="center">
  <a href="#interrobang-what-is-rentx">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-technologies">Technologies used</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#construction_worker-how-to-use-developing">How to use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#books-documentation">Docs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#confetti_ball-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#key-license">License</a>
</p>

--- 

## :interrobang: What is RentX?

RentX is a high-quality and well-rated car rental service. <br>
Analyze vehicle specifications, choose the one that best suits you. Save and travel safely! <br>

This API was developed in the NodeJS - Ignite Bootcamp, from Rocketseat. 🔥🚀 


## :rocket: Technologies:

This back-end project was developed using the following technologies:

- [Typescript][typescript]
- [Node.js][nodejs]
- [Docker][docker]
- [PostgreSQL][postgresql]
- [JEST][jest]
- [Swagger UI][swagger]


## :construction_worker: How to use: (developing)

To clone and run this API you will need the following software installed on your computer:

- [Git][git]
- [Node][nodejs]
- [Docker][docker]

### :electric_plug: Install dependencies and run the application:
```bash
# Clone this repository:
$ git clone https://github.com/i-ramoss/rentx.git

# Enter the repository:
$ cd RentX

# Install the dependencies:
$ yarn

# Create the app containers:
$ docker-compose up -d

# Start the server and the database:
$ docker-compose start

# Run the migrations:
$ yarn typeorm migrations:run

# The server is running at port 3333 (http://localhost:3333/)

# To stop the server and database:
$ docker-compose stop
```

### 🧪 Run the tests:
```bash
$ yarn test

# The coverage reports can be seen by going to /coverage/lcov-report/index.html and opening this html file in your browser. 
```

## :books: Documentation:
All API endpoints have been documented using Swagger. To view just access the URL below or click on this [link](http://localhost:3333/api-docs). <br>
*Remember to start the server first*

*http://localhost:3333/api-docs* 


## 📌 Project requeriments:
All rules for this API can be found on this [link](./docs/requeriments_en.md).


## :confetti_ball: How to contribute:

-  Make a fork;
-  Create a branch with your functionality: `git checkout -b <your_feature_name>`;
-  Submit the changes made: `git commit -am 'type(scope): <description>'`;
-  Push your branch: `git push origin <your_branch_name>`.

After your request is accepted and added to the project, you can delete your branch.


## :key: License:

This project in under MIT license, for more details check in [LICENSE][license]. <br>
Feel free to bring new features or fix problems, it will be a pleasure! 💜

---

<div align='center'>
  Made with 💚  by <strong>Ian Ramos</strong> 🔥
  <a href='https://www.linkedin.com/in/ian-ramos/'>Get in touch!</a>
</div>



[typescript]: https://www.typescriptlang.org/
[nodejs]: https://nodejs.org/en/
[express]: https://expressjs.com/pt-br/
[postgresql]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
[multer]: https://github.com/expressjs/multer
[swagger]: https://swagger.io/
[git]: https://git-scm.com
[docker]: https://www.docker.com/
[jest]: https://jestjs.io/

[license]: https://github.com/i-ramoss/Foodfy/blob/master/LICENSE
[linkedin]: https://www.linkedin.com/in/ian-ramos/