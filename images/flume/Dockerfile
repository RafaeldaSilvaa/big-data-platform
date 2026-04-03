# Big Data Platform - Apache Flume Image
# Flume for log collection

FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    wget \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=${JAVA_HOME}/bin:$PATH

# Install Hadoop (required by Flume)
ENV HADOOP_VERSION=3.4.0
ENV HADOOP_HOME=/opt/hadoop
RUN mkdir -p ${HADOOP_HOME} && \
    wget -q https://archive.apache.org/dist/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz -C ${HADOOP_HOME} --strip-components=1 && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

ENV HADOOP_CLASSPATH=${HADOOP_HOME}/share/hadoop/common/*:${HADOOP_HOME}/share/hadoop/common/lib/*:${HADOOP_HOME}/share/hadoop/hdfs:${HADOOP_HOME}/share/hadoop/hdfs/lib/*:${HADOOP_HOME}/share/hadoop/mapreduce/*:${HADOOP_HOME}/share/hadoop/mapreduce/lib/*:${HADOOP_HOME}/share/hadoop/yarn:${HADOOP_HOME}/share/hadoop/yarn/lib/*

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
RUN mkdir -p ${FLUME_HOME}/logs /var/log/flume && \
    chmod -R 755 /opt/flume /var/log/flume

# Update environment
ENV FLUME_HOME=/opt/flume
ENV PATH=${FLUME_HOME}/bin:${HADOOP_HOME}/bin:${PATH}

# Expose ports
EXPOSE 41414 4141

WORKDIR /opt/flume

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