module.exports = function (grunt) {
  grunt.initConfig({
    jasmine_node: {
      specNameMatcher: "spec",
      extensions: 'js',
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'jasmine_node')
};
