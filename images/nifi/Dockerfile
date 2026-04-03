# Big Data Platform - Apache NiFi Image
# NiFi for data ingestion

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache NiFi 1.15.3"

# NiFi version
ENV NIFI_VERSION=1.15.3
ENV NIFI_HOME=/opt/nifi/nifi-1.15.3
ENV NIFI_CONF_DIR=${NIFI_HOME}/conf

# Create directories first
RUN mkdir -p /opt/nifi

# Install NiFi
RUN wget -q https://archive.apache.org/dist/nifi/1.15.3/nifi-1.15.3-bin.tar.gz && \
    tar -xzf nifi-1.15.3-bin.tar.gz -C /opt/nifi/ && \
    rm nifi-1.15.3-bin.tar.gz && \
    ln -s /opt/nifi/nifi-1.15.3 /opt/nifi/current

# Create directories
RUN mkdir -p ${NIFI_HOME}/logs \
    /data/nifi \
    /flowfile_repository \
    /content_repository \
    /provenance_repository \
    /state \
    && chown -R hadoop:hadoop /opt/nifi /data/nifi /flowfile_repository /content_repository /provenance_repository /state

# Copy configuration
COPY config/nifi/* ${NIFI_CONF_DIR}/

# Environment variables
ENV NIFI_HOME=/opt/nifi/current
ENV NIFI_LOG_DIR=${NIFI_HOME}/logs
ENV PATH=${NIFI_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 8443 8080 8081 8443

WORKDIR /opt/nifi/current

CMD ["/bin/bash"]
