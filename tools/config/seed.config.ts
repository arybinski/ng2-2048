import {argv} from 'yargs';
import {join} from 'path';
import {InjectableDependency, Environments} from './seed.config.interfaces';

export const ENVIRONMENTS: Environments = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod'
};

export class SeedConfig {
  PORT                 = argv['port']                        || 5555;
  PROJECT_ROOT         = join(__dirname, '../..');
  ENV                  = getEnvironment();
  DEBUG                = argv['debug']                       || false;
  DOCS_PORT            = argv['docs-port']                   || 4003;
  COVERAGE_PORT        = argv['coverage-port']               || 4004;
  APP_BASE             = argv['base']                        || '/';

  ENABLE_HOT_LOADING   = argv['hot-loader'];
  HOT_LOADER_PORT      = 5578;

  BOOTSTRAP_MODULE     = 'boot';

  APP_TITLE            = 'ng2-2048';

  APP_SRC              = 'app';
  ASSETS_SRC           = `${this.APP_SRC}/assets`;
  CSS_SRC              = `${this.APP_SRC}/assets`;
  FONTS_SRC            = `${this.APP_SRC}/assets/fonts/*`;

  TOOLS_DIR            = 'tools';
  SEED_TASKS_DIR       = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'seed');
  DOCS_DEST            = 'docs';
  DIST_DIR             = 'dist';
  DEV_DEST             = `${this.DIST_DIR}/dev`;
  PROD_DEST            = `${this.DIST_DIR}/prod`;
  TMP_DIR              = `${this.DIST_DIR}/tmp`;
  APP_DEST             = `${this.DIST_DIR}/${this.ENV}`;
  CSS_DEST             = `${this.APP_DEST}/assets`;
  JS_DEST              = `${this.APP_DEST}/js`;
  FONTS_DEST           = `${this.APP_DEST}/fonts`;
  VERSION              = appVersion();

  CSS_PROD_BUNDLE      = 'main.css';
  JS_PROD_SHIMS_BUNDLE = 'shims.js';
  JS_PROD_APP_BUNDLE   = 'app.js';

  VERSION_NPM          = '2.14.2';
  VERSION_NODE         = '4.0.0';

  FONTS_DEPENDENCIES: string[] = [];

  NPM_DEPENDENCIES: InjectableDependency[] = [
    { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims', env: ENVIRONMENTS.DEVELOPMENT },
    { src: 'zone.js/dist/zone.js', inject: 'libs' },
    { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
    { src: 'es6-shim/es6-shim.js', inject: 'shims' },
    { src: 'systemjs/dist/system.src.js', inject: 'shims', env: ENVIRONMENTS.DEVELOPMENT },
    { src: 'rxjs/bundles/Rx.js', inject: 'libs', env: ENVIRONMENTS.DEVELOPMENT }
  ];

  // Declare local files that needs to be injected
  APP_ASSETS: InjectableDependency[] = [
    { src: `${this.CSS_SRC}/main.css`, inject: true, vendor: false }
  ];

  get DEPENDENCIES(): InjectableDependency[] {
    return normalizeDependencies(this.NPM_DEPENDENCIES.filter(filterDependency.bind(null, this.ENV)))
      .concat(this.APP_ASSETS.filter(filterDependency.bind(null, this.ENV)));
  }


  // ----------------
  // SystemsJS Configuration.
  protected SYSTEM_CONFIG_DEV = {
    defaultJSExtensions: true,
    packageConfigPaths: [
      `${this.APP_BASE}node_modules/*/package.json`,
      `${this.APP_BASE}node_modules/**/package.json`,
      `${this.APP_BASE}node_modules/@angular/*/package.json`
    ],
    paths: {
      [this.BOOTSTRAP_MODULE]: `${this.APP_BASE}${this.BOOTSTRAP_MODULE}`,
      'rxjs/*': `${this.APP_BASE}rxjs/*`,
      'app/*': `/app/*`,
      '*': `${this.APP_BASE}node_modules/*`
    },
    packages: {
      'angular2-in-memory-web-api': {main: 'index.js', defaultExtension: 'js'},
      '@angular/common': {main: 'index.js', defaultExtension: 'js'},
      '@angular/compiler': {main: 'index.js', defaultExtension: 'js'},
      '@angular/core': {main: 'index.js', defaultExtension: 'js'},
      '@angular/http': {main: 'index.js', defaultExtension: 'js'},
      '@angular/platform-browser': {main: 'index.js', defaultExtension: 'js'},
      '@angular/platform-browser-dynamic': {main: 'index.js', defaultExtension: 'js'},
      '@angular/router': {main: 'index.js', defaultExtension: 'js'},
      '@angular/router-deprecated': {main: 'index.js', defaultExtension: 'js'},
      '@angular/upgrade': {main: 'index.js', defaultExtension: 'js'},
      rxjs: {defaultExtension: false},
      '@ngrx/core': {main: 'index.js', format: 'cjs'},
      '@ngrx/store': {main: 'index.js', format: 'cjs'}
    },
    map: {
      'rxjs':                       `${this.APP_BASE}node_modules/rxjs`,
      '@ngrx':                      `${this.APP_BASE}node_modules//@ngrx`
    }
  };

  SYSTEM_CONFIG = this.SYSTEM_CONFIG_DEV;

  SYSTEM_BUILDER_CONFIG = {
    defaultJSExtensions: true,
    packageConfigPaths: [
      join(this.PROJECT_ROOT, 'node_modules', '*', 'package.json'),
      join(this.PROJECT_ROOT, 'node_modules', '@angular', '*', 'package.json'),
      join(this.PROJECT_ROOT, 'node_modules', '@ngrx', '*', 'package.json')
    ],
    paths: {
      [`${this.TMP_DIR}/*`]: `${this.TMP_DIR}/*`,
      '@angular/*': `${this.PROJECT_ROOT}/node_modules/@angular/**/*`,
      '@angular/platform-browser-dynamic/*': `${this.PROJECT_ROOT}/node_modules/@angular/platform-browser-dynamic/*`,
      '@angular/core/*': `${this.PROJECT_ROOT}/node_modules/@angular/core/*`,
      '@angular/common/*': `${this.PROJECT_ROOT}/node_modules/@angular/common/*`,
      '@angular/compiler/*': `${this.PROJECT_ROOT}/node_modules/@angular/compiler/*`,
      '@angular/platform-browser/*': `${this.PROJECT_ROOT}/node_modules/@angular/platform-browser/*`,
      '*': 'node_modules/*'
    },
    packages: {
      '@ngrx/core': {main: 'index.js', defaultExtension: 'js'},
      '@ngrx/store': {main: 'index.js', defaultExtension: 'js'},
      'angular2-in-memory-web-api': {main: 'index.js', defaultExtension: 'js'},
      '@angular/common': {main: 'index.js', defaultExtension: 'js'},
      '@angular/compiler': {main: 'index.js', defaultExtension: 'js'},
      '@angular/core': {main: 'index.js', defaultExtension: 'js'},
      '@angular/http': {main: 'index.js', defaultExtension: 'js'},
      '@angular/platform-browser': {main: 'index.js', defaultExtension: 'js'},
      '@angular/platform-browser-dynamic': {main: 'index.js', defaultExtension: 'js'},
      '@angular/router': {main: 'index.js', defaultExtension: 'js'},
      '@angular/router-deprecated': {main: 'index.js', defaultExtension: 'js'},
      '@angular/upgrade': {main: 'index.js', defaultExtension: 'js'},
      'rxjs': { defaultExtension: 'js' }
    },
    map: {
      'angular2-in-memory-web-api': `${this.PROJECT_ROOT}/node_modules/angular2-in-memory-web-api`,
      '@angular/platform-browser-dynamic': `${this.PROJECT_ROOT}/node_modules/@angular/platform-browser-dynamic`,
      '@angular/core': `${this.PROJECT_ROOT}/node_modules/@angular/core`,
      '@angular/common': `${this.PROJECT_ROOT}/node_modules/@angular/common`,
      '@angular/compiler': `${this.PROJECT_ROOT}/node_modules/@angular/compiler`,
      '@angular/platform-browser': `${this.PROJECT_ROOT}/node_modules/@angular/platform-browser`,
      '@ngrx':   `${this.PROJECT_ROOT}/node_modules/@ngrx`
    }
  };

  // ----------------
  // Autoprefixer configuration.
  BROWSER_LIST = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // ----------------
  // Browser Sync configuration.
  BROWSER_SYNC_CONFIG: any = {
    middleware: [require('connect-history-api-fallback')({index: `${this.APP_BASE}index.html`})],
    port: this.PORT,
    startPath: this.APP_BASE,
    server: {
      baseDir: `${this.DIST_DIR}/empty/`,
      routes: {
        [`${this.APP_BASE}${this.APP_DEST}`]: this.APP_DEST,
        [`${this.APP_BASE}node_modules`]: 'node_modules',
        [`${this.APP_BASE.replace(/\/$/,'')}`]: this.APP_DEST
      }
    }
  };
}




// --------------
// Utils.

function filterDependency(env: string, d: InjectableDependency): boolean {
  if (!d.env) {
    d.env = Object.keys(ENVIRONMENTS).map(k => ENVIRONMENTS[k]);
  }
  if (!(d.env instanceof Array)) {
    (<any>d).env = [d.env];
  }
  return d.env.indexOf(env) >= 0;
}

export function normalizeDependencies(deps: InjectableDependency[]) {
  deps
    .filter((d:InjectableDependency) => !/\*/.test(d.src)) // Skip globs
    .forEach((d:InjectableDependency) => d.src = require.resolve(d.src));
  return deps;
}

function appVersion(): number|string {
  var pkg = require('../../package.json');
  return pkg.version;
}


function getEnvironment() {
  let base:string[] = argv['_'];
  let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
  let env = (argv['env'] || '').toLowerCase();
  if ((base && prodKeyword) || env === ENVIRONMENTS.PRODUCTION) {
    return ENVIRONMENTS.PRODUCTION;
  } else {
    return ENVIRONMENTS.DEVELOPMENT;
  }
}
