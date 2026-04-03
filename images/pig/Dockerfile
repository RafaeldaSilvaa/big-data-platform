# Big Data Platform - Apache Pig Image
# Pig for data processing

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Pig"

# Pig version
ENV PIG_VERSION=0.17.0
ENV PIG_HOME=/opt/pig-0.17.0
ENV PIG_CONF_DIR=${PIG_HOME}/conf

# Install Pig
RUN wget -q https://archive.apache.org/dist/pig/pig-0.17.0/pig-0.17.0.tar.gz && \
    tar -xzf pig-0.17.0.tar.gz -C /opt/ && \
    rm pig-0.17.0.tar.gz && \
    ln -s /opt/pig-0.17.0 /opt/pig

# Create directories
RUN mkdir -p ${PIG_HOME}/logs \
    /pig-data \
    && chown -R hadoop:hadoop /opt/pig /pig-data

# Environment variables
ENV PIG_HOME=/opt/pig

WORKDIR /opt/pig

CMD ["/bin/bash"]