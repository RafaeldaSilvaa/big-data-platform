# Big Data Platform - Apache Oozie Image
# Oozie for workflow orchestration

FROM bigdata-platform-hadoop:latest

LABEL maintainer="Big Data Platform Team"
LABEL description="Apache Oozie"

# Oozie version
ENV OOZIE_VERSION=5.2.1
ENV OOZIE_HOME=/opt/oozie-${OOZIE_VERSION}
ENV OOZIE_CONF_DIR=${OOZIE_HOME}/conf

# Install Oozie
RUN wget -q https://archive.apache.org/dist/oozie/${OOZIE_VERSION}/oozie-${OOZIE_VERSION}.tar.gz && \
    tar -xzf oozie-${OOZIE_VERSION}.tar.gz -C /opt/ && \
    rm oozie-${OOZIE_VERSION}.tar.gz && \
    ln -s /opt/oozie-${OOZIE_VERSION} /opt/oozie

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