### INSTRUCTIONS

# Generate a new migration:
* Open typeorm directory and run the command: `yarn typeorm migration:generate -n <migration name>` or `npm run typeorm migration:generate -n <migration name>`

# Run migrations:
* Still inside typeorm directory, run the command: `yarn typeorm migration:run` or `npm run typeorm migration:run`

# Attention - TYPEORM:
* Remember install typeorm modules typing the command inside its directory: `yarn` or `npm install`
* Environment variables needed. Create a .env directory with necessary variables.

# Endpoints

## /signup
* POST
**request payload**  
{  
    name: string,  
    email: string,  
    password: string  
}  

**response payload**  
{  
    token: string  
}  

## /signin
* POST  
**payload**  
{  
    email: string,  
    password: string  
}  

**response payload**  
{  
    token: string  
}  