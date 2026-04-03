# Big Data Platform - Apache Mahout Image
# Mahout for machine learning

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Mahout"

# Mahout version
ENV MAHOUT_VERSION=0.13.1
ENV MAHOUT_HOME=/opt/mahout
ENV MAHOUT_CONF_DIR=${MAHOUT_HOME}/conf

# Install Mahout
RUN wget -q https://archive.apache.org/dist/mahout/${MAHOUT_VERSION}/apache-mahout-distribution-${MAHOUT_VERSION}.tar.gz && \
    tar -xzf apache-mahout-distribution-${MAHOUT_VERSION}.tar.gz -C /opt/ && \
    rm apache-mahout-distribution-${MAHOUT_VERSION}.tar.gz && \
    ln -s /opt/apache-mahout-distribution-${MAHOUT_VERSION} /opt/mahout

# Create directories
RUN mkdir -p ${MAHOUT_HOME}/logs \
    /mahout-data \
    && chown -R hadoop:hadoop /opt/mahout /mahout-data

# Environment variables
ENV MAHOUT_HOME=/opt/mahout
ENV PATH=${MAHOUT_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

WORKDIR /opt/mahout

CMD ["/bin/bash"]