import { IScope, IPromise } from 'angular';

import sourcesFilterTemplate from './sources-filter/sources-filter.html';
import datesFilterTemplate from './dates-filter/dates-filter.html';
import { SourcesFilterController } from './sources-filter/sources-filter.controller';
import { DatesFilterController } from './dates-filter/dates-filter.controller';
import { News, NewsDetail, NewsApiService, Filter } from '../shared/index';

export class NewsListController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$mdDialog',
        'newsApiService',
        '$ionicScrollDelegate'
    ];

    private availableOrigins: string[] = [];
    private news: News[] = [];
    private activated = false;
    private populated = false;
    private hasMoreNews = true;
    private currentPage = 0;
    private filter: Filter = {
        origins: [],
        dateMin: undefined,
        dateMax: undefined,
        pageNumber: 1,
        pageSize: 10
    };


    /**
     * Creates an instance of NewsListController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateService} $state
     * @param {angular.material.IDialogService} $mdDialog
     * @param {NewsApiService} newsApiService
     * @param {ionic.scroll.IonicScrollDelegate} $ionicScrollDelegate
     */
    constructor( private $scope: IScope,
                 private $state: angular.ui.IStateService,
                 private $mdDialog: angular.material.IDialogService,
                 private newsApiService: NewsApiService,
                 private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * Ativa o controller
     */
    public activate(): void {
        this.getAvailableOrigins()
            .finally( () => {
                this.activated = true;
            } );
    }

    /**
     * Carrega lista de origins disponíveis
     *
     * @returns {*}
     */
    public getAvailableOrigins(): IPromise<string[]> {
        return this.newsApiService.getAvailableOrigins()
                   .then( origins => {
                       this.availableOrigins = origins;
                       this.filter.origins = angular.copy( this.availableOrigins );
                       return origins;
                   } );
    }

    /**
     * Obtém uma lista de notícias
     */
    public getNews( options: Filter = {} ): IPromise<News[]> {

        angular.extend( this.filter, options ); // atualiza o filtro

        if ( this.filter.pageNumber ) {
            this.currentPage = this.filter.pageNumber;
        }

        return this.newsApiService.getNews( this.filter )
                                    .then( nextNews => {
                                        this.news = this.news.concat( nextNews );
                                        this.hasMoreNews = ( nextNews.length === this.filter.pageSize );
                                        this.populated = true;

                                        return nextNews;
                                    } )
                                    .finally( () => {
                                        this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
                                    } );
    }

    /**
     * Abre filtro(popup) por fonte da notícia
     */
    public openOriginsFilter(): void {
        this.$mdDialog.show( {
            controller: SourcesFilterController,
            template: sourcesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                availableOrigins: this.availableOrigins,
                selectedOrigins: this.filter.origins
            }
        } )
        .then( filter => this.reload( filter ) );
    }

    /**
     * Abre o filtro (popup) por data
     */
    public openDateFilter(): void {
        this.$mdDialog.show( {
            controller: DatesFilterController,
            template: datesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                dateMin: this.filter.dateMin,
                dateMax: this.filter.dateMax
            }
        } )
            .then( filter => {
                this.reload( filter );
            } );
    }

    /**
     * Recarrega a página
     */
    public reload( filter ): void {
        this.resetPagination();
        filter.pageNumber = 1;
        this.getNews( filter );
    }


    /**
     * Reinicializa paginação
     */
    public resetPagination(): void {
        this.news = [];
        this.populated = false;
        this.hasMoreNews = true;
        this.currentPage = 0;
    }


    /**
     * Navega para um notícia
     * 
     * @param {string} id
     */
    public goToNews( id: string ): void {
        this.$state.go( 'app.news/:id', { id: id } );
    }
}
