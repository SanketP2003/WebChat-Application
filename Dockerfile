FROM debian:bookworm-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y curl zip unzip git tar

# Install SDKMAN and JDK 23
RUN curl -s "https://get.sdkman.io" | bash && \
    bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install java 23.ea.9-open"

# Install Maven manually
ARG MAVEN_VERSION=3.9.6
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz | tar -xz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven
ENV PATH="/opt/maven/bin:$PATH"

# Build your app
WORKDIR /app
COPY . .
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk use java 23.ea.9-open && mvn clean package -DskipTests"

# Runtime image (optional: use JDK 21 unless JDK 23 runtime is critical)
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
