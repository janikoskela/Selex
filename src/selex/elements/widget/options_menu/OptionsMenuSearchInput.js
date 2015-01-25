SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchInput = function(Facade) {
	this.type = "input";
	this.className = "options-menu-search-input";
	this.tabIndex = -1;
	this.element;

	this.render = function() {
    	this.element = SELEX.UTILS.createElement(this.type, this.className);
    	this.element.setAttribute("type", "search");
    	this.element.setAttribute("tabindex", this.tabIndex);
    	this.element.addEventListener("keyup", onKeyUp.bind(this));
    	this.element.addEventListener("click", onClick.bind(this));
    	this.element.addEventListener("blur", onBlur.bind(this));
    	return this.element;
	}

	this.clear = function() {
		this.element.value = "";
		this.value = undefined;
	}

	this.focus = function() {
		this.element.focus();
	}

	this.blur = function() {
		this.element.blur();
	}

    function onBlur(e) {
        Facade.publish("OptionsMenu:hide");
    }

	function onClick(e) {
		var elementValue = this.element.value;
		if (elementValue.length === 0) {
			Facade.publish("OptionsMenuList:refresh");
			Facade.publish("OptionsMenuList:show");
			Facade.publish("OptionsMenuSearchNoResults:hide");
		}
		this.value = elementValue;
	}

	function onKeyUp(e) {
		e.stopPropagation();
        switch(e.keyCode) {
        	case KEY_CODES.DOWN:
        		Facade.publish("OptionsMenuList").hoverFirstOption();
        		this.blur();
        		break;
        	default:
				var value = this.element.value;
				if (this.value !== undefined) {
					if (value.length === this.value.length)
						return;
				}
				this.value = value;
				if (value.length === 0)
					Facade.publish("OptionsMenuList:refresh");
				else
					Facade.publish("OptionsMenuList:searchByInputString", value);
        }
	}
};