<?php
/**
 * Netstarter.com.au.
 * PHP Version 5
 * @category Netstarter
 * @package Imageswitcher
 * @author Netstarter.com.au
 * @license http://www.netstarter.com.au/license.txt
 * Model class to get product attributes with frontend input type 'select' for admin configurations.
 */

class Netstarter_Imageswitcher_Model_System_Config_Source_Product_Attributes
{
    //Return option array with product attribute label
    public function toOptionArray(){
        $options = array();
        $entityTypeId = Mage::getModel('eav/entity_type')->loadByCode('catalog_product')->getEntityTypeId();
        $attributes = Mage::getModel('eav/entity_attribute')->getCollection()
                        ->addFilter('entity_type_id', $entityTypeId)
                        ->addFilter('frontend_input','select')
                        ->setOrder('attribute_code', 'ASC');
        foreach ($attributes as $attribute){
            $item['value'] = $attribute->getAttributeCode();
            if ($attribute->getFrontendLabel()){
                $item['label'] = $attribute->getFrontendLabel();
            }
            else{
                $item['label'] = $attribute->getAttributeCode();
            }
            $options[] = $item;
        }

        return $options;
    }
}
?>