-- Criação do Banco de Dados

CREATE DATABASE if NOT EXISTS UAP;



-- Criação das Tabelas

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
StsAtivoUser CHAR(1) NOT NULL
);


CREATE TABLE if NOT EXISTS consultas(
IdConsulta BIGINT AUTO_INCREMENT PRIMARY KEY,
IdPaciente BIGINT,
IdEspecialista BIGINT,
DtConsulta DATE NOT NULL,
HrConsulta TIME NOT NULL,
InfoConsulta TEXT,
FOREIGN KEY(IdPaciente) REFERENCES users(IdUser),
FOREIGN KEY(IdEspecialista) REFERENCES users(IdUser)
);


CREATE TABLE if NOT EXISTS expediente(
IdExpediente BIGINT AUTO_INCREMENT PRIMARY KEY,
IdUser BIGINT,
DtExpediente DATE NOT NULL,
HrInicioExpediente TIME NOT NULL,
HrFimExpediente TIME NOT NULL,
StsAtivoExpediente CHAR(1) NOT NULL DEFAULT 's',
FOREIGN KEY(IdUser) REFERENCES users(IdUser)
);


CREATE TABLE if NOT EXISTS eventos(
IdEvento BIGINT AUTO_INCREMENT PRIMARY KEY,
NomeEvento VARCHAR(70) NOT NULL,
DtEvento DATE NOT NULL,
HrEvento TIME NOT NULL,
LocalEvento VARCHAR(100) NOT NULL,
InfoEvento TEXT NOT NULL,
ImgUrlEvento TEXT
);


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
	
	SELECT if(COUNT(u.IdUser) = 0, 0, 1) INTO vIdUser
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
	
	SELECT if(COUNT(u.IdUser) = 0, 0, 1) INTO vIdUser
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
	SELECT u.IdUser AS 'ID do Paciente',
			 u.NomeUser AS 'Nome do Paciente',
			 u.EmailUser AS 'Email do Paciente', 
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Paciente',
			 u.GenUser AS 'Gênero do Paciente',
			 u.pPronomeUser AS 'Pronome do Paciente'
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_PACIENTE';	
END
$$


delimiter $$
CREATE PROCEDURE spListarEspecialistasAtivos()
BEGIN
	SELECT u.IdUser AS 'ID do Especialista',
			 u.NomeUser AS 'Nome do Especialista',
			 u.EmailUser AS 'Email do Especialista', 
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
			 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
			 u.ImgUrlUser AS 'Imagem do Especialista',
			 u.GenUser AS 'Gênero do Especialista',
			 u.pPronomeUser AS 'Pronome do Especialista'
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO';	
END
$$


delimiter $$
CREATE PROCEDURE spListarEspecialistasPendentes()
BEGIN
	SELECT u.IdUser AS 'ID do Especialista',
			 u.NomeUser AS 'Nome do Especialista',
			 u.EmailUser AS 'Email do Especialista', 
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
			 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
			 u.ImgUrlUser AS 'Imagem do Especialista',
			 u.GenUser AS 'Gênero do Especialista',
			 u.pPronomeUser AS 'Pronome do Especialista'
	FROM users u
	WHERE u.StsAtivoUser = 's'
	AND u.RulesUser = 'RULE_ESPECIALISTA_PENDENTE';	
END
$$


delimiter $$
CREATE PROCEDURE spListarUsuariosExcluidos()
BEGIN
	SELECT u.IdUser AS 'ID do Usuário',
			 u.NomeUser AS 'Nome do Usuário',
			 u.EmailUser AS 'Email do Usuário',
			 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Usuário',
			 u.GenUser AS 'Gênero do Usuário',
			 u.pPronomeUser AS 'Pronome do UsuáriospListarPacientesspListarPacientes'
	FROM users u
	WHERE u.StsAtivoUser = 'n';	
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
	IN pHrInicioExpediente TIME,
	IN pHrFimExpediente TIME
)
BEGIN
	DECLARE vIdUser BIGINT DEFAULT 0;
	SELECT if(COUNT(u.IdUser) <> 1,0, u.IdUser) INTO vIdUser
	FROM users u
	WHERE pIdUser = u.IdUser
	AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO'
	GROUP BY(u.IdUser);
	
	if vIdUser = pIdUser then
		INSERT INTO expediente (IdUser, DtExpediente, HrInicioExpediente, HrFimExpediente)
		VALUES(pIdUser, pDtExpediente, pHrInicioExpediente, pHrFimExpediente);
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



-- Criação das Functions

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



-- Criação das Views

CREATE VIEW vEspecialistas_Ativos AS
SELECT u.IdUser AS 'ID do Especialista',
		 u.NomeUser AS 'Nome do Especialista',
		 u.EmailUser AS 'Email do Especialista', 
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
		 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
		 u.ImgUrlUser AS 'Imagem do Especialista',
		 u.GenUser AS 'Gênero do Especialista'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_ESPECIALISTA_ATIVO';


CREATE VIEW vEspecialistas_Pendentes AS
SELECT u.IdUser AS 'ID do Especialista',
		 u.NomeUser AS 'Nome do Especialista',
		 u.EmailUser AS 'Email do Especialista', 
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Especialista',
		 sfFormatarCrp(u.CrpUser) AS 'CRP do Especialista',
		 u.ImgUrlUser AS 'Imagem do Especialista',
		 u.GenUser AS 'Gênero do Especialista'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_ESPECIALISTA_PENDENTE';


CREATE VIEW vPacientes AS
SELECT u.IdUser AS 'ID do Paciente',
		 u.NomeUser AS 'Nome do Paciente',
		 u.EmailUser AS 'Email do Paciente', 
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Paciente',
		 u.GenUser AS 'Gênero do Paciente'
FROM users u
WHERE u.StsAtivoUser = 's'
AND u.RulesUser = 'RULE_PACIENTE';


CREATE VIEW Usuarios_Excluidos AS
SELECT u.IdUser AS 'ID do Usuário',
		 u.NomeUser AS 'Nome do Usuário',
		 u.EmailUser AS 'Email do Usuário',
		 sfFormatarCpfOuCnpj(u.CpfOrCnpjUser) AS 'CPF/CNPJ do Usuário',
		 u.GenUser AS 'Gênero do Usuário'
FROM users u
WHERE u.StsAtivoUser = 'n';