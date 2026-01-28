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

COPY --from=builder /app/target/shopkart-backend.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
