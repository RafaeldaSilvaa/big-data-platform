# Big Data Platform - Apache Flume Image
# Flume for log collection

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Flume"

# Flume version
ENV FLUME_VERSION=1.11.0
ENV FLUME_HOME=/opt/apache-flume-${FLUME_VERSION}-bin
ENV FLUME_CONF_DIR=${FLUME_HOME}/conf

# Install Flume
RUN wget -q https://archive.apache.org/dist/flume/flume-${FLUME_VERSION}/apache-flume-${FLUME_VERSION}-bin.tar.gz && \
    tar -xzf apache-flume-${FLUME_VERSION}-bin.tar.gz -C /opt/ && \
    rm apache-flume-${FLUME_VERSION}-bin.tar.gz && \
    ln -s /opt/apache-flume-${FLUME_VERSION}-bin /opt/flume

# Create directories
RUN mkdir -p ${FLUME_HOME}/logs \
    /var/log/flume \
    && chown -R hadoop:hadoop /opt/flume /var/log/flume

# Environment variables
ENV FLUME_HOME=/opt/flume
ENV PATH=${FLUME_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 41414 4141

WORKDIR /opt/flume

CMD ["/bin/bash"]