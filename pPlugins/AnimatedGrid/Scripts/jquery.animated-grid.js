!(function ($) {

    const startDimensions = 'start-dimensions';
    const endDimensions = 'end-dimensions';

    var animatedGrid = function (element, options, b) {
        this.$element = $(element);
        this.options = options;
        this.init();
    };

    animatedGrid.prototype = {
        init: function () {
            this.$element.on('removeAnimatedGrid.animatedGrid', () => {
                if (this.observer) {
                    this.observer.disconnect();
                }
            });

            this.mutationObserver();
            this.saveInitialStyles();
            this.saveCurrentDimensions(startDimensions);
            window.setTimeout(() => {
                this.saveInitialStyles();
                this.saveCurrentDimensions(startDimensions);
            }, 500);

            var resizeTimeout = 0;
            $(window).resize(() => {
                if (resizeTimeout == 0){
                    this.saveCurrentDimensions(startDimensions);
                    this.fixGrid(startDimensions);
                }
                window.clearTimeout(resizeTimeout);
                resizeTimeout = window.setTimeout(() => {
                    //this.saveCurrentDimensions(startDimensions);
                    this.animateGrid();
                    resizeTimeout = 0;
                }, 500);
            });

            window.setInterval(() => {
                var data = 'startDimensions';
                data += '\n';
                data += JSON.stringify(this.$element.data(startDimensions));
                data += '\n';
                data += JSON.stringify(this.$element.children('#a').data(startDimensions));
                data += '\n';
                data += JSON.stringify(this.$element.children('#b').data(startDimensions));

                data += '\n\n';
                data += 'endDimensions';
                data += '\n';
                data += JSON.stringify(this.$element.data(endDimensions));
                data += '\n';
                data += JSON.stringify(this.$element.children('#a').data(endDimensions));
                data += '\n';
                data += JSON.stringify(this.$element.children('#b').data(endDimensions));
                data = resizeTimeout;
                $('#debug').html(data);
            }, 100);

        },
        saveInitialStyles: function () {
            if (this.$element.data('saved-style') === undefined) {
                console.log('saving initial styles');
                this.$element.data('saved-style', this.$element.attr('style') || '');
                this.$element.find('> *').each(function () {
                    var item = $(this);
                    item.data('saved-style', item.attr('style') || '');
                });
            }
        },
        fixGrid: function (ident) {
            console.log('fixGrid', ident);
            var dimensions = this.$element.data(ident);
            this.$element.css({
                position: 'relative',
                boxSizing: 'border-box',
                transitionProperty: 'width, height, top, left',
                transitionDuration: animationDuration + 'ms',
                width: dimensions.width,
                height: dimensions.height
            });

            this.$element.find('> *').each(function () {
                var item = $(this);
                var itemDimensions = item.data(ident);
                item.css({
                    position: 'absolute',
                    boxSizing: 'border-box',
                    transitionProperty: 'width, height, top, left',
                    transitionDuration: animationDuration + 'ms',
                    width: itemDimensions.width,
                    height: itemDimensions.height,
                    top: itemDimensions.top,
                    left: itemDimensions.left
                });
            });
        },
        releaseGrid: function () {
            this.$element.attr('style', this.$element.data('saved-style') || '');
            this.$element.find('> *').each(function () {
                var item = $(this);
                item.attr('style', item.data('saved-style') || '');
            });
        },
        animateGrid: function (func) {
            console.log("animateGrid");
            this.releaseGrid();
            if (func) {
                func(this.$element);
            }
            this.saveCurrentDimensions(endDimensions);
            this.fixGrid(startDimensions);
            window.setTimeout(() => {
                this.fixGrid(endDimensions);
                this.transferDimensions(endDimensions, startDimensions);
                if (this.animateTimeout) {
                    window.clearTimeout(this.animateTimeout);
                }
                this.animateTimeout = window.setTimeout(() => {
                    this.releaseGrid();
                }, animationDuration);
            }, 0);

        },
        transferDimensions(from, to) {
            this.$element.data(to, this.$element.data(from));
            this.$element.find('> *').each(function () {
                var item = $(this);
                item.data(to, item.data(from));
            });
        },
        saveCurrentDimensions: function (ident) {
            this.$element.data(ident, {
                width: this.$element.outerWidth() + 'px',
                height: this.$element.outerHeight() + 'px'
            });
            var gridOffset = this.$element.offset();
            this.$element.find('> *').each(function () {
                var item = $(this);
                var w = item.outerWidth();
                var h = item.outerHeight();
                var o = item.offset();
                var t = o.top - gridOffset.top;
                var l = o.left - gridOffset.left;

                item.data(ident, {
                    width: w + 'px',
                    height: h + 'px',
                    top: t + 'px',
                    left: l + 'px'
                });
            });
        },
        mutationObserver: function () {
            var targetNode = this.$element.get(0);

            var config = { attributes: true, childList: true, subtree: true };

            var callback = (mutationsList, observer) => {
                var changed = false;
                for (var mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        changed = true;
                        break;
                        //console.log('A child node has been added or removed.');
                    }
                    else if (mutation.type == 'attributes') {
                        //console.log('The ' + mutation.attributeName + ' attribute was modified.');
                    }
                }
                if (changed) {
                    this.animateGrid();
                }
            };
            this.observer = new MutationObserver(callback);
            this.observer.observe(targetNode, config);
        }
    };

    $.fn.animatedGrid = function (option, b) {

        this.each(function () {

            var $this = $(this),
                options = typeof option === 'object' && option;

            if (option === 'remove') {
                $this.trigger('removeAnimatedGrid.animatedGrid');
                return;
            }

            if (option === 'fix') {
                var inst = $this.data('animatedGrid');
                if (inst) {
                    inst.fixGrid('initial-dimensions');
                }
                return;
            }

            if (option === 'animate') {
                var inst = $this.data('animatedGrid');
                if (inst) {
                    console.log("b");
                    inst.animateGrid(b);
                }
                return;
            }

            if ($this.data('pCheckRadio')) {
                $this.trigger('removeAnimatedGrid.animatedGrid');
            }

            //// ReSharper disable once InconsistentNaming
            var inst = new animatedGrid(this, options, b);
            $.fn.animatedGrid.instances.push(inst);
            $this.data('animatedGrid', inst);

        });

        return this;
    };


    $.fn.animatedGrid.defaults = {
        //debug: true,
    };

    $.fn.animatedGrid.instances = [];
})(jQuery);

var animationDuration = 1500;
