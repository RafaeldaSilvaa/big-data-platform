# Big Data Platform - Apache ZooKeeper Image
# ZooKeeper 3.9.2 for coordination

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache ZooKeeper 3.9.2"

# ZooKeeper version
ENV ZOOKEEPER_VERSION=3.9.2
ENV ZOOKEEPER_HOME=/opt/zookeeper-${ZOOKEEPER_VERSION}
ENV ZOOKEEPER_CONF_DIR=${ZOOKEEPER_HOME}/conf

# Install ZooKeeper
RUN wget -q https://archive.apache.org/dist/zookeeper/zookeeper-${ZOOKEEPER_VERSION}/zookeeper-${ZOOKEEPER_VERSION}.tar.gz && \
    tar -xzf zookeeper-${ZOOKEEPER_VERSION}.tar.gz -C /opt/ && \
    rm zookeeper-${ZOOKEEPER_VERSION}.tar.gz && \
    ln -s /opt/zookeeper-${ZOOKEEPER_VERSION} /opt/zookeeper

# Create directories
RUN mkdir -p ${ZOOKEEPER_HOME}/logs \
    /var/lib/zookeeper \
    /var/log/zookeeper \
    && chown -R hadoop:hadoop /opt/zookeeper /var/lib/zookeeper /var/log/zookeeper

# Copy configuration
COPY ../../config/zookeeper/* ${ZOOKEEPER_CONF_DIR}/

# Environment variables
ENV ZOOKEEPER_HOME=/opt/zookeeper

# Expose ports
EXPOSE 2181 2888 3888

WORKDIR /opt/zookeeper

CMD ["/bin/bash"]