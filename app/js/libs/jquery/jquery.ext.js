console.log("Extending jquery...");
$.extend($.expr[':'], {
	'containsi' : function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || '').toLowerCase()
				.indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});