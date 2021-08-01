# API Rest - Cadastro e Criação de Arquivo em Disco
Esta aplicação possui 3 funcionalidades:

 1. Endpoint para cadastro no sistema;
	- São necessários: Nome, Data de Nascimento, CPF, RG e Senha;
	- O cadastro é realizado em memória;
  - A senha é criptografada utilizado jwt

 2. Endpoint para autenticação;
	- O login também é feito em memoria, armazenado o token jwt, o cpf e o IP do usuário;

 3. Endpoint para geração de um documento com os dados do usuário e salvar no disco
	 - Dados a serem salvos: Nome, Data de Nascimento, CPF, RG;
	 - O documento salvo no disco tem formato .txt e os dados esão com o seguinte formato:

		Ex
		Nome Completo: Nome do Usuário
		Data de Nascimento: Data de Nascimento do Usuário
		CPF: Nº do CPF
		RG: Nº do RG

		Usuario Autenticado
		Login: Nº do CPF
		IP: IP da Consulta

# Obs.
 - O sistema foi desenvolvido em NodeJs (com o microframework Express) utilizando TDD, com Jest para realização dos testes;
 - Consta um total de 50 testes, os quais essão divididos entre Controllers, Services, Repositories e Middlewares
 - O arquivo Insomnia_2021-08-01.json pode ser Importado para o seu Insomnia para facilmente testar as funções do sistema
 - A arquitetura foi estruturada visando o padrão de projeto Services e Repository;
 - O sistema foi desenvolvido de forma a ser desacoplado e coeso, de modo que se torna mais simples a manutenção do sistema, o seu crescimento e a alteração de dependências. Para isso foram utilizados princípios do SOLID.
 - Todos as interfaces concentram-se em uma pasta chamada protocols, e estão organizadas de acordo com a estrutura da aplicação.

