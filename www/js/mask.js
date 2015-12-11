/* globals
define
*/
define(['configured_dust'], function (dust) {
    var $mask;

    function init($e) {
        $mask = $e;
        render();
    }

    function render() {
        
    }

    return {
        init: init
    }
});