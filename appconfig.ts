const inDebug = true;

module.exports = {
	inDebug: inDebug,
	/** 服务器根目录 */
	root: "",
	/** API Base URL */
	apiBaseURL: inDebug ? "http://localhost:8001" : "/",
};

export {};