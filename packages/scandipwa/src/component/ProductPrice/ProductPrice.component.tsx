/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';

import { ProductType } from 'Component/Product/Product.config';
import TextPlaceholder from 'Component/TextPlaceholder';
import { TextPlaceHolderLength } from 'Component/TextPlaceholder/TextPlaceholder.config';
import { MixType, ReactElement } from 'Type/Common.type';
import { OriginalPriceType, ProductPriceType } from 'Type/Price.type';
import { PriceConfiguration } from 'Type/ProductList.type';

import {
    DISPLAY_PRODUCT_PRICES_IN_CATALOG_EXCL_TAX,
    DISPLAY_PRODUCT_PRICES_IN_CATALOG_INCL_TAX
} from './ProductPrice.config';

import './ProductPrice.style';

/**
 * Product price
 * @class ProductPrice
 * @namespace Component/ProductPrice/Component
 */
export class ProductPrice extends PureComponent {
    static propTypes = {
        price: ProductPriceType,
        priceType: PropTypes.oneOf(Object.values(ProductType)),
        originalPrice: OriginalPriceType,
        tierPrice: PropTypes.string,
        configuration: PriceConfiguration,
        priceCurrency: PropTypes.string,
        discountPercentage: PropTypes.number,
        isPreview: PropTypes.bool,
        isSchemaRequired: PropTypes.bool,
        label: PropTypes.string,
        variantsCount: PropTypes.number,
        mix: MixType,
        displayTaxInPrice: PropTypes.string
    };

    static defaultProps = {
        price: {},
        priceType: ProductType.simple,
        originalPrice: {},
        priceCurrency: 'USD',
        discountPercentage: 0,
        isPreview: false,
        isSchemaRequired: false,
        variantsCount: 0,
        mix: {},
        tierPrice: '',
        label: '',
        configuration: {},
        displayTaxInPrice: DISPLAY_PRODUCT_PRICES_IN_CATALOG_INCL_TAX
    };

    pricePreviewRenderMap = {
        [ProductType.simple]: this.renderDefaultPrice.bind(this),
        [ProductType.virtual]: this.renderDefaultPrice.bind(this),
        [ProductType.bundle]: this.renderBundlePrice.bind(this),
        [ProductType.grouped]: this.renderGroupedPrice.bind(this),
        [ProductType.downloadable]: this.renderDefaultPrice.bind(this),
        [ProductType.configurable]: this.renderConfigurablePrice.bind(this)
    };

    priceLabelTypeMap = {
        [ProductType.simple]: __('Starting at'),
        [ProductType.virtual]: __('Starting at'),
        [ProductType.bundle]: __('Starting at'),
        [ProductType.grouped]: __('Starting at'),
        [ProductType.downloadable]: __('Starting at'),
        [ProductType.configurable]: __('As Low as')
    };

    renderPlaceholder(): ReactElement {
        const { mix } = this.props;

        return (
            <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                <TextPlaceholder
                  mix={ { block: 'ProductPrice', elem: 'Placeholder' } }
                  length={ TextPlaceHolderLength.CUSTOM }
                />
            </p>
        );
    }

    getCurrencySchema() {
        const { isSchemaRequired, priceCurrency } = this.props;

        return isSchemaRequired ? { itemProp: 'priceCurrency', content: priceCurrency } : {};
    }

    getCurrentPriceSchema() {
        const {
            isSchemaRequired,
            variantsCount,
            price: {
                finalPrice: {
                    value: contentPrice = 0
                } = {}
            } = {}
        } = this.props;

        if (variantsCount > 1) {
            return isSchemaRequired ? { itemProp: 'lowPrice', content: contentPrice } : {};
        }

        return isSchemaRequired ? { itemProp: 'price', content: contentPrice } : {};
    }

    renderPrice(price, label): ReactElement {
        const {
            discountPercentage
        } = this.props;

        const {
            value: priceValue,
            valueFormatted: priceFormatted = 0
        } = price;

        const { itemProp = null, content = null } = this.getCurrentPriceSchema();

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        // force unequal comparison - unsure of resulting type
        // eslint-disable-next-line
        if (priceValue == 0) {
            return null;
        }

        return (
            <PriceSemanticElementName block="ProductPrice" elem="Price">
                { this.renderPriceBadge(label) }
                <span
                  itemProp={ itemProp }
                  content={ content }
                  block="ProductPrice"
                  elem="PriceValue"
                >
                    { priceFormatted }
                </span>
            </PriceSemanticElementName>
        );
    }

    renderPriceBadge(label): ReactElement {
        if (!label) {
            return null;
        }

        return <span mix={ { block: 'ProductPrice', elem: 'PriceBadge' } }>{ label }</span>;
    }

    renderSubPrice(price): ReactElement {
        const {
            value: priceExclTax = 0,
            valueFormatted: priceExclTaxFormatted = 0
        } = price;

        if (!priceExclTax) {
            return null;
        }

        return (
            <span
              aria-label={ __('Current product price excl. tax') }
              block="ProductPrice"
              elem="SubPrice"
            >
                { __('Excl. tax: %s', priceExclTaxFormatted) }
            </span>
        );
    }

    renderOldPrice(): ReactElement {
        const {
            price: {
                originalPrice: {
                    value: originalPriceValue,
                    valueFormatted: originalPriceFormatted
                } = {}
            } = {},
            discountPercentage,
            isSchemaRequired,
            variantsCount
        } = this.props;

        if (discountPercentage === 0 || originalPriceValue === 0) {
            return null;
        }

        return (
            <del
              block="ProductPrice"
              elem="HighPrice"
              aria-label={ __('Old product price') }
              itemProp={ isSchemaRequired && variantsCount > 1 ? { itemProp: 'highPrice' } : null }
            >
                { originalPriceFormatted }
            </del>
        );
    }

    renderSchema(): ReactElement {
        const { isSchemaRequired } = this.props;

        if (isSchemaRequired) {
            const { itemProp = null, content = null } = this.getCurrencySchema();

            return (
                <meta itemProp={ itemProp } content={ content } />
            );
        }

        return null;
    }

    renderRequiredWithChangePrice(): ReactElement {
        const {
            configuration: {
                containsRequiredOptionsWithPrice = false
            } = {},
            priceType
        } = this.props;

        const { [priceType]: label } = this.priceLabelTypeMap;

        return (
            <>
                { label && containsRequiredOptionsWithPrice && this.renderPriceBadge(label) }
                { this.renderDefaultPrice() }
            </>
        );
    }

    renderBundlePrice(): ReactElement {
        const {
            originalPrice: {
                minFinalPrice = {},
                minFinalPrice: { value: minValue = 0 } = {},
                maxFinalPrice = {},
                maxFinalPrice: { value: maxValue = 0 } = {},
                minFinalPriceExclTax = {},
                maxFinalPriceExclTax = {},
                minRegularPrice = {},
                maxRegularPrice = {},
                minRegularPrice: { value: minRegularValue = 0 } = {},
                maxRegularPrice: { value: maxRegularValue = 0 } = {}
            }
        } = this.props;

        if (minValue === maxValue) {
            const renderer = (minValue === 0)
                ? this.renderDefaultPrice()
                : this.renderPriceWithOrWithoutTax(minFinalPrice, minFinalPriceExclTax);

            return (
                <>
                    { minValue < minRegularValue && this.renderRegularPrice(minRegularPrice) }
                    { renderer }
                </>
            );
        }

        return (
            <>
                <div block="ProductPrice" elem="BundleFrom" mods={ { hasDiscount: minValue < minRegularValue } }>
                    { minValue > 0 && this.renderPriceBadge(__('from')) }
                    { minValue < minRegularValue && this.renderRegularPrice(minRegularPrice) }
                    { this.renderPriceWithOrWithoutTax(minFinalPrice, minFinalPriceExclTax) }
                </div>
                <div block="ProductPrice" elem="BundleTo" mods={ { hasDiscount: maxValue < maxRegularValue } }>
                    { maxValue > 0 && this.renderPriceBadge(__('to')) }
                    { maxValue < maxRegularValue && this.renderRegularPrice(maxRegularPrice) }
                    { this.renderPriceWithOrWithoutTax(maxFinalPrice, maxFinalPriceExclTax) }
                </div>
            </>
        );
    }

    renderRegularPrice(price): ReactElement {
        const {
            value,
            valueFormatted
        } = price;

        if (!value || value <= 0 || !valueFormatted) {
            return null;
        }

        return (
            <del block="ProductPrice" elem="HighPrice">{ valueFormatted }</del>
        );
    }

    renderGroupedPrice(): ReactElement {
        const {
            originalPrice: {
                minFinalPrice = {},
                minFinalPriceExclTax = {}
            },
            priceType
        } = this.props;
        const { [priceType]: label } = this.priceLabelTypeMap;

        return this.renderPriceWithOrWithoutTax(minFinalPrice, minFinalPriceExclTax, label);
    }

    renderCustomisablePrice(): ReactElement {
        const {
            originalPrice: {
                minFinalPrice = {},
                minFinalPriceExclTax = {},
                minFinalPrice: { value: minValue = 0 } = {},
                maxFinalPrice: { value: maxValue = 0 } = {}
            },
            priceType
        } = this.props;

        if (minValue === maxValue) {
            return this.renderDefaultPrice();
        }

        const { [priceType]: label } = this.priceLabelTypeMap;

        return this.renderPriceWithOrWithoutTax(minFinalPrice, minFinalPriceExclTax, label);
    }

    renderConfigurablePrice(): ReactElement {
        const {
            originalPrice: {
                minFinalPrice: { value: minValue = 0 } = {},
                maxFinalPrice: { value: maxValue = 0 } = {}
            },
            configuration: {
                containsOptions = false
            } = {},
            price: {
                finalPriceExclTax = {},
                finalPrice = {}
            },
            priceType
        } = this.props;

        if (minValue === maxValue && !containsOptions) {
            return this.renderDefaultPrice();
        }

        const { [priceType]: label } = this.priceLabelTypeMap;

        return this.renderPriceWithOrWithoutTax(finalPrice, finalPriceExclTax, label);
    }

    renderDefaultPrice(defaultLabel = null): ReactElement {
        const {
            price: { finalPrice = {}, finalPriceExclTax = {} } = {},
            label
        } = this.props;

        return (
            <>
                { this.renderOldPrice() }
                { this.renderPriceWithOrWithoutTax(finalPrice, finalPriceExclTax, defaultLabel || label) }
                { this.renderSchema() }
            </>
        );
    }

    renderPriceWithOrWithoutTax(basePrice, taxPrice, label): ReactElement {
        const { displayTaxInPrice } = this.props;

        if (displayTaxInPrice === DISPLAY_PRODUCT_PRICES_IN_CATALOG_INCL_TAX) {
            return this.renderPrice(basePrice, label);
        }

        if (displayTaxInPrice === DISPLAY_PRODUCT_PRICES_IN_CATALOG_EXCL_TAX) {
            return this.renderPrice(taxPrice, label);
        }

        return (
            <>
                { this.renderPrice(basePrice, label) }
                { this.renderSubPrice(taxPrice) }
            </>
        );
    }

    renderTierPrice(): ReactElement {
        const {
            tierPrice,
            price: {
                finalPrice: {
                    valueFormatted = 0
                } = {}
            } = {}
        } = this.props;

        if (!tierPrice || tierPrice === valueFormatted) {
            return null;
        }

        return (
            <p block="ProductPrice" elem="TierPrice">
                { __('As low as') }
                <strong>{ ` ${tierPrice}` }</strong>
            </p>
        );
    }

    render(): ReactElement {
        const {
            price: {
                finalPrice,
                originalPrice,
                finalPrice: {
                    value: finalPriceValue = 0
                } = {}
            } = {},
            priceType,
            isPreview,
            discountPercentage,
            mix
        } = this.props;

        if (!finalPrice || !originalPrice) {
            return this.renderPlaceholder();
        }

        const { [priceType]: renderer } = this.pricePreviewRenderMap;

        return (
            <div
              block="ProductPrice"
              mods={ { hasDiscount: discountPercentage !== 0, isPreview } }
              mix={ mix }
              aria-label={ `Product price: ${finalPriceValue}` }
            >
                { isPreview && renderer && renderer() }
                { (!isPreview || !renderer) && this.renderDefaultPrice() }
                { priceType !== ProductType.bundle && this.renderTierPrice() }
            </div>
        );
    }
}

export default ProductPrice;