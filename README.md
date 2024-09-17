# tripPlan
tripPlan: app to plan trips
 
  
# Execute in Docker - build the env with a Dockerfile only

- Move to the directory where Dockerfile is. 
 
```
cd {Dockerfile directory}
```

- Build with docker
 
```
docker build . -t tripPlan-app:0.1
```
 
- Start container
  
```
docker container run -d -p 8080:8080 tripPlan-app:0.1
```

  or

```
docker container run --name app-container -d -p 8080:8080 tripPlan-app:0.1
```
  
***

# Execute in Docker - build the env with docker compose only

Start docker

```
$ docker compose up -d
```
 
***

# Execute in dockerde - build the env with docker compose, Dockerfile

Create a docker image and then start docker.

```
$ docker-compose up --build
```
 
***

 
# Access to pages  

Top page

```
http://localhost:8080/tripPlan/travel/
```
Route page
 
```
http://localhost:8080/tripPlan/travel/tripPlans/createRoute
```
