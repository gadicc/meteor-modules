var fs = Npm.require('fs');
var path = Npm.require('path');
var exec = Npm.require('sync-exec');

// build plugins must be synchronous, gslify is async
var glslify_bin = path.join(
  process.cwd(), '.meteor', 'local', 'isopacks', 'gadicohen_modules',
  'plugin.modules.require.os', 'npm', 'modules.require', 'node_modules', '.bin', 'glslify');
//var glslify = Npm.require('glslify');  <-- in package.js to run in exec
//var glslify_bundle = require('glslify-bundle');
//var glslify_deps   = require('glslify-deps');

function dprocess(data, output, touched, cut) {
  var key, match, requires = [], re = /require\((['"]+)(.*?)\1\)/g;
  while ((match = re.exec(data.contents)))
    requires.push(path.resolve(path.dirname(data.fullInputPath), match[2]));

  match = data.contents.match(/glslify\((\{[\S\s]*\})\)/);
  if (match) {
    eval("match = " + match[1].replace(/\s*/, ' '));
    glslify(match, data, output, touched, cut);
  }

  _.each(requires, function(file) {
    if (touched[file]) return;
    touched[file] = 1;

    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, 'index.js');
    else if (fs.existsSync(file+'.js'))
      file += '.js';
    else {
      if (!file.match(/glslify/))
        console.log('missing ' + file);
      return; // _each
    }

    var outData = {
      fullInputPath: file,
      inputPath: file.substr(cut),
      module: file.substr(cut).replace(/\.js$/, ''),
      contents: fs.readFileSync(file).toString('utf-8')      
    };

    dprocess(outData, output, touched, cut);
    output.push(outData)
  });

}

function handler(compileStep) {
  var cut = path.dirname(compileStep.fullInputPath).length + 1;
  var base = path.dirname(compileStep.inputPath);

  var output = [], touched = {};

  var outData = {
    inputPath: compileStep.inputPath,
    fullInputPath: compileStep.fullInputPath,
    contents: compileStep.read().toString('utf-8'),
    module: '(moduleRoot)'
  };
  dprocess(outData, output, touched, cut);
  output.push(outData);

  /*
  _.each(output, function(file) {
    console.log(file.fullInputPath);
  });
  */

  _.each(output, function(file) {
    //console.log(root, fileStats.name);
    var contents;
    if (file.type === 'glsl') {
      contents = 'modules.export(' + JSON.stringify({
        name: file.module,
        exports: exec(
          glslify_bin + ' ' + path.basename(file.inputPath),
          { cwd: path.dirname(file.fullInputPath) }
        ).stdout
      }) + ');\n';
    } else {
      contents = '' +
        'var module = { name: ' + JSON.stringify(file.module) + ', exports: {} };\n' +
        'var require = Package.underscore._.partial(modules.require, module.name);\n' +
         file.contents +
        'modules.export(module);\n';
    }

//        if (file.module.match(/dom-render/))
//    console.log(file.module, file.requires);

      //console.log(path.join(file.path, file.name));
    compileStep.addJavaScript({
      path: path.join(base, file.inputPath),
      sourcePath: file.inputPath,
      data: contents
    });
  });

};

Plugin.registerSourceHandler('modules.require', handler);

function glslify(glslData, data, output, touched, cut) {
  var key, sourceOnly, requires = [];
  for (key in glslData) {
    if (key === 'sourceOnly')
      sourceOnly = glslData[key];
    else
      requires.push(path.resolve(path.dirname(data.fullInputPath), glslData[key]));
  }

  _.each(requires, function(file) {
    if (touched[file]) return;
    touched[file] = 1;

    var outData = {
      type: 'glsl',
      fullInputPath: file,
      inputPath: file.substr(cut),
      module: file.substr(cut), /*.replace(/\.js$/, ''), */
      //contents: fs.readFileSync(file).toString('utf-8')      
    };

    output.push(outData)
  });
}