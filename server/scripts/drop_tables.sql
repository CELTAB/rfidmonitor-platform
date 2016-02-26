-- DROP RFIDPLATFORM tables
-- To execute:
-- cd server/scripts
-- psql rfidplatform -U rfidplatform -f drop_tables.sql

-- To drop Dinamic Entities:
-- drop table tb_de_ (Name of the DE) cascade;
drop table tb_plat_access_token cascade;
drop table tb_plat_app_client cascade;
drop table tb_plat_collector cascade;
drop table tb_plat_dynamic_entity cascade;
drop table tb_plat_group cascade;
drop table tb_plat_package cascade;
drop table tb_plat_platform_media cascade;
drop table tb_plat_rfiddata cascade;
drop table tb_plat_route_access cascade;
drop table tb_plat_uri_route cascade;
drop table tb_plat_user cascade;
