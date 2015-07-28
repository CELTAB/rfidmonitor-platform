-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.1-beta1
-- PostgreSQL version: 9.4
-- Project Site: pgmodeler.com.br
-- Model Author: ---

-- -- object: rfidplatform | type: ROLE --
-- -- DROP ROLE IF EXISTS rfidplatform;
-- CREATE ROLE rfidplatform WITH 
-- 	CREATEDB
-- 	LOGIN
-- 	UNENCRYPTED PASSWORD 'rfidplatform';
-- -- ddl-end --
-- 

-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: rfidplatform | type: DATABASE --
-- -- DROP DATABASE IF EXISTS rfidplatform;
-- CREATE DATABASE rfidplatform
-- 	OWNER = rfidplatform
-- ;
-- -- ddl-end --
-- 

-- object: public.collector | type: TABLE --
-- DROP TABLE IF EXISTS public.collector CASCADE;
CREATE TABLE public.collector(
	id serial NOT NULL,
	group_id integer NOT NULL,
	name text NOT NULL,
	mac text NOT NULL,
	description text,
	lat text,
	lng text,
	CONSTRAINT pk_collector PRIMARY KEY (id),
	CONSTRAINT uq_collectormac UNIQUE (mac)

);
-- ddl-end --
ALTER TABLE public.collector OWNER TO rfidplatform;
-- ddl-end --

-- object: public."group" | type: TABLE --
-- DROP TABLE IF EXISTS public."group" CASCADE;
CREATE TABLE public."group"(
	id serial NOT NULL,
	name text NOT NULL,
	creation_date timestamp NOT NULL,
	description text,
	isdefault boolean,
	CONSTRAINT pk_group PRIMARY KEY (id),
	CONSTRAINT uq_isdefault UNIQUE (isdefault)

);
-- ddl-end --
COMMENT ON TABLE public."group" IS 'Refers to a group of collectors: institution, department, region, etc.';
-- ddl-end --
ALTER TABLE public."group" OWNER TO rfidplatform;
-- ddl-end --

-- object: public.rfiddata | type: TABLE --
-- DROP TABLE IF EXISTS public.rfiddata CASCADE;
CREATE TABLE public.rfiddata(
	id serial NOT NULL,
	rfid_read_date timestamp NOT NULL,
	rfidcode text NOT NULL,
	collector_id integer NOT NULL,
	extra_data text,
	package_id serial NOT NULL,
	server_received_date timestamp NOT NULL,
	CONSTRAINT pk_rfiddata PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.rfiddata IS 'json string containing extra fields';
-- ddl-end --
ALTER TABLE public.rfiddata OWNER TO rfidplatform;
-- ddl-end --

-- object: public.user_platform | type: TABLE --
-- DROP TABLE IF EXISTS public.user_platform CASCADE;
CREATE TABLE public.user_platform(
	username text,
	password text NOT NULL,
	email text,
	name text,
	id serial NOT NULL,
	CONSTRAINT pk_user PRIMARY KEY (id),
	CONSTRAINT uq_user_username UNIQUE (username)

);
-- ddl-end --
ALTER TABLE public.user_platform OWNER TO rfidplatform;
-- ddl-end --

-- object: public.package | type: TABLE --
-- DROP TABLE IF EXISTS public.package CASCADE;
CREATE TABLE public.package(
	id serial NOT NULL,
	package_hash varchar(128) NOT NULL,
	"timestamp" timestamp,
	package_size int4,
	CONSTRAINT id PRIMARY KEY (id),
	CONSTRAINT uq_package_hash UNIQUE (package_hash)

);
-- ddl-end --
ALTER TABLE public.package OWNER TO rfidplatform;
-- ddl-end --

-- object: public.app_client | type: TABLE --
-- DROP TABLE IF EXISTS public.app_client CASCADE;
CREATE TABLE public.app_client(
	id serial NOT NULL,
	auth_secret text NOT NULL,
	client_name text NOT NULL,
	description text,
	CONSTRAINT pk_id_app_client PRIMARY KEY (id),
	CONSTRAINT uq_client_name UNIQUE (client_name)

);
-- ddl-end --
ALTER TABLE public.app_client OWNER TO rfidplatform;
-- ddl-end --

-- object: public.access_token | type: TABLE --
-- DROP TABLE IF EXISTS public.access_token CASCADE;
CREATE TABLE public.access_token(
	id serial NOT NULL,
	value text NOT NULL,
	app_client_id serial NOT NULL,
	CONSTRAINT pk_access_token PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.access_token OWNER TO rfidplatform;
-- ddl-end --

-- object: public.authorization_code | type: TABLE --
-- DROP TABLE IF EXISTS public.authorization_code CASCADE;
CREATE TABLE public.authorization_code(
	id serial NOT NULL,
	value text NOT NULL,
	redirect_uri text NOT NULL,
	user_id integer NOT NULL,
	CONSTRAINT pk_id_authorization_code PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.authorization_code OWNER TO rfidplatform;
-- ddl-end --

-- object: public.router_access | type: TABLE --
-- DROP TABLE IF EXISTS public.router_access CASCADE;
CREATE TABLE public.router_access(
	id serial NOT NULL,
	app_client_id serial NOT NULL,
	uri_routers_id serial NOT NULL,
	CONSTRAINT pk_id_router_access PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.router_access OWNER TO rfidplatform;
-- ddl-end --

-- -- object: public.http_methods | type: TYPE --
-- -- DROP TYPE IF EXISTS public.http_methods CASCADE;
-- CREATE TYPE public.http_methods AS
--  ENUM ('GET','POST','PUT','DELETE','ANY');
-- -- ddl-end --
-- ALTER TYPE public.http_methods OWNER TO rfidplatform;
-- -- ddl-end --
-- 
-- object: public.uri_routers | type: TABLE --
-- DROP TABLE IF EXISTS public.uri_routers CASCADE;

-- Prepended SQL commands --
-- object: public.http_methods | type: TYPE --
-- DROP TYPE IF EXISTS public.http_methods CASCADE;
CREATE TYPE public.http_methods AS
 ENUM ('GET','POST','PUT','DELETE','ANY');
-- ddl-end --
ALTER TYPE public.http_methods OWNER TO rfidplatform;
-- ddl-end --
-- ddl-end --

CREATE TABLE public.uri_routers(
	id serial NOT NULL,
	path text NOT NULL,
	method public.http_methods NOT NULL,
	CONSTRAINT pk_uri_routers PRIMARY KEY (id),
	CONSTRAINT uq_uri_routers_method_path UNIQUE (path,method)

);
-- ddl-end --
ALTER TABLE public.uri_routers OWNER TO rfidplatform;
-- ddl-end --

-- object: fk_group_collector | type: CONSTRAINT --
-- ALTER TABLE public.collector DROP CONSTRAINT IF EXISTS fk_group_collector CASCADE;
ALTER TABLE public.collector ADD CONSTRAINT fk_group_collector FOREIGN KEY (group_id)
REFERENCES public."group" (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_collector_rfidata | type: CONSTRAINT --
-- ALTER TABLE public.rfiddata DROP CONSTRAINT IF EXISTS fk_collector_rfidata CASCADE;
ALTER TABLE public.rfiddata ADD CONSTRAINT fk_collector_rfidata FOREIGN KEY (collector_id)
REFERENCES public.collector (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_package_rfidadata | type: CONSTRAINT --
-- ALTER TABLE public.rfiddata DROP CONSTRAINT IF EXISTS fk_package_rfidadata CASCADE;
ALTER TABLE public.rfiddata ADD CONSTRAINT fk_package_rfidadata FOREIGN KEY (package_id)
REFERENCES public.package (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_app_client_id | type: CONSTRAINT --
-- ALTER TABLE public.access_token DROP CONSTRAINT IF EXISTS fk_app_client_id CASCADE;
ALTER TABLE public.access_token ADD CONSTRAINT fk_app_client_id FOREIGN KEY (app_client_id)
REFERENCES public.app_client (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_user_platform_auth_code | type: CONSTRAINT --
-- ALTER TABLE public.authorization_code DROP CONSTRAINT IF EXISTS fk_user_platform_auth_code CASCADE;
ALTER TABLE public.authorization_code ADD CONSTRAINT fk_user_platform_auth_code FOREIGN KEY (user_id)
REFERENCES public.user_platform (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_app_client_id | type: CONSTRAINT --
-- ALTER TABLE public.router_access DROP CONSTRAINT IF EXISTS fk_app_client_id CASCADE;
ALTER TABLE public.router_access ADD CONSTRAINT fk_app_client_id FOREIGN KEY (app_client_id)
REFERENCES public.app_client (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_uri_routers_router_access | type: CONSTRAINT --
-- ALTER TABLE public.router_access DROP CONSTRAINT IF EXISTS fk_uri_routers_router_access CASCADE;
ALTER TABLE public.router_access ADD CONSTRAINT fk_uri_routers_router_access FOREIGN KEY (uri_routers_id)
REFERENCES public.uri_routers (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


