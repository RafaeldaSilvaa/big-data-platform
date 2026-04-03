"""
Big Data Platform Tests
Tests for validating the platform configuration and components
"""

import os
import xml.etree.ElementTree as ET
import pytest
import yaml


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


if __name__ == '__main__':
    pytest.main([__file__, '-v'])