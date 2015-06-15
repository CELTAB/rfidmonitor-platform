-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.1-alpha1
-- PostgreSQL version: 9.0
-- Project Site: pgmodeler.com.br
-- Model Author: ---


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: rfidplatform | type: DATABASE --
-- -- DROP DATABASE IF EXISTS rfidplatform;
-- CREATE DATABASE rfidplatform
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
	rfiddata_type_id integer NOT NULL,
	status integer NOT NULL,
	CONSTRAINT pk_collector PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.collector OWNER TO rfidplatform;
-- ddl-end --

-- object: public.group | type: TABLE --
-- DROP TABLE IF EXISTS public.group CASCADE;
CREATE TABLE public.group(
	id serial NOT NULL,
	name text NOT NULL,
	lat text,
	lng text,
	creation_date timestamp NOT NULL,
	CONSTRAINT pk_group PRIMARY KEY (id)

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
	collector_mac text NOT NULL,
	group_id integer NOT NULL,
	timestamp timestamp NOT NULL,
	md5hash text NOT NULL,
	rfidcode text NOT NULL,
	collector_id integer NOT NULL,
	extra_data text,
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

-- object: fk_group_collector | type: CONSTRAINT --
-- ALTER TABLE public.collector DROP CONSTRAINT IF EXISTS fk_group_collector CASCADE;
ALTER TABLE public.collector ADD CONSTRAINT fk_group_collector FOREIGN KEY (group_id)
REFERENCES public.group (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_group_rfiddata | type: CONSTRAINT --
-- ALTER TABLE public.rfiddata DROP CONSTRAINT IF EXISTS fk_group_rfiddata CASCADE;
ALTER TABLE public.rfiddata ADD CONSTRAINT fk_group_rfiddata FOREIGN KEY (group_id)
REFERENCES public.group (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_collector_rfidata | type: CONSTRAINT --
-- ALTER TABLE public.rfiddata DROP CONSTRAINT IF EXISTS fk_collector_rfidata CASCADE;
ALTER TABLE public.rfiddata ADD CONSTRAINT fk_collector_rfidata FOREIGN KEY (collector_id)
REFERENCES public.collector (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_user_usersession | type: CONSTRAINT --
-- ALTER TABLE public.user_session DROP CONSTRAINT IF EXISTS fk_user_usersession CASCADE;
ALTER TABLE public.user_session ADD CONSTRAINT fk_user_usersession FOREIGN KEY (username)
REFERENCES public.user (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


