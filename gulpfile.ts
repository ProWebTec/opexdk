let gulp = require('gulp');
let args = require('yargs').argv;
const randomstring = require('randomstring');
require('colors');  //provides: yellow, etc...


//Avoid intellij warning
//Program args:
/** @namespace args.ocmod */

/** @namespace args.vv */
/** @namespace args.cloud */

function loadTasks(slug = null) {
  if (slug) {
    args.m = slug;
  }

  const task = args._.length > 0 ? args._[0]:args.t

  const extensionManifest = require('./my-helpers/extension-manifest-loader').loadManifest({
    "m": args.m
  });

  if (extensionManifest) {

    extensionManifest.private_build_dir = "";
    extensionManifest.private_dist_dir = "";
    if (args['sandbox']) {
      const random = randomstring.generate(5);
      extensionManifest.private_build_dir = `build_${random}`;
      extensionManifest.private_dist_dir = `dist_${random}`;
    }

    require('./gulp-tasks-build/1700-task-clean.js')(extensionManifest);
    require('./gulp-tasks-build/1700-task-create-build-workspace.js')(extensionManifest);
    require('./gulp-tasks-build/2000-task-vqmod.js')(extensionManifest);
    require('./gulp-tasks-build/2300-task-rename-admin.js')(extensionManifest);
    require('./gulp-tasks-build/2600-task-markdown.js')(extensionManifest);
    require('./gulp-tasks-build/2900-task-rename-module-to-upload.js')(extensionManifest);
    require('./gulp-tasks-build/3200-task-translate-to-ocmod.js')(extensionManifest);
    require('./gulp-tasks-build/3500-task-merge-ocmod-install')(extensionManifest);
    require('./gulp-tasks-build/3800-task-fix-install-dot-ocmod-xml')(extensionManifest);
    require('./gulp-tasks-build/4100-task-preserve-upload-folder.js')(extensionManifest);
    require('./gulp-tasks-build/4400-task-package-ocmod.js')(extensionManifest);
    require('./gulp-tasks-build/4500-task-rename-package-for-cloud')(extensionManifest);
    require('./gulp-tasks-build/4700-translate-markdown-to-html-from-dist.js')(extensionManifest);
    require('./gulp-tasks-build/task-package-legacy.js')(extensionManifest);
    require('./gulp-tasks-build/5000-remove-ocmod-ids-from-vqmod.js')(extensionManifest);
    require('./gulp-tasks-build/5100-task-vq2oc2sys.js')(extensionManifest);
    require('./gulp-tasks-build/5150-task-vq2oc2sys-after')(extensionManifest);
    require('./gulp-tasks-build/5200-task-copy-doc-folder')(extensionManifest);
    //require('./gulp-tasks-build/5250-task-markdown-to-html-in-doc-folder')(extensionManifest);
    require('./gulp-tasks-build/5300-task-package.js')(extensionManifest);
    require('./gulp-tasks-build/5600-task-release.js')(extensionManifest);

    require('./gulp-tasks-other/task-deploy')(extensionManifest);
    require('./gulp-tasks-other/task-deploy-compiled')(extensionManifest);
    require('./gulp-tasks-other/task-watch.js')(extensionManifest);
    require('./gulp-tasks-other/task-deploy-compiled-ftp')(extensionManifest);
    require('./gulp-tasks-other/task-deploy-compiled-sftp')(extensionManifest);
    require('./gulp-tasks-other/task-remove-compiled-sftp')(extensionManifest);
    require('./gulp-tasks-other/task-remove-from-ftp')(extensionManifest);
    require('./gulp-tasks-other/task-deploy-to-sftp.js')(extensionManifest);
    require('./gulp-tasks-other/task-watch-and-deploy-to-ftp')(extensionManifest);
    require('./gulp-tasks-other/task-watch-and-deploy-to-sftp')(extensionManifest);
    require('./gulp-tasks-other/task-get-files-from-ftp')(extensionManifest);

  } else {
    // console.log(("✘ Extension: " + args.m + " not found.").yellow);
    console.log(("✘ Extension: " + args.m + " not found."));

    if (task==="create") {
      require('./gulp-tasks-other/task-create')();
    }
    require('./gulp-tasks-other/task-create-simple.js')();
    require('./gulp-tasks-other/task-translate-ocmod-to-vqmod.js')();
    require('./gulp-tasks-other/task-translate-vqmod-to-ocmod.js')();
  }

  if (task==="test2") {
    require('./gulp-tasks-other/task-zzz-test')();
  }
}

//node bin/index-global.js test -m toto --oru "http://opencart.me/demo_offerz/index.php?route=extension/module/ocmod_refresh&secret=2105"
gulp.task("test", function () {
  let args = require('yargs').argv;
  console.log("inside the test task.");
  console.log("module: ", args.m);
  console.log("output: ", args.o);
  console.log("oru: ", args.oru);
  console.log("vqmod args: ", args['exclude-vqmod'] ? 'ok':'ko');
});

module.exports = {
  loadTasks: loadTasks
}