# INSTRUCTIONS

## Generate a new migration:
* Open typeorm directory and run the command: `yarn typeorm migration:generate -n <migration name>` or `npm run typeorm migration:generate -n <migration name>`

## Run migrations:
* Still inside typeorm directory, run the command if dev: `yarn run migrate:dev` or `npm run migrate:dev`
* Still inside typeorm directory, run the command if production: `yarn typeorm migration:run` or `npm run typeorm migration:run`

## Attention - TYPEORM:
* Remember install typeorm modules typing the command inside its directory: `yarn` or `npm install`
* Environment variables needed. Create a .env directory with necessary variables.

## Docker  
### RUN SERVER
* docker-compose run --service-ports app

### RUN TESTS
* docker-compose run test

### USING GIT
* Copy your ssh files into ~/shared_ssh, the docker will import them

## Endpoints

## /signup

##### POST  
**request payload:**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; name: string,  
&nbsp;&nbsp;&nbsp;&nbsp; email: string,  
&nbsp;&nbsp;&nbsp;&nbsp;  password: string  
}  
**response payload:**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; token: string  
}  

## /signin
##### POST
**request payload:**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; email: string,  
&nbsp;&nbsp;&nbsp;&nbsp; password: string  
}  
**response payload:**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; token: string  
}  

## /validate-token
##### POST
**request payload**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; token: string  
}  
**response payload**  
{  
&nbsp;&nbsp;&nbsp;&nbsp; id: string | number,  
&nbsp;&nbsp;&nbsp;&nbsp; name: string,  
&nbsp;&nbsp;&nbsp;&nbsp; email: string  
}  

## /recover-password
### POST
**request payload**  
{  
    &nbsp;&nbsp;&nbsp;&nbsp; email: string  
}  

**response payload**  
{  
    &nbsp;&nbsp;&nbsp;&nbsp; message: string  
}  