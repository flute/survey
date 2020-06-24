-- MySQL dump 10.13  Distrib 5.7.9, for osx10.9 (x86_64)
--
-- Host: 127.0.0.1    Database: survey
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_survey`
--

DROP TABLE IF EXISTS `t_survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_survey` (
  `id` bigint(20) NOT NULL COMMENT '问卷ID',
  `createdAt` datetime NOT NULL COMMENT '问卷创建时间',
  `updatedAt` datetime NOT NULL COMMENT '问卷更新时间',
  `adminId` bigint(20) NOT NULL COMMENT '创建问卷的管理员id',
  `title` varchar(100) NOT NULL COMMENT '问卷标题',
  `name` varchar(45) NOT NULL COMMENT '创建问卷的管理员用户名',
  `publish` bigint(20) NOT NULL DEFAULT '0' COMMENT '问卷发布状态：默认0未发布，1已发布',
  `code` varchar(100) DEFAULT NULL COMMENT '问卷所属区域',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_survey_option`
--

DROP TABLE IF EXISTS `t_survey_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_survey_option` (
  `id` bigint(20) NOT NULL COMMENT '选项id',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  `questionId` bigint(20) NOT NULL COMMENT '所属问题id',
  `content` varchar(200) NOT NULL COMMENT '选项内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_survey_question`
--

DROP TABLE IF EXISTS `t_survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_survey_question` (
  `id` bigint(20) NOT NULL COMMENT '问题id',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  `surveyId` bigint(20) NOT NULL COMMENT '所属问卷id',
  `title` varchar(100) NOT NULL COMMENT '问卷标题',
  `type` tinyint(1) NOT NULL COMMENT '问题类型：1单选，2多选，3问答',
  `other` tinyint(1) NOT NULL COMMENT '问题是否有其他选项',
  `img` varchar(100) DEFAULT NULL COMMENT '问题图片地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_survey_result`
--

DROP TABLE IF EXISTS `t_survey_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_survey_result` (
  `id` bigint(20) NOT NULL COMMENT '答卷id',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `userId` bigint(20) NOT NULL COMMENT '答卷人id',
  `surveyId` bigint(20) NOT NULL COMMENT '答卷所属问卷id',
  `resultOptionId` varchar(100) NOT NULL COMMENT '答卷的答案id数组',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_survey_result_option`
--

DROP TABLE IF EXISTS `t_survey_result_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_survey_result_option` (
  `id` bigint(20) NOT NULL COMMENT '答卷选项id',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `questionId` bigint(20) NOT NULL COMMENT '答卷选项所属问题id',
  `optionId` bigint(20) NOT NULL COMMENT '答卷选项所属选项id',
  `content` varchar(100) NOT NULL COMMENT '答卷选项内容',
  `type` char(10) NOT NULL COMMENT '选项类型：radio单选，checkbox多选，text问答，other其他',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-31 10:51:11
