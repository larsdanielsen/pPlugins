﻿!(function ($) {

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
        init: function () {
            var that = this;
            this.options.initDone = false;

            if (this.$selectBox.is('[multiple]')) {
                this.options.multiple = true;
            }

            this.$wrapperLabel = $('<label />')
                .addClass(this.options.labelClass)
                .addClass(function () { return that.$selectBox.attr('class'); });

            if (this.options.autocomplete) {
                this.$wrapperLabel.addClass(this.options.autocompleteClass);
            }

            this.$label = $('<span/>').addClass('label-inner');

            this.$input = $('<input/>').addClass(this.options.inputClass);

            this.$selectBox.bind('removeSelect.pSelect', function () {
                var pSelectInstance = $(this).data('pSelect');
                pSelectInstance.$wrapperLabel.before($(this)).remove();
                $(this).unbind('.pSelect')
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
            this.updateLabelView();

            this.options.initDone = true;
        },
        open: function () {
            //console.log('open');
            var that = this;
            this.$input.val('');
            this.isOpen = true;
            this.fillUl();
            $('body').append(this.$ul);
            this.positionUl();
            this.updateLabelView();
            $(window).one('click.pSelect resize.pSelect', function () {
                that.close();
                that.blur();
            });
        },
        blur: function () {
            //console.log('blur');
            this.hasFocus = false;
            this.updateLabelView();
        },
        focus: function () {
            //console.log('focus');
            this.$input.focus();
        },
        close: function (isMySelf) {
            //console.log('close, isMySelf: ' + isMySelf);
            this.isOpen = false;
            this.updateLabelView();
            this.$ul.detach();
            if (isMySelf) {
                this.focus();
            }
        },
        toggle: function () {
            //console.log('toggle');
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

                    if (that.options.multiple) {
                        var selectedOptions = options.filter(':selected');
                        var allSelectedTexts = [];
                        selectedOptions.each(function () {
                            allSelectedTexts.push($(this).text());
                        });
                        if (allSelectedTexts.length) {
                            text = allSelectedTexts.join(', ');
                        }
                    } else {
                        var selectedIndex = that.$selectBox.get(0).selectedIndex;
                        var selectedOption = $(that.$selectBox.find('option').get(selectedIndex));
                        text = selectedOption.text();
                    }
                } else {
                    //console.log(forcedText);
                    text = forcedText;
                }
                that.$label.text(text);
            });
        },
        updateUlView: function () {
            var that = this;
            if (this.updateUlViewTimeout) {
                window.clearTimeout(this.updateUlViewTimeout);
            }
            this.updateUlViewTimeout = window.setTimeout(function () {
                //console.log('updateUlViewTimeout');
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
            });
        },
        bindEvents: function () {
            var that = this;

            this.$ul.on('click.pSelect', 'li', function (e) {
                e.stopPropagation();
                e.preventDefault();
                that.selectOption($(this).data('item'));
                if (that.options.multiple) {
                    that.focus();
                } else {
                    that.close(true);
                }
            });

            this.$wrapperLabel.on('click.pSelect', function (e) {
                //console.log('$wrapperLabel click.pSelect');
                that.closeOtherInstances();
                e.stopPropagation();
            });

            this.$input.on('focus.pSelect', function () {
                //console.log('$input focus.pSelect');
                //that.fillUl();
                that.closeOtherInstances();
                that.hasFocus = true;
                that.updateLabelView();
            });

            this.$input.on('blur.pSelect', function () {
                //console.log('blur, isOpen: ' + that.isOpen);
                if (that.isOpen) {
                    that.focus();
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
            this.$input.on('keyup.pSelect', function (e) {
                that.inputKeyUp(e);
            });

            this.$selectBox.on('updateLabelView.pSelect', function () {
                //console.log('$selectBox update.pSelect');
                that.updateLabelView();
            });
            this.$selectBox.on('change.pSelect', function (e) {
                e.preventDefault();
                if (!that.isOpen) {
                    that.fillUl();
                }
                that.updateLabelView();
            });
        },
        getUl: function () {
            this.$ul = $('<ul/>')
                .addClass(this.options.ulClass);
            //.addClass(function () { return that.$selectBox.attr('class'); });

            if (this.options.multiple) {
                this.$ul.addClass(this.options.multipleUlClass);
            } else {
                this.$ul.addClass(this.options.normalUlClass);
            }
        },
        fillUl: function () {
            //console.log('fillUl');
            this.$ul.empty();
            this.getStruct();
            for (var i = 0; i < this.Struct.items.length; i++) {
                var item = this.Struct.items[i];
                var li = $('<li/>')
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
                //console.log('positionUlTimeout');
                that.positionUlTimeout = null;

                that.$ul.hide();
                var ulCss = {};
                ulCss.width = that.$wrapperLabel.outerWidth() + 'px';
                var wrapperLabelOfs = that.$wrapperLabel.offset();
                ulCss.top = wrapperLabelOfs.top + that.$wrapperLabel.outerHeight();
                ulCss.left = wrapperLabelOfs.left;
                that.$ul.css('max-height', 'none');
                that.$ul.show();

                var minDistance = 0;

                if (above) {
                    minDistance = parseInt(ulCss.top / 4);
                    if (ulCss.top - that.$ul.outerHeight() - minDistance < 0) {
                        that.$ul.height(0);
                        that.$ul.css('max-height', '0');
                        wrapperLabelOfs = that.$wrapperLabel.offset();
                        that.$ul.css('max-height', (wrapperLabelOfs.top - minDistance) + 'px');
                    } else {
                        that.$ul.css('max-height', 'none');
                    }
                    ulCss.top = wrapperLabelOfs.top - that.$ul.outerHeight();
                    ulCss.left = wrapperLabelOfs.left;
                } else {
                    minDistance = parseInt(($(window).height() - ulCss.top) / 4);
                    if (ulCss.top + that.$ul.outerHeight() + minDistance > $(window).height()) {
                        that.$ul.css('max-height', '0');
                        wrapperLabelOfs = that.$wrapperLabel.offset();
                        that.$ul.css('max-height', ($(window).height() - wrapperLabelOfs.top - that.$wrapperLabel.outerHeight() - minDistance) + 'px');
                    } else {
                        that.$ul.css('max-height', 'none');
                    }
                }

                that.$ul.css(ulCss);

                if (!above && that.$ul.outerHeight() < that.$wrapperLabel.outerHeight()) {
                    that.$ul.css('max-height', 'none');
                    that.positionUl(true);
                    return;
                }

                var selectedposition = that.$ul.find('li.' + that.options.selectedItemClass).position();
                if (selectedposition) {
                    that.$ul.get(0).scrollTop = selectedposition.top;
                }
            });
        },
        selectOption: function (item) {
            //console.log(item);
            if (this.options.multiple) {
                item.Selected = !item.Selected;
            } else {
                item.Selected = true;
            }

            item.$option.prop('selected', item.Selected);

            if (!this.options.runningInternalChange) {
                this.options.runningOriginalChange = true;
                this.$selectBox.trigger('change');
                this.options.runningOriginalChange = false;
            }

            this.updateLabelView();
            this.updateUlView();

            if (this.options.selectCallback) {
                this.options.selectCallback(this);
            }
        },
        moveFocus: function (dir) {
            var that = this;
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
                if (!that.options.multiple && !that.isOpen) {
                    item.$li.trigger('click.pSelect');
                }
                var liTop = item.$li.position().top;
                var ulInnerHeight = that.$ul.innerHeight();
                var liOuterHeight = item.$li.outerHeight(true);
                var ulScrollTop = that.$ul.get(0).scrollTop;
                if (liTop < ulScrollTop) {
                    that.$ul.get(0).scrollTop = liTop; // scroll up
                } else if (liTop + liOuterHeight > ulInnerHeight + ulScrollTop) {
                    that.$ul.get(0).scrollTop = liOuterHeight + liTop - ulInnerHeight; // scroll down
                }
            }, 0);
        },
        inputKeyDown: function (e) {

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
            var charcode = e.charCode || e.keyCode;
            if (!this.options.autocomplete) {
                this.findAndSelectNearest(charcode);
            }
            return false;
        },
        inputKeyUp: function (e) {
            if (this.options.autocomplete) {

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
                    that.$input.val('');
                }, 1000);
            }
            var matchString = this.options.charsEntered.join('');
            that.$input.val(matchString);

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
                this.setFocusTo(foundItem);
            }
        },
        filterOptions: function (keycode) {
            //console.log('filterOptions: ' + keycode);
            var keyCodes = $.fn.pSelect.keyCodes;
            if (keycode == keyCodes.Enter || keycode == keyCodes.Up || keycode == keyCodes.Down) {
                return;
            }
            var regExp = new RegExp(this.$input.val(), 'i');
            //var firstFound = false;
            for (var i = 0; i < this.Struct.items.length; i++) {
                var item = this.Struct.items[i];
                if (item.Optgroup) {
                    continue;
                }
                item.Hidden = !regExp.test(item.Text);
            }

            this.updateUlView();
            this.focusedItemIndex = 0;
            this.moveFocusUp();
        },
        closeOtherInstances: function () {
            for (var i = 0; i < $.fn.pSelect.instances.length; i++) {
                var instance = $.fn.pSelect.instances[i];
                if (instance !== this) {
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
        focusedItemIndex: 0
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
        debug: true,
        inputClass: 'pInput',
        labelClass: 'pSelect',
        focusClass: 'pFocus',
        openClass: 'pOpen',
        focusedItemClass: 'pFocusedItem',
        selectedItemClass: 'pSelectedItem',
        disabledItemClass: 'pDisabledItem',
        autocompleteClass: 'pAutocomplete',
        optgroupClass: 'pOptgroup',
        ulClass: 'pSelcetUl',
        normalUlClass: 'pNormal',
        multipleUlClass: 'pMultiple',
        selectCallback: null,
        multiple: false,
        autocomplete: true
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


/*

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
                    if (li.is('.' + that.options.selectedItemClass) || li.is('.' + that.options.focusedItemClass)) {
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
        }

 */