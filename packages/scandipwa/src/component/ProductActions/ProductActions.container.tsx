/* eslint-disable spaced-comment */
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

import { connect } from 'react-redux';

import { ProductType } from 'Component/Product/Product.config';
import {
    mapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    ProductContainer
} from 'Component/Product/Product.container';
import { StockStatus } from 'Component/Product/Stock.config';
import { ReactElement } from 'Type/Common.type';
import { RootState } from 'Util/Store/Store.type';

import ProductActions from './ProductActions.component';
import {
    ProductActionsContainerMapStateProps,
    ProductActionsContainerProps,
    ProductActionsContainerState
} from './ProductActions.type';

/** @namespace Component/ProductActions/Container/mapStateToProps */
export const mapStateToProps = (state: RootState): ProductActionsContainerMapStateProps => ({
    ...sourceMapStateToProps(state),
    isPriceAlertEnabled: state.ConfigReducer.product_alert_allow_price,
    isInStockAlertEnabled: state.ConfigReducer.product_alert_allow_stock,
    displayProductStockStatus: state.ConfigReducer.display_product_stock_status,
    areReviewsEnabled: state.ConfigReducer.reviews_are_enabled
});

/** @namespace Component/ProductActions/Container */
export class ProductActionsContainer extends ProductContainer {
    containerFunctions = {
        ...this.containerFunctions,
        showOnlyIfLoaded: this.showOnlyIfLoaded.bind(this)
    };

    containerProps() {
        const {
            areDetailsLoaded,
            areReviewsEnabled,
            displayProductStockStatus,
            getLink,
            isInStockAlertEnabled,
            isPriceAlertEnabled
        } = this.props;

        return {
            ...super.containerProps(),
            areDetailsLoaded,
            areReviewsEnabled,
            displayProductStockStatus,
            getLink,
            isInStockAlertEnabled,
            isPriceAlertEnabled,
            isPricePreview: this.isPricePreview(),
            offerCount: this.getOfferCount(),
            offerType: this.getOfferType(),
            stockMeta: this.getStockMeta(),
            metaLink: this.getMetaLink()
        };
    }

    componentDidUpdate(prevProps: ProductActionsContainerProps, prevState: ProductActionsContainerState): void {
        super.componentDidUpdate(prevProps, prevState);

        const { selectedProduct: prevSelectedProduct } = prevState;
        const { selectedProduct } = this.state;
        const { setActiveProduct } = this.props;

        // Updates ProductPages active product state, to
        // match selected product variant
        if (selectedProduct !== prevSelectedProduct) {
            setActiveProduct(selectedProduct);
        }
    }

    //#region META
    getMetaLink(): string {
        const { getLink } = this.props;

        return window.location.origin + getLink().replace(/\?.*/, '');
    }

    getStockMeta(): string {
        const {
            product,
            product: { variants = [] },
            configurableVariantIndex
        } = this.props;

        const {
            stock_status
        } = variants[ configurableVariantIndex ] || product;

        if (stock_status === StockStatus.IN_STOCK) {
            return 'https://schema.org/InStock';
        }

        return 'https://schema.org/OutOfStock';
    }

    getOfferType(): string {
        const { product: { variants } } = this.props;

        if (variants && variants.length >= 1) {
            return 'https://schema.org/AggregateOffer';
        }

        return 'https://schema.org/Offer';
    }

    getOfferCount(): number {
        const { product: { variants } } = this.props;

        if (variants && variants.length) {
            return variants.length;
        }

        return 0;
    }
    //#endregion

    showOnlyIfLoaded(expression, content, placeholder = content) {
        const { areDetailsLoaded } = this.props;

        if (!areDetailsLoaded) {
            return placeholder;
        }

        if (areDetailsLoaded && !expression) {
            return null;
        }

        return content;
    }

    // Display preview price for bundle when nothing is selected
    isPricePreview(): boolean {
        const {
            product: {
                type_id: type,
                dynamic_price: dynamicPrice
            } = {}
        } = this.props;

        const { enteredOptions = [], selectedOptions = [] } = this.state;

        return (
            enteredOptions.length <= 0
            && selectedOptions.length <= 0
            && type === ProductType.BUNDLE
            && !!dynamicPrice
        );
    }

    render(): ReactElement {
        return (
            <ProductActions
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductActionsContainer);