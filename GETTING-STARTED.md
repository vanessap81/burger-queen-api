# Primeiros Passos

Depois de criar seu fork e clonar o repositório em seu computador, antes de começar a codificar, primeiro precisamos criar nosso _ambiente de desenvolvimento_. Para isso, recomendamos seguir os passos abaixo:

* [1. Escolher um Banco de Dados](#1-elegir-base-de-datos)
* [2. Instalar `docker` e `docker-compose`](#2-instalar-docker-y-docker-compose)
* [3. Configurar o "serviço" de banco de dados](#3-configurar-servicio-de-base-de-datos)
* [4. Configurar Conexão com o Banco de Dados no "serviço" Node](#4-configurar-conexão-a-bbdd-en-servicio-node)
* [5. Escolher um Módulo (Cliente)](#5-elegir-módulo-cliente)
* [6. Iniciar, Reiniciar e Parar os Serviços com `docker-compose`](#6-iniciar-re-iniciar-y-parar-los-servicios-con-docker-compose)
* [7. Familiarizar-se com a Administração de Contêineres](#7-familiarizarte-con-admisitración-de-contenedores)
* [8. Opcionalmente, Instalar uma Interface Gráfica para Administrar Dados](#8-opcionalmente-instalar-interfaz-gráfica-para-admisitrar-data)
* [9. Definir Esquemas](#9-definir-esquemas)
* [10. Definir Estratégia de Testes Unitários](#10-definir-estrategia-de-pruebas-unitarias)
* [11. Familiarizar-se com os Testes de Integração (e2e)](#11-familiarizarte-con-las-pruebas-de-integración-e2e)

***

## 1. Escolher um Banco de Dados

A primeira decisão que precisamos tomar, antes de começar a programar, é escolher
um banco de dados. Neste projeto, sugerimos 3 opções: duas delas _relacionais_ e
baseadas em SQL (PostgreSQL e MySQL), e outra _não relacional_ (MongoDB). As três
são excelentes opções.

Aqui estão alguns pontos a serem considerados:

* MongoDB é o mais _comum_ (popular) atualmente no ecossistema de Node.js.
* Bancos de dados _relacionais_ normalmente exigem mais design _a priori_
  (definir tabelas, colunas, relações, ...) enquanto os _não relacionais_ nos
  permitem ser mais _flexíveis_.
* Bancos de dados _relacionais_ nos permitem relacionar dados de forma mais
  natural e garantir a consistência dos dados. Eles nos fornecem uma rigidez que
  remove _flexibilidade_, mas adiciona outros tipos de garantias, além de nos
  permitir pensar em tabelas e colunas, um conceito com o qual muitos já estão
  familiarizados.
* MySQL, PostgreSQL e MongoDB (nesta ordem) são os [bancos de dados de
  código aberto mais populares em dezembro de 2020](https://www.statista.com/statistics/809750/worldwide-popularity-ranking-database-management-systems/).
  Isso é válido para o cenário geral de bancos de dados, não apenas no ecossistema
  de Node.js.
* PostgreSQL é um banco de dados _objeto-relacional_ (ORDBMS), enquanto MySQL é
  puramente relacional. PostgreSQL tem suporte nativo para objetos JSON e outras
  características como indexação de JSON.

## 2. Instalar `docker` e `docker-compose`

Independentemente do banco de dados que você escolher, neste projeto, vamos
executar localmente (em nosso computador) o servidor de banco de dados usando
_contêineres_ do Docker, em vez de instalar o programa diretamente em nosso
computador. Além disso, também vamos usar a ferramenta `docker-compose` para
_orquestrar_ nossos contêineres: bancos de dados e servidor web (node).

Nos links a seguir, você pode aprender como instalar `docker` e `docker-compose`
em seu sistema operacional.

* [Obter Docker](https://docs.docker.com/get-docker/)
* [Instalar Docker Compose](https://docs.docker.com/compose/install/)

## 3. Configurar o "serviço" de Banco de Dados

O _boilerplate_ deste projeto inclui um arquivo
[`docker-compose.yml`](./docker-compose.yml) que já contém parte da
configuração do `docker-compose`. Neste arquivo, você verá que há dois
serviços listados: `db` e `node`. Nossa aplicação consistirá em dois servidores:
um servidor de banco de dados (o serviço `db`) e um servidor web implementado
em Node.js (o serviço `node`).

Na seção correspondente ao serviço `db`, existem três coisas importantes que
precisaremos completar:

* Qual _imagem_ (`image`) queremos usar. Imagens recomendadas:
  [mongo](https://hub.docker.com/_/mongo),
  [postgres](https://hub.docker.com/_/postgres) e
  [mysql](https://hub.docker.com/_/mysql).
* Quais volumes (`volumes`), arquivos ou pastas, queremos mapear para o
  contêiner, como por exemplo o diretório de dados (a pasta onde o banco de
  dados salvará seus arquivos).
* As variáveis de ambiente (`environment`) necessárias para configurar nosso
  banco de dados e usuários. Esses dados serão úteis mais tarde para
  configurar a conexão a partir do Node.js.

Exemplo de serviço `db` usando [MongoDB](https://hub.docker.com/_/mongo):

```yml
db:
  image: mongo:4
  volumes:
    - ./db-data:/data/db
  environment:
    MONGO_INITDB_ROOT_USERNAME: bq
    MONGO_INITDB_ROOT_PASSWORD: secret
  restart: always
  networks:
    - private
```

Exemplo de serviço `db` usando [PostgreSQL](https://hub.docker.com/_/postgres):

```yml
db:
  image: postgres:13
  volumes:
    - ./db-data:/var/lib/postgresql/data
  environment:
    POSTGRES_PASSWORD: secret
  restart: always
  networks:
    - private
```

Exemplo de serviço `db` usando [MySQL](https://hub.docker.com/_/mysql):

```yml
db:
  image: mysql:5
  volumes:
    - ./db-data:/var/lib/mysql
  environment:
    MYSQL_ROOT_PASSWORD: supersecret
    MYSQL_DATABASE: bq
    MYSQL_USER: bq
    MYSQL_PASSWORD: secret
  restart: always
  networks:
    - private
```

## 4. Configurar Conexão ao Banco de Dados no "Serviço" Node

Agora que já temos a configuração do _serviço_ `db`, precisamos completar a
configuração do _serviço_ Node.js. Em particular, é importante definir o valor
da variável de ambiente `DB_URL`, onde devemos colocar a _connection string_
correspondente ao nosso banco de dados. Esta _string_ de conexão segue o formato
de URL e se parece com isso:

```text
protocol://username:password@host:port/dbname?opt1=val1&...
```

Aqui, substituiremos `protocol` pelo nome do protocolo do banco de dados
escolhido (`mongodb`, `postgresql` ou `mysql`) e `username`, `password` e
`dbname` pelos valores usados na configuração do serviço `db` no ponto
anterior. Neste caso, o valor de `host` será `db`, que é o nome do serviço de
banco de dados na configuração do `docker-compose.yml` e podemos nos referir a
ele pelo nome na rede interna entre os contêineres. Seguindo com os exemplos do
ponto anterior, a variável `DB_URL` no `docker-compose.yml` ficaria assim:

* MongoDB:

  ```yml
  DB_URL: mongodb://bq:secret@db:27017/bq?authSource=admin
  ```

* PostgreSQL:

  ```yml
  DB_URL: postgresql://postgres:secret@db:5432/postgres?schema=public
  ```

* MySQL:

  ```yml
  DB_URL: mysql://bq:secret@db:3306/bq
  ```

## 5. Escolher um Módulo (Cliente)

Agora que já temos um servidor de banco de dados, precisamos escolher um módulo
ou biblioteca projetada para interagir com nosso banco de dados a partir do
Node.js. Existem muitas opções, mas para este projeto, recomendamos que você
escolha uma destas (que são as mais populares para cada um dos bancos de dados):
[Mongoose](https://mongoosejs.com/) (MongoDB),
[pg](https://www.npmjs.com/package/pg) (PostgreSQL) ou
[mysql](https://www.npmjs.com/package/mysql) (MySQL).

O _boilerplate_ já inclui um arquivo `config.js` onde as variáveis de ambiente
são lidas e, entre elas, está `DB_URL`. Como podemos ver, esse valor está sendo
atribuído à propriedade `dbUrl` do módulo `config`.

```js
// `config.js`
exports.dbUrl = process.env.DB_URL || "mongodb://localhost:27017/test";
```

Ahora que já sabemos onde encontrar a _connection string_ (no módulo
config), podemos prosseguir e estabelecer uma conexão com o banco de dados
usando o cliente escolhido.

Exemplo de conexão usando [Mongoose](https://mongoosejs.com/) (MongoDB):

```js
const mongoose = require("mongoose");
const config = require("./config");

mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log)
  .catch(console.error);
```

Exemplo de conexão usando [pg](https://www.npmjs.com/package/pg)
(PostgreSQL):

```js
const pg = require("pg");
const config = require("./config");

const pgClient = new pg.Client({ connectionString: config.dbUrl });

pgClient.connect();
pgClient.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pgClient.end();
});
```

Exemplo de conexão usando [mysql](https://www.npmjs.com/package/mysql)
(MySQL):

```js
const mysql = require("mysql");
const config = require("./config");

const connection = mysql.createConnection(config.dbUrl);

connection.connect();
connection.query("SELECT 1 + 1 AS solution", (error, results) => {
  if (error) {
    return console.error(error);
  }
  console.log(`The solution is: ${results[0].solution}`);
});
connection.end();
```

## 6. Iniciar, reiniciar e parar os serviços com `docker-compose`

Agora que já temos nossa configuração `docker-compose` pronta, vejamos como
podemos _iniciar_ a aplicação. Para isso, utilizamos o comando
`docker-compose up` dentro da pasta do nosso projeto (onde está o arquivo
`docker-compose.yml`).

```sh
docker-compose up
```

Para interromper o comando e retornar ao _prompt_ do terminal, use `Ctrl + C`.

Se usarmos o comando dessa forma, sem opções, ele iniciará todos os serviços
descritos no `docker-compose.yml`. Alternativamente, podemos iniciar um serviço
específico adicionando o nome do serviço ao comando. Por exemplo, se quisermos
iniciar apenas o banco de dados:

```sh
docker-compose up db
```

Também temos a opção de iniciar os serviços e fazê-los rodar em segundo plano,
como _daemons_, usando a opção `-d`. Dessa forma, imediatamente o _prompt_ é
retornado e os serviços continuam em execução.

```sh
docker-compose up -d
```

Além do comando `docker-compose up`, que constrói, (re)cria, inicia e se
conecta aos contêineres de serviços, também temos comandos disponíveis para
iniciar (`start`), reiniciar (`restart`) e parar (`stop`) serviços com
contêineres já existentes.

```sh
docker-compose start
docker-compose stop
docker-compose restart
```

Assim como com `docker-compose up`, esses outros comandos também podem ser
usados para especificar com qual _serviço_ queremos interagir (ou todos, se não
especificado). Por exemplo, para iniciar, reiniciar e em seguida parar o
servidor de banco de dados:


```sh
docker-compose start db
docker-compose stop db
docker-compose restart db
```

## 7. Familiarize-se com a Administração de Contêineres

Além dos comandos que já vimos no `docker-compose`, é recomendável que você se
familiarize com outros comandos (entre outros) para poder _administrar_ seus
contêineres.

O comando `docker-compose ps` exibe uma lista dos contêineres _ativos_:

```sh
docker-compose ps
```

Também é possível listar _todos_ os contêineres, incluindo os que estão
parados, usando a opção `-a`:

```sh
docker-compose ps -a
```

Para excluir os contêineres dos serviços:

```sh
docker-compose rm
```

Da mesma forma que nos comandos anteriores, também podemos excluir os
contêineres de um serviço específico indicando seu nome:

```sh
docker-compose rm db
```

Finalmente, quando executamos nossos serviços em segundo plano, como _daemons_, para
nos conectarmos aos contêineres e visualizar os _logs_, podemos usar:

```sh
docker-compose logs
```

Podemos adicionar também a opção `-f` para fazer _streaming_ dos logs e ficar
"ouvindo", assim como especificar um serviço em particular. Por exemplo:

```sh
docker-compose logs -f db
```

Lembre-se de que você sempre pode consultar a _ajuda_ do `docker-compose` com o
subcomando `help`. Por exemplo, se quisermos ver a ajuda do subcomando `up`,
poderíamos fazer isso:

```sh
docker-compose help up
```

## 8. Opcionalmente, instale uma interface gráfica para administrar dados

Ao trabalhar com bancos de dados, é comum usar alguma forma de interface gráfica
que nos permita visualizar e manipular nossos dados de forma visual. Existem
opções para cada tipo de banco de dados. Recomendamos as seguintes:
[Compass](https://www.mongodb.com/products/compass) (MongoDB),
[Workbench](https://www.mysql.com/products/workbench/) (MySQL),
[pgAdmin](https://www.pgadmin.org/) (PostgreSQL).

Se você deseja utilizar esse tipo de ferramenta (como `Compass` ou `WorkBench`),
é provável que você precise tornar seu banco de dados visível fora do
Docker. Para fazer isso, você pode mapear a porta do banco de dados no contêiner
para uma porta livre no host do Docker (normalmente, seu computador). Geralmente,
mapeamos essas portas padrão (por exemplo, `27017` para MongoDB) para números de
porta diferentes, já que esses programas e/ou suas portas podem já estar em uso.
Por exemplo, se estamos usando MongoDB, poderíamos adicionar o seguinte mapeamento
de portas ao serviço `db` em nosso `docker-compose.yml`:

```yaml
ports:
  - 28017:27017
```

Ao listar as portas de um contêiner ou serviço no `docker-compose.yml`, lembre-se
de que o número à direita representa a porta no contêiner (rede privada do
Docker), enquanto o número à esquerda representa a porta no host do Docker
(normalmente, seu computador - `127.0.0.1` ou `localhost`). No exemplo acima,
estamos _mapeando_ a porta `27017` do contêiner para a porta `28017` do host do
Docker.

Se você estiver usando PostgreSQL ou MySQL, as portas que você gostaria de
mapear seriam `5432` e `3306`, respectivamente.

Se estivermos _expondo_ a porta em nosso computador (o _host_), você também
precisará conectar o contêiner `db` à rede _pública_:

```yaml
networks:
  - public
  - private
```

Após essa alteração, você poderá acessar usando `127.0.0.1` ou `localhost` e a
porta à qual mapeamos, `28017` neste exemplo.

Se você escolher o [pgAdmin](https://www.pgadmin.org/) (PostgreSQL), a opção mais
fácil é usar o pgAdmin como um contêiner e adicioná-lo como um novo serviço ao
nosso `docker-compose.yml`. Por exemplo:

```yml
pgadmin:
  image: dpage/pgadmin4
  restart: always
  environment:
    PGADMIN_DEFAULT_EMAIL: user@domain.com
    PGADMIN_DEFAULT_PASSWORD: secret
  ports:
    - 8088:80
  networks:
    - public
    - private
```

NOTA: Para se conectar ao pgAdmin usando um contêiner, utilize o _nome_ do
contêiner do banco de dados (por exemplo: `XXX-001-burger-queen-api_db_1`) como
nome do host para que o pgAdmin possa se conectar através da rede _privada_.

## 9. Definir Esquemas

Neste ponto, você deve ter uma configuração de `docker-compose` pronta para
_levantar_ o banco de dados e o servidor Node.js.

Como parte do processo de design do nosso banco de dados, teremos que
especificar os _esquemas_ dos nossos _modelos_ de dados. Com isso, queremos
dizer que precisamos _descrever_ de alguma forma as coleções ou tabelas que
vamos usar e a _estrutura_ dos objetos ou linhas que vamos armazenar nessas
coleções.

Se você escolheu MongoDB e Mongoose, este último nos oferece um mecanismo para
descrever esses [_modelos_](https://mongoosejs.com/docs/models.html) e
[_esquemas_](https://mongoosejs.com/docs/guide.html) de dados em JavaScript.

Se você escolheu usar um banco de dados SQL, é comum incluir alguns scripts
`.sql` com o código SQL que nos permite _criar_ (ou alterar) as tabelas
necessárias. Alternativamente, você também pode explorar abstrações mais
modernas como o [Prisma](https://www.prisma.io/).

## 10. Definir Estratégia de Testes Unitários

Além dos testes `e2e` já incluídos no _boilerplate_ do projeto, espera-se que
você também utilize testes _unitários_ para desenvolver os diferentes _endpoints_
ou _rotas_, bem como outros módulos internos que você decidir desenvolver.

Para realizar testes unitários em _rotas_ do Express, recomendamos explorar a
biblioteca [`supertest`](https://www.npmjs.com/package/supertest), que pode ser
usada em conjunto com o `jest`.

Outro ponto a ser considerado nos testes unitários é como _mockear_ o banco de
dados. Alguns bancos de dados oferecem ferramentas (como o
[`mongodb-memory-server`](https://github.com/nodkz/mongodb-memory-server)) que
permitem usar um banco de dados em memória e assim evitar a necessidade de fazer
_mocks_ propriamente ditos. No entanto, geralmente queremos considerar como
abstrair a interação com o banco de dados para facilitar _mocks_ que nos
permitam concentrar na lógica das rotas.

## 11. Familiarize-se com Testes de Integração (e2e)

O _boilerplate_ deste projeto já inclui testes `e2e` (end-to-end) ou de
_integração_, que são responsáveis por testar nossa aplicação em conjunto,
através da interface HTTP. Ao contrário dos testes unitários, onde importamos ou
requeremos um módulo e testamos uma função de forma isolada, o que faremos aqui
é iniciar toda a aplicação e testá-la como seria usado no mundo real. Para isso,
a aplicação de teste precisará de um banco de dados e estar ouvindo em uma porta
de rede.

Para executar testes e2e em uma instância local, podemos usar:

```sh
npm run test:e2e
```

Isso inicia a aplicação com `npm start` e executa os testes contra a URL dessa
instância (por padrão `http://127.0.0.1:8080`). Isso assume que o banco de dados
está disponível.

Alternativamente, e talvez seja mais fácil de usar, podemos também iniciar nossa
aplicação usando `docker-compose`, ou até mesmo em produção, e então executar os
testes `e2e` passando a URL da aplicação na variável de ambiente `REMOTE_URL`.
Por exemplo:

```sh
REMOTE_URL=http://127.0.0.1:8080 npm run test:e2e
```

Ao especificar `REMOTE_URL`, os testes não tentarão _iniciar_ um servidor local,
mas usarão diretamente a URL fornecida, assumindo que a aplicação está disponível
naquela URL. Isso nos permite testar também contra URLs remotas. Por exemplo:

```sh
REMOTE_URL=https://api.my-super-app.com npm run test:e2e
```
