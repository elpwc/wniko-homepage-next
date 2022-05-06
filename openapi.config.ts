const { generateService } = require('@umijs/openapi')
const appconfig = require ('./appconfig');

generateService({
    requestLibPath: "import request from '../../utils/request'",
    schemaPath: `${appconfig.apiBaseURL}/api-json`,
    mock: false,
    serversPath: './services/',
})

