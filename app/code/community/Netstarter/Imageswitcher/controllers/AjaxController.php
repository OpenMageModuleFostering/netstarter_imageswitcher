<?php
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
/**
 * Image switcher ajax controller class to get product images
 */

class Netstarter_Imageswitcher_AjaxController extends Mage_Core_Controller_Front_Action {

    //get product images for a product configurable attributes
    public function getdetailimagesAction(){
        $post = $this->getRequest()->getPost();
        $productId = $post['productId'];
        $attrId = $post['attrId'];
        $optionId = $post['optionVal'];
        $isCatView = $post['isCatView'];

        if($post['twoAttr']=='true'){
            $primaryAttrId= $post['primaryAttrId'];
        }
        if($post['twoAttr']=='true'){
            $primaryOptionId = $post['primaryOptionId'];
        }

        if(!empty($productId)){
            //Get product attribute configurable attributes.
            $product=Mage::getModel('catalog/product')->load($productId);

            $allowAttributes=$product->getTypeInstance(true)->getConfigurableAttributes($product);
            foreach($allowAttributes as $attribute){
                if($attribute->getProductAttribute()->getAttributeId()==$attrId){
                    $attributeCode=$attribute->getProductAttribute()->getAttributeCode();
                    $prices = $attribute->getPrices();
                    foreach ($prices as $optionPrice){
                        if($optionPrice['value_index']==$optionId){
                            $selctedProdPrice = $this->_preparePrice($optionPrice['pricing_value'],$optionPrice['is_percent'],$product->getFinalPrice());
                        }
                    }
                    break;
                }
            }
            $formatedSelectedProductPrice = Mage::helper('core')->currency($selctedProdPrice, true, false);
            $conf = Mage::getModel('catalog/product_type_configurable')->setProduct($product);
            if($post['twoAttr']=='false'){
                $col = $conf->getUsedProductCollection()
                        ->addAttributeToFilter($attributeCode, $optionId)
                        ->addAttributeToSelect('image')
                        ->addAttributeToSelect($attributeCode)
                        ->addFilterByRequiredOptions();
            }else{
                foreach($allowAttributes as $attribute){
                    if($attribute->getProductAttribute()->getAttributeId()==$primaryAttrId){
                        $primaryAttributeCode=$attribute->getProductAttribute()->getAttributeCode();
                        $prices = $attribute->getPrices();
                        foreach ($prices as $optionPrice){
                            if($optionPrice['value_index']==$optionId){
                                $selctedProdPrice = $this->_preparePrice($optionPrice['pricing_value'],$optionPrice['is_percent'],$product->getFinalPrice());
                            }
                        }
                        break;
                    }
                }
                //Get product price
                $formatedSelectedProductPrice = Mage::helper('core')->currency($selctedProdPrice, true, false);
                $col = $conf->getUsedProductCollection()
                    ->addAttributeToFilter($attributeCode, $optionId)
                    ->addAttributeToFilter($primaryAttributeCode, $primaryOptionId)
                    ->addAttributeToSelect('image')
                    ->addAttributeToSelect($attributeCode)
                    ->addAttributeToSelect($primaryAttributeCode)
                    ->addFilterByRequiredOptions();
            }
            if($col->count()>0){
                foreach($col as $colItem){
                    $simpleProduct = Mage::getModel('catalog/product')->load($colItem->getId());
                    if($isCatView){
                        $html= $simpleProduct->getImageUrl();
                        $productId = $simpleProduct->getEntityId();
                    }else{
                        $html=$this->getLayout()->createBlock('catalog/product_view_media')->setData('product', $simpleProduct)
                        ->setTemplate('catalog/product/view/media.phtml')
                        ->toHtml();
                    }
                }
            }else{
                $html = '';
            }
            $result = array('success'=>'true','html'=>$html,'priceval'=>$formatedSelectedProductPrice, 'productId' => $productId);
        }else{
            $result = array('success'=>'false');
        }
        $this->getResponse()->setBody(json_encode($result));
    }

    protected function _preparePrice($price, $isPercent = false,$productFinalPrice)
    {
        if ($isPercent && !empty($price)) {
            $price = $productFinalPrice * $price / 100;
        }

        return $productFinalPrice+$price;
    }
}
?>