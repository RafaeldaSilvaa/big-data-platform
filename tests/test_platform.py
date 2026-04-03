"""
Big Data Platform Tests
Tests for validating the platform configuration and components
"""

import os
import xml.etree.ElementTree as ET
import pytest
import yaml
import subprocess
import json


def run_docker_command(image, command, timeout=30):
    """Run a command in a Docker container and return the result"""
    try:
        result = subprocess.run(
            ['docker', 'run', '--rm', image, 'bash', '-c', command],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, '', 'Command timed out'
    except Exception as e:
        return 1, '', str(e)


class TestConfiguration:
    """Test configuration files are valid"""
    
    def test_hadoop_core_site(self):
        """Test core-site.xml is valid"""
        path = 'config/hadoop/core-site.xml'
        assert os.path.exists(path), f"Missing {path}"
        tree = ET.parse(path)
        root = tree.getroot()
        assert root.tag == 'configuration'
    
    def test_hadoop_hdfs_site(self):
        """Test hdfs-site.xml is valid"""
        path = 'config/hadoop/hdfs-site.xml'
        assert os.path.exists(path), f"Missing {path}"
        tree = ET.parse(path)
        root = tree.getroot()
        assert root.tag == 'configuration'
    
    def test_hadoop_yarn_site(self):
        """Test yarn-site.xml is valid"""
        path = 'config/hadoop/yarn-site.xml'
        assert os.path.exists(path), f"Missing {path}"
        tree = ET.parse(path)
        root = tree.getroot()
        assert root.tag == 'configuration'
    
    def test_hive_site(self):
        """Test hive-site.xml is valid"""
        path = 'config/hive/hive-site.xml'
        assert os.path.exists(path), f"Missing {path}"
        tree = ET.parse(path)
        root = tree.getroot()
        assert root.tag == 'configuration'
    
    def test_hbase_site(self):
        """Test hbase-site.xml is valid"""
        path = 'config/hbase/hbase-site.xml'
        assert os.path.exists(path), f"Missing {path}"
        tree = ET.parse(path)
        root = tree.getroot()
        assert root.tag == 'configuration'
    
    def test_kafka_config(self):
        """Test Kafka server.properties is valid"""
        path = 'config/kafka/server.properties'
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r') as f:
            content = f.read()
            assert 'zookeeper.connect' in content
            assert 'listeners' in content
    
    def test_spark_config(self):
        """Test spark-defaults.conf is valid"""
        path = 'config/spark/spark-defaults.conf'
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r') as f:
            content = f.read()
            assert 'spark.master' in content


class TestDockerCompose:
    """Test docker-compose.yml structure"""
    
    @pytest.fixture
    def compose(self):
        with open('docker-compose.yml', 'r') as f:
            return yaml.safe_load(f)
    
    def test_required_services_exist(self, compose):
        """Test all required services are defined"""
        services = compose.get('services', {})
        
        required = [
            'zookeeper', 'kafka', 'postgres',
            'hadoop-namenode', 'hadoop-datanode',
            'hadoop-resourcemanager', 'hadoop-nodemanager',
            'spark-master', 'spark-worker',
            'hive-metastore', 'hive-server',
            'hbase-master', 'hbase-regionserver',
            'nifi'
        ]
        
        for service in required:
            assert service in services, f"Missing service: {service}"
    
    def test_volumes_defined(self, compose):
        """Test volumes are defined"""
        volumes = compose.get('volumes', {})
        assert len(volumes) > 0, "No volumes defined"
    
    def test_networks_defined(self, compose):
        """Test networks are defined"""
        networks = compose.get('networks', {})
        assert 'bigdata-network' in networks, "Missing bigdata-network"


class TestDockerfiles:
    """Test Dockerfiles exist and are valid"""
    
    def test_base_dockerfile(self):
        """Test base Dockerfile exists"""
        path = 'images/base/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r') as f:
            content = f.read()
            assert 'FROM ubuntu:22.04' in content
    
    def test_hadoop_dockerfile(self):
        """Test Hadoop Dockerfile exists"""
        path = 'images/hadoop/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r') as f:
            content = f.read()
            assert 'FROM bigdata-platform-base' in content or 'hadoop' in content.lower()
    
    def test_spark_dockerfile(self):
        """Test Spark Dockerfile exists"""
        path = 'images/spark/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_hive_dockerfile(self):
        """Test Hive Dockerfile exists"""
        path = 'images/hive/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_kafka_dockerfile(self):
        """Test Kafka Dockerfile exists"""
        path = 'images/kafka/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_zookeeper_dockerfile(self):
        """Test ZooKeeper Dockerfile exists"""
        path = 'images/zookeeper/Dockerfile'
        assert os.path.exists(path), f"Missing {path}"


class TestScripts:
    """Test shell scripts exist and have correct shebang"""
    
    def test_entrypoint_script(self):
        """Test entrypoint.sh exists"""
        path = 'scripts/entrypoint.sh'
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r') as f:
            first_line = f.readline().strip()
            assert first_line == '#!/bin/bash'
    
    def test_bootstrap_hdfs_script(self):
        """Test bootstrap-hdfs.sh exists"""
        path = 'scripts/bootstrap-hdfs.sh'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_build_script(self):
        """Test build-images.sh exists"""
        path = 'build-images.sh'
        assert os.path.exists(path), f"Missing {path}"


class TestApplications:
    """Test application files exist"""
    
    def test_spark_streaming_pipeline(self):
        """Test streaming_pipeline.py exists"""
        path = 'apps/spark/streaming_pipeline.py'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_spark_write_hbase(self):
        """Test write_hbase.py exists"""
        path = 'apps/spark/write_hbase.py'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_hive_tables(self):
        """Test create_tables.hql exists"""
        path = 'apps/hive/create_tables.hql'
        assert os.path.exists(path), f"Missing {path}"


class TestFrontend:
    """Test frontend application files"""
    
    def test_frontend_package_json(self):
        """Test package.json exists"""
        path = 'frontend/package.json'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_frontend_vite_config(self):
        """Test vite.config.js exists"""
        path = 'frontend/vite.config.js'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_frontend_main_jsx(self):
        """Test main.jsx exists"""
        path = 'frontend/src/main.jsx'
        assert os.path.exists(path), f"Missing {path}"
    
    def test_frontend_app_jsx(self):
        """Test App.jsx exists"""
        path = 'frontend/src/App.jsx'
        assert os.path.exists(path), f"Missing {path}"


class TestDockerImages:
    """Test Docker images are functional and can execute expected commands"""
    
    def test_spark_image_spark_submit(self):
        """Test Spark image can execute spark-submit"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-spark:latest',
            'spark-submit --version'
        )
        assert returncode == 0, f"Failed to run spark-submit: {stderr}"
        assert 'spark' in stdout.lower() or 'warning' in stderr.lower(), \
            f"spark-submit output unexpected: stdout={stdout}, stderr={stderr}"
    
    def test_spark_image_python(self):
        """Test Spark image has Python available"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-spark:latest',
            'python3 --version'
        )
        assert returncode == 0, f"Failed to run python3: {stderr}"
        assert 'python' in stdout.lower(), f"python3 version output unexpected: {stdout}"
    
    def test_hive_image_hive_cli(self):
        """Test Hive image can execute hive CLI"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-hive:latest',
            'hive --version',
            timeout=60
        )
        assert returncode == 0, f"Failed to run hive: {stderr}"
        assert 'hive' in stdout.lower() or 'version' in stdout.lower(), \
            f"hive version output unexpected: {stdout}"
    
    def test_hive_image_java_home(self):
        """Test Hive image has proper JAVA_HOME"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-hive:latest',
            'echo $JAVA_HOME'
        )
        assert returncode == 0, f"Failed to get JAVA_HOME: {stderr}"
        java_home = stdout.strip()
        assert java_home, f"JAVA_HOME is empty"
        assert '/usr/lib/jvm' in java_home, f"JAVA_HOME does not contain /usr/lib/jvm: {java_home}"
    
    def test_hbase_image_hbase_command(self):
        """Test HBase image can execute hbase command"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-hbase:latest',
            'hbase version',
            timeout=60
        )
        assert returncode == 0, f"Failed to run hbase: {stderr}"
        # HBase version command may output to stderr
        output = stdout + stderr
        assert 'hbase' in output.lower(), f"hbase version output unexpected: {output}"
    
    def test_kafka_image_kafka_topics(self):
        """Test Kafka image can execute kafka-topics.sh"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-kafka:latest',
            'kafka-topics.sh --help',
            timeout=30
        )
        assert returncode == 0, f"Failed to run kafka-topics.sh: {stderr}"
        output = stdout + stderr
        assert 'topic' in output.lower(), f"kafka-topics help output unexpected: {output}"
    
    def test_kafka_image_kafka_console(self):
        """Test Kafka image has console tools available"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-kafka:latest',
            'ls /opt/kafka/bin/ | grep console'
        )
        assert returncode == 0, f"Failed to list kafka console tools: {stderr}"
        output = stdout.strip()
        assert output, f"No kafka console tools found"
    
    def test_zookeeper_image_zkserver(self):
        """Test ZooKeeper image can execute zkServer.sh"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-zookeeper:latest',
            'zkServer.sh help',
            timeout=30
        )
        # zkServer.sh help exits with code 1 but still shows help
        assert returncode in [0, 1], f"Unexpected return code from zkServer.sh: {returncode}"
        output = stdout + stderr
        assert 'zookeeper' in output.lower() or 'usage' in output.lower(), \
            f"zkServer.sh help output unexpected: {output}"
    
    def test_zookeeper_image_java_home(self):
        """Test ZooKeeper image has proper JAVA_HOME"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-zookeeper:latest',
            'echo $JAVA_HOME'
        )
        assert returncode == 0, f"Failed to get JAVA_HOME: {stderr}"
        java_home = stdout.strip()
        assert java_home, f"JAVA_HOME is empty"
        assert '/usr/lib/jvm' in java_home, f"JAVA_HOME does not contain /usr/lib/jvm: {java_home}"
    
    def test_flume_image_flume_cli(self):
        """Test Flume image can execute flume-ng"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-flume:latest',
            'flume-ng version',
            timeout=30
        )
        assert returncode == 0, f"Failed to run flume-ng: {stderr}"
        output = stdout + stderr
        assert 'flume' in output.lower() or 'version' in output.lower(), \
            f"flume-ng version output unexpected: {output}"
    
    def test_sqoop_image_sqoop_cli(self):
        """Test Sqoop image can execute sqoop"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-sqoop:latest',
            'sqoop version',
            timeout=30
        )
        assert returncode == 0, f"Failed to run sqoop: {stderr}"
        output = stdout + stderr
        assert 'sqoop' in output.lower() or 'version' in output.lower(), \
            f"sqoop version output unexpected: {output}"
    
    def test_nifi_image_nifi_cli(self):
        """Test NiFi image can access nifi-toolkit"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-nifi:latest',
            'ls /opt/nifi/current/bin/nifi.sh',
            timeout=30
        )
        assert returncode == 0, f"Failed to find nifi.sh: {stderr}"
    
    def test_pig_image_pig_cli(self):
        """Test Pig image can execute pig"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-pig:latest',
            'pig -version',
            timeout=30
        )
        assert returncode == 0, f"Failed to run pig: {stderr}"
        output = stdout + stderr
        assert 'pig' in output.lower() or 'apache' in output.lower(), \
            f"pig version output unexpected: {output}"
    
    def test_oozie_image_oozie_cli(self):
        """Test Oozie image can access oozie"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-oozie:latest',
            'ls /opt/oozie/bin/oozie',
            timeout=30
        )
        assert returncode == 0, f"Failed to find oozie: {stderr}"
    
    def test_mahout_image_exists(self):
        """Test Mahout image is properly configured"""
        returncode, stdout, stderr = run_docker_command(
            'bigdata-platform-mahout:latest',
            'ls /opt/mahout/bin',
            timeout=30
        )
        assert returncode == 0, f"Failed to list mahout bin: {stderr}"
        output = stdout.strip()
        assert output, f"mahout bin directory is empty"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])