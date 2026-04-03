# Big Data Platform - Apache HBase Image
# HBase 2.5.6 for NoSQL storage

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache HBase 2.5.6"

# HBase version
ENV HBASE_VERSION=2.5.6
ENV HBASE_HOME=/opt/hbase-2.5.6
ENV HBASE_CONF_DIR=${HBASE_HOME}/conf

# Install HBase
RUN wget -q https://archive.apache.org/dist/hbase/2.5.6/hbase-2.5.6-bin.tar.gz && \
    tar -xzf hbase-2.5.6-bin.tar.gz -C /opt/ && \
    rm hbase-2.5.6-bin.tar.gz && \
    ln -s /opt/hbase-2.5.6 /opt/hbase

# Create directories
RUN mkdir -p ${HBASE_HOME}/logs \
    /hbase-data \
    /hbase/logs \
    /hbase/tmp \
    && chown -R hadoop:hadoop /opt/hbase /hbase-data /hbase/logs /hbase/tmp

# Copy configuration
COPY config/hbase/* ${HBASE_CONF_DIR}/

# Environment variables
ENV HBASE_LOG_DIR=/hbase/logs
ENV PATH=${HBASE_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 16000 16010 16030

WORKDIR /opt/hbase

CMD ["/bin/bash"]