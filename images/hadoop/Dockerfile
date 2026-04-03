# Big Data Platform - Hadoop Image
# Base image with Hadoop 3.4.0

FROM bigdata-platform-base:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Hadoop 3.4.0 image"

# Hadoop version
ENV HADOOP_VERSION=3.4.0
ENV HADOOP_HOME=/opt/hadoop-3.4.0
ENV HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
ENV PATH=${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin:${PATH}

# Install Hadoop
RUN wget -q https://archive.apache.org/dist/hadoop/common/hadoop-3.4.0/hadoop-3.4.0.tar.gz && \
    tar -xzf hadoop-3.4.0.tar.gz -C /opt/ && \
    rm hadoop-3.4.0.tar.gz && \
    ln -s /opt/hadoop-3.4.0 /opt/hadoop

# Create Hadoop user and group
RUN groupadd -g 1000 hadoop && \
    useradd -u 1000 -g hadoop -d /home/hadoop -s /bin/bash hadoop && \
    echo "hadoop:hadoop" | chpasswd

# Create necessary directories
RUN mkdir -p ${HADOOP_HOME}/logs \
    /hadoop/tmp \
    /hadoop/hdfs/{namenode,datanode,secondarynamenode} \
    /var/log/hadoop \
    && chown -R hadoop:hadoop /hadoop /opt/hadoop

# Copy configuration files
COPY config/hadoop/* ${HADOOP_CONF_DIR}/

# Environment variables
ENV HADOOP_LOG_DIR=/var/log/hadoop
ENV HADOOP_WORKERS="localhost"

# Expose ports
EXPOSE 9864 9866 9867 9870 8088 8032 8033 8034 19888

WORKDIR /opt/hadoop

CMD ["/bin/bash"]