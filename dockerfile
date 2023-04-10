FROM node:18.12.0

RUN mkdir -p /app
WORKDIR /app
ADD . /app/

RUN rm package-lock.json || trues
RUN npm install
# pm2 설치
RUN npm install -g pm2 
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 5000

CMD [ "npm", "run", "start:prod"]