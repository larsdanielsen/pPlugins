/*
Datagraf jQuery selectbox plugin
Author: Lars Danielsen

Replaces a HTML select element with a construction of html, that reacts in a similar
way as the original element. The selection made in the constructed element is
propagated to the original select element, and changes made to the original
element is propagated to the constructed element.

The original element's onchange events are fired appropiately;

Will not work for select-multiple elements

Required: jQuery 1.4 or above

Synopsis:

jQuery(elem).DGselectbox();

Resulting html example:

<div class="DGselectbox-fieldwrapper DGselectbox-test" style="position: static; display: inline; float: none; top: auto; left: auto; right: auto; width: 196px; height: 18px; margin: 0px; padding: 0px; font-family: MS Shell Dlg; font-size: 13.3333px; color: rgb(0, 0, 0);">
<select name="sel1" id="test" style="display: none;">
<option value="a">First option</option>
<option value="b">Second option, very long text, that will wrap ...</option>
<option value="c">Third option</option>
</select>
<div class="DGselectbox-inputwrapper" style="width: 196px; height: 18px; overflow: hidden; position: relative;">
<input value="" name="DGselectbox_test" class="DGselectbox" autocomplete="off" readonly="" style="left: -10px; top: 0pt; position: absolute; height: 1px; width: 1px;">
<label class="DGselectbox" style="display: block; overflow: hidden; white-space: nowrap; width: 174px; font-family: MS Shell Dlg; font-size: 13.3333px; color: rgb(0, 0, 0);">First option</label>
</div>
</div>
<ul class="DGselectbox" style="position: absolute; width: 196px; display: none; font-family: MS Shell Dlg; font-size: 13.3333px; color: rgb(0, 0, 0);">
<li value="0" class="active selected">First option</li>
<li value="0" class="">Second option, very long text, that will wrap ...</li>
<li value="0" class="">Third option</li>
</ul>

You can to do further positioning and styling yourself.
Use margin on the ul.DGselectbox to do exact positioning

*/

jQuery.fn.DGselectbox = function (init) {
    var defaults = {
        autoStyle: true,
        setSize: true,
        outerWidth: undefined,
        innerWidth: undefined,
        outerHeight: undefined,
        innerHeight: undefined,
        frameWidth: undefined,
        borderWidth: undefined,
        debug: false,
        selectCallback: false,
        optionCreateCallback: false,
        classNames: undefined,
        charsEntered: new Array(),
        nearestMatchTimeout: null,
        advanced: true,
        source: 'select',
        name: null,
        autocomplete: false,
        zIndex: undefined
    };

    return this.each(function () {
        var action;
        if (typeof init != 'object') {
            action = init;
        }

        var options = jQuery.extend(defaults, init);
        options.name = null;

        options.source = jQuery(this).outer().match(/\w+/)[0];
        options.source = options.source.toLowerCase() || 'select';
        if (options.source == 'ul') {
            options.outerHeight = jQuery(this).find('li').outerHeight();
            options.innerHeight = jQuery(this).find('li').innerHeight();
            options.autocomplete = true;
        }

        options.outerWidth = (options.outerWidth === undefined) ? jQuery(this).outerWidth() : options.outerWidth;
        options.innerWidth = (options.innerWidth === undefined) ? jQuery(this).innerWidth() : options.innerWidth;
        options.innerHeight = (options.innerHeight === undefined) ? jQuery(this).innerHeight() : options.innerHeight;
        options.outerHeight = (options.outerHeight === undefined) ? jQuery(this).outerHeight() : options.outerHeight;
        options.frameWidth = options.frameWidth || 0;
        options.buttonWidth = (options.buttonWidth === undefined) ? jQuery(this).outerHeight() : options.buttonWidth;

        options.name = jQuery(this).attr('id') || jQuery(this).attr('name');

        if (!jQuery.DG_selectbox_uls) {
            jQuery.DG_selectbox_uls = new Array();
            jQuery(document).bind('click.DGselectbox', function (event) {
                HideAllDGselectbox_uls();
            });
        }
        if (options.debug) {
            if (!jQuery('#DGselectbox_debug').size()) {
                jQuery('body').append('<div id="DGselectbox_debug"></div>');
            }
        }

        MakeSelectbox(jQuery(this), options);
    });

    function MakeSelectbox(o, options) {
        options.initDone = false;
        o.trigger('RemoveDGselectbox');
        //options.originalChange = o.get(0).onchange;

        var objects = {};
        objects.fieldwrapper = GetFieldwrapper(o, options);
        objects.inputwrapper = GetInputwrapper(o, options);
        objects.input = GetInput(o, options);
        objects.label = GetLabel(o, options);
        if (options.autocomplete) {
            objects.autocompleteinput = GetAutocompleteInput(o, options);
            objects.input.hide();
        }
        objects.ul = GetUl(o, options);

        if (options.advanced) {
            objects.inputwrapper.append(objects.input);
            o.hide();
        } else {
            o.css('top', o.outerHeight() * -1); //hideSelect(o);
        }
        objects.inputwrapper.append(objects.label);
        if (options.autocomplete) {
            objects.inputwrapper.append(objects.autocompleteinput);
        }


        o.before(objects.fieldwrapper);
        objects.fieldwrapper
            .append(o)
            .append(objects.inputwrapper);

        /*o.wrap(objects.fieldwrapper)
            .after(objects.inputwrapper);

        objects.fieldwrapper = objects.inputwrapper.parent();*/

        jQuery('body').append(objects.ul);
        jQuery.DG_selectbox_uls.push(objects.ul);

        o.bind('change.DGselectbox', function (event) {
            event.stopPropagation();
            event.preventDefault();
            options.runningInternalChange = true;
            if (options.runningOriginalChange) {
            } else {
                var newli = jQuery(objects.ul.find('li').get(o.get(0).selectedIndex)).addClass('selected');
                SelectOption(null, options, objects, newli);
            }
            options.runningInternalChange = false;
        }).bind('RemoveDGselectbox', function () {
            RemoveDGselectbox(o, options, objects);
        });


        objects.inputwrapper.bind('click.DGselectbox', function (event) {
            event.stopPropagation();
            objects.ul.empty().toggle();
            objects.input.trigger('focus.DGselectbox');
            if (objects.ul.is(':visible')) {
                objects.ul.trigger('position');
            }
        });

        objects.input.bind('keydown.DGselectbox', function (event) {
            InputKeyDown(event, o, options, objects);
        });
        objects.input.bind('keypress.DGselectbox', function (event) {
            InputKeyPress(event, o, options, objects);
        });

        objects.input.add(objects.autocompleteinput).bind('blur.DGselectbox', function (event) {
            if (objects.ul.is(':visible')) {
                objects.input.trigger('focus.DGselectbox');
                //o.trigger('collapse.DGselectbox');
            } else {
                objects.inputwrapper.removeClass('focus');
                objects.fieldwrapper.removeClass('focus');
            }
        });

        objects.input.bind('focus.DGselectbox', function (event) {
            //HideAllDGselectbox_uls (objects.ul);
            objects.inputwrapper.addClass('focus');
            objects.fieldwrapper.addClass('focus');
            FillOptions(o, options, objects);
        });
        if (options.autocomplete) {
            objects.autocompleteinput.bind('keyup.DGselectbox', function (event) {
                AutocompleteInputKeyUp(event, o, options, objects, this);
            });

            objects.autocompleteinput.bind('keydown.DGselectbox', function (event) {
                InputKeyDown(event, o, options, objects);
            });
            objects.autocompleteinput.bind('keypress.DGselectbox', function (event) {
                InputKeyPress(event, o, options, objects);
            });


            objects.autocompleteinput.bind('click.DGselectbox', function (event) {
                //event.stopPropagation();
                //objects.inputwrapper.trigger('click.DGselectbox');
                o.trigger('expand.DGselectbox')
            });

            objects.autocompleteinput.bind('focus.DGselectbox', function (event) {
                objects.label.hide();
                objects.autocompleteinput.css('color', 'inherit');
                //objects.ul.empty().show();
                //objects.autocompleteinput.trigger('keyup');
                //objects.input.trigger('focus.DGselectbox');
                o.trigger('expand.DGselectbox');
            });

            objects.autocompleteinput.bind('focusout.DGselectbox', function (event) {
                objects.label.show();
                //objects.ul.hide();
            });


            objects.autocompleteinput.bind('hide.DGselectbox', function (event) {
                objects.autocompleteinput.css('color', 'transparent');
                //objects.ul.hide();
            });

        } else {

        }

        objects.ul.bind('position', function () { PositionUl(o, options, objects); })
            .bind('focusout', function () {
                objects.inputwrapper.removeClass('focus');
                objects.fieldwrapper.removeClass('focus');
                objects.label.show();
                if (objects.autocompleteinput) objects.autocompleteinput.trigger('hide.DGselectbox');
            });


        o.bind('expand.DGselectbox', function (event) {
            OpenSelectbox(o, options, objects);
        });

        o.bind('collapse.DGselectbox', function (event) {
            CloseSelectbox(o, options, objects);
        });

        o.bind('toggle.DGselectbox', function (event) {
            ToggleSelectbox(o, options, objects);
        });

        o.parents('label').bind('click.DGselectbox', function (e) {
            e.stopPropagation();
            HideAllDGselectbox_uls(objects.ul);
        });

        FillOptions(o, options, objects);
        SetSelected(o, options, objects);
        objects.input.blur();
        if (options.debug) {
            jQuery('#DGselectbox_debug').text('stopped');
        }
        options.initDone = true;
    }

    function OpenSelectbox(o, options, objects) {
        FillOptions(o, options, objects);
        objects.ul.show();
        objects.ul.trigger('position');
    }

    function CloseSelectbox(o, options, objects) {
        objects.label.show();
        if (objects.autocompleteinput) objects.autocompleteinput.trigger('hide.DGselectbox');
        objects.ul.hide();
    }

    function ToggleSelectbox(o, options, objects) {
        if (objects.ul.is(':visible')) {
            CloseSelectbox(o, options, objects)
        } else {
            OpenSelectbox(o, options, objects)
        }
    }

    function FillOptions(o, options, objects) {
        if (objects.ul.find('li').size() == 0) {
            var struct = GetStruct(o, options);
            for (var i = 0; i < struct.length; i++) {
                var li = GetLi(o, options, objects);
                var item = struct[i];
                li.text(item.text);
                li.data('index', item.index);
                if (item.selected) {
                    li.addClass('selected');
                }
                if (item.active) {
                    li.addClass('active');
                }
                li.bind('click.DGselectbox',
                    function (event) {
                        event.stopPropagation();
                        LiClick(o, options, objects, jQuery(this));
                    });
                if (options.optionCreateCallback) {
                    options.optionCreateCallback({ item: item, li: li, option: item.option });
                }
                objects.ul.append(li);
            }
        }
    }

    function LiClick(o, options, objects, li) {
        SelectOption(o, options, objects, li);
        objects.input.trigger('focus.DGselectbox');
    }

    function SetSelected(o, options, objects) {
        SelectOption(o, options, objects, objects.ul.find('li.selected'));
    }

    function PositionUl(o, options, objects, above) {
        var ofs = objects.inputwrapper.offset();
        objects.ul.css('top', ofs.top + options.outerHeight);
        objects.ul.css('left', ofs.left);
        objects.ul.height('');


        if (above) {
            if (ofs.top - objects.ul.outerHeight(true) - 30 < 0) {
                objects.ul.height(0);
                ofs = objects.inputwrapper.offset();
                objects.ul.height(ofs.top - 30);
            } else {
                objects.ul.height('');
            }
            objects.ul.css('top', ofs.top - objects.ul.outerHeight(true));
            objects.ul.css('left', ofs.left);
        } else {
            if (ofs.top + objects.ul.outerHeight() + 30 > jQuery(window).height()) {
                objects.ul.height(0);
                ofs = objects.inputwrapper.offset();
                objects.ul.height(jQuery(window).height() - ofs.top - options.outerHeight - 30);
                objects.ul.css('top', ofs.top + options.outerHeight);
                objects.ul.css('left', ofs.left);
            } else {
                objects.ul.height('');
            }
        }

        //ul.height(ul.height() - ul.height() % optionHeight);
        //alert(ul.height());
        if (!above && objects.ul.height() < options.outerHeight) {
            objects.ul.height('');
            PositionUl(o, options, objects, true);
            return;
        }

        var selectedposition = objects.ul.find('li.selected').position();
        if (selectedposition) {
            objects.ul.get(0).scrollTop = objects.ul.find('li.selected').position().top;
        }
    }

    function SelectOption(o, options, objects, li) {
        var newselection = true;
        if (li.is('.selected')) {
            newselection = false;
        }
        li.addClass('selected')
            .siblings().removeClass('selected');

        if (options.source == 'select') {
            var index = li.data('index');
            if (options.initDone && o) {
                o.get(0).selectedIndex = index;
                //Say(index);
                if (newselection && !options.runningInternalChange) {
                    options.runningOriginalChange = true;
                    o.trigger('change');
                    options.runningOriginalChange = false;
                }
            }
        }

        objects.label.text(li.text());
        objects.input.trigger('focus.DGselectbox');
        HideAllDGselectbox_uls();

        if (options.selectCallback) {
            options.selectCallback(o);
        }
    }

    function InputKeyDown(event, o, options, objects) {
        //Say('InputKeyDown');
        var keycode = event.keyCode;

        if (keycode == 40) { // down arrow
            if (event.altKey) {
                objects.inputwrapper.trigger('click.DGselectbox');
            } else {
                MoveFocusDown(o, options, objects);
            }
        } else if (keycode == 38) { // up arrow
            MoveFocusUp(o, options, objects);
        } else if (keycode == 13) { // enter
            event.preventDefault();
            objects.ul.find('li.active').trigger('click.DGselectbox');
        } else if (keycode == 27) { // esc
            objects.ul.hide();
            objects.input.blur();
        } else if (keycode == 9) { // tab
            objects.ul.hide();
        }

        if (keycode != 9 && keycode != 16) { // shift and tab is allowed to pass
            //event.preventDefault();
            return true;
        }
        return false;
    }

    function InputKeyPress(event, o, options, objects) {
        //event.preventDefault();
        //Say('InputKeyPress: ' + event.keyCode);
        var charcode = event.charCode || event.keyCode;
        var keycode = event.keyCode;
        FindAndSelectNearest(o, options, objects, charcode);
        return false;
    }

    function AutocompleteInputKeyUp(event, o, options, objects, obj) {
        if (options.autocomplete) {
            var keycode = event.keyCode;
            if (keycode == 40 || keycode == 38) { // down arrow // up arrow
                return false;
            } else {
                FilterList(o, options, objects, $(obj).val());
            }
        }
        return true;
    }


    function FilterList(o, options, objects, val) {
        //Say(val);
        options.filter = new RegExp(val, 'i');

        objects.ul.empty();
        FillOptions(o, options, objects);
        MoveFocus(o, options, objects, 0);
        //PositionUl (o, options, objects);
        o.trigger('expand.DGselectbox');
        //objects.ul.trigger('position');
    }

    function FindAndSelectNearest(o, options, objects, charcode) {
        var charToMatch = String.fromCharCode(charcode);
        //if (!charToMatch.match(/[\w|\d|æøå]/i)) return;
        //Say(charcode + ' - ' + charToMatch);
        if (charcode == 40 || charcode == 41) return; // ( and )
        if (charToMatch != options.charsEntered[0]) {
            options.charsEntered.push(charToMatch);
            window.clearTimeout(options.nearestMatchTimeout);
            options.nearestMatchTimeout = window.setTimeout(function () {
                options.charsEntered = new Array();
            }, 1000);
        }
        var indexToUse = 0;
        var matchString = options.charsEntered.join('');
        var matchLength = matchString.length;
        var matchExp = new RegExp(matchString, 'i');
        var matchingLis = new Array();
        objects.ul.find('li').each(function () {
            var li = jQuery(this);
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
            SetFocusTo(options, objects, foundLi);
        }
    }

    function MoveFocusDown(o, options, objects) {
        MoveFocus(o, options, objects, 1);
    }
    function MoveFocusUp(o, options, objects) {
        MoveFocus(o, options, objects, -1);
    }

    function MoveFocus(o, options, objects, dir) {
        var currentActive = objects.ul.find('li:first');
        var counter = 0;
        objects.ul.find('li').each(function () {
            var li = jQuery(this);
            if (li.is('.active')) {
                currentActive = li;
            }
            counter++;
        });
        if (currentActive.size()) {
            var newActive = null;
            if (dir == 1) {
                newActive = currentActive.next();
            } else if (dir == -1) {
                newActive = currentActive.prev();
            } else {
                newActive = currentActive;
            }
            SetFocusTo(options, objects, newActive);
        }
    }

    function SetFocusTo(options, objects, li) {
        if (li.size()) {
            objects.ul.children('li').removeClass('active');
            li.addClass('active');
            if (!objects.ul.is(':visible')) {
                li.trigger('click.DGselectbox');
            }
            if (li.position().top < 0) {
                objects.ul.get(0).scrollTop += li.position().top; // scroll up
            } else if (li.position().top + li.outerHeight(true) > objects.ul.innerHeight()) {
                objects.ul.get(0).scrollTop += li.outerHeight(true) + li.position().top - objects.ul.innerHeight(); // scroll down
            }
        }
    }

    function HideAllDGselectbox_uls(exceptMe) {
        for (var i = 0; i < jQuery.DG_selectbox_uls.length; i++) {
            var ul = jQuery(jQuery.DG_selectbox_uls[i]);
            if (ul.is(':visible') && (exceptMe && exceptMe.get(0)) !== ul.get(0)) {
                ul.hide()
                    .trigger('focusout');
            }
        }
    }

    function RemoveDGselectbox(o, options, objects) {
        if (o.size() && objects.ul.size()) {
            objects.ul.remove();
            var wrapper = o.parent('.DGselectbox-fieldwrapper');
            if (wrapper.size()) {
                wrapper.before(o);
                wrapper.remove();
            }
            if (!options.advanced) {
                o.unbind('keydown.DGselectbox')
                    .unbind('keypress.DGselectbox')
                    .unbind('blur.DGselectbox')
                    .unbind('focus.DGselectbox');


                for (var key in options.originalStyles) {
                    //alert(key + ': ' + options.originalStyles[key]);
                    o.css(key, options.originalStyles[key]);
                }
            }
            o.parents('label').unbind('click.DGselectbox');
            o.unbind('RemoveDGselectbox')
                .unbind('change.DGselectbox')
                .unbind('expand.DGselectbox')
                .show();
        }
    }

    function GetInputwrapper(o, options) {
        var inputwrapper = jQuery('<div class="DGselectbox-inputwrapper"></div>')
            .css('position', 'relative');
        if (options.autoStyle) {
            inputwrapper.css('color', o.css('color'));
        }
        if (options.setSize) {
            inputwrapper.width(options.outerWidth - (options.frameWidth * 2))
                .height(options.outerHeight - (options.frameWidth * 2));
        }
        return inputwrapper;
    }

    function GetFieldwrapper(o, options) {
        var fieldwrapper = jQuery('<div class="DGselectbox-fieldwrapper DGselectbox-' + options.name + '"></div>');
        fieldwrapper.css('position', 'relative')
            .css('display', o.css('display'))
            .css('overflow', 'hidden')
            .css('float', o.css('float'))
            .css('position', o.css('position'))
            .css('top', o.css('top'))
            .css('bottom', o.css('bottom'))
            .css('left', o.css('left'))
            .css('right', o.css('right'));

        if (options.autoStyle) {
            fieldwrapper.css('font-family', o.css('font-family'))
                .css('font-size', o.css('font-size'))
                .css('color', o.css('color'))
                .css('margin-left', o.css('margin-left'))
                .css('margin-right', o.css('margin-right'))
                .css('margin-top', o.css('margin-top'))
                .css('margin-bottom', o.css('margin-bottom'))
                .css('padding-left', o.css('padding-left'))
                .css('padding-right', o.css('padding-right'))
                .css('padding-top', o.css('padding-top'))
                .css('padding-bottom', o.css('padding-bottom'));
        }
        if (options.setSize) {
            fieldwrapper.width(options.outerWidth)
                .height(options.outerHeight);
        }

        AddClassNames(fieldwrapper, options);
        return fieldwrapper;
    }

    function GetInput(o, options) {
        if (options.advanced) {
            var input = jQuery('<a class="DGselectbox" href="#" contenteditable="true" name="DGselectbox_' + options.name + '" />')
            //.attr('autocomplete','off')
                .css('border', '1px solid blue')
                .css('position', 'absolute')
                .css('left', '-100px')
                .css('top', '-100px')
                .css('overflow', 'hidden')
                .height(1)
                .width(1);

            return input;
        } else {
            options.originalStyles = {
                top: o.css('top'),
                position: o.css('position'),
                marginTop: o.css('marginTop'),
                marginBottom: o.css('marginBottom'),
                marginLeft: o.css('marginLeft'),
                marginRight: o.css('marginRight')
            };
            o.css('position', 'absolute')
                .css('marginTop', '0')
                .css('marginBottom', '0')
                .css('marginLeft', '0')
                .css('marginRight', '0');
            return o;
        }
    }

    function GetLabel(o, options) {
        var label;
        label = jQuery('<label class="DGselectbox"></label>');
        if (options.autoStyle) {
            label.css('font-family', o.css('font-family'))
                .css('font-size', o.css('font-size'))
                .css('display', 'block')
                .css('overflow', 'hidden')
                .css('white-space', 'nowrap');
        }

        if (options.setSize) {
            label.width('auto')
                .height(options.innerHeight)
                .css('margin-right', options.buttonWidth);
        }
        return label;
    }

    function GetAutocompleteInput(o, options) {

        var autocompleteinput;
        autocompleteinput = jQuery('<input class="DGselectbox autocomplete" />');
        if (options.autoStyle) {
            autocompleteinput.css('font-family', o.css('font-family'))
                .css('font-size', o.css('font-size'))
                .css('display', 'block');
        }

        autocompleteinput.css('background-color', 'transparent')
            .css('left', '0px')
            .css('top', '0px')
            .css('position', 'absolute')
            .css('border', '0px none')
            .height(o.height())
            .width(o.width());

        if (options.setSize) {
            autocompleteinput.width('auto')
                .height(options.innerHeight)
                .css('margin-right', options.buttonWidth);
        }
        return autocompleteinput;
    }

    function GetUl(o, options) {
        var ul = jQuery('<ul class="DGselectbox DGselectbox-' + options.name + '"></ul>')
            .css('position', 'absolute')
            .css('overflow', 'auto')
            .hide();

        if (options.autoStyle) {
            ul.css('font-family', o.css('font-family'))
                .css('font-size', o.css('font-size'))
                .css('color', o.css('color'))
                .css('background-color', o.css('background-color'));
        }
        if (options.setSize) {
            ul.width(options.outerWidth - (options.frameWidth * 2));
        }

        if (options.zIndex && parseInt(options.zIndex, 10) > 0) {
            ul.css('z-index', parseInt(options.zIndex, 10));
        }

        AddClassNames(ul, options);
        return ul;
    }

    function GetLi(o, options, objects) {
        var li = jQuery('<li></li>')
            .css('position', 'relative');
        return li;
    }

    function GetStruct(o, options) {
        var struct = new Array();
        if (options.source == 'select') {
            var i = 0;
            o.find('option').each(
                function () {
                    var op = jQuery(this);
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
        } else if (options.source == 'ul') {
            var i = 0;
            o.find('li').each(
                function () {
                    var li = jQuery(this);
                    if (!options.filter || li.text().match(options.filter)) {
                        struct.push({
                            text: li.text(),
                            selected: false,
                            active: false,
                            index: i
                        });
                        i++;
                    }
                }
            );
        }
        return struct;
    }

    function AddClassNames(e, options) {
        if (options.classNames) {
            var arrNames = options.classNames.split(',');
            for (var i = 0; i < arrNames.length; i++) {
                e.addClass(arrNames[i]);
            }
        }
    }

    function Say(str) {
        var sayDiv = jQuery('#DGselectbox_Say');
        if (!sayDiv.size()) {
            sayDiv = jQuery('<div id="DGselectbox_Say"></div>').appendTo(jQuery('body'));
        }
        sayDiv.html(sayDiv.html() + '<br/>' + str);
    }
};

$.fn.outer = function (val) {
    if (val !== undefined) {
        $(val).insertBefore(this);
        $(this).remove();
    }
    else { return $("<div>").append($(this).clone()).html(); }
}