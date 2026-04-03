# Big Data Platform - Apache Sqoop Image
# Sqoop for RDBMS integration

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Sqoop"

# Sqoop version
ENV SQOOP_VERSION=1.4.7
ENV SQOOP_HOME=/opt/sqoop-1.4.7
ENV SQOOP_CONF_DIR=${SQOOP_HOME}/conf

# Install Sqoop
RUN wget -q https://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.tar.gz && \
    tar -xzf sqoop-1.4.7.tar.gz -C /opt/ && \
    rm sqoop-1.4.7.tar.gz && \
    ln -s /opt/sqoop-1.4.7 /opt/sqoop

# Download PostgreSQL JDBC driver
RUN wget -q https://jdbc.postgresql.org/download/postgresql-42.7.1.jar -P ${SQOOP_HOME}/lib/

# Create directories
RUN mkdir -p ${SQOOP_HOME}/logs \
    /var/lib/sqoop \
    && chown -R hadoop:hadoop /opt/sqoop /var/lib/sqoop

# Environment variables
ENV SQOOP_HOME=/opt/sqoop
ENV PATH=${SQOOP_HOME}/bin:${PATH}
ENV JAVA_HOME=/usr/lib/jvm/temurin-11-jdk-amd64

WORKDIR /opt/sqoop

CMD ["/bin/bash"]