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
 
### ローカルDB環境

- psqlにログインする 
 
```
# postgresユーザー、psqlデータベース
psql -U psql -h localhost -p 5432 -d psql
　
# workuserユーザー、db_workデータベース
psql -U workuser -h localhost -p 5432 -d db_work
workuser_pass
```
 

