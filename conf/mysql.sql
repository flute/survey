/*问卷*/
create table t_survey
(
   id                   int(20) not null AUTO_INCREMENT,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   title                varchar(100) not null,
   adminId              int(10) not null,
   primary key (id)
);
/*问题*/
create table t_survey_question
(
	id                   int(20) not null AUTO_INCREMENT,
	createdAt            datetime not null,
	updatedAt            datetime not null,
	surveyId			 int(20)  not null,
	title                varchar(100) not null,
	type                 tinyint(1) not null,   /*1:单选，2:多选，3:问答*/
	other				 tinyint(1) not null    /*是否有其他选项*/
	primary key (id)
);
/* 问题选项 */
create table t_survey_option
(
	id                   int(20) not null AUTO_INCREMENT,
	createdAt            datetime not null,
	updatedAt            datetime not null,
	questionId			 int(20) not null,
	content				 varchar(200) not null,
	primary key (id)
);
/* 答卷 */
create table t_survey_result
(
	id                   int(20) not null AUTO_INCREMENT,
	createdAt            datetime not null,
	userId       		 int(20) not null,
	surveyId             int(20) not null,
	resultOptionId	 	 varchar(100) not null,
	primary key (id)
);
/*结果选项*/
create table t_survey_result_option
(
	id                   int(20) not null AUTO_INCREMENT,
	createdAt            datetime not null,
	questionId			 int(20) not null,
	optionId 			 int(20) not null,
	content				 varchar(100) not null,
	primary key (id)
);