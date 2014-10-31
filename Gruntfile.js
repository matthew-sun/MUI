module.exports = function(grunt){
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),

		// 提取模块依赖，设置模块id
		transport : {
			options : {
				paths : ["."],
				alias : "<%= pkg.spm.alias %>",
				debug : false
			},

			// mui
			mui : {
				options : {
					idleading : "src/source/"
				},
				files : [
					{
						expand  : true,
						cwd 	: "src",
						src     : ["**/*.js", "<%= exclude %>"],
						dest    : ".build/src",
						filter  : "isFile"
					}
				]
			}

		},

		// 模块合并
		concat : {
			options :{
				paths : ["."],
				include : "all",
				debug : false
			},

			mui : {
				files : [
					{
						expand  : true,
						cwd 	: ".build/src",
						src     : ["**/*.js"],
						dest    : "src/source"
					}
				]
			}

		},

		// 模块压缩
		uglify : {
			all : {
				files : [
					{
						expand 	: true,
						cwd 	: "dist/",
						src 	: ["**/*.js", "!**/*-debug.js"],
						dest	: "dist/"
					}
				]
			},

			mui : {
				files : [
					{
						expand  : true,
						cwd 	: "src/source",
						src     : ["**/*.js"],
						dest    : "src/source"
					}
				]
			}
		},

		// 删除临时文件
		clean : {
			all : [".build", "dist"]
		},

		exclude : ["!**/config.js", "!pub/**/*.js", "!seajs/**/*.js", "!source/**/*.js"],

		//Auto sprite
		sprite: {
			options: {
				// sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
				imagepath: 'src/css/slice/',
				// 映射CSS中背景路径，支持函数和数组，默认为 null
				imagepath_map: null,
				// 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
				spritedest: 'src/source/css/slice/',
				// 替换后的背景路径，默认 ../images/
				spritepath: 'slice/',
				// 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
				padding: 2,
				// 是否使用 image-set 作为2x图片实现，默认不使用
				useimageset: false,
				// 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
				newsprite: false,
				// 给雪碧图追加时间戳，默认不追加
				spritestamp: true,
				// 在CSS文件末尾追加时间戳，默认不追加
				cssstamp: true,
				// 默认使用二叉树最优排列算法
				algorithm: 'binary-tree',
				// 默认使用`pngsmith`图像处理引擎
				engine: 'pngsmith'
			},
			// 如果不需要使用2*高清图，请打开注释
			// autoSprite: {
			// 	files: [{
			// 		// 启用动态扩展
			// 		expand: true,
			// 		// css文件源的文件夹
			// 		cwd: 'test/css/',
			// 		// 匹配规则
			// 		src: '*.css',
			// 		// 导出css和sprite的路径地址
			// 		dest: 'test/publish_css/',
			// 		// 导出的css名
			// 		ext: '.css'
			// 	}]
			// },
			// image-set 示例
			imageSetSprite: {
				options: {
					useimageset: true,
					spritedest: 'src/source/css/slice/',
					spritepath: 'slice/'
				},
				files: [{
					// 启用动态扩展
					expand: true,
					// css文件源的文件夹
					cwd: 'src/css/',
					// 匹配规则
					src: '*.css',
					// 导出css和sprite的路径地址
					dest: 'src/source/css/',
					// 导出的css名
					ext: '.css'
				}]
			}
		},

		// tmod
        tmod: {
            template: {
                src: 'src/js/tpl/**/*.html',
                dest: 'src/js/template/template.js',
                options: {
                    base: 'src/js/tpl/', // template('tpl/index/main') >>> template('index/main')
                    combo: true
                } 
            }
        },
        watch: {
            template: {
                files: '<%=tmod.template.src%>',
                tasks: ['tmod'],
                options: {
                    spawn: false
                }
            },

            doc: {
                files: ['src/js/**/*.js'],
                tasks: ['doc'],
                options: {
                    debounceDelay: 250
                }
            }
        },

     	doc: {
            options: {
                cwd: 'src/js',
                files: [ 'core/*.js','config/*.js','widget/*.js','*.js'],
                theme: 'gmu',
                outputDir: './doc'
            }
        }

	});

	// 加载插件
	grunt.loadNpmTasks("grunt-cmd-transport");
	grunt.loadNpmTasks("grunt-cmd-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.loadNpmTasks("grunt-css-sprite");

    grunt.loadNpmTasks('grunt-tmod');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 加载build目录下的所有task
    grunt.loadTasks( 'tasks' );

	// 注册自定义指令
	
	// Auto sprite 
	grunt.registerTask('build-sprite', ['sprite']);

	// 构建模板
    grunt.registerTask('build-tmod', ['tmod', 'watch:template']);

	// 自动生成doc
    grunt.registerTask('build-doc', ['doc', 'watch:doc']);

	// 打包 
	grunt.registerTask('build-mui', ['transport:mui', 'concat:mui', 'uglify:mui', 'clean:all']);

	// all
	grunt.registerTask('build-all', ['sprite', 'tmod', 'doc', 'transport:mui', 'concat:mui', 'uglify:mui', 'clean:all'])
	
}