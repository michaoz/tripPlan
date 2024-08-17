/** tooltip start */
/** prj's source */
function toggleTooltip(elm) {
	var tooltip = $(elm).next('.toggle_tooltip');
	
	// If it contains the new line code in Java, transfer it to that in HTML.
	if (tooltip.text().indexOf('\n') >= 0) {
		tooltip.html(tooltip.text().replace('\n', '<br>'));
	}
	
	if (tooltip.css('display') == 'none') {
		tooltip.show();
	} else {
		tooltip.hide();
	}
}
// htmlは<p class="tooltip">{ツールチップに全文表示させたい文字列（本来'title'に設定する文字列）}</p>
/** tooltip end */