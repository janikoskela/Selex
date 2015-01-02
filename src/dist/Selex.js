(function ($) {
	var SEARCH_MODES = {};
	SEARCH_MODES.BY_FIRST_KEY = "firstKey";
	var KEY_CODES = {};
	KEY_CODES.UP = 38;
	KEY_CODES.DOWN = 40;
	KEY_CODES.ENTER = 13;
	var SORT_TYPES = {};
	SORT_TYPES.ASC = "asc";
	SORT_TYPES.DESC = "desc";
	var SELEX = {};
	SELEX.CONFIG = {};
	SELEX.UTILS = {};
	SELEX.HELPERS = {};
	SELEX.SETTINGS = {};
	SELEX.ELEMENTS = {};
	SELEX.ELEMENTS.WIDGET = {};
	SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER = {};
	SELEX.ELEMENTS.WIDGET.ARROW_CONTAINER = {};
	SELEX.ELEMENTS.WIDGET.OPTIONS_MENU = {};
	SELEX.ELEMENTS.WIDGET.LOADING_OVERLAY = {};
	SELEX.EXCEPTIONS = {};
	var MUTATION_OBSERVER = window.MutationObserver || window.WebKitMutationObserver;
	var ALLOWED_TARGET_ELEMENT_TAG_NAME_SELECT = "select";

	Selex = function(userDefinedSettings) {

		var that = this;

		this.wrapper;

		init(userDefinedSettings);

		function init() {
			if (typeof userDefinedSettings !== "object")
				throw new SELEX.EXCEPTIONS.InvalidOptionsErrorException();
			that.wrapper = new SELEX.ELEMENTS.Wrapper(userDefinedSettings);
		}

		this.render = function() {
			this.wrapper.render();
			return this;
		}

		this.hide = function() {
			this.wrapper.hide();
			return this;
		}

		this.show = function() {
			this.wrapper.show();
			return this;
		}

		this.disable = function() {
			this.wrapper.disable();
			return this;
		}

		this.enable = function() {
			this.wrapper.enable();
			return this;
		}

		this.toggleLoadingMode = function() {
			this.wrapper.toggleLoadingMode();
		}
	}

SELEX.CONFIG.CONSTRUCTOR_PARAMS_URL = "https://github.com/janikoskela/Selex#constructor-parameters";SELEX.ELEMENTS.NativeSelectBox = function(wrapper) {
	var that = this;
	this.optionItems = [];
	this.observer;
	this.wrapper = wrapper;
	this.element = this.wrapper.getTargetElement();

	this.attach = function() {
		this.optionItems = [];
		var optionsLength = this.element.options.length;
		for (var i = 0; i < optionsLength; i++) {
			var option = this.element.options[i];
			var optionItem = new SELEX.ELEMENTS.NativeSelectBoxItem(this, option);
			this.optionItems.push(optionItem);
		}
		if (MUTATION_OBSERVER !== undefined && this.observer === undefined)
			attachDomObserver();
		return this.element;
	}

	this.getTabIndex = function() {
		return this.element.getAttribute("tabindex");
	}

	this.getOptions = function() {
		return this.optionItems;
	}

	this.isDisabled = function() {
		return (this.element.getAttribute("disabled") === null) ? false : true;
	}

    this.enable = function() {
        this.element.removeAttribute("disabled");
    }

    this.disable = function() {
        this.element.setAttribute("disabled", true);
    }

	function attachDomObserver() {
    	that.observer = new MUTATION_OBSERVER(function(mutations, observer) {
    		mutations.forEach(function (mutation) {
    			var addedNodesLength = (mutation.addedNodes === undefined) ? 0 : mutation.addedNodes.length;
    			var removedNodesLength = (mutation.removedNodes === undefined) ? 0 : mutation.removedNodes.length;
    			if (addedNodesLength > 0 || removedNodesLength.length > 0) {
    				that.attach();
    				that.wrapper.getWidgetWrapper().getOptionsMenu().getOptionsMenuList().refresh();
    			}
      		});
    	});
    	var config = { 
    		attributes: true, 
    		childList: true, 
    		characterData : false,  
    		subtree : false,
    		attributeOldValue: false,
    		attributeFilter: [],
    		characterDataOldValue: false,
    	};
    	that.observer.observe(that.element, config);
	}

	this.setSelectedOption = function(value) {
		for (var i = 0; i < this.optionItems.length; i++) {
			if (this.optionItems[i].getValue() == value) {
				this.optionItems[i].setSelected();
			}
			else
				this.optionItems[i].removeSelected();
		}
	}

	this.getSelectedOptionText = function() {
		var selectedOption = this.getSelectedOption();
		if (selectedOption !== undefined)
			return selectedOption.text;
		return "";
	}

	this.clearSelected = function() {
		var l = this.optionItems.length;
		for (var i = 0; i < l; i++)
			this.optionItems[i].removeSelected();
	}

	this.setSelectedIndex = function(index) {
		this.element.selectedIndex = index;
	}

	this.triggerChange = function() {
		this.clearSelected();
	    SELEX.UTILS.triggerEvent("change", this.element);
	}

	this.getSelectedOptionValue = function() {
		var selectedOption = this.getSelectedOption();
		if (selectedOption !== undefined)
			return selectedOption.value;
		return "";
	}

	this.getSelectedOptionImageUrl = function() {
		var selectedOption = this.getSelectedOption();
		if (selectedOption !== undefined)
			return selectedOption.getDataAttribute("image-url");
	}

	this.getSelectedOption = function() {
		var l = this.element.options.length;
		for (var i = 0; i < l; i++) {
			var option = this.element.options[i];
			var selected = (option.getAttribute("selected") === null) ? false : true;
			if (selected)
				return option;
		}
	}

	this.getElement = function() {
		return this.element;
	}

	this.hide = function() {
		this.element.hide();
	}

};SELEX.ELEMENTS.NativeSelectBoxItem = function(nativeSelect, optionElement) {
	this.element = optionElement;
	this.nativeSelect = nativeSelect;
	this.type = "option";

	this.isSelected = function() {
		return (this.element.getAttribute("selected") === null) ? false : true;
	}

	this.getText = function() {
		return this.element.text;
	}

	this.getOptionGroupLabel = function() {
		return this.element.parentNode.label;
	}

	this.getValue = function() {
		return this.element.value;
	}

	this.setSelected = function(e) {
		this.nativeSelect.setSelectedIndex(this.element.index);
		this.nativeSelect.triggerChange();
		this.element.setSelected();
	}

	this.removeSelected = function() {
		this.element.removeAttribute("selected", "selected");
	}

	this.getImageUrl = function() {
		return this.element.getDataAttribute("image-url");
	}
};SELEX.ELEMENTS.WIDGET.ARROW_CONTAINER.ArrowContainer = function(params) {

	this.type = "div";
	this.element;
	this.className = "arrow-container";
	this.arrowContainerContent;

	this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type);
		this.element.setClass(this.className);

		this.arrowContainerContent = new SELEX.ELEMENTS.WIDGET.ARROW_CONTAINER.ArrowContainerContent(params);
		var elem = this.arrowContainerContent.render();

		this.element.appendChild(elem);
		return this.element;
	}

	this.getArrowContainerContent = function() {
		return this.arrowContainerContent;
	}

	this.getElement = function() {
		return this.element;
	}
};SELEX.ELEMENTS.WIDGET.ARROW_CONTAINER.ArrowContainerContent = function() {

	var CLASS_NAME_ARROW_DOWN = "arrow-down";
	var CLASS_NAME_ARROW_UP = "arrow-up";

	this.type = "div";
	this.element;
	this.className = CLASS_NAME_ARROW_DOWN;

	this.render = function() {
		this.element = document.createElement(this.type);
		this.element.setClass(this.className);
		return this.element;
	}

	this.getElement = function() {
		return this.element;
	}

	this.down = function() {
		this.className = CLASS_NAME_ARROW_DOWN;
		this.element.setClass(CLASS_NAME_ARROW_DOWN);
	}

	this.up = function() {
		this.className = CLASS_NAME_ARROW_UP;
		this.element.setClass(CLASS_NAME_ARROW_UP);
	}

	this.toggleClass = function() {
		if (this.className === CLASS_NAME_ARROW_DOWN) {
			this.up();
		}
		else {
			this.down();
		}
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenu = function(userDefinedSettings, widgetWrapper) {
	var that = this;
	this.type = "div";
	this.className = "options-container";
	this.element;
	this.width = userDefinedSettings.optionsMenuWidth || "100%";
	this.arrowContainerContent = widgetWrapper.getWidgetSubWrapper().getArrowContainer().getArrowContainerContent();
	this.height = undefined;
	this.widgetWrapper = widgetWrapper;
	this.optionsMenuList;
	this.locked = false;
	this.optionsMenuSearchWrapper;
	this.useSearchInput = userDefinedSettings.useSearchInput;

	this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);
    	this.optionsMenuList = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuList(userDefinedSettings, this);
    	var optionsMenuListElem = this.optionsMenuList.render();
        if (this.useSearchInput === true) {
        	this.optionsMenuSearchWrapper = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchWrapper(this);
        	var optionsMenuSearchWrapperElem = this.optionsMenuSearchWrapper.render();
    		this.element.appendChild(optionsMenuSearchWrapperElem);
        }
    	this.element.appendChild(optionsMenuListElem);
    	this.setWidth(this.width);
    	return this.element;
	}

	this.getOptionsMenuSearchWrapper = function() {
		return this.optionsMenuSearchWrapper;
	}

	this.isLocked = function() {
		return this.locked;
	}

	this.disableLoadingMode = function() {
		this.locked = false;
	}

	this.enableLoadingMode = function() {
		this.hide();
		this.locked = true;
	}

	this.getOptionsMenuList = function() {
		return this.optionsMenuList;
	}

	this.getWidgetWrapper = function() {
		return this.widgetWrapper;
	}

	this.getElement = function() {
		return this.element;
	}

	this.setWidth = function(width) {
		this.width = width;
		this.element.setStyle("width", this.width);
	}

	this.setHeight = function(height) {
		this.height = height;
		this.element.setStyle("height", this.height);
	}

	this.hide = function() {
		this.element.hide();
		this.arrowContainerContent.down();
	}

	this.isHidden = function() {
		return this.element.isHidden();
	}

	this.show = function() {
		if (this.locked === true)
			return;
		this.element.show();
		this.element.removeClass("options-container-down");
		this.element.removeClass("options-container-up");
		var top = this.element.getStyle("top") || 0;
		this.element.removeStyle("top");
		var h = this.element.offsetHeight;
		var windowInnerHeight = window.innerHeight;
		var remainingWindowHeight = windowInnerHeight - this.element.getBoundingClientRect().top;
		this.element.hide();
		if (remainingWindowHeight < h && widgetWrapper.getElement().getBoundingClientRect().top > h) {
			this.element.addClass("options-container-up");
			this.element.setStyle("top", h * -1);
		}
		else {
			this.element.addClass("options-container-down");
		}
		this.element.show();
		this.arrowContainerContent.up();
	}

	this.toggle = function() {
		if (this.element.isHidden())
			this.show();
		else
			this.hide();
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItem = function(nativeSelectOption, optionsMenuList, index) {
	var that = this;
	this.nativeSelectOption = nativeSelectOption;
	this.selected = nativeSelectOption.isSelected();
	this.type = "li";
	this.element;
	this.itemValue;
	this.optionsMenuList = optionsMenuList;
	this.index = index;
	this.valueContainer = this.optionsMenuList.getOptionsMenu().getWidgetWrapper().getWidgetSubWrapper().getValueContainer();
	this.valueContainerText = this.valueContainer.getValueContainerText();

	this.render = function() {
		this.itemValue = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItemValue(nativeSelectOption);
		var childElem = this.itemValue.render();
    	this.element = SELEX.UTILS.createElement(this.type);
    	this.element.addEventListener("click", onClick.bind(this));
    	this.element.addEventListener("mouseover", onMouseOver.bind(this));
    	this.element.addEventListener("keyup", onKeyUp.bind(this));
    	this.element.setDataAttribute("value", nativeSelectOption.getValue());
    	this.element.setDataAttribute("index", this.index);

		var imageUrl = this.nativeSelectOption.getImageUrl();
		if (imageUrl !== undefined && imageUrl !== null) {
			this.itemImage = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItemImage(imageUrl);
			var elem = this.itemImage.render();
			this.element.appendChild(elem);
		}

    	this.element.appendChild(childElem);
    	if (this.selected === true)
    		this.setSelected();
    	return this.element;
	}

	this.getTextByElement = function(element) {

	}

	this.getValue = function() {
		return this.nativeSelectOption.getValue();
	}

	this.getElement = function() {
		return this.element;
	}

	this.getText = function() {
		return this.nativeSelectOption.getText();
	}

	this.isHovered = function() {
		return (this.element.hasClass("hovered"));
	}

	this.isSelected = function() {
		return (this.element.hasClass("selected"));
	}

	this.setHovered = function() {
		this.element.addClass("hovered");
	}

	this.setSelected = function() {
		this.optionsMenuList.clearSelected();
		this.element.addClass("selected");
	}

	this.removeSelected = function() {
		this.element.removeClass("selected");
	}

	function onKeyUp(e) {
		switch (e.keyCode) {
			case KEY_CODES.ENTER:
				onClick(e);
				break;
		}
	}

	this.getIndex = function() {
		return parseInt(this.element.getDataAttribute("index"));
	}

	function onMouseOver(e) {
		var siblings = this.element.parentNode.children;
		for (var i = 0; i < siblings.length; i++) {
			siblings[i].removeClass("hovered");
		}
		this.element.addClass("hovered");
	}

	this.onClick = function() {
		onClick();
	}

	function setSelected(e) {
		that.nativeSelectOption.setSelected(e);
		that.setSelected();
		that.valueContainer.refresh();
		//that.valueContainerText.setText(that.nativeSelectOption.getText());
	}

	function onClick(e) {
		that.optionsMenuList.getOptionsMenu().hide();
		var prevSelected = that.optionsMenuList.getSelectedOption();
		if (prevSelected === undefined)
			setSelected(e);
		else if (prevSelected.getValue() !== that.getValue())
			setSelected(e);
		if (that.optionsMenuList.isInputSearchEnabled())
			that.optionsMenuList.clearSearchResult();
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItemGroup = function(option) {
	this.type = "ul";
	this.element;
	this.label;

	this.render = function() {
    	this.element = document.createElement(this.type);
    	return this.element;
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItemImage = function(imageUrl) {
	this.type = "img";
	this.imageUrl = imageUrl;
	this.element;

	this.render = function() {
    	this.element = new SELEX.UTILS.createElement(this.type);
    	this.element.setAttribute("src", this.imageUrl);
    	return this.element;
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItemValue = function(option) {
	this.option = option;
	this.type = "span";
	this.element;
	this.textNode;

	this.render = function() {
    	this.element = document.createElement(this.type);
    	this.textNode = document.createTextNode(this.option.getText());
    	this.element.appendChild(this.textNode);
    	return this.element;
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuList = function(userDefinedSettings, optionsMenu) {
	var that = this;
	this.type = "ul";
	this.className = "options-container-list";
	this.element;
	this.width = "100%";
	this.height = undefined;
	this.optionLimit = userDefinedSettings.optionLimit;
	this.optionItems = [];
	this.sortType = userDefinedSettings.sort;
	this.optionsMenu = optionsMenu;
	this.nativeSelect = this.optionsMenu.getWidgetWrapper().getWrapper().getNativeSelect();
	this.valueContainer = this.optionsMenu.getWidgetWrapper().getWidgetSubWrapper().getValueContainer();
	this.valueContainerText = this.valueContainer.getValueContainerText();
	this.inputSearchEnabled = false;

	this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);
    	this.setWidth(this.width);
    	this.refresh();
		return this.element;
	}

	this.refresh = function() {
        var options = this.nativeSelect.getOptions();
		switch(this.sortType) {
    		case "asc":
    			options.sort(sortByAsc);
    			break;
    		case "desc":
    			options.sort(sortByDesc);
    			break;
		}
		renderOptionItems(options);
		this.valueContainer.refresh();
	}

	this.getOptionsMenu = function() {
		return this.optionsMenu;
	}

	this.adjustHeight = function() {
		var children = that.element.getChildren();
        if (children.length === 0)
            return;
        if (children.length > 0) {        
         	var h = children[0].offsetHeight;
            if (that.optionLimit === undefined || children.length < that.optionLimit)
                h *= children.length;
            else
                h *= that.optionLimit;
            //h++; //so that element does not become scrollable in cas
            h += "px";
            if (that.optionLimit !== undefined)
                that.setHeight(h);
        }
	}

	function renderOptionItems(options) {
        that.optionItems = [];
        that.element.removeChildren();
        var l = options.length;
		for (var i = 0; i < l; i++) {
			var option = options[i];
			var item = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuItem(option, that, i);
			that.optionItems.push(item);
			var elem = item.render();
			that.element.appendChild(elem);
		}
	}

    function sortByDesc(optionA, optionB) {
        var a = optionA.getText();
        var b = optionB.getText();
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    }

    function sortByAsc(optionA, optionB) {
        var a = optionA.getText();
        var b = optionB.getText();       
        if (a > b)
            return -1;
        if (a < b)
            return 1;
        return 0;
    }

    function getNextOption(option) {
    	var i = option.getIndex();
    	if (i < that.optionItems.length)
    		return that.optionItems[i + 1];
    	return that.optionItems[0];
    }

    function getPreviousOption(option) {
    	var i = option.getIndex();
    	if (i === 0)
    		return that.optionItems[that.optionItems.length - 1];
    	if (that.optionItems.length - 1 >= i)
    		return that.optionItems[i - 1];
    	return that.optionItems[that.optionItems.length - 1];
    }

    this.hoverPreviousOption = function() {
		if (this.optionsMenu.isLocked())
			return;
    	var hovered = this.getHoveredOption();
    	var option;
    	if (hovered === undefined) {
    		var selected = this.getSelectedOption();
    		if (selected !== undefined)
    			option = getPreviousOption(selected);
    	}
    	else
    		option = getPreviousOption(hovered);
    	if (option === undefined)
    		option = this.optionItems[this.optionItems.length - 1];
    	this.clearOptionItemHovers();
		option.setHovered();
		this.optionsMenu.getElement().scrollTop = option.getElement().offsetTop;
		if (this.optionsMenu.isHidden())
			option.onClick();
    }

    this.hoverNextOption = function() {
		if (this.optionsMenu.isLocked())
			return;
    	var hovered = this.getHoveredOption();
    	var option;
    	if (hovered === undefined) {
    		var selected = this.getSelectedOption();
    		if (selected !== undefined)
    			option = getNextOption(selected);
    	}
    	else
    		option = getNextOption(hovered);
    	if (option === undefined)
    		option = this.optionItems[0];
    	this.clearOptionItemHovers();
		option.setHovered();
		this.optionsMenu.getElement().scrollTop = option.getElement().offsetTop;
		if (this.optionsMenu.isHidden())
			option.onClick();
    }

    this.selectHoveredOption = function() {
		if (this.optionsMenu.isLocked())
			return;
    	var hovered = this.getHoveredOption();
    	if (hovered !== undefined)
    		hovered.onClick();
    }

    function findOptionByFirstCharFromStart(firstChar) {
    	var optionItemsCount = that.optionItems.length;
    	for (var i = 0; i < optionItemsCount; i++) {
			var itemText = that.optionItems[i].getText()
			if (firstChar === itemText[0]) {
				that.optionItems[i].setHovered();
				if (that.optionsMenu.isHidden())
					that.optionItems[i].onClick();
				else
					that.optionsMenu.getElement().scrollTop = that.optionItems[i].getElement().offsetTop;
				return;
			}
		}
    }

    function isNextOptionFirstCharMatch(optionItem, firstChar) {
    	var text = optionItem.getText();
    	if (text[0] === firstChar) {
    		that.clearOptionItemHovers();
    		optionItem.setHovered();
    		if (that.optionsMenu.isHidden())
    			optionItem.onClick();
    		else
				that.optionsMenu.getElement().scrollTop = optionItem.getElement().offsetTop;
			return true;
    	}
    	return false;
    }

    this.clearSearchResult = function() {
    	this.refresh();
    	this.optionsMenu.getOptionsMenuSearchWrapper().clear();
    }

    this.isInputSearchEnabled = function() {
    	return this.inputSearchEnabled;
    }

    this.searchByInputString = function(query) {
    	this.inputSearchEnabled = true;
    	this.element.removeChildren();
    	var l = this.optionItems.length;
    	for (var i = 0; i < l; i++) {
    		var option = this.optionItems[i];
    		var optionText = option.getText();
    		if (optionText.indexOf(query) > -1) {
    			this.element.appendChild(option.getElement());
    		}
    	}
    }

	this.searchByFirstChar = function(firstChar) {
		if (this.optionsMenu.isLocked())
			return;
		var hovered = this.getHoveredOption();
		var optionItemsCount = this.optionItems.length;
		if (hovered === undefined) {
			findOptionByFirstCharFromStart(firstChar);
		}
		else {
			var hoveredText = hovered.getText();
			var hoveredIndex = hovered.getIndex();
			for (var i = hoveredIndex + 1; i < optionItemsCount; i++) {
				if (isNextOptionFirstCharMatch(this.optionItems[i], firstChar))
					return;
			}
			for (var j = 0; j < hoveredIndex; j++) {
				if (isNextOptionFirstCharMatch(this.optionItems[j], firstChar))
					return;
			}
		}
	}

	this.hasChildren = function() {
		return (this.element.getChildren().length > 0);
	}

	this.getListElements = function() {
		return this.element.getChildren();
	}

	this.getHoveredOption = function() {
		for (var i = 0; i < this.optionItems.length; i++) {
			var item = this.optionItems[i];
			if (item.isHovered())
				return item;
		}
	}

	this.getOptionByValue = function(value) {
		var l = this.optionItems.length;
		for (var i = 0; i < l; i++) {
			if (this.optionItems[i].getValue() === value)
				return this.optionItems[i];
		}
	}

	this.getSelectedOption = function() {
		for (var i = 0; i < this.optionItems.length; i++) {
			var item = this.optionItems[i];
			if (item.isSelected())
				return item;
		}
 	}

	this.clearOptionItemHovers = function() {
		for (var i = 0; i < this.element.children.length; i++) {
			this.element.children[i].removeClass("hovered");
		}
	}

	this.clearSelected = function() {
		var l = this.optionItems.length;
		for (var i = 0; i < l; i++)
			this.optionItems[i].removeSelected();
	}

	this.getElement = function() {
		return this.element;
	}

	this.setWidth = function(width) {
		this.width = width;
		this.element.setStyle("width", this.width);
	}

	this.setHeight = function(height) {
		this.height = height;
		this.element.setStyle("height", this.height);
	}

	this.removeOptionByOptionElement = function(optionElem) {
		var option = this.getOptionByValue(optionElem.value);
		if (option !== undefined) {
			if (option.isSelected()) {
				var i = option.getIndex();
				var nextSibling = this.optionItems[i + 1];
				if (nextSibling !== undefined) {
					nextSibling.setSelected();
					nextSibling.onClick();
				}
				else if (this.optionItems.length > 0) {
					this.optionItems[0].setSelected();
					this.optionItems[0].onClick();
				}
				else
					this.valueContainerText.setText("");

			}
			this.element.removeChild(option.getElement());
		}
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchInput = function(optionsMenu) {
	this.type = "input";
	this.className = "options-menu-search-input";
	this.element;
	this.optionsMenu = optionsMenu;

	this.render = function() {
    	this.element = SELEX.UTILS.createElement(this.type, this.className);
    	this.element.setAttribute("type", "search");
    	this.element.addEventListener("keyup", onKeyUp.bind(this));
    	this.element.addEventListener("click", onKeyUp.bind(this));
    	return this.element;
	}

	this.clear = function() {
		this.element.value = "";
	}

	function onKeyUp(e) {
		var value = this.element.value;
		if (value.length === 0)
			this.optionsMenu.getOptionsMenuList().clearSearchResult();
		if (this.value !== undefined) {
			if (value.length === this.value.length)
				return;
		}
		this.value = value;
		this.optionsMenu.getOptionsMenuList().searchByInputString(value);
	}
};SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchWrapper = function(optionsMenu) {
	this.type = "div";
	this.className = "options-menu-search-wrapper";
	this.element;
	this.optionsMenu = optionsMenu;
	this.optionsMenuSearchInput;

	this.render = function() {
    	this.element = SELEX.UTILS.createElement(this.type, this.className);
    	this.optionsMenuSearchInput = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenuSearchInput(this.optionsMenu);
    	var optionsMenuSearchInputElem = this.optionsMenuSearchInput.render();
    	this.element.appendChild(optionsMenuSearchInputElem);
    	return this.element;
	}

	this.clear = function() {
		this.optionsMenuSearchInput.clear();
	}

};SELEX.ELEMENTS.WIDGET.SubWrapper = function(userDefinedSettings, widgetWrapper, nativeSelectBox) {

    var ORIENTATION_LEFT = "left";

    var ORIENTATION_RIGHT = "right";

    this.type = "div";

    this.className = "widget-sub-wrapper";

    this.orientation = userDefinedSettings.orientation || "right";

    this.element;

    this.arrowContainer;

    this.valueContainer;

    this.widgetWrapper = widgetWrapper;

    this.nativeSelectBox = nativeSelectBox;

    this.optionsMenu;

    this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);
        this.element.addEventListener("click", onClick.bind(this));

        this.arrowContainer = new SELEX.ELEMENTS.WIDGET.ARROW_CONTAINER.ArrowContainer(userDefinedSettings);
        var arrowContainerElem = this.arrowContainer.render();

        this.valueContainer = new SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainer(userDefinedSettings, this);
        var valueContainerElem = this.valueContainer.render();


        switch (this.orientation) {
            case ORIENTATION_LEFT:
                this.element.appendChild(arrowContainerElem);
                arrowContainerElem.setStyle("float", this.orientation);
                this.element.appendChild(valueContainerElem);
                break;
            case ORIENTATION_RIGHT:
                this.element.appendChild(valueContainerElem);
                this.element.appendChild(arrowContainerElem);
                arrowContainerElem.setStyle("float", this.orientation);
                break;
            default:
                throw Error("Invalid orientation value \"" + this.orientation + "\"");

        }

        return this.element;
    }

    this.getNativeSelect = function() {
        return this.nativeSelectBox;
    }
    
    this.enableLoadingMode = function() {
        this.valueContainer.enableLoadingMode();
    }

    this.disableLoadingMode = function() {
        this.valueContainer.disableLoadingMode();
    }

    this.getWidgetWrapper = function() {
        return this.widgetWrapper;
    }

    this.getValueContainer = function() {
        return this.valueContainer;
    }

    this.getArrowContainer = function() {
        return this.arrowContainer;
    }

    function onClick(e) {
        if (this.nativeSelectBox.isDisabled() === false) {
            this.optionsMenu = this.widgetWrapper.getOptionsMenu();
            this.optionsMenu.toggle();
        }
    }

};SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainer = function(userDefinedSettings, widgetSubWrapper) {
	var that = this;
	this.type = "div";
	this.className = "value-container";
	this.widgetSubWrapper = widgetSubWrapper;
	this.element;
	this.valueContainerText;
	this.valueContainerImage;
	this.loadingText = userDefinedSettings.loadingText || "Loading";

	this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);

		this.valueContainerImage = new SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainerImage();
		var valueContainerImageElem = this.valueContainerImage.render();
		this.element.appendChild(valueContainerImageElem);
		var imageUrl = this.widgetSubWrapper.getNativeSelect().getSelectedOptionImageUrl();
		if (imageUrl === undefined || imageUrl === null)
			this.valueContainerImage.hide();
		else
			this.valueContainerImage.setImageUrl(imageUrl);
    	this.valueContainerText = new SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainerText(userDefinedSettings, this);
    	var valueContainerTextElem = this.valueContainerText.render();
    	this.element.appendChild(valueContainerTextElem);
		return this.element;
	}

	this.refresh = function() {
		this.valueContainerText.refresh();
		var imageUrl = this.widgetSubWrapper.getNativeSelect().getSelectedOptionImageUrl();
		if (imageUrl !== undefined && imageUrl !== null) {
			this.valueContainerImage.setImageUrl(imageUrl);
			this.valueContainerImage.show();
		}
		else
			this.valueContainerImage.hide();
	}

	this.enableLoadingMode = function() {
		this.valueContainerText.setText(this.loadingText);
		if (this.timeInterval === undefined)
			enableDotDotDotInterval();
	}

	function enableDotDotDotInterval() {
		var dots = ".";
		that.timeInterval = setInterval(function() {
			if (dots.length === 3)
				dots = ".";
			else
				dots += ".";
			that.valueContainerText.setText(that.loadingText + dots);
		}, 500);
	}

	this.disableLoadingMode = function() {
		clearInterval(this.timeInterval);
		this.valueContainerText.refresh();
	}

	this.getWidgetSubWrapper = function() {
		return this.widgetSubWrapper;
	}

	this.getValueContainerText = function() {
		return this.valueContainerText;
	}
};SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainerImage = function() {
	this.type = "img";
	this.imageUrl;
	this.element;

	this.render = function() {
		this.element = SELEX.UTILS.createElement(this.type);
		return this.element;
	}

	this.setImageUrl = function(imageUrl) {
		this.imageUrl = imageUrl;
		this.element.setAttribute("src", this.imageUrl);
	}

	this.hide = function() {
		this.element.hide();
	}

	this.show = function() {
		this.element.setStyle("display", "inline-block");
	}
};SELEX.ELEMENTS.WIDGET.VALUE_CONTAINER.ValueContainerText = function(userDefinedSettings, valueContainer) {
	var that = this;
	this.type = "span";
	this.className = "value-container-text";
	this.valueContainer = valueContainer;
	this.element;
	this.placeholder = userDefinedSettings.placeholder;
	this.text = this.valueContainer.getWidgetSubWrapper().getWidgetWrapper().getWrapper().getNativeSelect().getSelectedOptionText();

	this.render = function() {
		this.element = SELEX.UTILS.createElement(this.type, this.className);
		this.refresh();
		return this.element;
	}

	this.refresh = function() {
		this.text = this.valueContainer.getWidgetSubWrapper().getWidgetWrapper().getWrapper().getNativeSelect().getSelectedOptionText();
		if (this.text === undefined || this.text === null && this.placeholder !== undefined)
			this.setText(this.placeholder);
		else if (this.text.length  === 0 && this.placeholder !== undefined)
			this.setText(this.placeholder);
		else
			this.setText(this.text);
	}

	this.setPlaceholder = function(placeholder) {
		this.placeholder = placeholder;
		this.element.innerHTML = this.placeholder;
	}

	this.setText = function(text) {
		this.text = text;
		this.element.innerHTML = text;
	}
};SELEX.ELEMENTS.WIDGET.Wrapper = function(userDefinedSettings, wrapper, nativeSelectBox) {

    this.type = "div";

    this.className = "widget-wrapper";

    this.element;

    this.tabIndex;

    this.widgetSubWrapper;

    this.optionsMenu;

    this.optionsMenuList;

    this.wrapper = wrapper;

    this.nativeSelectBox = nativeSelectBox;

    this.tabIndex = this.nativeSelectBox.getTabIndex() || 0;

    this.closeWhenCursorOut = userDefinedSettings.closeWhenCursorOut || true;

    this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);
        this.element.setAttribute("tabindex", this.tabIndex);
        if (userDefinedSettings.closeWhenCursorOut === true)
            this.element.addEventListener("mouseleave", onMouseLeave.bind(this));
        document.addEventListener("click", onMouseLeave.bind(this));
        this.element.addEventListener("click", function(e) {
            e.stopPropagation();
        });
        this.element.addEventListener("keyup", onKeyUp.bind(this));
        this.element.addEventListener("keydown", onKeyDown.bind(this));

        this.widgetSubWrapper = new SELEX.ELEMENTS.WIDGET.SubWrapper(userDefinedSettings, this, this.nativeSelectBox);
        var widgetSubWrapperElem = this.widgetSubWrapper.render();
        this.element.appendChild(widgetSubWrapperElem);


        this.optionsMenu = new SELEX.ELEMENTS.WIDGET.OPTIONS_MENU.OptionsMenu(userDefinedSettings, this);
        var optionsMenuElem = this.optionsMenu.render();
        this.element.appendChild(optionsMenuElem);

        this.optionsMenuList = this.optionsMenu.getOptionsMenuList();

        return this.element;
    }

    this.getElement = function() {
        return this.element;
    }

    this.getWrapper = function() {
        return this.wrapper;
    }

    this.getWidgetSubWrapper = function() {
        return this.widgetSubWrapper;
    }

    this.getOptionsMenu = function() {
        return this.optionsMenu;
    }

    this.getClass = function() {
        return this.className;
    }

    function onKeyDown(e) {
        switch(e.keyCode) {
            case KEY_CODES.UP:
            case KEY_CODES.DOWN:
                e.preventDefault();
                break;
        }
        return false;
    }

    function onKeyUp(e) {
        switch(e.keyCode) {
            case KEY_CODES.UP:
                this.optionsMenuList.hoverPreviousOption();
                break;
            case KEY_CODES.DOWN:
                this.optionsMenuList.hoverNextOption();
                break;
            case KEY_CODES.ENTER:
                this.optionsMenuList.selectHoveredOption();
                break;
            default:
                var firstChar = String.fromCharCode(e.which)[0].toLowerCase();
                this.optionsMenuList.searchByFirstChar(firstChar);
        }
    }

    function onMouseLeave(e) {
        this.optionsMenu.hide();
    }

    this.setTabIndex = function(tabIndex) {
        this.tabIndex = tabIndex;
        this.element.setAttribute("tabindex", tabIndex);
    }

};SELEX.ELEMENTS.Wrapper = function(userDefinedSettings) {

    var that = this;

    this.type = "div";

    this.className = userDefinedSettings.theme || "plain";

    this.fontSize = userDefinedSettings.fontSize;

    this.fontFamily = userDefinedSettings.fontFamily;

    this.width = userDefinedSettings.width || "100%";

    this.widgetWrapper;

    this.element;

    this.targetElement = userDefinedSettings.targetElement;

    this.loadingMode = false;

    this.render = function() {
        this.element = SELEX.UTILS.createElement(this.type, this.className);
        this.setWidth(this.width);
        var tagName = this.targetElement.tagName.toLowerCase();
        switch(tagName) {
            case ALLOWED_TARGET_ELEMENT_TAG_NAME_SELECT:
                this.nativeSelectBox = new SELEX.ELEMENTS.NativeSelectBox(this);
                this.nativeSelectBox.attach();
                if (this.nativeSelectBox.isDisabled())
                    this.disable();
                var parentsParent = this.targetElement.parentNode;
                parentsParent.insertBefore(this.element, this.targetElement);
                this.element.appendChild(this.targetElement);
                this.targetElement.hide();
                break;
            default:
                throw new SELEX.EXCEPTIONS.InvalidTargetElementErrorException();
        }
        renderWidget();
        return this.element;
    }

    function renderWidget() {
        that.widgetWrapper = new SELEX.ELEMENTS.WIDGET.Wrapper(userDefinedSettings, that, that.nativeSelectBox);
        var widgetWrapperElem = that.widgetWrapper.render();
        that.element.appendChild(widgetWrapperElem);
        that.widgetWrapper.getOptionsMenu().getOptionsMenuList().adjustHeight();
        that.widgetWrapper.getOptionsMenu().hide();
    }

    this.toggleLoadingMode = function() {
        if (this.loadingMode === false)
            this.enableLoadingMode();
        else
            this.disableLoadingMode();
    }

    this.enableLoadingMode = function() {
        this.loadingMode = true;
        this.widgetWrapper.getOptionsMenu().enableLoadingMode();
        this.widgetWrapper.getWidgetSubWrapper().enableLoadingMode();
    }

    this.disableLoadingMode = function() {
        this.loadingMode = false;
        this.widgetWrapper.getOptionsMenu().disableLoadingMode();
        this.widgetWrapper.getWidgetSubWrapper().disableLoadingMode();
    }

    this.getTargetElement = function() {
        return this.targetElement;
    }

    this.getNativeSelect = function() {
        return this.nativeSelectBox;
    }

    this.getWidgetWrapper = function() {
        return this.widgetWrapper;
    }

    this.show = function() {
        this.element.show();
    }

    this.hide = function() {
        this.element.hide();
    }

    this.enable = function() {
        this.element.removeAttribute("disabled");
    }

    this.disable = function() {
        this.element.setAttribute("disabled", true);
    }

    this.setWidth = function(width) {
        this.width = width;
        this.element.setStyle("width", this.width);
    }
};
SELEX.EXCEPTIONS.InvalidOptionsErrorException = function() {
	return {
		name:        "Invalid options object", 
	    level:       "Show Stopper", 
	    message:     "options should be in object form with required key-value pairs. See the required key-value pairs from " + SELEX.CONFIG.CONSTRUCTOR_PARAMS_URL,  
	    htmlMessage: "Error detected",
	    toString:    function(){return this.name + ": " + this.message;} 
	}
};SELEX.EXCEPTIONS.InvalidTargetElementErrorException = function() {
	return {
		name:        "Invalid target element", 
	    level:       "Show Stopper", 
	    message:     "targetElement should be <select> or <input type='select'>",  
	    htmlMessage: "Error detected",
	    toString:    function(){return this.name + ": " + this.message;} 
	}
};SELEX.HELPERS.getOptionByValue = function(options, value) {
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (option.value == value)
			return option;
	}
};Object.prototype.setStyle = function(name, value) {
  if (typeof value === "number") {
    value += "px";
  }
  this.style[name] = value;
};

Object.prototype.removeChildren = function() {
  this.innerHTML = "";
};

Object.prototype.getChildren = function() {
  return this.childNodes;
};

Object.prototype.setSelected = function() {
  this.setAttribute("selected", true);
};

Object.prototype.removeStyle = function(name) {
  this.style[name] = null;
};

Object.prototype.getStyle = function(name) {
  return this.style[name];
};

Object.prototype.hasClass = function(name) {
  var result = this.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
  if (result === null)
    return false;
  return result;
};

Object.prototype.addClass = function(name) {
  if (this.hasClass(name) === false)
   this.className += " " + name;
};

Object.prototype.clearClasses = function() {
  this.className = "";
};

Object.prototype.setDataAttribute = function(name, value) {
  this.setAttribute("data-" + name, value);
};

Object.prototype.getDataAttribute = function(name) {
  return this.getAttribute("data-" + name);
};

Object.prototype.removeDataAttribute = function(name) {
  this.removeAttribute("data-" + name);
};

Object.prototype.isHidden = function() {
  return (this.style.display === "none") ? true : false;
};

Object.prototype.show = function() {
  this.style.display = "block";
};

Object.prototype.hide = function() {
  this.style.display = "none";
};

Object.prototype.empty = function() {
  this.innerHTML = "";
};

Object.prototype.setClass = function(name) {
  this.className = name;
};

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
    for (var i in this) {
      if (i == 'clone') 
        continue;
      if (this[i] && typeof this[i] == "object")
          newObj[i] = this[i].clone();
      else 
        newObj[i] = this[i];
    } 
    return newObj;
};

Object.prototype.removeClass = function(className) {
    var newClassName = "";
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] !== className) {
            newClassName += classes[i] + " ";
        }
    }
    this.className = newClassName;
};SELEX.UTILS.createElement = function(type, classes) {
	var elem = document.createElement(type);
	if (typeof classes === "string")
		elem.setClass(classes);
	return elem;
};

SELEX.UTILS.isElement = function(o) {
	//Returns true if it is a DOM element    
  	return (
    	typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2 
    	o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	);
};

SELEX.UTILS.triggerEvent = function(type, targetElem) {
	var e;
	if(typeof(document.createEvent) != 'undefined') {
	    e = document.createEvent('HTMLEvents');
	    e.initEvent(type, true, true);
	    targetElem.dispatchEvent(e);
	} else if(typeof(document.createEventObject) != 'undefined') {
	    try {
	        e = document.createEventObject();
	        targetElem.fireEvent('on' + type.toLowerCase(), e);
	    } catch(err){ }
	}
};}(jQuery));
