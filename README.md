# Recipes

This repo contains react frontend app and a node js express server, with elasticsearch hosted depolyment.

### What you need to have installed locally - prerequitues:
- terminal (windows: gitbash)
- node js
- yarn
- nodemon: get it by `npm i -g nodemon`
- docker
- docker-compose

Create a .env file located at /api/.env and paste there
`ELASTIC_SEARCH_HOST=`(address sent personally)

### To install all the dependencies:
```
cd api
yarn
cd ../client
yarn
```

### To run both client and server at once:
```
cd api
yarn dev
```

### Basic Docker usage:
```
docker images # display all local images
docker ps # all running containers
dcoker run .... # run a container with lots of options like attached/detached, ports exposed, etc
docker build ... # build a docker using a docker Dockerfile
docker tag ... # tag a current version of a docker saving any new layers
```
Futher usage can be found easily using Google search and [this cheatsheet](https://www.docker.com/sites/default/files/d8/2019-09/docker-cheat-sheet.pdf)

### To run elasticsearch (with sample recipes) in an attached/detached container:
```
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" [-d] hagais/es-recipes:0.2
```
then make sure that .env has `ELASTIC_SEARCH_HOST=http://localhost:9200` set before runing `yarn`


### To run elasticsearch + recipeify service in containers:
```
# in main repo dir
docker-compose build
docker-compose up
```