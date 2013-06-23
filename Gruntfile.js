module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        laxcomma: true,
        supernew: true,
        expr: true
      },
      all: ['Gruntfile.js', 'spec/**/*.js', 'src/**/*.js']
    },
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

  grunt.registerTask('default', 'jasmine_node');
  grunt.registerTask('test', ['jshint', 'jasmine_node']);
};
