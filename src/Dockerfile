#Use Node JS v16.x as base image
FROM node:latest

#Create server  dictionary inside image
WORKDIR /app

#Copy the package json file
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the server code 
COPY . .

#Expose server port
EXPOSE 4000

#Start server using npmm script
CMD ["npm", "run", "start"]