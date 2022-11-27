-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 0.9.4
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: teste_db | type: DATABASE --
-- DROP DATABASE IF EXISTS teste_db;
CREATE DATABASE teste_db;
-- ddl-end --


-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	username varchar(120) NOT NULL,
	password varchar(90) NOT NULL,
	email varchar(90) NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT user_unique UNIQUE (username)
);
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- object: public.requisitos_de_usuario | type: TABLE --
-- DROP TABLE IF EXISTS public.requisitos_de_usuario CASCADE;
CREATE TABLE public.requisitos_de_usuario (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	descritivo text NOT NULL,
	id_projeto integer,
	CONSTRAINT requisitos_de_usuario_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.requisitos_de_usuario OWNER TO postgres;
-- ddl-end --

-- object: public.requisitos_funcionais | type: TABLE --
-- DROP TABLE IF EXISTS public.requisitos_funcionais CASCADE;
CREATE TABLE public.requisitos_funcionais (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	nome varchar(120),
	id_requisitos_de_usuario integer,
	CONSTRAINT requisitos_funcionais_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.requisitos_funcionais OWNER TO postgres;
-- ddl-end --

-- object: public.projeto | type: TABLE --
-- DROP TABLE IF EXISTS public.projeto CASCADE;
CREATE TABLE public.projeto (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	nome varchar(90) NOT NULL,
	descricao text,
	id_users integer,
	CONSTRAINT projeto_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.projeto OWNER TO postgres;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE public.projeto DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE public.projeto ADD CONSTRAINT users_fk FOREIGN KEY (id_users)
REFERENCES public.users (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: projeto_fk | type: CONSTRAINT --
-- ALTER TABLE public.requisitos_de_usuario DROP CONSTRAINT IF EXISTS projeto_fk CASCADE;
ALTER TABLE public.requisitos_de_usuario ADD CONSTRAINT projeto_fk FOREIGN KEY (id_projeto)
REFERENCES public.projeto (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: requisitos_de_usuario_fk | type: CONSTRAINT --
-- ALTER TABLE public.requisitos_funcionais DROP CONSTRAINT IF EXISTS requisitos_de_usuario_fk CASCADE;
ALTER TABLE public.requisitos_funcionais ADD CONSTRAINT requisitos_de_usuario_fk FOREIGN KEY (id_requisitos_de_usuario)
REFERENCES public.requisitos_de_usuario (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.requisitos_de_crud | type: TABLE --
-- DROP TABLE IF EXISTS public.requisitos_de_crud CASCADE;
CREATE TABLE public.requisitos_de_crud (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	tipo varchar(20) NOT NULL,
	id_requisitos_funcionais integer,
	CONSTRAINT requisitos_de_crud_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.requisitos_de_crud OWNER TO postgres;
-- ddl-end --

-- object: requisitos_funcionais_fk | type: CONSTRAINT --
-- ALTER TABLE public.requisitos_de_crud DROP CONSTRAINT IF EXISTS requisitos_funcionais_fk CASCADE;
ALTER TABLE public.requisitos_de_crud ADD CONSTRAINT requisitos_funcionais_fk FOREIGN KEY (id_requisitos_funcionais)
REFERENCES public.requisitos_funcionais (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.entidades | type: TABLE --
-- DROP TABLE IF EXISTS public.entidades CASCADE;
CREATE TABLE public.entidades (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	nome varchar(120),
	id_requisitos_de_crud integer,
	CONSTRAINT entidades_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.entidades OWNER TO postgres;
-- ddl-end --

-- object: public.atributos | type: TABLE --
-- DROP TABLE IF EXISTS public.atributos CASCADE;
CREATE TABLE public.atributos (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	nome varchar(120) NOT NULL,
	tipo varchar(20),
	tamanho varchar(4),
	id_entidades integer,
	CONSTRAINT atributos_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.atributos OWNER TO postgres;
-- ddl-end --

-- object: entidades_fk | type: CONSTRAINT --
-- ALTER TABLE public.atributos DROP CONSTRAINT IF EXISTS entidades_fk CASCADE;
ALTER TABLE public.atributos ADD CONSTRAINT entidades_fk FOREIGN KEY (id_entidades)
REFERENCES public.entidades (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: requisitos_de_crud_fk | type: CONSTRAINT --
-- ALTER TABLE public.entidades DROP CONSTRAINT IF EXISTS requisitos_de_crud_fk CASCADE;
ALTER TABLE public.entidades ADD CONSTRAINT requisitos_de_crud_fk FOREIGN KEY (id_requisitos_de_crud)
REFERENCES public.requisitos_de_crud (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.requisitos_de_processamento | type: TABLE --
-- DROP TABLE IF EXISTS public.requisitos_de_processamento CASCADE;
CREATE TABLE public.requisitos_de_processamento (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 START WITH 1 ),
	descricao varchar(120),
	id_requisitos_funcionais integer,
	CONSTRAINT requisitos_de_processamento_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.requisitos_de_processamento OWNER TO postgres;
-- ddl-end --

-- object: requisitos_funcionais_fk | type: CONSTRAINT --
-- ALTER TABLE public.requisitos_de_processamento DROP CONSTRAINT IF EXISTS requisitos_funcionais_fk CASCADE;
ALTER TABLE public.requisitos_de_processamento ADD CONSTRAINT requisitos_funcionais_fk FOREIGN KEY (id_requisitos_funcionais)
REFERENCES public.requisitos_funcionais (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: public.condicoes_teste | type: TABLE --
-- DROP TABLE IF EXISTS public.condicoes_teste CASCADE;
CREATE TABLE public.condicoes_teste (
	id_requisitos_funcionais integer NOT NULL,
	id_requisitos_funcionais1 integer NOT NULL,
	"Condicao" varchar(60) NOT NULL,
	CONSTRAINT condicoes_teste_pk PRIMARY KEY (id_requisitos_funcionais,id_requisitos_funcionais1)
);
-- ddl-end --

-- object: requisitos_funcionais_fk | type: CONSTRAINT --
-- ALTER TABLE public.condicoes_teste DROP CONSTRAINT IF EXISTS requisitos_funcionais_fk CASCADE;
ALTER TABLE public.condicoes_teste ADD CONSTRAINT requisitos_funcionais_fk FOREIGN KEY (id_requisitos_funcionais)
REFERENCES public.requisitos_funcionais (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: requisitos_funcionais_fk1 | type: CONSTRAINT --
-- ALTER TABLE public.condicoes_teste DROP CONSTRAINT IF EXISTS requisitos_funcionais_fk1 CASCADE;
ALTER TABLE public.condicoes_teste ADD CONSTRAINT requisitos_funcionais_fk1 FOREIGN KEY (id_requisitos_funcionais1)
REFERENCES public.requisitos_funcionais (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: public.itens_de_analise_de_riscos | type: TABLE --
-- DROP TABLE IF EXISTS public.itens_de_analise_de_riscos CASCADE;
CREATE TABLE public.itens_de_analise_de_riscos (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
	descricao varchar(280) NOT NULL,
	resposta varchar(20),
	id_projeto integer,
	CONSTRAINT analise_riscos_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.itens_de_analise_de_riscos OWNER TO postgres;
-- ddl-end --

-- object: projeto_fk | type: CONSTRAINT --
-- ALTER TABLE public.itens_de_analise_de_riscos DROP CONSTRAINT IF EXISTS projeto_fk CASCADE;
ALTER TABLE public.itens_de_analise_de_riscos ADD CONSTRAINT projeto_fk FOREIGN KEY (id_projeto)
REFERENCES public.projeto (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --



CREATE OR REPLACE FUNCTION insere_itens()
	RETURNS trigger AS $body$
	BEGIN
	--COMPLEXIDADE DO PROJETO
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Este é um projeto da Web? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Tamanho do projeto? (Pequeno/médio/grande/empresarial/global)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Este é um projeto Especialista? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Grau de dificuldade da produção? (Simples/moderada/difícil/complexo)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Grau de dificuldade da manutenção? (Simples/moderada/difícil/complexo)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Grau do aprendizado sobre tecnológias aplicadas? (Simples/moderada/difícil/complexo)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Qual o tamanho necessário da equipe para o projeto? (quantidade aproximada)', NEW.id);
--RECURSOS DE DESENVOLVIMENTO
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Pretente usar uma linguagem de programação recém lançada? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Modelos NoSQL de dados? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Faz mesclas com outros processos de desenvolvimento ágil? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Grau de dificuldade de integração com outros sistemas? (Simples/moderada/difícil/complexo)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Grau da Complexidade na modelagem do projeto? (Simples/moderada/difícil/complexo)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Fará uso de framework para front-end ?', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Fará uso de framework para back-end ?', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Utiliza API com microservices para produtos escaláveis? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Chat para comunicação instantânea? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Usará georreferenciamento? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Usará reconhecimento de voz? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Usará reconhecimento de imagem? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Utiliza servidores Web tradicionais e não conteiners Docker ? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Projeto de testes de unidades, estruturais e de aceitação? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Projeto de testes de integração e teste de carga? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Projeto de testes de segurança? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Você planeja documentar análises e projetos de software? (S/N)', NEW.id);
--GESTAO DO PROJETO
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Sua equipe de projeto tem algum membro especialista em Análises para Desenvolvimento Ágil? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Sua equipe de projeto tem algum membro especialista em Engenharia de Software? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Sua equipe de projeto precisa de serviços de suporte arquitetônico? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Sua equipe de projeto precisa de serviços de suporte de desenvolvimento? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Houve orçamento para possíveis necessidades de treinamento? (S/N)', NEW.id);
		INSERT INTO itens_de_analise_de_riscos (descricao,id_projeto) values ('Sua equipe do projeto pode atingir seus objetivos sem assistência? (S/N)', NEW.id);


		RETURN NEW;
    END;
	
	$body$ LANGUAGE plpgsql;


CREATE TRIGGER inserir_itens_de_risco AFTER INSERT ON projeto
FOR EACH ROW
EXECUTE PROCEDURE insere_itens();

