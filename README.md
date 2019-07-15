# Learning Angular



## Install
``` 
cd client/
npm install
ng build 

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
Goto url: http://localhost:8090/
``` 

**App Api**
``` 
Goto url:
- http://localhost:8090/api/users
- http://localhost:8090/api/roles
- http://localhost:8090/api/events
- http://localhost:8090/api/purchases
- http://localhost:8090/api/session/login
- http://localhost:8090/api/session/logout
- http://localhost:8090/api/session/profile
``` 

**Adminer**
```
host: http://localhost:8091
server: db
user: root
password: root
db: database_development
```

**Mysql**
``` 
host: localhost
port: 8092
user: root
password: root
```

**Demo DB**
```
Use Adminer for restore demo data (demo.sql)
```

