
  var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }

  Module.expectedDataFileDownloads++;
  (function() {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    if (Module['ENVIRONMENT_IS_PTHREAD'] || Module['$ww']) return;
    var loadPackage = function(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '/Users/maxamillion/workspace/OpenJKDF2/build_emcc/openjkdf2_data.data';
      var REMOTE_PACKAGE_BASE = 'openjkdf2_data.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus'](`Downloading data... (${loaded}/${total})`);
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };

      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);

    function runWithFS() {

      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
Module['FS_createPath']("/", "jk1", true, true);
Module['FS_createPath']("/jk1", "episode", true, true);
Module['FS_createPath']("/jk1", "player_", true, true);
Module['FS_createPath']("/jk1/player_", "Demo", true, true);
Module['FS_createPath']("/jk1", "resource", true, true);
Module['FS_createPath']("/jk1/resource", "video", true, true);
Module['FS_createPath']("/", "mots", true, true);
Module['FS_createPath']("/mots", "episode", true, true);
Module['FS_createPath']("/mots", "player_", true, true);
Module['FS_createPath']("/mots/player_", "Demo", true, true);
Module['FS_createPath']("/mots", "resource", true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency'](`fp ${this.name}`);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
          // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true);
          Module['removeRunDependency'](`fp ${that.name}`);
          this.requests[this.name] = null;
        }
      };

      var files = metadata['files'];
      for (var i = 0; i < files.length; ++i) {
        new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
      }

      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }          Module['removeRunDependency']('datafile_/Users/maxamillion/workspace/OpenJKDF2/build_emcc/openjkdf2_data.data');

      };
      Module['addRunDependency']('datafile_/Users/maxamillion/workspace/OpenJKDF2/build_emcc/openjkdf2_data.data');

      if (!Module.preloadResults) Module.preloadResults = {};

      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }

    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/.DS_Store", "start": 0, "end": 8196}, {"filename": "/jk1/.DS_Store", "start": 8196, "end": 16392}, {"filename": "/jk1/episode/.DS_Store", "start": 16392, "end": 22540}, {"filename": "/jk1/episode/jk1demo.gob", "start": 22540, "end": 3641360}, {"filename": "/jk1/episode/jk1mpdem.gob", "start": 3641360, "end": 4315421}, {"filename": "/jk1/player_/.DS_Store", "start": 4315421, "end": 4321569}, {"filename": "/jk1/player_/Demo/.DS_Store", "start": 4321569, "end": 4327717}, {"filename": "/jk1/player_/Demo/Demo.plr", "start": 4327717, "end": 4329209}, {"filename": "/jk1/resource/.DS_Store", "start": 4329209, "end": 4335357}, {"filename": "/jk1/resource/jk_.cd", "start": 4335357, "end": 4335361}, {"filename": "/jk1/resource/res1demo.gob", "start": 4335361, "end": 35661812}, {"filename": "/jk1/resource/video/.DS_Store", "start": 35661812, "end": 35667960}, {"filename": "/jk1/resource/video/splash.smk", "start": 35667960, "end": 37616768}, {"filename": "/mots/.DS_Store", "start": 37616768, "end": 37624964}, {"filename": "/mots/episode/.DS_Store", "start": 37624964, "end": 37631112}, {"filename": "/mots/episode/jkmdemo.goo", "start": 37631112, "end": 40311210}, {"filename": "/mots/player_/.DS_Store", "start": 40311210, "end": 40317358}, {"filename": "/mots/player_/Demo/Demo.plr", "start": 40317358, "end": 40318907}, {"filename": "/mots/player_/Demo/openjkdf2.json", "start": 40318907, "end": 40319430}, {"filename": "/mots/resource/.DS_Store", "start": 40319430, "end": 40325578}, {"filename": "/mots/resource/jk_.cd", "start": 40325578, "end": 40325582}, {"filename": "/mots/resource/jkmdres.goo", "start": 40325582, "end": 63875217}], "remote_package_size": 63875217});

  })();
