var all = {};

// TODO, abstract, fix non-relative paths
all['famous/webgl-shaders/glslify'] = function(caller, module, data) {
  for (var key in data) {
    if (key !== 'sourceOnly')
      data[key] = modules.require(caller, data[key]);
  }
  return data;
};

modules = {
  all: all,

  require: function modulesRequire(caller, module) {
    var req = caller.replace(/[^\/]*$/, '') + module.replace(/^\.\//, '');
    // console.log('module require', caller, module, req);
    while (req.match(/\/[^\/]+\/\.\./))
      req = req.replace(/\/[^\/]+\/\.\./, '');

    if (!all[req])
      console.error("[modules] Couldn't find: " + req + " for " + caller);
    else if (req === 'famous/webgl-shaders/glslify')
      return _.partial(all[req], caller, module);
    return all[req];
  },

  export: function modulesExport(module) {
    // console.log('module export', module);
    all[module.name.replace(/\/index$/, '')] = module.exports;
  }
}

