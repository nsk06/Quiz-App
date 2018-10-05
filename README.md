# Quiz-App
A Quiz built using Gin-golang framework and react

About the assignment

    The goal is to build a fully functional Quiz APP using Go and React along with RESTful API.

Go
Setting up

    For Ubuntu: Look here
    For MacOS: Look here
    Apart from above tutorial, add the following to your .bashrc:

              export GOBIN=$GOPATH/bin

    All your code (across projects) goes into one folder. So have your environment variables set up specific to where your code is.
    bin stores executables, pkg stores external packages, src has all your source code.

Basics
        Each package must consist of a directory along with a .go file of the same name inside the directory.
    Installing third party packages; use go get. An example:-

        go get -u -v gopkg.in/mgo.v2

    Packages used in this app -

              go get -u -v github.com/gin-gonic/gin
              go get -u -v github.com/jinzhu/gorm
              go get -u -v github.com/jinzhu/gorm/dialects/sqlite
              go get -u -v github.com/gin-contrib/cors
			  go get -u -v  github.com/qor/admin

    To run a program:-

              go run APIs.go

Building the server

React
Setting up

    First, install node. Then install yarn (because npm is not very nice)
    Ubuntu:

              curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
              sudo apt-get install -y nodejs
              npm install -g yarn
              yarn global add create-react-app

    MacOS:

              brew install node
              npm install -g yarn
              yarn global add create-react-app

    Then, create a new React application by running the following:

              create-react-app name_of_app

    You can run the app by running yarn start
    node_modules contains all your external packages.
Starting  the app
    To add the router to your application:-

              yarn add react-router-dom

    To run the Front side server app I've made, run the following from inside the react-app directory:-

              yarn start

Feautures:
user can signup via different links
login and redirection to profile where he can see his progress
Admin access to a user
Play quiz according to genres 
Different types of question via
single correct 
multi correct
image reco
audio
image options
Bonus:
50-50 lifeline
If all correct then double the score
