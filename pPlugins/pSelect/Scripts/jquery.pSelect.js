/*
 * Requires jQuery 1.7.x
 * For use on mobile, touchstart must be supported 
 * TODO: specify this 
 */

/*

       ____       _           _   
  _ __/ ___|  ___| | ___  ___| |_ 
 | '_ \___ \ / _ \ |/ _ \/ __| __|
 | |_) |__) |  __/ |  __/ (__| |_ 
 | .__/____/ \___|_|\___|\___|\__|
 |_|                              


*/

!(function ($) {

    var pSelect = function (element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$selectBox = $(element);
        this.options = $.extend({}, $.fn.pSelect.defaults, this.$selectBox.data(), typeof options === 'object' && options);
        this.init();
    };

    pSelect.prototype = {
        init: function () {
            var that = this;
            this.options.initDone = false;

            if (this.$selectBox.is('[multiple]')) {
                this.multiple = true;
            }

            this.$wrapperLabel = $('<label />')
                .addClass(this.options.labelClass)
                .addClass(function () { return that.$selectBox.attr('class'); });

            if (this.options.autoComplete) {
                this.$wrapperLabel.addClass(this.options.autoCompleteClass);
            }


            this.$label = $('<span/>').addClass('label-inner');

            this.$input = $('<input/>').addClass(this.options.inputClass);
            this.hideInput();

            if (!this.options.autoComplete) {
                this.$input.prop('readonly', true);
            }

            this.$selectBox.on('removeSelect.pSelect', function () {
                var pSelectInstance = $(this).data('pSelect');
                pSelectInstance.$wrapperLabel.before($(this)).remove();
                $(this).off('.pSelect')
                    .removeData('pSelect');
            });

            this.$selectBox.data('pSelect', this);

            this.$wrapperLabel.insertBefore(this.$selectBox);
            this.$wrapperLabel.append(this.$label);
            this.$wrapperLabel.append(this.$input);
            this.$wrapperLabel.append(this.$selectBox);

            this.getUl();
            this.fillUl();
            this.bindEvents();
            this.focusedItemIndex = 0;
            this.ulScrollTop = null;
            this.moveFocusToNextValidItem();
            this.updateLabelView();

            this.options.initDone = true;
        },
        open: function () {
            var that = this;
            this.isOpen = true;
            this.fillUl();
            this.$ul.hide();
            $('body').append(this.$ul);
            this.positionUl();
            this.updateLabelView();
            if (this.options.autoComplete) {
                this.showInput();
                this.$input.focus();
            }
            $(window).one('click.pSelect touchstart.pSelect resize.pSelect scroll.pSelect', function (e) {
                that.close();
                that.blur();
            });
        },
        blur: function () {
            //this.consoleLog('blur');
            this.hasFocus = false;
            this.updateLabelView();
        },
        focus: function () {
            //this.consoleLog('focus');
            this.$input.focus();
        },
        close: function (isMySelf) {
            this.consoleLog('closing ' + this.$selectBox.attr('id'));
            if (this.isOpen) {
                this.isOpen = false;

                if (this.options.autoComplete) {
                    this.hideInput();
                }
                this.$input.val('');

                this.updateLabelView();
                if (this.ulScrollTop === null) {
                    this.ulScrollTop = this.$ul.get(0).scrollTop;
                }
                this.$ul.detach();
                if (isMySelf) {
                    this.focus();
                }

                //$(window).off('.pSelect');
            }
        },
        toggle: function () {
            //this.consoleLog('toggle');
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        updateLabelView: function (forcedText) {
            var that = this;
            if (this.updateLabelViewTimeout) {
                window.clearTimeout(this.updateLabelViewTimeout);
            }
            this.updateLabelViewTimeout = window.setTimeout(function () {
                that.updateLabelViewTimeout = null;
                that.$wrapperLabel.toggleClass(that.options.openClass, that.isOpen);
                that.$wrapperLabel.toggleClass(that.options.focusClass, that.hasFocus);
                var options = that.$selectBox.find('option');
                var text = '';
                if (forcedText === undefined) {
                    if (that.multiple) {
                        var selectedOptions = options.filter(':selected');
                        if (that.options.summeyIfMoreThan > 0 && selectedOptions.length > that.options.summeyIfMoreThan) {
                            text = that.options.summeyText.replace('#', selectedOptions.length).replace('%', that.Struct.items.length);
                        } else {
                            var allSelectedTexts = [];
                            selectedOptions.each(function () {
                                allSelectedTexts.push($(this).text());
                            });
                            if (allSelectedTexts.length) {
                                text = allSelectedTexts.join(', ');
                            }
                        }
                    } else {
                        var selectedIndex = that.$selectBox.get(0).selectedIndex;
                        var selectedOption = $(that.$selectBox.find('option').get(selectedIndex));
                        text = selectedOption.text();
                    }
                    if (text == '' && that.options.labelIfNoneSelected) {
                        text = that.options.labelIfNoneSelected;
                    }

                } else {
                    text = forcedText;
                }
                that.$label.text(text);
            }, 0);
        },
        updateUlView: function () {
            var that = this;
            if (this.updateUlViewTimeout) {
                window.clearTimeout(this.updateUlViewTimeout);
            }
            this.updateUlViewTimeout = window.setTimeout(function () {
                //that.consoleLog('updateUlViewTimeout');
                that.updateUlViewTimeout = null;

                var activeFound = false;
                for (var i = 0; i < that.Struct.items.length; i++) {
                    var item = that.Struct.items[i];

                    item.$li.toggleClass(that.options.selectedItemClass, item.Selected);
                    item.$li.toggleClass(that.options.disabledItemClass, item.Disabled);
                    item.$li.prop('disabled', item.Disabled);

                    if (!activeFound && item.Index == this.focusedItemIndex) {
                        activeFound = true;
                        item.$li.addClass(that.options.focusedItemClass);
                    }
                    item.$li.toggle(!item.Hidden);
                }
            }, 0);
        },
        bindEvents: function () {
            var that = this;

            this.$ul.on('click.pSelect', function (e) {
                that.consoleLog('$ul click.pSelect');
                e.stopPropagation();
                e.preventDefault();
            });

            this.$ul.on('click.pSelect', 'li', function (e) {
                that.consoleLog('$ul click.pSelect');
                that.selectOption($(this).data('item'));
                if (that.multiple) {
                    that.focus();
                } else {
                    that.close(true);
                }
            });

            this.$ul.on('touchstart.pSelect', function (e) {
                that.consoleLog('$ul touchstart.pSelect');
                e.stopPropagation();
            });

            this.$wrapperLabel.on('click.pSelect', function (e) {
                that.consoleLog('$wrapperLabel click.pSelect');
                e.stopPropagation();
                that.closeOtherInstances();

                //e.preventDefault();
                //return false;
            });

            this.$input.on('focus.pSelect', function () {
                that.consoleLog('$input focus.pSelect');
                that.closeOtherInstances();
                that.hasFocus = true;
                that.updateLabelView();
            });

            this.$input.on('blur.pSelect', function () {
                that.consoleLog('$input blur.pSelect');
                if (that.isOpen) {
                    that.focus();
                } else {
                    that.blur();
                }
            });

            this.$input.on('click.pSelect', function (e) {
                that.consoleLog('$input click.pSelect');
                e.stopPropagation();
                e.preventDefault();
                that.toggle();
            });

            this.$input.on('keydown.pSelect', function (e) {
                that.consoleLog('$input keydown.pSelect');
                that.inputKeyDown(e);
            });
            this.$input.on('keypress.pSelect', function (e) {
                that.consoleLog('$input keypress.pSelect');
                that.inputKeyPress(e);
            });
            this.$input.on('keyup.pSelect', function (e) {
                that.consoleLog('$input keyup.pSelect');
                that.inputKeyUp(e);
            });

            this.$selectBox.on('updateLabelView.pSelect', function () {
                that.consoleLog('$selectBox updateLabelView.pSelect');
                that.updateLabelView();
            });
            this.$selectBox.on('change.pSelect', function (e) {
                that.consoleLog('$selectBox change.pSelect');
                e.preventDefault();
                if (!that.isOpen) {
                    that.fillUl();
                }
                that.updateLabelView();
            });
            this.$selectBox.on('click.pSelect', function () {
                that.consoleLog('$selectBox click.pSelect');
                that.$input.trigger('focus.pSelect');
            });

        },
        getUl: function () {
            this.$ul = $('<ul/>')
                .addClass(this.options.ulClass);

            if (this.options.addSelectClassToLabel) {
                this.$ul.addClass(this.$selectBox.attr('class'));
            }

            if (this.multiple) {
                this.$ul.addClass(this.options.multipleUlClass);
            } else {
                this.$ul.addClass(this.options.normalUlClass);
            }
        },
        fillUl: function () {
            //this.consoleLog('fillUl');
            this.$ul.empty();
            this.getStruct();
            for (var i = 0; i < this.Struct.items.length; i++) {
                var item = this.Struct.items[i];
                var li = $('<li/>')
                    .addClass(item.$option.data('classnames'))
                    .text(item.Text)
                    .data('item', item);
                item.$li = li;
                if (item.$option.is('optgroup')) {
                    item.$li.addClass(this.options.optgroupClass);
                }
                this.$ul.append(li);
            }
            this.updateUlView();
        },
        getStruct: function () {
            var that = this;
            var items = [];
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
                var item = new $.fn.pSelect.Item();
                item.Text = optgroup.attr('label');
                item.Selected = false;
                item.Disabled = true;
                item.Optgroup = true;
                item.Index = -1;
                item.$option = optgroup;
                items.push(item);

                optgroup.data('item', item);

                optgroup.find('> option').each(
                    function () {
                        addOption($(this));
                    }
                );
            }

            function addOption(op) {
                if (!that.options.filter || op.text().match(that.options.filter)) {
                    var item = new $.fn.pSelect.Item();
                    item.Text = op.text();
                    item.Selected = !!op.is(':selected');
                    item.Disabled = !!op.is(':disabled');
                    item.Index = i;
                    item.$option = op;
                    items.push(item);
                    i++;
                    op.data('item', item);
                }
            }

            this.Struct = { items: items };
        },
        positionUl: function (above) {
            var that = this;
            if (this.positionUlTimeout) {
                window.clearTimeout(this.positionUlTimeout);
            }
            this.positionUlTimeout = window.setTimeout(function () {
                that.positionUlTimeout = null;

                if (that.options.getUlMaxHeight) {
                    that.options.ulMaxHeight = that.options.getUlMaxHeight(that);
                }

                var wrapperLabelOfset = that.$wrapperLabel.offset();
                var wrapperLabelHeight = that.$wrapperLabel.outerHeight();
                var windowScrollTop = $(window).scrollTop();
                var windowScrollLeft = $(window).scrollLeft();
                //var ulScrollHeight = that.$ul.get(0).scrollHeight;
                var ulCss = {
                    top: 'auto',
                    bottom: 'auto',
                    width: that.$wrapperLabel.outerWidth(),
                    left: wrapperLabelOfset.left - windowScrollLeft
                };

                that.$ul.hide();

                var distanceAvailable;
                if (above) {
                    distanceAvailable = wrapperLabelOfset.top - windowScrollTop;
                    ulCss.maxHeight = distanceAvailable * .8;
                    ulCss.bottom = $(window).outerHeight() - wrapperLabelOfset.top + windowScrollTop;
                    if (that.options.ulMaxHeight && ulCss.maxHeight > that.options.ulMaxHeight) {
                        ulCss.maxHeight = that.options.ulMaxHeight;
                    }
                } else {
                    ulCss.top = wrapperLabelOfset.top + wrapperLabelHeight - windowScrollTop;
                    distanceAvailable = $(window).outerHeight() - wrapperLabelOfset.top - wrapperLabelHeight + windowScrollTop;
                    ulCss.maxHeight = distanceAvailable * .8;
                    if (that.options.ulMaxHeight && ulCss.maxHeight > that.options.ulMaxHeight) {
                        ulCss.maxHeight = that.options.ulMaxHeight;
                    }
                    //  that.consoleLog(ulCss.maxHeight);
                    //  that.consoleLog(that.$ul.get(0).scrollHeight);
                    //if (ulCss.maxHeight < ulScrollHeight && ulCss.maxHeight < wrapperLabelHeight * 6 && distanceAvailable * 2 < wrapperLabelOfset.top - windowScrollTop) {
                    if (ulCss.maxHeight < wrapperLabelHeight * 6 && distanceAvailable * 2 < wrapperLabelOfset.top - windowScrollTop) {
                        that.positionUl(true);
                        return;
                    }
                };

                if (ulCss.maxHeight < wrapperLabelHeight * 3) {
                    ulCss.top = windowScrollTop + 10 - windowScrollTop;
                    ulCss.bottom = 'auto';
                    ulCss.maxHeight = $(window).outerHeight() - 20;
                }


                if (that.options.Animate) {
                    that.options.Animate(that.$ul, ulCss, above);
                } else {
                    that.$ul.css(ulCss);
                    that.$ul.show();
                }

                //that.consoleLog(ulCss.maxHeight);
                //that.consoleLog(ulScrollHeight);

                if (that.ulScrollTop === null) {
                    var selectedposition = that.$ul.find('li.' + that.options.selectedItemClass).position();
                    if (selectedposition) {
                        that.$ul.get(0).scrollTop = selectedposition.top;
                    }
                } else {
                    that.$ul.get(0).scrollTop = that.ulScrollTop;
                    that.ulScrollTop = null;
                }

            }, 0);
        },
        hideInput: function () {
            this.$input.addClass('pHidden');
        },
        showInput: function () {
            this.$input.removeClass('pHidden');
        },
        selectOption: function (item) {
            //this.consoleLog(item);
            if (this.multiple) {
                if (!item.Disabled) {
                    item.Selected = !item.Selected;
                } else {
                    //return;
                }
            } else {
                item.Selected = true;
            }

            item.$option.prop('selected', item.Selected);

            if (!this.options.runningInternalChange) {
                this.options.runningOriginalChange = true;
                this.$selectBox.trigger('change');
                this.options.runningOriginalChange = false;
            }

            if (this.options.selectCallback) {
                this.options.selectCallback(this, item);
            }

            this.updateLabelView();
            this.updateUlView();
        },
        moveFocus: function (dir) {
            this.focusedItemIndex += dir;
            this.moveFocusToNextValidItem(dir);

            if (this.focusedItemIndex == 0) {
                dir = 1;
            }
            if (this.focusedItemIndex == this.Struct.items.length - 1) {
                dir = -1;
            }
            if (this.focusedItemIndex == 0 || this.focusedItemIndex == this.Struct.items.length - 1) {
                this.moveFocusToNextValidItem(dir);
            }
            this.setFocusToFocusedItem();
        },
        moveFocusToNextValidItem: function (dir) {
            dir = dir || 1;
            var that = this;
            while (isInsideArray() && isUnFocusable(this.Struct.items[this.focusedItemIndex])) {
                this.focusedItemIndex += dir;
            }
            if (this.focusedItemIndex >= this.Struct.items.length) {
                this.focusedItemIndex = this.Struct.items.length - 1;
            }
            if (this.focusedItemIndex < 0) {
                this.focusedItemIndex = 0;
            }
            function isInsideArray() {
                return that.focusedItemIndex >= 0 && that.focusedItemIndex < that.Struct.items.length;
            }
            function isUnFocusable(item) {
                return item.Hidden || item.Disabled;
            }
        },
        moveFocusUp: function () {
            this.moveFocus(-1);
        },
        moveFocusDown: function () {
            this.moveFocus(1);
        },
        setFocusToFocusedItem: function () {
            var that = this;
            window.setTimeout(function () {
                var item = that.Struct.items[that.focusedItemIndex];
                that.$ul.children('li').removeClass(that.options.focusedItemClass);
                item.$li.addClass(that.options.focusedItemClass);
                if (!that.multiple && !that.isOpen) {
                    item.$li.trigger('click.pSelect');
                }
                var liTop = item.$li.position().top;
                var ulInnerHeight = Math.round(that.$ul.innerHeight());
                var liOuterHeight = Math.round(item.$li.outerHeight(true));
                var ulScrollTop = that.$ul.get(0).scrollTop;
                if (liTop < ulScrollTop) {
                    that.$ul.get(0).scrollTop = liTop; // scroll up
                } else if (liTop + liOuterHeight > ulInnerHeight + ulScrollTop) {
                    that.$ul.get(0).scrollTop = liOuterHeight + liTop - ulInnerHeight; // scroll down
                }
                console.log(liTop, ulInnerHeight, liOuterHeight, ulScrollTop);
            }, 0);
        },
        inputKeyDown: function (e) {
            e.stopPropagation();
            var keyCodes = $.fn.pSelect.keyCodes;
            var keycode = e.keyCode;

            if (keycode == keyCodes.Down || keycode == keyCodes.Up) {
                e.preventDefault();
            }

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
                if (keycode == keyCodes.Enter || this.multiple) {
                    this.$ul.find('li.' + this.options.focusedItemClass).trigger('click.pSelect');
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

            return true;
        },
        inputKeyPress: function (e) {
            e.stopPropagation();
            if (!this.options.autoComplete) {
                e.preventDefault();
                var charcode = e.charCode || e.keyCode;
                this.findAndSelectNearest(charcode);
                this.$input.val('');
            }
            //return false;
        },
        inputKeyUp: function (e) {
            if (this.options.autoComplete) {
                var charcode = e.charCode || e.keyCode;
                var keycode = e.charCode || e.keyCode;
                this.filterOptions(keycode, charcode);
            }
            //return false;
        },
        findAndSelectNearest: function (charcode) {
            var that = this;
            if (charcode == 40 || charcode == 41) return; // ( and )
            if (!this.options.charsEntered) {
                this.options.charsEntered = [];
            }
            var charToMatch = String.fromCharCode(charcode);
            if (charToMatch != this.options.charsEntered[0]) {
                this.options.charsEntered.push(charToMatch);
                window.clearTimeout(this.options.nearestMatchTimeout);
                this.options.nearestMatchTimeout = window.setTimeout(function () {
                    that.options.charsEntered = [];
                    //that.$input.val('');
                }, 1000);
            }
            var matchString = this.options.charsEntered.join('');
            //that.$input.val(matchString);

            var matchLength = matchString.length;
            var matchExp = new RegExp(matchString, 'i');
            var matchingItems = [];
            var indexToUse = 0;
            for (var i = 0; i < this.Struct.items.length; i++) {
                var item = this.Struct.items[i];
                if (item.Disabled) {
                    continue;
                }
                var li = item.$li;

                var text = item.Text.substring(0, matchLength);
                if (text && text.match(matchExp)) {
                    matchingItems.push(item);
                    if (item.Selected || li.is('.' + that.options.focusedItemClass)) {
                        indexToUse = matchingItems.length;
                    }
                }
            }

            if (indexToUse >= matchingItems.length) {
                indexToUse = 0;
            }
            var foundItem = matchingItems[indexToUse];
            if (foundItem) {
                this.focusedItemIndex = foundItem.Index;
                this.setFocusToFocusedItem();
            }
        },
        filterOptions: function (keycode) {
            //this.consoleLog('filterOptions: ' + keycode);
            var keyCodes = $.fn.pSelect.keyCodes;
            /*
            
            if (keycode == keyCodes.Enter || keycode == keyCodes.Up || keycode == keyCodes.Down || keycode == keyCodes.Esc || keycode == keyCodes.Tab || keycode == keyCodes.Shift) {
                return;
            }
            */
            var inputVal = this.$input.val();
            if (keycode == keyCodes.Enter || this.lastInputValue == inputVal) {
                return;
            }
            this.lastInputValue = inputVal;

            if (!this.isOpen) {
                this.open();
            }

            var regExp = new RegExp(inputVal, 'i');
            //var firstFound = false;
            for (var i = 0; i < this.Struct.items.length; i++) {
                var item = this.Struct.items[i];
                if (item.Optgroup) {
                    continue;
                }
                item.Hidden = !regExp.test(item.Text);
            }

            this.updateUlView();
            this.positionUl();
            this.focusedItemIndex = 0;
            this.moveFocusUp();

        },
        closeOtherInstances: function () {
            for (var i = 0; i < $.fn.pSelect.instances.length; i++) {
                var instance = $.fn.pSelect.instances[i];
                if (instance !== this) {
                    //this.consoleLog('closeOtherInstances');
                    instance.close();
                    instance.blur();
                }
            }
        },
        options: {},
        hasFocus: false,
        isOpen: false,
        updateLabelViewTimeout: null,
        updateUlViewTimeout: null,
        positionUlTimeout: null,
        focusedItemIndex: 0,
        ulScrollTop: null,
        lastInputValue: '',
        multiple: false,
        consoleLog: function (o) {
            if (this.options.debug && window.console && window.console.log) console.log(o);
        }
    };


    $.fn.pSelect = function (option, event) {
        this.each(function () {

            var $this = $(this),
                options = typeof option == 'object' && option;

            if (option === 'remove') {
                $this.trigger('removeSelect.pSelect');
                return;
            }

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
        debug: false,
        inputClass: 'pInput',
        labelClass: 'pSelect',
        innerSpanClass: 'pInnerSpan',
        focusClass: 'pFocus',
        openClass: 'pOpen',
        focusedItemClass: 'pFocusedItem',
        selectedItemClass: 'pSelectedItem',
        disabledItemClass: 'pDisabledItem',
        autoCompleteClass: 'pAutoComplete',
        optgroupClass: 'pOptgroup',
        ulClass: 'pSelcetUl',
        normalUlClass: 'pNormal',
        multipleUlClass: 'pMultiple',
        selectCallback: null,
        addSelectClassToLabel: false,
        multiple: false,
        autoComplete: false,
        labelIfNoneSelected: null,
        summeyIfMoreThan: 0,
        summeyText: null,
        ulMaxHeight: null,
        getUlMaxHeight: null,
        Animate: null
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

    $.fn.pSelect.Item = function () {

    };

    $.fn.pSelect.Item.prototype = {
        Text: '',
        Selected: false,
        Focused: false,
        Disabled: false,
        Hidden: false,
        Optgroup: false,
        Index: 0,
        $option: null,
        $li: null
    };

})(jQuery);

