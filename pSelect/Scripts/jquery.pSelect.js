!(function ($) {

    var pSelect = function (element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.options = $.extend({}, $.fn.pSelect.defaults, this.$element.data(), typeof options == 'object' && options);
        this.init();
    };

    pSelect.prototype = {
        init: function init() {
            var that = this;
            var options = this.options;

            this.$wrapperLabel = $('<label />')
                .addClass(options.labelClass)
                .addClass(function () { return that.$element.attr('class'); });

            this.$label = $('<span/>').text('hep');

            this.$element.bind('removeSelect.pSelect', function () {
                if ($(this).is('.' + options.labelClass)) {
                    $(this).removeClass(options.labelClass);
                    $(this).parent('label.' + options.labelClass).before($(this)).remove();
                }
                $(this).unbind('.pSelect')
                    .removeData('pSelect');
            });

            this.$element.addClass(options.labelClass).wrap(this.$wrapperLabel);
            this.$wrapperLabel = this.$element.parent();
            this.$wrapperLabel.append(this.$label);

            this.$element.bind('focus.pSelect', function () {
                that.$wrapperLabel.addClass(options.focusClass);
            });
            this.$element.bind('blur.pSelect', function () {
                that.$wrapperLabel.removeClass(options.focusClass);
            });

            this.$element.closest('form').bind('reset.pSelect', function () {
                that.$element.prop('checked', that.$element.get(0).defaultChecked);
                that.$element.trigger('change.pSelect');
            });
            this.$element.bind('change.pSelect', function () {
                that.$element.trigger('update.pSelect');
            });

            this.$element.bind('click.pSelect', function () {
                that.$element.trigger('open.pSelect');
            });

            this.$element.bind('click.pSelect', function () {
                that.toggle();
            });

            this.$element.bind('update.pSelect', function () {
                var sel = $(this);
                that.$label.text('hop');
            });

            this.$element.trigger('update.pSelect');

        },
        open: function open() {
            var that = this;
            this.isOpen = true;
            this.$wrapperLabel.addClass(this.options.openClass);
            this.$ul = $('<ul/>').addClass(this.options.ulClass);
            var struct = this.getStruct();
            for (var i = 0; i < struct.length; i++) {
                var opt = struct[i];
                var li = $('<li/>').text(opt.text);
                this.$ul.append(li);
            }
            $('body').append(this.$ul);
            this.positionUl();
        },
        close: function close() {
            this.$wrapperLabel.removeClass(this.options.openClass);
            this.$ul.remove();
            this.isOpen = false;
        },
        toggle: function toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        getStruct: function () {
            var that = this;
            var options = this.options;
            var struct = new Array();
            var i = 0;
            this.$element.find('option').each(
                function () {
                    var op = $(this);
                    if (!options.filter || op.text().match(options.filter)) {
                        struct.push({
                            text: op.text(),
                            selected: !!op.is(':selected'),
                            active: !!op.is(':selected'),
                            index: i,
                            option: op
                        });
                        i++;
                    }
                }
            );
            return struct;
        },
        positionUl: function (above) {
            var ulCss = {};
            ulCss.width = this.$wrapperLabel.outerWidth() + 'px';
            var wrapperLabelOfs = this.$wrapperLabel.offset();
            ulCss.top = wrapperLabelOfs.top + this.$wrapperLabel.outerHeight();
            ulCss.left = wrapperLabelOfs.left;
            this.$ul.height('');

            if (above) {
                if (ulCss.top - this.$ul.outerHeight() - 30 < 0) {
                    this.$ul.height(0);
                    wrapperLabelOfs = this.$wrapperLabel.offset();
                    this.$ul.height(wrapperLabelOfs.top - 30);
                } else {
                    this.$ul.height('');
                }
                ulCss.top = wrapperLabelOfs.top - this.$ul.outerHeight();
                ulCss.left = wrapperLabelOfs.left;
            } else {
                if (ulCss.top + this.$ul.outerHeight() + 30 > $(window).height()) {
                    this.$ul.height(0);
                    wrapperLabelOfs = this.$wrapperLabel.offset();
                    this.$ul.height($(window).height() - wrapperLabelOfs.top - this.options.height - 30);
                } else {
                    this.$ul.height('');
                }
            }
            //console.log(ulCss);
            this.$ul.css(ulCss);


            if (!above && this.$ul.outerHeight() < this.options.height) {
                this.$ul.height('');
                this.positionUl(true);
                return;
            }

            var selectedposition = this.$ul.find('li.selected').position();
            if (selectedposition) {
                this.$ul.get(0).scrollTop = this.$ul.find('li.selected').position().top;
            }
        },
    };


    $.fn.pSelect = function (option, event) {
        this.each(function () {
            var $this = $(this),
                options = typeof option == 'object' && option;

            if ($this.data('pSelect')) {
                $this.trigger('removeSelect.pSelect');
            }
            // ReSharper disable once InconsistentNaming
            $this.data('pSelect', new pSelect(this, options, event));

        });
        //this.trigger('change.pSelect');
        return this;
    };


    $.fn.pSelect.defaults = {
        debug: true,
        labelClass: 'pSelect',
        focusClass: 'pFocus',
        openClass: 'pOpen',
        disabledClass: 'pDisabled',
        ulClass: 'pSelcetUl'
};



})(jQuery);