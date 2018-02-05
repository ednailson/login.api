FROM node:7.10.1

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@4.2.0

ENV HOME=/home/app

COPY package.json $HOME/library/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/library
RUN npm cache clean && npm install --silent --progress=false

USER root
COPY . $HOME/library
RUN chown -R app:app $HOME/*
USER app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
 && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
 && echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list \
 && apt-get update \
 && apt-get install -y mongodb-org

CMD ["npm", "start"]
