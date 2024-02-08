/**
 * Handles jsonp requests. Helps with CORS
 */
export default class JsonpRequest<Response> {
  url: URL;

  /**
   * @param url Request URL.
   */
  constructor(url: string | URL) {
    this.url = new URL(url);
  }

  /**
   * Fetch data from the server.
   */
  fetch(): Promise<Response> {
    return new Promise((resolve, reject) => {
      const callbackName = this.createCallbackName();

      this.url.searchParams.set("json_callback", callbackName);

      const scriptElement = document.createElement("script");
      scriptElement.src = this.url.toString();

      this.onScriptError(scriptElement, reject);
      this.onScriptSuccess(scriptElement, callbackName, resolve);

      document.body.appendChild(scriptElement);
    });
  }

  /**
   * Generate callback function name.
   * @private
   */
  private createCallbackName(): string {
    return "msa_jsonp_" + Math.round(Math.random() * 100000);
  }

  private onScriptError(el: HTMLScriptElement, callback: (error: any) => void) {
    el.addEventListener("error", (error) => {
      callback(error);
    });
  }

  private onScriptSuccess(
    el: HTMLScriptElement,
    callbackName: string,
    callback: (data: Response) => void,
  ) {
    (window as any)[callbackName] = function (data: Response) {
      delete (window as any)[callbackName];
      document.body.removeChild(el);
      callback(data);
    };
  }
}
