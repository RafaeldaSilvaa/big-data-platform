# Big Data Platform - Apache HBase Image
# HBase 2.5.7 for NoSQL storage

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache HBase 2.5.7"

# HBase version
ENV HBASE_VERSION=2.5.7
ENV HBASE_HOME=/opt/hbase-${HBASE_VERSION}
ENV HBASE_CONF_DIR=${HBASE_HOME}/conf

# Install HBase
RUN wget -q https://archive.apache.org/dist/hbase/${HBASE_VERSION}/hbase-${HBASE_VERSION}-bin.tar.gz && \
    tar -xzf hbase-${HBASE_VERSION}-bin.tar.gz -C /opt/ && \
    rm hbase-${HBASE_VERSION}-bin.tar.gz && \
    ln -s /opt/hbase-${HBASE_VERSION} /opt/hbase

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

# Expose ports
EXPOSE 16000 16010 16030

WORKDIR /opt/hbase

CMD ["/bin/bash"]