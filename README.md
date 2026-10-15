# Verbo — Registro de Decisões

PWA estático. Não exige Python, banco de dados remoto ou mensalidade de banco. Dados e decisões permanecem no IndexedDB de cada navegador/aparelho. A primeira abertura e preparação dos arquivos offline exigem HTTPS com internet (ou localhost no computador).

## Primeiro uso
1. Publique a pasta `dist` em hospedagem estática HTTPS.
2. Abra no celular. Aguarde “Aplicativo preparado para uso offline”. Instale no Android pelo botão quando disponível; no iPhone use Safari > Compartilhar > Adicionar à Tela de Início.
3. Abra o app instalado e importe a planilha numerada fornecida separadamente. Não gere IDs diferentes em cada celular.
4. Em Importar e exportar, identifique o celular/servo.
5. Teste em modo avião: fechar, abrir, buscar, salvar e exportar. Faça o teste com uma base fictícia antes de importar os inscritos reais, para não marcar decisões de teste como reais.

## Registro
Digite o nome completo ou parte dele. A busca ignora acentos e diferenças entre maiúsculas e minúsculas. Se houver nomes iguais, confira telefone e e-mail na lista. IDs continuam internos para vinculação e consolidação; não são utilizados na busca. Confirme telefone e e-mail. Escolha uma decisão e salve. Repita para outras decisões. As escolhas se acumulam; registros repetidos aparecem no histórico, mas cada coluna de decisão permanece marcada apenas uma vez.

## Excel e consolidação
- Importa `.xlsx` e `.xls`, primeira aba ou aba `Base`.
- Coluna `Nome` obrigatória; `ID` ou `ID Verbo` identificam cada pessoa. Sem ID, gera 001 em diante na ordem original. Baixe essa base e distribua o MESMO arquivo.
- Exporta valores das colunas originais (não promete preservar a formatação, macros ou fórmulas do arquivo de entrada), ID e quatro decisões; aba Historico contém registros, observação, horário ISO, dispositivo e identificação do servo.
- Consolidar celulares une decisões marcadas por ID, verificando nome e código original. Arquivos repetidos não duplicam eventos com o mesmo identificador. Em conflitos nos dados de contato, mantém os dados da base do aparelho que consolida e informa a quantidade de divergências para conferência.
- Exportar apenas a base com IDs não inclui decisões nem histórico.
- Importação de outra base é bloqueada após existir qualquer decisão; use consolidação para reunir arquivos do mesmo evento.
- Não existe sincronização automática. Cada instalação tem seu próprio armazenamento. Não limpe os dados do navegador ou remova o app antes de exportar.

## Publicar no Render
Crie um repositório com os arquivos deste pacote (sem planilha de pessoas). Crie um Static Site: comando de build `echo Verbo`, diretório de publicação `dist`. O render.yaml permite configurar via Blueprint. O endereço precisa de HTTPS. Não é necessário instalar dependências.

## Rodar no computador
Na pasta do projeto, execute `python -m http.server 8000 --directory dist` e abra http://localhost:8000. Abrir index.html por duplo clique não prepara o modo offline. Localhost de um computador não é o localhost do celular.

## Arquivos
`index.html`, `style.css`, `app.js`, `core.js`, `sw.js`, manifesto e ícones ficam em dist. SheetJS CE 0.20.3 está incluído localmente para leitura e escrita Excel offline (Apache 2.0). Não há fontes, scripts ou APIs externos em tempo de uso.

## Verificações desta entrega
Sintaxe JavaScript; importação da base real; preservação de valores; IDs; rejeição de duplicidades; consolidação cumulativa e idempotente; retorno Excel; contrato do cache offline. Testes de instalação e fechamento/abertura em Android/iPhone ainda devem ser realizados nos aparelhos de destino.
