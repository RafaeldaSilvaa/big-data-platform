# Big Data Platform - Apache ZooKeeper Image
# ZooKeeper 3.9.0 for coordination

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache ZooKeeper 3.9.0"

# ZooKeeper version
ENV ZOOKEEPER_VERSION=3.9.0
ENV ZOOKEEPER_HOME=/opt/apache-zookeeper-3.9.0-bin
ENV ZOOKEEPER_CONF_DIR=${ZOOKEEPER_HOME}/conf

# Install ZooKeeper
RUN wget -q https://archive.apache.org/dist/zookeeper/zookeeper-3.9.0/apache-zookeeper-3.9.0-bin.tar.gz && \
    tar -xzf apache-zookeeper-3.9.0-bin.tar.gz -C /opt/ && \
    rm apache-zookeeper-3.9.0-bin.tar.gz && \
    ln -s /opt/apache-zookeeper-3.9.0-bin /opt/zookeeper

# Create directories
RUN mkdir -p ${ZOOKEEPER_HOME}/logs \
    /var/lib/zookeeper \
    /var/log/zookeeper \
    && chown -R hadoop:hadoop /opt/zookeeper /var/lib/zookeeper /var/log/zookeeper

# Copy configuration
COPY config/zookeeper/* ${ZOOKEEPER_CONF_DIR}/

# Environment variables
ENV PATH=${ZOOKEEPER_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 2181 2888 3888

WORKDIR /opt/zookeeper

CMD ["/bin/bash"]