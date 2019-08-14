/**
 * Netstarter.com.au
 *
 * PHP Version 5
 *
 * @category Netstarter
 * @package Netstarter_Imageswitcher
 * @author Netstarter.com.au
 * @copyright 2013 netstarter.com.au
 * @license http://www.netstarter.com.au/license.txt
 * @link N/A
 *
 */


jQuery(function () {
    jQuery('.switcherWraper').each(function () {

        jQuery(this).imageSwitcher();

    });

});


var isCatView = 0;

(function ($, undefined) {

    jQuery.fn.imageSwitcher = function (options) {
        var set = $.extend({
            errormsg1: "Please select an option", //set the error message for the first option
            errormsg2: "Please select an option", //set the error message for the second  option
            errormsgCombine: "Please select as option", //set the error message for the combine option
            errormsgPos:"bottom" // top or bottom (where error message appear)
        }, options);

        var cdiv = this;

        if (!cdiv.length) return;

        var cid = cdiv.attr('data-id');

        var cjson = eval("spJason_" + cid);


        var firstWrap = cdiv.find('.colorSwitcherPanels');
        var secondWrap = cdiv.find('.colorSwitcherSubPanels');

        var submitEvent;
        var productSelected = false;

        var index = [];
        var coloreSet;
        var otherSet;

        var firstSet;
        var secondSet;

        var secondSetArray = [];

        var safirst = cdiv.find('.super_attribute').eq(0);
        var sasecond = cdiv.find('.super_attribute').eq(1);

        var combineproduct = false;


        if(jQuery('.category-view').length || jQuery('.results-view').length || jQuery('.category-products').length) isCatView = 1;


        if (cjson.combineAttr == 1) combineproduct = true;
        if (!cdiv.find('.colorSwitcherSubPanels').length) combineproduct = false; //check combine product or not

        for (var x in cjson.attributes) {
            index.push(x);
        }

        if (index.length) {
            coloreSet = cjson.attributes[index[0]];
            safirst.val("");
        }

        if (index.length >= 2) {
            for( var j=0;j < index.length; j++){
                if(cjson.attributes[index[j]].code == cjson.secondaryAttr)
                {
                    otherSet = cjson.attributes[index[j]];break;
                }
           }
        }

        //When combine attribute is disable
        if (!combineproduct) {

            firstWrap.parent().prepend('<label class="required"><em>*</em>'+ coloreSet.label+'</label>');

            for (var i = 0; i < coloreSet.options.length; i++) {
                firstWrap.append('<li><img product_id="'+cjson.productId+'" title="' + coloreSet.options[i].label + '" optionid="' + coloreSet.options[i].id + '" attribute_id="' + coloreSet.id + '" src = "' + coloreSet.options[i].imagePath + '" width="30" height="30"/></li>');
            }


            firstWrap.find('li').click(function () {

                cdiv.find('.switchError').remove();

                if (index.length >= 2) {
                    productSelected = false;
                    sasecond.val("");
                }
                else {
                    productSelected = true;
                }

                cdiv.find('.switchSelect').removeClass('switchSelect');
                jQuery(this).addClass('switchSelect');

                var cset = jQuery(this).prevAll().length;
                firstSet = coloreSet.options[cset];
                secondSetArray = [];

                safirst.val(firstSet.id);
                //Load single attribute image
                loadImages(jQuery(this).find('img').attr("optionid"), jQuery(this).find('img').attr("product_id"), jQuery(this).find('img').attr("attribute_id"),isCatView);

                if (index.length >= 2) { // check for the other set


                    for (var k = 0; k < firstSet.products.length; k++) {

                        var cid = (firstSet.products[k]);

                        for (var s = 0; s < otherSet.options.length; s++) {
                            for (var p = 0; p < otherSet.options[s].products.length; p++) {
                                if (otherSet.options[s].products[p] == cid) {
                                    secondSetArray.push(otherSet.options[s]);
                                }
                            }
                        }
                    }

                    secondWrap.html('');
                    secondWrap.parent().find('label').remove();
                    secondWrap.parent().prepend('<label class="required"><em>*</em>'+ otherSet.label+'</label>');
                    for (var n = 0; n < secondSetArray.length; n++) {
                        secondWrap.append('<li><img product_id="'+cjson.productId+'" title="' + secondSetArray[n].label + '" optionid="' + secondSetArray[n].id + '" attribute_id ="' + otherSet.id + '" src = "' + secondSetArray[n].imagePath + '" width="30" height="30"/></li>')
                    }

                    //second level product click
                    secondWrap.find('li').click(function () {


                        secondWrap.find('.switchSelect').removeClass('switchSelect')
                        jQuery(this).addClass('switchSelect');
                        productSelected = true;

                        var cset = jQuery(this).prevAll().length;
                        secondSet = secondSetArray[cset];

                        cdiv.find('.regular-price .price').html(parseInt(cjson.basePrice) + parseInt(secondSet.price));
                        sasecond.val(secondSet.id);

                        cdiv.find('.switchError').remove();

                        var selectedPrimaryAttributId = firstWrap.find('.switchSelect img').attr("attribute_id");
                        var selectedPrimaryOtionId = firstWrap.find('.switchSelect img').attr("optionid");

                        var clickedImage = jQuery(this).find('img');

                        clickedImage.attr("primary_attribute_id", selectedPrimaryAttributId);
                        clickedImage.attr("primary_optionid", selectedPrimaryOtionId);
                        //Load image for two attributes
                        loadSecondaryImages(clickedImage.attr("optionid"), jQuery(this).find('img').attr("product_id"), clickedImage.attr("attribute_id"), selectedPrimaryAttributId, selectedPrimaryOtionId,isCatView);
                    });
                }


            });
        }


        else {
            firstWrap.addClass('combineProductHide');
            cdiv.find('.last .input-box').prepend('<label class="required"><em>*</em>'+ coloreSet.label +" / " +otherSet.label +'</label>');

            for (var p = 0; p < coloreSet.options.length; p++) {
                var ppr = coloreSet.options[p];
                for (var k = 0; k < coloreSet.options[p].products.length; k++) {
                    for (var pp = 0; pp < otherSet.options.length; pp++) {

                        var cpr = otherSet.options[pp];
                        for (var kk = 0; kk < otherSet.options[pp].products.length; kk++) {


                            if (otherSet.options[pp].products[kk] == coloreSet.options[p].products[k]) {
                                secondWrap.append('<li><img product_id="'+cjson.productId+'" src = "' + cjson.imgLocation + "/" + ppr.label + "_" + cpr.label + cjson.imgFileFormat
                                    + '" title="' + cpr.label
                                    + '" secondary_optionid="' + cpr.id
                                    + '" secondary_attribute_id ="' + otherSet.id
                                    + '" primary_optionid="' + ppr.id
                                    + '" primary_attribute_id="' + coloreSet.id
                                    + '" width="30" height="30"/></li>')
                            }

                        }
                    }

                }
            }


            secondWrap.find('li img').click(function () {

                safirst.val(jQuery(this).attr('primary_optionid'));
                sasecond.val(jQuery(this).attr('secondary_optionid'));

                cdiv.find('.switchError').remove();

                jQuery(this).addClass('switchSelect');
                productSelected = true;

                var selectedPrimaryAttributId = jQuery(this).attr('primary_attribute_id');
                var selectedPrimaryOptionId = jQuery(this).attr('primary_optionid');
                var selectedSecondaryAttributId = jQuery(this).attr('secondary_attribute_id');
                var selectedSecondaryOptionId = jQuery(this).attr('secondary_optionid');

                loadSecondaryImages(selectedSecondaryOptionId, jQuery(this).attr("product_id"), selectedSecondaryAttributId, selectedPrimaryAttributId, selectedPrimaryOptionId,isCatView);

            })

        }

        var thisbtn = cdiv.parent().find('.btn-cart');
        if(thisbtn.length == 0) thisbtn = cdiv.parent().parent().find('.btn-cart');
        var submitEvent = thisbtn.attr('onclick')
        thisbtn.attr('onclick', '').unbind('click');


        thisbtn.click(function (event) {


            cdiv.find('.switchError').remove();


            if (productSelected) {
                thisbtn.attr('onclick', submitEvent);

            }
            else {

                event.preventDefault();


                if (combineproduct) {
                    if (!secondWrap.find('.switchSelect').length) {
                        if(set.errormsgPos == "top")secondWrap.before('<div class="switchError">'+set.errormsgCombine+'</div>');
                        else secondWrap.after('<div class="switchError">'+set.errormsgCombine+'</div>');
                    }
                }
                else {
                    if (!firstWrap.find('.switchSelect').length) {
                        if(set.errormsgPos == "top")firstWrap.before('<div class="switchError">'+set.errormsg1+'</div>');
                        else firstWrap.after('<div class="switchError">'+set.errormsg1+'</div>');
                    }
                    else {
                        if (!secondWrap.find('.switchSelect').length) {
                            if(set.errormsgPos == "top") secondWrap.before('<div class="switchError">'+set.errormsg2+'</div>');
                            else secondWrap.after('<div class="switchError">'+set.errormsg2+'</div>');
                        }
                    }
                }


            }

        });


    };

})(jQuery);

function loadImages(optionid, productId, attrId,isCatView) {
    //get images of the product
    jQuery.ajax({
        'url': '/imageswitcher/ajax/getdetailimages/',
        'type': 'post',
        'dataType': 'json',
        'data': 'productId=' + productId + '&optionVal=' + optionid + '&attrId=' + attrId + '&twoAttr=' + 'false' + '&isCatView=' + isCatView,
        'success': function (data) {
            if (data.success == 'true') {
               if(isCatView==0){
                   jQuery('.product-img-box').html(data.html);
                   jQuery('.super-attribute-select').val(optionid);
                   jQuery('.price').html(data.priceval);
               }else{
                   var clickedItem = jQuery('.product-image-'+productId);
                   clickedItem.attr('src',data.html);
                   var detailViewLink = clickedItem.parent(0);
                   var detailViewUrl = detailViewLink.attr('href');
                   var url = detailViewUrl.split('?')[0]+'?prod_id='+data.productId;
                   detailViewLink.attr('href', url);
                   detailViewLink.parent(0).find('.product-name').find('a').attr('href', url);
                   jQuery('.super-attribute-select').val(optionid);
                   jQuery('#product-price-'+productId).find('price').html(data.priceval);
                }
            }
        }
    });
}

function loadSecondaryImages(optionid, productId, attrId, primaryAttrId, primaryOptionId,isCatView) {
    //get images of the product
    jQuery.ajax({
        'url': '/imageswitcher/ajax/getdetailimages/',
        'type': 'post',
        'dataType': 'json',
        'data': 'productId=' + productId + '&optionVal=' + optionid + '&attrId=' + attrId + '&twoAttr=' + 'true' + '&primaryAttrId=' + primaryAttrId + '&primaryOptionId=' + primaryOptionId+ '&isCatView=' + isCatView,
        'success': function (data) {
            if (data.success == 'true') {
                if(isCatView==0){
                    jQuery('.product-img-box').html(data.html);
                    jQuery('.super-attribute-select').val(optionid);
                    jQuery('.price').html(data.priceval);
                }else{
                    var clickedItem = jQuery('.product-image-'+productId);
                    clickedItem.attr('src',data.html);
                    var detailViewLink = clickedItem.parent(0);
                    var detailViewUrl = detailViewLink.attr('href');
                    var url = detailViewUrl.split('?')[0]+'?prod_id='+data.productId;
                    detailViewLink.attr('href', url);
                    detailViewLink.parent(0).find('.product-name').find('a').attr('href', url);
                    jQuery('.super-attribute-select').val(optionid);
                    jQuery('#product-price-'+productId).find('.price').html(data.priceval);
                }
            }
        }
    });
}

