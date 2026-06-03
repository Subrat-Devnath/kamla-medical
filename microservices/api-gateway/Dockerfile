# Base image for running Java applications
FROM eclipse-temurin:17-jre-jammy

# Set the working directory inside the container
WORKDIR /home

# Copy the JAR file from your build context into the container
# Ensure that the 'target' directory is in the same location as your Dockerfile
COPY target/api-gateway-1.0.jar api-gateway-1.0.jar

# Copy the entrypoint script
COPY docker-entrypoint.sh docker-entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 8079

# Define the entrypoint script
# This will be executed when the container starts
ENTRYPOINT ["/home/docker-entrypoint.sh"]

# Define the default command to be passed to the entrypoint script
# This is typically the command to run your Java application
CMD ["api-gateway-1.0.jar"]