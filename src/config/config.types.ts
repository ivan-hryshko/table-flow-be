export type JWTConfig = {
  accessTokenSecret: string;
};

export type PostgresConfig = {
  url: string;
};

export type AppConfig = {
  host: string;
  port: number;
  environment: string;
};

export type Config = {
  app: AppConfig;
  jwt: JWTConfig;
  postgres: PostgresConfig;
};
