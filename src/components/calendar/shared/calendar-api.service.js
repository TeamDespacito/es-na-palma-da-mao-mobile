class CalendarApiService {

    /**
     * @constructor
     *
     * @param {Object} $http - angular $http service
     * @param settings
     */
    constructor( $http, settings ) {
        this.$http = $http;
        this.calendarsEndPoint = settings.api.calendars;
        this.eventsEndPoint = `${settings.api.calendars}/events`;
    }

    /**
     *
     * @returns {*}
     */
    getAvailableCalendars() {
        return this.$http
                   .get( this.calendarsEndPoint )
                   .then( response => response.data );
    }

    /**
     *
     * @param calendars
     * @param filter
     * @returns {Array}
     */
    getFullCalendars( calendars = [], filter = {} ) {
        let today = new Date();
        let defaults = {
            singleEvents: true,
            orderBy: 'startTime',
            timeMin: new Date( today.getFullYear(), 0, 1, 0 ),   // começo do ano corrente
            timeMax: new Date( today.getFullYear(), 11, 31, 0 ), // final do ano corrente
            timeZone: 'America/Sao_Paulo' // an option!
        };
        return this.$http.get( this.eventsEndPoint, { params: angular.extend( { calendars: calendars }, defaults, filter ) } )
                   .then( response => response.data );
    }
}

CalendarApiService.$inject = [ '$http', 'settings' ];

export default  CalendarApiService;