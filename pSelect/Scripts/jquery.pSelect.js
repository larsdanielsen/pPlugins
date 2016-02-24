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

            if (this.$selectBox.is('[multiple]')) {
                this.options.multiple = true;
            }

            this.$wrapperLabel = $('<label />')
                .addClass(this.options.labelClass)
                .addClass(function() { return that.$selectBox.attr('class'); });

            this.$label = $('<span/>').addClass('label-inner');

            this.$input = $('<input/>').addClass(this.options.inputClass);

            this.$selectBox.bind('removeSelect.pSelect', function() {
                if ($(this).is('.' + that.options.labelClass)) {
                    $(this).removeClass(that.options.labelClass);
                    $(this).parent('label.' + that.options.labelClass).before($(this)).remove();
                }
                $(this).unbind('.pSelect')
                    .removeData('pSelect');
            });

            this.$selectBox.addClass(this.options.labelClass);
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
        open: function open() {
            //console.log('open');
            var that = this;
            this.isOpen = true;
            this.fillUl();
            $('body').append(this.$ul);
            this.positionUl();
            this.updateLabelView();
            $(window).one('click.pSelect resize.pSelect', function() {
                that.close();
                that.blur();
            });
        },
        blur: function blur() {
            //console.log('blur');
            this.hasFocus = false;
            this.updateLabelView();
        },
        focus: function focus() {
            //console.log('focus');
            this.$input.focus();
        },
        close: function close(isMySelf) {
            //console.log('close, isMySelf: ' + isMySelf);
            this.isOpen = false;
            this.updateLabelView();
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
        updateLabelView: function updateLabelView() {
            var that = this;
            if (this.updateLabelViewTimeout) {
                window.clearTimeout(this.updateLabelViewTimeout);
            }
            this.updateLabelViewTimeout = window.setTimeout(function () {
                //console.log('updateLabelView');
                that.updateLabelViewTimeout = null;
                that.$wrapperLabel.toggleClass(that.options.openClass, that.isOpen);
                that.$wrapperLabel.toggleClass(that.options.focusClass, that.hasFocus);
                var options = that.$selectBox.find('option');
                var text = '';
                if (that.options.multiple) {
                    var selectedOptions = options.filter(':selected');
                    var allSelectedTexts = [];
                    selectedOptions.each(function() {
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
                that.$label.text(text);
            });
        },
        updateUlView: function updateUlView() {
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
                    
                    item.$li.toggleClass(that.options.selectedClass, item.Selected);
                    item.$li.toggleClass(that.options.disabledClass, item.Disabled);
                    item.$li.prop('disabled', item.Disabled);
                   
                    if (!activeFound && item.Active) {
                        activeFound = true;
                        item.$li.addClass(that.options.activeClass);
                    }
                }
            });
        },
        bindEvents: function bindEvents() {
            var that = this;

            this.$ul.on('click.pSelect', 'li', function(e) {
                e.stopPropagation();
                e.preventDefault();
                that.selectOption($(this).data('item'));
                if (that.options.multiple) {
                    that.focus();
                } else {
                    that.close(true);
                }
            });

            this.$wrapperLabel.on('click.pSelect', function(e) {
                //console.log('$wrapperLabel click.pSelect');
                that.closeOtherInstances();
                e.stopPropagation();
            });

            this.$input.on('focus.pSelect', function() {
                //console.log('$input focus.pSelect');
                that.closeOtherInstances();
                that.hasFocus = true;
                that.updateLabelView();
            });

            this.$input.on('blur.pSelect', function() {
                //console.log('blur, isOpen: ' + that.isOpen);
                if (that.isOpen) {
                    that.focus();
                } else {
                    that.blur();
                }
            });

            this.$input.on('click.pSelect', function(e) {
                //console.log('$input click.pSelect');
                e.stopPropagation();
                e.preventDefault();
                that.toggle();
            });

            this.$input.on('keydown.pSelect', function(e) {
                that.inputKeyDown(e);
            });
            this.$input.on('keypress.pSelect', function(e) {
                that.inputKeyPress(e);
            });

            this.$selectBox.on('updateLabelView.pSelect', function() {
                //console.log('$selectBox update.pSelect');
                that.updateLabelView();
            });
            this.$selectBox.on('change.pSelect', function(e) {
                //console.log('$selectBox change.pSelect');
                e.stopPropagation();
                e.preventDefault();
                that.updateLabelView();
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
        getStruct: function() {
            var that = this;
            var items = [];
            var i = 0;

            this.$selectBox.children().each(function() {
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
                item.Active = false;
                item.Disabled = true;
                item.Index = -1;
                item.$option = optgroup;
                items.push(item);

                optgroup.find('> option').each(
                    function() {
                        addOption($(this));
                    }
                );
            }

            function addOption(op) {
                if (!that.options.filter || op.text().match(that.options.filter)) {
                    var item = new $.fn.pSelect.Item();
                    item.Text = op.text();
                    item.Selected = !!op.is(':selected');
                    item.Active = !!op.is(':selected');
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
                that.$ul.height('');
                that.$ul.show();

                var minDistance = 0;

                if (above) {
                    minDistance = parseInt(ulCss.top / 4);
                    if (ulCss.top - that.$ul.outerHeight() - minDistance < 0) {
                        that.$ul.height(0);
                        wrapperLabelOfs = that.$wrapperLabel.offset();
                        that.$ul.height(wrapperLabelOfs.top - minDistance);
                    } else {
                        that.$ul.height('');
                    }
                    ulCss.top = wrapperLabelOfs.top - that.$ul.outerHeight();
                    ulCss.left = wrapperLabelOfs.left;
                } else {
                    minDistance = parseInt(($(window).height() - ulCss.top) / 4);
                    if (ulCss.top + that.$ul.outerHeight() + minDistance > $(window).height()) {
                        that.$ul.height(0);
                        wrapperLabelOfs = that.$wrapperLabel.offset();
                        that.$ul.height($(window).height() - wrapperLabelOfs.top - that.$wrapperLabel.outerHeight() - minDistance);
                    } else {
                        that.$ul.height('');
                    }
                }

                that.$ul.css(ulCss);

                if (!above && that.$ul.outerHeight() < that.$wrapperLabel.outerHeight()) {
                    that.$ul.height('');
                    that.positionUl(true);
                    return;
                }

                var selectedposition = that.$ul.find('li.' + that.options.selectedClass).position();
                if (selectedposition) {
                    that.$ul.get(0).scrollTop = selectedposition.top;
                }
            });
        },
        selectOption: function selectOption(item) {

            var newselection = true;
            //var li = item.$li;
            var option = item.$option;
            var index = item.Index;

            if (!item.Selected) {
                newselection = false;
            }
            if (this.options.multiple) {
                item.Selected = !item.Selected;
            } else {
                item.Selected = true;
                this.$selectBox.get(0).selectedIndex = index;
            }

            option.prop('selected', item.Selected);

            if (newselection && !this.options.runningInternalChange) {
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
                if (!this.options.multiple && !this.$ul.is(':visible')) {
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
            if (charcode == 40 || charcode == 41) return; // ( and )
            if (!this.options.charsEntered) {
                this.options.charsEntered = [];
            }
            var charToMatch = String.fromCharCode(charcode);
            if (charToMatch != this.options.charsEntered[0]) {
                this.options.charsEntered.push(charToMatch);
                window.clearTimeout(this.options.nearestMatchTimeout);
                this.options.nearestMatchTimeout = window.setTimeout(function() {
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
                var li = item.$li;
                var text = item.Text.substring(0, matchLength);
                if (text && text.match(matchExp)) {
                    matchingItems.push(item);
                    if (item.Selected || li.is('.' + that.options.activeClass)) {
                        indexToUse = matchingItems.length;
                    }
                }
            }

            //this.$ul.find('li').each(function () {
            //    var li = $(this);
            //    var text = li.text().substring(0, matchLength);
            //    if (text && text.match(matchExp)) {
            //        matchingLis.push(li);
            //        if (li.is('.' + that.options.selectedClass) || li.is('.' + that.options.activeClass)) {
            //            indexToUse = matchingLis.length;
            //        }
            //    }
            //});

            if (indexToUse >= matchingItems.length) {
                indexToUse = 0;
            }
            var foundItem = matchingItems[indexToUse];
            if (foundItem && foundItem.$li.size()) {
                this.setFocusTo(foundItem.$li);
            }
        },
        closeOtherInstances: function closeOtherInstances() {
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
        positionUlTimeout: null
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
        activeClass: 'pActive',
        selectedClass: 'pSelected',
        disabledClass: 'pDisabled',
        optgroupClass: 'pOptgroup',
        ulClass: 'pSelcetUl',
        normalUlClass: 'pNormal',
        multipleUlClass: 'pMultiple',
        selectCallback: null,
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

    $.fn.pSelect.Item = function () {

    };

    $.fn.pSelect.Item.prototype = {
        Text: '',
        Selected: false,
        Active: false,
        Disabled: false,
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
                    if (li.is('.' + that.options.selectedClass) || li.is('.' + that.options.activeClass)) {
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