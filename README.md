# Learning Angular



## Install
``` 
cd ../client
npm install
ng build 

cd ..
docker-compose build --no-cache
docker-compose run app npm install
docker-compose up -d
cat ./server/demo.sql | docker-compose exec -T db /usr/bin/mysql -u root --password=root database_development
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
- http://localhost:8090/api/..
``` 

**Adminer**
```
host: localhost:8091
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



