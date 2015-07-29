/*! * Javascript Library for TYPO3 extension th_rating * version: 1.07 (04-Feb-2014) * @requires jQuery v1.3.2 or later * @requires jQuery Form Plugin 2.47 or later * *  Copyright notice**  (c) 2014 Thomas Hucke <thucke@web.de> *  All rights reserved**  This script is part of the TYPO3 project. The TYPO3 project is*  free software; you can redistribute it and/or modify*  it under the terms of the GNU General Public License as published by*  the Free Software Foundation; either version 2 of the License, or*  (at your option) any later version.**  The GNU General Public License can be found at*  http://www.gnu.org/copyleft/gpl.html.**  This script is distributed in the hope that it will be useful,*  but WITHOUT ANY WARRANTY; without even the implied warranty of*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the*  GNU General Public License for more details.**  This copyright notice MUST APPEAR in all copies of the script!***************************************************************//** * Global vars */var constRatingFadeOut=400;var constRatingFadein=300;var constDelayFlashMessage=200;var constFlashMessageFadein=800;var constFlashMessageDuration=1500;var constFlashMessageFadeout=1000; /** * Constructor */jQuery(document).ready(function() {	initBinding();	jQuery('.currentPollText').each(function(){		adjustHeights(this);	});	jQuery('#vote').ajaxForm({		type:			'post',		beforeSubmit:  	checkVoteSubmission,  // pre-submit callback		success:		handleReceivedVote  // post-submit callback 	});	jQuery('.tx-thrating-flash-message').each(fadeFlashMessage);});/** * Initialize all event listeners */function initBinding() {	//clear existing events and re-create them later	jQuery('span.ajaxLink').off('click');	jQuery('select.ajaxLink').off('change');	jQuery('span.ajaxLink').hover( function() {  { switchStepname(this,true); } }, function() {  { switchStepname(this,false); } });	jQuery('span.ajaxLink').one('click', function() {		submitVoteForm(jQuery.parseJSON(jQuery('input:first',this).val()));		return false;	});		//handle all changes of selection inputs	jQuery('select.ajaxLink').attr("disabled", false);    	jQuery('select.ajaxLink').one('change', function() {		//value is like '{"value":2,"voter":1,"rating":2,"ajaxRef":3599914}'		submitVoteForm(jQuery.parseJSON(this.value));		return false;	});    }/** * Form submission * * ... being called by multiple event handlers */function submitVoteForm( choosenValue ) {		var targetFormElements = document.forms["vote"].elements;		targetFormElements["tx_thrating_pi1[__referrer][@action]"].value = choosenValue.actionName;		targetFormElements["tx_thrating_pi1[vote][vote]"].value = choosenValue.value;		targetFormElements["tx_thrating_pi1[vote][voter]"].value = choosenValue.voter;		targetFormElements["tx_thrating_pi1[vote][rating]"].value = choosenValue.rating;		targetFormElements["tx_thrating_pi1[settings]"].value = choosenValue.settings;		targetFormElements["tx_thrating_pi1[ajaxRef]"].value = choosenValue.ajaxRef;		jQuery('#vote').submit();}/** * jQuery pre-submit callback */function checkVoteSubmission(formData, jqForm, options) { 	for (var i = 0; i < formData.length; ++i) {		if (formData[i]["name"] == "tx_thrating_pi1[vote][vote]" && formData[i]["value"] == 0) {			//alert("Choose a valid rating");			initBinding();			// return false to prevent the form from being submitted; 			return false;		}		if (formData[i]["name"] == "tx_thrating_pi1[ajaxRef]") {			var ajaxTargetId = 'tx-thrating-pi1-' + formData[i]["value"];		}	}	var targetObj = document.getElementById(ajaxTargetId);	jQuery(targetObj).fadeTo(constRatingFadeOut,0.01);	return true; } 		/** * jQuery post-submit callback * * The returned content will only be replaced if voteform or ratinglink is returned. * Possibly returned flash messages are copied into the right content element DIV. */function handleReceivedVote(responseText, statusText, xhr, jQueryform)  { 	var response = jQuery(responseText);	var ajaxTargetId = jQuery(response).attr('id');	//alert("Debug here" + ajaxTargetId);	var content = jQuery('.tx-thrating-content',response).html(); //save content-DIV in Var	var flashMessages = jQuery('.tx-thrating-flash-message',response).html(); //save flash-messages-DIV in Var	var targetObj = document.getElementById(ajaxTargetId);	doReplace = false;	if (targetObj) {		//check if a valid answer returned from AJAX call		doReplace = true;	}	//do not replace content if vote request was invalid	if (doReplace) {		jQuery(targetObj).fadeTo(1,0.01,function() {			jQuery('.tx-thrating-content',this).html( content );	//replace content			jQuery('.currentPollText',this).each(function(){				adjustHeights(this);			});			//jQuery('.tx-thrating-content .currentPollText',this).each( adjustHeights(this));			initBinding();		});				//replace flashmessages of this rating		jQuery('.tx-thrating-flash-message',targetObj)			.delay(constDelayFlashMessage)			.html(flashMessages)				//replace flashMessages			.each(fadeFlashMessage);	} else {		jQuery(targetObj).fadeTo(1,0.01);		initBinding();	}	jQuery('span[name="dummy4focus"]',targetObj).focus(); // remove focus from ratinglinks	jQuery('div#'+ajaxTargetId+' select.ajaxLink').attr('selectedIndex',0); //reset selection box	jQuery(targetObj).fadeTo(constRatingFadein,1);			}/** * FlashMessages Fadein / Fadeout */function fadeFlashMessage() {	if ( jQuery(this).children().first().html() != null ) {		jQuery(this).fadeTo(constFlashMessageFadein,0.9,function() {			jQuery(this)				.delay(constFlashMessageDuration)				.fadeOut(constFlashMessageFadeout)		});	}}/** * Switch stepname visibility */function switchStepname( linkObj, hoverIn ) {	stepname = jQuery(linkObj).attr('title');	if ( hoverIn ) {		stepnameObj = jQuery(linkObj).parents('div.tx-thrating-ratinglinks').children('div.stepnameTooltip').first();		jQuery(stepnameObj).html(stepname).addClass('stepnameTooltipOn').removeClass('stepnameTooltip');    	} else {		stepnameObj = jQuery(linkObj).parents('div.tx-thrating-ratinglinks').children('div.stepnameTooltipOn').first();		jQuery(stepnameObj).html('&nbsp;').removeClass('stepnameTooltipOn').addClass('stepnameTooltip');	}}/** * Adjust font size to fit in polling bars */function adjustHeights(currElem) {	var fontstep = 1;	if (jQuery(currElem).height()>jQuery(currElem).parent().height() || jQuery(currElem).width()>jQuery(currElem).parent().width()) {		jQuery('.currentPollText').css('font-size',((jQuery(currElem).css('font-size').substr(0,2)-fontstep)) + 'px');		adjustHeights(currElem);	}}	