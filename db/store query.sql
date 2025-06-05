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
	estrangeiras, advindas da tabela 'Paciente', possuindo 
	Data, Horário e Informações adicionais da consulta.
*/

CREATE TABLE if NOT EXISTS consultas(
IdConsulta BIGINT AUTO_INCREMENT PRIMARY KEY,
IdPaciente BIGINT,
IdEspecialista BIGINT,
DtConsulta DATE NOT NULL,
HrConsulta TIME NOT NULL,
InfoConsulta TEXT,
StsAtivoConsulta CHAR(1) NOT NULL DEFAULT 'n',
FOREIGN KEY(IdPaciente) REFERENCES users(IdUser),
FOREIGN KEY(IdEspecialista) REFERENCES users(IdUser)
);

/* 
	Criação da tabela Expediente, esta tabela representa
	o expediente de cada Especialista registrado no
	banco de dados, tendo sua data e hora.
*/

CREATE TABLE if NOT EXISTS expediente(
IdExpediente BIGINT AUTO_INCREMENT PRIMARY KEY,
IdUser BIGINT,
DtExpediente DATE NOT NULL,
HrExpediente TIME NOT NULL,
StsAtivoExpediente CHAR(1) NOT NULL DEFAULT 's',
FOREIGN KEY(IdUser) REFERENCES users(IdUser)
);

/* 
	Criação da tabela Eventos, esta tabela possui
	todas as informações necessárias para a 
	criação de eventos, como nome, data, hora,
	local, informações e imagem. Um adendo é 
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
		WHERE IdUser = vIdUser;
	END if;
END
$$


delimiter $$
CREATE PROCEDURE spAdicionarImgUsuario(
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


delimiter $$
CREATE PROCEDURE spAdicionarExpediente (
	IN pIdUser BIGINT,
	IN pDtExpediente DATE,
	IN pHrExpediente TIME
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		INSERT INTO expediente (IdUser, DtExpediente, HrExpediente)
		VALUES(pIdUser, pDtExpediente, pHrExpediente);
	END if;
END
$$


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
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
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

delimiter $$
CREATE PROCEDURE spListarExpedientes(
	IN pIdUser BIGINT
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;

	SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIduser = u.IdUser
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		SELECT e.IdExpediente,
			 	 e.DtExpediente,
			 	 e.HrExpediente
		FROM expediente e JOIN users u
								ON e.IdUser = u.IdUser
		WHERE e.IdUser = vIdUser
		ORDER BY e.DtExpediente ASC,
					e.HrExpediente ASC;
	END if;
END
$$


delimiter $$
CREATE PROCEDURE spRegistrarConsulta(
	IN pIdPaciente BIGINT,
	IN pIdEspecialista BIGINT,
	IN pDtConsulta DATE,
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
	AND u.RulesUser = 'RULE_PACIENTE'
	GROUP BY(u.IdUser);
	
	if vIdPaciente = pIdPaciente then
		SELECT if(COUNT(u.IdUser) <> 1, 0 , u.IdUser) INTO vIdEspecialista
		FROM users u
		WHERE pIdEspecialista = u.IdUser
		AND u.StsAtivoUser = 's'
		AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
		GROUP BY(u.IdUser);
	END if;
	
	if vIdEspecialista = pIdEspecialista then
		SELECT if(COUNT(e.IdUser) <> 1, 0 , e.IdUser) INTO vIdEspecialista
		FROM expediente e
		WHERE pIdEspecialista = e.IdUser
		AND pDtConsulta = e.DtExpediente
		AND pHrConsulta = e.HrExpediente
		AND e.StsAtivoExpediente = 's'
		GROUP BY(e.IdUser);
	END if;
	
	if vIdEspecialista = pIdEspecialista then
		INSERT INTO consultas(IdPaciente, IdEspecialista, DtConsulta, HrConsulta, InfoConsulta)
		VALUES (pIdPaciente, pIdEspecialista, pDtConsulta, pHrConsulta, pInfoConsluta);
	END if;
END 
$$


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
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	GROUP BY(u.IdUser);
	
	if vIdEspecialista = pIdEspecialista then
		SELECT c.IdConsulta,
				 pac.NomeUser,
				 pac.EmailUser,
				 c.DtConsulta,
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



-- Criação das Triggers


delimiter $$
CREATE TRIGGER trDesativarExpedienteAposConsulta
AFTER INSERT ON consultas
FOR EACH ROW
BEGIN
	UPDATE expediente
	SET StsAtivoExpediente = 'n'
   WHERE IdUser = NEW.IdEspecialista
   AND DtExpediente = NEW.DtConsulta
   AND HrExpediente = NEW.HrConsulta;
END
$$



-- Criação das Views


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

CREATE VIEW vwExpedientes AS 
SELECT e.IdExpediente AS 'Id do Expediente',
		 u.NomeUser AS 'Nome do Especialista',
		 e.DtExpediente AS 'Data do Expediente',
		 e.HrExpediente AS 'Hora do Expediente',
		 e.StsAtivoExpediente AS 'Status do Expediente'
FROM expediente e JOIN users u
						ON e.IdUser = u.IdUser
ORDER BY e.DtExpediente ASC,
			e.HrExpediente ASC;
	
			
CREATE VIEW vwConsultas_Nao_Confirmadas AS	
SELECT c.IdConsulta AS 'Id da Consulta',
		 pac.NomeUser 'Nome do Paciente',
		 pac.EmailUser AS 'Email do Paciente',
		 esp.NomeUser AS 'Nome do Especialista',
		 c.DtConsulta AS 'Data da Consulta',
		 c.HrConsulta AS 'Hora da Consulta',
		 c.InfoConsulta AS 'Info da Consulta'
		FROM consultas c JOIN users pac
							ON c.IdPaciente = pac.IdUser
							JOIN users esp
							ON c.IdEspecialista = esp.IdUser
		WHERE c.StsAtivoConsulta = 'n';
		
CREATE VIEW vwConsultas_Confirmadas AS
SELECT c.IdConsulta AS 'Id da Consulta',
		 pac.NomeUser 'Nome do Paciente',
		 pac.EmailUser AS 'Email do Paciente',
		 esp.NomeUser AS 'Nome do Especialista',
		 c.DtConsulta AS 'Data da Consulta',
		 c.HrConsulta AS 'Hora da Consulta',
		 c.InfoConsulta AS 'Info da Consulta'
		FROM consultas c JOIN users pac
							ON c.IdPaciente = pac.IdUser
							JOIN users esp
							ON c.IdEspecialista = esp.IdUser
		WHERE c.StsAtivoConsulta = 's';
