FROM debian:bookworm-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y curl unzip tar git build-essential

# Install JDK 23 manually from Adoptium (Eclipse Temurin)
RUN curl -L -o jdk.tar.gz https://github.com/adoptium/temurin23-binaries/releases/download/jdk-23%2B14/OpenJDK23U-jdk_x64_linux_hotspot_23_14.tar.gz && \
    mkdir -p /opt/java && \
    tar -xzf jdk.tar.gz -C /opt/java --strip-components=1 && \
    rm jdk.tar.gz
ENV JAVA_HOME=/opt/java
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install Maven manually
ARG MAVEN_VERSION=3.9.6
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz | tar -xz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven
ENV PATH="/opt/maven/bin:$PATH"

# Build the Spring Boot app
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ───────────────────────────────────────
# Runtime stage: use same JDK 23 or JDK 21
FROM debian:bookworm-slim

# Install JDK 23 runtime
RUN curl -L -o jdk.tar.gz https://github.com/adoptium/temurin23-binaries/releases/download/jdk-23%2B14/OpenJDK23U-jdk_x64_linux_hotspot_23_14.tar.gz && \
    mkdir -p /opt/java && \
    tar -xzf jdk.tar.gz -C /opt/java --strip-components=1 && \
    rm jdk.tar.gz
ENV JAVA_HOME=/opt/java
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
