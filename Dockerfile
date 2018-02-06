FROM node

RUN npm install mongoose

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5

ENV HOME=/home/app

COPY package.json $HOME/library/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/library
RUN npm install --silent --progress=false

USER root
COPY . $HOME/library
RUN chown -R app:app $HOME/*
USER app

CMD ["npm", "start"]
