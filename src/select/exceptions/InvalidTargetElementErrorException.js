SELECT.EXCEPTIONS.InvalidTargetElementErrorException = function() {
	return {
		name:        "Invalid target element", 
	    level:       "Show Stopper", 
	    message:     "el should be <select> or <input type='select'>",  
	    htmlMessage: "Error detected",
	    toString:    function(){return this.name + ": " + this.message;} 
	}
};