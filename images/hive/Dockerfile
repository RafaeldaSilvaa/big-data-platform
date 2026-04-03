# Big Data Platform - Hive Image
# Hadoop image with Hive 3.1.3 and PostgreSQL driver

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Hive 3.1.3 image with PostgreSQL driver"

# Hive version
ENV HIVE_VERSION=3.1.3
ENV HIVE_HOME=/opt/apache-hive-3.1.3-bin
ENV HIVE_CONF_DIR=${HIVE_HOME}/conf

# Install Hive
RUN wget -q https://archive.apache.org/dist/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz && \
    tar -xzf apache-hive-3.1.3-bin.tar.gz -C /opt/ && \
    rm apache-hive-3.1.3-bin.tar.gz && \
    ln -s /opt/apache-hive-3.1.3-bin /opt/hive

# Download PostgreSQL JDBC driver
RUN wget -q https://jdbc.postgresql.org/download/postgresql-42.7.1.jar -P ${HIVE_HOME}/lib/

# Create Hive directories
RUN mkdir -p ${HIVE_HOME}/logs \
    /warehouse \
    /metastore \
    /tmp/hive \
    && chown -R hadoop:hadoop /opt/hive /warehouse /metastore /tmp/hive

# Copy Hive configuration
COPY config/hive/* ${HIVE_CONF_DIR}/

# Environment variables
ENV HIVE_HOME=/opt/hive
ENV HIVE_CONF_DIR=/opt/hive/conf
ENV PATH=${HIVE_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

# Expose ports
EXPOSE 10000 10002

WORKDIR /opt/hive

CMD ["/bin/bash"]