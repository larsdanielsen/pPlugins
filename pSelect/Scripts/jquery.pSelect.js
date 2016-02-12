!(function ($) {

    var pSelect = function (element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$selectBox = $(element);
        this.options = $.extend({}, $.fn.pSelect.defaults, this.$selectBox.data(), typeof options == 'object' && options);
        this.init();
    };

    pSelect.prototype = {
        init: function init() {
            var that = this;
            this.options.initDone = false;

            if (this.$selectBox.is('select')) {
                this.options.source = 'select';
                if (this.$selectBox.is('[multiple]')) {
                    this.options.multiple = true;
                }
            }

            this.$wrapperLabel = $('<label />')
                .addClass(this.options.labelClass)
                .addClass(function () { return that.$selectBox.attr('class'); });

            this.$label = $('<span/>').addClass('label-inner');

            this.$input = $('<input/>').addClass(this.options.inputClass);

            this.$selectBox.bind('removeSelect.pSelect', function () {
                if ($(this).is('.' + that.options.labelClass)) {
                    $(this).removeClass(that.options.labelClass);
                    $(this).parent('label.' + that.options.labelClass).before($(this)).remove();
                }
                $(this).unbind('.pSelect')
                    .removeData('pSelect');
            });

            this.$selectBox.addClass(this.options.labelClass);

            this.$wrapperLabel.insertBefore(this.$selectBox);
            this.$wrapperLabel.append(this.$label);
            this.$wrapperLabel.append(this.$input);
            this.$wrapperLabel.append(this.$selectBox);

            this.getUl();
            this.fillUl();
            this.bindEvents();

            this.$selectBox.trigger('updateLabel.pSelect');
            this.options.initDone = true;
        },
        open: function open() {
            var that = this;
            this.isOpen = true;
            this.fillUl();
            $('body').append(this.$ul);
            this.$wrapperLabel.addClass(this.options.openClass);
            this.positionUl();
            $(window).one('click.pSelect resize.pSelect', function () {
                that.close();
                that.blur();
            });
        },
        blur: function blur() {
            this.$wrapperLabel.removeClass(this.options.focusClass);
        },
        focus: function focus() {
            this.$input.focus();
        },
        close: function close(isMySelf) {
            //console.log('close, isMySelf: ' + isMySelf);
            this.isOpen = false;
            this.$wrapperLabel.removeClass(this.options.openClass);
            this.$ul.detach();
            if (isMySelf) {
                this.focus();
            }
        },
        toggle: function toggle() {
            //console.log('toggle');
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        updateLabel: function updateLabel() {

            var options = this.$selectBox.find('option');
            var text = options.first().text();
            if (this.options.multiple) {
                var selectedOptions = options.filter(':selected');
                var allSelectedTexts = [];
                selectedOptions.each(function () {
                    allSelectedTexts.push($(this).text());
                });
                if (allSelectedTexts.length) {
                    text = allSelectedTexts.join(', ');
                }
            } else {
                var selectedIndex = this.$selectBox.get(0).selectedIndex;
                var selectedOption = $(this.$selectBox.find('option').get(selectedIndex));
                text = selectedOption.text();
            }
            this.$label.text(text);

        },
        bindEvents: function bindEvents() {
            var that = this;

            this.$ul.on('click.pSelect', 'li', function (e) {
                e.stopPropagation();
                e.preventDefault();
                that.selectOption($(this));
                if (that.options.multiple) {
                    that.focus();
                } else {
                    that.close(true);
                }
            });

            this.$wrapperLabel.on('click.pSelect', function (e) {
                //console.log('$wrapperLabel click.pSelect');
                that.CloseOtherInstances();
                e.stopPropagation();
            });

            this.$input.on('focus.pSelect', function () {
                //console.log('$input focus.pSelect');
                that.CloseOtherInstances();
                that.$wrapperLabel.addClass(that.options.focusClass);
            });

            this.$input.on('blur.pSelect', function () {
                //console.log('blur, isOpen: ' + that.isOpen);
                if (that.isOpen) {
                    $(this).focus();
                } else {
                    that.blur();
                }
            });

            this.$input.on('click.pSelect', function (e) {
                //console.log('$input click.pSelect');
                e.stopPropagation();
                e.preventDefault();
                that.toggle();
            });

            this.$input.on('keydown.pSelect', function (e) {
                that.inputKeyDown(e);
            });
            this.$input.on('keypress.pSelect', function (e) {
                that.inputKeyPress(e);
            });

            this.$selectBox.on('updateLabel.pSelect', function () {
                //console.log('$selectBox update.pSelect');
                that.updateLabel();
            });
            this.$selectBox.on('change.pSelect', function (e) {
                //console.log('$selectBox change.pSelect');
                e.stopPropagation();
                e.preventDefault();
                that.updateLabel();
            });
        },
        getUl: function getUl() {
            this.$ul = $('<ul/>').addClass(this.options.ulClass);
            if (this.options.multiple) {
                this.$ul.addClass(this.options.multipleUlClass);
            } else {
                this.$ul.addClass(this.options.normalUlClass);
            }

        },
        fillUl: function fillUl() {
            this.$ul.empty();
            var struct = this.getStruct();
            var activeFound = false;
            for (var i = 0; i < struct.length; i++) {
                var opt = struct[i];
                var li = $('<li/>')
                    .text(opt.text)
                    .data('option', opt);

                if (opt.selected) {
                    li.addClass(this.options.selectedClass);
                }

                if (opt.disabled) {
                    li.addClass(this.options.disabledClass);
                    li.prop('disabled', true);
                }

                if (opt.option.is('optgroup')) {
                    li.addClass(this.options.optgroupClass);
                }

                if (!activeFound && opt.active) {
                    activeFound = true;
                    li.addClass(this.options.activeClass);
                }
                this.$ul.append(li);
            }
        },
        getStruct: function () {
            var that = this;
            var struct = new Array();
            var i = 0;

            this.$selectBox.children().each(function () {
                var child = $(this);
                if (child.is('option')) {
                    addOption(child);
                } else if (child.is('optgroup')) {
                    addOptgroup(child);
                }
            });

            function addOptgroup(optgroup) {
                struct.push({
                    text: optgroup.attr('label'),
                    selected: false,
                    active: false,
                    disabled: true,
                    index: -1,
                    option: optgroup
                });
                optgroup.find('> option').each(
                    function () {
                        addOption($(this));
                    }
                );
            }

            function addOption(op) {
                if (!that.options.filter || op.text().match(that.options.filter)) {
                    struct.push({
                        text: op.text(),
                        selected: !!op.is(':selected'),
                        active: !!op.is(':selected'),
                        disabled: !!op.is(':disabled'),
                        index: i,
                        option: op
                    });
                    i++;
                }
            }

            return struct;
        },
        positionUl: function (above) {
            this.$ul.hide();
            var ulCss = {};
            ulCss.width = this.$wrapperLabel.outerWidth() + 'px';
            var wrapperLabelOfs = this.$wrapperLabel.offset();
            ulCss.top = wrapperLabelOfs.top + this.$wrapperLabel.outerHeight();
            ulCss.left = wrapperLabelOfs.left;
            //console.log(ulCss);
            this.$ul.height('');
            this.$ul.show();

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
                    this.$ul.height($(window).height() - wrapperLabelOfs.top - this.$wrapperLabel.outerHeight() - 30);
                } else {
                    this.$ul.height('');
                }
            }
            //console.log(ulCss);
            this.$ul.css(ulCss);

            if (!above && this.$ul.outerHeight() < this.$wrapperLabel.outerHeight()) {
                this.$ul.height('');
                this.positionUl(true);
                return;
            }

            var selectedposition = this.$ul.find('li.' + this.options.selectedClass).position();
            if (selectedposition) {
                this.$ul.get(0).scrollTop = selectedposition.top;
            }
        },
        selectOption: function selectOption(li) {

            var newselection = true;
            var opt = li.data('option');
            var option = opt.option;
            var index = opt.index;

            if (option.prop('selected')) {
                newselection = false;
            }
            if (this.options.multiple) {
                option.prop('selected', !option.prop('selected'));
                li.toggleClass(this.options.selectedClass, option.prop('selected'));
            } else {
                option.prop('selected', true);
                this.$selectBox.get(0).selectedIndex = index;
                li.addClass(this.options.selectedClass).siblings().removeClass(this.options.selectedClass);
            }

            if (newselection && !this.options.runningInternalChange) {
                this.options.runningOriginalChange = true;
                this.$selectBox.trigger('change');
                this.options.runningOriginalChange = false;
            }

            this.updateLabel();

            //objects.input.trigger('focus.DGselectbox');
            // HideAllDGselectbox_uls();

            if (this.options.selectCallback) {
                this.options.selectCallback(this);
            }
        },
        moveFocus: function moveFocus(dir) {
            var that = this;

            var currentActive = this.$ul.find('li.' + that.options.activeClass);
            if (currentActive.size() == 0) {
                currentActive = this.$ul.find('li').first();
            }

            if (currentActive.size()) {
                var newActive = currentActive;
                if (dir == 1) {
                    newActive = currentActive.next();
                    while (!newActive || newActive.is('.' + this.options.disabledClass)) {
                        newActive = newActive.next();
                    }
                } else if (dir == -1) {
                    newActive = currentActive.prev();
                    while (!newActive || newActive.is('.' + this.options.disabledClass)) {
                        newActive = newActive.prev();
                    }
                }
                this.setFocusTo(newActive);
            }
        },
        setFocusTo: function setFocusTo(li) {
            if (li.size() && !li.prop('disabled')) {
                this.$ul.children('li').removeClass(this.options.activeClass);
                li.addClass(this.options.activeClass);
                if (!this.$ul.is(':visible')) {
                    li.trigger('click.pSelect');
                }

                var liTop = li.position().top;
                var ulInnerHeight = this.$ul.innerHeight();
                var liOuterHeight = li.outerHeight(true);
                var ulScrollTop = this.$ul.get(0).scrollTop;

                if (liTop < ulScrollTop) {
                    this.$ul.get(0).scrollTop = liTop; // scroll up
                } else if (liTop + liOuterHeight > ulInnerHeight + ulScrollTop) {
                    this.$ul.get(0).scrollTop = li.outerHeight(true) + liTop - this.$ul.innerHeight(); // scroll down
                }
            }
        },
        moveFocusUp: function moveFocusUp() {
            this.moveFocus(-1);
        },
        moveFocusDown: function moveFocusDown() {
            this.moveFocus(1);
        },
        inputKeyDown: function inputKeyDown(e) {

            var keyCodes = $.fn.pSelect.keyCodes;
            var keycode = e.keyCode;

            if (keycode == keyCodes.Down) {
                if (e.altKey) {
                    this.open();
                } else {
                    this.moveFocusDown();
                }
            } else if (keycode == keyCodes.Up) {
                this.moveFocusUp();
            } else if (keycode == keyCodes.Enter || keycode == keyCodes.Space) { // enter of space
                e.preventDefault();
                if (keycode == keyCodes.Enter || this.options.multiple) {
                    this.$ul.find('li.' + this.options.activeClass).trigger('click.pSelect');
                }
            } else if (keycode == keyCodes.Esc) { // esc
                this.close();
            } else if (keycode == keyCodes.Tab) { // tab
                this.close();
            }

            if (keycode != keyCodes.Tab && keycode != keyCodes.Shift) { // shift and tab is allowed to pass
                //event.preventDefault();
                return true;
            }
            return false;
        },
        inputKeyPress: function inputKeyPress(e) {
            var charcode = e.charCode || e.keyCode;
            this.findAndSelectNearest(charcode);
            return false;
        },
        findAndSelectNearest: function findAndSelectNearest(charcode) {
            var that = this;
            if (!this.options.charsEntered) {
                this.options.charsEntered = [];
            }
            var charToMatch = String.fromCharCode(charcode);
            //if (!charToMatch.match(/[\w|\d|æøå]/i)) return;
            //Say(charcode + ' - ' + charToMatch);
            if (charcode == 40 || charcode == 41) return; // ( and )
            if (charToMatch != this.options.charsEntered[0]) {
                this.options.charsEntered.push(charToMatch);
                window.clearTimeout(this.options.nearestMatchTimeout);
                this.options.nearestMatchTimeout = window.setTimeout(function () {
                    that.options.charsEntered = new Array();
                }, 1000);
            }
            var indexToUse = 0;
            var matchString = this.options.charsEntered.join('');
            var matchLength = matchString.length;
            var matchExp = new RegExp(matchString, 'i');
            var matchingLis = new Array();
            this.$ul.find('li').each(function () {
                var li = $(this);
                var text = li.text().substring(0, matchLength);
                if (text && text.match(matchExp)) {
                    matchingLis.push(li);
                    if (li.is('.selected') || li.is('.active')) {
                        indexToUse = matchingLis.length;
                    }
                }
            });
            if (indexToUse >= matchingLis.length) {
                indexToUse = 0;
            }
            var foundLi = matchingLis[indexToUse];
            if (foundLi && foundLi.size()) {
                this.setFocusTo(foundLi);
            }
        },
        CloseOtherInstances: function closeOtherInstances() {
            for (var i = 0 ; i < $.fn.pSelect.instances.length; i++) {
                var inst = $.fn.pSelect.instances[i];
                if (inst !== this) {
                    inst.close();
                }
            }
        }
    };


    $.fn.pSelect = function (option, event) {
        this.each(function () {
            var $this = $(this),
                options = typeof option == 'object' && option;

            if ($this.data('pSelect')) {
                $this.trigger('removeSelect.pSelect');
            }
            // ReSharper disable once InconsistentNaming
            var inst = new pSelect(this, options, event);
            $.fn.pSelect.instances.push(inst);
            $this.data('pSelect', inst);

        });
        //this.trigger('change.pSelect');
        return this;
    };

    $.fn.pSelect.defaults = {
        debug: true,
        source: null,
        inputClass: 'pInput',
        labelClass: 'pSelect',
        focusClass: 'pFocus',
        openClass: 'pOpen',
        activeClass: 'pActive',
        selectedClass: 'pSelected',
        disabledClass: 'pDisabled',
        optgroupClass: 'pOptgroup',
        ulClass: 'pSelcetUl',
        normalUlClass: 'pNormal',
        multipleUlClass: 'pMultiple',
        multiple: false
    };

    $.fn.pSelect.instances = [];
    $.fn.pSelect.keyCodes = {
        Down: 40,
        Up: 38,
        Enter: 13,
        Space: 32,
        Esc: 27,
        Tab: 9,
        Shift: 16
    };

})(jQuery);