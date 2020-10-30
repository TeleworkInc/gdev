import assert from 'assert';
import readline from 'readline';
const require$$1$1 = {};
import Stream from 'stream';
import require$$0$3 from 'util';
import tty from 'tty';
import os from 'os';
import fs, { existsSync, readFileSync, writeFileSync, truncateSync } from 'fs';
import sysPath, { basename } from 'path';
import require$$1, { spawnSync } from 'child_process';
import require$$0$2 from 'events';
/*
MIT
normalize-path <https://github.com/jonschlinkert/normalize-path>
Copyright (c) 2014-2018, Jon Schlinkert.
Released under the MIT License.
is-extglob <https://github.com/jonschlinkert/is-extglob>
Copyright (c) 2014-2016, Jon Schlinkert.
Licensed under the MIT License.
is-glob <https://github.com/jonschlinkert/is-glob>
Copyright (c) 2014-2017, Jon Schlinkert.
Released under the MIT License.
is-number <https://github.com/jonschlinkert/is-number>
Copyright (c) 2014-present, Jon Schlinkert.
Released under the MIT License.
MIT */

var aa = "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : {};

function t(a, b, c) {
  return c = {
    path: b,
    exports: {},
    require: function () {
      throw Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
    }
  }, a(c, c.exports), c.exports;
}

var D = t(function (a, b) {
  function c(a) {
    return a.split("-").reduce((a, b) => a + b[0].toUpperCase() + b.slice(1));
  }

  function d(a, b) {
    return a + Array(Math.max(0, b - a.length) + 1).join(" ");
  }

  function f(a, b, c) {
    return (a.match(new RegExp(".{1," + (b - 1) + "}([\\s\u200b]|$)|[^\\s\u200b]+?([\\s\u200b]|$)", "g")) || []).map((a, b) => {
      "\n" === a.slice(-1) && (a = a.slice(0, a.length - 1));
      return (0 < b && c ? Array(c + 1).join(" ") : "") + a.trimRight();
    }).join("\n");
  }

  function e(a, b, c) {
    return a.match(/[\n]\s+/) || 40 > b ? a : f(a, b, c);
  }

  function g(a, b) {
    b.find(b => b === a._helpLongFlag || b === a._helpShortFlag) && (a.outputHelp(), a._exit(0, "commander.helpDisplayed", "(outputHelp)"));
  }

  function h(a) {
    let b = a.name + (!0 === a.variadic ? "..." : "");
    return a.required ? "<" + b + ">" : "[" + b + "]";
  }

  function k(a) {
    let b;
    a = a.split(/[ |,]+/);
    1 < a.length && !/^[[<]/.test(a[1]) && (b = a.shift());
    a = a.shift();
    !b && /^-[^-]$/.test(a) && (b = a, a = void 0);
    return {
      shortFlag: b,
      longFlag: a
    };
  }

  function q(a) {
    return a.map(a => {
      if (!a.startsWith("--inspect")) return a;
      let b,
          c = "127.0.0.1",
          e = "9229",
          d;
      null !== (d = a.match(/^(--inspect(-brk)?)$/)) ? b = d[1] : null !== (d = a.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) ? (b = d[1], /^\d+$/.test(d[3]) ? e = d[3] : c = d[3]) : null !== (d = a.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) && (b = d[1], c = d[3], e = d[4]);
      return b && "0" !== e ? `${b}=${c}:${parseInt(e) + 1}` : a;
    });
  }

  b = require$$0$2.EventEmitter;
  let m = require$$1.spawn;

  class r {
    constructor(a, b) {
      this.flags = a;
      this.required = a.includes("<");
      this.optional = a.includes("[");
      this.variadic = /\w\.\.\.[>\]]$/.test(a);
      this.mandatory = !1;
      a = k(a);
      this.short = a.shortFlag;
      this.long = a.longFlag;
      this.negate = !1;
      this.long && (this.negate = this.long.startsWith("--no-"));
      this.description = b || "";
      this.defaultValue = void 0;
    }

    name() {
      return this.long ? this.long.replace(/^--/, "") : this.short.replace(/^-/, "");
    }

    attributeName() {
      return c(this.name().replace(/^no-/, ""));
    }

    is(a) {
      return this.short === a || this.long === a;
    }

  }

  class u extends Error {
    constructor(a, b, c) {
      super(c);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.code = b;
      this.exitCode = a;
      this.nestedError = void 0;
    }

  }

  class z extends b {
    constructor(a) {
      super();
      this.commands = [];
      this.options = [];
      this.parent = null;
      this._allowUnknownOption = !1;
      this._args = [];
      this._scriptPath = this.rawArgs = null;
      this._name = a || "";
      this._optionValues = {};
      this._storeOptionsAsProperties = !0;
      this._storeOptionsAsPropertiesCalled = !1;
      this._passCommandToAction = !0;
      this._actionResults = [];
      this._actionHandler = null;
      this._executableHandler = !1;
      this._exitCallback = this._defaultCommandName = this._executableFile = null;
      this._aliases = [];
      this._hidden = !1;
      this._helpFlags = "-h, --help";
      this._helpDescription = "display help for command";
      this._helpShortFlag = "-h";
      this._helpLongFlag = "--help";
      this._hasImplicitHelpCommand = void 0;
      this._helpCommandName = "help";
      this._helpCommandnameAndArgs = "help [command]";
      this._helpCommandDescription = "display help for command";
    }

    command(a, b, c) {
      "object" === typeof b && null !== b && (c = b, b = null);
      c = c || {};
      a = a.split(/ +/);
      let e = this.createCommand(a.shift());
      b && (e.description(b), e._executableHandler = !0);
      c.isDefault && (this._defaultCommandName = e._name);
      e._hidden = !(!c.noHelp && !c.hidden);
      e._helpFlags = this._helpFlags;
      e._helpDescription = this._helpDescription;
      e._helpShortFlag = this._helpShortFlag;
      e._helpLongFlag = this._helpLongFlag;
      e._helpCommandName = this._helpCommandName;
      e._helpCommandnameAndArgs = this._helpCommandnameAndArgs;
      e._helpCommandDescription = this._helpCommandDescription;
      e._exitCallback = this._exitCallback;
      e._storeOptionsAsProperties = this._storeOptionsAsProperties;
      e._passCommandToAction = this._passCommandToAction;
      e._executableFile = c.executableFile || null;
      this.commands.push(e);

      e._parseExpectedArgs(a);

      e.parent = this;
      return b ? this : e;
    }

    createCommand(a) {
      return new z(a);
    }

    addCommand(a, b) {
      function c(a) {
        a.forEach(a => {
          if (a._executableHandler && !a._executableFile) throw Error(`Must specify executableFile for deeply nested executable: ${a.name()}`);
          c(a.commands);
        });
      }

      if (!a._name) throw Error("Command passed to .addCommand() must have a name");
      c(a.commands);
      b = b || {};
      b.isDefault && (this._defaultCommandName = a._name);
      if (b.noHelp || b.hidden) a._hidden = !0;
      this.commands.push(a);
      a.parent = this;
      return this;
    }

    arguments(a) {
      return this._parseExpectedArgs(a.split(/ +/));
    }

    addHelpCommand(a, b) {
      !1 === a ? this._hasImplicitHelpCommand = !1 : (this._hasImplicitHelpCommand = !0, "string" === typeof a && (this._helpCommandName = a.split(" ")[0], this._helpCommandnameAndArgs = a), this._helpCommandDescription = b || this._helpCommandDescription);
      return this;
    }

    _lazyHasImplicitHelpCommand() {
      void 0 === this._hasImplicitHelpCommand && (this._hasImplicitHelpCommand = this.commands.length && !this._actionHandler && !this._findCommand("help"));
      return this._hasImplicitHelpCommand;
    }

    _parseExpectedArgs(a) {
      if (a.length) return a.forEach(a => {
        let b = {
          required: !1,
          name: "",
          variadic: !1
        };

        switch (a[0]) {
          case "<":
            b.required = !0;
            b.name = a.slice(1, -1);
            break;

          case "[":
            b.name = a.slice(1, -1);
        }

        3 < b.name.length && "..." === b.name.slice(-3) && (b.variadic = !0, b.name = b.name.slice(0, -3));
        b.name && this._args.push(b);
      }), this._args.forEach((a, b) => {
        if (a.variadic && b < this._args.length - 1) throw Error(`only the last argument can be variadic '${a.name}'`);
      }), this;
    }

    exitOverride(a) {
      this._exitCallback = a ? a : a => {
        if ("commander.executeSubCommandAsync" !== a.code) throw a;
      };
      return this;
    }

    _exit(a, b, c) {
      this._exitCallback && this._exitCallback(new u(a, b, c));
      process.exit(a);
    }

    action(a) {
      this._actionHandler = b => {
        var c = this._args.length;
        const e = b.slice(0, c);
        e[c] = this._passCommandToAction ? this : this.opts();
        b.length > c && e.push(b.slice(c));
        b = a.apply(this, e);

        for (c = this; c.parent;) c = c.parent;

        c._actionResults.push(b);
      };

      return this;
    }

    _checkForOptionNameClash(a) {
      if (this._storeOptionsAsProperties && !this._storeOptionsAsPropertiesCalled && "help" !== a.name() && void 0 !== this._getOptionValue(a.attributeName())) {
        var b = !0;
        a.negate ? (b = a.long.replace(/^--no-/, "--"), b = !this._findOption(b)) : a.long && (b = a.long.replace(/^--/, "--no-"), b = !this._findOption(b));
        if (b) throw Error(`option '${a.name()}' clashes with existing property '${a.attributeName()}' on Command
- call storeOptionsAsProperties(false) to store option values safely,
- or call storeOptionsAsProperties(true) to suppress this check,
- or change option name`);
      }
    }

    _optionEx(a, b, c, e, d) {
      let f = new r(b, c);
      b = f.name();
      let g = f.attributeName();
      f.mandatory = !!a.mandatory;

      this._checkForOptionNameClash(f);

      if ("function" !== typeof e) if (e instanceof RegExp) {
        let a = e;

        e = (b, c) => (b = a.exec(b)) ? b[0] : c;
      } else d = e, e = null;
      if (f.negate || f.optional || f.required || "boolean" === typeof d) f.negate && (a = f.long.replace(/^--no-/, "--"), d = this._findOption(a) ? this._getOptionValue(g) : !0), void 0 !== d && (this._setOptionValue(g, d), f.defaultValue = d);
      this.options.push(f);
      this.on("option:" + b, a => {
        let b = this._getOptionValue(g);

        null !== a && e ? a = e(a, void 0 === b ? d : b) : null !== a && f.variadic && (a = b !== d && Array.isArray(b) ? b.concat(a) : [a]);
        "boolean" === typeof b || "undefined" === typeof b ? null == a ? this._setOptionValue(g, f.negate ? !1 : d || !0) : this._setOptionValue(g, a) : null !== a && this._setOptionValue(g, f.negate ? !1 : a);
      });
      return this;
    }

    option(a, b, c, e) {
      return this._optionEx({}, a, b, c, e);
    }

    requiredOption(a, b, c, e) {
      return this._optionEx({
        mandatory: !0
      }, a, b, c, e);
    }

    allowUnknownOption(a) {
      this._allowUnknownOption = void 0 === a || a;
      return this;
    }

    storeOptionsAsProperties(a) {
      this._storeOptionsAsPropertiesCalled = !0;
      this._storeOptionsAsProperties = void 0 === a || a;
      if (this.options.length) throw Error("call .storeOptionsAsProperties() before adding options");
      return this;
    }

    passCommandToAction(a) {
      this._passCommandToAction = void 0 === a || a;
      return this;
    }

    _setOptionValue(a, b) {
      this._storeOptionsAsProperties ? this[a] = b : this._optionValues[a] = b;
    }

    _getOptionValue(a) {
      return this._storeOptionsAsProperties ? this[a] : this._optionValues[a];
    }

    parse(a, b) {
      if (void 0 !== a && !Array.isArray(a)) throw Error("first parameter to parse must be array or undefined");
      b = b || {};
      void 0 === a && (a = process.argv, process.versions && process.versions.electron && (b.from = "electron"));
      this.rawArgs = a.slice();

      switch (b.from) {
        case void 0:
        case "node":
          this._scriptPath = a[1];
          a = a.slice(2);
          break;

        case "electron":
          process.defaultApp ? (this._scriptPath = a[1], a = a.slice(2)) : a = a.slice(1);
          break;

        case "user":
          a = a.slice(0);
          break;

        default:
          throw Error(`unexpected parse option { from: '${b.from}' }`);
      }

      !this._scriptPath && process.mainModule && (this._scriptPath = process.mainModule.filename);
      this._name = this._name || this._scriptPath && sysPath.basename(this._scriptPath, sysPath.extname(this._scriptPath));

      this._parseCommand([], a);

      return this;
    }

    parseAsync(a, b) {
      this.parse(a, b);
      return Promise.all(this._actionResults).then(() => this);
    }

    _executeSubCommand(a, b) {
      b = b.slice();
      var c = !1;
      c = [".js", ".ts", ".mjs"];

      this._checkForMissingMandatoryOptions();

      let e = this._scriptPath,
          d;

      try {
        let a = fs.realpathSync(e);
        d = sysPath.dirname(a);
      } catch (v) {
        d = ".";
      }

      let f = sysPath.basename(e, sysPath.extname(e)) + "-" + a._name;

      a._executableFile && (f = a._executableFile);
      let g = sysPath.join(d, f);
      fs.existsSync(g) ? f = g : c.forEach(a => {
        fs.existsSync(`${g}${a}`) && (f = `${g}${a}`);
      });
      c = c.includes(sysPath.extname(f));
      let h;
      "win32" !== process.platform ? c ? (b.unshift(f), b = q(process.execArgv).concat(b), h = m(process.argv[0], b, {
        stdio: "inherit"
      })) : h = m(f, b, {
        stdio: "inherit"
      }) : (b.unshift(f), b = q(process.execArgv).concat(b), h = m(process.execPath, b, {
        stdio: "inherit"
      }));
      ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach(a => {
        process.on(a, () => {
          !1 === h.killed && null === h.exitCode && h.kill(a);
        });
      });
      let k = this._exitCallback;
      if (k) h.on("close", () => {
        k(new u(process.exitCode || 0, "commander.executeSubCommandAsync", "(close)"));
      });else h.on("close", process.exit.bind(process));
      h.on("error", b => {
        if ("ENOENT" === b.code) throw Error(`'${f}' does not exist
 - if '${a._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name`);
        if ("EACCES" === b.code) throw Error(`'${f}' not executable`);

        if (k) {
          let a = new u(1, "commander.executeSubCommandAsync", "(error)");
          a.nestedError = b;
          k(a);
        } else process.exit(1);
      });
      this.runningCommand = h;
    }

    _dispatchSubcommand(a, b, c) {
      (a = this._findCommand(a)) || this._helpAndError();
      a._executableHandler ? this._executeSubCommand(a, b.concat(c)) : a._parseCommand(b, c);
    }

    _parseCommand(a, b) {
      let c = this.parseOptions(b);
      a = a.concat(c.operands);
      b = c.unknown;
      this.args = a.concat(b);
      if (a && this._findCommand(a[0])) this._dispatchSubcommand(a[0], a.slice(1), b);else if (this._lazyHasImplicitHelpCommand() && a[0] === this._helpCommandName) 1 === a.length ? this.help() : this._dispatchSubcommand(a[1], [], [this._helpLongFlag]);else if (this._defaultCommandName) g(this, b), this._dispatchSubcommand(this._defaultCommandName, a, b);else if (!this.commands.length || 0 !== this.args.length || this._actionHandler || this._defaultCommandName || this._helpAndError(), g(this, c.unknown), this._checkForMissingMandatoryOptions(), 0 < c.unknown.length && this.unknownOption(c.unknown[0]), this._actionHandler) {
        let c = this.args.slice();

        this._args.forEach((a, b) => {
          a.required && null == c[b] ? this.missingArgument(a.name) : a.variadic && (c[b] = c.splice(b));
        });

        this._actionHandler(c);

        this.emit("command:" + this.name(), a, b);
      } else a.length ? this._findCommand("*") ? this._dispatchSubcommand("*", a, b) : this.listenerCount("command:*") ? this.emit("command:*", a, b) : this.commands.length && this.unknownCommand() : this.commands.length && this._helpAndError();
    }

    _findCommand(a) {
      if (a) return this.commands.find(b => b._name === a || b._aliases.includes(a));
    }

    _findOption(a) {
      return this.options.find(b => b.is(a));
    }

    _checkForMissingMandatoryOptions() {
      for (let a = this; a; a = a.parent) a.options.forEach(b => {
        b.mandatory && void 0 === a._getOptionValue(b.attributeName()) && a.missingMandatoryOptionValue(b);
      });
    }

    parseOptions(a) {
      function b(a) {
        return 1 < a.length && "-" === a[0];
      }

      let c = [],
          e = [],
          d = c;
      a = a.slice();

      for (var f = null; a.length;) {
        let c = a.shift();

        if ("--" === c) {
          d === e && d.push(c);
          d.push(...a);
          break;
        }

        if (f && !b(c)) this.emit(`option:${f.name()}`, c);else {
          f = null;

          if (b(c)) {
            var g = this._findOption(c);

            if (g) {
              g.required ? (f = a.shift(), void 0 === f && this.optionMissingArgument(g), this.emit(`option:${g.name()}`, f)) : g.optional ? (f = null, 0 < a.length && !b(a[0]) && (f = a.shift()), this.emit(`option:${g.name()}`, f)) : this.emit(`option:${g.name()}`);
              f = g.variadic ? g : null;
              continue;
            }
          }

          if (2 < c.length && "-" === c[0] && "-" !== c[1] && (g = this._findOption(`-${c[1]}`))) {
            g.required || g.optional ? this.emit(`option:${g.name()}`, c.slice(2)) : (this.emit(`option:${g.name()}`), a.unshift(`-${c.slice(2)}`));
            continue;
          }

          if (/^--[^=]+=/.test(c)) {
            g = c.indexOf("=");

            let a = this._findOption(c.slice(0, g));

            if (a && (a.required || a.optional)) {
              this.emit(`option:${a.name()}`, c.slice(g + 1));
              continue;
            }
          }

          1 < c.length && "-" === c[0] && (d = e);
          d.push(c);
        }
      }

      return {
        operands: c,
        unknown: e
      };
    }

    opts() {
      if (this._storeOptionsAsProperties) {
        let a = {},
            b = this.options.length;

        for (let c = 0; c < b; c++) {
          let b = this.options[c].attributeName();
          a[b] = b === this._versionOptionName ? this._version : this[b];
        }

        return a;
      }

      return this._optionValues;
    }

    missingArgument(a) {
      a = `error: missing required argument '${a}'`;
      console.error(a);

      this._exit(1, "commander.missingArgument", a);
    }

    optionMissingArgument(a, b) {
      a = b ? `error: option '${a.flags}' argument missing, got '${b}'` : `error: option '${a.flags}' argument missing`;
      console.error(a);

      this._exit(1, "commander.optionMissingArgument", a);
    }

    missingMandatoryOptionValue(a) {
      a = `error: required option '${a.flags}' not specified`;
      console.error(a);

      this._exit(1, "commander.missingMandatoryOptionValue", a);
    }

    unknownOption(a) {
      this._allowUnknownOption || (a = `error: unknown option '${a}'`, console.error(a), this._exit(1, "commander.unknownOption", a));
    }

    unknownCommand() {
      var a = [this.name()];

      for (let b = this.parent; b; b = b.parent) a.unshift(b.name());

      a = a.join(" ");
      a = `error: unknown command '${this.args[0]}'. See '${a} ${this._helpLongFlag}'.`;
      console.error(a);

      this._exit(1, "commander.unknownCommand", a);
    }

    version(a, b, c) {
      if (void 0 === a) return this._version;
      this._version = a;
      b = new r(b || "-V, --version", c || "output the version number");
      this._versionOptionName = b.attributeName();
      this.options.push(b);
      this.on("option:" + b.name(), () => {
        process.stdout.write(a + "\n");

        this._exit(0, "commander.version", a);
      });
      return this;
    }

    description(a, b) {
      if (void 0 === a && void 0 === b) return this._description;
      this._description = a;
      this._argsDescription = b;
      return this;
    }

    alias(a) {
      if (void 0 === a) return this._aliases[0];
      let b = this;
      0 !== this.commands.length && this.commands[this.commands.length - 1]._executableHandler && (b = this.commands[this.commands.length - 1]);
      if (a === b._name) throw Error("Command alias can't be the same as its name");

      b._aliases.push(a);

      return this;
    }

    aliases(a) {
      if (void 0 === a) return this._aliases;
      a.forEach(a => this.alias(a));
      return this;
    }

    usage(a) {
      if (void 0 === a) {
        if (this._usage) return this._usage;
        a = this._args.map(a => h(a));
        return "[options]" + (this.commands.length ? " [command]" : "") + (this._args.length ? " " + a.join(" ") : "");
      }

      this._usage = a;
      return this;
    }

    name(a) {
      if (void 0 === a) return this._name;
      this._name = a;
      return this;
    }

    prepareCommands() {
      let a = this.commands.filter(a => !a._hidden).map(a => {
        const b = a._args.map(a => h(a)).join(" ");

        return [a._name + (a._aliases[0] ? "|" + a._aliases[0] : "") + (a.options.length ? " [options]" : "") + (b ? " " + b : ""), a._description];
      });
      this._lazyHasImplicitHelpCommand() && a.push([this._helpCommandnameAndArgs, this._helpCommandDescription]);
      return a;
    }

    largestCommandLength() {
      return this.prepareCommands().reduce((a, b) => Math.max(a, b[0].length), 0);
    }

    largestOptionLength() {
      let a = [].slice.call(this.options);
      a.push({
        flags: this._helpFlags
      });
      return a.reduce((a, b) => Math.max(a, b.flags.length), 0);
    }

    largestArgLength() {
      return this._args.reduce((a, b) => Math.max(a, b.name.length), 0);
    }

    padWidth() {
      let a = this.largestOptionLength();
      this._argsDescription && this._args.length && this.largestArgLength() > a && (a = this.largestArgLength());
      this.commands && this.commands.length && this.largestCommandLength() > a && (a = this.largestCommandLength());
      return a;
    }

    optionHelp() {
      function a(a, f) {
        return d(a, b) + "  " + e(f, c, b + 2);
      }

      let b = this.padWidth(),
          c = (process.stdout.columns || 80) - b - 4,
          f = this.options.map(b => {
        const c = b.description + (b.negate || void 0 === b.defaultValue ? "" : " (default: " + JSON.stringify(b.defaultValue) + ")");
        return a(b.flags, c);
      }),
          g = this._helpShortFlag && !this._findOption(this._helpShortFlag),
          h = !this._findOption(this._helpLongFlag);

      if (g || h) {
        let b = this._helpFlags;
        g ? h || (b = this._helpShortFlag) : b = this._helpLongFlag;
        f.push(a(b, this._helpDescription));
      }

      return f.join("\n");
    }

    commandHelp() {
      if (!this.commands.length && !this._lazyHasImplicitHelpCommand()) return "";
      let a = this.prepareCommands(),
          b = this.padWidth(),
          c = (process.stdout.columns || 80) - b - 4;
      return ["Commands:", a.map(a => {
        let f = a[1] ? "  " + a[1] : "";
        return (f ? d(a[0], b) : a[0]) + e(f, c, b + 2);
      }).join("\n").replace(/^/gm, "  "), ""].join("\n");
    }

    helpInformation() {
      let a = [];

      if (this._description) {
        a = [this._description, ""];
        let b = this._argsDescription;

        if (b && this._args.length) {
          let c = this.padWidth(),
              e = (process.stdout.columns || 80) - c - 5;
          a.push("Arguments:");
          a.push("");

          this._args.forEach(g => {
            a.push("  " + d(g.name, c) + "  " + f(b[g.name], e, c + 4));
          });

          a.push("");
        }
      }

      var b = this._name;
      this._aliases[0] && (b = b + "|" + this._aliases[0]);
      var c = "";

      for (var e = this.parent; e; e = e.parent) c = e.name() + " " + c;

      b = ["Usage: " + c + b + " " + this.usage(), ""];
      c = [];
      (e = this.commandHelp()) && (c = [e]);
      e = ["Options:", "" + this.optionHelp().replace(/^/gm, "  "), ""];
      return b.concat(a).concat(e).concat(c).join("\n");
    }

    outputHelp(a) {
      a || (a = a => a);
      a = a(this.helpInformation());
      if ("string" !== typeof a && !Buffer.isBuffer(a)) throw Error("outputHelp callback must return a string or a Buffer");
      process.stdout.write(a);
      this.emit(this._helpLongFlag);
    }

    helpOption(a, b) {
      this._helpFlags = a || this._helpFlags;
      this._helpDescription = b || this._helpDescription;
      a = k(this._helpFlags);
      this._helpShortFlag = a.shortFlag;
      this._helpLongFlag = a.longFlag;
      return this;
    }

    help(a) {
      this.outputHelp(a);

      this._exit(process.exitCode || 0, "commander.help", "(outputHelp)");
    }

    _helpAndError() {
      this.outputHelp();

      this._exit(1, "commander.help", "(outputHelp)");
    }

  }

  b = a.exports = new z();
  b.program = b;
  b.Command = z;
  b.Option = r;
  b.CommanderError = u;
});
let ca = {
  allFiles: !1,
  dirsFirst: !1,
  dirsOnly: !1,
  exclude: [],
  maxDepth: Number.POSITIVE_INFINITY,
  reverse: !1,
  trailingSlash: !1
},
    ha = {
  BRANCH: "\u251c\u2500\u2500 ",
  EMPTY: "",
  INDENT: "    ",
  LAST_BRANCH: "\u2514\u2500\u2500 ",
  VERTICAL: "\u2502   "
},
    ka = [/\.DS_Store/];

function la(a, b, c, d, f, e) {
  var g = fs.lstatSync(b).isDirectory();
  let h = !g,
      k = [];

  for (var q = 0; q < ka.length; q++) if (ka[q].test(b)) return k;

  if (h && f.dirsOnly) return k;

  for (q = 0; q < f.exclude.length; q++) if (f.exclude[q].test(b)) return k;

  if (c > f.maxDepth) return k;
  q = [d];
  1 <= c && q.push(e ? ha.LAST_BRANCH : ha.BRANCH);
  q.push(a);
  g && f.trailingSlash && q.push("/");
  k.push(q.join(""));
  if (h) return k;
  let m = fs.readdirSync(b);
  f.reverse && m.reverse();
  f.allFiles || (m = m.filter(a => "." !== a[0]));
  f.dirsOnly && (m = m.filter(a => fs.lstatSync(sysPath.join(b, a)).isDirectory()));
  f.dirsFirst && (a = m.filter(a => fs.lstatSync(sysPath.join(b, a)).isDirectory()), g = m.filter(a => !fs.lstatSync(sysPath.join(b, a)).isDirectory()), m = [].concat(a, g));
  m.forEach((a, g) => {
    g = g === m.length - 1;
    a = la(a, sysPath.join(b, a), c + 1, d + (1 <= c ? e ? ha.INDENT : ha.VERTICAL : ha.EMPTY), f, g);
    k.push.apply(k, a);
  });
  return k;
}

function ma(a, b) {
  b = Object.assign({}, ca, b);
  return la(sysPath.basename(sysPath.join(process.cwd(), a)), a, 0, "", b).join("\n");
}

var na = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
let oa = {};

for (let a of Object.keys(na)) oa[na[a]] = a;

let E = {
  rgb: {
    channels: 3,
    labels: "rgb"
  },
  hsl: {
    channels: 3,
    labels: "hsl"
  },
  hsv: {
    channels: 3,
    labels: "hsv"
  },
  hwb: {
    channels: 3,
    labels: "hwb"
  },
  cmyk: {
    channels: 4,
    labels: "cmyk"
  },
  xyz: {
    channels: 3,
    labels: "xyz"
  },
  lab: {
    channels: 3,
    labels: "lab"
  },
  lch: {
    channels: 3,
    labels: "lch"
  },
  hex: {
    channels: 1,
    labels: ["hex"]
  },
  keyword: {
    channels: 1,
    labels: ["keyword"]
  },
  ansi16: {
    channels: 1,
    labels: ["ansi16"]
  },
  ansi256: {
    channels: 1,
    labels: ["ansi256"]
  },
  hcg: {
    channels: 3,
    labels: ["h", "c", "g"]
  },
  apple: {
    channels: 3,
    labels: ["r16", "g16", "b16"]
  },
  gray: {
    channels: 1,
    labels: ["gray"]
  }
};

for (let a of Object.keys(E)) {
  if (!("channels" in E[a])) throw Error("missing channels property: " + a);
  if (!("labels" in E[a])) throw Error("missing channel labels property: " + a);
  if (E[a].labels.length !== E[a].channels) throw Error("channel and label counts mismatch: " + a);
  let {
    channels: b,
    labels: c
  } = E[a];
  delete E[a].channels;
  delete E[a].labels;
  Object.defineProperty(E[a], "channels", {
    value: b
  });
  Object.defineProperty(E[a], "labels", {
    value: c
  });
}

E.rgb.hsl = function (a) {
  var b = a[0] / 255;
  let c = a[1] / 255,
      d = a[2] / 255;
  a = Math.min(b, c, d);
  let f = Math.max(b, c, d),
      e = f - a,
      g;
  f === a ? g = 0 : b === f ? g = (c - d) / e : c === f ? g = 2 + (d - b) / e : d === f && (g = 4 + (b - c) / e);
  g = Math.min(60 * g, 360);
  0 > g && (g += 360);
  b = (a + f) / 2;
  return [g, 100 * (f === a ? 0 : .5 >= b ? e / (f + a) : e / (2 - f - a)), 100 * b];
};

E.rgb.hsv = function (a) {
  let b;
  let c,
      d,
      f = a[0] / 255,
      e = a[1] / 255,
      g = a[2] / 255,
      h = Math.max(f, e, g);
  var k = h - Math.min(f, e, g);
  0 === k ? d = c = 0 : (d = k / h, a = (h - f) / 6 / k + .5, b = (h - e) / 6 / k + .5, k = (h - g) / 6 / k + .5, f === h ? c = k - b : e === h ? c = 1 / 3 + a - k : g === h && (c = 2 / 3 + b - a), 0 > c ? c += 1 : 1 < c && --c);
  return [360 * c, 100 * d, 100 * h];
};

E.rgb.hwb = function (a) {
  let b = a[0],
      c = a[1],
      d = a[2];
  a = E.rgb.hsl(a)[0];
  let f = 1 / 255 * Math.min(b, Math.min(c, d));
  d = 1 - 1 / 255 * Math.max(b, Math.max(c, d));
  return [a, 100 * f, 100 * d];
};

E.rgb.cmyk = function (a) {
  let b = a[0] / 255,
      c = a[1] / 255;
  a = a[2] / 255;
  let d = Math.min(1 - b, 1 - c, 1 - a);
  return [100 * ((1 - b - d) / (1 - d) || 0), 100 * ((1 - c - d) / (1 - d) || 0), 100 * ((1 - a - d) / (1 - d) || 0), 100 * d];
};

E.rgb.keyword = function (a) {
  var b = oa[a];
  if (b) return b;
  b = Infinity;
  let c;

  for (let f of Object.keys(na)) {
    var d = na[f];
    d = (a[0] - d[0]) ** 2 + (a[1] - d[1]) ** 2 + (a[2] - d[2]) ** 2;
    d < b && (b = d, c = f);
  }

  return c;
};

E.keyword.rgb = function (a) {
  return na[a];
};

E.rgb.xyz = function (a) {
  let b = a[0] / 255,
      c = a[1] / 255;
  a = a[2] / 255;
  b = .04045 < b ? ((b + .055) / 1.055) ** 2.4 : b / 12.92;
  c = .04045 < c ? ((c + .055) / 1.055) ** 2.4 : c / 12.92;
  a = .04045 < a ? ((a + .055) / 1.055) ** 2.4 : a / 12.92;
  return [100 * (.4124 * b + .3576 * c + .1805 * a), 100 * (.2126 * b + .7152 * c + .0722 * a), 100 * (.0193 * b + .1192 * c + .9505 * a)];
};

E.rgb.lab = function (a) {
  var b = E.rgb.xyz(a);
  a = b[0];
  let c = b[1];
  b = b[2];
  a /= 95.047;
  c /= 100;
  b /= 108.883;
  c = .008856 < c ? c ** (1 / 3) : 7.787 * c + 16 / 116;
  return [116 * c - 16, 500 * ((.008856 < a ? a ** (1 / 3) : 7.787 * a + 16 / 116) - c), 200 * (c - (.008856 < b ? b ** (1 / 3) : 7.787 * b + 16 / 116))];
};

E.hsl.rgb = function (a) {
  let b = a[0] / 360;
  var c = a[1] / 100;
  a = a[2] / 100;

  if (0 === c) {
    var d = 255 * a;
    return [d, d, d];
  }

  c = .5 > a ? a * (1 + c) : a + c - a * c;
  a = 2 * a - c;
  let f = [0, 0, 0];

  for (let e = 0; 3 > e; e++) d = b + 1 / 3 * -(e - 1), 0 > d && d++, 1 < d && d--, d = 1 > 6 * d ? a + 6 * (c - a) * d : 1 > 2 * d ? c : 2 > 3 * d ? a + (c - a) * (2 / 3 - d) * 6 : a, f[e] = 255 * d;

  return f;
};

E.hsl.hsv = function (a) {
  let b = a[0],
      c = a[1] / 100;
  a = a[2] / 100;
  let d = c,
      f = Math.max(a, .01);
  a *= 2;
  c *= 1 >= a ? a : 2 - a;
  d *= 1 >= f ? f : 2 - f;
  return [b, 100 * (0 === a ? 2 * d / (f + d) : 2 * c / (a + c)), (a + c) / 2 * 100];
};

E.hsv.rgb = function (a) {
  var b = a[0] / 60,
      c = a[1] / 100;
  a = a[2] / 100;
  let d = Math.floor(b) % 6,
      f = b - Math.floor(b);
  b = 255 * a * (1 - c);
  let e = 255 * a * (1 - c * f);
  c = 255 * a * (1 - c * (1 - f));
  a *= 255;

  switch (d) {
    case 0:
      return [a, c, b];

    case 1:
      return [e, a, b];

    case 2:
      return [b, a, c];

    case 3:
      return [b, e, a];

    case 4:
      return [c, b, a];

    case 5:
      return [a, b, e];
  }
};

E.hsv.hsl = function (a) {
  let b = a[0],
      c = a[1] / 100;
  a = a[2] / 100;
  var d = Math.max(a, .01);
  let f = (2 - c) * d;
  d = c * d / (1 >= f ? f : 2 - f) || 0;
  return [b, 100 * d, (2 - c) * a / 2 * 100];
};

E.hwb.rgb = function (a) {
  var b = a[0] / 360,
      c = a[1] / 100;
  a = a[2] / 100;
  var d = c + a;
  1 < d && (c /= d, a /= d);
  d = Math.floor(6 * b);
  a = 1 - a;
  b = 6 * b - d;
  0 !== (d & 1) && (b = 1 - b);
  b = c + b * (a - c);
  let f;

  switch (d) {
    default:
    case 6:
    case 0:
      d = a;
      f = b;
      break;

    case 1:
      d = b;
      f = a;
      break;

    case 2:
      d = c;
      f = a;
      c = b;
      break;

    case 3:
      d = c;
      f = b;
      c = a;
      break;

    case 4:
      d = b;
      f = c;
      c = a;
      break;

    case 5:
      d = a, f = c, c = b;
  }

  return [255 * d, 255 * f, 255 * c];
};

E.cmyk.rgb = function (a) {
  let b = a[3] / 100;
  return [255 * (1 - Math.min(1, a[0] / 100 * (1 - b) + b)), 255 * (1 - Math.min(1, a[1] / 100 * (1 - b) + b)), 255 * (1 - Math.min(1, a[2] / 100 * (1 - b) + b))];
};

E.xyz.rgb = function (a) {
  var b = a[0] / 100;
  let c = a[1] / 100,
      d = a[2] / 100,
      f;
  a = 3.2406 * b + -1.5372 * c + -.4986 * d;
  f = -.9689 * b + 1.8758 * c + .0415 * d;
  b = .0557 * b + -.204 * c + 1.057 * d;
  a = Math.min(Math.max(0, .0031308 < a ? 1.055 * a ** (1 / 2.4) - .055 : 12.92 * a), 1);
  f = Math.min(Math.max(0, .0031308 < f ? 1.055 * f ** (1 / 2.4) - .055 : 12.92 * f), 1);
  b = Math.min(Math.max(0, .0031308 < b ? 1.055 * b ** (1 / 2.4) - .055 : 12.92 * b), 1);
  return [255 * a, 255 * f, 255 * b];
};

E.xyz.lab = function (a) {
  let b = a[0],
      c = a[1];
  a = a[2];
  b /= 95.047;
  c /= 100;
  a /= 108.883;
  c = .008856 < c ? c ** (1 / 3) : 7.787 * c + 16 / 116;
  return [116 * c - 16, 500 * ((.008856 < b ? b ** (1 / 3) : 7.787 * b + 16 / 116) - c), 200 * (c - (.008856 < a ? a ** (1 / 3) : 7.787 * a + 16 / 116))];
};

E.lab.xyz = function (a) {
  var b = a[1],
      c = a[2];
  a = (a[0] + 16) / 116;
  b = b / 500 + a;
  c = a - c / 200;
  let d = a ** 3,
      f = b ** 3,
      e = c ** 3;
  return [95.047 * (.008856 < f ? f : (b - 16 / 116) / 7.787), 100 * (.008856 < d ? d : (a - 16 / 116) / 7.787), 108.883 * (.008856 < e ? e : (c - 16 / 116) / 7.787)];
};

E.lab.lch = function (a) {
  let b = a[0],
      c = a[1];
  a = a[2];
  let d;
  d = 360 * Math.atan2(a, c) / 2 / Math.PI;
  0 > d && (d += 360);
  return [b, Math.sqrt(c * c + a * a), d];
};

E.lch.lab = function (a) {
  let b = a[1],
      c = a[2] / 360 * 2 * Math.PI;
  return [a[0], b * Math.cos(c), b * Math.sin(c)];
};

E.rgb.ansi16 = function (a, b = null) {
  let [c, d, f] = a;
  a = null === b ? E.rgb.hsv(a)[2] : b;
  a = Math.round(a / 50);
  if (0 === a) return 30;
  b = 30 + (Math.round(f / 255) << 2 | Math.round(d / 255) << 1 | Math.round(c / 255));
  2 === a && (b += 60);
  return b;
};

E.hsv.ansi16 = function (a) {
  return E.rgb.ansi16(E.hsv.rgb(a), a[2]);
};

E.rgb.ansi256 = function (a) {
  let b = a[0],
      c = a[1];
  a = a[2];
  return b === c && c === a ? 8 > b ? 16 : 248 < b ? 231 : Math.round((b - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(b / 255 * 5) + 6 * Math.round(c / 255 * 5) + Math.round(a / 255 * 5);
};

E.ansi16.rgb = function (a) {
  let b = a % 10;
  if (0 === b || 7 === b) return 50 < a && (b += 3.5), b = b / 10.5 * 255, [b, b, b];
  a = .5 * (~~(50 < a) + 1);
  return [(b & 1) * a * 255, (b >> 1 & 1) * a * 255, (b >> 2 & 1) * a * 255];
};

E.ansi256.rgb = function (a) {
  if (232 <= a) {
    var b = 10 * (a - 232) + 8;
    return [b, b, b];
  }

  a -= 16;
  b = Math.floor(a / 36) / 5 * 255;
  let c = Math.floor((a %= 36) / 6) / 5 * 255;
  return [b, c, a % 6 / 5 * 255];
};

E.rgb.hex = function (a) {
  a = (((Math.round(a[0]) & 255) << 16) + ((Math.round(a[1]) & 255) << 8) + (Math.round(a[2]) & 255)).toString(16).toUpperCase();
  return "000000".substring(a.length) + a;
};

E.hex.rgb = function (a) {
  a = a.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!a) return [0, 0, 0];
  let b = a[0];
  3 === a[0].length && (b = b.split("").map(a => a + a).join(""));
  a = parseInt(b, 16);
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
};

E.rgb.hcg = function (a) {
  let b = a[0] / 255,
      c = a[1] / 255;
  a = a[2] / 255;
  let d = Math.max(Math.max(b, c), a),
      f = Math.min(Math.min(b, c), a),
      e = d - f;
  return [(0 >= e ? 0 : d === b ? (c - a) / e % 6 : d === c ? 2 + (a - b) / e : 4 + (b - c) / e) / 6 % 1 * 360, 100 * e, 100 * (1 > e ? f / (1 - e) : 0)];
};

E.hsl.hcg = function (a) {
  var b = a[1] / 100;
  let c = a[2] / 100;
  b = .5 > c ? 2 * b * c : 2 * b * (1 - c);
  let d = 0;
  1 > b && (d = (c - .5 * b) / (1 - b));
  return [a[0], 100 * b, 100 * d];
};

E.hsv.hcg = function (a) {
  let b = a[2] / 100,
      c = a[1] / 100 * b,
      d = 0;
  1 > c && (d = (b - c) / (1 - c));
  return [a[0], 100 * c, 100 * d];
};

E.hcg.rgb = function (a) {
  let b = a[1] / 100;
  var c = a[2] / 100;
  if (0 === b) return [255 * c, 255 * c, 255 * c];
  let d = [0, 0, 0];
  a = a[0] / 360 % 1 * 6;
  let f = a % 1,
      e = 1 - f;

  switch (Math.floor(a)) {
    case 0:
      d[0] = 1;
      d[1] = f;
      d[2] = 0;
      break;

    case 1:
      d[0] = e;
      d[1] = 1;
      d[2] = 0;
      break;

    case 2:
      d[0] = 0;
      d[1] = 1;
      d[2] = f;
      break;

    case 3:
      d[0] = 0;
      d[1] = e;
      d[2] = 1;
      break;

    case 4:
      d[0] = f;
      d[1] = 0;
      d[2] = 1;
      break;

    default:
      d[0] = 1, d[1] = 0, d[2] = e;
  }

  c *= 1 - b;
  return [255 * (b * d[0] + c), 255 * (b * d[1] + c), 255 * (b * d[2] + c)];
};

E.hcg.hsv = function (a) {
  let b = a[1] / 100,
      c = b + a[2] / 100 * (1 - b),
      d = 0;
  0 < c && (d = b / c);
  return [a[0], 100 * d, 100 * c];
};

E.hcg.hsl = function (a) {
  let b = a[1] / 100,
      c = a[2] / 100 * (1 - b) + .5 * b,
      d = 0;
  0 < c && .5 > c ? d = b / (2 * c) : .5 <= c && 1 > c && (d = b / (2 * (1 - c)));
  return [a[0], 100 * d, 100 * c];
};

E.hcg.hwb = function (a) {
  let b = a[1] / 100,
      c = b + a[2] / 100 * (1 - b);
  return [a[0], 100 * (c - b), 100 * (1 - c)];
};

E.hwb.hcg = function (a) {
  let b = 1 - a[2] / 100,
      c = b - a[1] / 100,
      d = 0;
  1 > c && (d = (b - c) / (1 - c));
  return [a[0], 100 * c, 100 * d];
};

E.apple.rgb = function (a) {
  return [a[0] / 65535 * 255, a[1] / 65535 * 255, a[2] / 65535 * 255];
};

E.rgb.apple = function (a) {
  return [a[0] / 255 * 65535, a[1] / 255 * 65535, a[2] / 255 * 65535];
};

E.gray.rgb = function (a) {
  return [a[0] / 100 * 255, a[0] / 100 * 255, a[0] / 100 * 255];
};

E.gray.hsl = function (a) {
  return [0, 0, a[0]];
};

E.gray.hsv = E.gray.hsl;

E.gray.hwb = function (a) {
  return [0, 100, a[0]];
};

E.gray.cmyk = function (a) {
  return [0, 0, 0, a[0]];
};

E.gray.lab = function (a) {
  return [a[0], 0, 0];
};

E.gray.hex = function (a) {
  a = Math.round(a[0] / 100 * 255) & 255;
  a = ((a << 16) + (a << 8) + a).toString(16).toUpperCase();
  return "000000".substring(a.length) + a;
};

E.rgb.gray = function (a) {
  return [(a[0] + a[1] + a[2]) / 3 / 255 * 100];
};

function pa(a, b) {
  return function (c) {
    return b(a(c));
  };
}

function qa(a) {
  var b = {};
  var c = Object.keys(E);

  for (let a = c.length, e = 0; e < a; e++) b[c[e]] = {
    distance: -1,
    parent: null
  };

  c = [a];

  for (b[a].distance = 0; c.length;) {
    a = c.pop();
    var d = Object.keys(E[a]);

    for (let g = d.length, k = 0; k < g; k++) {
      var f = d[k],
          e = b[f];
      -1 === e.distance && (e.distance = b[a].distance + 1, e.parent = a, c.unshift(f));
    }
  }

  c = {};
  a = Object.keys(b);

  for (let h = a.length, k = 0; k < h; k++) {
    var g = a[k];

    if (null !== b[g].parent) {
      d = g;
      {
        f = b;
        e = [f[g].parent, g];
        let a = E[f[g].parent][g];

        for (g = f[g].parent; f[g].parent;) e.unshift(f[g].parent), a = pa(E[f[g].parent][g], a), g = f[g].parent;

        a.conversion = e;
        f = a;
      }
      c[d] = f;
    }
  }

  return c;
}

let ra = {};

function ta(a) {
  function b(...b) {
    const c = b[0];
    if (void 0 === c || null === c) return c;
    1 < c.length && (b = c);
    return a(b);
  }

  "conversion" in a && (b.conversion = a.conversion);
  return b;
}

function ua(a) {
  function b(...b) {
    const c = b[0];
    if (void 0 === c || null === c) return c;
    1 < c.length && (b = c);
    b = a(b);
    if ("object" === typeof b) for (let a = b.length, c = 0; c < a; c++) b[c] = Math.round(b[c]);
    return b;
  }

  "conversion" in a && (b.conversion = a.conversion);
  return b;
}

Object.keys(E).forEach(a => {
  ra[a] = {};
  Object.defineProperty(ra[a], "channels", {
    value: E[a].channels
  });
  Object.defineProperty(ra[a], "labels", {
    value: E[a].labels
  });
  let b = qa(a);
  Object.keys(b).forEach(c => {
    let d = b[c];
    ra[a][c] = ua(d);
    ra[a][c].raw = ta(d);
  });
});

var va = t(function (a) {
  let b = (a, b) => (...c) => `\u001B[${a(...c) + b}m`,
      c = (a, b) => (...c) => {
    c = a(...c);
    return `\u001B[${38 + b};5;${c}m`;
  },
      d = (a, b) => (...c) => {
    c = a(...c);
    return `\u001B[${38 + b};2;${c[0]};${c[1]};${c[2]}m`;
  },
      f = a => a,
      e = (a, b, c) => [a, b, c],
      g = (a, b, c) => {
    Object.defineProperty(a, b, {
      get: () => {
        const e = c();
        Object.defineProperty(a, b, {
          value: e,
          enumerable: !0,
          configurable: !0
        });
        return e;
      },
      enumerable: !0,
      configurable: !0
    });
  },
      h,
      k = (a, b, c, e) => {
    void 0 === h && (h = ra);
    e = e ? 10 : 0;
    const d = {};

    for (const [f, g] of Object.entries(h)) {
      const h = "ansi16" === f ? "ansi" : f;
      f === b ? d[h] = a(c, e) : "object" === typeof g && (d[h] = a(g[b], e));
    }

    return d;
  };

  Object.defineProperty(a, "exports", {
    enumerable: !0,
    get: function () {
      let a = new Map(),
          h = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      h.color.gray = h.color.blackBright;
      h.bgColor.bgGray = h.bgColor.bgBlackBright;
      h.color.grey = h.color.blackBright;
      h.bgColor.bgGrey = h.bgColor.bgBlackBright;

      for (let [b, c] of Object.entries(h)) {
        for (let [b, e] of Object.entries(c)) h[b] = {
          open: `\u001B[${e[0]}m`,
          close: `\u001B[${e[1]}m`
        }, c[b] = h[b], a.set(e[0], e[1]);

        Object.defineProperty(h, b, {
          value: c,
          enumerable: !1
        });
      }

      Object.defineProperty(h, "codes", {
        value: a,
        enumerable: !1
      });
      h.color.close = "\u001b[39m";
      h.bgColor.close = "\u001b[49m";
      g(h.color, "ansi", () => k(b, "ansi16", f, !1));
      g(h.color, "ansi256", () => k(c, "ansi256", f, !1));
      g(h.color, "ansi16m", () => k(d, "rgb", e, !1));
      g(h.bgColor, "ansi", () => k(b, "ansi16", f, !0));
      g(h.bgColor, "ansi256", () => k(c, "ansi256", f, !0));
      g(h.bgColor, "ansi16m", () => k(d, "rgb", e, !0));
      return h;
    }
  });
}),
    F = (a, b = process.argv) => {
  let c = a.startsWith("-") ? "" : 1 === a.length ? "-" : "--";
  a = b.indexOf(c + a);
  b = b.indexOf("--");
  return -1 !== a && (-1 === b || a < b);
};

let {
  env: G
} = process,
    wa;
if (F("no-color") || F("no-colors") || F("color=false") || F("color=never")) wa = 0;else if (F("color") || F("colors") || F("color=true") || F("color=always")) wa = 1;
"FORCE_COLOR" in G && (wa = "true" === G.FORCE_COLOR ? 1 : "false" === G.FORCE_COLOR ? 0 : 0 === G.FORCE_COLOR.length ? 1 : Math.min(parseInt(G.FORCE_COLOR, 10), 3));

function xa(a) {
  return 0 === a ? !1 : {
    level: a,
    hasBasic: !0,
    has256: 2 <= a,
    has16m: 3 <= a
  };
}

function ya(a, b) {
  if (0 === wa) return 0;
  if (F("color=16m") || F("color=full") || F("color=truecolor")) return 3;
  if (F("color=256")) return 2;
  if (a && !b && void 0 === wa) return 0;
  a = wa || 0;
  if ("dumb" === G.TERM) return a;
  if ("win32" === process.platform) return a = os.release().split("."), 10 <= Number(a[0]) && 10586 <= Number(a[2]) ? 14931 <= Number(a[2]) ? 3 : 2 : 1;
  if ("CI" in G) return "TRAVIS CIRCLECI APPVEYOR GITLAB_CI GITHUB_ACTIONS BUILDKITE".split(" ").some(a => a in G) || "codeship" === G.CI_NAME ? 1 : a;
  if ("TEAMCITY_VERSION" in G) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(G.TEAMCITY_VERSION) ? 1 : 0;
  if ("truecolor" === G.COLORTERM) return 3;
  if ("TERM_PROGRAM" in G) switch (b = parseInt((G.TERM_PROGRAM_VERSION || "").split(".")[0], 10), G.TERM_PROGRAM) {
    case "iTerm.app":
      return 3 <= b ? 3 : 2;

    case "Apple_Terminal":
      return 2;
  }
  return /-256(color)?$/i.test(G.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(G.TERM) || "COLORTERM" in G ? 1 : a;
}

var za = {
  supportsColor: function (a) {
    a = ya(a, a && a.isTTY);
    return xa(a);
  },
  stdout: xa(ya(!0, tty.isatty(1))),
  stderr: xa(ya(!0, tty.isatty(2)))
};
let Aa = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    Ba = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    Ca = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    Da = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
    Ea = new Map([["n", "\n"], ["r", "\r"], ["t", "\t"], ["b", "\b"], ["f", "\f"], ["v", "\v"], ["0", "\x00"], ["\\", "\\"], ["e", "\u001b"], ["a", "\u0007"]]);

function unescape(a) {
  let b = "u" === a[0],
      c = "{" === a[1];
  return b && !c && 5 === a.length || "x" === a[0] && 3 === a.length ? String.fromCharCode(parseInt(a.slice(1), 16)) : b && c ? String.fromCodePoint(parseInt(a.slice(2, -1), 16)) : Ea.get(a) || a;
}

function Fa(a, b) {
  let c = [];
  b = b.trim().split(/\s*,\s*/g);

  for (let d of b) if (b = Number(d), Number.isNaN(b)) {
    if (b = d.match(Ca)) c.push(b[2].replace(Da, (a, b, c) => b ? unescape(b) : c));else throw Error(`Invalid Chalk template style argument: ${d} (in style '${a}')`);
  } else c.push(b);

  return c;
}

function Ga(a) {
  Ba.lastIndex = 0;
  let b = [];

  for (var c; null !== (c = Ba.exec(a));) {
    let a = c[1];
    c[2] ? (c = Fa(a, c[2]), b.push([a].concat(c))) : b.push([a]);
  }

  return b;
}

function Ha(a, b) {
  let c = {};

  for (let a of b) for (let b of a.styles) c[b[0]] = a.inverse ? null : b.slice(1);

  for (let [b, f] of Object.entries(c)) if (Array.isArray(f)) {
    if (!(b in a)) throw Error(`Unknown Chalk style: ${b}`);
    a = 0 < f.length ? a[b](...f) : a[b];
  }

  return a;
}

var Ia = (a, b) => {
  let c = [],
      d = [],
      f = [];
  b.replace(Aa, (b, g, h, k, q, m) => {
    if (g) f.push(unescape(g));else if (k) b = f.join(""), f = [], d.push(0 === c.length ? b : Ha(a, c)(b)), c.push({
      inverse: h,
      styles: Ga(k)
    });else if (q) {
      if (0 === c.length) throw Error("Found extraneous } in Chalk template literal");
      d.push(Ha(a, c)(f.join("")));
      f = [];
      c.pop();
    } else f.push(m);
  });
  d.push(f.join(""));
  if (0 < c.length) throw Error(`Chalk template literal is missing ${c.length} closing bracket${1 === c.length ? "" : "s"} (\`}\`)`);
  return d.join("");
};

let {
  stdout: Ja,
  stderr: Ka
} = za,
    {
  stringReplaceAll: La,
  stringEncaseCRLFWithFirstIndex: Ma
} = {
  stringReplaceAll: (a, b, c) => {
    let d = a.indexOf(b);
    if (-1 === d) return a;
    const f = b.length;
    let e = 0,
        g = "";

    do g += a.substr(e, d - e) + b + c, e = d + f, d = a.indexOf(b, e); while (-1 !== d);

    return g += a.substr(e);
  },
  stringEncaseCRLFWithFirstIndex: (a, b, c, d) => {
    let f = 0,
        e = "";

    do {
      const g = "\r" === a[d - 1];
      e += a.substr(f, (g ? d - 1 : d) - f) + b + (g ? "\r\n" : "\n") + c;
      f = d + 1;
      d = a.indexOf("\n", f);
    } while (-1 !== d);

    return e += a.substr(f);
  }
},
    {
  isArray: Na
} = Array,
    Oa = ["ansi", "ansi", "ansi256", "ansi16m"],
    Pa = Object.create(null),
    Qa = (a, b = {}) => {
  if (b.level && !(Number.isInteger(b.level) && 0 <= b.level && 3 >= b.level)) throw Error("The `level` option should be an integer from 0 to 3");
  const c = Ja ? Ja.level : 0;
  a.level = void 0 === b.level ? c : b.level;
};

class Ra {
  constructor(a) {
    return Sa(a);
  }

}

let Sa = a => {
  const b = {};
  Qa(b, a);

  b.template = (...a) => Ta(b.template, ...a);

  Object.setPrototypeOf(b, Ua.prototype);
  Object.setPrototypeOf(b.template, b);

  b.template.constructor = () => {
    throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
  };

  b.template.Instance = Ra;
  return b.template;
};

function Ua(a) {
  return Sa(a);
}

for (let [a, b] of Object.entries(va)) Pa[a] = {
  get() {
    let c = Va(this, Wa(b.open, b.close, this._styler), this._isEmpty);
    Object.defineProperty(this, a, {
      value: c
    });
    return c;
  }

};

Pa.visible = {
  get() {
    let a = Va(this, this._styler, !0);
    Object.defineProperty(this, "visible", {
      value: a
    });
    return a;
  }

};
let $a = "rgb hex keyword hsl hsv hwb ansi ansi256".split(" ");

for (let a of $a) Pa[a] = {
  get() {
    let {
      level: b
    } = this;
    return function (...c) {
      c = Wa(va.color[Oa[b]][a](...c), va.color.close, this._styler);
      return Va(this, c, this._isEmpty);
    };
  }

};

for (let a of $a) {
  let b = "bg" + a[0].toUpperCase() + a.slice(1);
  Pa[b] = {
    get() {
      let {
        level: c
      } = this;
      return function (...b) {
        b = Wa(va.bgColor[Oa[c]][a](...b), va.bgColor.close, this._styler);
        return Va(this, b, this._isEmpty);
      };
    }

  };
}

let ab = Object.defineProperties(() => {}, { ...Pa,
  level: {
    enumerable: !0,

    get() {
      return this._generator.level;
    },

    set(a) {
      this._generator.level = a;
    }

  }
}),
    Wa = (a, b, c) => {
  let d, f;
  void 0 === c ? (d = a, f = b) : (d = c.openAll + a, f = b + c.closeAll);
  return {
    open: a,
    close: b,
    openAll: d,
    closeAll: f,
    parent: c
  };
},
    Va = (a, b, c) => {
  const d = (...a) => Na(a[0]) && Na(a[0].raw) ? bb(d, Ta(d, ...a)) : bb(d, 1 === a.length ? "" + a[0] : a.join(" "));

  Object.setPrototypeOf(d, ab);
  d._generator = a;
  d._styler = b;
  d._isEmpty = c;
  return d;
},
    bb = (a, b) => {
  if (0 >= a.level || !b) return a._isEmpty ? "" : b;
  a = a._styler;
  if (void 0 === a) return b;
  const {
    openAll: c,
    closeAll: d
  } = a;
  if (-1 !== b.indexOf("\u001b")) for (; void 0 !== a;) b = La(b, a.close, a.open), a = a.parent;
  a = b.indexOf("\n");
  -1 !== a && (b = Ma(b, d, c, a));
  return c + b + d;
},
    cb,
    Ta = (a, ...b) => {
  const [c] = b;
  if (!Na(c) || !Na(c.raw)) return b.join(" ");
  b = b.slice(1);
  const d = [c.raw[0]];

  for (let a = 1; a < c.length; a++) d.push(String(b[a - 1]).replace(/[{}\\]/g, "\\$&"), String(c.raw[a]));

  void 0 === cb && (cb = Ia);
  return cb(a, d.join(""));
};

Object.defineProperties(Ua.prototype, Pa);
let I = Sa(void 0);
I.supportsColor = Ja;
I.stderr = Sa({
  level: Ka ? Ka.level : 0
});
I.stderr.supportsColor = Ka;
let db = {
  DOT_LITERAL: "\\.",
  PLUS_LITERAL: "\\+",
  QMARK_LITERAL: "\\?",
  SLASH_LITERAL: "\\/",
  ONE_CHAR: "(?=.)",
  QMARK: "[^/]",
  END_ANCHOR: "(?:\\/|$)",
  DOTS_SLASH: "\\.{1,2}(?:\\/|$)",
  NO_DOT: "(?!\\.)",
  NO_DOTS: "(?!(?:^|\\/)\\.{1,2}(?:\\/|$))",
  NO_DOT_SLASH: "(?!\\.{0,1}(?:\\/|$))",
  NO_DOTS_SLASH: "(?!\\.{1,2}(?:\\/|$))",
  QMARK_NO_DOT: "[^.\\/]",
  STAR: "[^/]*?",
  START_ANCHOR: "(?:^|\\/)"
},
    eb = { ...db,
  SLASH_LITERAL: "[\\\\/]",
  QMARK: "[^\\\\/]",
  STAR: "[^\\\\/]*?",
  DOTS_SLASH: "\\.{1,2}(?:[\\\\/]|$)",
  NO_DOT: "(?!\\.)",
  NO_DOTS: "(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))",
  NO_DOT_SLASH: "(?!\\.{0,1}(?:[\\\\/]|$))",
  NO_DOTS_SLASH: "(?!\\.{1,2}(?:[\\\\/]|$))",
  QMARK_NO_DOT: "[^.\\\\/]",
  START_ANCHOR: "(?:^|[\\\\/])",
  END_ANCHOR: "(?:[\\\\/]|$)"
};
var fb = {
  MAX_LENGTH: 65536,
  POSIX_REGEX_SOURCE: {
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  },
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
  REPLACEMENTS: {
    "***": "*",
    "**/**": "**",
    "**/**/**": "**"
  },
  CHAR_0: 48,
  CHAR_9: 57,
  CHAR_UPPERCASE_A: 65,
  CHAR_LOWERCASE_A: 97,
  CHAR_UPPERCASE_Z: 90,
  CHAR_LOWERCASE_Z: 122,
  CHAR_LEFT_PARENTHESES: 40,
  CHAR_RIGHT_PARENTHESES: 41,
  CHAR_ASTERISK: 42,
  CHAR_AMPERSAND: 38,
  CHAR_AT: 64,
  CHAR_BACKWARD_SLASH: 92,
  CHAR_CARRIAGE_RETURN: 13,
  CHAR_CIRCUMFLEX_ACCENT: 94,
  CHAR_COLON: 58,
  CHAR_COMMA: 44,
  CHAR_DOT: 46,
  CHAR_DOUBLE_QUOTE: 34,
  CHAR_EQUAL: 61,
  CHAR_EXCLAMATION_MARK: 33,
  CHAR_FORM_FEED: 12,
  CHAR_FORWARD_SLASH: 47,
  CHAR_GRAVE_ACCENT: 96,
  CHAR_HASH: 35,
  CHAR_HYPHEN_MINUS: 45,
  CHAR_LEFT_ANGLE_BRACKET: 60,
  CHAR_LEFT_CURLY_BRACE: 123,
  CHAR_LEFT_SQUARE_BRACKET: 91,
  CHAR_LINE_FEED: 10,
  CHAR_NO_BREAK_SPACE: 160,
  CHAR_PERCENT: 37,
  CHAR_PLUS: 43,
  CHAR_QUESTION_MARK: 63,
  CHAR_RIGHT_ANGLE_BRACKET: 62,
  CHAR_RIGHT_CURLY_BRACE: 125,
  CHAR_RIGHT_SQUARE_BRACKET: 93,
  CHAR_SEMICOLON: 59,
  CHAR_SINGLE_QUOTE: 39,
  CHAR_SPACE: 32,
  CHAR_TAB: 9,
  CHAR_UNDERSCORE: 95,
  CHAR_VERTICAL_LINE: 124,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
  SEP: sysPath.sep,

  extglobChars(a) {
    return {
      "!": {
        type: "negate",
        open: "(?:(?!(?:",
        close: `))${a.STAR})`
      },
      "?": {
        type: "qmark",
        open: "(?:",
        close: ")?"
      },
      "+": {
        type: "plus",
        open: "(?:",
        close: ")+"
      },
      "*": {
        type: "star",
        open: "(?:",
        close: ")*"
      },
      "@": {
        type: "at",
        open: "(?:",
        close: ")"
      }
    };
  },

  globChars(a) {
    return !0 === a ? eb : db;
  }

},
    J = t(function (a, b) {
  let c = "win32" === process.platform,
      {
    REGEX_BACKSLASH: d,
    REGEX_REMOVE_BACKSLASH: f,
    REGEX_SPECIAL_CHARS: e,
    REGEX_SPECIAL_CHARS_GLOBAL: g
  } = fb;

  b.isObject = a => null !== a && "object" === typeof a && !Array.isArray(a);

  b.hasRegexChars = a => e.test(a);

  b.isRegexChar = a => 1 === a.length && b.hasRegexChars(a);

  b.escapeRegex = a => a.replace(g, "\\$1");

  b.toPosixSlashes = a => a.replace(d, "/");

  b.removeBackslashes = a => a.replace(f, a => "\\" === a ? "" : a);

  b.supportsLookbehinds = () => {
    let a = process.version.slice(1).split(".").map(Number);
    return 3 === a.length && 9 <= a[0] || 8 === a[0] && 10 <= a[1] ? !0 : !1;
  };

  b.isWindows = a => a && "boolean" === typeof a.windows ? a.windows : !0 === c || "\\" === sysPath.sep;

  b.escapeLast = (a, c, e) => {
    e = a.lastIndexOf(c, e);
    return -1 === e ? a : "\\" === a[e - 1] ? b.escapeLast(a, c, e - 1) : `${a.slice(0, e)}\\${a.slice(e)}`;
  };

  b.removePrefix = (a, b = {}) => {
    a.startsWith("./") && (a = a.slice(2), b.prefix = "./");
    return a;
  };

  b.wrapOutput = (a, b = {}, c = {}) => {
    a = `${c.contains ? "" : "^"}(?:${a})${c.contains ? "" : "$"}`;
    !0 === b.negated && (a = `(?:^(?!${a}).*$)`);
    return a;
  };
});

let {
  CHAR_ASTERISK: gb,
  CHAR_AT: hb,
  CHAR_BACKWARD_SLASH: ib,
  CHAR_COMMA: jb,
  CHAR_DOT: kb,
  CHAR_EXCLAMATION_MARK: lb,
  CHAR_FORWARD_SLASH: mb,
  CHAR_LEFT_CURLY_BRACE: nb,
  CHAR_LEFT_PARENTHESES: ob,
  CHAR_LEFT_SQUARE_BRACKET: pb,
  CHAR_PLUS: qb,
  CHAR_QUESTION_MARK: rb,
  CHAR_RIGHT_CURLY_BRACE: sb,
  CHAR_RIGHT_PARENTHESES: tb,
  CHAR_RIGHT_SQUARE_BRACKET: ub
} = fb,
    vb = a => a === mb || a === ib,
    wb = a => {
  !0 !== a.isPrefix && (a.depth = a.isGlobstar ? Infinity : 1);
};

var xb = (a, b) => {
  b = b || {};
  var c = a.length - 1,
      d = !0 === b.parts || !0 === b.scanToEnd;
  const f = [],
        e = [],
        g = [];
  let h = a,
      k = -1,
      q = 0;
  var m = 0,
      r = !1;
  let u = !1,
      z = !1,
      A = !1,
      da = !1,
      Y = !1,
      B = !1,
      Z = !1,
      L = !1,
      sa = 0,
      U,
      w;
  var v = {
    value: "",
    depth: 0,
    isGlob: !1
  };

  const l = () => {
    U = w;
    return h.charCodeAt(++k);
  };

  for (; k < c;) {
    w = l();
    var C = void 0;
    if (w === ib) B = v.backslashes = !0, w = l(), w === nb && (Y = !0);else {
      if (!0 === Y || w === nb) {
        for (sa++; !0 !== k >= c && (w = l());) if (w === ib) B = v.backslashes = !0, l();else if (w === nb) sa++;else {
          if (!0 !== Y && w === kb && (w = l()) === kb) {
            r = v.isBrace = !0;
            L = z = v.isGlob = !0;
            if (!0 === d) continue;
            break;
          }

          if (!0 !== Y && w === jb) {
            r = v.isBrace = !0;
            L = z = v.isGlob = !0;
            if (!0 === d) continue;
            break;
          }

          if (w === sb && (sa--, 0 === sa)) {
            Y = !1;
            L = r = v.isBrace = !0;
            break;
          }
        }

        if (!0 === d) continue;
        break;
      }

      if (w === mb) f.push(k), e.push(v), v = {
        value: "",
        depth: 0,
        isGlob: !1
      }, !0 !== L && (U === kb && k === q + 1 ? q += 2 : m = k + 1);else {
        if (!0 !== b.noext && !0 === (w === qb || w === hb || w === gb || w === rb || w === lb) && h.charCodeAt(k + 1) === ob) {
          z = v.isGlob = !0;
          L = A = v.isExtglob = !0;

          if (!0 === d) {
            for (; !0 !== k >= c && (w = l());) if (w === ib) B = v.backslashes = !0, w = l();else if (w === tb) {
              L = z = v.isGlob = !0;
              break;
            }

            continue;
          }

          break;
        }

        if (w === gb) {
          U === gb && (da = v.isGlobstar = !0);
          L = z = v.isGlob = !0;
          if (!0 === d) continue;
          break;
        }

        if (w === rb) {
          L = z = v.isGlob = !0;
          if (!0 === d) continue;
          break;
        }

        if (w === pb) for (; !0 !== k >= c && (C = l());) if (C === ib) B = v.backslashes = !0, l();else if (C === ub && (u = v.isBracket = !0, L = z = v.isGlob = !0, !0 !== d)) break;
        if (!0 !== b.nonegate && w === lb && k === q) Z = v.negated = !0, q++;else {
          if (!0 !== b.noparen && w === ob) {
            z = v.isGlob = !0;

            if (!0 === d) {
              for (; !0 !== k >= c && (w = l());) if (w === ob) B = v.backslashes = !0, w = l();else if (w === tb) {
                L = !0;
                break;
              }

              continue;
            }

            break;
          }

          if (!0 === z && (L = !0, !0 !== d)) break;
        }
      }
    }
  }

  !0 === b.noext && (z = A = !1);
  c = h;
  d = C = "";
  0 < q && (C = h.slice(0, q), h = h.slice(q), m -= q);
  c && !0 === z && 0 < m ? (c = h.slice(0, m), d = h.slice(m)) : !0 === z ? (c = "", d = h) : c = h;
  c && "" !== c && "/" !== c && c !== h && vb(c.charCodeAt(c.length - 1)) && (c = c.slice(0, -1));
  !0 === b.unescape && (d && (d = J.removeBackslashes(d)), c && !0 === B && (c = J.removeBackslashes(c)));
  m = {
    prefix: C,
    input: a,
    start: q,
    base: c,
    glob: d,
    isBrace: r,
    isBracket: u,
    isGlob: z,
    isExtglob: A,
    isGlobstar: da,
    negated: Z
  };
  !0 === b.tokens && (m.maxDepth = 0, w !== mb && w !== ib && e.push(v), m.tokens = e);

  if (!0 === b.parts || !0 === b.tokens) {
    for (v = 0; v < f.length; v++) {
      r = f[v];
      var H = a.slice(H ? H + 1 : q, r);
      b.tokens && (0 === v && 0 !== q ? (e[v].isPrefix = !0, e[v].value = C) : e[v].value = H, wb(e[v]), m.maxDepth += e[v].depth);
      0 === v && "" === H || g.push(H);
      H = r;
    }

    H && H + 1 < a.length && (a = a.slice(H + 1), g.push(a), b.tokens && (e[e.length - 1].value = a, wb(e[e.length - 1]), m.maxDepth += e[e.length - 1].depth));
    m.slashes = f;
    m.parts = g;
  }

  return m;
};

let {
  MAX_LENGTH: yb,
  POSIX_REGEX_SOURCE: zb,
  REGEX_NON_SPECIAL_CHARS: Ab,
  REGEX_SPECIAL_CHARS_BACKREF: Bb,
  REPLACEMENTS: Cb
} = fb,
    Db = (a, b) => {
  if ("function" === typeof b.expandRange) return b.expandRange(...a, b);
  a.sort();
  b = `[${a.join("-")}]`;

  try {
    new RegExp(b);
  } catch (c) {
    return a.map(a => J.escapeRegex(a)).join("..");
  }

  return b;
},
    Eb = (a, b) => `Missing ${a}: "${b}" - use "\\\\${b}" to match literal characters`,
    Fb = (a, b) => {
  if ("string" !== typeof a) throw new TypeError("Expected a string");
  a = Cb[a] || a;
  const c = { ...b
  };
  var d = "number" === typeof c.maxLength ? Math.min(yb, c.maxLength) : yb;
  let f = a.length;
  if (f > d) throw new SyntaxError(`Input length: ${f}, exceeds maximum allowed length: ${d}`);
  d = {
    type: "bos",
    value: "",
    output: c.prepend || ""
  };
  const e = [d],
        g = c.capture ? "" : "?:";
  var h = J.isWindows(b);
  h = fb.globChars(h);

  const k = fb.extglobChars(h),
        {
    DOT_LITERAL: q,
    PLUS_LITERAL: m,
    SLASH_LITERAL: r,
    ONE_CHAR: u,
    DOTS_SLASH: z,
    NO_DOT: A,
    NO_DOT_SLASH: da,
    NO_DOTS_SLASH: Y,
    QMARK: B,
    QMARK_NO_DOT: Z,
    STAR: L,
    START_ANCHOR: sa
  } = h,
        U = a => `(${g}(?:(?!${sa}${a.dot ? z : q}).)*?)`;

  h = c.dot ? "" : A;
  const w = c.dot ? B : Z;
  let v = !0 === c.bash ? U(c) : L;
  c.capture && (v = `(${v})`);
  "boolean" === typeof c.noext && (c.noextglob = c.noext);
  const l = {
    input: a,
    index: -1,
    start: 0,
    dot: !0 === c.dot,
    consumed: "",
    output: "",
    prefix: "",
    backtrack: !1,
    negated: !1,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: !1,
    tokens: e
  };
  a = J.removePrefix(a, l);
  f = a.length;
  const C = [],
        H = [],
        ba = [];
  let n = d,
      p;

  const K = l.peek = (b = 1) => a[l.index + b],
        ia = l.advance = () => a[++l.index],
        ea = (a = "", b = 0) => {
    l.consumed += a;
    l.index += b;
  },
        Xa = a => {
    l.output += null != a.output ? a.output : a.value;
    ea(a.value);
  },
        ze = () => {
    let a = 1;

    for (; "!" === K() && ("(" !== K(2) || "?" === K(3));) ia(), l.start++, a++;

    if (0 === a % 2) return !1;
    l.negated = !0;
    l.start++;
    return !0;
  },
        Ya = a => {
    l[a]++;
    ba.push(a);
  },
        y = a => {
    if ("globstar" === n.type) {
      const b = 0 < l.braces && ("comma" === a.type || "brace" === a.type),
            c = !0 === a.extglob || C.length && ("pipe" === a.type || "paren" === a.type);
      "slash" === a.type || "paren" === a.type || b || c || (l.output = l.output.slice(0, -n.output.length), n.type = "star", n.value = "*", n.output = v, l.output += n.output);
    }

    C.length && "paren" !== a.type && !k[a.value] && (C[C.length - 1].inner += a.value);
    (a.value || a.output) && Xa(a);
    n && "text" === n.type && "text" === a.type ? (n.value += a.value, n.output = (n.output || "") + a.value) : (a.prev = n, e.push(a), n = a);
  },
        Za = (a, b) => {
    const e = { ...k[b],
      conditions: 1,
      inner: ""
    };
    e.prev = n;
    e.parens = l.parens;
    e.output = l.output;
    const d = (c.capture ? "(" : "") + e.open;
    Ya("parens");
    y({
      type: a,
      value: b,
      output: l.output ? "" : u
    });
    y({
      type: "paren",
      extglob: !0,
      value: ia(),
      output: d
    });
    C.push(e);
  },
        Ae = b => {
    let e = b.close + (c.capture ? ")" : "");

    if ("negate" === b.type) {
      let d = v;
      b.inner && 1 < b.inner.length && b.inner.includes("/") && (d = U(c));
      if (d !== v || l.index === f - 1 || /^\)+$/.test(a.slice(l.index + 1))) e = b.close = `)$))${d}`;
      "bos" === b.prev.type && l.index === f - 1 && (l.negatedExtglob = !0);
    }

    y({
      type: "paren",
      extglob: !0,
      value: p,
      output: e
    });
    l.parens--;
    ba.pop();
  };

  if (!1 !== c.fastpaths && !/(^[*!]|[/()[\]{}"])/.test(a)) {
    let e = !1;
    var ja = a.replace(Bb, (a, b, c, d, g, f) => "\\" === d ? (e = !0, a) : "?" === d ? b ? b + d + (g ? B.repeat(g.length) : "") : 0 === f ? w + (g ? B.repeat(g.length) : "") : B.repeat(c.length) : "." === d ? q.repeat(c.length) : "*" === d ? b ? b + d + (g ? v : "") : v : b ? a : `\\${a}`);
    !0 === e && (ja = !0 === c.unescape ? ja.replace(/\\/g, "") : ja.replace(/\\+/g, a => 0 === a.length % 2 ? "\\\\" : a ? "\\" : ""));
    if (ja === a && !0 === c.contains) return l.output = a, l;
    l.output = J.wrapOutput(ja, l, b);
    return l;
  }

  for (; l.index !== f - 1;) if (p = ia(), "\x00" !== p) {
    if ("\\" === p) {
      b = K();
      if ("/" === b && !0 !== c.bash) continue;
      if ("." === b || ";" === b) continue;

      if (!b) {
        p += "\\";
        y({
          type: "text",
          value: p
        });
        continue;
      }

      b = /^\\+/.exec(a.slice(l.index + 1));
      var x = 0;
      b && 2 < b[0].length && (x = b[0].length, l.index += x, 0 !== x % 2 && (p += "\\"));
      p = !0 === c.unescape ? ia() || "" : p + (ia() || "");

      if (0 === l.brackets) {
        y({
          type: "text",
          value: p
        });
        continue;
      }
    }

    if (0 < l.brackets && ("]" !== p || "[" === n.value || "[^" === n.value)) {
      if (!1 !== c.posix && ":" === p && (b = n.value.slice(1), b.includes("[") && (n.posix = !0, b.includes(":") && (x = n.value.lastIndexOf("["), b = n.value.slice(0, x), x = n.value.slice(x + 2), x = zb[x])))) {
        n.value = b + x;
        l.backtrack = !0;
        ia();
        d.output || 1 !== e.indexOf(n) || (d.output = u);
        continue;
      }

      if ("[" === p && ":" !== K() || "-" === p && "]" === K()) p = `\\${p}`;
      "]" !== p || "[" !== n.value && "[^" !== n.value || (p = `\\${p}`);
      !0 === c.posix && "!" === p && "[" === n.value && (p = "^");
      n.value += p;
      Xa({
        value: p
      });
    } else if (1 === l.quotes && '"' !== p) p = J.escapeRegex(p), n.value += p, Xa({
      value: p
    });else if ('"' === p) l.quotes = 1 === l.quotes ? 0 : 1, !0 === c.keepQuotes && y({
      type: "text",
      value: p
    });else if ("(" === p) Ya("parens"), y({
      type: "paren",
      value: p
    });else if (")" === p) {
      if (0 === l.parens && !0 === c.strictBrackets) throw new SyntaxError(Eb("opening", "("));
      (b = C[C.length - 1]) && l.parens === b.parens + 1 ? Ae(C.pop()) : (y({
        type: "paren",
        value: p,
        output: l.parens ? ")" : "\\)"
      }), l.parens--, ba.pop());
    } else if ("[" === p) {
      if (!0 !== c.nobracket && a.slice(l.index + 1).includes("]")) Ya("brackets");else {
        if (!0 !== c.nobracket && !0 === c.strictBrackets) throw new SyntaxError(Eb("closing", "]"));
        p = `\\${p}`;
      }
      y({
        type: "bracket",
        value: p
      });
    } else if ("]" === p) {
      if (!0 === c.nobracket || n && "bracket" === n.type && 1 === n.value.length) y({
        type: "text",
        value: p,
        output: `\\${p}`
      });else if (0 === l.brackets) {
        if (!0 === c.strictBrackets) throw new SyntaxError(Eb("opening", "["));
        y({
          type: "text",
          value: p,
          output: `\\${p}`
        });
      } else l.brackets--, ba.pop(), b = n.value.slice(1), !0 === n.posix || "^" !== b[0] || b.includes("/") || (p = `/${p}`), n.value += p, Xa({
        value: p
      }), !1 === c.literalBrackets || J.hasRegexChars(b) || (b = J.escapeRegex(n.value), l.output = l.output.slice(0, -n.value.length), !0 === c.literalBrackets ? (l.output += b, n.value = b) : (n.value = `(${g}${b}|${n.value})`, l.output += n.value));
    } else if ("{" === p && !0 !== c.nobrace) Ya("braces"), b = {
      type: "brace",
      value: p,
      output: "(",
      outputIndex: l.output.length,
      tokensIndex: l.tokens.length
    }, H.push(b), y(b);else if ("}" === p) {
      if (b = H[H.length - 1], !0 !== c.nobrace && b) {
        x = ")";

        if (!0 === b.dots) {
          x = e.slice();
          var fa = [];

          for (var O = x.length - 1; 0 <= O; O--) {
            e.pop();
            if ("brace" === x[O].type) break;
            "dots" !== x[O].type && fa.unshift(x[O].value);
          }

          x = Db(fa, c);
          l.backtrack = !0;
        }

        if (!0 !== b.comma && !0 !== b.dots) {
          fa = l.output.slice(0, b.outputIndex);
          O = l.tokens.slice(b.tokensIndex);
          b.value = b.output = "\\{";
          p = x = "\\}";
          l.output = fa;

          for (ja of O) l.output += ja.output || ja.value;
        }

        y({
          type: "brace",
          value: p,
          output: x
        });
        l.braces--;
        ba.pop();
        H.pop();
      } else y({
        type: "text",
        value: p,
        output: p
      });
    } else if ("|" === p) 0 < C.length && C[C.length - 1].conditions++, y({
      type: "text",
      value: p
    });else if ("," === p) b = p, (x = H[H.length - 1]) && "braces" === ba[ba.length - 1] && (x.comma = !0, b = "|"), y({
      type: "comma",
      value: p,
      output: b
    });else if ("/" === p) "dot" === n.type && l.index === l.start + 1 ? (l.start = l.index + 1, l.consumed = "", l.output = "", e.pop(), n = d) : y({
      type: "slash",
      value: p,
      output: r
    });else if ("." === p) 0 < l.braces && "dot" === n.type ? ("." === n.value && (n.output = q), b = H[H.length - 1], n.type = "dots", n.output += p, n.value += p, b.dots = !0) : 0 === l.braces + l.parens && "bos" !== n.type && "slash" !== n.type ? y({
      type: "text",
      value: p,
      output: q
    }) : y({
      type: "dot",
      value: p,
      output: q
    });else if ("?" === p) {
      if (n && "(" === n.value || !0 === c.noextglob || "(" !== K() || "?" === K(2)) {
        if (n && "paren" === n.type) {
          b = K();
          x = p;
          if ("<" === b && !J.supportsLookbehinds()) throw Error("Node.js v10 or higher is required for regex lookbehinds");
          if ("(" === n.value && !/[!=<:]/.test(b) || "<" === b && !/<([!=]|\w+>)/.test(a.slice(l.index + 1))) x = `\\${p}`;
          y({
            type: "text",
            value: p,
            output: x
          });
        } else !0 === c.dot || "slash" !== n.type && "bos" !== n.type ? y({
          type: "qmark",
          value: p,
          output: B
        }) : y({
          type: "qmark",
          value: p,
          output: Z
        });
      } else Za("qmark", p);
    } else {
      if ("!" === p) {
        if (!0 !== c.noextglob && "(" === K() && ("?" !== K(2) || !/[!=<:]/.test(K(3)))) {
          Za("negate", p);
          continue;
        }

        if (!0 !== c.nonegate && 0 === l.index) {
          ze();
          continue;
        }
      }

      if ("+" === p) !0 !== c.noextglob && "(" === K() && "?" !== K(2) ? Za("plus", p) : n && "(" === n.value || !1 === c.regex ? y({
        type: "plus",
        value: p,
        output: m
      }) : n && ("bracket" === n.type || "paren" === n.type || "brace" === n.type) || 0 < l.parens ? y({
        type: "plus",
        value: p
      }) : y({
        type: "plus",
        value: m
      });else if ("@" === p) !0 !== c.noextglob && "(" === K() && "?" !== K(2) ? y({
        type: "at",
        extglob: !0,
        value: p,
        output: ""
      }) : y({
        type: "text",
        value: p
      });else if ("*" !== p) {
        if ("$" === p || "^" === p) p = `\\${p}`;
        if (b = Ab.exec(a.slice(l.index + 1))) p += b[0], l.index += b[0].length;
        y({
          type: "text",
          value: p
        });
      } else if (!n || "globstar" !== n.type && !0 !== n.star) {
        if (x = a.slice(l.index + 1), !0 !== c.noextglob && /^\([^?]/.test(x)) Za("star", p);else if ("star" === n.type) {
          if (!0 === c.noglobstar) {
            ea(p);
            continue;
          }

          b = n.prev;
          O = b.prev;
          fa = "slash" === b.type || "bos" === b.type;
          O = O && ("star" === O.type || "globstar" === O.type);

          if (!0 === c.bash && (!fa || x[0] && "/" !== x[0])) {
            y({
              type: "star",
              value: p,
              output: ""
            });
            continue;
          }

          const e = 0 < l.braces && ("comma" === b.type || "brace" === b.type),
                d = C.length && ("pipe" === b.type || "paren" === b.type);

          if (fa || "paren" === b.type || e || d) {
            for (; "/**" === x.slice(0, 3) && (!(fa = a[l.index + 4]) || "/" === fa);) x = x.slice(3), ea("/**", 3);

            "bos" === b.type && l.index === f - 1 ? (n.type = "globstar", n.value += p, n.output = U(c), l.output = n.output, l.globstar = !0, ea(p)) : "slash" !== b.type || "bos" === b.prev.type || O || l.index !== f - 1 ? "slash" === b.type && "bos" !== b.prev.type && "/" === x[0] ? (x = void 0 !== x[1] ? "|$" : "", l.output = l.output.slice(0, -(b.output + n.output).length), b.output = `(?:${b.output}`, n.type = "globstar", n.output = `${U(c)}${r}|${r}${x})`, n.value += p, l.output += b.output + n.output, l.globstar = !0, ea(p + ia()), y({
              type: "slash",
              value: "/",
              output: ""
            })) : "bos" === b.type && "/" === x[0] ? (n.type = "globstar", n.value += p, n.output = `(?:^|${r}|${U(c)}${r})`, l.output = n.output, l.globstar = !0, ea(p + ia()), y({
              type: "slash",
              value: "/",
              output: ""
            })) : (l.output = l.output.slice(0, -n.output.length), n.type = "globstar", n.output = U(c), n.value += p, l.output += n.output, l.globstar = !0, ea(p)) : (l.output = l.output.slice(0, -(b.output + n.output).length), b.output = `(?:${b.output}`, n.type = "globstar", n.output = U(c) + (c.strictSlashes ? ")" : "|$)"), n.value += p, l.globstar = !0, l.output += b.output + n.output, ea(p));
          } else y({
            type: "star",
            value: p,
            output: ""
          });
        } else {
          b = {
            type: "star",
            value: p,
            output: v
          };

          if (!0 === c.bash) {
            if (b.output = ".*?", "bos" === n.type || "slash" === n.type) b.output = h + b.output;
          } else if (n && ("bracket" === n.type || "paren" === n.type) && !0 === c.regex) b.output = p;else if (l.index === l.start || "slash" === n.type || "dot" === n.type) "dot" === n.type ? (l.output += da, n.output += da) : !0 === c.dot ? (l.output += Y, n.output += Y) : (l.output += h, n.output += h), "*" !== K() && (l.output += u, n.output += u);

          y(b);
        }
      } else n.type = "star", n.star = !0, n.value += p, n.output = v, l.backtrack = !0, l.globstar = !0, ea(p);
    }
  }

  for (; 0 < l.brackets;) {
    if (!0 === c.strictBrackets) throw new SyntaxError(Eb("closing", "]"));
    l.output = J.escapeLast(l.output, "[");
    l.brackets--;
    ba.pop();
  }

  for (; 0 < l.parens;) {
    if (!0 === c.strictBrackets) throw new SyntaxError(Eb("closing", ")"));
    l.output = J.escapeLast(l.output, "(");
    l.parens--;
    ba.pop();
  }

  for (; 0 < l.braces;) {
    if (!0 === c.strictBrackets) throw new SyntaxError(Eb("closing", "}"));
    l.output = J.escapeLast(l.output, "{");
    l.braces--;
    ba.pop();
  }

  !0 === c.strictSlashes || "star" !== n.type && "bracket" !== n.type || y({
    type: "maybe_slash",
    value: "",
    output: `${r}?`
  });

  if (!0 === l.backtrack) {
    l.output = "";

    for (const a of l.tokens) l.output += null != a.output ? a.output : a.value, a.suffix && (l.output += a.suffix);
  }

  return l;
};

Fb.fastpaths = (a, b) => {
  let c = { ...b
  },
      d = "number" === typeof c.maxLength ? Math.min(yb, c.maxLength) : yb,
      f = a.length;
  if (f > d) throw new SyntaxError(`Input length: ${f}, exceeds maximum allowed length: ${d}`);
  a = Cb[a] || a;
  b = J.isWindows(b);
  let {
    DOT_LITERAL: e,
    SLASH_LITERAL: g,
    ONE_CHAR: h,
    DOTS_SLASH: k,
    NO_DOT: q,
    NO_DOTS: m,
    NO_DOTS_SLASH: r,
    STAR: u,
    START_ANCHOR: z
  } = fb.globChars(b),
      A = c.dot ? m : q,
      da = c.dot ? r : q,
      Y = c.capture ? "" : "?:",
      B = !0 === c.bash ? ".*?" : u;
  c.capture && (B = `(${B})`);

  let Z = a => !0 === a.noglobstar ? B : `(${Y}(?:(?!${z}${a.dot ? k : e}).)*?)`,
      L = a => {
    switch (a) {
      case "*":
        return `${A}${h}${B}`;

      case ".*":
        return `${e}${h}${B}`;

      case "*.*":
        return `${A}${B}${e}${h}${B}`;

      case "*/*":
        return `${A}${B}${g}${h}${da}${B}`;

      case "**":
        return A + Z(c);

      case "**/*":
        return `(?:${A}${Z(c)}${g})?${da}${h}${B}`;

      case "**/*.*":
        return `(?:${A}${Z(c)}${g})?${da}${B}${e}${h}${B}`;

      case "**/.*":
        return `(?:${A}${Z(c)}${g})?${e}${h}${B}`;

      default:
        {
          const b = /^(.*?)\.(\w+)$/.exec(a);
          if (b && (a = L(b[1]))) return a + e + b[2];
        }
    }
  };

  a = J.removePrefix(a, {
    negated: !1,
    prefix: ""
  });
  (a = L(a)) && !0 !== c.strictSlashes && (a += `${g}?`);
  return a;
};

let M = (a, b, c = !1) => {
  if (Array.isArray(a)) {
    const e = a.map(a => M(a, b, c));
    return a => {
      for (const b of e) {
        const c = b(a);
        if (c) return c;
      }

      return !1;
    };
  }

  var d = a && "object" === typeof a && !Array.isArray(a) && a.tokens && a.input;
  if ("" === a || "string" !== typeof a && !d) throw new TypeError("Expected pattern to be a non-empty string");
  const f = b || {},
        e = J.isWindows(b),
        g = d ? M.compileRe(a, b) : M.makeRe(a, b, !1, !0),
        h = g.state;
  delete g.state;

  let k = () => !1;

  f.ignore && (k = M(f.ignore, { ...b,
    ignore: null,
    onMatch: null,
    onResult: null
  }, c));

  d = (c, d = !1) => {
    const {
      isMatch: q,
      match: m,
      output: z
    } = M.test(c, g, b, {
      glob: a,
      posix: e
    }),
          A = {
      glob: a,
      state: h,
      regex: g,
      posix: e,
      input: c,
      output: z,
      match: m,
      isMatch: q
    };
    if ("function" === typeof f.onResult) f.onResult(A);
    if (!1 === q) return A.isMatch = !1, d ? A : !1;

    if (k(c)) {
      if ("function" === typeof f.onIgnore) f.onIgnore(A);
      A.isMatch = !1;
      return d ? A : !1;
    }

    if ("function" === typeof f.onMatch) f.onMatch(A);
    return d ? A : !0;
  };

  c && (d.state = h);
  return d;
};

M.test = (a, b, c, {
  glob: d,
  posix: f
} = {}) => {
  if ("string" !== typeof a) throw new TypeError("Expected input to be a string");
  if ("" === a) return {
    isMatch: !1,
    output: ""
  };
  let e = c || {},
      g = e.format || (f ? J.toPosixSlashes : null),
      h = a === d,
      k = h && g ? g(a) : a;
  !1 === h && (k = g ? g(a) : a, h = k === d);
  if (!1 === h || !0 === e.capture) h = !0 === e.matchBase || !0 === e.basename ? M.matchBase(a, b, c, f) : b.exec(k);
  return {
    isMatch: !!h,
    match: h,
    output: k
  };
};

M.matchBase = (a, b, c, d = J.isWindows(c)) => (b instanceof RegExp ? b : M.makeRe(b, c)).test(sysPath.basename(a));

M.isMatch = (a, b, c) => M(b, c)(a);

M.parse = (a, b) => Array.isArray(a) ? a.map(a => M.parse(a, b)) : Fb(a, { ...b,
  fastpaths: !1
});

M.scan = (a, b) => xb(a, b);

M.compileRe = (a, b, c = !1, d = !1) => {
  if (!0 === c) return a.output;
  c = b || {};
  c = `${c.contains ? "" : "^"}(?:${a.output})${c.contains ? "" : "$"}`;
  a && !0 === a.negated && (c = `^(?!${c}).*$`);
  b = M.toRegex(c, b);
  !0 === d && (b.state = a);
  return b;
};

M.makeRe = (a, b, c = !1, d = !1) => {
  if (!a || "string" !== typeof a) throw new TypeError("Expected a non-empty string");
  let f = b || {},
      e = {
    negated: !1,
    fastpaths: !0
  },
      g = "",
      h;
  a.startsWith("./") && (a = a.slice(2), g = e.prefix = "./");
  !1 === f.fastpaths || "." !== a[0] && "*" !== a[0] || (h = Fb.fastpaths(a, b));
  void 0 === h ? (e = Fb(a, b), e.prefix = g + (e.prefix || "")) : e.output = h;
  return M.compileRe(e, b, c, d);
};

M.toRegex = (a, b) => {
  try {
    let c = b || {};
    return new RegExp(a, c.flags || (c.nocase ? "i" : ""));
  } catch (c) {
    if (b && !0 === b.debug) throw c;
    return /$^/;
  }
};

M.constants = fb;
var Gb = M;

let {
  Readable: Hb
} = Stream,
    {
  promisify: Ib
} = require$$0$3,
    Jb = Ib(fs.readdir),
    Kb = Ib(fs.stat),
    Lb = Ib(fs.lstat),
    Mb = Ib(fs.realpath),
    Nb = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP"]),
    Ob = ["files", "directories", "files_directories", "all"],
    Pb = a => {
  if (void 0 !== a) {
    if ("function" === typeof a) return a;

    if ("string" === typeof a) {
      const b = Gb(a.trim());
      return a => b(a.basename);
    }

    if (Array.isArray(a)) {
      const b = [],
            c = [];

      for (const d of a) a = d.trim(), "!" === a.charAt(0) ? c.push(Gb(a.slice(1))) : b.push(Gb(a));

      return 0 < c.length ? 0 < b.length ? a => b.some(b => b(a.basename)) && !c.some(b => b(a.basename)) : a => !c.some(b => b(a.basename)) : a => b.some(b => b(a.basename));
    }
  }
};

class Qb extends Hb {
  static get defaultOptions() {
    return {
      root: ".",
      fileFilter: () => !0,
      directoryFilter: () => !0,
      type: "files",
      lstat: !1,
      depth: 2147483648,
      alwaysStat: !1
    };
  }

  constructor(a = {}) {
    super({
      objectMode: !0,
      autoDestroy: !0,
      highWaterMark: a.highWaterMark || 4096
    });
    a = { ...Qb.defaultOptions,
      ...a
    };
    let {
      root: b,
      type: c
    } = a;
    this._fileFilter = Pb(a.fileFilter);
    this._directoryFilter = Pb(a.directoryFilter);
    let d = a.lstat ? Lb : Kb;
    this._stat = "win32" === process.platform && 3 === Kb.length ? a => d(a, {
      bigint: !0
    }) : d;
    this._maxDepth = a.depth;
    this._wantsDir = ["directories", "files_directories", "all"].includes(c);
    this._wantsFile = ["files", "files_directories", "all"].includes(c);
    this._wantsEverything = "all" === c;
    this._root = sysPath.resolve(b);
    this._statsProp = (this._isDirent = "Dirent" in fs && !a.alwaysStat) ? "dirent" : "stats";
    this._rdOptions = {
      encoding: "utf8",
      withFileTypes: this._isDirent
    };
    this.parents = [this._exploreDir(b, 1)];
    this.reading = !1;
    this.parent = void 0;
  }

  async _read(a) {
    if (!this.reading) {
      this.reading = !0;

      try {
        for (; !this.destroyed && 0 < a;) {
          let {
            path: b,
            depth: c,
            files: d = []
          } = this.parent || {};

          if (0 < d.length) {
            let f = d.splice(0, a).map(a => this._formatEntry(a, b));

            for (let b of await Promise.all(f)) {
              if (this.destroyed) return;
              let e = await this._getEntryType(b);
              "directory" === e && this._directoryFilter(b) ? (c <= this._maxDepth && this.parents.push(this._exploreDir(b.fullPath, c + 1)), this._wantsDir && (this.push(b), a--)) : ("file" === e || this._includeAsFile(b)) && this._fileFilter(b) && this._wantsFile && (this.push(b), a--);
            }
          } else {
            let a = this.parents.pop();

            if (!a) {
              this.push(null);
              break;
            }

            this.parent = await a;
            if (this.destroyed) break;
          }
        }
      } catch (b) {
        this.destroy(b);
      } finally {
        this.reading = !1;
      }
    }
  }

  async _exploreDir(a, b) {
    let c;

    try {
      c = await Jb(a, this._rdOptions);
    } catch (d) {
      this._onError(d);
    }

    return {
      files: c,
      depth: b,
      path: a
    };
  }

  async _formatEntry(a, b) {
    let c;

    try {
      let d = this._isDirent ? a.name : a,
          f = sysPath.resolve(sysPath.join(b, d));
      c = {
        path: sysPath.relative(this._root, f),
        fullPath: f,
        basename: d
      };
      c[this._statsProp] = this._isDirent ? a : await this._stat(f);
    } catch (d) {
      this._onError(d);
    }

    return c;
  }

  _onError(a) {
    Nb.has(a.code) && !this.destroyed ? this.emit("warn", a) : this.destroy(a);
  }

  async _getEntryType(a) {
    let b = a && a[this._statsProp];

    if (b) {
      if (b.isFile()) return "file";
      if (b.isDirectory()) return "directory";
      if (b && b.isSymbolicLink()) try {
        let b = await Mb(a.fullPath),
            d = await Lb(b);
        if (d.isFile()) return "file";
        if (d.isDirectory()) return "directory";
      } catch (c) {
        this._onError(c);
      }
    }
  }

  _includeAsFile(a) {
    return (a = a && a[this._statsProp]) && this._wantsEverything && !a.isDirectory();
  }

}

let Rb = (a, b = {}) => {
  let c = b.entryType || b.type;
  "both" === c && (c = "files_directories");
  c && (b.type = c);

  if (a) {
    if ("string" !== typeof a) throw new TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
    if (c && !Ob.includes(c)) throw Error(`readdirp: Invalid type passed. Use one of ${Ob.join(", ")}`);
  } else throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");

  b.root = a;
  return new Qb(b);
};

Rb.promise = (a, b = {}) => new Promise((c, d) => {
  const f = [];
  Rb(a, b).on("data", a => f.push(a)).on("end", () => c(f)).on("error", a => d(a));
});

Rb.ReaddirpStream = Qb;
Rb.default = Rb;

function Sb(a, b) {
  if ("string" !== typeof a) throw new TypeError("expected path to be a string");
  if ("\\" === a || "/" === a) return "/";
  var c = a.length;
  if (1 >= c) return a;
  var d = "";
  4 < c && "\\" === a[3] && (c = a[2], "?" !== c && "." !== c || "\\\\" !== a.slice(0, 2) || (a = a.slice(2), d = "//"));
  a = a.split(/[/\\]+/);
  !1 !== b && "" === a[a.length - 1] && a.pop();
  return d + a.join("/");
}

var Tb = t(function (a, b) {
  Object.defineProperty(b, "__esModule", {
    value: !0
  });

  let c = {
    returnIndex: !1
  },
      d = a => Array.isArray(a) ? a : [a],
      f = (a, b) => {
    if ("function" === typeof a) return a;

    if ("string" === typeof a) {
      const c = Gb(a, b);
      return b => a === b || c(b);
    }

    return a instanceof RegExp ? b => a.test(b) : () => !1;
  },
      e = (a, b, c, e) => {
    const d = Array.isArray(c);
    var g = d ? c[0] : c;
    if (!d && "string" !== typeof g) throw new TypeError("anymatch: second argument must be a string: got " + Object.prototype.toString.call(g));
    g = Sb(g);

    for (var f = 0; f < b.length; f++) if ((0, b[f])(g)) return e ? -1 : !1;

    b = d && [g].concat(c.slice(1));

    for (c = 0; c < a.length; c++) if (f = a[c], d ? f(...b) : f(g)) return e ? c : !0;

    return e ? -1 : !1;
  };

  b = (a, b, k = c) => {
    if (null == a) throw new TypeError("anymatch: specify first argument");
    const c = "boolean" === typeof k ? {
      returnIndex: k
    } : k;
    k = c.returnIndex || !1;
    a = d(a);
    const g = a.filter(a => "string" === typeof a && "!" === a.charAt(0)).map(a => a.slice(1)).map(a => Gb(a, c)),
          h = a.map(a => f(a, c));
    return null == b ? (a, b = !1) => e(h, g, a, "boolean" === typeof b ? b : !1) : e(h, g, b, k);
  };

  b.default = b;
  a.exports = b;
});

function Ub(a) {
  if ("string" !== typeof a || "" === a) return !1;

  for (var b; b = /(\\).|([@?!+*]\(.*\))/g.exec(a);) {
    if (b[2]) return !0;
    a = a.slice(b.index + b[0].length);
  }

  return !1;
}

var Vb = {
  "{": "}",
  "(": ")",
  "[": "]"
},
    Wb = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/,
    Xb = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

function Yb(a, b) {
  if ("string" !== typeof a || "" === a) return !1;
  if (Ub(a)) return !0;
  var c = Wb,
      d;

  for (b && !1 === b.strict && (c = Xb); d = c.exec(a);) {
    if (d[2]) return !0;
    b = d.index + d[0].length;
    var f = (d = d[1]) ? Vb[d] : null;
    d && f && (d = a.indexOf(f, b), -1 !== d && (b = d + 1));
    a = a.slice(b);
  }

  return !1;
}

var Zb = sysPath.posix.dirname,
    $b = "win32" === os.platform(),
    ac = /\\/g,
    bc = /[\{\[].*[\/]*.*[\}\]]$/,
    cc = /(^|[^\\])([\{\[]|\([^\)]+$)/,
    dc = /\\([!\*\?\|\[\]\(\)\{\}])/g,
    ec = t(function (a, b) {
  b.isInteger = a => "number" === typeof a ? Number.isInteger(a) : "string" === typeof a && "" !== a.trim() ? Number.isInteger(Number(a)) : !1;

  b.find = (a, b) => a.nodes.find(a => a.type === b);

  b.exceedsLimit = (a, d, f = 1, e) => !1 !== e && b.isInteger(a) && b.isInteger(d) ? (Number(d) - Number(a)) / Number(f) >= e : !1;

  b.escapeNode = (a, b = 0, f) => {
    (a = a.nodes[b]) && (f && a.type === f || "open" === a.type || "close" === a.type) && !0 !== a.escaped && (a.value = "\\" + a.value, a.escaped = !0);
  };

  b.encloseBrace = a => "brace" !== a.type ? !1 : 0 === a.commas >> 0 + a.ranges >> 0 ? a.invalid = !0 : !1;

  b.isInvalidBrace = a => "brace" !== a.type ? !1 : !0 === a.invalid || a.dollar ? !0 : 0 === a.commas >> 0 + a.ranges >> 0 || !0 !== a.open || !0 !== a.close ? a.invalid = !0 : !1;

  b.isOpenOrClose = a => "open" === a.type || "close" === a.type ? !0 : !0 === a.open || !0 === a.close;

  b.reduce = a => a.reduce((a, b) => {
    "text" === b.type && a.push(b.value);
    "range" === b.type && (b.type = "text");
    return a;
  }, []);

  b.flatten = (...a) => {
    let b = [],
        c = a => {
      for (let e = 0; e < a.length; e++) {
        let d = a[e];
        Array.isArray(d) ? c(d) : void 0 !== d && b.push(d);
      }

      return b;
    };

    c(a);
    return b;
  };
}),
    fc = (a, b = {}) => {
  let c = (a, f = {}) => {
    f = b.escapeInvalid && ec.isInvalidBrace(f);
    let e = !0 === a.invalid && !0 === b.escapeInvalid,
        d = "";
    if (a.value) return (f || e) && ec.isOpenOrClose(a) ? "\\" + a.value : a.value;
    if (a.value) return a.value;
    if (a.nodes) for (let b of a.nodes) d += c(b);
    return d;
  };

  return c(a);
};

function gc(a) {
  return "number" === typeof a ? 0 === a - a : "string" === typeof a && "" !== a.trim() ? Number.isFinite ? Number.isFinite(+a) : isFinite(+a) : !1;
}

let hc = (a, b, c) => {
  if (!1 === gc(a)) throw new TypeError("toRegexRange: expected the first argument to be a number");
  if (void 0 === b || a === b) return String(a);
  if (!1 === gc(b)) throw new TypeError("toRegexRange: expected the second argument to be a number.");
  c = {
    relaxZeros: !0,
    ...c
  };
  "boolean" === typeof c.strictZeros && (c.relaxZeros = !1 === c.strictZeros);
  var d = a + ":" + b + "=" + String(c.relaxZeros) + String(c.shorthand) + String(c.capture) + String(c.wrap);
  if (hc.cache.hasOwnProperty(d)) return hc.cache[d].result;
  var f = Math.min(a, b),
      e = Math.max(a, b);
  if (1 === Math.abs(f - e)) return d = a + "|" + b, c.capture ? `(${d})` : !1 === c.wrap ? d : `(?:${d})`;
  var g = /^-?(0+)\d/.test(a) || /^-?(0+)\d/.test(b);
  a = {
    min: a,
    max: b,
    a: f,
    b: e
  };
  b = [];
  let h = [];
  g && (a.isPadded = g, a.maxLen = String(a.max).length);
  0 > f && (h = ic(0 > e ? Math.abs(e) : 1, Math.abs(f), a, c), f = a.a = 0);
  0 <= e && (b = ic(f, e, a, c));
  a.negatives = h;
  a.positives = b;
  g = h;
  var k = b;
  f = jc(g, k, "-", !1) || [];
  e = jc(k, g, "", !1) || [];
  g = jc(g, k, "-?", !0) || [];
  f = f.concat(g).concat(e).join("|");
  a.result = f;
  !0 === c.capture ? a.result = `(${a.result})` : !1 !== c.wrap && 1 < b.length + h.length && (a.result = `(?:${a.result})`);
  hc.cache[d] = a;
  return a.result;
};

function ic(a, b, c, d) {
  for (var f = 1, e = 1, g = kc(a, f), h = new Set([b]); a <= g && g <= b;) h.add(g), f += 1, g = kc(a, f);

  f = b + 1;

  for (g = f - f % Math.pow(10, e) - 1; a < g && g <= b;) h.add(g), e += 1, f = b + 1, g = f - f % Math.pow(10, e) - 1;

  h = [...h];
  h.sort(lc);
  b = h;
  e = [];
  g = a;
  let k;

  for (a = 0; a < b.length; a++) {
    h = b[a];
    g = String(g);
    var q = String(h);
    f = d;
    if (g === q) f = {
      pattern: g,
      count: [],
      digits: 0
    };else {
      var m = [];

      for (var r = 0; r < g.length; r++) m.push([g[r], q[r]]);

      g = m;
      q = g.length;
      m = "";
      r = 0;

      for (let a = 0; a < q; a++) {
        let [b, c] = g[a];
        b === c ? m += b : "0" !== b || "9" !== c ? m += `[${b}${1 === c - b ? "" : "-"}${c}]` : r++;
      }

      r && (m += !0 === f.shorthand ? "\\d" : "[0-9]");
      f = {
        pattern: m,
        count: [r],
        digits: q
      };
    }
    g = "";
    !c.isPadded && k && k.pattern === f.pattern ? (1 < k.count.length && k.count.pop(), k.count.push(f.count[0]), k.string = k.pattern + mc(k.count), g = h + 1) : (c.isPadded && (g = nc(h, c, d)), f.string = g + f.pattern + mc(f.count), e.push(f), g = h + 1, k = f);
  }

  return e;
}

function jc(a, b, c, d) {
  let f = [];

  for (let e of a) ({
    string: a
  } = e), d || oc(b, "string", a) || f.push(c + a), d && oc(b, "string", a) && f.push(c + a);

  return f;
}

function lc(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function oc(a, b, c) {
  return a.some(a => a[b] === c);
}

function kc(a, b) {
  return Number(String(a).slice(0, -b) + "9".repeat(b));
}

function mc(a) {
  let [b = 0, c = ""] = a;
  return c || 1 < b ? `{${b + (c ? "," + c : "")}}` : "";
}

function nc(a, b, c) {
  if (!b.isPadded) return a;
  a = Math.abs(b.maxLen - String(a).length);
  c = !1 !== c.relaxZeros;

  switch (a) {
    case 0:
      return "";

    case 1:
      return c ? "0?" : "0";

    case 2:
      return c ? "0{0,2}" : "00";

    default:
      return c ? `0{0,${a}}` : `0{${a}}`;
  }
}

hc.cache = {};

hc.clearCache = () => hc.cache = {};

var pc = hc;

let qc = a => b => !0 === a ? Number(b) : String(b),
    rc = a => "number" === typeof a || "string" === typeof a && "" !== a,
    sc = a => {
  a = `${a}`;
  let b = -1;
  "-" === a[0] && (a = a.slice(1));
  if ("0" === a) return !1;

  for (; "0" === a[++b];);

  return 0 < b;
},
    tc = (a, b, c) => {
  if (0 < b) {
    let c = "-" === a[0] ? "-" : "";
    c && (a = a.slice(1));
    a = c + a.padStart(c ? b - 1 : b, "0");
  }

  return !1 === c ? String(a) : a;
},
    uc = (a, b) => {
  let c = "-" === a[0] ? "-" : "";
  c && (a = a.slice(1), b--);

  for (; a.length < b;) a = "0" + a;

  return c ? "-" + a : a;
},
    vc = (a, b) => {
  a.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  a.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  let c = b.capture ? "" : "?:",
      d = "",
      f = "";
  a.positives.length && (d = a.positives.join("|"));
  a.negatives.length && (f = `-(${c}${a.negatives.join("|")})`);
  a = d && f ? `${d}|${f}` : d || f;
  return b.wrap ? `(${c}${a})` : a;
},
    wc = (a, b, c, d) => {
  if (c) return pc(a, b, {
    wrap: !1,
    ...d
  });
  c = String.fromCharCode(a);
  if (a === b) return c;
  a = String.fromCharCode(b);
  return `[${c}-${a}]`;
},
    xc = (a, b, c) => Array.isArray(a) ? (b = c.capture ? "" : "?:", !0 === c.wrap ? `(${b}${a.join("|")})` : a.join("|")) : pc(a, b, c),
    yc = (...a) => new RangeError("Invalid range arguments: " + require$$0$3.inspect(...a)),
    zc = (a, b, c = 1, d = {}) => {
  let f = Number(a),
      e = Number(b);

  if (!Number.isInteger(f) || !Number.isInteger(e)) {
    if (!0 === d.strictRanges) throw yc([a, b]);
    return [];
  }

  0 === f && (f = 0);
  0 === e && (e = 0);
  let g = f > e;
  var h = String(a),
      k = String(b),
      q = String(c);
  c = Math.max(Math.abs(c), 1);
  var m = sc(h) || sc(k) || sc(q);
  h = m ? Math.max(h.length, k.length, q.length) : 0;
  if (m = !1 === m) m = "string" === typeof a || "string" === typeof b ? !0 : !0 === d.stringify, m = !1 === m;
  k = d.transform || qc(m);
  if (d.toRegex && 1 === c) return wc(uc(a, h), uc(b, h), !0, d);
  a = {
    negatives: [],
    positives: []
  };
  b = [];

  for (q = 0; g ? f >= e : f <= e;) !0 === d.toRegex && 1 < c ? a[0 > f ? "negatives" : "positives"].push(Math.abs(f)) : b.push(tc(k(f, q), h, m)), f = g ? f - c : f + c, q++;

  return !0 === d.toRegex ? 1 < c ? vc(a, d) : xc(b, null, {
    wrap: !1,
    ...d
  }) : b;
},
    Ac = (a, b, c = 1, d = {}) => {
  if (!Number.isInteger(+a) && 1 < a.length || !Number.isInteger(+b) && 1 < b.length) {
    if (!0 === d.strictRanges) throw yc([a, b]);
    return [];
  }

  let f = d.transform || (a => String.fromCharCode(a));

  a = `${a}`.charCodeAt(0);
  b = `${b}`.charCodeAt(0);
  let e = a > b;
  var g = Math.min(a, b),
      h = Math.max(a, b);
  if (d.toRegex && 1 === c) return wc(g, h, !1, d);
  g = [];

  for (h = 0; e ? a >= b : a <= b;) g.push(f(a, h)), a = e ? a - c : a + c, h++;

  return !0 === d.toRegex ? xc(g, null, {
    wrap: !1,
    options: d
  }) : g;
},
    Bc = (a, b, c, d = {}) => {
  if (null == b && rc(a)) return [a];

  if (!rc(a) || !rc(b)) {
    if (!0 === d.strictRanges) throw yc([a, b]);
    return [];
  }

  if ("function" === typeof c) return Bc(a, b, 1, {
    transform: c
  });
  if (null !== c && "object" === typeof c && !Array.isArray(c)) return Bc(a, b, 0, c);
  d = { ...d
  };
  !0 === d.capture && (d.wrap = !0);
  c = c || d.step || 1;

  if (!Number.isInteger(+c)) {
    if (null != c && (null === c || "object" !== typeof c || Array.isArray(c))) {
      if (!0 === d.strictRanges) throw new TypeError(`Expected step "${c}" to be a number`);
      return [];
    }

    return Bc(a, b, 1, c);
  }

  return Number.isInteger(+a) && Number.isInteger(+b) ? zc(a, b, c, d) : Ac(a, b, Math.max(Math.abs(c), 1), d);
};

var Cc = Bc,
    Dc = (a, b = {}) => {
  let c = (a, f = {}) => {
    f = ec.isInvalidBrace(f);
    var e = !0 === a.invalid && !0 === b.escapeInvalid;
    e = !0 === f || !0 === e;
    var d = !0 === b.escapeInvalid ? "\\" : "";
    f = "";
    if (!0 === a.isOpen || !0 === a.isClose) return d + a.value;
    if ("open" === a.type) return e ? d + a.value : "(";
    if ("close" === a.type) return e ? d + a.value : ")";
    if ("comma" === a.type) return "comma" === a.prev.type ? "" : e ? a.value : "|";
    if (a.value) return a.value;
    if (a.nodes && 0 < a.ranges && (e = ec.reduce(a.nodes), d = Cc(...e, { ...b,
      wrap: !1,
      toRegex: !0
    }), 0 !== d.length)) return 1 < e.length && 1 < d.length ? `(${d})` : d;
    if (a.nodes) for (let b of a.nodes) f += c(b, a);
    return f;
  };

  return c(a);
};

let Ec = (a = "", b = "", c = !1) => {
  let d = [];
  a = [].concat(a);
  b = [].concat(b);
  if (!b.length) return a;
  if (!a.length) return c ? ec.flatten(b).map(a => `{${a}}`) : b;

  for (let f of a) if (Array.isArray(f)) for (let a of f) d.push(Ec(a, b, c));else for (let a of b) !0 === c && "string" === typeof a && (a = `{${a}}`), d.push(Array.isArray(a) ? Ec(f, a, c) : f + a);

  return ec.flatten(d);
};

var Fc = (a, b = {}) => {
  let c = void 0 === b.rangeLimit ? 1E3 : b.rangeLimit,
      d = (a, e = {}) => {
    a.queue = [];
    var g = e;

    for (e = e.queue; "brace" !== g.type && "root" !== g.type && g.parent;) g = g.parent, e = g.queue;

    if (a.invalid || a.dollar) e.push(Ec(e.pop(), fc(a, b)));else if ("brace" === a.type && !0 !== a.invalid && 2 === a.nodes.length) e.push(Ec(e.pop(), ["{}"]));else if (a.nodes && 0 < a.ranges) {
      g = ec.reduce(a.nodes);
      if (ec.exceedsLimit(...g, b.step, c)) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
      g = Cc(...g, b);
      0 === g.length && (g = fc(a, b));
      e.push(Ec(e.pop(), g));
      a.nodes = [];
    } else {
      g = ec.encloseBrace(a);

      for (var f = a.queue, k = a; "brace" !== k.type && "root" !== k.type && k.parent;) k = k.parent, f = k.queue;

      for (k = 0; k < a.nodes.length; k++) {
        let b = a.nodes[k];
        "comma" === b.type && "brace" === a.type ? (1 === k && f.push(""), f.push("")) : "close" === b.type ? e.push(Ec(e.pop(), f, g)) : b.value && "open" !== b.type ? f.push(Ec(f.pop(), b.value)) : b.nodes && d(b, a);
      }

      return f;
    }
  };

  return ec.flatten(d(a));
};

let {
  MAX_LENGTH: Gc,
  CHAR_BACKSLASH: Hc,
  CHAR_BACKTICK: Ic,
  CHAR_COMMA: Jc,
  CHAR_DOT: Kc,
  CHAR_LEFT_PARENTHESES: Lc,
  CHAR_RIGHT_PARENTHESES: Mc,
  CHAR_LEFT_CURLY_BRACE: Nc,
  CHAR_RIGHT_CURLY_BRACE: Oc,
  CHAR_LEFT_SQUARE_BRACKET: Pc,
  CHAR_RIGHT_SQUARE_BRACKET: Qc,
  CHAR_DOUBLE_QUOTE: Rc,
  CHAR_SINGLE_QUOTE: Sc,
  CHAR_NO_BREAK_SPACE: Tc,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: Uc
} = {
  MAX_LENGTH: 65536,
  CHAR_0: "0",
  CHAR_9: "9",
  CHAR_UPPERCASE_A: "A",
  CHAR_LOWERCASE_A: "a",
  CHAR_UPPERCASE_Z: "Z",
  CHAR_LOWERCASE_Z: "z",
  CHAR_LEFT_PARENTHESES: "(",
  CHAR_RIGHT_PARENTHESES: ")",
  CHAR_ASTERISK: "*",
  CHAR_AMPERSAND: "&",
  CHAR_AT: "@",
  CHAR_BACKSLASH: "\\",
  CHAR_BACKTICK: "`",
  CHAR_CARRIAGE_RETURN: "\r",
  CHAR_CIRCUMFLEX_ACCENT: "^",
  CHAR_COLON: ":",
  CHAR_COMMA: ",",
  CHAR_DOLLAR: "$",
  CHAR_DOT: ".",
  CHAR_DOUBLE_QUOTE: '"',
  CHAR_EQUAL: "=",
  CHAR_EXCLAMATION_MARK: "!",
  CHAR_FORM_FEED: "\f",
  CHAR_FORWARD_SLASH: "/",
  CHAR_HASH: "#",
  CHAR_HYPHEN_MINUS: "-",
  CHAR_LEFT_ANGLE_BRACKET: "<",
  CHAR_LEFT_CURLY_BRACE: "{",
  CHAR_LEFT_SQUARE_BRACKET: "[",
  CHAR_LINE_FEED: "\n",
  CHAR_NO_BREAK_SPACE: "\u00a0",
  CHAR_PERCENT: "%",
  CHAR_PLUS: "+",
  CHAR_QUESTION_MARK: "?",
  CHAR_RIGHT_ANGLE_BRACKET: ">",
  CHAR_RIGHT_CURLY_BRACE: "}",
  CHAR_RIGHT_SQUARE_BRACKET: "]",
  CHAR_SEMICOLON: ";",
  CHAR_SINGLE_QUOTE: "'",
  CHAR_SPACE: " ",
  CHAR_TAB: "\t",
  CHAR_UNDERSCORE: "_",
  CHAR_VERTICAL_LINE: "|",
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\ufeff"
};

var Vc = (a, b = {}) => {
  if ("string" !== typeof a) throw new TypeError("Expected a string");
  var c = b || {};
  c = "number" === typeof c.maxLength ? Math.min(Gc, c.maxLength) : Gc;
  if (a.length > c) throw new SyntaxError(`Input length (${a.length}), exceeds max characters (${c})`);
  c = {
    type: "root",
    input: a,
    nodes: []
  };
  let d = [c],
      f = c,
      e = c,
      g = 0,
      h = a.length,
      k = 0,
      q = 0,
      m;

  const r = a => {
    "text" === a.type && "dot" === e.type && (e.type = "text");
    if (e && "text" === e.type && "text" === a.type) e.value += a.value;else return f.nodes.push(a), a.parent = f, a.prev = e, e = a;
  };

  for (r({
    type: "bos"
  }); k < h;) if (f = d[d.length - 1], m = a[k++], m !== Uc && m !== Tc) if (m === Hc) r({
    type: "text",
    value: (b.keepEscaping ? m : "") + a[k++]
  });else if (m === Qc) r({
    type: "text",
    value: "\\" + m
  });else if (m === Pc) {
    g++;
    let b;

    for (; k < h && (b = a[k++]);) if (m += b, b === Pc) g++;else if (b === Hc) m += a[k++];else if (b === Qc && (g--, 0 === g)) break;

    r({
      type: "text",
      value: m
    });
  } else if (m === Lc) f = r({
    type: "paren",
    nodes: []
  }), d.push(f), r({
    type: "text",
    value: m
  });else if (m === Mc) "paren" !== f.type ? r({
    type: "text",
    value: m
  }) : (f = d.pop(), r({
    type: "text",
    value: m
  }), f = d[d.length - 1]);else if (m === Rc || m === Sc || m === Ic) {
    var u = m;
    let c;

    for (!0 !== b.keepQuotes && (m = ""); k < h && (c = a[k++]);) if (c === Hc) m += c + a[k++];else {
      if (c === u) {
        !0 === b.keepQuotes && (m += c);
        break;
      }

      m += c;
    }

    r({
      type: "text",
      value: m
    });
  } else m === Nc ? (q++, u = {
    type: "brace",
    open: !0,
    close: !1,
    dollar: e.value && "$" === e.value.slice(-1) || !0 === f.dollar,
    depth: q,
    commas: 0,
    ranges: 0,
    nodes: []
  }, f = r(u), d.push(f), r({
    type: "open",
    value: m
  })) : m === Oc ? "brace" !== f.type ? r({
    type: "text",
    value: m
  }) : (f = d.pop(), f.close = !0, r({
    type: "close",
    value: m
  }), q--, f = d[d.length - 1]) : m === Jc && 0 < q ? (0 < f.ranges && (f.ranges = 0, u = f.nodes.shift(), f.nodes = [u, {
    type: "text",
    value: fc(f)
  }]), r({
    type: "comma",
    value: m
  }), f.commas++) : m === Kc && 0 < q && 0 === f.commas ? (u = f.nodes, 0 === q || 0 === u.length ? r({
    type: "text",
    value: m
  }) : "dot" === e.type ? (f.range = [], e.value += m, e.type = "range", 3 !== f.nodes.length && 5 !== f.nodes.length ? (f.invalid = !0, f.ranges = 0, e.type = "text") : (f.ranges++, f.args = [])) : "range" === e.type ? (u.pop(), u = u[u.length - 1], u.value += e.value + m, e = u, f.ranges--) : r({
    type: "dot",
    value: m
  })) : r({
    type: "text",
    value: m
  });

  do f = d.pop(), "root" !== f.type && (f.nodes.forEach(a => {
    a.nodes || ("open" === a.type && (a.isOpen = !0), "close" === a.type && (a.isClose = !0), a.nodes || (a.type = "text"), a.invalid = !0);
  }), a = d[d.length - 1], b = a.nodes.indexOf(f), a.nodes.splice(b, 1, ...f.nodes)); while (0 < d.length);

  r({
    type: "eos"
  });
  return c;
};

let N = (a, b = {}) => {
  let c = [];
  if (Array.isArray(a)) for (let d of a) a = N.create(d, b), Array.isArray(a) ? c.push(...a) : c.push(a);else c = [].concat(N.create(a, b));
  b && !0 === b.expand && !0 === b.nodupes && (c = [...new Set(c)]);
  return c;
};

N.parse = (a, b = {}) => Vc(a, b);

N.stringify = (a, b = {}) => "string" === typeof a ? fc(N.parse(a, b), b) : fc(a, b);

N.compile = (a, b = {}) => {
  "string" === typeof a && (a = N.parse(a, b));
  return Dc(a, b);
};

N.expand = (a, b = {}) => {
  "string" === typeof a && (a = N.parse(a, b));
  a = Fc(a, b);
  !0 === b.noempty && (a = a.filter(Boolean));
  !0 === b.nodupes && (a = [...new Set(a)]);
  return a;
};

N.create = (a, b = {}) => "" === a || 3 > a.length ? [a] : !0 !== b.expand ? N.compile(a, b) : N.expand(a, b);

var Wc = N;
let Xc = new Set("3dm 3ds 3g2 3gp 7z a aac adp ai aif aiff alz ape apk appimage ar arj asf au avi bak baml bh bin bk bmp btif bz2 bzip2 cab caf cgm class cmx cpio cr2 cur dat dcm deb dex djvu dll dmg dng doc docm docx dot dotm dra DS_Store dsk dts dtshd dvb dwg dxf ecelp4800 ecelp7470 ecelp9600 egg eol eot epub exe f4v fbs fh fla flac flatpak fli flv fpx fst fvt g3 gh gif graffle gz gzip h261 h263 h264 icns ico ief img ipa iso jar jpeg jpg jpgv jpm jxr key ktx lha lib lvp lz lzh lzma lzo m3u m4a m4v mar mdi mht mid midi mj2 mka mkv mmr mng mobi mov movie mp3 mp4 mp4a mpeg mpg mpga mxu nef npx numbers nupkg o oga ogg ogv otf pages pbm pcx pdb pdf pea pgm pic png pnm pot potm potx ppa ppam ppm pps ppsm ppsx ppt pptm pptx psd pya pyc pyo pyv qt rar ras raw resources rgb rip rlc rmf rmvb rpm rtf rz s3m s7z scpt sgi shar snap sil sketch slk smv snk so stl suo sub swf tar tbz tbz2 tga tgz thmx tif tiff tlz ttc ttf txz udf uvh uvi uvm uvp uvs uvu viv vob war wav wax wbmp wdp weba webm webp whl wim wm wma wmv wmx woff woff2 wrm wvx xbm xif xla xlam xls xlsb xlsm xlsx xlt xltm xltx xm xmind xpi xpm xwd xz z zip zipx".split(" "));
var Yc = t(function (a, b) {
  ({
    sep: a
  } = sysPath);
  let {
    platform: c
  } = process;
  b.EV_ALL = "all";
  b.EV_READY = "ready";
  b.EV_ADD = "add";
  b.EV_CHANGE = "change";
  b.EV_ADD_DIR = "addDir";
  b.EV_UNLINK = "unlink";
  b.EV_UNLINK_DIR = "unlinkDir";
  b.EV_RAW = "raw";
  b.EV_ERROR = "error";
  b.STR_DATA = "data";
  b.STR_END = "end";
  b.STR_CLOSE = "close";
  b.FSEVENT_CREATED = "created";
  b.FSEVENT_MODIFIED = "modified";
  b.FSEVENT_DELETED = "deleted";
  b.FSEVENT_MOVED = "moved";
  b.FSEVENT_CLONED = "cloned";
  b.FSEVENT_UNKNOWN = "unknown";
  b.FSEVENT_TYPE_FILE = "file";
  b.FSEVENT_TYPE_DIRECTORY = "directory";
  b.FSEVENT_TYPE_SYMLINK = "symlink";
  b.KEY_LISTENERS = "listeners";
  b.KEY_ERR = "errHandlers";
  b.KEY_RAW = "rawEmitters";
  b.HANDLER_KEYS = [b.KEY_LISTENERS, b.KEY_ERR, b.KEY_RAW];
  b.DOT_SLASH = `.${a}`;
  b.BACK_SLASH_RE = /\\/g;
  b.DOUBLE_SLASH_RE = /\/\//;
  b.SLASH_OR_BACK_SLASH_RE = /[/\\]/;
  b.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
  b.REPLACER_RE = /^\.[/\\]/;
  b.SLASH = "/";
  b.BRACE_START = "{";
  b.BANG = "!";
  b.ONE_DOT = ".";
  b.TWO_DOTS = "..";
  b.STAR = "*";
  b.GLOBSTAR = "**";
  b.ROOT_GLOBSTAR = "/**/*";
  b.SLASH_GLOBSTAR = "/**";
  b.DIR_SUFFIX = "Dir";
  b.ANYMATCH_OPTS = {
    dot: !0
  };
  b.STRING_TYPE = "string";
  b.FUNCTION_TYPE = "function";
  b.EMPTY_STR = "";

  b.EMPTY_FN = () => {};

  b.IDENTITY_FN = a => a;

  b.isWindows = "win32" === c;
  b.isMacos = "darwin" === c;
});

let {
  promisify: Zc
} = require$$0$3,
    {
  isWindows: $c,
  EMPTY_FN: ad,
  EMPTY_STR: bd,
  KEY_LISTENERS: cd,
  KEY_ERR: dd,
  KEY_RAW: ed,
  HANDLER_KEYS: fd,
  EV_CHANGE: gd,
  EV_ADD: hd,
  EV_ADD_DIR: id,
  EV_ERROR: jd,
  STR_DATA: kd,
  STR_END: ld,
  BRACE_START: md,
  STAR: nd
} = Yc,
    od = Zc(fs.open),
    pd = Zc(fs.stat),
    qd = Zc(fs.lstat),
    rd = Zc(fs.close),
    sd = Zc(fs.realpath),
    td = {
  lstat: qd,
  stat: pd
},
    ud = (a, b) => {
  a instanceof Set ? a.forEach(b) : b(a);
},
    vd = (a, b, c) => {
  let d = a[b];
  d instanceof Set || (a[b] = d = new Set([d]));
  d.add(c);
},
    wd = a => b => {
  const c = a[b];
  c instanceof Set ? c.clear() : delete a[b];
},
    xd = (a, b, c) => {
  const d = a[b];
  d instanceof Set ? d.delete(c) : d === c && delete a[b];
},
    yd = a => a instanceof Set ? 0 === a.size : !a,
    zd = new Map();

function Ad(a, b, c, d, f) {
  let e = (b, e) => {
    c(a);
    f(b, e, {
      watchedPath: a
    });
    e && a !== e && Bd(sysPath.resolve(a, e), cd, sysPath.join(a, e));
  };

  try {
    return fs.watch(a, b, e);
  } catch (g) {
    d(g);
  }
}

let Bd = (a, b, c, d, f) => {
  (a = zd.get(a)) && ud(a[b], a => {
    a(c, d, f);
  });
},
    Cd = (a, b, c, d) => {
  const {
    listener: f,
    errHandler: e,
    rawEmitter: g
  } = d;
  let h = zd.get(b);
  if (!c.persistent) return c = Ad(a, c, f, e, g), c.close.bind(c);
  if (h) vd(h, cd, f), vd(h, dd, e), vd(h, ed, g);else {
    c = Ad(a, c, Bd.bind(null, b, cd), e, Bd.bind(null, b, ed));
    if (!c) return;
    c.on(jd, async c => {
      const e = Bd.bind(null, b, dd);
      h.watcherUnusable = !0;
      if ($c && "EPERM" === c.code) try {
        const b = await od(a, "r");
        await rd(b);
        e(c);
      } catch (m) {} else e(c);
    });
    h = {
      listeners: f,
      errHandlers: e,
      rawEmitters: g,
      watcher: c
    };
    zd.set(b, h);
  }
  return () => {
    xd(h, cd, f);
    xd(h, dd, e);
    xd(h, ed, g);
    yd(h.listeners) && (h.watcher.close(), zd.delete(b), fd.forEach(wd(h)), h.watcher = void 0, Object.freeze(h));
  };
},
    Dd = new Map(),
    Ed = (a, b, c, d) => {
  const {
    listener: f,
    rawEmitter: e
  } = d;
  let g = Dd.get(b);
  new Set();
  new Set();
  (d = g && g.options) && (d.persistent < c.persistent || d.interval > c.interval) && (fs.unwatchFile(b), g = void 0);
  g ? (vd(g, cd, f), vd(g, ed, e)) : (g = {
    listeners: f,
    rawEmitters: e,
    options: c,
    watcher: fs.watchFile(b, c, (c, e) => {
      ud(g.rawEmitters, a => {
        a(gd, b, {
          curr: c,
          prev: e
        });
      });
      const d = c.mtimeMs;
      (c.size !== e.size || d > e.mtimeMs || 0 === d) && ud(g.listeners, b => b(a, c));
    })
  }, Dd.set(b, g));
  return () => {
    xd(g, cd, f);
    xd(g, ed, e);
    yd(g.listeners) && (Dd.delete(b), fs.unwatchFile(b), g.options = g.watcher = void 0, Object.freeze(g));
  };
};

class Fd {
  constructor(a) {
    this.fsw = a;

    this._boundHandleError = b => a._handleError(b);
  }

  _watchWithNodeFs(a, b) {
    let c = this.fsw.options;
    var d = sysPath.dirname(a);
    let f = sysPath.basename(a);

    this.fsw._getWatchedDir(d).add(f);

    d = sysPath.resolve(a);
    let e = {
      persistent: c.persistent
    };
    b || (b = ad);
    c.usePolling ? (e.interval = c.enableBinaryInterval && Xc.has(sysPath.extname(f).slice(1).toLowerCase()) ? c.binaryInterval : c.interval, a = Ed(a, d, e, {
      listener: b,
      rawEmitter: this.fsw._emitRaw
    })) : a = Cd(a, d, e, {
      listener: b,
      errHandler: this._boundHandleError,
      rawEmitter: this.fsw._emitRaw
    });
    return a;
  }

  _handleFile(a, b, c) {
    if (!this.fsw.closed) {
      var d = sysPath.dirname(a),
          f = sysPath.basename(a),
          e = this.fsw._getWatchedDir(d),
          g = b;

      if (!e.has(f)) {
        var h = this._watchWithNodeFs(a, async (b, c) => {
          if (this.fsw._throttle("watch", a, 5)) if (c && 0 !== c.mtimeMs) e.has(f) && (b = c.atimeMs, h = c.mtimeMs, (!b || b <= h || h !== g.mtimeMs) && this.fsw._emit(gd, a, c), g = c);else try {
            const b = await pd(a);

            if (!this.fsw.closed) {
              var h = b.atimeMs,
                  k = b.mtimeMs;
              (!h || h <= k || k !== g.mtimeMs) && this.fsw._emit(gd, a, b);
              g = b;
            }
          } catch (u) {
            this.fsw._remove(d, f);
          }
        });

        if ((!c || !this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(a)) {
          if (!this.fsw._throttle(hd, a, 0)) return;

          this.fsw._emit(hd, a, b);
        }

        return h;
      }
    }
  }

  async _handleSymlink(a, b, c, d) {
    if (!this.fsw.closed) {
      var f = a.fullPath;
      b = this.fsw._getWatchedDir(b);

      if (!this.fsw.options.followSymlinks) {
        this.fsw._incrReadyCount();

        let e = await sd(c);
        if (this.fsw.closed) return;
        b.has(d) ? this.fsw._symlinkPaths.get(f) !== e && (this.fsw._symlinkPaths.set(f, e), this.fsw._emit(gd, c, a.stats)) : (b.add(d), this.fsw._symlinkPaths.set(f, e), this.fsw._emit(hd, c, a.stats));

        this.fsw._emitReady();

        return !0;
      }

      if (this.fsw._symlinkPaths.has(f)) return !0;

      this.fsw._symlinkPaths.set(f, !0);
    }
  }

  _handleRead(a, b, c, d, f, e, g) {
    a = sysPath.join(a, bd);
    if (!c.hasGlob && (g = this.fsw._throttle("readdir", a, 1E3), !g)) return;

    let h = this.fsw._getWatchedDir(c.path),
        k = new Set(),
        q = this.fsw._readdirp(a, {
      fileFilter: a => c.filterPath(a),
      directoryFilter: a => c.filterDir(a),
      depth: 0
    }).on(kd, async g => {
      if (this.fsw.closed) q = void 0;else {
        var m = g.path,
            u = sysPath.join(a, m);
        k.add(m);
        if (!g.stats.isSymbolicLink() || !(await this._handleSymlink(g, a, u, m))) if (this.fsw.closed) q = void 0;else if (m === d || !d && !h.has(m)) this.fsw._incrReadyCount(), u = sysPath.join(f, sysPath.relative(f, u)), this._addToNodeFs(u, b, c, e + 1);
      }
    }).on(jd, this._boundHandleError);

    return new Promise(b => q.once(ld, () => {
      if (this.fsw.closed) q = void 0;else {
        var m = g ? g.clear() : !1;
        b();
        h.getChildren().filter(b => b !== a && !k.has(b) && (!c.hasGlob || c.filterPath({
          fullPath: sysPath.resolve(a, b)
        }))).forEach(b => {
          this.fsw._remove(a, b);
        });
        q = void 0;
        m && this._handleRead(a, !1, c, d, f, e, g);
      }
    }));
  }

  async _handleDir(a, b, c, d, f, e, g) {
    let h = this.fsw._getWatchedDir(sysPath.dirname(a)),
        k = h.has(sysPath.basename(a));

    c && this.fsw.options.ignoreInitial || f || k || (!e.hasGlob || e.globFilter(a)) && this.fsw._emit(id, a, b);
    h.add(sysPath.basename(a));

    this.fsw._getWatchedDir(a);

    let q;
    b = this.fsw.options.depth;

    if ((null == b || d <= b) && !this.fsw._symlinkPaths.has(g)) {
      if (!f && (await this._handleRead(a, c, e, f, a, d, void 0), this.fsw.closed)) return;
      q = this._watchWithNodeFs(a, (b, c) => {
        c && 0 === c.mtimeMs || this._handleRead(b, !1, e, f, a, d, void 0);
      });
    }

    return q;
  }

  async _addToNodeFs(a, b, c, d, f) {
    let e = this.fsw._emitReady;
    if (this.fsw._isIgnored(a) || this.fsw.closed) return e(), !1;

    let g = this.fsw._getWatchHelpers(a, d);

    !g.hasGlob && c && (g.hasGlob = c.hasGlob, g.globFilter = c.globFilter, g.filterPath = a => c.filterPath(a), g.filterDir = a => c.filterDir(a));

    try {
      let c = await td[g.statMethod](g.watchPath);

      if (!this.fsw.closed) {
        if (this.fsw._isIgnored(g.watchPath, c)) return e(), !1;
        var h = this.fsw.options.followSymlinks && !a.includes(nd) && !a.includes(md);

        if (c.isDirectory()) {
          let e = h ? await sd(a) : a;
          if (this.fsw.closed) return;
          var k = await this._handleDir(g.watchPath, c, b, d, f, g, e);
          if (this.fsw.closed) return;
          a !== e && void 0 !== e && this.fsw._symlinkPaths.set(e, !0);
        } else if (c.isSymbolicLink()) {
          let e = h ? await sd(a) : a;
          if (this.fsw.closed) return;
          let f = sysPath.dirname(g.watchPath);

          this.fsw._getWatchedDir(f).add(g.watchPath);

          this.fsw._emit(hd, g.watchPath, c);

          k = await this._handleDir(f, c, b, d, a, g, e);
          if (this.fsw.closed) return;
          void 0 !== e && this.fsw._symlinkPaths.set(sysPath.resolve(a), e);
        } else k = this._handleFile(g.watchPath, c, b);

        e();

        this.fsw._addPathCloser(a, k);

        return !1;
      }
    } catch (q) {
      if (this.fsw._handleError(q)) return e(), a;
    }
  }

}

var Gd = Fd;
let {
  promisify: Hd
} = require$$0$3,
    Id;

try {
  Id = require$$1$1;
} catch (a) {
  process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR && console.error(a);
}

if (Id) {
  let a = process.version.match(/v(\d+)\.(\d+)/);

  if (a && a[1] && a[2]) {
    let b = Number.parseInt(a[1], 10),
        c = Number.parseInt(a[2], 10);
    8 === b && 16 > c && (Id = void 0);
  }
}

let {
  EV_ADD: Jd,
  EV_CHANGE: Kd,
  EV_ADD_DIR: Ld,
  EV_UNLINK: Md,
  EV_ERROR: Nd,
  STR_DATA: Od,
  STR_END: Pd,
  FSEVENT_CREATED: Qd,
  FSEVENT_MODIFIED: Rd,
  FSEVENT_DELETED: Sd,
  FSEVENT_MOVED: Td,
  FSEVENT_UNKNOWN: Ud,
  FSEVENT_TYPE_FILE: Vd,
  FSEVENT_TYPE_DIRECTORY: Wd,
  FSEVENT_TYPE_SYMLINK: Xd,
  ROOT_GLOBSTAR: Yd,
  DIR_SUFFIX: Zd,
  DOT_SLASH: $d,
  FUNCTION_TYPE: ae,
  EMPTY_FN: be,
  IDENTITY_FN: ce
} = Yc,
    de = a => isNaN(a) ? {} : {
  depth: a
},
    ee = Hd(fs.stat),
    fe = Hd(fs.lstat),
    ge = Hd(fs.realpath),
    he = {
  stat: ee,
  lstat: fe
},
    ie = new Map(),
    je = new Set([69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912]),
    ke = (a, b) => ({
  stop: Id.watch(a, b)
});

function le(a, b, c, d, f) {
  let e = sysPath.extname(a) ? sysPath.dirname(a) : a,
      g = sysPath.dirname(e),
      h = ie.get(e);
  me(g) && (e = g);

  let k = sysPath.resolve(a),
      q = k !== b,
      m = (a, e, d) => {
    q && (a = a.replace(b, k));
    a !== k && a.indexOf(k + sysPath.sep) || c(a, e, d);
  };

  a = !1;

  for (let c of ie.keys()) if (0 === b.indexOf(sysPath.resolve(c) + sysPath.sep)) {
    e = c;
    h = ie.get(e);
    a = !0;
    break;
  }

  h || a ? h.listeners.add(m) : (h = {
    listeners: new Set([m]),
    rawEmitter: d,
    watcher: ke(e, (a, b) => {
      if (!f.closed) {
        var c = Id.getInfo(a, b);
        h.listeners.forEach(e => {
          e(a, b, c);
        });
        h.rawEmitter(c.event, a, c);
      }
    })
  }, ie.set(e, h));
  return () => {
    let a = h.listeners;
    a.delete(m);
    if (!a.size && (ie.delete(e), h.watcher)) return h.watcher.stop().then(() => {
      h.rawEmitter = h.watcher = void 0;
      Object.freeze(h);
    });
  };
}

let me = a => {
  let b = 0;

  for (const c of ie.keys()) if (0 === c.indexOf(a) && (b++, 10 <= b)) return !0;

  return !1;
},
    ne = (a, b) => {
  let c = 0;

  for (; !a.indexOf(b) && (a = sysPath.dirname(a)) !== b;) c++;

  return c;
},
    oe = (a, b) => a.type === Wd && b.isDirectory() || a.type === Xd && b.isSymbolicLink() || a.type === Vd && b.isFile();

class pe {
  constructor(a) {
    this.fsw = a;
  }

  checkIgnored(a, b) {
    let c = this.fsw._ignoredPaths;
    if (this.fsw._isIgnored(a, b)) return c.add(a), b && b.isDirectory() && c.add(a + Yd), !0;
    c.delete(a);
    c.delete(a + Yd);
  }

  addOrChange(a, b, c, d, f, e, g, h) {
    let k = f.has(e) ? Kd : Jd;
    this.handleEvent(k, a, b, c, d, f, e, g, h);
  }

  async checkExists(a, b, c, d, f, e, g, h) {
    try {
      let k = await ee(a);
      this.fsw.closed || this.fsw.closed || (oe(g, k) ? this.addOrChange(a, b, c, d, f, e, g, h) : this.handleEvent(Md, a, b, c, d, f, e, g, h));
    } catch (k) {
      "EACCES" === k.code ? this.addOrChange(a, b, c, d, f, e, g, h) : this.handleEvent(Md, a, b, c, d, f, e, g, h);
    }
  }

  handleEvent(a, b, c, d, f, e, g, h, k) {
    if (!this.fsw.closed && !this.checkIgnored(b)) if (a === Md) ((b = h.type === Wd) || e.has(g)) && this.fsw._remove(f, g, b);else {
      if (a === Jd) {
        h.type === Wd && this.fsw._getWatchedDir(b);
        if (h.type === Xd && k.followSymlinks) return f = void 0 === k.depth ? void 0 : ne(c, d) + 1, this._addToFsEvents(b, !1, !0, f);

        this.fsw._getWatchedDir(f).add(g);
      }

      f = h.type === Wd ? a + Zd : a;

      this.fsw._emit(f, b);

      f === Ld && this._addToFsEvents(b, !1, !0);
    }
  }

  _watchWithFsEvents(a, b, c, d) {
    if (!this.fsw.closed && !this.fsw._isIgnored(a)) {
      var f = this.fsw.options,
          e = le(a, b, async (e, h, k) => {
        if (!(this.fsw.closed || void 0 !== f.depth && ne(e, b) > f.depth)) {
          var g = c(sysPath.join(a, sysPath.relative(a, e)));

          if (!d || d(g)) {
            var m = sysPath.dirname(g),
                r = sysPath.basename(g),
                u = this.fsw._getWatchedDir(k.type === Wd ? g : m);

            if (je.has(h) || k.event === Ud) {
              if (typeof f.ignored === ae) {
                let a;

                try {
                  a = await ee(g);
                } catch (A) {}

                this.fsw.closed || this.checkIgnored(g, a) || (oe(k, a) ? this.addOrChange(g, e, b, m, u, r, k, f) : this.handleEvent(Md, g, e, b, m, u, r, k, f));
              } else this.checkExists(g, e, b, m, u, r, k, f);
            } else switch (k.event) {
              case Qd:
              case Rd:
                return this.addOrChange(g, e, b, m, u, r, k, f);

              case Sd:
              case Td:
                return this.checkExists(g, e, b, m, u, r, k, f);
            }
          }
        }
      }, this.fsw._emitRaw, this.fsw);

      this.fsw._emitReady();

      return e;
    }
  }

  async _handleFsEventsSymlink(a, b, c, d) {
    if (!this.fsw.closed && !this.fsw._symlinkPaths.has(b)) {
      this.fsw._symlinkPaths.set(b, !0);

      this.fsw._incrReadyCount();

      try {
        let b = await ge(a);

        if (!this.fsw.closed) {
          if (this.fsw._isIgnored(b)) return this.fsw._emitReady();

          this.fsw._incrReadyCount();

          this._addToFsEvents(b || a, e => {
            let d = a;
            b && b !== $d ? d = e.replace(b, a) : e !== $d && (d = sysPath.join(a, e));
            return c(d);
          }, !1, d);
        }
      } catch (f) {
        if (this.fsw._handleError(f)) return this.fsw._emitReady();
      }
    }
  }

  emitAdd(a, b, c, d, f) {
    a = c(a);
    c = b.isDirectory();

    let e = this.fsw._getWatchedDir(sysPath.dirname(a)),
        g = sysPath.basename(a);

    c && this.fsw._getWatchedDir(a);
    e.has(g) || (e.add(g), d.ignoreInitial && !0 !== f || this.fsw._emit(c ? Ld : Jd, a, b));
  }

  initWatch(a, b, c, d) {
    this.fsw.closed || (a = this._watchWithFsEvents(c.watchPath, sysPath.resolve(a || c.watchPath), d, c.globFilter), this.fsw._addPathCloser(b, a));
  }

  async _addToFsEvents(a, b, c, d) {
    if (!this.fsw.closed) {
      var f = this.fsw.options,
          e = typeof b === ae ? b : ce,
          g = this.fsw._getWatchHelpers(a);

      try {
        let b = await he[g.statMethod](g.watchPath);
        if (this.fsw.closed) return;
        if (this.fsw._isIgnored(g.watchPath, b)) throw null;

        if (b.isDirectory()) {
          g.globFilter || this.emitAdd(e(a), b, e, f, c);
          if (d && d > f.depth) return;

          this.fsw._readdirp(g.watchPath, {
            fileFilter: a => g.filterPath(a),
            directoryFilter: a => g.filterDir(a),
            ...de(f.depth - (d || 0))
          }).on(Od, a => {
            if (!this.fsw.closed && (!a.stats.isDirectory() || g.filterPath(a))) {
              var b = sysPath.join(g.watchPath, a.path),
                  {
                fullPath: d
              } = a;
              g.followSymlinks && a.stats.isSymbolicLink() ? (a = void 0 === f.depth ? void 0 : ne(b, sysPath.resolve(g.watchPath)) + 1, this._handleFsEventsSymlink(b, d, e, a)) : this.emitAdd(b, a.stats, e, f, c);
            }
          }).on(Nd, be).on(Pd, () => {
            this.fsw._emitReady();
          });
        } else this.emitAdd(g.watchPath, b, e, f, c), this.fsw._emitReady();
      } catch (h) {
        if (!h || this.fsw._handleError(h)) this.fsw._emitReady(), this.fsw._emitReady();
      }

      if (f.persistent && !0 !== c) if (typeof b === ae) this.initWatch(void 0, a, g, e);else {
        let b;

        try {
          b = await ge(g.watchPath);
        } catch (k) {}

        this.initWatch(b, a, g, e);
      }
    }
  }

}

var qe = pe;

qe.canUse = () => Id && 128 > ie.size;

let {
  EventEmitter: re
} = require$$0$2,
    {
  promisify: se
} = require$$0$3,
    te = Tb.default,
    {
  EV_ALL: ue,
  EV_READY: ve,
  EV_ADD: we,
  EV_CHANGE: xe,
  EV_UNLINK: ye,
  EV_ADD_DIR: Be,
  EV_UNLINK_DIR: Ce,
  EV_RAW: De,
  EV_ERROR: Ee,
  STR_CLOSE: Fe,
  STR_END: Ge,
  BACK_SLASH_RE: He,
  DOUBLE_SLASH_RE: Ie,
  SLASH_OR_BACK_SLASH_RE: Je,
  DOT_RE: Ke,
  REPLACER_RE: Le,
  SLASH: Me,
  BRACE_START: Ne,
  BANG: Oe,
  ONE_DOT: Pe,
  TWO_DOTS: Qe,
  GLOBSTAR: Re,
  SLASH_GLOBSTAR: Se,
  ANYMATCH_OPTS: Te,
  STRING_TYPE: Ue,
  FUNCTION_TYPE: Ve,
  EMPTY_STR: We,
  EMPTY_FN: Xe,
  isWindows: Ye,
  isMacos: Ze
} = Yc,
    $e = se(fs.stat),
    af = se(fs.readdir),
    bf = (a = []) => Array.isArray(a) ? a : [a],
    cf = (a, b = []) => {
  a.forEach(a => {
    Array.isArray(a) ? cf(a, b) : b.push(a);
  });
  return b;
},
    ef = a => {
  a = cf(bf(a));
  if (!a.every(a => typeof a === Ue)) throw new TypeError(`Non-string provided as watch path: ${a}`);
  return a.map(df);
},
    ff = a => {
  for (a = a.replace(He, Me); a.match(Ie);) a = a.replace(Ie, Me);

  return a;
},
    df = a => ff(sysPath.normalize(ff(a))),
    gf = (a = We) => b => typeof b !== Ue ? b : ff(sysPath.normalize(ff(sysPath.isAbsolute(b) ? b : sysPath.join(a, b))));

class hf {
  constructor(a, b) {
    this.path = a;
    this._removeWatcher = b;
    this.items = new Set();
  }

  add(a) {
    let {
      items: b
    } = this;
    b && a !== Pe && a !== Qe && b.add(a);
  }

  async remove(a) {
    let {
      items: b
    } = this;

    if (b && (b.delete(a), !(0 < b.size))) {
      a = this.path;

      try {
        await af(a);
      } catch (c) {
        this._removeWatcher && this._removeWatcher(sysPath.dirname(a), sysPath.basename(a));
      }
    }
  }

  has(a) {
    let {
      items: b
    } = this;
    if (b) return b.has(a);
  }

  getChildren() {
    let {
      items: a
    } = this;
    if (a) return [...a.values()];
  }

  dispose() {
    this.items.clear();
    delete this.path;
    delete this._removeWatcher;
    delete this.items;
    Object.freeze(this);
  }

}

class jf {
  constructor(a, b, c, d) {
    this.fsw = d;
    this.path = a = a.replace(Le, We);
    this.watchPath = b;
    this.fullWatchPath = sysPath.resolve(b);
    this.hasGlob = b !== a;
    a === We && (this.hasGlob = !1);
    this.globSymlink = this.hasGlob && c ? void 0 : !1;
    this.globFilter = this.hasGlob ? te(a, void 0, Te) : !1;
    this.dirParts = this.getDirParts(a);
    this.dirParts.forEach(a => {
      1 < a.length && a.pop();
    });
    this.statMethod = (this.followSymlinks = c) ? "stat" : "lstat";
  }

  checkGlobSymlink(a) {
    void 0 === this.globSymlink && (this.globSymlink = a.fullParentDir === this.fullWatchPath ? !1 : {
      realPath: a.fullParentDir,
      linkPath: this.fullWatchPath
    });
    return this.globSymlink ? a.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath) : a.fullPath;
  }

  entryPath(a) {
    return sysPath.join(this.watchPath, sysPath.relative(this.watchPath, this.checkGlobSymlink(a)));
  }

  filterPath(a) {
    let {
      stats: b
    } = a;
    if (b && b.isSymbolicLink()) return this.filterDir(a);
    a = this.entryPath(a);
    return (this.hasGlob && typeof this.globFilter === Ve ? this.globFilter(a) : !0) && this.fsw._isntIgnored(a, b) && this.fsw._hasReadPermissions(b);
  }

  getDirParts(a) {
    if (!this.hasGlob) return [];
    let b = [];
    (a.includes(Ne) ? Wc.expand(a) : [a]).forEach(a => {
      b.push(sysPath.relative(this.watchPath, a).split(Je));
    });
    return b;
  }

  filterDir(a) {
    if (this.hasGlob) {
      let b = this.getDirParts(this.checkGlobSymlink(a)),
          c = !1;
      this.unmatchedGlob = !this.dirParts.some(a => a.every((a, e) => {
        a === Re && (c = !0);
        return c || !b[0][e] || te(a, b[0][e], Te);
      }));
    }

    return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(a), a.stats);
  }

}

class kf extends re {
  constructor(a) {
    super();
    let b = {};
    a && Object.assign(b, a);
    this._watched = new Map();
    this._closers = new Map();
    this._ignoredPaths = new Set();
    this._throttled = new Map();
    this._symlinkPaths = new Map();
    this._streams = new Set();
    this.closed = !1;
    void 0 === b.persistent && (b.persistent = !0);
    void 0 === b.ignoreInitial && (b.ignoreInitial = !1);
    void 0 === b.ignorePermissionErrors && (b.ignorePermissionErrors = !1);
    void 0 === b.interval && (b.interval = 100);
    void 0 === b.binaryInterval && (b.binaryInterval = 300);
    void 0 === b.disableGlobbing && (b.disableGlobbing = !1);
    b.enableBinaryInterval = b.binaryInterval !== b.interval;
    void 0 === b.useFsEvents && (b.useFsEvents = !b.usePolling);
    qe.canUse() || (b.useFsEvents = !1);
    void 0 !== b.usePolling || b.useFsEvents || (b.usePolling = Ze);
    a = process.env.CHOKIDAR_USEPOLLING;
    void 0 !== a && (a = a.toLowerCase(), b.usePolling = "false" === a || "0" === a ? !1 : "true" === a || "1" === a ? !0 : !!a);
    if (a = process.env.CHOKIDAR_INTERVAL) b.interval = Number.parseInt(a, 10);
    void 0 === b.atomic && (b.atomic = !b.usePolling && !b.useFsEvents);
    b.atomic && (this._pendingUnlinks = new Map());
    void 0 === b.followSymlinks && (b.followSymlinks = !0);
    void 0 === b.awaitWriteFinish && (b.awaitWriteFinish = !1);
    !0 === b.awaitWriteFinish && (b.awaitWriteFinish = {});
    if (a = b.awaitWriteFinish) a.stabilityThreshold || (a.stabilityThreshold = 2E3), a.pollInterval || (a.pollInterval = 100), this._pendingWrites = new Map();
    b.ignored && (b.ignored = bf(b.ignored));
    let c = 0;

    this._emitReady = () => {
      c++;
      c >= this._readyCount && (this._emitReady = Xe, this._readyEmitted = !0, process.nextTick(() => this.emit(ve)));
    };

    this._emitRaw = (...a) => this.emit(De, ...a);

    this._readyEmitted = !1;
    this.options = b;
    b.useFsEvents ? this._fsEventsHandler = new qe(this) : this._nodeFsHandler = new Gd(this);
    Object.freeze(b);
  }

  add(a, b, c) {
    let {
      cwd: d,
      disableGlobbing: f
    } = this.options;
    this.closed = !1;
    a = ef(a);
    d && (a = a.map(a => {
      var b = sysPath.isAbsolute(a) ? a : a.startsWith(Oe) ? Oe + sysPath.join(d, a.slice(1)) : sysPath.join(d, a);
      return f || !Yb(a) ? b : Sb(b);
    }));
    a = a.filter(a => {
      if (a.startsWith(Oe)) return this._ignoredPaths.add(a.slice(1)), !1;

      this._ignoredPaths.delete(a);

      this._ignoredPaths.delete(a + Se);

      this._userIgnored = void 0;
      return !0;
    });
    this.options.useFsEvents && this._fsEventsHandler ? (this._readyCount || (this._readyCount = a.length), this.options.persistent && (this._readyCount *= 2), a.forEach(a => this._fsEventsHandler._addToFsEvents(a))) : (this._readyCount || (this._readyCount = 0), this._readyCount += a.length, Promise.all(a.map(async a => {
      (a = await this._nodeFsHandler._addToNodeFs(a, !c, 0, 0, b)) && this._emitReady();
      return a;
    })).then(a => {
      this.closed || a.filter(a => a).forEach(a => {
        this.add(sysPath.dirname(a), sysPath.basename(b || a));
      });
    }));
    return this;
  }

  unwatch(a) {
    if (this.closed) return this;
    a = ef(a);
    let {
      cwd: b
    } = this.options;
    a.forEach(a => {
      sysPath.isAbsolute(a) || this._closers.has(a) || (b && (a = sysPath.join(b, a)), a = sysPath.resolve(a));

      this._closePath(a);

      this._ignoredPaths.add(a);

      this._watched.has(a) && this._ignoredPaths.add(a + Se);
      this._userIgnored = void 0;
    });
    return this;
  }

  close() {
    if (this.closed) return this._closePromise;
    this.closed = !0;
    this.removeAllListeners();
    let a = [];

    this._closers.forEach(b => b.forEach(b => {
      b = b();
      b instanceof Promise && a.push(b);
    }));

    this._streams.forEach(a => a.destroy());

    this._userIgnored = void 0;
    this._readyCount = 0;
    this._readyEmitted = !1;

    this._watched.forEach(a => a.dispose());

    ["closers", "watched", "streams", "symlinkPaths", "throttled"].forEach(a => {
      this[`_${a}`].clear();
    });
    return this._closePromise = a.length ? Promise.all(a).then(() => {}) : Promise.resolve();
  }

  getWatched() {
    let a = {};

    this._watched.forEach((b, c) => {
      c = this.options.cwd ? sysPath.relative(this.options.cwd, c) : c;
      a[c || Pe] = b.getChildren().sort();
    });

    return a;
  }

  emitWithAll(a, b) {
    this.emit(...b);
    a !== Ee && this.emit(ue, ...b);
  }

  async _emit(a, b, c, d, f) {
    if (!this.closed) {
      var e = this.options;
      Ye && (b = sysPath.normalize(b));
      e.cwd && (b = sysPath.relative(e.cwd, b));
      var g = [a, b];
      void 0 !== f ? g.push(c, d, f) : void 0 !== d ? g.push(c, d) : void 0 !== c && g.push(c);
      d = e.awaitWriteFinish;
      var h;
      if (d && (h = this._pendingWrites.get(b))) return h.lastChange = new Date(), this;

      if (e.atomic) {
        if (a === ye) return this._pendingUnlinks.set(b, g), setTimeout(() => {
          this._pendingUnlinks.forEach((a, b) => {
            this.emit(...a);
            this.emit(ue, ...a);

            this._pendingUnlinks.delete(b);
          });
        }, "number" === typeof e.atomic ? e.atomic : 100), this;
        a === we && this._pendingUnlinks.has(b) && (a = g[0] = xe, this._pendingUnlinks.delete(b));
      }

      if (d && (a === we || a === xe) && this._readyEmitted) return this._awaitWriteFinish(b, d.stabilityThreshold, a, (b, c) => {
        b ? (a = g[0] = Ee, g[1] = b, this.emitWithAll(a, g)) : c && (2 < g.length ? g[2] = c : g.push(c), this.emitWithAll(a, g));
      }), this;
      if (a === xe && !this._throttle(xe, b, 50)) return this;

      if (e.alwaysStat && void 0 === c && (a === we || a === Be || a === xe)) {
        b = e.cwd ? sysPath.join(e.cwd, b) : b;
        let a;

        try {
          a = await $e(b);
        } catch (q) {}

        if (!a || this.closed) return;
        g.push(a);
      }

      this.emitWithAll(a, g);
      return this;
    }
  }

  _handleError(a) {
    let b = a && a.code;
    a && "ENOENT" !== b && "ENOTDIR" !== b && (!this.options.ignorePermissionErrors || "EPERM" !== b && "EACCES" !== b) && this.emit(Ee, a);
    return a || this.closed;
  }

  _throttle(a, b, c) {
    this._throttled.has(a) || this._throttled.set(a, new Map());

    let d = this._throttled.get(a);

    if (a = d.get(b)) return a.count++, !1;
    let f;

    a = () => {
      const a = d.get(b),
            c = a ? a.count : 0;
      d.delete(b);
      clearTimeout(f);
      a && clearTimeout(a.timeoutObject);
      return c;
    };

    f = setTimeout(a, c);
    c = {
      timeoutObject: f,
      clear: a,
      count: 0
    };
    d.set(b, c);
    return c;
  }

  _incrReadyCount() {
    return this._readyCount++;
  }

  _awaitWriteFinish(a, b, c, d) {
    let f,
        e = a;
    this.options.cwd && !sysPath.isAbsolute(a) && (e = sysPath.join(this.options.cwd, a));

    let g = new Date(),
        h = c => {
      fs.stat(e, (e, g) => {
        if (e || !this._pendingWrites.has(a)) e && "ENOENT" !== e.code && d(e);else {
          e = Number(new Date());
          c && g.size !== c.size && (this._pendingWrites.get(a).lastChange = e);

          var k = this._pendingWrites.get(a);

          e - k.lastChange >= b ? (this._pendingWrites.delete(a), d(void 0, g)) : f = setTimeout(h, this.options.awaitWriteFinish.pollInterval, g);
        }
      });
    };

    this._pendingWrites.has(a) || (this._pendingWrites.set(a, {
      lastChange: g,
      cancelWait: () => {
        this._pendingWrites.delete(a);

        clearTimeout(f);
        return c;
      }
    }), f = setTimeout(h, this.options.awaitWriteFinish.pollInterval));
  }

  _getGlobIgnored() {
    return [...this._ignoredPaths.values()];
  }

  _isIgnored(a, b) {
    if (this.options.atomic && Ke.test(a)) return !0;

    if (!this._userIgnored) {
      var {
        cwd: c
      } = this.options,
          d = this.options.ignored;
      d = d && d.map(gf(c));
      let a = bf(d).filter(a => typeof a === Ue && !Yb(a)).map(a => a + Se);
      c = this._getGlobIgnored().map(gf(c)).concat(d, a);
      this._userIgnored = te(c, void 0, Te);
    }

    return this._userIgnored([a, b]);
  }

  _isntIgnored(a, b) {
    return !this._isIgnored(a, b);
  }

  _getWatchHelpers(a, b) {
    if (b || this.options.disableGlobbing || !Yb(a)) b = a;else {
      b = a;
      Object.assign({
        flipBackslashes: !0
      }, void 0).flipBackslashes && $b && 0 > b.indexOf("/") && (b = b.replace(ac, "/"));
      bc.test(b) && (b += "/");
      b += "a";

      do b = Zb(b); while (Yb(b) || cc.test(b));

      b = b.replace(dc, "$1");
    }
    return new jf(a, b, this.options.followSymlinks, this);
  }

  _getWatchedDir(a) {
    this._boundRemove || (this._boundRemove = this._remove.bind(this));
    a = sysPath.resolve(a);
    this._watched.has(a) || this._watched.set(a, new hf(a, this._boundRemove));
    return this._watched.get(a);
  }

  _hasReadPermissions(a) {
    if (this.options.ignorePermissionErrors) return !0;
    a = a && Number.parseInt(a.mode, 10);
    return !!(4 & Number.parseInt((a & 511).toString(8)[0], 10));
  }

  _remove(a, b, c) {
    let d = sysPath.join(a, b),
        f = sysPath.resolve(d);
    c = null != c ? c : this._watched.has(d) || this._watched.has(f);

    if (this._throttle("remove", d, 100)) {
      c || this.options.useFsEvents || 1 !== this._watched.size || this.add(a, b, !0);

      this._getWatchedDir(d).getChildren().forEach(a => this._remove(d, a));

      var e = this._getWatchedDir(a);

      a = e.has(b);
      e.remove(b);
      b = d;
      this.options.cwd && (b = sysPath.relative(this.options.cwd, d));
      this.options.awaitWriteFinish && this._pendingWrites.has(b) && this._pendingWrites.get(b).cancelWait() === we || (this._watched.delete(d), this._watched.delete(f), c = c ? Ce : ye, a && !this._isIgnored(d) && this._emit(c, d), this.options.useFsEvents || this._closePath(d));
    }
  }

  _closePath(a) {
    var b = this._closers.get(a);

    b && (b.forEach(a => a()), this._closers.delete(a), b = sysPath.dirname(a), this._getWatchedDir(b).remove(sysPath.basename(a)));
  }

  _addPathCloser(a, b) {
    if (b) {
      var c = this._closers.get(a);

      c || (c = [], this._closers.set(a, c));
      c.push(b);
    }
  }

  _readdirp(a, b) {
    if (!this.closed) {
      var c = Rb(a, {
        type: ue,
        alwaysStat: !0,
        lstat: !0,
        ...b
      });

      this._streams.add(c);

      c.once(Fe, () => {
        c = void 0;
      });
      c.once(Ge, () => {
        c && (this._streams.delete(c), c = void 0);
      });
      return c;
    }
  }

}

var lf = {
  FSWatcher: kf,
  watch: (a, b) => {
    b = new kf(b);
    b.add(a);
    return b;
  }
};
let mf = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    nf = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    of = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    pf = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi,
    qf = new Map([["n", "\n"], ["r", "\r"], ["t", "\t"], ["b", "\b"], ["f", "\f"], ["v", "\v"], ["0", "\x00"], ["\\", "\\"], ["e", "\u001b"], ["a", "\u0007"]]);

function rf(a) {
  let b = "u" === a[0],
      c = "{" === a[1];
  return b && !c && 5 === a.length || "x" === a[0] && 3 === a.length ? String.fromCharCode(parseInt(a.slice(1), 16)) : b && c ? String.fromCodePoint(parseInt(a.slice(2, -1), 16)) : qf.get(a) || a;
}

function sf(a, b) {
  let c = [];
  b = b.trim().split(/\s*,\s*/g);

  for (let d of b) if (b = Number(d), Number.isNaN(b)) {
    if (b = d.match(of)) c.push(b[2].replace(pf, (a, b, c) => b ? rf(b) : c));else throw Error(`Invalid Chalk template style argument: ${d} (in style '${a}')`);
  } else c.push(b);

  return c;
}

function tf(a) {
  nf.lastIndex = 0;
  let b = [];

  for (var c; null !== (c = nf.exec(a));) {
    let a = c[1];
    c[2] ? (c = sf(a, c[2]), b.push([a].concat(c))) : b.push([a]);
  }

  return b;
}

function uf(a, b) {
  let c = {};

  for (let a of b) for (let b of a.styles) c[b[0]] = a.inverse ? null : b.slice(1);

  for (let [b, f] of Object.entries(c)) if (Array.isArray(f)) {
    if (!(b in a)) throw Error(`Unknown Chalk style: ${b}`);
    a = 0 < f.length ? a[b](...f) : a[b];
  }

  return a;
}

var vf = (a, b) => {
  let c = [],
      d = [],
      f = [];
  b.replace(mf, (b, g, h, k, q, m) => {
    if (g) f.push(rf(g));else if (k) b = f.join(""), f = [], d.push(0 === c.length ? b : uf(a, c)(b)), c.push({
      inverse: h,
      styles: tf(k)
    });else if (q) {
      if (0 === c.length) throw Error("Found extraneous } in Chalk template literal");
      d.push(uf(a, c)(f.join("")));
      f = [];
      c.pop();
    } else f.push(m);
  });
  d.push(f.join(""));
  if (0 < c.length) throw Error(`Chalk template literal is missing ${c.length} closing bracket${1 === c.length ? "" : "s"} (\`}\`)`);
  return d.join("");
};

let {
  stdout: wf,
  stderr: xf
} = za,
    {
  stringReplaceAll: yf,
  stringEncaseCRLFWithFirstIndex: zf
} = {
  stringReplaceAll: (a, b, c) => {
    let d = a.indexOf(b);
    if (-1 === d) return a;
    const f = b.length;
    let e = 0,
        g = "";

    do g += a.substr(e, d - e) + b + c, e = d + f, d = a.indexOf(b, e); while (-1 !== d);

    return g += a.substr(e);
  },
  stringEncaseCRLFWithFirstIndex: (a, b, c, d) => {
    let f = 0,
        e = "";

    do {
      const g = "\r" === a[d - 1];
      e += a.substr(f, (g ? d - 1 : d) - f) + b + (g ? "\r\n" : "\n") + c;
      f = d + 1;
      d = a.indexOf("\n", f);
    } while (-1 !== d);

    return e += a.substr(f);
  }
},
    Af = ["ansi", "ansi", "ansi256", "ansi16m"],
    Bf = Object.create(null),
    Cf = (a, b = {}) => {
  if (3 < b.level || 0 > b.level) throw Error("The `level` option should be an integer from 0 to 3");
  const c = wf ? wf.level : 0;
  a.level = void 0 === b.level ? c : b.level;
};

class Df {
  constructor(a) {
    return Ef(a);
  }

}

let Ef = a => {
  const b = {};
  Cf(b, a);

  b.template = (...a) => Ff(b.template, ...a);

  Object.setPrototypeOf(b, Gf.prototype);
  Object.setPrototypeOf(b.template, b);

  b.template.constructor = () => {
    throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
  };

  b.template.Instance = Df;
  return b.template;
};

function Gf(a) {
  return Ef(a);
}

for (let [a, b] of Object.entries(va)) Bf[a] = {
  get() {
    let c = Hf(this, If(b.open, b.close, this._styler), this._isEmpty);
    Object.defineProperty(this, a, {
      value: c
    });
    return c;
  }

};

Bf.visible = {
  get() {
    let a = Hf(this, this._styler, !0);
    Object.defineProperty(this, "visible", {
      value: a
    });
    return a;
  }

};
let Jf = "rgb hex keyword hsl hsv hwb ansi ansi256".split(" ");

for (let a of Jf) Bf[a] = {
  get() {
    let {
      level: b
    } = this;
    return function (...c) {
      c = If(va.color[Af[b]][a](...c), va.color.close, this._styler);
      return Hf(this, c, this._isEmpty);
    };
  }

};

for (let a of Jf) {
  let b = "bg" + a[0].toUpperCase() + a.slice(1);
  Bf[b] = {
    get() {
      let {
        level: c
      } = this;
      return function (...b) {
        b = If(va.bgColor[Af[c]][a](...b), va.bgColor.close, this._styler);
        return Hf(this, b, this._isEmpty);
      };
    }

  };
}

let Kf = Object.defineProperties(() => {}, { ...Bf,
  level: {
    enumerable: !0,

    get() {
      return this._generator.level;
    },

    set(a) {
      this._generator.level = a;
    }

  }
}),
    If = (a, b, c) => {
  let d, f;
  void 0 === c ? (d = a, f = b) : (d = c.openAll + a, f = b + c.closeAll);
  return {
    open: a,
    close: b,
    openAll: d,
    closeAll: f,
    parent: c
  };
},
    Hf = (a, b, c) => {
  const d = (...a) => {
    a = 1 === a.length ? "" + a[0] : a.join(" ");
    if (0 >= d.level || !a) a = d._isEmpty ? "" : a;else {
      var b = d._styler;

      if (void 0 !== b) {
        var {
          openAll: c,
          closeAll: f
        } = b;
        if (-1 !== a.indexOf("\u001b")) for (; void 0 !== b;) a = yf(a, b.close, b.open), b = b.parent;
        b = a.indexOf("\n");
        -1 !== b && (a = zf(a, f, c, b));
        a = c + a + f;
      }
    }
    return a;
  };

  d.__proto__ = Kf;
  d._generator = a;
  d._styler = b;
  d._isEmpty = c;
  return d;
},
    Lf,
    Ff = (a, ...b) => {
  const [c] = b;
  if (!Array.isArray(c)) return b.join(" ");
  b = b.slice(1);
  const d = [c.raw[0]];

  for (let a = 1; a < c.length; a++) d.push(String(b[a - 1]).replace(/[{}\\]/g, "\\$&"), String(c.raw[a]));

  void 0 === Lf && (Lf = vf);
  return Lf(a, d.join(""));
};

Object.defineProperties(Gf.prototype, Bf);
let Mf = Ef(void 0);
Mf.supportsColor = wf;
Mf.stderr = Ef({
  level: xf ? xf.level : 0
});
Mf.stderr.supportsColor = xf;
Mf.Level = {
  None: 0,
  Basic: 1,
  Ansi256: 2,
  TrueColor: 3,
  0: "None",
  1: "Basic",
  2: "Ansi256",
  3: "TrueColor"
};

let Nf = (a, b) => {
  for (const c of Reflect.ownKeys(b)) Object.defineProperty(a, c, Object.getOwnPropertyDescriptor(b, c));

  return a;
};

Nf.default = Nf;

let Of = new WeakMap(),
    Pf = (a, b = {}) => {
  function c(...g) {
    Of.set(c, ++f);
    if (1 === f) d = a.apply(this, g), a = null;else if (!0 === b.throw) throw Error(`Function \`${e}\` can only be called once`);
    return d;
  }

  if ("function" !== typeof a) throw new TypeError("Expected a function");
  let d,
      f = 0;
  const e = a.displayName || a.name || "<anonymous>";
  Nf(c, a);
  Of.set(c, f);
  return c;
};

Pf.default = Pf;

Pf.callCount = a => {
  if (!Of.has(a)) throw Error(`The given function \`${a.name}\` is not wrapped by the \`onetime\` package`);
  return Of.get(a);
};

var Qf = t(function (a) {
  a.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
  "win32" !== process.platform && a.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
  "linux" === process.platform && a.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
}),
    Rf = /^win/i.test(process.platform),
    Sf = require$$0$2;
"function" !== typeof Sf && (Sf = Sf.EventEmitter);
var P;
process.__signal_exit_emitter__ ? P = process.__signal_exit_emitter__ : (P = process.__signal_exit_emitter__ = new Sf(), P.count = 0, P.emitted = {});
P.infinite || (P.setMaxListeners(Infinity), P.infinite = !0);

function Tf(a, b) {
  assert.equal(typeof a, "function", "a callback must be provided for exit handler");
  !1 === Uf && Vf();
  var c = "exit";
  b && b.alwaysLast && (c = "afterexit");
  P.on(c, a);
  return function () {
    P.removeListener(c, a);
    0 === P.listeners("exit").length && 0 === P.listeners("afterexit").length && Wf();
  };
}

var Xf = Wf;

function Wf() {
  Uf && (Uf = !1, Qf.forEach(function (a) {
    try {
      process.removeListener(a, Yf[a]);
    } catch (b) {}
  }), process.emit = Zf, process.reallyExit = $f, --P.count);
}

function ag(a, b, c) {
  P.emitted[a] || (P.emitted[a] = !0, P.emit(a, b, c));
}

var Yf = {};
Qf.forEach(function (a) {
  Yf[a] = function () {
    process.listeners(a).length === P.count && (Wf(), ag("exit", null, a), ag("afterexit", null, a), Rf && "SIGHUP" === a && (a = "SIGINT"), process.kill(process.pid, a));
  };
});
var bg = Vf,
    Uf = !1;

function Vf() {
  Uf || (Uf = !0, P.count += 1, Qf = Qf.filter(function (a) {
    try {
      return process.on(a, Yf[a]), !0;
    } catch (b) {
      return !1;
    }
  }), process.emit = cg, process.reallyExit = dg);
}

var $f = process.reallyExit;

function dg(a) {
  process.exitCode = a || 0;
  ag("exit", process.exitCode, null);
  ag("afterexit", process.exitCode, null);
  $f.call(process, process.exitCode);
}

var Zf = process.emit;

function cg(a, b) {
  if ("exit" === a) {
    void 0 !== b && (process.exitCode = b);
    var c = Zf.apply(this, arguments);
    ag("exit", process.exitCode, null);
    ag("afterexit", process.exitCode, null);
    return c;
  }

  return Zf.apply(this, arguments);
}

Tf.unload = Xf;

Tf.signals = function () {
  return Qf;
};

Tf.load = bg;
var eg = Pf(() => {
  Tf(() => {
    process.stderr.write("\u001b[?25h");
  }, {
    alwaysLast: !0
  });
}),
    fg = t(function (a, b) {
  let c = !1;

  b.show = (a = process.stderr) => {
    a.isTTY && (c = !1, a.write("\u001b[?25h"));
  };

  b.hide = (a = process.stderr) => {
    a.isTTY && (eg(), c = !0, a.write("\u001b[?25l"));
  };

  b.toggle = (a, f) => {
    void 0 !== a && (c = a);
    c ? b.show(f) : b.hide(f);
  };
});
let gg = Object.assign({}, {
  dots: {
    interval: 80,
    frames: "\u280b\u2819\u2839\u2838\u283c\u2834\u2826\u2827\u2807\u280f".split("")
  },
  dots2: {
    interval: 80,
    frames: "\u28fe\u28fd\u28fb\u28bf\u287f\u28df\u28ef\u28f7".split("")
  },
  dots3: {
    interval: 80,
    frames: "\u280b\u2819\u281a\u281e\u2816\u2826\u2834\u2832\u2833\u2813".split("")
  },
  dots4: {
    interval: 80,
    frames: "\u2804\u2806\u2807\u280b\u2819\u2838\u2830\u2820\u2830\u2838\u2819\u280b\u2807\u2806".split("")
  },
  dots5: {
    interval: 80,
    frames: "\u280b\u2819\u281a\u2812\u2802\u2802\u2812\u2832\u2834\u2826\u2816\u2812\u2810\u2810\u2812\u2813\u280b".split("")
  },
  dots6: {
    interval: 80,
    frames: "\u2801\u2809\u2819\u281a\u2812\u2802\u2802\u2812\u2832\u2834\u2824\u2804\u2804\u2824\u2834\u2832\u2812\u2802\u2802\u2812\u281a\u2819\u2809\u2801".split("")
  },
  dots7: {
    interval: 80,
    frames: "\u2808\u2809\u280b\u2813\u2812\u2810\u2810\u2812\u2816\u2826\u2824\u2820\u2820\u2824\u2826\u2816\u2812\u2810\u2810\u2812\u2813\u280b\u2809\u2808".split("")
  },
  dots8: {
    interval: 80,
    frames: "\u2801\u2801\u2809\u2819\u281a\u2812\u2802\u2802\u2812\u2832\u2834\u2824\u2804\u2804\u2824\u2820\u2820\u2824\u2826\u2816\u2812\u2810\u2810\u2812\u2813\u280b\u2809\u2808\u2808".split("")
  },
  dots9: {
    interval: 80,
    frames: "\u28b9\u28ba\u28bc\u28f8\u28c7\u2867\u2857\u284f".split("")
  },
  dots10: {
    interval: 80,
    frames: "\u2884\u2882\u2881\u2841\u2848\u2850\u2860".split("")
  },
  dots11: {
    interval: 100,
    frames: "\u2801\u2802\u2804\u2840\u2880\u2820\u2810\u2808".split("")
  },
  dots12: {
    interval: 80,
    frames: "\u2880\u2800 \u2840\u2800 \u2804\u2800 \u2882\u2800 \u2842\u2800 \u2805\u2800 \u2883\u2800 \u2843\u2800 \u280d\u2800 \u288b\u2800 \u284b\u2800 \u280d\u2801 \u288b\u2801 \u284b\u2801 \u280d\u2809 \u280b\u2809 \u280b\u2809 \u2809\u2819 \u2809\u2819 \u2809\u2829 \u2808\u2899 \u2808\u2859 \u2888\u2829 \u2840\u2899 \u2804\u2859 \u2882\u2829 \u2842\u2898 \u2805\u2858 \u2883\u2828 \u2843\u2890 \u280d\u2850 \u288b\u2820 \u284b\u2880 \u280d\u2841 \u288b\u2801 \u284b\u2801 \u280d\u2809 \u280b\u2809 \u280b\u2809 \u2809\u2819 \u2809\u2819 \u2809\u2829 \u2808\u2899 \u2808\u2859 \u2808\u2829 \u2800\u2899 \u2800\u2859 \u2800\u2829 \u2800\u2898 \u2800\u2858 \u2800\u2828 \u2800\u2890 \u2800\u2850 \u2800\u2820 \u2800\u2880 \u2800\u2840".split(" ")
  },
  dots8Bit: {
    interval: 80,
    frames: "\u2800\u2801\u2802\u2803\u2804\u2805\u2806\u2807\u2840\u2841\u2842\u2843\u2844\u2845\u2846\u2847\u2808\u2809\u280a\u280b\u280c\u280d\u280e\u280f\u2848\u2849\u284a\u284b\u284c\u284d\u284e\u284f\u2810\u2811\u2812\u2813\u2814\u2815\u2816\u2817\u2850\u2851\u2852\u2853\u2854\u2855\u2856\u2857\u2818\u2819\u281a\u281b\u281c\u281d\u281e\u281f\u2858\u2859\u285a\u285b\u285c\u285d\u285e\u285f\u2820\u2821\u2822\u2823\u2824\u2825\u2826\u2827\u2860\u2861\u2862\u2863\u2864\u2865\u2866\u2867\u2828\u2829\u282a\u282b\u282c\u282d\u282e\u282f\u2868\u2869\u286a\u286b\u286c\u286d\u286e\u286f\u2830\u2831\u2832\u2833\u2834\u2835\u2836\u2837\u2870\u2871\u2872\u2873\u2874\u2875\u2876\u2877\u2838\u2839\u283a\u283b\u283c\u283d\u283e\u283f\u2878\u2879\u287a\u287b\u287c\u287d\u287e\u287f\u2880\u2881\u2882\u2883\u2884\u2885\u2886\u2887\u28c0\u28c1\u28c2\u28c3\u28c4\u28c5\u28c6\u28c7\u2888\u2889\u288a\u288b\u288c\u288d\u288e\u288f\u28c8\u28c9\u28ca\u28cb\u28cc\u28cd\u28ce\u28cf\u2890\u2891\u2892\u2893\u2894\u2895\u2896\u2897\u28d0\u28d1\u28d2\u28d3\u28d4\u28d5\u28d6\u28d7\u2898\u2899\u289a\u289b\u289c\u289d\u289e\u289f\u28d8\u28d9\u28da\u28db\u28dc\u28dd\u28de\u28df\u28a0\u28a1\u28a2\u28a3\u28a4\u28a5\u28a6\u28a7\u28e0\u28e1\u28e2\u28e3\u28e4\u28e5\u28e6\u28e7\u28a8\u28a9\u28aa\u28ab\u28ac\u28ad\u28ae\u28af\u28e8\u28e9\u28ea\u28eb\u28ec\u28ed\u28ee\u28ef\u28b0\u28b1\u28b2\u28b3\u28b4\u28b5\u28b6\u28b7\u28f0\u28f1\u28f2\u28f3\u28f4\u28f5\u28f6\u28f7\u28b8\u28b9\u28ba\u28bb\u28bc\u28bd\u28be\u28bf\u28f8\u28f9\u28fa\u28fb\u28fc\u28fd\u28fe\u28ff".split("")
  },
  line: {
    interval: 130,
    frames: ["-", "\\", "|", "/"]
  },
  line2: {
    interval: 100,
    frames: "\u2802-\u2013\u2014\u2013-".split("")
  },
  pipe: {
    interval: 100,
    frames: "\u2524\u2518\u2534\u2514\u251c\u250c\u252c\u2510".split("")
  },
  simpleDots: {
    interval: 400,
    frames: [".  ", ".. ", "...", "   "]
  },
  simpleDotsScrolling: {
    interval: 200,
    frames: ".  ;.. ;...; ..;  .;   ".split(";")
  },
  star: {
    interval: 70,
    frames: "\u2736\u2738\u2739\u273a\u2739\u2737".split("")
  },
  star2: {
    interval: 80,
    frames: ["+", "x", "*"]
  },
  flip: {
    interval: 70,
    frames: "___-``'\u00b4-___".split("")
  },
  hamburger: {
    interval: 100,
    frames: ["\u2631", "\u2632", "\u2634"]
  },
  growVertical: {
    interval: 120,
    frames: "\u2581\u2583\u2584\u2585\u2586\u2587\u2586\u2585\u2584\u2583".split("")
  },
  growHorizontal: {
    interval: 120,
    frames: "\u258f\u258e\u258d\u258c\u258b\u258a\u2589\u258a\u258b\u258c\u258d\u258e".split("")
  },
  balloon: {
    interval: 140,
    frames: " .oO@* ".split("")
  },
  balloon2: {
    interval: 120,
    frames: ".oO\u00b0Oo.".split("")
  },
  noise: {
    interval: 100,
    frames: ["\u2593", "\u2592", "\u2591"]
  },
  bounce: {
    interval: 120,
    frames: ["\u2801", "\u2802", "\u2804", "\u2802"]
  },
  boxBounce: {
    interval: 120,
    frames: ["\u2596", "\u2598", "\u259d", "\u2597"]
  },
  boxBounce2: {
    interval: 100,
    frames: ["\u258c", "\u2580", "\u2590", "\u2584"]
  },
  triangle: {
    interval: 50,
    frames: ["\u25e2", "\u25e3", "\u25e4", "\u25e5"]
  },
  arc: {
    interval: 100,
    frames: "\u25dc\u25e0\u25dd\u25de\u25e1\u25df".split("")
  },
  circle: {
    interval: 120,
    frames: ["\u25e1", "\u2299", "\u25e0"]
  },
  squareCorners: {
    interval: 180,
    frames: ["\u25f0", "\u25f3", "\u25f2", "\u25f1"]
  },
  circleQuarters: {
    interval: 120,
    frames: ["\u25f4", "\u25f7", "\u25f6", "\u25f5"]
  },
  circleHalves: {
    interval: 50,
    frames: ["\u25d0", "\u25d3", "\u25d1", "\u25d2"]
  },
  squish: {
    interval: 100,
    frames: ["\u256b", "\u256a"]
  },
  toggle: {
    interval: 250,
    frames: ["\u22b6", "\u22b7"]
  },
  toggle2: {
    interval: 80,
    frames: ["\u25ab", "\u25aa"]
  },
  toggle3: {
    interval: 120,
    frames: ["\u25a1", "\u25a0"]
  },
  toggle4: {
    interval: 100,
    frames: ["\u25a0", "\u25a1", "\u25aa", "\u25ab"]
  },
  toggle5: {
    interval: 100,
    frames: ["\u25ae", "\u25af"]
  },
  toggle6: {
    interval: 300,
    frames: ["\u101d", "\u1040"]
  },
  toggle7: {
    interval: 80,
    frames: ["\u29be", "\u29bf"]
  },
  toggle8: {
    interval: 100,
    frames: ["\u25cd", "\u25cc"]
  },
  toggle9: {
    interval: 100,
    frames: ["\u25c9", "\u25ce"]
  },
  toggle10: {
    interval: 100,
    frames: ["\u3282", "\u3280", "\u3281"]
  },
  toggle11: {
    interval: 50,
    frames: ["\u29c7", "\u29c6"]
  },
  toggle12: {
    interval: 120,
    frames: ["\u2617", "\u2616"]
  },
  toggle13: {
    interval: 80,
    frames: ["=", "*", "-"]
  },
  arrow: {
    interval: 100,
    frames: "\u2190\u2196\u2191\u2197\u2192\u2198\u2193\u2199".split("")
  },
  arrow2: {
    interval: 80,
    frames: "\u2b06\ufe0f ;\u2197\ufe0f ;\u27a1\ufe0f ;\u2198\ufe0f ;\u2b07\ufe0f ;\u2199\ufe0f ;\u2b05\ufe0f ;\u2196\ufe0f ".split(";")
  },
  arrow3: {
    interval: 120,
    frames: "\u25b9\u25b9\u25b9\u25b9\u25b9 \u25b8\u25b9\u25b9\u25b9\u25b9 \u25b9\u25b8\u25b9\u25b9\u25b9 \u25b9\u25b9\u25b8\u25b9\u25b9 \u25b9\u25b9\u25b9\u25b8\u25b9 \u25b9\u25b9\u25b9\u25b9\u25b8".split(" ")
  },
  bouncingBar: {
    interval: 80,
    frames: "[    ];[=   ];[==  ];[=== ];[ ===];[  ==];[   =];[    ];[   =];[  ==];[ ===];[====];[=== ];[==  ];[=   ]".split(";")
  },
  bouncingBall: {
    interval: 80,
    frames: "( \u25cf    );(  \u25cf   );(   \u25cf  );(    \u25cf );(     \u25cf);(    \u25cf );(   \u25cf  );(  \u25cf   );( \u25cf    );(\u25cf     )".split(";")
  },
  smiley: {
    interval: 200,
    frames: ["\ud83d\ude04 ", "\ud83d\ude1d "]
  },
  monkey: {
    interval: 300,
    frames: ["\ud83d\ude48 ", "\ud83d\ude48 ", "\ud83d\ude49 ", "\ud83d\ude4a "]
  },
  hearts: {
    interval: 100,
    frames: ["\ud83d\udc9b ", "\ud83d\udc99 ", "\ud83d\udc9c ", "\ud83d\udc9a ", "\u2764\ufe0f "]
  },
  clock: {
    interval: 100,
    frames: "\ud83d\udd5b ;\ud83d\udd50 ;\ud83d\udd51 ;\ud83d\udd52 ;\ud83d\udd53 ;\ud83d\udd54 ;\ud83d\udd55 ;\ud83d\udd56 ;\ud83d\udd57 ;\ud83d\udd58 ;\ud83d\udd59 ;\ud83d\udd5a ".split(";")
  },
  earth: {
    interval: 180,
    frames: ["\ud83c\udf0d ", "\ud83c\udf0e ", "\ud83c\udf0f "]
  },
  material: {
    interval: 17,
    frames: "\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581 \u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581 \u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581 \u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581 \u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581 \u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588 \u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588 \u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588 \u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588 \u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581 \u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581 \u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581 \u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581".split(" ")
  },
  moon: {
    interval: 80,
    frames: "\ud83c\udf11 ;\ud83c\udf12 ;\ud83c\udf13 ;\ud83c\udf14 ;\ud83c\udf15 ;\ud83c\udf16 ;\ud83c\udf17 ;\ud83c\udf18 ".split(";")
  },
  runner: {
    interval: 140,
    frames: ["\ud83d\udeb6 ", "\ud83c\udfc3 "]
  },
  pong: {
    interval: 80,
    frames: "\u2590\u2802       \u258c;\u2590\u2808       \u258c;\u2590 \u2802      \u258c;\u2590 \u2820      \u258c;\u2590  \u2840     \u258c;\u2590  \u2820     \u258c;\u2590   \u2802    \u258c;\u2590   \u2808    \u258c;\u2590    \u2802   \u258c;\u2590    \u2820   \u258c;\u2590     \u2840  \u258c;\u2590     \u2820  \u258c;\u2590      \u2802 \u258c;\u2590      \u2808 \u258c;\u2590       \u2802\u258c;\u2590       \u2820\u258c;\u2590       \u2840\u258c;\u2590      \u2820 \u258c;\u2590      \u2802 \u258c;\u2590     \u2808  \u258c;\u2590     \u2802  \u258c;\u2590    \u2820   \u258c;\u2590    \u2840   \u258c;\u2590   \u2820    \u258c;\u2590   \u2802    \u258c;\u2590  \u2808     \u258c;\u2590  \u2802     \u258c;\u2590 \u2820      \u258c;\u2590 \u2840      \u258c;\u2590\u2820       \u258c".split(";")
  },
  shark: {
    interval: 120,
    frames: "\u2590|\\____________\u258c \u2590_|\\___________\u258c \u2590__|\\__________\u258c \u2590___|\\_________\u258c \u2590____|\\________\u258c \u2590_____|\\_______\u258c \u2590______|\\______\u258c \u2590_______|\\_____\u258c \u2590________|\\____\u258c \u2590_________|\\___\u258c \u2590__________|\\__\u258c \u2590___________|\\_\u258c \u2590____________|\\\u258c \u2590____________/|\u258c \u2590___________/|_\u258c \u2590__________/|__\u258c \u2590_________/|___\u258c \u2590________/|____\u258c \u2590_______/|_____\u258c \u2590______/|______\u258c \u2590_____/|_______\u258c \u2590____/|________\u258c \u2590___/|_________\u258c \u2590__/|__________\u258c \u2590_/|___________\u258c \u2590/|____________\u258c".split(" ")
  },
  dqpb: {
    interval: 100,
    frames: ["d", "q", "p", "b"]
  },
  weather: {
    interval: 100,
    frames: "\u2600\ufe0f ;\u2600\ufe0f ;\u2600\ufe0f ;\ud83c\udf24 ;\u26c5\ufe0f ;\ud83c\udf25 ;\u2601\ufe0f ;\ud83c\udf27 ;\ud83c\udf28 ;\ud83c\udf27 ;\ud83c\udf28 ;\ud83c\udf27 ;\ud83c\udf28 ;\u26c8 ;\ud83c\udf28 ;\ud83c\udf27 ;\ud83c\udf28 ;\u2601\ufe0f ;\ud83c\udf25 ;\u26c5\ufe0f ;\ud83c\udf24 ;\u2600\ufe0f ;\u2600\ufe0f ".split(";")
  },
  christmas: {
    interval: 400,
    frames: ["\ud83c\udf32", "\ud83c\udf84"]
  },
  grenade: {
    interval: 80,
    frames: "\u060c   ;\u2032   ; \u00b4 ; \u203e ;  \u2e0c;  \u2e0a;  |;  \u204e;  \u2055; \u0df4 ;  \u2053;   ;   ;   ".split(";")
  },
  point: {
    interval: 125,
    frames: ["\u2219\u2219\u2219", "\u25cf\u2219\u2219", "\u2219\u25cf\u2219", "\u2219\u2219\u25cf", "\u2219\u2219\u2219"]
  },
  layer: {
    interval: 150,
    frames: ["-", "=", "\u2261"]
  },
  betaWave: {
    interval: 80,
    frames: "\u03c1\u03b2\u03b2\u03b2\u03b2\u03b2\u03b2 \u03b2\u03c1\u03b2\u03b2\u03b2\u03b2\u03b2 \u03b2\u03b2\u03c1\u03b2\u03b2\u03b2\u03b2 \u03b2\u03b2\u03b2\u03c1\u03b2\u03b2\u03b2 \u03b2\u03b2\u03b2\u03b2\u03c1\u03b2\u03b2 \u03b2\u03b2\u03b2\u03b2\u03b2\u03c1\u03b2 \u03b2\u03b2\u03b2\u03b2\u03b2\u03b2\u03c1".split(" ")
  },
  aesthetic: {
    interval: 80,
    frames: "\u25b0\u25b1\u25b1\u25b1\u25b1\u25b1\u25b1 \u25b0\u25b0\u25b1\u25b1\u25b1\u25b1\u25b1 \u25b0\u25b0\u25b0\u25b1\u25b1\u25b1\u25b1 \u25b0\u25b0\u25b0\u25b0\u25b1\u25b1\u25b1 \u25b0\u25b0\u25b0\u25b0\u25b0\u25b1\u25b1 \u25b0\u25b0\u25b0\u25b0\u25b0\u25b0\u25b1 \u25b0\u25b0\u25b0\u25b0\u25b0\u25b0\u25b0 \u25b0\u25b1\u25b1\u25b1\u25b1\u25b1\u25b1".split(" ")
  }
}),
    hg = Object.keys(gg);
Object.defineProperty(gg, "random", {
  get() {
    return gg[hg[Math.floor(Math.random() * hg.length)]];
  }

});
gg.default = gg;
var ig = /[|\\{}()[\]^$+*?.]/g;

function jg(a) {
  if ("string" !== typeof a) throw new TypeError("Expected a string");
  return a.replace(ig, "\\$&");
}

var kg = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
},
    lg = t(function (a) {
  var b = {};

  for (f in kg) kg.hasOwnProperty(f) && (b[kg[f]] = f);

  var c = a.exports = {
    rgb: {
      channels: 3,
      labels: "rgb"
    },
    hsl: {
      channels: 3,
      labels: "hsl"
    },
    hsv: {
      channels: 3,
      labels: "hsv"
    },
    hwb: {
      channels: 3,
      labels: "hwb"
    },
    cmyk: {
      channels: 4,
      labels: "cmyk"
    },
    xyz: {
      channels: 3,
      labels: "xyz"
    },
    lab: {
      channels: 3,
      labels: "lab"
    },
    lch: {
      channels: 3,
      labels: "lch"
    },
    hex: {
      channels: 1,
      labels: ["hex"]
    },
    keyword: {
      channels: 1,
      labels: ["keyword"]
    },
    ansi16: {
      channels: 1,
      labels: ["ansi16"]
    },
    ansi256: {
      channels: 1,
      labels: ["ansi256"]
    },
    hcg: {
      channels: 3,
      labels: ["h", "c", "g"]
    },
    apple: {
      channels: 3,
      labels: ["r16", "g16", "b16"]
    },
    gray: {
      channels: 1,
      labels: ["gray"]
    }
  },
      d;

  for (d in c) if (c.hasOwnProperty(d)) {
    if (!("channels" in c[d])) throw Error("missing channels property: " + d);
    if (!("labels" in c[d])) throw Error("missing channel labels property: " + d);
    if (c[d].labels.length !== c[d].channels) throw Error("channel and label counts mismatch: " + d);
    a = c[d].channels;
    var f = c[d].labels;
    delete c[d].channels;
    delete c[d].labels;
    Object.defineProperty(c[d], "channels", {
      value: a
    });
    Object.defineProperty(c[d], "labels", {
      value: f
    });
  }

  c.rgb.hsl = function (a) {
    var b = a[0] / 255,
        c = a[1] / 255,
        e = a[2] / 255;
    a = Math.min(b, c, e);
    var d = Math.max(b, c, e),
        f = d - a,
        r;
    d === a ? r = 0 : b === d ? r = (c - e) / f : c === d ? r = 2 + (e - b) / f : e === d && (r = 4 + (b - c) / f);
    r = Math.min(60 * r, 360);
    0 > r && (r += 360);
    b = (a + d) / 2;
    return [r, 100 * (d === a ? 0 : .5 >= b ? f / (d + a) : f / (2 - d - a)), 100 * b];
  };

  c.rgb.hsv = function (a) {
    var b,
        c = a[0] / 255,
        e = a[1] / 255,
        d = a[2] / 255,
        f = Math.max(c, e, d);
    var r = f - Math.min(c, e, d);
    if (0 === r) var u = b = 0;else {
      b = r / f;
      a = (f - c) / 6 / r + .5;
      var z = (f - e) / 6 / r + .5;
      r = (f - d) / 6 / r + .5;
      c === f ? u = r - z : e === f ? u = 1 / 3 + a - r : d === f && (u = 2 / 3 + z - a);
      0 > u ? u += 1 : 1 < u && --u;
    }
    return [360 * u, 100 * b, 100 * f];
  };

  c.rgb.hwb = function (a) {
    var b = a[0],
        e = a[1],
        d = a[2];
    a = c.rgb.hsl(a)[0];
    var f = 1 / 255 * Math.min(b, Math.min(e, d));
    d = 1 - 1 / 255 * Math.max(b, Math.max(e, d));
    return [a, 100 * f, 100 * d];
  };

  c.rgb.cmyk = function (a) {
    var b = a[0] / 255,
        c = a[1] / 255;
    a = a[2] / 255;
    var e = Math.min(1 - b, 1 - c, 1 - a);
    return [100 * ((1 - b - e) / (1 - e) || 0), 100 * ((1 - c - e) / (1 - e) || 0), 100 * ((1 - a - e) / (1 - e) || 0), 100 * e];
  };

  c.rgb.keyword = function (a) {
    var c = b[a];
    if (c) return c;
    c = Infinity;
    var e;

    for (e in kg) if (kg.hasOwnProperty(e)) {
      var d = kg[e];
      d = Math.pow(a[0] - d[0], 2) + Math.pow(a[1] - d[1], 2) + Math.pow(a[2] - d[2], 2);

      if (d < c) {
        c = d;
        var f = e;
      }
    }

    return f;
  };

  c.keyword.rgb = function (a) {
    return kg[a];
  };

  c.rgb.xyz = function (a) {
    var b = a[0] / 255,
        c = a[1] / 255;
    a = a[2] / 255;
    b = .04045 < b ? Math.pow((b + .055) / 1.055, 2.4) : b / 12.92;
    c = .04045 < c ? Math.pow((c + .055) / 1.055, 2.4) : c / 12.92;
    a = .04045 < a ? Math.pow((a + .055) / 1.055, 2.4) : a / 12.92;
    return [100 * (.4124 * b + .3576 * c + .1805 * a), 100 * (.2126 * b + .7152 * c + .0722 * a), 100 * (.0193 * b + .1192 * c + .9505 * a)];
  };

  c.rgb.lab = function (a) {
    var b = c.rgb.xyz(a);
    a = b[0];
    var e = b[1];
    b = b[2];
    a /= 95.047;
    e /= 100;
    b /= 108.883;
    a = .008856 < a ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116;
    e = .008856 < e ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116;
    b = .008856 < b ? Math.pow(b, 1 / 3) : 7.787 * b + 16 / 116;
    return [116 * e - 16, 500 * (a - e), 200 * (e - b)];
  };

  c.hsl.rgb = function (a) {
    var b = a[0] / 360,
        c = a[1] / 100;
    a = a[2] / 100;

    if (0 === c) {
      var e = 255 * a;
      return [e, e, e];
    }

    c = .5 > a ? a * (1 + c) : a + c - a * c;
    a = 2 * a - c;
    var d = [0, 0, 0];

    for (var f = 0; 3 > f; f++) e = b + 1 / 3 * -(f - 1), 0 > e && e++, 1 < e && e--, e = 1 > 6 * e ? a + 6 * (c - a) * e : 1 > 2 * e ? c : 2 > 3 * e ? a + (c - a) * (2 / 3 - e) * 6 : a, d[f] = 255 * e;

    return d;
  };

  c.hsl.hsv = function (a) {
    var b = a[0],
        c = a[1] / 100;
    a = a[2] / 100;
    var e = c,
        d = Math.max(a, .01);
    a *= 2;
    c *= 1 >= a ? a : 2 - a;
    e *= 1 >= d ? d : 2 - d;
    return [b, 100 * (0 === a ? 2 * e / (d + e) : 2 * c / (a + c)), (a + c) / 2 * 100];
  };

  c.hsv.rgb = function (a) {
    var b = a[0] / 60,
        c = a[1] / 100;
    a = a[2] / 100;
    var e = Math.floor(b) % 6,
        d = b - Math.floor(b);
    b = 255 * a * (1 - c);
    var f = 255 * a * (1 - c * d);
    c = 255 * a * (1 - c * (1 - d));
    a *= 255;

    switch (e) {
      case 0:
        return [a, c, b];

      case 1:
        return [f, a, b];

      case 2:
        return [b, a, c];

      case 3:
        return [b, f, a];

      case 4:
        return [c, b, a];

      case 5:
        return [a, b, f];
    }
  };

  c.hsv.hsl = function (a) {
    var b = a[0],
        c = a[1] / 100;
    a = a[2] / 100;
    var e = Math.max(a, .01);
    var d = (2 - c) * e;
    e = c * e / (1 >= d ? d : 2 - d) || 0;
    return [b, 100 * e, (2 - c) * a / 2 * 100];
  };

  c.hwb.rgb = function (a) {
    var b = a[0] / 360,
        c = a[1] / 100;
    a = a[2] / 100;
    var e = c + a;
    1 < e && (c /= e, a /= e);
    e = Math.floor(6 * b);
    a = 1 - a;
    b = 6 * b - e;
    0 !== (e & 1) && (b = 1 - b);
    b = c + b * (a - c);

    switch (e) {
      default:
      case 6:
      case 0:
        e = a;
        var d = b;
        break;

      case 1:
        e = b;
        d = a;
        break;

      case 2:
        e = c;
        d = a;
        c = b;
        break;

      case 3:
        e = c;
        d = b;
        c = a;
        break;

      case 4:
        e = b;
        d = c;
        c = a;
        break;

      case 5:
        e = a, d = c, c = b;
    }

    return [255 * e, 255 * d, 255 * c];
  };

  c.cmyk.rgb = function (a) {
    var b = a[3] / 100;
    return [255 * (1 - Math.min(1, a[0] / 100 * (1 - b) + b)), 255 * (1 - Math.min(1, a[1] / 100 * (1 - b) + b)), 255 * (1 - Math.min(1, a[2] / 100 * (1 - b) + b))];
  };

  c.xyz.rgb = function (a) {
    var b = a[0] / 100,
        c = a[1] / 100,
        e = a[2] / 100;
    a = 3.2406 * b + -1.5372 * c + -.4986 * e;
    var d = -.9689 * b + 1.8758 * c + .0415 * e;
    b = .0557 * b + -.204 * c + 1.057 * e;
    a = .0031308 < a ? 1.055 * Math.pow(a, 1 / 2.4) - .055 : 12.92 * a;
    d = .0031308 < d ? 1.055 * Math.pow(d, 1 / 2.4) - .055 : 12.92 * d;
    b = .0031308 < b ? 1.055 * Math.pow(b, 1 / 2.4) - .055 : 12.92 * b;
    a = Math.min(Math.max(0, a), 1);
    d = Math.min(Math.max(0, d), 1);
    b = Math.min(Math.max(0, b), 1);
    return [255 * a, 255 * d, 255 * b];
  };

  c.xyz.lab = function (a) {
    var b = a[0],
        c = a[1];
    a = a[2];
    b /= 95.047;
    c /= 100;
    a /= 108.883;
    b = .008856 < b ? Math.pow(b, 1 / 3) : 7.787 * b + 16 / 116;
    c = .008856 < c ? Math.pow(c, 1 / 3) : 7.787 * c + 16 / 116;
    a = .008856 < a ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116;
    return [116 * c - 16, 500 * (b - c), 200 * (c - a)];
  };

  c.lab.xyz = function (a) {
    var b = a[1],
        c = a[2];
    a = (a[0] + 16) / 116;
    b = b / 500 + a;
    c = a - c / 200;
    var d = Math.pow(a, 3),
        e = Math.pow(b, 3),
        f = Math.pow(c, 3);
    return [95.047 * (.008856 < e ? e : (b - 16 / 116) / 7.787), 100 * (.008856 < d ? d : (a - 16 / 116) / 7.787), 108.883 * (.008856 < f ? f : (c - 16 / 116) / 7.787)];
  };

  c.lab.lch = function (a) {
    var b = a[0],
        c = a[1];
    a = a[2];
    var d = 360 * Math.atan2(a, c) / 2 / Math.PI;
    0 > d && (d += 360);
    return [b, Math.sqrt(c * c + a * a), d];
  };

  c.lch.lab = function (a) {
    var b = a[0],
        c = a[1];
    a = a[2] / 360 * 2 * Math.PI;
    return [b, c * Math.cos(a), c * Math.sin(a)];
  };

  c.rgb.ansi16 = function (a) {
    var b = a[0],
        d = a[1],
        e = a[2],
        f = 1 in arguments ? arguments[1] : c.rgb.hsv(a)[2];
    f = Math.round(f / 50);
    if (0 === f) return 30;
    b = 30 + (Math.round(e / 255) << 2 | Math.round(d / 255) << 1 | Math.round(b / 255));
    2 === f && (b += 60);
    return b;
  };

  c.hsv.ansi16 = function (a) {
    return c.rgb.ansi16(c.hsv.rgb(a), a[2]);
  };

  c.rgb.ansi256 = function (a) {
    var b = a[0],
        c = a[1];
    a = a[2];
    return b === c && c === a ? 8 > b ? 16 : 248 < b ? 231 : Math.round((b - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(b / 255 * 5) + 6 * Math.round(c / 255 * 5) + Math.round(a / 255 * 5);
  };

  c.ansi16.rgb = function (a) {
    var b = a % 10;
    if (0 === b || 7 === b) return 50 < a && (b += 3.5), b = b / 10.5 * 255, [b, b, b];
    a = .5 * (~~(50 < a) + 1);
    return [(b & 1) * a * 255, (b >> 1 & 1) * a * 255, (b >> 2 & 1) * a * 255];
  };

  c.ansi256.rgb = function (a) {
    if (232 <= a) {
      var b = 10 * (a - 232) + 8;
      return [b, b, b];
    }

    a -= 16;
    b = Math.floor(a / 36) / 5 * 255;
    var c = Math.floor((a %= 36) / 6) / 5 * 255;
    return [b, c, a % 6 / 5 * 255];
  };

  c.rgb.hex = function (a) {
    a = (((Math.round(a[0]) & 255) << 16) + ((Math.round(a[1]) & 255) << 8) + (Math.round(a[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(a.length) + a;
  };

  c.hex.rgb = function (a) {
    a = a.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!a) return [0, 0, 0];
    var b = a[0];
    3 === a[0].length && (b = b.split("").map(function (a) {
      return a + a;
    }).join(""));
    a = parseInt(b, 16);
    return [a >> 16 & 255, a >> 8 & 255, a & 255];
  };

  c.rgb.hcg = function (a) {
    var b = a[0] / 255,
        c = a[1] / 255;
    a = a[2] / 255;
    var d = Math.max(Math.max(b, c), a),
        e = Math.min(Math.min(b, c), a),
        f = d - e;
    return [(0 >= f ? 0 : d === b ? (c - a) / f % 6 : d === c ? 2 + (a - b) / f : (b - c) / f + 8) / 6 % 1 * 360, 100 * f, 100 * (1 > f ? e / (1 - f) : 0)];
  };

  c.hsl.hcg = function (a) {
    var b = a[1] / 100,
        c = a[2] / 100,
        d = 0;
    b = .5 > c ? 2 * b * c : 2 * b * (1 - c);
    1 > b && (d = (c - .5 * b) / (1 - b));
    return [a[0], 100 * b, 100 * d];
  };

  c.hsv.hcg = function (a) {
    var b = a[2] / 100,
        c = a[1] / 100 * b,
        d = 0;
    1 > c && (d = (b - c) / (1 - c));
    return [a[0], 100 * c, 100 * d];
  };

  c.hcg.rgb = function (a) {
    var b = a[1] / 100,
        c = a[2] / 100;
    if (0 === b) return [255 * c, 255 * c, 255 * c];
    var d = [0, 0, 0];
    a = a[0] / 360 % 1 * 6;
    var e = a % 1,
        f = 1 - e;

    switch (Math.floor(a)) {
      case 0:
        d[0] = 1;
        d[1] = e;
        d[2] = 0;
        break;

      case 1:
        d[0] = f;
        d[1] = 1;
        d[2] = 0;
        break;

      case 2:
        d[0] = 0;
        d[1] = 1;
        d[2] = e;
        break;

      case 3:
        d[0] = 0;
        d[1] = f;
        d[2] = 1;
        break;

      case 4:
        d[0] = e;
        d[1] = 0;
        d[2] = 1;
        break;

      default:
        d[0] = 1, d[1] = 0, d[2] = f;
    }

    c *= 1 - b;
    return [255 * (b * d[0] + c), 255 * (b * d[1] + c), 255 * (b * d[2] + c)];
  };

  c.hcg.hsv = function (a) {
    var b = a[1] / 100,
        c = b + a[2] / 100 * (1 - b),
        d = 0;
    0 < c && (d = b / c);
    return [a[0], 100 * d, 100 * c];
  };

  c.hcg.hsl = function (a) {
    var b = a[1] / 100,
        c = a[2] / 100 * (1 - b) + .5 * b,
        d = 0;
    0 < c && .5 > c ? d = b / (2 * c) : .5 <= c && 1 > c && (d = b / (2 * (1 - c)));
    return [a[0], 100 * d, 100 * c];
  };

  c.hcg.hwb = function (a) {
    var b = a[1] / 100,
        c = b + a[2] / 100 * (1 - b);
    return [a[0], 100 * (c - b), 100 * (1 - c)];
  };

  c.hwb.hcg = function (a) {
    var b = 1 - a[2] / 100,
        c = b - a[1] / 100,
        d = 0;
    1 > c && (d = (b - c) / (1 - c));
    return [a[0], 100 * c, 100 * d];
  };

  c.apple.rgb = function (a) {
    return [a[0] / 65535 * 255, a[1] / 65535 * 255, a[2] / 65535 * 255];
  };

  c.rgb.apple = function (a) {
    return [a[0] / 255 * 65535, a[1] / 255 * 65535, a[2] / 255 * 65535];
  };

  c.gray.rgb = function (a) {
    return [a[0] / 100 * 255, a[0] / 100 * 255, a[0] / 100 * 255];
  };

  c.gray.hsl = c.gray.hsv = function (a) {
    return [0, 0, a[0]];
  };

  c.gray.hwb = function (a) {
    return [0, 100, a[0]];
  };

  c.gray.cmyk = function (a) {
    return [0, 0, 0, a[0]];
  };

  c.gray.lab = function (a) {
    return [a[0], 0, 0];
  };

  c.gray.hex = function (a) {
    a = Math.round(a[0] / 100 * 255) & 255;
    a = ((a << 16) + (a << 8) + a).toString(16).toUpperCase();
    return "000000".substring(a.length) + a;
  };

  c.rgb.gray = function (a) {
    return [(a[0] + a[1] + a[2]) / 3 / 255 * 100];
  };
});

function mg(a, b) {
  return function (c) {
    return b(a(c));
  };
}

function ng(a) {
  for (var b = {}, c = Object.keys(lg), d = c.length, f = 0; f < d; f++) b[c[f]] = {
    distance: -1,
    parent: null
  };

  c = [a];

  for (b[a].distance = 0; c.length;) {
    a = c.pop();
    d = Object.keys(lg[a]);
    f = d.length;

    for (var e = 0; e < f; e++) {
      var g = d[e],
          h = b[g];
      -1 === h.distance && (h.distance = b[a].distance + 1, h.parent = a, c.unshift(g));
    }
  }

  c = {};
  a = Object.keys(b);
  d = a.length;

  for (f = 0; f < d; f++) {
    var k = a[f];

    if (null !== b[k].parent) {
      e = k;
      g = b;
      h = [g[k].parent, k];
      var q = lg[g[k].parent][k];

      for (k = g[k].parent; g[k].parent;) h.unshift(g[k].parent), q = mg(lg[g[k].parent][k], q), k = g[k].parent;

      q.conversion = h;
      c[e] = q;
    }
  }

  return c;
}

var Q = {};

function og(a) {
  function b(b) {
    if (void 0 === b || null === b) return b;
    1 < arguments.length && (b = Array.prototype.slice.call(arguments));
    return a(b);
  }

  "conversion" in a && (b.conversion = a.conversion);
  return b;
}

function pg(a) {
  function b(b) {
    if (void 0 === b || null === b) return b;
    1 < arguments.length && (b = Array.prototype.slice.call(arguments));
    var c = a(b);
    if ("object" === typeof c) for (var f = c.length, e = 0; e < f; e++) c[e] = Math.round(c[e]);
    return c;
  }

  "conversion" in a && (b.conversion = a.conversion);
  return b;
}

Object.keys(lg).forEach(function (a) {
  Q[a] = {};
  Object.defineProperty(Q[a], "channels", {
    value: lg[a].channels
  });
  Object.defineProperty(Q[a], "labels", {
    value: lg[a].labels
  });
  var b = ng(a);
  Object.keys(b).forEach(function (c) {
    var d = b[c];
    Q[a][c] = pg(d);
    Q[a][c].raw = og(d);
  });
});

var R = t(function (a) {
  let b = (a, b) => function () {
    return `\u001B[${a.apply(Q, arguments) + b}m`;
  },
      c = (a, b) => function () {
    const c = a.apply(Q, arguments);
    return `\u001B[${38 + b};5;${c}m`;
  },
      d = (a, b) => function () {
    const c = a.apply(Q, arguments);
    return `\u001B[${38 + b};2;${c[0]};${c[1]};${c[2]}m`;
  };

  Object.defineProperty(a, "exports", {
    enumerable: !0,
    get: function () {
      var a = new Map();
      let e = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          gray: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      e.color.grey = e.color.gray;

      for (var g of Object.keys(e)) {
        let b = e[g];

        for (let c of Object.keys(b)) {
          let d = b[c];
          e[c] = {
            open: `\u001B[${d[0]}m`,
            close: `\u001B[${d[1]}m`
          };
          b[c] = e[c];
          a.set(d[0], d[1]);
        }

        Object.defineProperty(e, g, {
          value: b,
          enumerable: !1
        });
        Object.defineProperty(e, "codes", {
          value: a,
          enumerable: !1
        });
      }

      a = a => a;

      g = (a, b, c) => [a, b, c];

      e.color.close = "\u001b[39m";
      e.bgColor.close = "\u001b[49m";
      e.color.ansi = {
        ansi: b(a, 0)
      };
      e.color.ansi256 = {
        ansi256: c(a, 0)
      };
      e.color.ansi16m = {
        rgb: d(g, 0)
      };
      e.bgColor.ansi = {
        ansi: b(a, 10)
      };
      e.bgColor.ansi256 = {
        ansi256: c(a, 10)
      };
      e.bgColor.ansi16m = {
        rgb: d(g, 10)
      };

      for (let f of Object.keys(Q)) "object" === typeof Q[f] && (a = Q[f], "ansi16" === f && (f = "ansi"), "ansi16" in a && (e.color.ansi[f] = b(a.ansi16, 0), e.bgColor.ansi[f] = b(a.ansi16, 10)), "ansi256" in a && (e.color.ansi256[f] = c(a.ansi256, 0), e.bgColor.ansi256[f] = c(a.ansi256, 10)), "rgb" in a && (e.color.ansi16m[f] = d(a.rgb, 0), e.bgColor.ansi16m[f] = d(a.rgb, 10)));

      return e;
    }
  });
}),
    S = (a, b) => {
  b = b || process.argv;
  let c = a.startsWith("-") ? "" : 1 === a.length ? "-" : "--";
  a = b.indexOf(c + a);
  b = b.indexOf("--");
  return -1 !== a && (-1 === b ? !0 : a < b);
};

let T = process.env,
    qg;
if (S("no-color") || S("no-colors") || S("color=false")) qg = !1;else if (S("color") || S("colors") || S("color=true") || S("color=always")) qg = !0;
"FORCE_COLOR" in T && (qg = 0 === T.FORCE_COLOR.length || 0 !== parseInt(T.FORCE_COLOR, 10));

function rg(a) {
  if (!1 === qg) return 0;
  if (S("color=16m") || S("color=full") || S("color=truecolor")) return 3;
  if (S("color=256")) return 2;
  if (a && !a.isTTY && !0 !== qg) return 0;
  a = qg ? 1 : 0;
  if ("win32" === process.platform) return a = os.release().split("."), 8 <= Number(process.versions.node.split(".")[0]) && 10 <= Number(a[0]) && 10586 <= Number(a[2]) ? 14931 <= Number(a[2]) ? 3 : 2 : 1;
  if ("CI" in T) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(a => a in T) || "codeship" === T.CI_NAME ? 1 : a;
  if ("TEAMCITY_VERSION" in T) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(T.TEAMCITY_VERSION) ? 1 : 0;
  if ("truecolor" === T.COLORTERM) return 3;

  if ("TERM_PROGRAM" in T) {
    let a = parseInt((T.TERM_PROGRAM_VERSION || "").split(".")[0], 10);

    switch (T.TERM_PROGRAM) {
      case "iTerm.app":
        return 3 <= a ? 3 : 2;

      case "Apple_Terminal":
        return 2;
    }
  }

  return /-256(color)?$/i.test(T.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(T.TERM) || "COLORTERM" in T ? 1 : a;
}

function sg(a) {
  a = rg(a);
  a = 0 === a ? !1 : {
    level: a,
    hasBasic: !0,
    has256: 2 <= a,
    has16m: 3 <= a
  };
  return a;
}

var tg = {
  supportsColor: sg,
  stdout: sg(process.stdout),
  stderr: sg(process.stderr)
};
let ug = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    vg = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    wg = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    xg = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi,
    yg = new Map([["n", "\n"], ["r", "\r"], ["t", "\t"], ["b", "\b"], ["f", "\f"], ["v", "\v"], ["0", "\x00"], ["\\", "\\"], ["e", "\u001b"], ["a", "\u0007"]]);

function zg(a) {
  return "u" === a[0] && 5 === a.length || "x" === a[0] && 3 === a.length ? String.fromCharCode(parseInt(a.slice(1), 16)) : yg.get(a) || a;
}

function Ag(a, b) {
  let c = [];
  b = b.trim().split(/\s*,\s*/g);

  for (let d of b) if (isNaN(d)) {
    if (b = d.match(wg)) c.push(b[2].replace(xg, (a, b, c) => b ? zg(b) : c));else throw Error(`Invalid Chalk template style argument: ${d} (in style '${a}')`);
  } else c.push(Number(d));

  return c;
}

function Bg(a) {
  vg.lastIndex = 0;
  let b = [];

  for (var c; null !== (c = vg.exec(a));) {
    let a = c[1];
    c[2] ? (c = Ag(a, c[2]), b.push([a].concat(c))) : b.push([a]);
  }

  return b;
}

function Cg(a, b) {
  let c = {};

  for (let a of b) for (let b of a.styles) c[b[0]] = a.inverse ? null : b.slice(1);

  for (let b of Object.keys(c)) if (Array.isArray(c[b])) {
    if (!(b in a)) throw Error(`Unknown Chalk style: ${b}`);
    a = 0 < c[b].length ? a[b].apply(a, c[b]) : a[b];
  }

  return a;
}

var Dg = (a, b) => {
  let c = [],
      d = [],
      f = [];
  b.replace(ug, (b, g, h, k, q, m) => {
    if (g) f.push(zg(g));else if (k) b = f.join(""), f = [], d.push(0 === c.length ? b : Cg(a, c)(b)), c.push({
      inverse: h,
      styles: Bg(k)
    });else if (q) {
      if (0 === c.length) throw Error("Found extraneous } in Chalk template literal");
      d.push(Cg(a, c)(f.join("")));
      f = [];
      c.pop();
    } else f.push(m);
  });
  d.push(f.join(""));
  if (0 < c.length) throw Error(`Chalk template literal is missing ${c.length} closing bracket${1 === c.length ? "" : "s"} (\`}\`)`);
  return d.join("");
},
    Eg = t(function (a) {
  function b(a, b) {
    b = b || {};
    let c = g ? g.level : 0;
    a.level = void 0 === b.level ? c : b.level;
    a.enabled = "enabled" in b ? b.enabled : 0 < a.level;
  }

  function c(a) {
    if (!(this && this instanceof c) || this.template) {
      let d = {};
      b(d, a);

      d.template = function () {
        let a = [].slice.call(arguments);
        return e.apply(null, [d.template].concat(a));
      };

      Object.setPrototypeOf(d, c.prototype);
      Object.setPrototypeOf(d.template, d);
      d.template.constructor = c;
      return d.template;
    }

    b(this, a);
  }

  function d(a, b, c) {
    function d() {
      return f.apply(d, arguments);
    }

    d._styles = a;
    d._empty = b;
    let e = this;
    Object.defineProperty(d, "level", {
      enumerable: !0,

      get() {
        return e.level;
      },

      set(a) {
        e.level = a;
      }

    });
    Object.defineProperty(d, "enabled", {
      enumerable: !0,

      get() {
        return e.enabled;
      },

      set(a) {
        e.enabled = a;
      }

    });
    d.hasGrey = this.hasGrey || "gray" === c || "grey" === c;
    d.__proto__ = r;
    return d;
  }

  function f() {
    var a = arguments;
    let b = a.length,
        c = String(arguments[0]);
    if (0 === b) return "";
    if (1 < b) for (let d = 1; d < b; d++) c += " " + a[d];
    if (!this.enabled || 0 >= this.level || !c) return this._empty ? "" : c;
    a = R.dim.open;
    h && this.hasGrey && (R.dim.open = "");

    for (let a of this._styles.slice().reverse()) c = a.open + c.replace(a.closeRe, a.open) + a.close, c = c.replace(/\r?\n/g, `${a.close}$&${a.open}`);

    R.dim.open = a;
    return c;
  }

  function e(a, b) {
    if (!Array.isArray(b)) return [].slice.call(arguments, 1).join(" ");
    let c = [].slice.call(arguments, 2),
        d = [b.raw[0]];

    for (let a = 1; a < b.length; a++) d.push(String(c[a - 1]).replace(/[{}\\]/g, "\\$&")), d.push(String(b.raw[a]));

    return Dg(a, d.join(""));
  }

  let g = tg.stdout,
      h = "win32" === process.platform && !(process.env.TERM || "").toLowerCase().startsWith("xterm"),
      k = ["ansi", "ansi", "ansi256", "ansi16m"],
      q = new Set(["gray"]),
      m = Object.create(null);
  h && (R.blue.open = "\u001b[94m");

  for (let a of Object.keys(R)) R[a].closeRe = new RegExp(jg(R[a].close), "g"), m[a] = {
    get() {
      let b = R[a];
      return d.call(this, this._styles ? this._styles.concat(b) : [b], this._empty, a);
    }

  };

  m.visible = {
    get() {
      return d.call(this, this._styles || [], !0, "visible");
    }

  };
  R.color.closeRe = new RegExp(jg(R.color.close), "g");

  for (let a of Object.keys(R.color.ansi)) q.has(a) || (m[a] = {
    get() {
      let b = this.level;
      return function () {
        let c = {
          open: R.color[k[b]][a].apply(null, arguments),
          close: R.color.close,
          closeRe: R.color.closeRe
        };
        return d.call(this, this._styles ? this._styles.concat(c) : [c], this._empty, a);
      };
    }

  });

  R.bgColor.closeRe = new RegExp(jg(R.bgColor.close), "g");

  for (let a of Object.keys(R.bgColor.ansi)) {
    if (q.has(a)) continue;
    let b = "bg" + a[0].toUpperCase() + a.slice(1);
    m[b] = {
      get() {
        let b = this.level;
        return function () {
          let c = {
            open: R.bgColor[k[b]][a].apply(null, arguments),
            close: R.bgColor.close,
            closeRe: R.bgColor.closeRe
          };
          return d.call(this, this._styles ? this._styles.concat(c) : [c], this._empty, a);
        };
      }

    };
  }

  let r = Object.defineProperties(() => {}, m);
  Object.defineProperties(c.prototype, m);
  a.exports = c();
  a.exports.supportsColor = g;
  a.exports.default = a.exports;
});

let Fg = "win32" !== process.platform || process.env.CI || "xterm-256color" === process.env.TERM,
    Gg = {
  info: Eg.blue("\u2139"),
  success: Eg.green("\u2714"),
  warning: Eg.yellow("\u26a0"),
  error: Eg.red("\u2716")
},
    Hg = {
  info: Eg.blue("i"),
  success: Eg.green("\u221a"),
  warning: Eg.yellow("\u203c"),
  error: Eg.red("\u00d7")
};

var Ig = Fg ? Gg : Hg,
    Jg = ({
  onlyFirst: a = !1
} = {}) => RegExp("[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", a ? void 0 : "g"),
    Kg = a => "string" === typeof a ? a.replace(Jg(), "") : a,
    Lg = t(function (a) {
  var b = function () {
    function a(b, c, d, k) {
      function e(b, d) {
        if (null === b) return null;
        if (0 == d || "object" != typeof b) return b;
        if (a.__isArray(b)) var m = [];else if (a.__isRegExp(b)) m = new RegExp(b.source, f(b)), b.lastIndex && (m.lastIndex = b.lastIndex);else if (a.__isDate(b)) m = new Date(b.getTime());else {
          if (u && Buffer.isBuffer(b)) return m = Buffer.allocUnsafe ? Buffer.allocUnsafe(b.length) : new Buffer(b.length), b.copy(m), m;

          if ("undefined" == typeof k) {
            var q = Object.getPrototypeOf(b);
            m = Object.create(q);
          } else m = Object.create(k), q = k;
        }

        if (c) {
          var r = g.indexOf(b);
          if (-1 != r) return h[r];
          g.push(b);
          h.push(m);
        }

        for (var z in b) {
          var A;
          q && (A = Object.getOwnPropertyDescriptor(q, z));
          A && null == A.set || (m[z] = e(b[z], d - 1));
        }

        return m;
      }

      "object" === typeof c && (d = c.depth, k = c.prototype, c = c.circular);
      var g = [],
          h = [],
          u = "undefined" != typeof Buffer;
      "undefined" == typeof c && (c = !0);
      "undefined" == typeof d && (d = Infinity);
      return e(b, d);
    }

    function b(a) {
      return Object.prototype.toString.call(a);
    }

    function f(a) {
      var b = "";
      a.global && (b += "g");
      a.ignoreCase && (b += "i");
      a.multiline && (b += "m");
      return b;
    }

    a.clonePrototype = function (a) {
      function b() {}

      if (null === a) return null;
      b.prototype = a;
      return new b();
    };

    a.__objToStr = b;

    a.__isDate = function (a) {
      return "object" === typeof a && "[object Date]" === b(a);
    };

    a.__isArray = function (a) {
      return "object" === typeof a && "[object Array]" === b(a);
    };

    a.__isRegExp = function (a) {
      return "object" === typeof a && "[object RegExp]" === b(a);
    };

    a.__getRegExpFlags = f;
    return a;
  }();

  a.exports && (a.exports = b);
});

function Mg(a, b) {
  a = a || {};
  Object.keys(b).forEach(function (c) {
    "undefined" === typeof a[c] && (a[c] = Lg(b[c]));
  });
  return a;
}

var Ng = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]],
    Og = {
  nul: 0,
  control: 0
};

function Pg(a) {
  return Qg(a, Og);
}

function Qg(a, b) {
  if ("string" !== typeof a) return Rg(a, b);

  for (var c = 0, d = 0; d < a.length; d++) {
    var f = Rg(a.charCodeAt(d), b);
    if (0 > f) return -1;
    c += f;
  }

  return c;
}

function Rg(a, b) {
  if (0 === a) return b.nul;
  if (32 > a || 127 <= a && 160 > a) return b.control;

  a: {
    b = 0;
    var c = Ng.length - 1;
    if (!(a < Ng[0][0] || a > Ng[c][1])) for (; c >= b;) {
      var d = Math.floor((b + c) / 2);
      if (a > Ng[d][1]) b = d + 1;else if (a < Ng[d][0]) c = d - 1;else {
        b = !0;
        break a;
      }
    }
    b = !1;
  }

  return b ? 0 : 1 + (4352 <= a && (4447 >= a || 9001 == a || 9002 == a || 11904 <= a && 42191 >= a && 12351 != a || 44032 <= a && 55203 >= a || 63744 <= a && 64255 >= a || 65040 <= a && 65049 >= a || 65072 <= a && 65135 >= a || 65280 <= a && 65376 >= a || 65504 <= a && 65510 >= a || 131072 <= a && 196605 >= a || 196608 <= a && 262141 >= a));
}

Pg.config = function (a) {
  a = Mg(a || {}, Og);
  return function (b) {
    return Qg(b, a);
  };
};

var Sg = ({
  stream: a = process.stdout
} = {}) => !(!a || !a.isTTY || "dumb" === process.env.TERM || "CI" in process.env),
    Tg = V;

function V(a) {
  Stream.apply(this);
  a = a || {};
  this.writable = this.readable = !0;
  this.muted = !1;
  this.on("pipe", this._onpipe);
  this.replace = a.replace;
  this._prompt = a.prompt || null;
  this._hadControl = !1;
}

V.prototype = Object.create(Stream.prototype);
Object.defineProperty(V.prototype, "constructor", {
  value: V,
  enumerable: !1
});

V.prototype.mute = function () {
  this.muted = !0;
};

V.prototype.unmute = function () {
  this.muted = !1;
};

Object.defineProperty(V.prototype, "_onpipe", {
  value: Ug,
  enumerable: !1,
  writable: !0,
  configurable: !0
});

function Ug(a) {
  this._src = a;
}

Object.defineProperty(V.prototype, "isTTY", {
  get: Vg,
  set: Wg,
  enumerable: !0,
  configurable: !0
});

function Vg() {
  return this._dest ? this._dest.isTTY : this._src ? this._src.isTTY : !1;
}

function Wg(a) {
  Object.defineProperty(this, "isTTY", {
    value: a,
    enumerable: !0,
    writable: !0,
    configurable: !0
  });
}

Object.defineProperty(V.prototype, "rows", {
  get: function () {
    return this._dest ? this._dest.rows : this._src ? this._src.rows : void 0;
  },
  enumerable: !0,
  configurable: !0
});
Object.defineProperty(V.prototype, "columns", {
  get: function () {
    return this._dest ? this._dest.columns : this._src ? this._src.columns : void 0;
  },
  enumerable: !0,
  configurable: !0
});

V.prototype.pipe = function (a, b) {
  this._dest = a;
  return Stream.prototype.pipe.call(this, a, b);
};

V.prototype.pause = function () {
  if (this._src) return this._src.pause();
};

V.prototype.resume = function () {
  if (this._src) return this._src.resume();
};

V.prototype.write = function (a) {
  if (this.muted) {
    if (!this.replace) return !0;
    if (a.match(/^\u001b/)) return 0 === a.indexOf(this._prompt) && (a = a.substr(this._prompt.length), a = a.replace(/./g, this.replace), a = this._prompt + a), this._hadControl = !0, this.emit("data", a);
    this._prompt && this._hadControl && 0 === a.indexOf(this._prompt) && (this._hadControl = !1, this.emit("data", this._prompt), a = a.substr(this._prompt.length));
    a = a.toString().replace(/./g, this.replace);
  }

  this.emit("data", a);
};

V.prototype.end = function (a) {
  this.muted && (a = a && this.replace ? a.toString().replace(/./g, this.replace) : null);
  a && this.emit("data", a);
  this.emit("end");
};

function Xg(a) {
  return function () {
    var b = this._dest,
        c = this._src;
    b && b[a] && b[a].apply(b, arguments);
    c && c[a] && c[a].apply(c, arguments);
  };
}

V.prototype.destroy = Xg("destroy");
V.prototype.destroySoon = Xg("destroySoon");
V.prototype.close = Xg("close");
let Yg = Symbol("text"),
    Zg = Symbol("prefixText");

class $g {
  constructor() {
    this.requests = 0;
    this.mutedStream = new Tg();
    this.mutedStream.pipe(process.stdout);
    this.mutedStream.mute();
    let a = this;

    this.ourEmit = function (b, c, ...d) {
      let {
        stdin: f
      } = process;
      0 < a.requests || f.emit === a.ourEmit ? "keypress" !== b && ("data" === b && c.includes(3) && process.emit("SIGINT"), Reflect.apply(a.oldEmit, this, [b, c, ...d])) : Reflect.apply(process.stdin.emit, this, [b, c, ...d]);
    };
  }

  start() {
    this.requests++;
    1 === this.requests && this.realStart();
  }

  stop() {
    if (0 >= this.requests) throw Error("`stop` called more times than `start`");
    this.requests--;
    0 === this.requests && this.realStop();
  }

  realStart() {
    "win32" !== process.platform && (this.rl = readline.createInterface({
      input: process.stdin,
      output: this.mutedStream
    }), this.rl.on("SIGINT", () => {
      0 === process.listenerCount("SIGINT") ? process.emit("SIGINT") : (this.rl.close(), process.kill(process.pid, "SIGINT"));
    }));
  }

  realStop() {
    "win32" !== process.platform && (this.rl.close(), this.rl = void 0);
  }

}

let ah = new $g();

class bh {
  constructor(a) {
    "string" === typeof a && (a = {
      text: a
    });
    this.options = {
      text: "",
      color: "cyan",
      stream: process.stderr,
      discardStdin: !0,
      ...a
    };
    this.spinner = this.options.spinner;
    this.color = this.options.color;
    this.hideCursor = !1 !== this.options.hideCursor;
    this.interval = this.options.interval || this.spinner.interval || 100;
    this.stream = this.options.stream;
    this.id = void 0;
    this.isEnabled = "boolean" === typeof this.options.isEnabled ? this.options.isEnabled : Sg({
      stream: this.stream
    });
    this.text = this.options.text;
    this.prefixText = this.options.prefixText;
    this.linesToClear = 0;
    this.indent = this.options.indent;
    this.discardStdin = this.options.discardStdin;
    this.isDiscardingStdin = !1;
  }

  get indent() {
    return this._indent;
  }

  set indent(a = 0) {
    if (!(0 <= a && Number.isInteger(a))) throw Error("The `indent` option must be an integer from 0 and up");
    this._indent = a;
  }

  _updateInterval(a) {
    void 0 !== a && (this.interval = a);
  }

  get spinner() {
    return this._spinner;
  }

  set spinner(a) {
    this.frameIndex = 0;

    if ("object" === typeof a) {
      if (void 0 === a.frames) throw Error("The given spinner must have a `frames` property");
      this._spinner = a;
    } else if ("win32" === process.platform) this._spinner = gg.line;else if (void 0 === a) this._spinner = gg.dots;else if (gg[a]) this._spinner = gg[a];else throw Error(`There is no built-in spinner named '${a}'. See https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json for a full list.`);

    this._updateInterval(this._spinner.interval);
  }

  get text() {
    return this[Yg];
  }

  get prefixText() {
    return this[Zg];
  }

  get isSpinning() {
    return void 0 !== this.id;
  }

  updateLineCount() {
    let a = this.stream.columns || 80;
    this.lineCount = Kg(("string" === typeof this[Zg] ? this[Zg] + "-" : "") + "--" + this[Yg]).split("\n").reduce((b, c) => b + Math.max(1, Math.ceil(Pg(c) / a)), 0);
  }

  set text(a) {
    this[Yg] = a;
    this.updateLineCount();
  }

  set prefixText(a) {
    this[Zg] = a;
    this.updateLineCount();
  }

  frame() {
    let {
      frames: a
    } = this.spinner,
        b = a[this.frameIndex];
    this.color && (b = Mf[this.color](b));
    this.frameIndex = ++this.frameIndex % a.length;
    return ("string" === typeof this.prefixText && "" !== this.prefixText ? this.prefixText + " " : "") + b + ("string" === typeof this.text ? " " + this.text : "");
  }

  clear() {
    if (!this.isEnabled || !this.stream.isTTY) return this;

    for (let a = 0; a < this.linesToClear; a++) 0 < a && this.stream.moveCursor(0, -1), this.stream.clearLine(), this.stream.cursorTo(this.indent);

    this.linesToClear = 0;
    return this;
  }

  render() {
    this.clear();
    this.stream.write(this.frame());
    this.linesToClear = this.lineCount;
    return this;
  }

  start(a) {
    a && (this.text = a);
    if (!this.isEnabled) return this.text && this.stream.write(`- ${this.text}\n`), this;
    if (this.isSpinning) return this;
    this.hideCursor && fg.hide(this.stream);
    this.discardStdin && process.stdin.isTTY && (this.isDiscardingStdin = !0, ah.start());
    this.render();
    this.id = setInterval(this.render.bind(this), this.interval);
    return this;
  }

  stop() {
    if (!this.isEnabled) return this;
    clearInterval(this.id);
    this.id = void 0;
    this.frameIndex = 0;
    this.clear();
    this.hideCursor && fg.show(this.stream);
    this.discardStdin && process.stdin.isTTY && this.isDiscardingStdin && (ah.stop(), this.isDiscardingStdin = !1);
    return this;
  }

  succeed(a) {
    return this.stopAndPersist({
      symbol: Ig.success,
      text: a
    });
  }

  fail(a) {
    return this.stopAndPersist({
      symbol: Ig.error,
      text: a
    });
  }

  warn(a) {
    return this.stopAndPersist({
      symbol: Ig.warning,
      text: a
    });
  }

  info(a) {
    return this.stopAndPersist({
      symbol: Ig.info,
      text: a
    });
  }

  stopAndPersist(a = {}) {
    var b = a.prefixText || this.prefixText;
    b = "string" === typeof b && "" !== b ? b + " " : "";
    var c = a.text || this.text;
    c = "string" === typeof c ? " " + c : "";
    this.stop();
    this.stream.write(`${b}${a.symbol || " "}${c}\n`);
    return this;
  }

}

function ch(a) {
  return new bh(a);
}

ch.promise = (a, b) => {
  if ("function" !== typeof a.then) throw new TypeError("Parameter `action` must be a Promise");
  let c = new bh(b);
  c.start();

  (async () => {
    try {
      await a, c.succeed();
    } catch (d) {
      c.fail();
    }
  })();

  return c;
};

let {
  spawn: dh
} = require$$1,
    eh = {
  shell: !0,
  stdio: "inherit"
};

var W = async (...a) => {
  for (let b of a) {
    b = b.trim();
    const a = b.split("\n");
    1 < a.length && (b = a.map((b, c) => !/\\\s*?$/m.test(b) && c < a.length - 1 ? b + " \\" : b).join("\n"));
    b = b.split(" ");
    await new Promise((a, c) => {
      const d = b.shift(),
            f = b;
      "echo" !== d.trim() && aa.SHELL_LOG && console.log(I.grey(`\n> ${d} ${f.join(" ")}\n`));
      dh(d, f, aa.SHELL_OPTIONS || eh).on("exit", b => {
        0 === b ? a() : aa.SHELL_STRICT ? process.exit(1) : c(Error("Exited with code: " + b));
      });
    });
  }

  aa.SHELL_LOG && console.log();
};

"undefined" === typeof goog && (globalThis.goog = {
  define: (a, b) => b
});
global.SHELL_STRICT = !0;
global.SHELL_LOG = !0;
global.SHELL_OPTIONS = {
  shell: !0,
  stdio: "inherit"
};

let X = (...a) => console.log("\u001b[96m%s\u001b[0m", "[\ud835\udcf0\ud835\udcf7\ud835\udcff]" + ` ${a.join(" ")}`),
    fh = (a = {}) => Object.entries(a).map(([a, c]) => `${a}@${c}`),
    gh = async (...a) => {
  console.log(`\n> npm ${a.join(" ")}\n`);
  await spawnSync("npm", [...a, "--loglevel error"], global.SHELL_OPTIONS);
},
    hh = (a = ".") => {
  a = sysPath.resolve(process.cwd(), a, "package.json");
  return existsSync(a) ? JSON.parse(readFileSync(a)) : {};
},
    ih = (a, {
  directory: b = ".",
  spaces: c = 2
} = {}) => {
  b = sysPath.resolve(process.cwd(), b, "package.json");
  existsSync(b) && writeFileSync(b, JSON.stringify(a, null, c));
},
    jh = a => {
  let b, c;
  "@" === a[0] && ([b, a] = a.split("/"));
  [a, c] = a.split("@");
  c || (c = "latest");
  return {
    name: a,
    org: (b || "").substr(1),
    version: c
  };
},
    kh = a => {
  if (!fs.existsSync(sysPath.resolve(process.cwd(), ".gnv"))) {
    if (a) return !1;
    X("Oops! Not inside a gnv project.");
    process.exit(1);
  }

  return !0;
},
    lh = sysPath.resolve(process.cwd(), sysPath.dirname("package.js"));

hh(lh);

let mh = async a => {
  a = hh(a);
  a = fh(a.gnvDependencies);
  if (!a.length) return X("No gnvDependencies to install.");
  X("Adding local gnv deps to node_modules:");
  await gh("i", "-f", "--no-save", ...a);
  X(`Installed ${a.length} packages.`);
},
    nh = async a => {
  var b = hh(a);
  a = fh(b.peerDependencies);
  if (!a.length) return X("No peerDependencies to install.");
  b = Object.keys(b.peerDependencies);
  X("Adding global peerDeps:");
  await gh("i", "-g", "--no-save", ...a);
  X("Linking peer dependencies locally...");
  await gh("link", "-f", "--no-save", ...b);
  X(`Installed and linked ${a.length} packages.`);
},
    oh = hh(lh).version || "",
    ph = () => {
  global.SHELL_LOG = truncateSync;
  global.SHELL_OPTIONS = {
    shell: !0,
    stdio: "inherit"
  };
},
    qh = async () => {
  await W('echo "\\n------- Building dev/... -------"', "npm run build:dev");
},
    rh = async () => {
  await W('echo "\\n------- Building dist/... -------"', "npm run build:dist", 'echo "\\n------- Minifying dist/... -------"', "npm run minify:dist", "npm run build:exe", "npm run format:clis");
},
    th = async ({
  dev: a = !1
} = {}) => {
  ph();
  await sh();
  await qh();
  a || (await rh());
},
    sh = async () => {
  console.log("Cleaning project...");
  await W("rm -rf ./dev/* ./dist/*");
},
    uh = process.cwd(),
    vh = basename(uh);

D.command("get-peer-deps").description("Install the global peer dependencies for this program. You can also install the peerDependencies manually.").action(void 0);
D.command("add <pkgs...>").description("Add the given packages as gnv development dependencies.").option("-P, --peer", "Add as a peerDependency instead.", !1).action(async (a, {
  peer: b = !1
} = {}) => {
  const c = hh();

  for (const d of a) {
    const {
      name: f,
      org: e,
      version: g
    } = jh(d);
    (b ? c.peerDependencies : c.gnvDependencies)[e ? `@${e}/${f}` : f] = g;
    ih(c);
    X("Added", a.length, "packages.");
  }
});
D.command("remove <pkgs...>").description("Remove the given packages from gnv development dependencies.").option("-P, --peer", "Remove from peerDependencies instead.", !1).action(async (a, {
  peer: b = !1
} = {}) => {
  const c = hh();

  for (const d of a) {
    const {
      name: a,
      org: e
    } = jh(d);
    delete (b ? c.peerDependencies : c.gnvDependencies)[e ? `@${e}/${a}` : a];
  }
});
D.command("build").description("Build this workspace and run tests when finished. Final output will be in dist/.").option("-d, --dev", "Build the dev bundle.").option("-s, --skip-tests", "Do not run tests after build is finished.").action(th);
D.command("clean").description("Clean the gnv workspace.").action(sh);
D.command("create <name>").description("Create a new gnv workspace and push to GitHub. Use <organization/name> to create for an organization. Requires `hub` package or -ng flag.").option("-ng, --no-github", "Do not use GitHub integration. Implies -ns flag.").option("-ns, --no-submodule", "Do not create as a submodule, even if inside a git repository.").action(async (a, b) => {
  if (existsSync(a)) return console.log(I.bgRed(I.whiteBright(" ERROR ")), ...["File or directory already exists."], "\n");
  global.SHELL_LOG = !1;
  global.SHELL_OPTIONS = {
    shell: !0,
    stdio: ["ignore", "ignore", "inherit"]
  };
  const c = a.split("/")[1] || a,
        d = ch("Creating new project... ").start();

  try {
    await W(`git clone --recursive --quiet ${"https://github.com/TeleworkInc/gnv-template.git"} ${c}`, `sed -i s,gnv-template,${c},g ` + `${c}/README.md ${c}/package.json`, `cd ${c} && ` + "git merge --squash && git remote remove origin && cd .."), b.github && (await W(`cd ${c} && hub init -q && ` + `hub create -c ${a} && ` + "git add -A --ignore-errors && git commit -qm 'New gnv project created' && git push -f -qu origin master"), console.log(I.bgCyan(I.whiteBright(" SUCCESS ")), ...["GitHub repository link copied to clipboard!"], "\n")), b.github && b.submodule && fs.existsSync(".git") && (await W(`cd ${c} && GIT_REMOTE=$(git remote get-url origin) && ` + `cd .. && git rm -rf --ignore-unmatch ${c} && ` + "git submodule add --quiet $GIT_REMOTE")), d.succeed("Created project at " + I.blueBright(...[c]) + "\n"), console.log("Installing and linking..."), await W(`cd ${c} && npm i -f --no-save --silent && ` + "npm link -f --no-save --silent");
  } catch (f) {
    return d.fail("Something went wrong. :-(\n");
  }
});
D.command("develop").description("Start developing, and rebuild dev bundles when changes are made to the workspace.").action(async () => {
  ph();
  lf.watch("{lib,exports}/**/*.js", {
    ignoreInitial: !0
  }).on("all", () => th(program));
  await th();
  console.log("\nListening for file changes in", I.blueBright(...["lib/"]));
});
D.command("install [directory]").description("Install all dependencies in [directory]/package.json. Defaults to working directory.").option("-d, --dev", "Use dev mode.").action(async (a = ".", {
  dev: b = !1
} = {}) => {
  const c = process.cwd();
  process.chdir(sysPath.resolve(c, a));
  kh();
  fs.existsSync("dist") || fs.mkdirSync("dist");
  fs.existsSync("dist/cli.cjs") || fs.closeSync(fs.openSync("dist/cli.cjs", "a"));
  X("Linking this package to global bin...");
  await gh("link", "-f", "--no-save", "--silent");
  b ? (X("Dev mode: Installing local & peer dependencies."), await mh(), await nh(), X("Done! Your development CLI should be ready at " + `\`${sysPath.basename(process.cwd())}-dev\`.`)) : (X("Release mode: Installing peer dependencies only."), await nh());
  process.chdir(c);
});
D.command("publish [level]").description("Publish this package to NPM using `npm publish`. Removes dev CLI from package.json to prevent installation issues and bumps the version by [level] (patch, minor, or major). Defaults to patch.").action(async (a = "patch") => {
  ph();
  await W(`npm version ${a} -f --silent --no-save`);
  a = hh();
  const b = a.name,
        c = JSON.parse(JSON.stringify(a));
  delete c.bin[`${b}-dev`];
  ih(c);

  try {
    console.log("Re-building project with `build` script prior to publish.");
    await W("npm run build");
    await W("npm publish");
    const b = hh().version;
    ih({ ...a,
      version: b
    });
  } catch (d) {
    console.log("Something went wrong. Package not published."), ih(a);
  }
});
D.command("test").description("Run mocha tests.").action(async () => await W("mocha"));
let wh = kh(!0) ? ` ${vh} ` : "",
    xh = kh(!0) && existsSync("./lib") && existsSync("./exports") ? "\n" + ma("./lib", {
  dirsFirst: !0
}) + "\n\n" + ma("./exports", {
  dirsFirst: !0
}) : "";
console.log("\n", I.bgBlue(` --- \ud835\udcf0\ud835\udcf7\ud835\udcff ${oh} --- `), "\n\n", I.grey(`installed at: ${lh}`), "\n");
wh && console.log(I.bgBlue(I.whiteBright(wh)), "\n");
xh && console.log(I.blueBright(xh), "\n");

try {
  D.exitOverride(), D.parse(process.argv);
} catch (a) {
  console.log("\n");
}

export default {};
