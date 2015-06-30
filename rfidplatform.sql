-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.1-alpha1
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
	status integer NOT NULL,
	CONSTRAINT pk_collector PRIMARY KEY (id),
	CONSTRAINT uq_collectormac UNIQUE (mac)

);
-- ddl-end --
ALTER TABLE public.collector OWNER TO rfidplatform;
-- ddl-end --

-- object: public.group | type: TABLE --
-- DROP TABLE IF EXISTS public.group CASCADE;
CREATE TABLE public.group(
	id serial NOT NULL,
	name text NOT NULL,
	creation_date timestamp NOT NULL,
	description text,
	isdefault boolean,
	CONSTRAINT pk_group PRIMARY KEY (id),
	CONSTRAINT uq_isdefault UNIQUE (isdefault)

);
-- ddl-end --
COMMENT ON TABLE public.group IS 'Refers to a group of collectors: institution, department, region, etc.';
-- ddl-end --
ALTER TABLE public.group OWNER TO rfidplatform;
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

-- object: public.user | type: TABLE --
-- DROP TABLE IF EXISTS public.user CASCADE;
CREATE TABLE public.user(
	username text NOT NULL,
	password text NOT NULL,
	email text,
	name text,
	CONSTRAINT pk_user PRIMARY KEY (username)

);
-- ddl-end --
ALTER TABLE public.user OWNER TO rfidplatform;
-- ddl-end --

-- object: public.user_session | type: TABLE --
-- DROP TABLE IF EXISTS public.user_session CASCADE;
CREATE TABLE public.user_session(
	id text NOT NULL,
	username text NOT NULL,
	CONSTRAINT pk_usersession PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.user_session OWNER TO rfidplatform;
-- ddl-end --

-- object: public.package | type: TABLE --
-- DROP TABLE IF EXISTS public.package CASCADE;
CREATE TABLE public.package(
	id serial NOT NULL,
	package_hash varchar(128) NOT NULL,
	timestamp timestamp,
	package_size int4,
	CONSTRAINT id PRIMARY KEY (id),
	CONSTRAINT uq_package_hash UNIQUE (package_hash)

);
-- ddl-end --
ALTER TABLE public.package OWNER TO rfidplatform;
-- ddl-end --

-- object: fk_group_collector | type: CONSTRAINT --
-- ALTER TABLE public.collector DROP CONSTRAINT IF EXISTS fk_group_collector CASCADE;
ALTER TABLE public.collector ADD CONSTRAINT fk_group_collector FOREIGN KEY (group_id)
REFERENCES public.group (id) MATCH FULL
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

-- object: fk_user_usersession | type: CONSTRAINT --
-- ALTER TABLE public.user_session DROP CONSTRAINT IF EXISTS fk_user_usersession CASCADE;
ALTER TABLE public.user_session ADD CONSTRAINT fk_user_usersession FOREIGN KEY (username)
REFERENCES public.user (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


