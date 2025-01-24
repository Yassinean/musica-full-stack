# Step 1: Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the built JAR file from the host machine to the container
COPY target/*.jar app.jar

# Step 4: Expose the application port
EXPOSE 8080

# Step 5: Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
