import * as appconfig from './appconfig';

export default {
  openAPI: {
    requestLibPath: "import request from '../../utils/request'",
    schemaPath: `${appconfig.default.apiBaseURL}/api/swagger.json`,
    mock: false,
  },
};
