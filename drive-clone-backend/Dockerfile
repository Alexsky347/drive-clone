FROM openjdk:21-slim AS base
LABEL authors="ald"

# Set working directory
WORKDIR /app

# Copy JAR file
COPY build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build Stage (Optional - for multi-stage builds)
FROM openjdk:21-alpine AS final

# Copy only the JAR from the base stage
COPY --from=base /app/app.jar app.jar

# Expose port
EXPOSE 8080

# Set default command (same as entrypoint)
CMD ["java", "-jar", "app.jar"]