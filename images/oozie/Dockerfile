# Big Data Platform - Apache Oozie Image
# Oozie for workflow orchestration

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Oozie"

# Oozie version
ENV OOZIE_VERSION=5.2.1
ENV OOZIE_HOME=/opt/oozie-5.2.1
ENV OOZIE_CONF_DIR=${OOZIE_HOME}/conf

# Install Oozie
RUN wget -q https://archive.apache.org/dist/oozie/5.2.1/oozie-5.2.1.tar.gz && \
    tar -xzf oozie-5.2.1.tar.gz -C /opt/ && \
    rm oozie-5.2.1.tar.gz && \
    ln -s /opt/oozie-5.2.1 /opt/oozie

# Create directories
RUN mkdir -p ${OOZIE_HOME}/logs \
    /oozie-data \
    /oozie/tmp \
    && chown -R hadoop:hadoop /opt/oozie /oozie-data /oozie/tmp

# Environment variables
ENV OOZIE_HOME=/opt/oozie

# Expose ports
EXPOSE 11000 11001

WORKDIR /opt/oozie

CMD ["/bin/bash"]