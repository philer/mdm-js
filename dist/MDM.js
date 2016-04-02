(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.MDM = global.MDM || {})));
}(this, function (exports) { 'use strict';

  var undefined;

  var babelHelpers = {};

  babelHelpers.asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              return step("next", value);
            }, function (err) {
              return step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var listeners = Object.create(null);

  function addEventListener(evt, listener) {
    if (evt in listeners) {
      listeners[evt].push(listener);
    } else {
      listeners[evt] = [listener];
    }
  }

  function removeEventListener(evt, listener) {
    if (evt in listeners) {
      if (listener) {
        var fns = listeners[evt];

        // remove first occurence
        for (var i = 0, len = fns.length; i < len; ++i) {
          var fn = fns[i];

          // fn._fn identifies wrapped .once listeners
          if (fn === listener || fn._fn === listener) {
            if (fns.length === 1) {

              // don't keep an empty array
              delete listeners[evt];
            } else {
              fns.splice(i, 1);
            }
            break;
          }
        }
      } else {
        delete listeners[evt];
      }
    }
  }

  function once(evt, listener) {
    function wrapper(evt) {
      removeEventListener(evt, wrapper);
      listener.call(this, evt);
    }
    wrapper._fn = listener; // identifiable for .off
    addEventListener(evt, wrapper);
  }

  function trigger(evt) {
    var _console;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_console = console).log.apply(_console, [evt].concat(args));
    if (evt in listeners) {
      var fns = listeners[evt].slice();
      for (var i = 0, len = fns.length; i < len; ++i) {
        fns[i].apply(fns, [evt].concat(args));
      }
    }
  }

  var listeners$1 = Object.create(null);

  function once$1(evt, fn) {
    listeners$1[evt] = fn;
  }

  function off(evt) {
    delete listeners$1[evt];
  }

  /**
   * Trigger the listener if it exists. If it doesn't exist or returns true
   * on execution the event is triggered publicly.
   * 
   * @param  {String}    evt  event name
   * @param  {...mixed} args  array of arguments
   */
  function trigger$1(evt) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (evt in listeners$1) {
      var listener = listeners$1[evt];
      off(evt);
      if (!listener.apply(undefined, [evt].concat(args))) {
        return;
      }
    }
    trigger.apply(undefined, [evt].concat(args));
  }

  /**
  * Represents a user.
  * 
  * @param {string} username
  * @param {string} gecos     full name etc.
  * @param {string} status    online?
  */

  var User = function () {
    function User(username, gecos, loggedIn, facefile) {
      babelHelpers.classCallCheck(this, User);


      /**
       * unique identifier
       * 
       * @type {String}
       */
      this.id = username;

      /**
       * login name
       * 
       * @type {string}
       */
      this.name = username;

      /**
       * full name etc.
       * 
       * @type {string}
       */
      this.gecos = gecos;

      /**
       * user online? false if no, localized string if yes
       * 
       * @type {boolean|string}
       */
      this.loggedIn = loggedIn || false;

      /**
       * Path to User's facefile (aka. avatar)
       * 
       * Earlier versions of MDM don't provide this parameter
       * so we default to the usual path `/home/<username>/.face`
       * 
       * @type {string}
       */
      this.facefile = facefile || "file:///home/" + username + "/.face";
    }

    /**
     * Tell MDM to use this user for upcoming login
     * @return {User} chainable
     */


    babelHelpers.createClass(User, [{
      key: "select",
      value: function select() {
        selectUser(this);
        return this;
      }
    }]);
    return User;
  }();

  /**
   * Represents a session.
   * 
   * @param {string} name
   * @param {string} file
   */

  var Session = function () {
    function Session(name, file) {
      babelHelpers.classCallCheck(this, Session);


      /**
       * unique identifier
       * 
       * @type {String}
       */
      this.id = file;

      /**
       * session name
       * 
       * @type {String}
       */
      this.name = name;

      /**
       * session file name
       * @type {String}
       */
      this.file = file;
    }

    /**
     * Tell MDM to use this session for upcoming login
     * @return {Session} chainable
     */


    babelHelpers.createClass(Session, [{
      key: 'select',
      value: function select() {
        selectSession(this);
        return this;
      }
    }]);
    return Session;
  }();

  /**
   * Represents a language.
   * 
   * @param {string} name
   * @param {string} code
   */

  var Language = function () {
    function Language(name, code) {
      babelHelpers.classCallCheck(this, Language);


      /**
       * unique identifier
       * 
       * @type {String}
       */
      this.id = code;

      /**
       * Language name
       * 
       * @type {String}
       */
      this.name = name;

      /**
       * Full language code (e.g. en_US.UTF-8)
       * @type {String}
       */
      this.code = code;
    }

    /**
     * Tell MDM to use this language for upcoming login
     * @return {User} chainable
     */


    babelHelpers.createClass(Language, [{
      key: 'select',
      value: function select() {
        selectLanguage(this);
        return this;
      }

      /**
       * country specific language code
       * 
       * @return {String} e.g. en_US
       */

    }, {
      key: 'countryCode',
      value: function countryCode() {
        return this.code.split('.')[0];
      }

      /**
       * short language code
       * 
       * @return {String} e.g. en
       */

    }, {
      key: 'shortCode',
      value: function shortCode() {
        return this.code.split('_')[0];
      }

      /**
       * Language encoding as specified by language code
       * 
       * @return {String} e.g. UTF-8
       */

    }, {
      key: 'charset',
      value: function charset() {
        return this.code.split('.')[1];
      }
    }]);
    return Language;
  }();

  /**
   * Queue that executes callback synchronously.
   * Each callback will be called only once the previous one has been resolved
   * or rejected.
   */
  function PromiseQueue() {
    this._items = [];
    this._running = false;
  }

  PromiseQueue.prototype = {

    /**
     * Add a function that can be used as an argument to Promise()
     * @param  {Function} callback args: resolve, reject
     * @return {Promise}           Promise that will resolve when 
     */

    push: function push(callback) {
      var _this = this;

      var p = new Promise(function (resolve, reject) {
        return _this._items.push({ callback: callback, resolve: resolve, reject: reject });
      });
      this._start();
      return p;
    },
    _start: function _start() {
      // already started
      if (this._running /* || !this._items.length*/) {
          return;
        }
      this._running = true;
      this._next();
    },


    /**
     * Run the Queue.
     * This means that items will be executed one by one until the queue is empty.
     */
    _next: function _next() {
      if (!this._items.length) {
        this._running = false;
        return;
      }

      var call = this._items.shift();
      var queue = this;

      // call.callback is the user-provided function (see .push)
      new Promise(call.callback).then(function () {
        call.resolve.apply(call, arguments);
        queue._next();
      }, function () {
        call.reject.apply(call, arguments);
        queue._next();
      });
    }
  };

  var users = [];
  var sessions = [];
  var languages = [];

  // user.id, session.id and language.id that were selected through user input
  var selectedSettings = Object.create(null);

  // user.id, session.id and language.id that were chosen by MDM
  var currentSettings = Object.create(null);

  var apiCallQueue = new PromiseQueue();

  var passwordExpected = false;

  // utility: create a shallow copy of an object including prototype
  var copy = function copy(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  };

  // utility: don't rely on a polyfill for Array.prototype.find
  function find(fn, arr) {
    for (var i = 0, len = arr.length; i < len; ++i) {
      if (fn(arr[i])) return arr[i];
    }
  }

  /// LOGIN API ///

  /**
   * Attempt a login using the provided data.
   * Convenience/Wrapper function for most use cases.
   * 
   * @param  {User|string}     username
   * @param  {string}          password
   * @param  {Session|string}  session  optional
   * @param  {Language|string} language optional
   */
  function login(user, password, session, language) {
    if (session) {
      selectSession(session);
      if (language) {
        selectLanguage(language);
      }
    }
    if (!selectedSettings.user || selectedSettings.user !== (user.id || user)) {
      selectUser(user);
    }
    return sendPassword(password);
  }

  /**
   * Attempt a login using the provided password.
   * A user must already be selected; Use this function for a traditional
   * two-step login.
   * 
   * @param  {string} password
   * @return {Promise}
   */
  function sendPassword(password) {

    if (!password) {
      return Promise.reject("Password required!");
    }
    if (!selectedSettings.user) {
      return Promise.reject("Please chose a login name!");
    }

    var settings = copy(selectedSettings);

    return apiCallQueue.push(function () {
      var ref = babelHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve /*, reject*/) {
        var session, language, errorMessage;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(settings.user !== currentSettings.user || !passwordExpected)) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return selectUser(settings.user);

              case 3:

                if ("session" in settings && settings.session !== currentSettings.session) {
                  session = getSession(settings.session);

                  // no reply expected

                  alert("SESSION###" + session.name + "###" + session.file);
                }

                if ("language" in settings && settings.language !== currentSettings.language) {
                  language = getLanguage(settings.language);

                  // no reply expected

                  alert("LANGUAGE###" + language.code);
                }

                errorMessage = void 0;

                once$1("error", function (evt, msg) {
                  return errorMessage = msg;
                });

                once$1("passwordPrompt", function () {
                  // we resolve instead of rejecting since this is currently the only
                  // relevant case. If the attempt succeeds we get terminated immediately.
                  resolve(errorMessage);
                  return true;
                });

                passwordExpected = false;
                alert("LOGIN###" + password);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      return function (_x) {
        return ref.apply(this, arguments);
      };
    }());
  }

  /// SIMPLE SETTERS ///

  /**
   * Set the session to log in into.
   * 
   * @param  {Session} session
   * @return {mdm}             chainable
   */
  function selectUser(user) {
    user = getUser(user);
    selectedSettings.user = user.id;
    return apiCallQueue.push(function (resolve /*, reject*/) {

      // For some reason MDM calls mdm_set_current_user twice.
      // We hide the first event and let the second slip through.
      // We use the noecho call to resolve.
      once$1("userSelected", function () {
        once$1("passwordPrompt", function () {
          resolve(user);
          return true;
        });
      });

      alert("USER###" + user.name);
    });
  }

  /**
   * Set the session to log in into.
   * 
   * @param  {Session} session
   * @return {mdm}             chainable
   */
  function selectSession(session) {
    session = getSession(session);
    selectedSettings.session = session.id;
    trigger("sessionSelected", session);
    return Promise.resolve(session); // consistent API
  }

  /**
   * Set the language for this session
   * 
   * @param  {Language} language
   * @return {mdm}               chainable
   */
  function selectLanguage(language) {
    language = getLanguage(language);
    selectedSettings.language = language.id;
    trigger("languageSelected", language);
    return Promise.resolve(language); // consistent API
  }

  /// GETTERS ///

  /**
   * Find an existing User
   * 
   * @param  {mixed} user User object or username
   * @return {User}
   */
  function getUser(user) {
    user = user.id || user;
    return find(function (usr) {
      return usr.id === user;
    }, users);
  }

  /**
   * Find an existing Session
   * 
   * @param  {mixed}   session Session object or session_file name
   * @return {Session}
   */
  function getSession(session) {
    session = session.id || session;
    return find(function (sess) {
      return sess.id === session;
    }, sessions);
  }

  /**
   * Find an existing Language
   * 
   * @param  {mixed}    language Language object or code, e.g. "en_us.UTF-8"
   * @return {Language}
   */
  function getLanguage(language) {
    language = language.id || language;
    return find(function (lang) {
      return lang.id === language;
    }, languages);
  }

  /// BACKEND API ///

  /**
   * The MDM API.
   * These functions are called by MDM from the outside,
   * so they need to be declared in global scope.
   * They should ONLY be called by MDM itself.
   */

  // Called by MDM to add a user to the list of users
  window.mdm_add_user = function (username, gecos, status, facefile) {
    var user = new User(username, gecos, status, facefile);
    users.push(user);
    trigger$1("userAdded", user);
  };

  // Called by MDM to add a session to the list of sessions
  window.mdm_add_session = function (session_name, session_file) {
    var session = new Session(session_name, session_file);
    sessions.push(session);
    trigger$1("sessionAdded", session);
  };

  // Called by MDM to add a language to the list of languages
  window.mdm_add_language = function (language_name, language_code) {
    var language = new Language(language_name, language_code);
    languages.push(language);
    trigger$1("languageAdded", language);
  };

  // Called by MDM to inform about the currently selected user
  window.mdm_set_current_user = function (username) {

    // MDM clears the selected user after three failed login attempts
    // (or after one if the username was sent via LOGIN###).
    // We capture the call internally and re-select the user.
    if (!username && selectedSettings.user) {

      // capture the upcoming username prompt
      // note: be sure not to use the usernamePrompt event interally
      once$1("usernamePrompt", function () {
        return false;
      });
      once$1("prompt", function () {
        return false;
      });

      // send the username immediately, bypassing the queue
      alert("USER###" + selectedSettings.user);

      return;
    }

    var user = getUser(username) || new User(username);
    currentSettings.user = user.id;
    trigger$1("userSelected", user);
  };

  // Called by MDM to inform about the currently selected session
  window.mdm_set_current_session = function (session_name, session_file) {
    var session = getSession(session_file) || new Session(session_name, session_file);
    currentSettings.session = session.id;
    trigger$1("sessionSelected", session);
  };

  // Called by MDM to inform about the currently selected language
  window.mdm_set_current_language = function (language_name, language_code) {
    var language = getLanguage(language_code) || new Language(language_name, language_code);
    currentSettings.language = language.id;
    trigger$1("languageSelected", language);
  };

  // Called by MDM when expecting a username via alert("LOGIN###...")
  window.mdm_prompt = function (message) {
    passwordExpected = false;
    trigger$1("prompt", message);
    trigger$1("usernamePrompt", message);
  };

  // Called by MDM when expecting a password via alert("LOGIN###...")
  window.mdm_noecho = function (message) {
    passwordExpected = true;
    trigger$1("prompt", message);
    trigger$1("passwordPrompt", message);
  };

  // Called by MDM to disable user input
  window.mdm_enable = function () {
    trigger$1("enabled");
  };

  // Called by MDM to enable user input
  window.mdm_disable = function () {
    trigger$1("disabled");
  };

  // Called by MDM to show an error
  window.mdm_error = function (message) {
    if (message) trigger$1("error", message);
  };

  /**
   * Shutdown immediately
   */
  function shutdown() {
    // console.log("MDM: sending force-shutdown request");
    alert("FORCE-SHUTDOWN###");
    return this;
  }

  /**
   * Reboot immediately
   */
  function restart() {
    // console.log("MDM: sending force-restart request");
    alert("FORCE-RESTART###");
    return this;
  }

  /**
   * Suspend immediately
   */
  function suspend() {
    // console.log("MDM: sending force-suspend request");
    alert("FORCE-SUSPEND###");
    return this;
  }

  /**
   * quit MDM (restarts the greeter)
   */
  function quit() {
    // console.log("MDM: sending quit request");
    alert("QUIT###");
    return this;
  }

  /**
   * The MDM API.
   * These functions are called by MDM from the outside,
   * so they need to be declared in global scope.
   * They should ONLY be called by MDM itself.
   */

  // Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
  window.mdm_hide_shutdown = function () {
    trigger("shutdownHidden");
  };
  // Called by MDM if the RESTART command shouldn't appear in the greeter
  window.mdm_hide_restart = function () {
    trigger("restartHidden");
  };
  // Called by MDM if the SUSPEND command shouldn't appear in the greeter
  window.mdm_hide_suspend = function () {
    trigger("suspendHidden");
  };
  // Called by MDM if the QUIT command shouldn't appear in the greeter
  window.mdm_hide_quit = function () {
    trigger("quitHidden");
  };

  // Called by MDM if the XDMCP command shouldn't appear in the greeter
  // apparently not implemented by MDM (mdmwebkit.c @ 2014-07-30)
  window.mdm_hide_xdmcp = function () {
    trigger("xdmcpHidden");
  };

  /**
   * The MDM API.
   * These functions are called by MDM from the outside,
   * so they need to be declared in global scope.
   * They should ONLY be called by MDM itself.
   */

  // Called by MDM to show a message (usually "Please enter your username")
  window.mdm_msg = function (message) {
    if (message) trigger("message", message);
  };

  // Called by MDM to show a timed login countdown
  window.mdm_timed = function (message) {
    trigger("timedMessage", message);
    trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
  };

  // Called by MDM to set the welcome message
  window.set_welcome_message = function (message) {
    if (message) trigger("welcomeMessage", message);
  };

  // Called by MDM to update the clock
  window.set_clock = function (message) {
    trigger("clockUpdate", message);
  };

  once("prompt", function () {
    return trigger("ready");
  });

  exports.addEventListener = addEventListener;
  exports.on = addEventListener;
  exports.removeEventListener = removeEventListener;
  exports.off = removeEventListener;
  exports.once = once;
  exports.one = once;
  exports.login = login;
  exports.sendPassword = sendPassword;
  exports.selectUser = selectUser;
  exports.selectSession = selectSession;
  exports.selectLanguage = selectLanguage;
  exports.getUser = getUser;
  exports.getSession = getSession;
  exports.getLanguage = getLanguage;
  exports.shutdown = shutdown;
  exports.restart = restart;
  exports.suspend = suspend;
  exports.quit = quit;

}));
//# sourceMappingURL=MDM.js.map