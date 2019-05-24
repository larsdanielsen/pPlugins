﻿!(function ($) {

    function updateLabelAppearence(elem, options) {
        var cbOrRadio = $(elem);
        if (cbOrRadio.prop('checked')) {
            cbOrRadio.data('label').addClass(options.checkedClass);
        } else {
            cbOrRadio.data('label').removeClass(options.checkedClass);
        }
        if (cbOrRadio.prop('disabled')) {
            cbOrRadio.data('label').addClass(options.disabledClass);
        } else {
            cbOrRadio.data('label').removeClass(options.disabledClass);
        }
    }

    var updateCheckboxRadio = function (elem) {
        // using setTimeout to solve timing issue when preventDefault is called
        window.setTimeout(function () {
            var cb = $(elem);
            var options = cb.data('options');
            if (cb.is('input:radio')) {
                cb = $('input:radio[name="' + cb.attr('name') + '"]');
                cb.each(function (i, item) { //when a radio button is changed we need to change it's siblings' appearence as well
                    updateLabelAppearence(item, options);
                });
            } else {
                updateLabelAppearence(cb, options);
            }
        }, 0);
        
    };

    var pCheckRadio = function (element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.options = $.extend({}, $.fn.pCheckRadio.defaults, this.$element.data(), typeof options === 'object' && options);
        this.init();
    };

    pCheckRadio.prototype = {
        init: function () {
            var that = this;
            var options = this.options;
            this.$element.data('options', options);
            this.$element.on('removeCheckRadio.pCheckRadio', function () {
                var cb = $(this);
                cb.closest('label.' + options.labelClass).before(cb).remove();
                cb.off('.pCheckRadio')
                    .removeData('pCheckRadio');
            });

            var typeClass = this.$element.is('[type=checkbox]') ? options.checkboxClass : options.radioClass;

            var wrapperLabel = $('<label />')
                .addClass(options.labelClass)
                .addClass(typeClass)
                .addClass(function () { return that.$element.attr('class'); });
            
            wrapperLabel.insertBefore(this.$element);
            wrapperLabel.append(this.$element);

            this.$element.data('label', this.$element.closest('label.' + options.labelClass));

            this.$element.on('focus.pCheckRadio', function () {
                that.$element.data('label').addClass(options.focusClass);
            });
            this.$element.on('blur.pCheckRadio', function () {
                that.$element.data('label').removeClass(options.focusClass);
            });
            this.$element.closest('form').on('reset.pCheckRadio', function () {
                that.$element.prop('checked', that.$element.get(0).defaultChecked);
                updateCheckboxRadio($(this));
            });
            this.$element.on('change.pCheckRadio', function () {
                updateCheckboxRadio($(this));
            });
            this.$element.on('update.pCheckRadio', function () {
                updateCheckboxRadio($(this));
            });

        }

    };

    $.fn.pCheckRadio = function (option, event) {

        this.each(function () {
            
            var $this = $(this),
                options = typeof option === 'object' && option;

            if (option === 'remove') {
                $this.trigger('removeCheckRadio.pCheckRadio');
                return;
            }

            if ($this.data('pCheckRadio')) {
                $this.trigger('removeCheckRadio.pCheckRadio');
            }
            // ReSharper disable once InconsistentNaming
            var inst = new pCheckRadio(this, options, event);
            $.fn.pCheckRadio.instances.push(inst);
            $this.data('pCheckRadio', inst);

        });

        this.each(function () {
            updateCheckboxRadio($(this));
        });

        return this;
    };


    $.fn.pCheckRadio.defaults = {
        debug: true,
        labelClass: 'pCheckRadio',
        checkboxClass: 'pCheckbox',
        radioClass: 'pRadio',
        focusClass: 'pFocus',
        checkedClass: 'pChecked',
        disabledClass: 'pDisabled'
    };

    $.fn.pCheckRadio.instances = [];
})(jQuery);