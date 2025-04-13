# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-23 AS builder

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application using OpenJDK 23
FROM openjdk:23-jdk

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
