# === Stage 1: build backend + frontend ===
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Instalacja Node.js i npm globalnie
RUN apt-get update && apt-get install -y curl gnupg2 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Sprawdzenie wersji Node i npm (opcjonalnie)
RUN node -v
RUN npm -v

# Pobranie zależności Maven offline
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# Kopiowanie kodu źródłowego
COPY src ./src

# Budowanie frontendu osobno przed Mavenem
WORKDIR /app/src/main/frontend
RUN npm ci
RUN npm run build

# Wróć do katalogu głównego i buduj backend
WORKDIR /app
RUN mvn -DskipTests clean package

# === Stage 2: runtime ===
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV TZ=${TZ:-Europe/Warsaw} \
    SPRING_PROFILES_ACTIVE=docker
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
