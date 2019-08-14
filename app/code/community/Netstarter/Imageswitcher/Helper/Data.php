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
 class Netstarter_Imageswitcher_Helper_Data extends Mage_Core_Helper_Abstract {

        /**
         * Get image switcher functionality availability from system configurations
         * @return boolean
         */
        public function isEnableForListingPages(){
            $storeId = Mage::helper('core')->getStoreid();
            return Mage::getStoreConfig('imageswitcher/display_options/listing_pages',$storeId);
        }

        /**
         * Get image switcher addto cart functionality availability from system configurations
         * @return boolean
         */
        public function isAddToCartFromListingPages(){
            $storeId = Mage::helper('core')->getStoreid();
            return Mage::getStoreConfig('imageswitcher/display_options/addtocart_listing_pages',$storeId);
        }

       /**
        *  Get image switcher functionality availability for product detail page from system configurations
        * @return boolean
        */
        public function isEnableForProductDetailPage(){
            $storeId = Mage::helper('core')->getStoreid();
            return Mage::getStoreConfig('imageswitcher/display_options/product_detail_page',$storeId);
        }

     /**
      *  Check for attribute combined from system configurations
      * @return boolean
      */
        public function isAttributesCombined(){
            $storeId = Mage::helper('core')->getStoreid();
            return Mage::getStoreConfig('imageswitcher/settings/combine_attribute',$storeId);
        }

     /**
      * Get image switcher attributes array
      * @return array
      */
     public function getPrimaryAndSecondaryAttribute(){
            $storeId = Mage::helper('core')->getStoreid();
            $imageSwitcherAttributes = array();
            $imageSwitcherAttributes[] = Mage::getStoreConfig('imageswitcher/settings/primary_attribute',$storeId);
            $imageSwitcherAttributes[] = Mage::getStoreConfig('imageswitcher/settings/secondary_attribute',$storeId);
            return $imageSwitcherAttributes;
        }
    }
?>