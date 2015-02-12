SELECT.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchWrapper = function(Facade) {
	var userDefinedSettings = Facade.publish("UserDefinedSettings");
	this.type = "div";
	this.className = "options-menu-search-wrapper";
	this.element;

	this.render = function() {
    	this.element = SELECT.UTILS.createElement(this.type, this.className);
    	var optionsMenuSearchInputWrapper = Facade.subscribe("OptionsMenuSearchInputWrapper", new SELECT.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchInputWrapper(Facade));
    	var optionsMenuSearchInputWrapperElem = optionsMenuSearchInputWrapper.render();
    	this.element.appendChild(optionsMenuSearchInputWrapperElem);
    	
    	var optionsMenuSearchNoResults = Facade.subscribe("OptionsMenuSearchNoResults", new SELECT.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchNoResults(Facade));
    	this.element.appendChild(optionsMenuSearchNoResults.render());
    	return this.element;
	}

	this.getHeight = function() {
		return this.element.offsetHeight;
	}

	this.setWidth = function(width) {
		this.element.setStyle("width", width);
		this.width = width;
	}

};

SELECT.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchWrapper.prototype = Object.create(SELECT.ELEMENTS.Element.prototype);