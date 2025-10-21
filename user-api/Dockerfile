# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x ./mvnw
# Download project dependencies
RUN ./mvnw dependency:go-offline

# Copy the project source code
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/user-api-0.0.1-SNAPSHOT.jar"]