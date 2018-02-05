# Basic docker image for RocketMap
# Usage:
#   docker build -t rocketmap .
#   docker run -d -P rocketmap -a ptc -u YOURUSERNAME -p YOURPASSWORD -l "Seattle, WA" -st 10 --gmaps-key CHECKTHEWIKI

FROM alpine

EXPOSE 8080

WORKDIR /Documentos/GitHub/kofre-nTopus

CMD ["-h"]

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
 && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
 && echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list \
 && apt-get update \
 && apt-get install -y mongodb-org \
 && apt-get update \
 && apt-get install nodejs \
 && apt-get install npm

COPY package.json /Documentos/GitHub/kofre-nTopus

RUN npm install \
 && nodemon server.js

COPY . /Documentos/GitHub/kofre-nTopus
