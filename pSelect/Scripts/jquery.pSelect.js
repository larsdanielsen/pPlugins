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
            }

            this.$wrapperLabel = $('<label />')
                .addClass(this.options.labelClass)
                .addClass(function () { return that.$selectBox.attr('class'); });

            this.$label = $('<span/>').text('hep');

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

            this.bindEvents();

            /*  this.$selectBox.closest('form').bind('reset.pSelect', function () {
                  that.$selectBox.prop('checked', that.$selectBox.get(0).defaultChecked);
                  that.$selectBox.trigger('change.pSelect');
              });
              this.$selectBox.bind('change.pSelect', function () {
                  that.$selectBox.trigger('update.pSelect');
              });*/


            this.$selectBox.trigger('update.pSelect');

            this.options.initDone = true;
        },
        open: function open() {
            //console.log('open');
            this.isOpen = true;
            this.$wrapperLabel.addClass(this.options.openClass);
            this.getUl();
            this.positionUl();
        },
        close: function close() {
            //console.log('close');
            this.$wrapperLabel.removeClass(this.options.openClass);
            if (this.$ul) {
                this.$ul.remove();
            }

            this.isOpen = false;
        },
        toggle: function toggle() {
            //console.log('toggle');
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        update: function () {
            //console.log('update');
            var struct = this.getStruct();
            var found = false, text = '';
            for (var i = 0; i < struct.length; i++) {
                if (struct[i].selected) {
                    text = struct[i].text;
                    found = true;
                }
            }
            /*if (!found && struct.length > 0) {
                text = struct[0].text;
            }*/
            this.$selectBox.trigger('change.pSelect');
        },
        bindEvents: function bindEvents() {
            var that = this;

            this.$wrapperLabel.bind('click.pSelect', function (e) {
                //console.log('$wrapperLabel click.pSelect');
                e.stopPropagation();
            });

            this.$input.bind('focus.pSelect', function () {
                //console.log('$input focus.pSelect');
                that.$wrapperLabel.addClass(that.options.focusClass);
            });

            this.$input.bind('blur.pSelect', function (e) {
                //console.log('$input blur.pSelect');
                e.stopPropagation();
                that.$wrapperLabel.removeClass(that.options.focusClass);
            });

            this.$input.bind('click.pSelect', function (e) {
                //console.log('$input click.pSelect');
                e.stopPropagation();
                that.toggle();
            });

            this.$input.bind('keydown.pSelect', function (e) {
                that.inputKeyDown(e);
            });
            this.$input.bind('keypress.pSelect', function (e) {
                that.inputKeyPress(e);
            });

            this.$selectBox.bind('update.pSelect', function () {
                //console.log('$selectBox update.pSelect');
                that.update();
            });
            this.$selectBox.bind('change.pSelect', function (e) {
                //console.log('$selectBox change.pSelect');
                e.stopPropagation();
                e.preventDefault();
                var selectedIndex = that.$selectBox.get(0).selectedIndex;
                var selectedOption = $(that.$selectBox.find('option').get(selectedIndex));
                that.$label.text(selectedOption.text());
            });

            $(document).bind('click.pSelect', function () {
                //console.log('document click.pSelect');
                that.close();
            });

        },
        getUl: function getUl() {
            var that = this;
            this.$ul = $('<ul/>').addClass(this.options.ulClass);
            var struct = this.getStruct();
            for (var i = 0; i < struct.length; i++) {
                var opt = struct[i];
                var li = $('<li/>')
                    .text(opt.text)
                    .data('index', opt.index);

                if (opt.selected) {
                    li.addClass(this.options.selectedClass);
                }
                
                if (opt.active) {
                    li.addClass(this.options.activeClass);
                }

                li.bind('click.pSelect',
                    function (e) {
                        console.log(this);
                        e.stopPropagation();
                        that.selectOption($(this));
                        that.close();
                        //objects.input.trigger('focus.DGselectbox');
                    });

                this.$ul.append(li);
            }
            $('body').append(this.$ul);
        },
        getStruct: function () {
            var that = this;
            var struct = new Array();
            var i = 0;
            this.$selectBox.find('option').each(
                function () {
                    var op = $(this);
                    if (!that.options.filter || op.text().match(that.options.filter)) {
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
        selectOption: function selectOption(li) {
            var newselection = true;
            if (li.is('.selected')) {
                newselection = false;
            }
            li.addClass(this.options.selectedClass)
                .siblings().removeClass(this.options.selectedClass);

            if (this.options.source == 'select') {
                var index = li.data('index');
                if (this.options.initDone) {
                    this.$selectBox.get(0).selectedIndex = index;
                    if (newselection && !this.options.runningInternalChange) {
                        this.options.runningOriginalChange = true;
                        this.$selectBox.trigger('change');
                        this.options.runningOriginalChange = false;
                    }
                }
            }

            //objects.input.trigger('focus.DGselectbox');
            // HideAllDGselectbox_uls();

            if (this.options.selectCallback) {
                this.options.selectCallback(this);
            }
        },
        moveFocus: function moveFocus(dir) {
            //console.log('moveFocus ' + dir);
            var that = this;
            if (this.$ul) {
                var currentActive = this.$ul.find('li:first');
                var counter = 0;
                this.$ul.find('li').each(function () {
                    var li = $(this);
                    if (li.is('.' + that.options.activeClass)) {
                        currentActive = li;
                    }
                    counter++;
                });

                if (currentActive.size()) {
                    var newActive;
                    if (dir == 1) {
                        newActive = currentActive.next();
                    } else if (dir == -1) {
                        newActive = currentActive.prev();
                    } else {
                        newActive = currentActive;
                    }
                    this.setFocusTo(newActive);
                }
            }
        },
        setFocusTo: function setFocusTo(li) {
            //console.log(li);
            if (li.size()) {
                this.$ul.children('li').removeClass(this.options.activeClass);
                li.addClass(this.options.activeClass);
                if (!this.$ul.is(':visible')) {
                    li.trigger('click.pSelect');
                }
                if (li.position().top < 0) {
                    this.$ul.get(0).scrollTop += li.position().top; // scroll up
                } else if (li.position().top + li.outerHeight(true) > this.$ul.innerHeight()) {
                    this.$ul.get(0).scrollTop += li.outerHeight(true) + li.position().top - this.$ul.innerHeight(); // scroll down
                }
            }
        },
        moveFocusUp: function moveFocusUp() {
            this.moveFocus(-1);
        },
        moveFocusDown: function moveFocusDown() {
            //console.log('moveFocusDown');
            this.moveFocus(1);
        },
        inputKeyDown: function inputKeyDown(e) {
            //Say('InputKeyDown');

            var keycode = e.keyCode;

            if (keycode == 40) { // down arrow
                if (e.altKey) {
                    this.$input.trigger('click.pSelect');
                } else {
                    this.moveFocusDown();
                }
            } else if (keycode == 38) { // up arrow
                this.moveFocusUp();
            } else if (keycode == 13) { // enter
                e.preventDefault();
                this.$ul.find('li.' + this.options.activeClass).trigger('click.pSelect');
            } else if (keycode == 27) { // esc
                this.close();
            } else if (keycode == 9) { // tab
                this.close();
            }

            if (keycode != 9 && keycode != 16) { // shift and tab is allowed to pass
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
            $this.data('pSelect', new pSelect(this, options, event));

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
        ulClass: 'pSelcetUl'
    };



})(jQuery);