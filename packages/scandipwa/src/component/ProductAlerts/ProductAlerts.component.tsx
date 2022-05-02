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

import { StockType } from 'Component/Product/Stock.config';
import { ReactElement } from 'Type/Common.type';
import { StockStatusType } from 'Type/StockStatus.type';

import './ProductAlerts.style';

/** @namespace Component/ProductAlerts/Component */
export class ProductAlerts extends PureComponent {
    static propTypes = {
        handlePriceDropSubscribeAlertPriceDrop: PropTypes.func.isRequired,
        handlePriceDropSubscribeAlertInStock: PropTypes.func.isRequired,
        isInStockAlertEnabled: PropTypes.bool,
        isPriceAlertEnabled: PropTypes.bool,
        stockStatus: StockStatusType
    };

    static defaultProps = {
        isInStockAlertEnabled: false,
        isPriceAlertEnabled: false,
        stockStatus: null
    };

    renderPriceDropSubscribeButton(): ReactElement {
        const { handlePriceDropSubscribeAlertPriceDrop, isPriceAlertEnabled } = this.props;

        if (!isPriceAlertEnabled) {
            return null;
        }

        return (
            <button
              block="ProductAlerts"
              elem="PriceDrop"
              onClick={ handlePriceDropSubscribeAlertPriceDrop }
            >
                { __('Notify me when the price drops') }
            </button>
        );
    }

    renderInStockSubscribeButton(): ReactElement {
        const {
            handlePriceDropSubscribeAlertInStock,
            isInStockAlertEnabled,
            stockStatus
        } = this.props;

        if (!isInStockAlertEnabled) {
            return null;
        }

        if (stockStatus === StockType.IN_STOCK || !stockStatus) {
            return null;
        }

        return (
            <button
              block="ProductAlerts"
              elem="InStock"
              onClick={ handlePriceDropSubscribeAlertInStock }
            >
                { __('Notify me when this product is in stock') }
            </button>
        );
    }

    render(): ReactElement {
        return (
            <div
              block="ProductAlerts"
              elem="Wrapper"
            >
                { this.renderPriceDropSubscribeButton() }
                { this.renderInStockSubscribeButton() }
            </div>
        );
    }
}

export default ProductAlerts;