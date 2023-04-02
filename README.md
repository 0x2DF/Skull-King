
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/0x2DF/Skull-King">
    <img src="client/src/assets/img/logo.jpg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Angular Skull King 2.0</h3>

  <p align="center">
    Skull king remastered
    <br />
    <!-- <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
    <a href="https://skull-king.onrender.com">View Demo</a>
    ·
    <a href="https://github.com/0x2DF/Skull-King/issues">Report Bug</a>
    ·
    <a href="https://github.com/0x2DF/Skull-King/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deployment">Deployment</a></li>
        <ul>
          <li><a href="#local">Local</a></li>
          <li><a href="#heroku">Heroku</a></li>
        </ul>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project



### Built With

* [![Angular][Angular.io]][Angular-url]
* [![Node JS][Node.js]][nodejs-url]
* [![Core UI][CoreUI.io]][coreui-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/0x2DF/Skull-King.git
   ```
2. Update npm dependencies and install NPM packages.
   ```sh
   npm i -g npm-check-updates
   ncu -u
   npm install
   ```
3. (Heroku only) Initialize heroku remote repository
   ```sh
   cd server
   heroku login
   git init
   ```


### Deployment

#### Local

0. Toggle local comments (to be refactored):
   ```js
   `./server/app.js`
   ```
1. Start client:
   ```sh
   cd client
   ng serve
   ```
2. Start server:
   ```sh
   cd server
   node app.js
   ```

#### Heroku

0. Toggle heroku comments (to be refactored):
   ```js
   `./server/app.js`
   ```
1. Build client:
   ```sh
   cd client
   ng build -c production
   ```
2. Copy dist to server:
   ```sh
   rm -r ./server/Public
   cp -r ./client/dist/skull-king ./server/Public/skull-king
   ```
3. Deploy changes:
   ```sh
   cd server
   git add .
   git commit -am "Deploying to heroku"
   git push heroku master
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Scoring
    - [ ] Bonus Points
- [ ] Game Settings
    - [ ] Game Modes
    - [ ] Timeout
- [ ] Timeout
    - [ ] Lobby
    - [ ] Betting
    - [ ] Playing
    - [ ] Trick Resolution
- [ ] Custom Cards
- [ ] Custom Game Modes
- [ ] Testing

See the [open issues](https://github.com/0x2DF/Skull-King/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>