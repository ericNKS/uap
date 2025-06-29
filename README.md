# UAP

## 🔗 Endpoints

Links base: `/api`


### 🖼️ Imagem

>  Metodo: `GET`
- **Endpoint**: `/api/image/:filename`
- **Response**: `200 Ok`
- **Descrição**: Rota para recuperar a imagem salva

&nbsp;

### ✅ Validação de usuario

>  Metodo: `GET`
- **Endpoint**: `/api/active/:token`
- **Response**: `204 Not Content`
- **Descrição**: Rota para ativar o usuário
&nbsp;

### 🔑 Autenticação

#### Registro

>  Metodo: `POST`
- **Endpoint**: `/api/register`
- **Response**: `201 Created`
```json
{
	"success": "Foi enviado um email para verificar a conta"
}
```
- **Descrição**: Rota para registrar o usuario
- **Body Request**:
```json
{
	"NomeUser": string,
	"EmailUser": string,
	"SenhaUser": {
	    "first": string,
	    "second": string // verificação da senha
	},
	"CpfOrCnpjUser": string, // 11 ou 16 caracteres
	"CrpUser": string, // opcional
	"GenUser": string,
	"PronomeUser": string,
	"TelUser": string, // opcional
	"RulesUser": string // opcional = RULE_PACIENTE
}
```

&nbsp;

#### Login

>  Metodo: `POST`
- **Endpoint**: `/api/login`
- **Response**: `200 Ok`
```json
{
	"token": string
}
```
- **Descrição**: Rota para gerar o token de acesso do usuário
- **Body Request**:
```json
{
	"EmailUser": string,
	"SenhaUser": string
}
```
 **HEADER Request**: `Content-Type: application/json`

&nbsp;

#### Logout

>  Metodo: `POST`
- **Endpoint**: `/api/logout`
- **Response**: `204 Not Content`
- **Descrição**: Rota para remover a autorização do token do usuário
- **HEADER Request**: `Bearer token`

&nbsp;

### 🤸 Usuário

Links base: `/api/users`

#### Usuário

>  Metodo: `GET`
- **Endpoint**: `/api/user`
- **Descrição**: Rota para visualizar os dados do usuário logado
- **HEADER Request**: `Bearer token`
- **Response**: `200 ok`
```json
{
	"IdUser": int,
	"NomeUser": string,
	"EmailUser": string,
	"TelUser": string,
	"CpfOrCnpjUser": string,
	"CrpUser": string | null,
	"ImgUrlUser": string | null,
	"GenUser": string,
	"PronomeUser": string,
	"RulesUser": string,
	"StsVerificarEmail": boolean, // 1 ou 0
	"stsativouser": string // 's' ou 'n'
}
```

&nbsp;

#### Usuários

#### Atualizar o usuário

>  Metodo: `PATCH`
- **Endpoint**: `/api/users`
- **Response**: `200 ok`
```json
{
	"IdUser": int,
	"NomeUser": string,
	"EmailUser": string,
	"TelUser": string,
	"CpfOrCnpjUser": string,
	"CrpUser": string | null,
	"ImgUrlUser": string | null,
	"GenUser": string,
	"PronomeUser": string,
	"RulesUser": string,
	"StsVerificarEmail": boolean, // 1 ou 0
	"stsativouser": string // 's' ou 'n'
}
```
- **Descrição**: Rota para atualizar os campos do usuário
- **HEADER Request**: `Bearer token | Content-Type: multipart/form-data para envio de imagem`
```json
{
	"NomeUser": string,
	"EmailUser": string,
	"TelUser": string,
	"GenUser": string,
	"ImgUrlUser": file, // jpeg, png, gif, webp ,svg+xml | max: 10MB
	"SenhaUser": {
		"old": string, // senha antiga do usuário
    	"first": string,
	    "second": string // verificação da senha
	},
}
```

&nbsp;

#### Deletar o proprio usuário

>  Metodo: `DELETE`
- **Endpoint**: `/api/users`
- **Response**: `204 Not Content`
- **Descrição**: Rota para remover o usuário do sistema
- **HEADER Request**: `Bearer token`

&nbsp;

### 🔒 Rota administrativa

#### Deletar qualquer usuário

>  Metodo: `DELETE`
- **Endpoint**: `/api/users/:id`
- **Response**: `204 Not Content`
- **Descrição**: Rota para remover o usuário do sistema utilizando o id
- **HEADER Request**: `Bearer token`

&nbsp;

>  Metodo: `GET`
- **Endpoint**: `/api/users`
- **Descrição**: Rota para visualizar os dados de todos os usuário. Somente o administrar tem acesso.
- **HEADER Request**: `Bearer token`
- **Response**: `200 ok`
```json
[
	{
		"IdUser": int,
		"NomeUser": string,
		"EmailUser": string,
		"TelUser": string,
		"CpfOrCnpjUser": string,
		"CrpUser": string | null,
		"ImgUrlUser": string | null,
		"GenUser": string,
		"PronomeUser": string,
		"RulesUser": string,
		"StsVerificarEmail": boolean,
		"stsativouser": string // 's' ou 'n'
	}
]
```

&nbsp;