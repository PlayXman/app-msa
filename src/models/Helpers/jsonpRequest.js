/**
 * Handles jsonp requests. Helps with CORS
 */
class Jsonp {
	/**
	 * Makes http request for jsonp source data. Deals with CORS problem
	 * @param {string} url Requested URL
	 * @return {Promise<{},{}>} Returns parsed data or err
	 */
	static jsonpRequest(url) {
		return new Promise((resolve, reject) => {
			const callbackName = Jsonp._createCallbackName();
			url = Jsonp._prepareUrl(url, callbackName);
			const script = Jsonp._createScript(url, reject);

			Jsonp._runCallbackJsonpFunction(callbackName, script, resolve);

			document.body.appendChild(script);
		});
	}

	/**
	 * Creates callback function name for URL
	 * @return {string}
	 * @private
	 */
	static _createCallbackName() {
		return 'msa_jsonp_' + Math.round(100000 * Math.random());
	}

	/**
	 * Adds callback param and callback function name into the URL
	 * @param {string} url
	 * @param {string} callbackName
	 * @return {string} Prepared URL
	 * @private
	 */
	static _prepareUrl(url, callbackName) {
		if (url.match(/\?/)) {
			url += '&json_callback=' + callbackName;
		} else {
			url += '?json_callback=' + callbackName;
		}

		return url;
	}

	/**
	 * Creates script element which fetches data from url
	 * @param {string} url
	 * @param {function} promiseReject Promise reject
	 * @return {HTMLElementTagNameMap}
	 * @private
	 */
	static _createScript(url, promiseReject) {
		const script = document.createElement('script');

		script.src = url;

		// error handler
		script.addEventListener('error', (err) => {
			promiseReject(err);
		});

		return script;
	}

	/**
	 * Runs callback jsonp function and deletes script element from body
	 * @param {string} callbackName
	 * @param {HTMLElementTagNameMap} script
	 * @param promiseResolve
	 * @private
	 */
	static _runCallbackJsonpFunction(callbackName, script, promiseResolve) {
		window[callbackName] = function (data) {
			delete window[callbackName];
			document.body.removeChild(script);

			promiseResolve(data);
		};
	}
}

export default Jsonp.jsonpRequest;
