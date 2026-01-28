# =========================
# Build stage
# =========================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw && ./mvnw dependency:go-offline

COPY src src
RUN ./mvnw clean package -DskipTests

# =========================
# Runtime stage
# =========================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the JAR file (using wildcard to handle any JAR name)
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Use environment variables for configuration
# Render provides PORT environment variable automatically
CMD ["java", \
     "-Dserver.port=${PORT:-8080}", \
     "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}", \
     "-jar", "app.jar"]