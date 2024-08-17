CREATE USER workuser WITH PASSWORD 'workuser_pass';
GRANT workuser TO postgres;

GRANT ALL PRIVILEGES ON T_ROUTE_INFO To workuser;