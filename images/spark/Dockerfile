# Big Data Platform - Spark Image
# Hadoop image with Spark 3.5.1

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Spark 3.5.1 image"

# Spark version
ENV SPARK_VERSION=3.5.1
ENV SPARK_HOME=/opt/spark-${SPARK_VERSION}
ENV SPARK_CONF_DIR=${SPARK_HOME}/conf

# Install Spark
RUN wget -q https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    tar -xzf spark-${SPARK_VERSION}-bin-hadoop3.tgz -C /opt/ && \
    rm spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    ln -s /opt/spark-${SPARK_VERSION}-bin-hadoop3 /opt/spark

# Create Spark directories
RUN mkdir -p ${SPARK_HOME}/logs \
    ${SPARK_HOME}/work \
    /var/log/spark \
    && chown -R hadoop:hadoop /opt/spark /var/log/spark

# Copy Spark configuration
COPY ../../config/spark/* ${SPARK_CONF_DIR}/

# Environment variables
ENV SPARK_LOG_DIR=/var/log/spark
ENV PYSPARK_PYTHON=/usr/bin/python3
ENV PYSPARK_DRIVER_PYTHON=python3

# Expose ports
EXPOSE 8080 8081 7077 4040 4041 18080

WORKDIR /opt/spark

CMD ["/bin/bash"]