-- Criação do Banco de Dados

CREATE DATABASE if NOT EXISTS UAP;



-- Criação das Tabelas

/* 
	Criação da tabela Usuário, esta tabela engloba todas as três 
	possibilidades de usuários possíveis no Banco de Dados, 
	sendo eles: Pacientes, Especialistas e Administradores.
	Eles, por sua vez, são diferenciados por um atributo
	nomeado 'RulesUSer'.
*/

CREATE TABLE if NOT EXISTS users(
IdUser BIGINT AUTO_INCREMENT PRIMARY KEY,
NomeUser VARCHAR(70) NOT NULL,
EmailUser VARCHAR(100) NOT NULL,
SenhaUser VARCHAR(100) NOT NULL,
TelUser VARCHAR(20),
CpfOrCnpjUser VARCHAR(20) NOT NULL,
CrpUser VARCHAR(10),
ImgUrlUser TEXT,
GenUser VARCHAR(30) NOT NULL,
PronomeUser VARCHAR(10) NOT NULL,
RulesUser VARCHAR(30) NOT NULL DEFAULT 'RULE_PACIENTE',
StsVerificarEmail BOOLEAN NOT NULL DEFAULT FALSE,
StsAtivoUser CHAR(1) NOT NULL
);

/* 
	Criação da tabela Consultas, esta tabela tem duas chaves 
	estrangeiras, advindas da tabela 'Paciente'(uma para os
	especialistas, outro para os pacientes), ela também 
	possui Data, Horário e Informações adicionais da consulta.
*/

CREATE TABLE if NOT EXISTS consultas(
IdConsulta BIGINT AUTO_INCREMENT PRIMARY KEY,
IdPaciente BIGINT,
IdEspecialista BIGINT,
DtConsulta DATE NOT NULL,
DiaSemanaConsulta SMALLINT NOT NULL,
HrConsulta TIME NOT NULL,
InfoConsulta TEXT,
StsAtivoConsulta CHAR(1) NOT NULL DEFAULT 'n',
FOREIGN KEY(IdPaciente) REFERENCES users(IdUser),
FOREIGN KEY(IdEspecialista) REFERENCES users(IdUser)
);

/* 
	Criação da tabela Expediente, esta tabela representa
	o expediente de cada Especialista registrado no
	banco de dados, tendo sua Data e Hora.
*/

CREATE TABLE if NOT EXISTS expediente(
IdExpediente BIGINT AUTO_INCREMENT PRIMARY KEY,
IdUser BIGINT,
DtExpediente SMALLINT NOT NULL,
HrInicioExpediente TIME NOT NULL,
HrFinalExpediente TIME NOT NULL,
StsAtivoExpediente CHAR(1) NOT NULL DEFAULT 's',
FOREIGN KEY(IdUser) REFERENCES users(IdUser)
);

/* 
	Criação da tabela Eventos, esta tabela possui
	todas as informações necessárias para a 
	criação de eventos, como Nome, Data, Hora,
	Local, Informações e Imagem. Um adendo é 
	que, por ser uma relação muitos para muitos,
	as chaves estrangeiras serão guardadas em outa
	tabela.
*/

CREATE TABLE if NOT EXISTS eventos(
IdEvento BIGINT AUTO_INCREMENT PRIMARY KEY,
NomeEvento VARCHAR(70) NOT NULL,
DtEvento DATE NOT NULL,
HrEvento TIME NOT NULL,
LocalEvento VARCHAR(100) NOT NULL,
InfoEvento TEXT NOT NULL,
ImgUrlEvento TEXT,
StsAtivoEvento CHAR(1) NOT NULL DEFAULT 'n'
);

/* 
	Criação da tabela UserEventos, esta tabela 
	tem duas chaves estrangeiras, referenciando
	tanto a tabela de Usuários quanto a tabela 
	de Eventos.
*/

CREATE TABLE if NOT EXISTS usereventos(
IdUserEventos BIGINT AUTO_INCREMENT PRIMARY KEY,
IdUser BIGINT,
IdEvento BIGINT,
FOREIGN KEY(IdUser) REFERENCES users(IdUser),
FOREIGN KEY(IdEvento) REFERENCES eventos(IdEvento)
);



-- Criação de Procedures

/*
	Criação da Procedure spRegistrarPaciente, esta
	procedure pega Nome, Email, Senha, Telefone,
	CPF ou CNPJ, Gênero e Pronome do Paciente e,
	após verificar se o CPF do ainda não foi 
	registado, ele adiciona o Paciente ao Banco
	de Dados, mesmo ele ainda não tendo acesso ao
	site(necessita validação do Email).
*/

delimiter $$
CREATE PROCEDURE spRegistrarPaciente(
	IN pNomeUser VARCHAR(70),
	IN pEmailUser VARCHAR(100),
	IN pSenhaUser VARCHAR(100),
	IN pTelUser VARCHAR(20),
	IN pCpfOrCnpjUser VARCHAR(18),
	IN pGenUser VARCHAR(30),
	IN pPronomeUser VARCHAR(10)
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) = 0,0, 1) INTO vIdUser
	FROM users u
	WHERE pCpfOrCnpjUser = u.CpfOrCnpjUser
	GROUP BY(u.IdUser);
	
	if vIdUser = 0 then
		INSERT INTO users (NomeUser, EmailUser, SenhaUser, TelUser, CpfOrCnpjUser, GenUser, PronomeUser, StsAtivoUser)
		VALUES (pNomeUser, pEmailUser, pSenhaUser, pTelUser, pCpfOrCnpjUser, pGenUser, pPronomeUser, 's');
	END if;
END
$$

/*
	Criação da Procedure spRegistrarEspecialista, 
	esta procedure pega Nome, Email, Senha, Telefone,
	CPF ou CNPJ, CRP, Gênero e Pronome do Especialista 
	e, após verificar se o CPF do ainda não foi 
	registado, ele adiciona o Especialista ao Banco
	de Dados, mesmo ele ainda não tendo acesso ao
	site(necessita tanto da validação do Email quanto
	da liberação da conta por meio de um Administrador).
*/

delimiter $$
CREATE PROCEDURE spRegistrarEspecialista(
	IN pNomeUser VARCHAR(70),
	IN pEmailUser VARCHAR(100),
	IN pSenhaUser VARCHAR(100),
	IN pTelUser VARCHAR(20),
	IN pCpfOrCnpjUser VARCHAR(18),
	IN pCrpUser VARCHAR(10),
	IN pGenUser VARCHAR(30),
	IN pPronomeUser VARCHAR(10)
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) = 0,0, 1) INTO vIdUser
	FROM users u
	WHERE pCpfOrCnpjUser = u.CpfOrCnpjUser
	GROUP BY(u.IdUser);
	
	if viduser = 0 then
		INSERT INTO users (NomeUser, EmailUser, SenhaUser, TelUser, CpfOrCnpjUser, CrpUser, GenUser, PronomeUser, RulesUser, StsAtivoUser)
		VALUES (pNomeUser, pEmailUser, pSenhaUser, pTelUser, pCpfOrCnpjUser, pCrpUser, pGenUser, pPronomeUser, 'RULE_ESPECIALISTA_PENDENTE', 's');
	END if;
END
$$

/*
	Criação da Procedure spAtivarEmail, esta
	procedure pega o Id do Usuário e,após 
	verificar que o Usuário existe, ele 
	muda o campo 'StsVerificarEmail' para
	verdadeiro.
*/

delimiter $$
CREATE PROCEDURE spAtivarEmail(
	IN pIdUser BIGINT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;

SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
FROM users u
WHERE pIduser = u.IdUser
GROUP BY(u.IdUser);	
	
	IF vIdUser  = pIdUser then
		UPDATE users
		SET StsVerificarEmail = true
		WHERE u.IdUser = vIdUser;
	END if;
END
$$

/*
	Criação da Procedure spAtualizarInfoUsuario, esta
	procedure pega o Id, Nome, Email, Telefone,
	Gênero e Pronome do Usuário e, após verificar 
	que o mesmo existe, ele atualiza algumas 
	informações do usuário no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAtualizarInfoUsuario (
	IN pIdUser BIGINT,
	IN pNomeUser VARCHAR(70),
	IN pEmailUser VARCHAR(100),
	IN pTelUser VARCHAR(20),
	IN pGenUser VARCHAR(30),
	IN pPronomeUser VARCHAR(10)
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		UPDATE users u
		SET NomeUser = pNomeUser,
		EmailUser = pEmailUser,
		TelUser = pTelUser,
		GenUser = pGenUser,
		PronomeUser = pPronomeUser
		WHERE vIdUser = u.IdUser;
	END if;
END
$$

/*
	Criação da Procedure spAtualizarSenhaUsuario, esta
	procedure pega o Id e Senha do Usuário e,
	após verificar que o mesmo existe, ele 
	atualiza a senha do usuário no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAtualizarSenhaUsuario (
	IN pIdUser BIGINT,
	IN pSenhaUser VARCHAR(100)
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		UPDATE users u
		SET SenhaUser = pSenhaUser
		WHERE vIdUser = u.IdUser;
	END if;
END
$$

/*
	Criação da Procedure spAtualizarImgUsuario, esta
	procedure pega o Id e a Imagem do Usuário e, após
	verificar que o mesmo existe, ele atualiza a 
	imagem do usuário no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAtualizarImgUsuario(
	IN pIdUser BIGINT,
	IN pImgUrlUser TEXT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	AND u.StsAtivoUser = 's'
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		UPDATE users
		SET ImgUrlUser = pImgUrlUser
		WHERE IdUser = vIdUser;
	END if;
END 
$$

/*
	Criação da Procedure spExcluirUsuarios, esta
	procedure pega o ID do Usuário e o exclui de
	forma lógica, atualizando o campo 'StsAtivoUser'
	para 'não'.
*/

delimiter $$
CREATE PROCEDURE spExcluirUsuarios( 
	IN pIdUser BIGINT
)
BEGIN
	UPDATE users u
	SET u.StsAtivoUser = 'n'
	WHERE pIdUser = u.IdUser;
END
$$

/*
	Criação da Procedure spListarPacientes, esta 
	procedure tem como objetivo representar todos 
	os pacientes incluindo suas informações 
	pessoais e dados formatados para melhor
	entendimento do Administrador.
*/

delimiter $$
CREATE PROCEDURE spListarPacientes()
BEGIN
	SELECT u.IdUser,
			 u.NomeUser,
			 u.EmailUser, 
			 sfFormatarTel(u.TelUser) AS 'TelUser',
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CpfOrCnpjUser',
			 u.GenUser,
			 u.pPronomeUser
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_PACIENTE';	
END
$$

/*
	Criação da Procedure spListarEspecialistasAtivos, esta 
	procedure tem como objetivo representar todos 
	os especialistas que já tem permissão do Administrador, 
	incluindo suas informações pessoais e dados formatados 
	para melhor entendimento do mesmo.
*/

delimiter $$
CREATE PROCEDURE spListarEspecialistasAtivos()
BEGIN
	SELECT u.IdUser,
			 u.NomeUser,
			 u.EmailUser, 
			 sfFormatarTel(u.TelUser) AS 'TelUser',
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CpfOrCnpjUser',
			 sfFormatarCrp(u.CrpUser) AS 'CrpUser',
			 u.ImgUrlUser,
			 u.GenUser,
			 u.pPronomeUser
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO';	
END
$$

/*
	Criação da Procedure spEspecialistasPendentes, esta 
	procedure tem como objetivo representar todos os 
	especialistas que necessitam a permissão de um
	Adminstrador, incluindo suas informações 
	pessoais e dados formatados para visualização.
*/

delimiter $$
CREATE PROCEDURE spListarEspecialistasPendentes()
BEGIN
	SELECT u.IdUser,
			 u.NomeUser,
			 u.EmailUser, 
			 sfFormatarTel(u.TelUser) AS 'TelUser',
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CpfOrCnpjUser',
			 sfFormatarCrp(u.CrpUser) AS 'CrpUser',
			 u.ImgUrlUser,
			 u.GenUser,
			 u.pPronomeUser
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_ESPECIALISTA_PENDENTE';	
END
$$

/*
	Criação da Procedure spListarUsuariosExcluidos, esta 
	procedure tem como objetivo representar todos os 
	usuários que forma exclúidos pelo Administrador,
	incluindo suas informações(dos usuários) 
	pessoais e dados formatados para visualização.
*/

delimiter $$
CREATE PROCEDURE spListarUsuariosExcluidos()
BEGIN
	SELECT u.IdUser,
			 u.NomeUser,
			 u.EmailUser,
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CpfOrCnpjUser',
			 u.GenUser,
			 u.pPronomeUser
	FROM users u
	WHERE u.StsAtivoUser = 'n';	
END
$$

/*
	Criação da Procedure spPegarUserEmail, esta
	procedure pega o Email do Usuário e, após
	verificar que o mesmo existe, ele exibe o Id,
	Nome, EMail, Senha, Imagem, Gênero, Pronome,
	a sua Regra, o Status de Verificação do Email
	e o Status de Ativação do usuário.
*/

delimiter $$
CREATE PROCEDURE spPegarUserEmail(
	IN pEmailUser VARCHAR(100)
)
BEGIN
	DECLARE vEmailUser VARCHAR(100) DEFAULT '';
	
	SELECT if(COUNT(u.EmailUser) <> 1, 0 , u.EmailUser) INTO vEmailUser
	FROM users u
	WHERE pEmailUser = u.EmailUser
	GROUP BY(u.EmailUser);
	
	if vEmailUser = pEmailUser then
		SELECT u.IdUser,
				 u.NomeUser,
				 u.EmailUser,
				 u.SenhaUser,
				 u.ImgUrlUser,
				 u.GenUser,
				 u.PronomeUser,
				 u.RulesUser,
				 u.StsVerificarEmail,
				 u.StsAtivoUser
		FROM users u
		WHERE  vEmailUser = u.EmailUser;
	END if;
END 
$$

/*
	Criação da Procedure spPegarUserCpfOrCnpj, esta
	procedure pega o CPF ou CNPJ do Usuário e, após
	verificar que o mesmo existe, ele exibe o Id do
	mesmo.
*/

delimiter $$
CREATE PROCEDURE spPegarUserCpfOrCnpj(
	IN pCpfOrCnpjUser VARCHAR(20)
)
BEGIN
	DECLARE vCpfOrCnpjUser VARCHAR(20) DEFAULT '';
	
	SELECT if(COUNT(u.CpfOrCnpjUser) <> 1, 0 , u.CpfOrCnpjUser) INTO vCpfOrCnpjUser
	FROM users u
	WHERE pCpfOrCnpjUser = u.CpfOrCnpjUser
	GROUP BY(u.CpfOrCnpjUser);
	
	if vCpfOrCnpjUser = pCpfOrCnpjUser then
		SELECT u.IdUser
		FROM users u
		WHERE vCpfOrCnpjUser = u.CpfOrCnpjUser;
	END if;
END 
$$

/*
	Criação da Procedure spPegarUserId, esta
	procedure pega o Id do Usuário e, após
	verificar que o mesmo existe, ele exibe o Id,
	Nome, EMail, CPF ou CNPJ, Telefone, CRP
	(se o usuário for especialista), Imagem, 
	Gênero, Pronome, a sua Regra, o Status de 
	Verifição do Email e o Status de Ativação 
	do usuário.
*/

delimiter $$
CREATE PROCEDURE spPegarUserId(
	IN pIdUser BIGINT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		SELECT u.IdUser,
				 u.NomeUser,
				 u.EmailUser,
				 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS CpfOrCnpjUser,
				 sfFormatarTel(u.TelUser) AS TelUser,
				 sfFormatarCrp(u.CrpUser) AS CrpUser,
				 u.ImgUrlUser,
				 u.GenUser,
				 u.PronomeUser,
				 u.RulesUser,
				 u.StsVerificarEmail,
				 u.StsAtivoUser
		FROM users u
		WHERE  vIdUser = u.IdUser;
	END if;
END 
$$

/*
	Criação da Procedure spReativarUsuarios, esta
	procedure pega o Id do Usuário e, após
	verificar que o mesmo existe, ele Atualiza seu
	Status de Ativação, revertendo a exclusão
	lógica, caso necessário.
*/

delimiter $$
CREATE PROCEDURE spReativarUsuarios(
	IN pIdUser BIGINT
)
BEGIN
	UPDATE users u 
	SET u.StsAtivoUser = 's'
	WHERE pIdUser = u.IdUser;
END
$$

/*
	Criação da Procedure spAtivarEspecialistas, esta
	procedure pega o Id do Especialista e atualiza sua
	Regra, tornando-o um 'Especialista Ativo'.
*/

delimiter $$
CREATE PROCEDURE spAtivarEspecialistas(
	IN pIdUser BIGINT 
	)
BEGIN
	UPDATE users
	SET RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	WHERE pIdUser = IdUser;	
END
$$

/*
	Criação da Procedure spAdicionarExpediente, esta
	procedure pega o Id, Data e Hora do Especialista 
	e, após verificar que o mesmo existe, ele Adiciona 
	seu Expediente no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAdicionarExpediente (
	IN pIdUser BIGINT,
	IN pDtExpediente SMALLINT,
	IN pHrInicioExpediente TIME,
	IN pHrFinalExpediente TIME
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	OR u.RulesUser = 'RULE_ADMIN')
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		INSERT INTO expediente (IdUser, DtExpediente, HrInicioExpediente, HrFinalExpediente)
		VALUES(pIdUser, pDtExpediente, pHrInicioExpediente, pHrFinalExpediente);
	END if;
END
$$

/*
	Criação da Procedure spAtivarDesativarExpediente, esta
	procedure pega o Id do Espcialista e o Id do Expediente
	e, após verificar que o Especialista existe e está ativo,
	ele Ativa(ou desativa)seu Expediente no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAtivarDesativarExpediente(
	IN pIdUser BIGINT,
	IN pIdExpediente BIGINT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	DECLARE vStsAtivoExpediente CHAR(1);
	
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	OR u.RulesUser = 'RULE_ADMIN')
	GROUP BY(u.IdUser);
	
	SELECT e.StsAtivoExpediente INTO vStsAtivoExpediente
	FROM expediente e
	WHERE pIdExpediente = e.IdExpediente;
	
	if vIdUser = pIdUser AND vStsAtivoExpediente = 'n' then
		UPDATE expediente
		SET StsAtivoExpediente = 's'
		WHERE vIdUser = IdUser
		AND pIdExpediente = IdExpediente;
	ELSEIF vIdUser = pIdUser and vStsAtivoExpediente = 's' then
		UPDATE expediente
		SET StsAtivoExpediente = 'n'
		WHERE vIdUser = IdUser
		AND pIdExpediente = IdExpediente;
	END if;
END
$$

/*
	Criação da Procedure spListarExpedientes, esta
	procedure pega o Id do Especialista e, após 
	verificar que o mesmo existe, ele Lista todos
	os Expedientes disponíveis no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spListarExpedientes(
	IN pIdUser BIGINT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;

	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIduser = u.IdUser
	AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	OR u.RulesUser = 'RULE_ADMIN')
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		SELECT e.IdExpediente,
			 	 sfFormatarDiaSemana(e.DtExpediente) AS 'DtExpediente',
			 	 e.HrInicioExpediente,
			 	 e.HrFinalExpediente
		FROM expediente e JOIN users u
								ON e.IdUser = u.IdUser
		WHERE e.IdUser = vIdUser
		ORDER BY e.DtExpediente ASC,
					e.HrInicioExpediente ASC;
	END if;
END
$$

/*
	Criação da Procedure spRegistrarConsulta, esta
	procedure pega o Id do Paciente, o Id do Especialista,
	a Data, a Hora e a Informação da Consulta e, após 
	verificar que existe o Paciente, o Especialista e
	o Expediente, ele Adiciona uma nova consulta no 
	Banco de Dados(ainda necessita confirmação do Especialista).
*/

delimiter $$
CREATE PROCEDURE spAdicionarConsulta(
	IN pIdPaciente BIGINT,
	IN pIdEspecialista BIGINT,
	IN pDtConsulta DATE,
	IN pDiaSemanaConsulta SMALLINT,
	IN pHrConsulta TIME,
	IN pInfoConsluta TEXT
)
BEGIN
	DECLARE vIdPaciente BIGINT DEFAULT 0;
	DECLARE vIdEspecialista BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdPaciente
	FROM users u
	WHERE pIdPaciente = u.IdUser
	AND u.StsAtivoUser = 's'
	AND (u.RulesUser = 'RULE_PACIENTE'
	OR u.RulesUser = 'RULE_ADMIN')
	GROUP BY(u.IdUser);
	
	if vIdPaciente = pIdPaciente then
		SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdEspecialista
		FROM users u
		WHERE pIdEspecialista = u.IdUser
		AND u.StsAtivoUser = 's'
		AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
		OR u.RulesUser = 'RULE_ADMIN')
		GROUP BY(u.IdUser);
	END if;
	
	if vIdEspecialista = pIdEspecialista then
		SELECT if(COUNT(e.IdUser) <> 1, 0 , e.IdUser) INTO vIdEspecialista
		FROM expediente e
		WHERE pIdEspecialista = e.IdUser
		AND pDiaSemanaConsulta = e.DtExpediente
		AND pHrConsulta >= e.HrInicioExpediente
		AND pHrConsulta <= e.HrFinalExpediente
		AND e.StsAtivoExpediente = 's'
		GROUP BY(e.IdUser);
	END if;
	
	if vIdEspecialista = pIdEspecialista then
		INSERT INTO consultas(IdPaciente, IdEspecialista, DtConsulta, DiaSemanaConsulta, HrConsulta, InfoConsulta)
		VALUES (pIdPaciente, pIdEspecialista, pDtConsulta, pDiaSemanaConsulta, pHrConsulta, pInfoConsluta);
	END if;
END 
$$

/*
	Criação da Procedure spListarConsultasNaoConfirmadas,
	esta procedure pega o Id do Especialista e, após 
	verificar que o mesmo existe, ele Exibe todas
	Consultas ainda não confirmadas pelo especialista.
*/

delimiter $$
CREATE PROCEDURE spListarConsultasNaoConfirmadas(
	IN pIdEspecialista BIGINT
)
BEGIN
	DECLARE vIdEspecialista BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdEspecialista
	FROM users u
	WHERE pIdEspecialista = u.IdUser
	AND u.StsAtivoUser = 's'
	AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	OR u.RulesUser = 'RULE_ADMIN')
	GROUP BY(u.IdUser);
	
	if vIdEspecialista = pIdEspecialista then
		SELECT c.IdConsulta,
				 pac.NomeUser,
				 pac.EmailUser,
				 c.DtConsulta,
			 	 sfFormatarDiaSemana(c.DiaSemanaConsulta) AS 'DiaSemanaConsulta',
				 c.HrConsulta,
				 esp.NomeUser,
				 c.InfoConsulta
		FROM consultas c JOIN users pac
							  ON c.IdPaciente = pac.IdUser
							  JOIN users esp
							  ON c.IdEspecialista = esp.IdUser					
		WHERE c.StsAtivoConsulta = 'n';
	END if;
END
$$

/*
	Criação da Procedure spListarConsultasConfirmadasPorPaciente,
	esta procedure pega o Id do Paciente e, após verificar que o
	mesmo existe, ele Exibe todas Consultas confirmadas para o
	Paciente.
*/

delimiter $$
CREATE PROCEDURE spListarConsultasConfirmadasPorPaciente(
	IN pIdPaciente BIGINT
)
BEGIN
	DECLARE vIdPaciente BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdPaciente
	FROM users u
	WHERE pIdEspecialista = u.IdUser
	AND u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_PACIENTE'
	GROUP BY(u.IdUser);
	
	if vIdPaciente = pIdPaciente then
		SELECT c.IdConsulta,
				 pac.NomeUser,
				 pac.EmailUser,
				 c.DtConsulta,
			 	 sfFormatarDiaSemana(c.DiaSemanaConsulta) AS 'DiaSemanaConsulta',
				 c.HrConsulta,
				 esp.NomeUser,
				 c.InfoConsulta
		FROM consultas c JOIN users pac
							  ON c.IdPaciente = pac.IdUser
							  JOIN users esp
							  ON c.IdEspecialista = esp.IdUser					
		WHERE c.StsAtivoConsulta = 's'
		AND pIdPaciente = pac.IdUser;
	END if;
END
$$

/*
	Criação da Procedure spListarConsultasConfirmadasPorEspecialista,
	esta procedure pega o Id do Especialista e, após verificar que o
	mesmo existe, ele Exibe todas Consultas confirmadas para o
	Especialista.
*/

delimiter $$
CREATE PROCEDURE spListarConsultasConfirmadasPorEspecialista(
	IN pIdEspecialista BIGINT
)
BEGIN
	DECLARE vIdEspecialista BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdEspecialista
	FROM users u
	WHERE pIdEspecialista = u.IdUser
	AND u.StsAtivoUser = 's'
	AND (u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	OR u.RulesUser = 'RULE_ADMINISTRADOR') 
	GROUP BY(u.IdUser);
	
	if vIdEspecialista = pIdEspecialista then
		SELECT c.IdConsulta,
				 pac.NomeUser,
				 pac.EmailUser,
				 c.DtConsulta,
			 	 sfFormatarDiaSemana(c.DiaSemanaConsulta) AS 'DiaSemanaConsulta',
				 c.HrConsulta,
				 c.InfoConsulta
		FROM consultas c JOIN users pac
							  ON c.IdPaciente = pac.IdUser
							  JOIN users esp
							  ON c.IdEspecialista = esp.IdUser					
		WHERE c.StsAtivoConsulta = 's'
		AND pIdEspecialista = esp.IdUser;
	END if;
END
$$

/*
	Criação da Procedure spAtivarConsulta, esta 
	procedure pega o Id da Consulta e, após 
	verificar que a mesma existe, ele Ativa a
	consulta, mudando o campo 'Status de 
	Ativação' para 'sim'.
*/

delimiter $$
CREATE PROCEDURE spAtivarConsulta(
	IN pIdConsulta BIGINT
)
BEGIN
	DECLARE vIdConsulta BIGINT DEFAULT 0;
	
	SELECT if(COUNT(c.IdConsulta) <> 1, 0 , c.IdConsulta) INTO vIdConsulta
	FROM consultas c
	WHERE pIdConsulta = c.IdConsulta
	GROUP BY(c.IdConsulta);
	
	if vIdConsulta = pIdConsulta then
		UPDATE consultas
		SET StsAtivoConsulta = 's'
		WHERE IdConsulta = vIdConsulta;
	END if;
END
$$

/*
	Criação da Procedure spDesativarConsulta, esta 
	procedure pega o Id da Consulta e, após 
	verificar que a mesma existe, ele Desativa a
	consulta, mudando o campo 'Status de 
	Ativação' para 'não'.
*/

delimiter $$
CREATE PROCEDURE spDesativarConsulta(
	IN pIdConsulta BIGINT
)
BEGIN
	DECLARE vIdConsulta BIGINT DEFAULT 0;
	
	SELECT if(COUNT(c.IdConsulta) <> 1, 0 , c.IdConsulta) INTO vIdConsulta
	FROM consultas c
	WHERE pIdConsulta = c.IdConsulta
	GROUP BY(c.IdConsulta);
	
	if vIdConsulta = pIdConsulta then
		UPDATE consultas
		SET StsAtivoConsulta = 'n'
		WHERE IdConsulta = vIdConsulta;
	END if;
END
$$

/*
	Criação da Procedure spAdicionarEvento, esta 
	procedure pega o Id do Especialista, Nome, Data, 
	Horário, Local, Informações e Imagem do Evento e
	Adiciona um novo Evento, tanto na entidade 
	'eventos' quanto na entidade 'usereventos'.
*/

DELIMITER $$
CREATE PROCEDURE spAdicionarEvento(
	IN pIdEspecialista BIGINT,
	IN pNomeEvento VARCHAR(70),
	IN pDtEvento DATE,
	IN pHrEvento TIME,
	IN pLocalEvento VARCHAR(100),
	IN pInfoEvento TEXT,
	IN pImgUrlEvento TEXT
)
BEGIN 
	DECLARE vIdEvento BIGINT DEFAULT 0;
	
	INSERT INTO eventos(NomeEvento, DtEvento, HrEvento, LocalEvento, InfoEvento, ImgUrlEvento, e.StsAtivoEvento)
	VALUES (pNomeEvento, pDtEvento, pHrEvento, pLocalEvento, pInfoEvento, pImgUrlEvento, 's');

	SET vIdEvento = LAST_INSERT_ID();
	
	INSERT INTO usereventos(IdUser, IdEvento)
	VALUES (pIdEspecialista, vIdEvento);
END
$$

/*
	Criação da Procedure spListarEventosAtivos, esta 
	procedure exibe o Id, Nome, Data, Hora, Local, 
	Informações e Imagem dos Eventos ativos, além do Nome do 
	Especialista associado.
*/

delimiter $$
CREATE PROCEDURE spListarEventosAtivos()
BEGIN
	SELECT e.IdEvento,
			 e.NomeEvento,
			 u.NomeUser,
			 e.DtEvento,
			 e.HrEvento,
			 e.LocalEvento,
			 e.InfoEvento,
			 e.ImgUrlEvento
	FROM usereventos ue JOIN users u
							  ON ue.IdUser = u.IdUser
							  JOIN eventos e
							  ON ue.IdEvento = e.IdEvento
	WHERE e.StsAtivoEvento = 's';
END
$$

/*
	Criação da Procedure spListarEventosDesativos, esta 
	procedure exibe o Id, Nome, Data, Hora, Local, 
	Informações e Imagem dos Eventos desativos, além do Nome do 
	Especialista associado.
*/

delimiter $$
CREATE PROCEDURE spListarEventosDesativos()
BEGIN
	SELECT e.IdEvento,
			 e.NomeEvento,
			 u.NomeUser,
			 e.DtEvento,
			 e.HrEvento,
			 e.LocalEvento,
			 e.InfoEvento,
			 e.ImgUrlEvento
	FROM usereventos ue JOIN users u
							  ON ue.IdUser = u.IdUser
							  JOIN eventos e
							  ON ue.IdEvento = e.IdEvento
	WHERE e.StsAtivoEvento = 'n';
END
$$

/*
	Criação da Procedure spListarTodosEventos, esta 
	procedure exibe o Id, Nome, Data, Hora, Local, 
	Informações e Imagem do Evento, além do Nome e 
	o CRP do Especialista associado.
*/

delimiter $$
CREATE PROCEDURE spListarTodosEventos()
BEGIN
	SELECT e.IdEvento,
			 e.NomeEvento,
			 u.NomeUser,
			 u.CrpUser,
			 e.DtEvento,
			 e.HrEvento,
			 e.LocalEvento,
			 e.InfoEvento,
			 e.ImgUrlEvento
	FROM usereventos ue JOIN users u
							  ON ue.IdUser = u.IdUser
							  JOIN eventos e
							  ON ue.IdEvento = e.IdEvento;
END
$$

/*
	Criação da Procedure spDesativarEvento, esta 
	procedure Desativa um Evento quando o mesmo 
	não for necessário.
*/

delimiter $$
CREATE PROCEDURE spDesativarEvento(
	pIdEvento BIGINT
)
BEGIN
	UPDATE eventos
	SET StsAtivoEvento = 'n'
	WHERE IdEvento = pIdEvento;
END
$$

/*
	Criação da Procedure spAtivarEvento, esta 
	procedure Ativa um Evento se necessário.
*/

delimiter $$
CREATE PROCEDURE spAtivarEvento(
	pIdEvento BIGINT
)
BEGIN
	UPDATE eventos
	SET StsAtivoEvento = 's'
	WHERE IdEvento = pIdEvento;
END
$$

/*
	Criação da Procedure spAtualizarImgEvento, esta
	procedure pega o Id e a Imagem do Evento e, após
	verificar que o mesmo existe, ele atualiza a 
	imagem do evento no Banco de Dados.
*/

delimiter $$
CREATE PROCEDURE spAtualizarImgEvento(
	IN pIdEvento BIGINT,
	IN pImgUrlEvento TEXT
)
BEGIN
	DECLARE vIdEvento BIGINT DEFAULT 0;
	
	SELECT if(COUNT(e.IdEvento) <> 1, 0, e.IdEvento) INTO vIdEvento
	FROM eventos e
	WHERE pIdEvento = e.IdEvento
	GROUP BY(e.IdEvento);
	
	if vIdEvento = pIdEvento then
		UPDATE eventos 
		SET ImgUrlEvento = pImgUrlEvento
		WHERE IdEvento = vIdEvento;
	END if;
END 
$$



-- Criação das Functions


/*
	Criação da função sfFormatarCpfOuCnpj, esta função tem como objetivo 
	formatar automaticamente os valores recebidos como CPF ou CNPJ, 
	identificando a quantidade de caracteres e inserindo pontos, 
	traços e barras conforme necessário.
	Ex: CPF: XXX.XXX.XXX-XX
	Ex CNPJ: XX.XXX.XXX/XXXX-XX
*/

delimiter $$
CREATE FUNCTION sfFormatarCpfOuCnpj(
	pCpfOrCnpjUser VARCHAR(20)
)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE Resultado VARCHAR(20);

    IF CHAR_LENGTH(pCpfOrCnpjUser) = 11 THEN
        SET Resultado = CONCAT(
            SUBSTRING(pCpfOrCnpjUser, 1, 3), '.', 
            SUBSTRING(pCpfOrCnpjUser, 4, 3), '.', 
            SUBSTRING(pCpfOrCnpjUser, 7, 3), '-', 
            SUBSTRING(pCpfOrCnpjUser, 10, 2)
        );
    ELSEIF CHAR_LENGTH(pcpforcnpjuser) = 14 THEN
        SET Resultado = CONCAT(
            SUBSTRING(pCpfOrCnpjUser, 1, 2), '.', 
            SUBSTRING(pCpfOrCnpjUser, 3, 3), '.', 
            SUBSTRING(pCpfOrCnpjUser, 6, 3), '/', 
            SUBSTRING(pCpfOrCnpjUser, 9, 4), '-', 
            SUBSTRING(pCpfOrCnpjUser, 13, 2)
        );
    ELSE
        SET Resultado = pCpfOrCnpjUser;
    END IF;

    RETURN Resultado;
END
$$

/*
	Criação da função sfFormatarTel, esta função tem como objetivo 
	formatar automaticamente o número de telefone inserido pelo 
	usuário, considerando o padrão brasileiro de 11 dígitos
	Ex: (XX) XXXXX-XXXX.
*/

delimiter $$
CREATE FUNCTION sfFormatarTel(
	pTelUser VARCHAR(20)
)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE Resultado VARCHAR(20);
    IF CHAR_LENGTH(pTelUser) = 11 THEN
        SET Resultado = CONCAT(
            SUBSTRING(pTelUser, 1, 0), '(', 
            SUBSTRING(pTelUser, 1, 2), ') ', 
            SUBSTRING(pTelUser, 3, 5), '-', 
            SUBSTRING(pTelUser, 8, 4)
        );
    ELSE
        SET Resultado = pTelUser;
    END IF;

    RETURN Resultado;
END
$$

/*
	Criação da função sfFormatarCrp, esta função tem como objetivo 
	formatar automaticamente o registro CRP do Especialista, 
	adicionando um traço antes dos dois primeiros caracteres.
	Ex: XX/XXXXX
*/

delimiter $$
CREATE FUNCTION sfFormatarCrp(
	pCrpUser VARCHAR(10)
)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE Resultado VARCHAR(10);
    IF CHAR_LENGTH(pCrpUser) = 7 THEN
        SET Resultado = CONCAT(
            SUBSTRING(pCrpUser, 1, 2), '/', 
            SUBSTRING(pCrpUser, 3, 5)
        );
    ELSE
        SET Resultado = pCrpUser;
    END IF;

    RETURN Resultado;
END
$$

/*
	Criação da função sfFormatarDiaSemana, esta função tem como objetivo 
	formatar automaticamente os dias da semana que são do tipo smallint.
	Ex:  0 = 'Segunda-feira'; 6 = 'Domingo'. 
*/

delimiter $$

CREATE FUNCTION sfFormatarDiaSemana(
	pDiaSemana SMALLINT
)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
   DECLARE vNomeDia VARCHAR(20);

   CASE pDiaSemana
   	WHEN 0 THEN SET vNomeDia = 'Segunda-feira';
   	WHEN 1 THEN SET vNomeDia = 'Terça-feira';
   	WHEN 2 THEN SET vNomeDia = 'Quarta-feira';
   	WHEN 3 THEN SET vNomeDia = 'Quinta-feira';
   	WHEN 4 THEN SET vNomeDia = 'Sexta-feira';
   	WHEN 5 THEN SET vNomeDia = 'Sábado';
   	WHEN 6 THEN SET vNomeDia = 'Domingo';
   	ELSE SET vNomeDia = 'Dia Inválido';
   	END CASE;
   	
   RETURN vNomeDia;
END
$$



-- Criação das Views


/*
	Criação da view vwEspecialistasAtivos, esta view tem como objetivo 
	representar todos os especialistas ativos, incluindo informações 
	pessoais e dados formatados para visualização.
*/

CREATE VIEW vwEspecialistas_Ativos AS
SELECT u.IdUser AS 'ID do Especialista',
		 u.NomeUser AS 'Nome do Especialista',
		 u.EmailUser AS 'Email do Especialista',
		 sfFormatarTel(u.TelUser) AS 'Telefone do Especialista',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
		 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
		 u.ImgUrlUser AS 'Imagem do Especialista',
		 u.GenUser AS 'Gênero do Especialista',
		 u.PronomeUser AS 'Pronome do Especialista'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO';

/*
	Criação da view vwEspecialistas_Pendentes, esta view tem como objetivo 
	representar todos os especialistas que necessitam a permissão de um
	adminstrador, incluindo suas informações pessoais e dados formatados 
	para visualização.
*/

CREATE VIEW vwEspecialistas_Pendentes AS
SELECT u.IdUser AS 'ID do Especialista',
		 u.NomeUser AS 'Nome do Especialista',
		 u.EmailUser AS 'Email do Especialista', 
		 sfFormatarTel(u.TelUser) AS 'Telefone do Especialista',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
		 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
		 u.ImgUrlUser AS 'Imagem do Especialista',
		 u.GenUser AS 'Gênero do Especialista',
		 u.PronomeUser AS 'Pronome do Especialista'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_ESPECIALISTA_PENDENTE';

/*
	Criação da view vwPacientes, esta view tem como objetivo 
	representar todos os pacientes incluindo suas informações 
	pessoais e dados formatados para visualização.
*/

CREATE VIEW vwPacientes AS
SELECT u.IdUser AS 'ID do Paciente',
		 u.NomeUser AS 'Nome do Paciente',
		 u.EmailUser AS 'Email do Paciente', 
		 sfFormatarTel(u.TelUser) AS 'Telefone do Paciente',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Paciente',
		 u.GenUser AS 'Gênero do Paciente',
		 u.PronomeUser AS 'Pronome do Paciente'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_PACIENTE';

/*
	Criação da view vwUsuarios_Excluidos, esta view tem como objetivo 
	representar todos os usuários excluídos, incluindo suas informações 
	pessoais e dados formatados para visualização.
*/

CREATE VIEW vwUsuarios_Excluidos AS
SELECT u.IdUser AS 'ID do Usuário',
		 u.NomeUser AS 'Nome do Usuário',
		 u.EmailUser AS 'Email do Usuário',
		 sfFormatarTel(u.TelUser) AS 'Telefone do Usuário',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Usuário',
		 u.GenUser AS 'Gênero do Usuário',
		 u.PronomeUser AS 'Pronome do Usuário'
FROM users u
WHERE u.StsAtivoUser = 'n';

/*
	Criação da view vwUsuarios_Com_Emails_Pendentes, esta view tem 
	como objetivo exibir os usuários com emaisl pendentes, incluindo 
	suas informações pessoais e dados formatados para visualização.
*/

CREATE VIEW vwUsuarios_Com_Emails_Pendentes AS
SELECT u.IdUser AS 'ID do Usuário',
		 u.NomeUser AS 'Nome do Usuário',
		 u.EmailUser AS 'Email do Usuário',
		 sfFormatarTel(u.TelUser) AS 'Telefone do Usuário',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Usuário',
		 sfFormatarCrp(u.CrpUser) AS 'CRP do Usuário',
		 u.GenUser AS 'Gênero do Usuário',
		 u.PronomeUser AS 'Pronome do Usuário'
FROM users u
WHERE u.StsVerificarEmail = FALSE
OR u.StsVerificarEmail IS FALSE;
	
/*
	Criação da view vwConsultas_Nao_Confirmadas, esta view tem como objetivo 
	representar todos as consultas ainda não confirmadas de todos os 
	especialistas.
*/	
			
CREATE VIEW vwConsultas_Nao_Confirmadas AS	
SELECT c.IdConsulta AS 'Id da Consulta',
		 pac.NomeUser AS 'Nome do Paciente',
		 pac.EmailUser AS 'Email do Paciente',
		 esp.NomeUser AS 'Nome do Especialista',
		 c.DtConsulta AS 'Data da Consulta',
		 sfFormatarDiaSemana(c.DiaSemanaConsulta) AS 'Dia da Semana da Consulta',
		 c.HrConsulta AS 'Hora da Consulta',
		 c.InfoConsulta AS 'Info da Consulta'
		FROM consultas c JOIN users pac
							ON c.IdPaciente = pac.IdUser
							JOIN users esp
							ON c.IdEspecialista = esp.IdUser
		WHERE c.StsAtivoConsulta = 'n';
		
/*
	Criação da view vwConsultas_Confirmadas, esta view tem como objetivo 
	representar todos as consultas, já confirmadas, de todos os 
	especialistas.
*/	

CREATE VIEW vwConsultas_Confirmadas AS
SELECT c.IdConsulta AS 'Id da Consulta',
		 pac.NomeUser 'Nome do Paciente',
		 pac.EmailUser AS 'Email do Paciente',
		 esp.NomeUser AS 'Nome do Especialista',
		 c.DtConsulta AS 'Data da Consulta',
		 sfFormatarDiaSemana(c.DiaSemanaConsulta) AS 'Dia da Semana da Consulta',
		 c.HrConsulta AS 'Hora da Consulta',
		 c.InfoConsulta AS 'Info da Consulta'
		FROM consultas c JOIN users pac
							ON c.IdPaciente = pac.IdUser
							JOIN users esp
							ON c.IdEspecialista = esp.IdUser
		WHERE c.StsAtivoConsulta = 's';

/*
	Criação da view vwTodos_Expedientes, esta view tem como objetivo 
	representar todos os expedientes de todos os especialistas.
*/

CREATE VIEW vwTodos_Expedientes AS 
SELECT e.IdExpediente AS 'Id do Expediente',
		 u.NomeUser AS 'Nome do Especialista',
		 sfFormatarDiaSemana(e.DtExpediente) AS 'Dia da Semana do Expediente',
		 e.HrInicioExpediente AS 'Hora Inicial do Expediente',
		 e.HrFinalExpediente AS 'Hora Final do Expediente',
		 e.StsAtivoExpediente AS 'Status do Expediente'
FROM expediente e JOIN users u
						ON e.IdUser = u.IdUser
ORDER BY e.DtExpediente ASC,
			e.HrInicioExpediente ASC;		
		
/*
	Criação da view vwExpedientes_Ativos, esta view tem como objetivo 
	representar todos os expedientes ativos de todos os especialistas.
*/		

CREATE VIEW vwExpedientes_Ativos AS 
SELECT e.IdExpediente AS 'Id do Expediente',
		 u.NomeUser AS 'Nome do Especialista',
		 sfFormatarDiaSemana(e.DtExpediente) AS 'Dia da Semana do Expediente',
		 e.HrInicioExpediente AS 'Hora Inicial do Expediente',
		 e.HrFinalExpediente AS 'Hora Final do Expediente'
FROM expediente e JOIN users u
						ON e.IdUser = u.IdUser
WHERE e.StsAtivoExpediente = 's'
ORDER BY e.DtExpediente ASC,
			e.HrInicioExpediente ASC;

/*
	Criação da view vwExpedientes_Nao_Ativos, esta view tem como objetivo 
	representar todos os expedientes não ativos de todos os especialistas.
*/

CREATE VIEW vwExpedientes_Nao_Ativos AS 
SELECT e.IdExpediente AS 'Id do Expediente',
		 u.NomeUser AS 'Nome do Especialista',
		 sfFormatarDiaSemana(e.DtExpediente) AS 'Dia da Semana do Expediente',
		 e.HrInicioExpediente AS 'Hora Inicial do Expediente',
		 e.HrFinalExpediente AS 'Hora Final do Expediente'
FROM expediente e JOIN users u
						ON e.IdUser = u.IdUser
WHERE e.StsAtivoExpediente = 'n'
ORDER BY e.DtExpediente ASC,
			e.HrInicioExpediente ASC;

/*
	Criação da view vwTodos_Eventos, esta view tem como objetivo 
	representar todos os eventos, de modo geral.
*/

CREATE VIEW vwTodos_Eventos AS	
SELECT e.IdEvento AS 'Id do Evento',
		 e.NomeEvento AS  'Nome do Evento',
		 esp.NomeUser AS 'Nome do Especialista',
		 esp.EmailUser AS 'Email do Especialista',
		 e.DtEvento AS 'Data do Evento',
		 e.HrEvento AS 'Hora do Evento',
		 e.LocalEvento AS 'Local do Evento',
		 e.InfoEvento AS 'Informações do Evento',
		 e.ImgUrlEvento AS 'Imagem do Evento'
		FROM usereventos ue JOIN users esp
							ON ue.IdUser = esp.IdUser
							JOIN eventos e
							ON ue.IdEvento = e.IdEvento;
					
/*
	Criação da view vwEventos_Nao_Ativos, esta view tem como objetivo 
	representar os eventos não ativos.
*/

CREATE VIEW vwEventos_Nao_Ativos AS	
SELECT e.IdEvento AS 'Id do Evento',
		 e.NomeEvento AS  'Nome do Evento',
		 esp.NomeUser AS 'Nome do Especialista',
		 esp.EmailUser AS 'Email do Especialista',
		 e.DtEvento AS 'Data do Evento',
		 e.HrEvento AS 'Hora do Evento',
		 e.LocalEvento AS 'Local do Evento',
		 e.InfoEvento AS 'Informações do Evento',
		 e.ImgUrlEvento AS 'Imagem do Evento'
		FROM usereventos ue JOIN users esp
							ON ue.IdUser = esp.IdUser
							JOIN eventos e
							ON ue.IdEvento = e.IdEvento
		WHERE e.StsAtivoEvento = 'n';
		
/*
	Criação da view vwEventos_Ativos, esta view tem como objetivo 
	representar os eventos ativos.
*/	
		
CREATE VIEW vwEventos_Ativos AS	
SELECT e.IdEvento AS 'Id do Evento',
		 e.NomeEvento AS  'Nome do Evento',
		 esp.NomeUser AS 'Nome do Especialista',
		 esp.EmailUser AS 'Email do Especialista',
		 e.DtEvento AS 'Data do Evento',
		 e.HrEvento AS 'Hora do Evento',
		 e.LocalEvento AS 'Local do Evento',
		 e.InfoEvento AS 'Informações do Evento',
		 e.ImgUrlEvento AS 'Imagem do Evento'
		FROM usereventos ue JOIN users esp
							ON ue.IdUser = esp.IdUser
							JOIN eventos e
							ON ue.IdEvento = e.IdEvento
		WHERE e.StsAtivoEvento = 's';
		