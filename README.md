# tripPlan
tripPlan: app to plan trips
 
  
# dockerで起動 - Dockerfileのみでの環境構築

- Dockerfileがあるディレクトリに移動する 
 
```
cd {Dockerfileがあるディレクトリ}
```

- dockerでビルドする  
 
```
docker build . -t tripPlan-app:0.1
```
 
- コンテナの起動
  
```
docker container run -d -p 8080:8080 tripPlan-app:0.1
```

  又は  

```
docker container run --name app-container -d -p 8080:8080 tripPlan-app:0.1
```
  
***

# dockerで起動 - docker composeのみでの環境構築

dockerを立ち上げる

```
$ docker compose up -d
```
 
***

# dockerde起動 - docker compose、Dockerfileで環境構築

dockerイメージを作成して、dockerを立ち上げる。

```
$ docker-compose up --build
```
 
***

 
# ページにアクセスする  

Top画面  

```
http://localhost:8080/tripPlan/travel/
```
 ルート作成画面
 
```
http://localhost:8080/tripPlan/travel/tripPlans/createRoute
```
