﻿import _isUndefined from 'lodash/isUndefined';
import _forEach from 'lodash/forEach';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import debug from 'gulp-debug';
import cache from 'gulp-cached';
import changed from 'gulp-changed';

class CssTask {
    setOptions( options ) {
        this.options = options;

        if ( _isUndefined( this.options.src ) ) {
            throw new Error( 'CssTask: src é obrigatório!' );
        }

        if ( _isUndefined( this.options.dest ) ) {
            throw new Error( 'CssTask: dest é obrigatório!' );
        }

        if ( this.options.notify ) {
            this.options.plumberOptions = this.options.defaultErrorHandler;
        }

        return this;
    }

    defineTask( gulp ) {
        let options = this.options;

        let taskMetadata = {
            description: 'Aplica transformações(autoprefixer) no CSS.',
            options: {
                options: {
                    src: 'Source (glob)',
                    dest: 'Destino (glob)',
                    debug: 'Indica se debug está habilitado para a task',
                    plumberOptions: 'Opções para plugin gulp-plumber',
                    autoprefixer: 'Opções para plugin gulp-autoprefixer'
                }
            }
        };

        gulp.task( options.taskName, taskMetadata.description, options.taskDeps, () => {

            let chain = gulp.src( options.src )
                            .pipe( cache( options.taskName ) )
                            .pipe( plumber( options.plumberOptions ) )
                            .pipe( autoprefixer( options.autoprefixer ) )
                            .pipe( changed( options.dest, { extension: '.css' } ) );

            if ( options.debug.active ) {
                chain = chain.pipe( debug( options.debug ) );
            }

            _forEach( options.globalBrowserSyncs, ( bs ) => {
                chain = chain.pipe( bs.stream() );
            } );

            return chain.pipe( gulp.dest( options.dest ) );

        }, taskMetadata.options );
    }
}

export default CssTask;
