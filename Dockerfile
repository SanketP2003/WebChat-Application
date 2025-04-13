FROM eclipse-temurin:23-jdk-jammy as builder

ARG MAVEN_VERSION=3.9.6
ENV MAVEN_HOME=/opt/maven
ENV PATH=${MAVEN_HOME}/bin:$PATH

RUN apt-get update && \
    apt-get install -y curl tar && \
    curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz -o maven.tar.gz && \
    tar -xzf maven.tar.gz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} ${MAVEN_HOME} && \
    rm maven.tar.gz && \
    apt-get clean

WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:23-jdk-jammy

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
