export interface ITrackPerformanceOptions {
  trackUrl: string;
  threshold?: number;
  batchSize?: number;
  excludeKeys: string[];
  excludeHosts: string[];
  includeHosts: string[];
  parserCb: any;
  filterCb: any;
}

class TrackPerformance {
  static computeMetrics(entry: any, type: any, dom: any) {
    entry.dnsLookUp = entry.domainLookupEnd - entry.domainLookupStart;

    // Total Connection time
    entry.connectionTime = entry.connectEnd - entry.connectStart;

    // TLS time
    if (entry.secureConnectionStart > 0) {
      entry.tlsTime = entry.connectEnd - entry.secureConnectionStart;
    }

    // Time to First Byte (TTFB)
    entry.ttfb = entry.responseStart - entry.requestStart;

    /*
      The fetchStart read-only property represents a timestamp immediately
      before the browser starts to fetch the resource.
    */
    entry.fetchTime = entry.responseEnd - entry.fetchStart;
    if (entry.workerStart > 0) {
      entry.workerTime = entry.responseEnd - entry.workerStart;
    }

    /*
      The requestStart read-only property returns a timestamp of the time
      immediately before the browser starts requesting the resource from the
      server, cache, or local resource
      Request plus response time (network only)
    */
    entry.totalTime = entry.responseEnd - entry.requestStart;

    // Response time only (download)
    entry.downloadTime = entry.responseEnd - entry.responseStart;

    // HTTP header size
    entry.headerSize = entry.transferSize - entry.encodedBodySize;

    // Compression ratio
    entry.compressionRatio = entry.decodedBodySize / entry.encodedBodySize;

    // Page Time
    if (entry.entryType === "navigation") {
      entry.domContentLoaded = entry.domContentLoadedEventEnd - entry.startTime;
      entry.pageLoad = entry.loadEventEnd - entry.startTime;
    }
    dom = performance.getEntriesByType("navigation")[0];
    type = navigator;
    entry.useragent = navigator.userAgent;
    entry.os = TrackPerformance.getOS();
    entry.browser = `${window.navigator.appName}${window.navigator.appVersion}`;
    entry.devicetype = TrackPerformance.getDeviceType();
    entry.pageURL = window.location.href;
    entry.urlPath = window.location.pathname;
    entry.domain = window.location.hostname;
    entry.pageTitle = document.title;
    entry.backend = entry.ttfb;
    entry.startRender = entry.startTime;
    entry.sslNegotiation = entry.tlsTime;
    entry.redirect = entry.redirectStart;
    entry.connectiontype = type.connection.effectiveType;
    entry.domInteractive = dom.domInteractive;
    entry.domElements = document.getElementsByTagName("*").length;
    const paintTimings = performance.getEntriesByType("paint");
    entry.firstContentFullPaint = paintTimings.find(
      ({ name }) => name === "first-contentful-paint"
    );
    new PerformanceObserver((entryList) => {
      var lcp = entryList.getEntries();
      if (lcp.length) entry.largestContentFullPaint = lcp[lcp.length - 1];
    }).observe({ type: "largest-contentful-paint", buffered: true });

    requestAPICount = TrackPerformance.captureNetworkRequest;
    entry.jsRequests = requestAPICount.capture_js_request;
    entry.cssRequests = requestAPICount.capture_css_request;
    entry.imageRequests = requestAPICount.capture_img_request;

    return entry;
  }

  static chunk(array: any[], size: number) {
    return array.reduce((res, item, index) => {
      if (index % size === 0) {
        res.push([]);
      }
      res[res.length - 1].push(item);
      return res;
    }, []);
  }
  queuedEntries: any[];
  options: ITrackPerformanceOptions;
  intervalId: number;

  constructor({
    trackUrl,
    threshold = 6000,
    batchSize = 50,
    excludeKeys = [],
    excludeHosts = [],
    includeHosts = [],
    parserCb,
    filterCb,
  }: ITrackPerformanceOptions) {
    this.queuedEntries = [];
    this.options = {
      trackUrl,
      threshold,
      batchSize,
      excludeKeys,
      excludeHosts,
      includeHosts,
      parserCb,
      filterCb,
    };

    if ("performance" in window) {
      if ("PerformanceObserver" in window) {
        const perfObserver = new PerformanceObserver((list, obj) => {
          this.handleEntries(list.getEntries());
        });

        perfObserver.observe({
          entryTypes: ["resource"],
        });
      } else {
        // To-Do
      }
    }

    // tslint:disable-next-line

    window.onload = () => {
      setTimeout(() => {
        this.handleEntries(performance.getEntriesByType("navigation"));
      }, 0);
    };
    console.log("Setting up setInterval to push track data");
    this.intervalId = window.setInterval(() => {
      if (this.queuedEntries.length) {
        this.sendToServer();
        this.queuedEntries = [];
      }
    }, threshold);
  }

  handleEntries(entries: any[]) {
    const {
      trackUrl,
      excludeKeys,
      excludeHosts,
      includeHosts,
      parserCb,
      filterCb,
    } = this.options;
    entries = entries.map((entry) => entry.toJSON());

    // entries = entries.filter((entry) => {
    //   let flag = entry.name.indexOf(trackUrl) === -1;
    //   console.log(" entries.name------------>",entry.name);
    //   flag = includeHosts.length > 0 ?
    //     (flag && includeHosts.some((host) => entry.name.indexOf(host) > -1)) :
    //     (flag && !excludeHosts.some((host) => entry.name.indexOf(host) > -1));
    //   return flag;
    // });

    entries = entries.map(TrackPerformance.computeMetrics);

    if (parserCb && typeof parserCb === "function") {
      entries = entries.map(parserCb);
    }
    if (filterCb && typeof filterCb === "function") {
      entries = entries.filter(filterCb);
    }

    if (excludeKeys.length) {
      entries = entries.map((entry) => {
        return Object.keys(entry).reduce((acc: any, key) => {
          if (excludeKeys.indexOf(key) === -1) {
            acc[key] = entry[key];
          }
          return acc;
        }, {});
      });
    }
    this.queuedEntries = this.queuedEntries.concat(entries);
    console.log("queuedEntries---------->", this.queuedEntries);
  }

  sendToServer() {
    const { batchSize = 50, trackUrl } = this.options;
    const entryChunks = TrackPerformance.chunk(this.queuedEntries, batchSize);
    let promise = Promise.resolve();
    entryChunks.forEach((entryChunk: any[], index: number) => {
      promise = promise.then(() => {
        return new Promise((resolve, reject) => {
          const body = {
            data: entryChunk,
          };

          fetch(trackUrl, {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
            .then((res) => res.json())
            .then((res) => {
              return resolve();
            })
            .catch((error) => {
              // tslint:disable-next-line
              console.log("Error while sending data to /track: ", error, body);
              return resolve();
            });
        });
      });
    });
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }

  // Get device type
  static getDeviceType(): any {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  // Get OS
  static getOS(): any {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (!os && /Linux/.test(platform)) {
      os = "Linux";
    }

    return os;
  }
  static captureNetworkRequest(capture_resource: any): any {
    var capture_js_request = [];
    var capture_css_request = [];
    var capture_img_request = [];
    capture_resource = performance.getEntriesByType("resource");
    for (var i = 0; i < capture_resource.length; i++) {
      if (capture_resource[i].initiatorType == "script") {
        capture_js_request.push(capture_resource[i].name);
      }
      if (capture_resource[i].initiatorType == "css") {
        capture_css_request.push(capture_resource[i].name);
      }
      if (capture_resource[i].initiatorType == "img") {
        capture_img_request.push(capture_resource[i].name);
      }
    }
    return { capture_js_request, capture_css_request, capture_img_request };
  }
}

// export a global variable to access later
(window as any).TrackPerformance = TrackPerformance;
export default TrackPerformance;
