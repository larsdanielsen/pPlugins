var AjaxLoader = (function () {
    function AjaxLoader(jQuerySelector) {
        this.Init(jQuerySelector);
    }
    AjaxLoader.prototype.Init = function (jQuerySelector) {
        this.LoaderTag = $(jQuerySelector);
        this.runningInstances = 0;
        var defaultSettings = {
            showAfter: 500,
            hideAfter: 200,
            animationDuration: 300,
            handleBeforeUnload: true
        };
        this.settings = {
            showAfter: this.LoaderTag.data('show-after') === undefined ? defaultSettings.showAfter : parseInt(this.LoaderTag.data('show-after')),
            hideAfter: this.LoaderTag.data('hide-after') === undefined ? defaultSettings.hideAfter : parseInt(this.LoaderTag.data('hide-after')),
            animationDuration: this.LoaderTag.data('animation-duration') === undefined ? defaultSettings.animationDuration : parseInt(this.LoaderTag.data('animation-duration')),
            handleBeforeUnload: this.LoaderTag.data('handle-before-unload') === undefined ? defaultSettings.handleBeforeUnload : this.LoaderTag.data('handle-before-unload') === 'true'
        };
        var that = this;
        $('body').on('showAjaxLoader', function () {
            that.ShowLoader();
        });
        $('body').on('hideAjaxLoader', function () {
            that.HideLoader();
        });
        if (this.settings.handleBeforeUnload) {
            window.onbeforeunload = function () {
                that.ShowLoader();
            };
        }
        this.HideLoader();
    };
    AjaxLoader.prototype.ShowLoader = function () {
        this.runningInstances++;
        this.showIt = true;
        this.display();
    };
    AjaxLoader.prototype.HideLoader = function () {
        this.runningInstances--;
        if (this.runningInstances <= 0) {
            this.runningInstances = 0;
            this.showIt = false;
            this.display();
        }
    };
    AjaxLoader.prototype.display = function () {
        this.LoaderTag.css({
            transform: this.getTransform(),
            opacity: this.getOpacity(),
            transition: this.getTransition()
        });
    };
    AjaxLoader.prototype.getTransition = function () {
        var opacityDuration = getSecondsString(this.settings.animationDuration);
        var opacityDelay = getSecondsString(this.showIt ? this.settings.showAfter : this.settings.hideAfter);
        var transformDuration = getSecondsString(0);
        var transformDelay = getSecondsString(this.showIt ? 0 : this.settings.showAfter + this.settings.animationDuration);
        return 'opacity ' + opacityDuration + ' ' + opacityDelay + ', transform ' + transformDuration + ' ' + transformDelay;
        function getSecondsString(ms) {
            return ms / 1000 + 's';
        }
    };
    ;
    AjaxLoader.prototype.getTransform = function () {
        return this.showIt ? 'scale(1,1)' : 'scale(0,0)';
    };
    ;
    AjaxLoader.prototype.getOpacity = function () {
        return this.showIt ? 1 : 0;
    };
    ;
    return AjaxLoader;
}());