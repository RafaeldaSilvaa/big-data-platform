# Big Data Platform - Apache Pig Image
# Pig for data processing

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Pig"

# Pig version
ENV PIG_VERSION=0.17.0
ENV PIG_HOME=/opt/pig-${PIG_VERSION}
ENV PIG_CONF_DIR=${PIG_HOME}/conf

# Install Pig
RUN wget -q https://archive.apache.org/dist/pig/pig-${PIG_VERSION}/pig-${PIG_VERSION}.tar.gz && \
    tar -xzf pig-${PIG_VERSION}.tar.gz -C /opt/ && \
    rm pig-${PIG_VERSION}.tar.gz && \
    ln -s /opt/pig-${PIG_VERSION} /opt/pig

# Create directories
RUN mkdir -p ${PIG_HOME}/logs \
    /pig-data \
    && chown -R hadoop:hadoop /opt/pig /pig-data

# Environment variables
ENV PIG_HOME=/opt/pig

WORKDIR /opt/pig

CMD ["/bin/bash"]