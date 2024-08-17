### Dockerfile のみを使用した場合
#FROM tomcat:8.5-jdk15-openjdk-slim

#ENV CATALINA_HOME /usr/local/tomcat
#ENV PATH $CATALINA_HOME/bin:$PATH

#WORKDIR ${CATALINA_HOME}
#COPY app-src/tripPlan.war webapps/tripPlan.war

###


### Dockerfile, docker-compose を使用した場合
FROM tomcat:8.5-jdk11-openjdk-slim

#ADD app-src/tripPlan.war /usr/local/tomcat/webapps/
COPY app-src/tripPlan.war /usr/local/tomcat/webapps/tripPlan.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
###
 
