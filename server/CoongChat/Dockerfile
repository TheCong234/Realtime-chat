# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY CoongChat.slnx ./
COPY CoongChat.API/CoongChat.API.csproj ./CoongChat.API/
COPY CoongChat.Application/CoongChat.Application.csproj ./CoongChat.Application/
COPY CoongChat.Domain/CoongChat.Domain.csproj ./CoongChat.Domain/
COPY CoongChat.Infrastructure/CoongChat.Infrastructure.csproj ./CoongChat.Infrastructure/

# Restore dependencies
RUN dotnet restore CoongChat.API/CoongChat.API.csproj

# Copy all source code
COPY . .

# Build and publish
WORKDIR /src/CoongChat.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy published app
COPY --from=build /app/publish .

# Create uploads directory
RUN mkdir -p /app/wwwroot/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5053

ENV ASPNETCORE_URLS=http://+:5053
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CoongChat.API.dll"]
