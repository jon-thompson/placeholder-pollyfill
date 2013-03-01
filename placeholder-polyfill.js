/* 
 * Placeholder Polyfill w/ Password Support
 * by Max Pollack - maxp@emoneyadvisor.com
 * Copyright (c) 2013 Max Pollack; Licensed MIT, GPL 
*/
/*jslint browser: true*/
/*global jQuery*/

(function ($) {
	"use strict";

	var settings,
		defaultSettings = {
			color: '#999'
		};

	function hidePlaceholder(element) {
		element.css('color', element.defaultTextColor);

		element.placeholder.hide();
		element.focus();

		// We're going to use this to detect if we actually put the placeholder value here.
		// There's the off chance that the user intentionally entered the placeholder value.
		element.placeholderVisible = false;
	}

	function placeholderText(element) {
		return element.attr('placeholder');
	}

	function showPlaceholder(element) {

		element.placeholder.show();

		// We're going to use this to detect if we actually put the placeholder value here.
		// There's the off chance that the user intentionally entered the placeholder value.
		element.placeholderVisible = true;
	}

	// Applies the polyfill to an element
	function applyPolyfill(element) {
		var placeholder,
			position;

		placeholder = $('<input/>');
		position = element.position();

		// Copy the style of the textbox as necessary
		placeholder.val(placeholderText(element))
			.css({
				position: 'absolute',
				height: element.height(),
				width: element.width(),
				top: position.top,
				left: position.left,
				zIndex: 9999,
				fontFamily: element.css('font-family'),
				fontSize: element.css('font-size'),
				marginLeft: element.css('margin-left'),
				marginRight: element.css('margin-right'),
				marginTop: element.css('margin-top'),
				marginBottom: element.css('margin-bottom'),
				paddingTop: element.css('padding-top'),
				paddingLeft: element.css('padding-left'),
				paddingRight: element.css('padding-right'),
				paddingBottom: element.css('padding-bottom'),
				lineHeight: element.css('line-height'),
				color: settings.color,
				display: 'none'
			});

			// Save some configuration on the element
		element.placeholder = placeholder;
		placeholder.insertBefore(element);

		// Populate the placeholder if the field is empty now
		if (element.val() === '') {
			showPlaceholder(element);
		}

		// On password focus, hide the placeholder and set focus to the underlying textbox.
		element.placeholder.on('focus', function () {
			if (element.placeholderVisible) {
				hidePlaceholder(element);
			}
		});

		// On blur, show the placeholder, if there's no value
		element.on('blur', function () {
			if (element.val() === '') {
				showPlaceholder(element);
			}
		});
	}

	// Initializes the polyfill
	function initializePolyfill() {
		var placeholderInputs = $('input[placeholder]'),
			i,
			input;

		// Set up settings
		settings = $.extend(settings, window.PlaceholderSettings, defaultSettings);

		for (i = 0; i < placeholderInputs.length; i += 1) {
			applyPolyfill($(placeholderInputs[i]));
		}
	}

	// Determine if placeholder is supported natively by the browser
	function placeholderNativelySupported() {
		return document.createElement('input').placeholder !== undefined;
	}

	// Run on page initialization
	$(function () {
		if (placeholderNativelySupported()) {
			return;
		}
		initializePolyfill();
	});

}(jQuery));