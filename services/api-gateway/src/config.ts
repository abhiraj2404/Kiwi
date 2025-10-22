import { config as commonConfig } from "@x402/common/config";

export const config = {
  ...commonConfig,
  PORT: commonConfig.API_PORT,
  HOST: commonConfig.API_HOST
};
