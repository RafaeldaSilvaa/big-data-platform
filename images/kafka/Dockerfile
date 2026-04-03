# Big Data Platform - Apache Kafka Image
# Kafka 3.7.0 with ZooKeeper client

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Kafka 3.7.0"

# Kafka version
ENV KAFKA_VERSION=3.7.0
ENV SCALA_VERSION=2.13
ENV KAFKA_HOME=/opt/kafka_2.13-${KAFKA_VERSION}
ENV KAFKA_CONF_DIR=${KAFKA_HOME}/config

# Install Kafka
RUN wget -q https://archive.apache.org/dist/kafka/3.7.0/kafka_2.13-3.7.0.tgz && \
    tar -xzf kafka_2.13-3.7.0.tgz -C /opt/ && \
    rm kafka_2.13-3.7.0.tgz && \
    ln -s /opt/kafka_2.13-${KAFKA_VERSION} /opt/kafka

# Create directories
RUN mkdir -p ${KAFKA_HOME}/logs \
    /var/lib/kafka \
    && chown -R hadoop:hadoop /opt/kafka /var/lib/kafka

# Copy configuration
COPY config/kafka/* ${KAFKA_CONF_DIR}/

# Environment variables
ENV KAFKA_LOG_DIR=${KAFKA_HOME}/logs
ENV PATH=${KAFKA_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 9092 9093 29092

WORKDIR /opt/kafka

CMD ["/bin/bash"]