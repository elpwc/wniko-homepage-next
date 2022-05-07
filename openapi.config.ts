const { generateService } = require('@umijs/openapi')
//const { generateService } = require('wnikoopenapi2typescript')
const appconfig = require ('./appconfig');

generateService({
    requestLibPath: "import request from '../../utils/request'",
    schemaPath: `${appconfig.apiBaseURL}/api-json`,
    mock: false,
    serversPath: './services/',
})

