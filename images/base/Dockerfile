# Big Data Platform - Base Image
# Ubuntu 22.04 with JDK 11

FROM ubuntu:22.04

LABEL maintainer="Big Data Platform Team"
LABEL description="Base image with JDK 11"

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    vim \
    net-tools \
    iputils-ping \
    openssl \
    ca-certificates \
    unzip \
    git \
    python3 \
    python3-pip \
    rsync \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install JDK 11 (Eclipse Temurin)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && wget -q -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add - \
    && echo "deb https://packages.adoptium.net/artifactory/deb $(. /etc/os-release && echo $VERSION_CODENAME) main" | tee /etc/apt/sources.list.d/adoptium.list \
    && apt-get update \
    && apt-get install -y temurin-11-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set Java environment
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH=$JAVA_HOME/bin:$PATH

# Set working directory
WORKDIR /opt

# Create data directories
RUN mkdir -p /data /workspace

CMD ["/bin/bash"]