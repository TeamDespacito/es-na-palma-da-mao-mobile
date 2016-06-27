import './home.component.css!';
import template from './home.component.html!text';
import HomeController from './home.component.controller.js';

const directive = () => {
    return {
        template: template,
        controller: HomeController,
        restrict: 'E',
        controllerAs: 'vm', //scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;