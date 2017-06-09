/*
Pragmasoft jQuery figure plugin
Author: Lars Danielsen

Creates html5 style image presentation from old-school html

Required: jQuery

Synopsis:
jQuery(elem).figure();

Resulting html example:
<figure>
    <img src="#" />
    <figcaption>
        Image description
    </figcaption>
</figure>


It will:

-   Search the supplied wrapper element for images, and wrap them in a figure
    element. if the image is wrapped, it is extracted from the wrapper, and the
    wrapper is removed if it is empty, if not it will be left after the new
    figure element.

-   See if the next element is a caption (h6). If it is, it puts the content in a
    figcaption element and append it to the figure. Then the caption is removed


options:
captionSelector:                        The selector used to find the caption.
                                        It is applied to the image, which is
                                        removed from any wrapper first
figureTagName:                          Alternative tagname to be used as figure
figcaptionTagName:                      Alternative tagname to be used as
                                        figcaption
figureClass:                            Classname that will be added to the
                                        figure element
figcaptionClass:                        Classname that will be added to the
                                        figcaption element
transferImgStyleToFigureStyle:          If true, any style attribute from the
                                        image will be transferred to the
                                        figure
transferImgClassNamesToFigureStyle:     If true, any class attribute from the
                                        image will be transferred to the
                                        figure
transferCaptionStyleToFigcaptionStyle:  If true, any style attribute from the
                                        caption will be transferred to the
                                        figcaption
transferImgWidthToFigureWidth:          If true, any width of from the
                                        image will be transferred to the
                                        figure
template:                               Complete markup with placeholders
templateFigureSelector:                 Selector to be used to locate the figure
                                        element in the template the template is
                                        wrapped first, to make it possible to
                                        find any element
templateFigcaptionSelector:             Selector to be used to locate the figcaption
                                        element in the template the template is
                                        wrapped first, to make it possible to
                                        find any element. Only used for
                                        transferCaptionStyleToFigcaptionStyle
                                        

template example: '<figure class="test">${img}<figcaption>${caption}</figcaption></figure>'
${img} is replaced with the image, ${caption} with the caption html. 


*/


jQuery.fn.figure = function (init) {
    var defaults = {
        captionSelector:                        'h6:first',
        figureTagName:                          'figure',
        figcaptionTagName:                      'figcaption',
        figureClass:                            undefined,
        figcaptionClass:                        undefined,
        transferImgStyleToFigureStyle:          false,
        transferImgClassNamesToFigureStyle:     false,
        transferCaptionStyleToFigcaptionStyle:  false,
        transferImgWidthToFigureWidth:          false,
        template:                               undefined,
        templateFigureSelector:                 undefined,
		templateFigcaptionSelector:             undefined
    };
    
    return this.each(function () {
        var options = jQuery.extend(defaults, init);
        var wrapper = jQuery(this);
        wrapper.find('img').not('[data-figureplugin=done]').each(function () {
            convertImage(wrapper, jQuery(this), options);
        });
    });
	
    function convertImage(wrapper, img, options) {		
		
		if (img.parents('body').length == 0) {
			return;
		}
		
        var elements = {
            originalElements: getOriginalElements(wrapper, img, options),
            newElements: getNewElements(options)
        }		
		
        var rend = new Renderer();
        rend.TransferStyles(img, options, elements);
        rend.HandleImageWrapper(img, elements);
        rend.ApplyChanges(img, elements);
        rend.TransferWidth(options, elements);
        rend.Register(options, elements);
    }
    
    function Renderer() {
        this.TransferStyles = function(img, options, elements) {
            if (options.transferImgStyleToFigureStyle) {
                elements.newElements.figureElement.attr('style', img.attr('style'));
                img.removeAttr('style');
            }

            if (options.transferImgClassNamesToFigureStyle) {
                elements.newElements.figureElement.addClass(img.attr('class'));
                img.removeAttr('class');
            }

            if (options.transferCaptionStyleToFigcaptionStyle) {
                elements.newElements.figcaptionElement.attr('style', elements.originalElements.imageCaption.attr('style'));
            }
        };
        this.HandleImageWrapper = function(img, elements) {
            if (elements.originalElements.hasImageWrapper) {
                var imgElement = (elements.originalElements.imageLink && elements.originalElements.imageLink.length > 0) ? elements.originalElements.imageLink : img;
                imgElement.insertBefore(elements.originalElements.imageWrapper);
                if (elements.originalElements.imageWrapper.text().match(/^\s*$/) && elements.originalElements.imageWrapper.children().length == 0) {
                    elements.originalElements.imageWrapper.remove();
                }
            }  
        };
        
        this.ApplyChanges = function (img, elements) {
            var imgElement = (elements.originalElements.imageLink && elements.originalElements.imageLink.length > 0) ? elements.originalElements.imageLink : img;
            if (elements.newElements.template) {
                var temp = jQuery('<div/>').append(imgElement.clone());
                elements.newElements.template.html(elements.newElements.template.html().replace(/\${img}/g, temp.html()));
                elements.newElements.template.html(elements.newElements.template.html().replace(/\${caption}/g, elements.originalElements.imageCaptionHtml));
                if (elements.newElements.imageCaption && elements.newElements.imageCaption.length > 0) {
                    elements.newElements.imageCaption.remove();
                }
                elements.newElements.template.insertBefore(imgElement);
                imgElement.remove();
                elements.originalElements.imageCaption.remove();
            } else {
                elements.newElements.figureElement.insertBefore(imgElement);
                imgElement.appendTo(elements.newElements.figureElement);
                if (elements.originalElements.imageCaptionHtml) {
                    elements.newElements.figcaptionElement.html(elements.originalElements.imageCaptionHtml)
                        .appendTo(elements.newElements.figureElement);
                }
                elements.originalElements.imageCaption.remove();
            }
        };
        this.Register = function(options, elements) { 
            elements.newElements.figureElement.find('img').attr('data-figureplugin', 'done');
        };
        this.TransferWidth = function(options, elements) {            
            if (options.transferImgWidthToFigureWidth) {
                var newImg =  elements.newElements.figureElement.find('img');
                newImg.on('load', function () {
                    setFigureWidth (elements);
                });
                if (newImg.width() > 0) {
                    setFigureWidth (elements);
                }
            }
        };
    }
    
    function setFigureWidth (elements) {
        elements.newElements.figureElement.width(elements.newElements.figureElement.find('img').width());
    }
    
    function getNewElements(options) {
        var elements = {};
        if (options.template) {
            var temp = jQuery('<div/>').append(options.template);
            if (options.templateFigureSelector) {
                elements.figureElement = temp.find(options.templateFigureSelector);
            }
            if (options.templateFigcaptionSelector) {
                elements.figcaptionElement = temp.find(options.templateFigcaptionSelector);
            }
            elements.template = temp.children();
        } else {
            elements.figureElement = jQuery('<' + options.figureTagName + '/>');            
            elements.figcaptionElement = jQuery('<' + options.figcaptionTagName + '/>');            
        }
        
        if (options.figureClass) {
            elements.figureElement.addClass(options.figureClass);
        }
        if (options.figcaptionClass) {
            elements.figcaptionElement.addClass(options.figcaptionClass);
        }
        
        return elements;
    }
        
    function getOriginalElements(wrapper, img, options) {
		
		var elements = {};        
        elements.hasImageLink = false;
        var imageLink = img.parent();
        if (imageLink.is('a')) {
            elements.hasImageLink = true;
            elements.imageLink = imageLink;
        }
        
        elements.hasImageWrapper = false;
		var imageParent = (elements.hasImageLink) ? elements.imageLink.parent() : img.parent();
		var panic = 100;
		while (panic > 0 && imageParent.get(0) !== wrapper.get(0) && !imageParent.is('li, td, a')) {
			elements.hasImageWrapper = true;
            elements.imageWrapper = imageParent;
            imageParent = imageParent.parent();
			panic--;
        }        
        
        if (elements.hasImageWrapper) {
            elements.imageCaption = elements.imageWrapper.next(options.captionSelector);
        } else if (elements.hasImageLink) {
            elements.imageCaption = elements.imageLink.next(options.captionSelector);        
        } else {
            elements.imageCaption = img.next(options.captionSelector);
        }
        
        if (elements.imageCaption.length > 0 && !elements.imageCaption.html().match(/^\s*$/)) {
            elements.imageCaptionHtml = elements.imageCaption.html();
        } else {
            elements.imageCaptionHtml = '';
        }        
        
        return elements;        
    }
    
};
