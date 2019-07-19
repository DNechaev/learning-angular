# Learning Angular



## Install
``` 
cd client/
npm install
ng build --prod

cd ..
docker-compose build --no-cache
docker-compose run app npm install
docker-compose down
```

## Use

**Docker**
``` 
docker-compose up
``` 

**App**
``` 
Goto url: http://localhost:8100/
``` 

**App Api**
``` 
Goto url:
- http://localhost:8100/api/users
- http://localhost:8100/api/roles
- http://localhost:8100/api/events
- http://localhost:8100/api/purchases
- http://localhost:8100/api/session/login
- http://localhost:8100/api/session/logout
- http://localhost:8100/api/session/profile
``` 

**Adminer**
```
host: http://localhost:8101
server: db
user: root
password: root
db: database_development
```

**Mysql**
``` 
host: localhost
port: 8102
user: root
password: root
```

**Demo DB**
```
Use Adminer for restore demo data (demo.sql)
```

