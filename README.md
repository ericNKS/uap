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
	"nomeUser": string,
	"emailUser": string,
	"senhaUser": {
	    "first": string,
	    "second": string // verificação da senha
	},
	"cpfOrCnpjUser": string // 11 ou 16 caracteres,
	"genUser": string
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
	"emailUser": string,
	"senhaUser": string
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
	"idUser": int,
	"nomeuser": string,
	"emailuser": string,
	"teluser": string,
	"cpforunpjUuser": string,
	"crpuser": string | null,
	"imgurluser": string | null,
	"genuser": string,
	"rulesuser": string,
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
	"idUser": int,
	"nomeuser": string,
	"emailuser": string,
	"teluser": string,
	"cpforunpjUuser": string,
	"crpuser": string | null,
	"imgurluser": string | null,
	"genuser": string,
	"rulesuser": string,
	"stsativouser": string // 's' ou 'n'
}
```
- **Descrição**: Rota para atualizar os campos do usuário
- **HEADER Request**: `Bearer token | Content-Type: multipart/form-data para envio de imagem`
```json
{
	"nomeuser": string,
	"emailuser": string,
	"teluser": string,
	"genuser": string,
	"imgurluser": file // jpeg, png, gif, webp ,svg+xml | max: 10MB
	"senhaUser": {
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
		"idUser": int,
		"nomeuser": string,
		"emailuser": string,
		"teluser": string,
		"cpforunpjUuser": string,
		"crpuser": string | null,
		"imgurluser": string | null,
		"genuser": string,
		"rulesuser": string,
		"stsativouser": string // 's' ou 'n'
	}
]
```

&nbsp;