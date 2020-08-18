import shell from 'await-shell';
global.SHELL_LOG = true;
(async function() {
  await shell(
      `google-closure-compiler
        --entry_point dev/universal.mjs
        -O ADVANCED
        --process_common_js_modules
        --module_resolution NODE
        --dependency_mode PRUNE
        --js $(npm root -g)/google-closure-library/closure/goog/base.js
        --js dev/universal.mjs
        --js_output_file dist/exe.js`,
  );
})();
