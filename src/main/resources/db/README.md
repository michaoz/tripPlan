# tripPlan
tripPlan: app to plan trips
 
  
# Execute in Docker - build the env with Dockerfile only

- Move to the directory where Dockerfile is 
 
```
cd {Dockerfile directory}
```

- build in docker  
 
```
docker build . -t tripPlan-app:0.1
```

### Create DB with sql files
- sql files
 
```
\tripPlan\src\main\resources\db\sql\
```
 
### DB in a local environment

- Log in PostgreSQL
 
```
psql -U { user_name } -h localhost -p 5432 -d { db_name }
```
 

