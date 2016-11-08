import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { TransitionService, AuthenticationService } from '../shared/index';

export class HomeController {

    public static $inject: string[] = [ 'transitionService', 'authenticationService' ];

    /**
     * Creates an instance of HomeController.
     * 
     * @param {IWindowService} $window
     * @param {AuthenticationService} authenticationService
     */
    constructor( private transitionService: TransitionService, private authenticationService: AuthenticationService ) {
    }

    /**
     *
     */
    public navigateToLogin(): void {
        this.transitionService.changeState( 'login' );
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeController
     */
    public anonymousLogin(): void {
        this.authenticationService.anonymousLogin = true;
        this.transitionService.changeRootState( 'app.dashboard.newsHighlights' );
    }

    /**
     * Redireciona para 1ª tela do processo de criação de conta
     */
    public createAccount(): void {
        let options = 'toolbar=no,location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Cancelar';
        let browser = new InAppBrowser( 'https://acessocidadao.es.gov.br/Conta/VerificarCPF?espmplatform=' + ionic.Platform.platform(), '_blank', options );

        browser.on( 'loadstart' ).subscribe(( event: InAppBrowserEvent ) => {
            if ( event.url === 'https://acessocidadao.es.gov.br/' ) {
                browser.close();
            }
        });
        browser.on( 'loaderror' ).subscribe(( event: InAppBrowserEvent ) => browser.close() );
    }
}
