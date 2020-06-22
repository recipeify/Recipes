FROM node:erbium-alpine as builder
ENV HOME /usr/src/
ENV NODE_ENV production
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}
ENV REACT_APP_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}
ENV REACT_APP_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE}
WORKDIR $HOME

# copy the tarballs
COPY ["api/yarn-offline-mirror", "$HOME/api/yarn-offline-mirror/"]

# copy the tarballs
COPY ["client/yarn-offline-mirror", "$HOME/client/yarn-offline-mirror/"]

# copy files needed for the install
COPY ["api/package.json", "api/yarn.lock", "api/.yarnrc", "$HOME/api/"]

# copy files needed for the install
COPY ["client/package.json", "client/yarn.lock", "client/.yarnrc", "$HOME/client/"]

WORKDIR $HOME/api

# the offline flag will mean that an error is raised if any
# module needs to be fetched remotely. It can be removed to allow
# yarn to fetch any missing modules if that was to happen.
RUN yarn --offline --frozen-lockfile --production=true

WORKDIR $HOME/client

# copy files needed for the install
COPY ["client/src/styles.scss", "$HOME/client/src/"]

# the offline flag will mean that an error is raised if any
# module needs to be fetched remotely. It can be removed to allow
# yarn to fetch any missing modules if that was to happen.
RUN yarn --offline --frozen-lockfile --production=true

# copy the rest.. could be further broken up into multiple instructions
# for cache optimisation
COPY ./client/  $HOME/client/

# Build
RUN yarn build

FROM node:erbium-alpine
ENV HOME /usr/src/
ENV NODE_ENV production
WORKDIR $HOME

RUN npm install -g nodemon

# copy api node_modules
COPY --from=builder $HOME/api/node_modules $HOME/node_modules

# copy build dir of react app
COPY --from=builder $HOME/client/build $HOME/build

# copy api code
COPY ./api/  $HOME/

EXPOSE 5000

ENTRYPOINT [ "nodemon", "server.js" ]
