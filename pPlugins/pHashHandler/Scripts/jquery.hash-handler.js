; (function (window, $) {
    window.HashHandler = {
        GetHash: function getHash() {
            var hash = {};
            var props = location.hash.replace(/^#/, '').split('&');
            for (var p = 0; p < props.length; p++) {
                if (props[p]) {
                    var vals = props[p].split('=');
                    if (vals.length == 2) {
                        hash[vals[0]] = $.map(vals[1].split(','), function (val, i) { return decodeURIComponent(val); });
                    } else {
                        hash[vals[0]] = [];
                    }
                }
            }
            return hash;
        },
        GetHashParameter: function getHashParameter(parameterName) {
            var parameterArray = window.HashHandler.GetHashParameterArray(parameterName);
            if (parameterArray && parameterArray.length > 0) {
                return parameterArray[0];
            }
            return undefined;
        },
        GetHashParameterArray: function getHashParameter(parameterName) {
            return window.HashHandler.GetHash()[parameterName];
        },
        SetHash: function setHash(parameterName, value, addValue) {
            var hash = window.HashHandler.GetHash();
            var newValue;
            if ($.isArray(value)) {
                newValue = value;
            } else {
                if (value === undefined || value === null) {
                    newValue = null;
                } else {
                    newValue = [value.toString()];
                }
            }


            if (newValue === null) {
                delete hash[parameterName];
            } else {
                if (addValue) {
                    var existingValues = hash[parameterName];
                    if (existingValues !== undefined && existingValues !== null && existingValues !== '') {
                        if (value !== null && indexOf.call(existingValues, value) < 0) {
                            existingValues.push(value);
                        }
                        newValue = existingValues;
                    }
                }
                hash[parameterName] = newValue;
            }
            window.HashHandler.WriteHashToUrl(hash, true);
            window.HashHandler.SetHashToReturnUrls();
            window.HashHandler.SetHashToEditButtons();
        },
        AddHash: function addHash(parameterName, value) {
            window.HashHandler.SetHash(parameterName, value, true);
        },
        RemoveHash: function removeHash(parameterName, value) {
            var hash = window.HashHandler.GetHash();
            var existingValues = hash[parameterName];
            if (existingValues && value !== null && value !== undefined) {
                var indexInExisting = indexOf.call(existingValues, value.toString());
                if (indexInExisting >= 0) {
                    existingValues.splice(indexInExisting, 1);
                }
            }
            if (existingValues && existingValues.length == 0) {
                delete hash[parameterName];
            }
            window.HashHandler.WriteHashToUrl(hash, true);
            window.HashHandler.SetHashToReturnUrls();
        },
        RemoveHashParameter: function removeHashParameter(parameterName) {
            var hash = window.HashHandler.GetHash();
            delete hash[parameterName];
            window.HashHandler.WriteHashToUrl(hash, true);
        },
        ClearHash: function clearHash() {
            window.HashHandler.WriteHashToUrl({}, true);
        },
        SetHashToReturnUrls: function setHashToReturnUrls() {
            $('[data-role=MainLayoutcontent]').find('a[href], [data-href], form[data-form-with-return-path=yes]').not('[data-role=MainBackButton]').each(function () {
                var link = $(this);
                var attrName = '';
                if (link.is('[data-href]')) attrName = 'data-href';
                if (link.is('a[href]')) attrName = 'href';
                if (link.is('form[data-form-with-return-path=yes]')) attrName = 'action';

                var href = link.attr(attrName);
                if (href.indexOf('_return') > 0) {
                    var returnUrl = encodeURIComponent(window.location.pathname +
                        window.location.search +
                        window.location.hash);
                    var fixedUrl = replaceOrAddUrlQueryAttribute(href, "_return", returnUrl);
                    link.attr(attrName, fixedUrl);
                }
            });
        },
        SetHashToEditButtons: function setHashToEditButtons() {
            $('[data-role=MainLayoutcontent]').find('a[href], [data-href]').filter('[data-role=EditButton]').each(function () {
                var link = $(this);
                var attrName = '';
                if (link.is('[data-href]')) attrName = 'data-href';
                if (link.is('a[href]')) attrName = 'href';
                var href = link.attr(attrName).split('#')[0];
                link.attr(attrName, href + window.location.hash);
            });
        },
        WriteHashToUrl: function writeHashToUrl(hash, replaceInHistory) {
            var loc = '#', sep = '';
            for (var key in hash) {
                if (hash.hasOwnProperty(key)) {
                    loc += sep +
                        key +
                        '=' +
                        $.map(hash[key],
                            function (val, i) {
                                return encodeURIComponent(val);
                            })
                        .join(',');
                    sep = '&';
                }
            }

            if (replaceInHistory && window.history.replaceState) {
                window.history.replaceState({}, '', loc);
            } else {
                window.location = loc;
            }
        }
    };


    function indexOf(val) {
        if (typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (val2) {
                var i = -1, index = -1;

                for (i = 0; i < this.length; i++) {
                    if (this[i] === val2) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, val);
    };

})(window, jQuery);