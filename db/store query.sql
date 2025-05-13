CREATE DATABASE if NOT EXISTS UAP;
USE UAP;

CREATE TABLE IF NOT EXISTS users(
iduser BIGINT AUTO_INCREMENT PRIMARY KEY,
nomeuser VARCHAR(70) NOT NULL,
emailuser VARCHAR(100) NOT NULL,
senhauser VARCHAR(100) NOT NULL,
teluser VARCHAR(20),
cpforcnpjuser VARCHAR(20) NOT NULL,
crpuser VARCHAR(10),
imgurluser TEXT,
genuser VARCHAR(30) NOT NULL,
rulesuser VARCHAR(50) NOT NULL DEFAULT 'paciente',
stsativouser CHAR(1) NOT NULL
);


CREATE TABLE consulta(
idconsulta BIGINT AUTO_INCREMENT PRIMARY KEY,
dtconsulta DATE NOT NULL,
hrconsulta TIME NOT NULL,
espcconsulta VARCHAR(70) NOT NULL,
infoconsulta TEXT,
iduser BIGINT,
FOREIGN KEY(iduser) REFERENCES users(iduser)
);


CREATE TABLE IF NOT EXISTS expediente(
idexpediente BIGINT AUTO_INCREMENT PRIMARY KEY,
dtexpediente DATE NOT NULL,
hrexpediente TIME NOT NULL,
stsativoexpediente CHAR(1) NOT NULL,
iduser BIGINT,
FOREIGN KEY(iduser) REFERENCES users(iduser)
);


CREATE TABLE IF NOT EXISTS eventos(
idevento BIGINT AUTO_INCREMENT PRIMARY KEY,
dtevento DATE NOT NULL,
hrevento TIME NOT NULL,
localevento VARCHAR(100) NOT NULL,
infoevento TEXT NOT NULL,
imgurlevento TEXT
);


CREATE TABLE IF NOT EXISTS usereventos(
idusereventos BIGINT AUTO_INCREMENT PRIMARY KEY,
iduser BIGINT,
idevento BIGINT,
FOREIGN KEY(iduser) REFERENCES users(iduser),
FOREIGN KEY(idevento) REFERENCES eventos(idevento)
);


delimiter $$
CREATE PROCEDURE spregistrarpaciente(
	IN pnomeuser VARCHAR(70),
	IN pemailuser VARCHAR(100),
	IN psenhauser VARCHAR(100),
	IN pteluser VARCHAR(20),
	IN pcpforcnpjuser VARCHAR(18),
	IN pgenuser VARCHAR(30)
)
BEGIN
	DECLARE viduser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.iduser) = 0, 0, 1) INTO viduser
	FROM users u
	WHERE pcpforcnpjuser = u.cpforcnpjuser
	GROUP BY(u.iduser);
	
	if viduser = 0 then
		INSERT INTO users (nomeuser, emailuser, senhauser, teluser, cpforcnpjuser, genuser, stsativouser)
		VALUES (pnomeuser, pemailuser, psenhauser, pteluser, pcpforcnpjuser, pgenuser, 's');
	END if;
END
$$


delimiter $$
CREATE PROCEDURE spregistrarespecialista (
	IN pnomeuser VARCHAR(70),
	IN pemailuser VARCHAR(100),
	IN psenhauser VARCHAR(100),
	IN pteluser VARCHAR(20),
	IN pcpforcnpjuser VARCHAR(18),
	IN pcrpuser VARCHAR(10),
	IN pgenuser VARCHAR(30),
	IN prulesuser VARCHAR(50)
)
BEGIN
	DECLARE viduser BIGINT DEFAULT 0;
	
	SELECT if(COUNT(u.iduser) = 0, 0, 1) INTO viduser
	FROM users u
	WHERE pcpforcnpjuser = u.cpforcnpjuser
	GROUP BY(u.iduser);
	
	if viduser = 0 then
		INSERT INTO users (nomeuser, emailuser, senhauser, teluser, cpforcnpjuser, crpuser, genuser, rulesuser, stsativouser)
		VALUES (pnomeuser, pemailuser, psenhauser, pteluser, pcpforcnpjuser, pcrpuser, pgenuser, 'especialista_pendente', 's');
	END if;
END
$$


delimiter $$
CREATE PROCEDURE spexcluirusuario ( 
	IN piduser BIGINT
)
BEGIN
	UPDATE users u
	SET u.stsativouser = 'n'
	WHERE piduser = u.iduser;
END
$$


delimiter $$
CREATE PROCEDURE splistarpacientes()
BEGIN
	SELECT u.iduser AS 'ID do Paciente',
			 u.nomeuser AS 'Nome do Paciente',
			 u.emailuser AS 'Email do Paciente', 
			 sffrmtrpforpj(u.cpforcnpjuser) AS 'CPF/CNPJ do Paciente',
			 u.genuser AS 'Gênero do Paciente'
	FROM users u
	WHERE u.stsativouser = 's'
	AND u.rulesuser = 'paciente';	
END
$$


delimiter $$
CREATE PROCEDURE splistarespecialistasativos()
BEGIN
	SELECT u.iduser AS 'ID do Especialista',
			 u.nomeuser AS 'Nome do Especialista',
			 u.emailuser AS 'Email do Especialista', 
			 sffrmtrpforpj(u.cpforcnpjuser) AS 'CPF/CNPJ do Especialista',
			 sffrmtrcrp(u.crpuser) AS 'CRP do Especialista',
			 u.imgurluser AS 'Imagem do Especialista',
			 u.genuser AS 'Gênero do Especialista'
	FROM users u
	WHERE u.stsativouser = 's'
	AND u.rulesuser = 'especialista_ativo';	
END
$$


delimiter $$
CREATE PROCEDURE splistarespecialistaspendentes()
BEGIN
	SELECT u.iduser AS 'ID do Especialista',
			 u.nomeuser AS 'Nome do Especialista',
			 u.emailuser AS 'Email do Especialista', 
			 sffrmtrpforpj(u.cpforcnpjuser) AS 'CPF/CNPJ do Especialista',
			 sffrmtrcrp(u.crpuser) AS 'CRP do Especialista',
			 u.imgurluser AS 'Imagem do Especialista',
			 u.genuser AS 'Gênero do Especialista'
	FROM users u
	WHERE u.stsativouser = 's'
	AND u.rulesuser = 'especialista_pendente';	
END
$$


delimiter $$
CREATE PROCEDURE splistarusuariosexcluidos()
BEGIN
	SELECT u.iduser AS 'ID do Usuário',
			 u.nomeuser AS 'Nome do Usuário',
			 u.emailuser AS 'Email do Usuário', 
			 sffrmtrpforpj(u.cpforcnpjuser) AS 'CPF/CNPJ do Usuário',
			 u.genuser AS 'Gênero do Usuário'
	FROM users u
	WHERE u.stsativouser = 'n';	
END
$$


delimiter $$
CREATE PROCEDURE spreativarusuario(
	IN piduser BIGINT
)
BEGIN
	UPDATE users u 
	SET u.stsativouser = 's'
	WHERE piduser = u.iduser;	
END
$$


delimiter $$
CREATE PROCEDURE spautorizarespecialista(
	IN piduser BIGINT 
	)
BEGIN
	UPDATE users
	SET rulesuser = 'especialista_ativo'
	WHERE piduser = iduser;	
END
$$


delimiter $$
CREATE FUNCTION sffrmtrpforpj(
	pcpforcnpjuser VARCHAR(20)
)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE resultado VARCHAR(20);

    IF CHAR_LENGTH(pcpforcnpjuser) = 11 THEN
        SET resultado = CONCAT(
            SUBSTRING(pcpforcnpjuser, 1, 3), '.', 
            SUBSTRING(pcpforcnpjuser, 4, 3), '.', 
            SUBSTRING(pcpforcnpjuser, 7, 3), '-', 
            SUBSTRING(pcpforcnpjuser, 10, 2)
        );
    ELSEIF CHAR_LENGTH(pcpforcnpjuser) = 14 THEN
        SET resultado = CONCAT(
            SUBSTRING(pcpforcnpjuser, 1, 2), '.', 
            SUBSTRING(pcpforcnpjuser, 3, 3), '.', 
            SUBSTRING(pcpforcnpjuser, 6, 3), '/', 
            SUBSTRING(pcpforcnpjuser, 9, 4), '-', 
            SUBSTRING(pcpforcnpjuser, 13, 2)
        );
    ELSE
        SET resultado = pcpforcnpjuser;
    END IF;

    RETURN resultado;
END
$$


delimiter $$
CREATE FUNCTION sffrmtrtel(
	pteluser VARCHAR(20)
)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE resultado VARCHAR(20);
    IF CHAR_LENGTH(pteluser) = 11 THEN
        SET resultado = CONCAT(
            SUBSTRING(pteluser, 1, 0), '(', 
            SUBSTRING(pteluser, 1, 2), ') ', 
            SUBSTRING(pteluser, 3, 5), '-', 
            SUBSTRING(pteluser, 8, 4)
        );
    ELSE
        SET resultado = pteluser;
    END IF;

    RETURN resultado;
END
$$


delimiter $$
CREATE FUNCTION sffrmtrcrp(
	pcrpuser VARCHAR(10)
)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE resultado VARCHAR(10);
    IF CHAR_LENGTH(pcrpuser) = 8 THEN
        SET resultado = CONCAT(
            SUBSTRING(pcrpuser, 1, 2), '/', 
            SUBSTRING(pcrpuser, 3, 6)
        );
    ELSE
        SET resultado = pcrpuser;
    END IF;

    RETURN resultado;
END
$$