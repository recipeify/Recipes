FROM node:carbon
ENV HOME /usr/src/
WORKDIR $HOME

RUN npm install -g nodemon

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
RUN yarn --offline --frozen-lockfile

WORKDIR $HOME/client

# copy files needed for the install
COPY ["client/src/styles.scss", "$HOME/client/src/"]

# the offline flag will mean that an error is raised if any
# module needs to be fetched remotely. It can be removed to allow
# yarn to fetch any missing modules if that was to happen.
RUN yarn --offline --frozen-lockfile

# copy the rest.. could be further broken up into multiple instructions
# for cache optimisation
COPY ./api/  $HOME/api/

# copy the rest.. could be further broken up into multiple instructions
# for cache optimisation
COPY ./client/  $HOME/client/

WORKDIR $HOME/api

EXPOSE 3000

CMD [ "yarn", "dev" ]
