# Recipes

This repo contains react frontend app and a node js express server, with elasticsearch hosted depolyment.

What you need to have installed locally - prerequitues:
- terminal (windows: gitbash)
- node js
- yarn
- nodemon: get it by `npm i -g nodemon`
- docker
- docker-compose

Create a .env file located at /api/.env and paste there
`ELASTIC_SEARCH_HOST=`(address sent personally)

To install all the dependencies:
```
cd api
yarn
cd ../client
yarn
```

To run both client and server at once:
```
cd api
yarn dev
```

To run elasticsearch + recipeify service in containers:
```
docker-compose up
```