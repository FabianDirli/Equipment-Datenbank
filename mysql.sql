-- MariaDB dump 10.17  Distrib 10.4.14-MariaDB, for osx10.10 (x86_64)
--
-- Host: 127.0.0.1    Database: TBK
-- ------------------------------------------------------
-- Server version	10.4.14-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (7,'admin','$2b$04$Hw5z4z/7JqgT3yJRRJtDLOYHuYORb41VlVOsL8D/nadhR/N1aeKxm','admin');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (0,'Alle'),(1,'Rigging'),(2,'DJ Mischpulte/Player/Controller'),(3,'Effektlicht'),(4,'DMX Steuerung'),(5,'Effektnebel'),(6,'Beschallungstechnik'),(7,'Beschallungstechnik-Monitor'),(8,'Beschallungstechnik-Subwoofer'),(9,'Stative');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (0,'----------','---------','----------'),(1,'Peppi','Harauer','Krems 21'),(3,'Fabian','Dirlinger','Arbesbach 231'),(4,'Alexander','Hofbauer','Kleinbaumgarten 21');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `connector` varchar(255) DEFAULT NULL,
  `output` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `equipment_customers_id_fk` (`customer_id`),
  KEY `equipment_category_id_fk` (`category_id`),
  KEY `equipment_warehouse_id_fk` (`warehouse_id`),
  CONSTRAINT `equipment_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `equipment_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `equipment_warehouse_id_fk` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (7,'ADJ Pro Evettable II','667',1,'ADJ','DJ Booth',0,4,30,0),(8,'Pioneer CDJ 2000NXS2','1',2,'Pioneer','USB/SD/CD/DVD/Netzwerk',40,3,60,0),(9,'Pioneer DJM 900 NXS2','1',2,'Pioneer','4x Stereo Klinke/ 4x Chinch/Netzwerk',40,4,60,0),(10,'Pioneer XDJ-RR','1',1,'Pioneer','Master XLR-Stereo/Klinke Booth/2x Klinke Kopfhörer',40,1,50,0),(11,'Pioneer XDJ-RX','1',1,'Pioneer','Master XLR-Stereo/Klinke Booth/2x Klinke Kopfhörer',40,4,50,0),(12,'Pioneer XDJ-RX2','1',1,'Pioneer','Master XLR-Stereo/Klinke Booth/2x Klinke Köpfhörer',50,2,50,0),(13,'ADJ Mini Dekker','1',1,'ADJ','2x 3pol-DMX',25,4,10,0),(14,'ADJ MyDMX Konsole   Laptop','1',1,'ADJ','2x 3pol-DMX',10,4,20,0),(15,'ADJ Focus Spot One','2',3,'ADJ','2x 3pol-DMX/2x Powercon',81,1,20,0),(16,'DJ Power DF-V9C RC 181m3/Min.','1',1,'American DJ ','IEC',722,1,15,0),(17,'ADJ 12P HEX','12',1,'ADJ','2x 3pol-DMX/IEC',150,1,15,0),(18,'Eurolite LED Bar-12 QCL RGBW','1',3,'Eurolite','2x 3pol-DMX/2x IEC',50,1,10,0),(19,'EV-ZLX 12P','2',6,'EV','Stereo XLR/IEC',1000,1,40,0),(20,'IMG Stageline Flat-M200','1',7,'IMG Stageline','Klinke/XLR/IEC',300,1,20,0),(21,'Outline Topsub Plus','6',8,'Outline','2x Speakon',5600,2,80,0),(22,'KM 210/9 Black','1',9,'KM','-',0,1,5,0),(23,'Millenium MS 2003','1',1,'Millenium','-',0,1,5,0),(24,'ATC SB29-4x 2000','10',1,'ATC','4x HD 34',0,3,15,0);
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse`
--

LOCK TABLES `warehouse` WRITE;
/*!40000 ALTER TABLE `warehouse` DISABLE KEYS */;
INSERT INTO `warehouse` VALUES (0,'Alle'),(1,'Kleinbaumgarten 1'),(2,'Kleinbaumgarten 2'),(3,'Großnonndorf'),(4,'Hollabrunn'),(8,'Arbesbach 4');
/*!40000 ALTER TABLE `warehouse` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-22 19:02:50
