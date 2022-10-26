# MULTI STAGE

# BUILD
FROM arm64v8/gradle:6-jdk17-focal AS build
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle settings.gradle $APP_HOME

COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src
RUN gradle build --stacktrace || return 0
COPY . .
RUN gradle clean build

#APP CONTAINER
FROM arm64v8/eclipse-temurin:17-jre
ENV ARTIFACT_NAME=springHexagonal-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY --from=build $APP_HOME/build/libs/$ARTIFACT_NAME .
EXPOSE 8080
ENTRYPOINT exec java -jar ${ARTIFACT_NAME}
