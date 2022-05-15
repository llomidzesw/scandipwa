/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
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

import CloseIcon from 'Component/CloseIcon';
import EditIcon from 'Component/EditIcon';
import Field from 'Component/Field';
import { FieldType } from 'Component/Field/Field.config';
import ProductCard from 'Component/ProductCard';
import ProductReviewRating from 'Component/ProductReviewRating';
import { ReactElement } from 'Type/Common.type';
import { noopFn } from 'Util/Common';

import './WishlistItem.style';

/** @namespace Component/WishlistItem/Component */
export class WishlistItem extends PureComponent {
    static propTypes = {
        addToCart: PropTypes.func,
        changeQuantity: PropTypes.func,
        product: ProductType.isRequired,
        changeDescription: PropTypes.func,
        removeItem: PropTypes.func,
        redirectToProductPage: PropTypes.func,
        isLoading: PropTypes.bool,
        isRemoving: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        isEditingActive: PropTypes.bool.isRequired,
        handleSelectIdChange: PropTypes.func.isRequired,
        setQuantity: PropTypes.func.isRequired,
        minSaleQuantity: PropTypes.number.isRequired,
        maxSaleQuantity: PropTypes.number.isRequired,
        inStock: PropTypes.bool.isRequired
    };

    static defaultProps = {
        addToCart: noopFn,
        changeQuantity: noopFn,
        changeDescription: noopFn,
        removeItem: noopFn,
        redirectToProductPage: noopFn,
        isLoading: false
    };

    renderContent = this.renderContent.bind(this);

    optionRenderMap = {
        [ProductType.grouped]: this.renderGroupedOption.bind(this),
        [ProductType.bundle]: this.renderBundleOption.bind(this)
    };

    renderCommentField(): ReactElement {
        const {
            product: { wishlist: { description } },
            changeDescription,
            inStock
        } = this.props;

        return (
            <Field
              type={ FieldType.TEXT }
              attr={ {
                  id: 'description',
                  name: 'description',
                  placeholder: __('Add a comment'),
                  defaultValue: description
              } }
              events={ {
                  onChange: ({ target: { value } = {} }) => changeDescription(value)
              } }
              mix={ { block: 'WishlistItem', elem: 'CommentField' } }
              isDisabled={ !inStock }
            />
        );
    }

    renderQuantityFieldInput(): ReactElement {
        const {
            product: { wishlist: { quantity } },
            changeQuantity,
            setQuantity,
            minSaleQuantity,
            maxSaleQuantity,
            inStock
        } = this.props;

        return (
            <Field
              type={ FieldType.NUMBER }
              attr={ {
                  id: 'item_qty',
                  name: 'item_qty',
                  defaultValue: quantity,
                  min: minSaleQuantity,
                  max: maxSaleQuantity
              } }
              events={ {
                  onChange: (quantity) => {
                      changeQuantity(quantity);
                      setQuantity(quantity);
                  }
              } }
              mix={ { block: 'WishlistItem', elem: 'QuantityInput' } }
              isDisabled={ !inStock }
            />
        );
    }

    renderQuantityField(): ReactElement {
        const {
            product: { wishlist: { quantity } },
            isEditingActive,
            isMobile
        } = this.props;

        if (!isMobile) {
            return this.renderQuantityFieldInput();
        }

        return (
            <div block="WishlistItem" elem="QuantityWrapper">
                <span block="WishlistItem" elem="QuantityText">{ __('Qty:') }</span>
                { isEditingActive
                    ? this.renderQuantityFieldInput()
                    : quantity }
            </div>
        );
    }

    renderAddToCartButton(): ReactElement {
        const {
            addToCart,
            isEditingActive,
            isMobile,
            inStock
        } = this.props;

        if (!inStock) {
            return null;
        }

        const mods = isMobile ? { isEditingActive } : {};

        return (
            <button
              block="Button"
              mods={ { isHollow: isMobile } }
              mix={ { block: 'WishlistItem', elem: 'AddToCart', mods } }
              onClick={ addToCart }
            >
                { __('Add to cart') }
            </button>
        );
    }

    renderOutOfStockMessage(): ReactElement {
        const { inStock } = this.props;

        if (inStock) {
            return null;
        }

        return (
            <div block="WishlistItem" elem="OutOfStock">
                <p>
                    { __('Out of stock') }
                </p>
            </div>
        );
    }

    renderRemove(): ReactElement {
        const { removeItem } = this.props;

        return (
            <button
              block="WishlistItem"
              elem="Remove"
              onClick={ removeItem }
              aria-label={ __('Remove') }
            >
                <CloseIcon />
            </button>
        );
    }

    getWishlistProduct() {
        const {
            product,
            product: { url, type_id }
        } = this.props;

        if (type_id !== ProductType.configurable) {
            return product;
        }

        const wishedVariant = product.variants.find(({ sku }) => sku === product.wishlist.sku);

        if (!wishedVariant) {
            return {
                ...product,
                url
            };
        }

        return {
            ...wishedVariant,
            url
        };
    }

    renderGroupedOption(option): ReactElement {
        const { label, value } = option;

        return (
            <span block="WishlistItemOption" key={ `${ label }-${ value }` }>
                { `${ value} x ${label }` }
            </span>
        );
    }

    renderBundleOption(option): ReactElement {
        const { label, value } = option;

        return (
            <span block="WishlistItemOption" key={ `${ label }-${ value }` }>
                { `${label }: ${ value}` }
            </span>
        );
    }

    renderOptions(): ReactElement {
        const { product: { type_id, wishlist: { options } } } = this.props;

        const renderMethod = this.optionRenderMap[type_id];

        if (renderMethod) {
            return (
                <div block="WishlistItemOptions" elem="List">
                    { options.map(renderMethod) }
                </div>
            );
        }

        return (
            <div block="WishlistItemOptions" elem="List">
                { options.map(({ value }) => value).join(', ') }
            </div>
        );
    }

    renderRating(): ReactElement {
        const { product: { rating_summary, review_count } } = this.props;

        if (review_count < 1) {
            return <div block="WishlistItem" elem="RatingPlaceholder" />;
        }

        return <ProductReviewRating summary={ rating_summary } count={ review_count } />;
    }

    renderBrand(): ReactElement {
        const {
            product: {
                attributes: { brand: { attribute_value: brand } = {} } = {}
            }
        } = this.props;

        return (
            <div block="WishlistItem" elem="Brand">{ brand }</div>
        );
    }

    renderName(): ReactElement {
        const { product: { name } } = this.props;

        return (
            <h4>{ name }</h4>
        );
    }

    renderPrice(productPrice): ReactElement {
        const { inStock } = this.props;

        if (!inStock) {
            return null;
        }

        return (
            <div
              block="WishlistItem"
              elem="Price"
            >
                { productPrice() }
            </div>
        );
    }

    renderSelectCheckbox(): ReactElement {
        const { product: { wishlist: { id } }, handleSelectIdChange, isEditingActive } = this.props;

        return (
            <div block="WishlistItem" elem="Select" mods={ { isEditingActive } }>
                <Field
                  type={ FieldType.CHECKBOX }
                  attr={ {
                      id: `option-${ id }`,
                      name: `option-${ id }`
                  } }
                  events={ {
                      // eslint-disable-next-line react/jsx-no-bind
                      onClick: () => handleSelectIdChange(id)
                  } }
                />
            </div>
        );
    }

    renderCardFooterMobile(): ReactElement {
        const { redirectToProductPage } = this.props;

        return (
            <div block="WishlistItem" elem="Content">
                { this.renderCommentField() }
                <div block="WishlistItem" elem="ActionWrapper">
                    { this.renderAddToCartButton() }
                    { this.renderOutOfStockMessage() }
                    <button
                      key="edit"
                      block="WislistItem"
                      elem="Edit"
                      onClick={ redirectToProductPage }
                      aria-label={ __('Edit wishlist item') }
                      tabIndex="0"
                    >
                        <EditIcon />
                    </button>
                </div>
            </div>
        );
    }

    renderCardDataMobile({
        content: { productPrice },
        pictureBlock: { picture: renderPicture },
        renderCardLinkWrapper
    }) {
        return (
            <div block="WishlistItem" elem="FigureWrapper">
                { renderCardLinkWrapper((
                    <figure mix={ { block: 'ProductCard', elem: 'Figure' } }>
                        { renderPicture({ block: 'WishlistItem', elem: 'Picture' }) }
                    </figure>
                ), { block: 'WishlistItem', elem: 'ImageWrapper' }) }
                <div block="WishlistItem" elem="InformationWrapper">
                    <div block="WishlistItem" elem="RowWrapper">
                        <div block="WishlistItem" elem="NameAndOptions">
                            { this.renderRating() }
                            { this.renderName() }
                            { this.renderOptions() }
                        </div>
                        { this.renderRemove() }
                    </div>
                    <div block="WishlistItem" elem="RowWrapper">
                        { this.renderQuantityFieldInput() }
                        { this.renderPrice(productPrice) }
                    </div>
                </div>
            </div>
        );
    }

    renderContentMobile(renderMethods): ReactElement {
        const {
            isEditingActive
        } = this.props;

        return (
            <div block="WishlistItem" elem="SelectWrapper">
                    { this.renderSelectCheckbox() }
                    <div block="WishlistItem" elem="ContentWrapper" mods={ { isEditingActive } }>
                        { this.renderCardDataMobile(renderMethods) }
                        { this.renderCardFooterMobile() }
                    </div>
            </div>
        );
    }

    renderContent(renderMethods): ReactElement {
        const { redirectToProductPage } = this.props;

        const {
            content: { productPrice },
            pictureBlock: { picture: renderPicture },
            renderCardLinkWrapper
        } = renderMethods;

        const { isMobile } = this.props;

        if (isMobile) {
            return this.renderContentMobile(renderMethods);
        }

        return (
            <>
                <div block="WishlistItem" elem="FigureWrapper">
                    { renderCardLinkWrapper(
                        <>
                            <figure mix={ { block: 'ProductCard', elem: 'Figure' } }>
                                { renderPicture({ block: 'WishlistItem', elem: 'Picture' }) }
                            </figure>
                            { this.renderRating() }
                            { this.renderBrand() }
                            { this.renderName() }
                        </>
                    ) }
                    { this.renderRemove() }
                </div>
                { this.renderOptions() }
                <div block="WishlistItem" elem="Content">
                    <div block="WishlistItem" elem="RowWrapper">
                        { this.renderPrice(productPrice) }
                        { this.renderQuantityFieldInput() }
                    </div>
                    { this.renderCommentField() }
                    <div block="WishlistItem" elem="ActionWrapper">
                        { this.renderAddToCartButton() }
                        { this.renderOutOfStockMessage() }
                        <div
                          block="WishlistItem"
                          elem="EditIcon"
                          onClick={ redirectToProductPage }
                        >
                            <EditIcon />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    render(): ReactElement {
        const { isLoading, isRemoving } = this.props;
        const product = this.getWishlistProduct();

        if (!product) {
            return null;
        }

        return (
            <ProductCard
              product={ product }
              mix={ { block: 'WishlistItem', elem: 'ProductCard' } }
              isLoading={ isLoading || isRemoving }
              renderContent={ this.renderContent }
              hideWishlistButton
              hideCompareButton
            />
        );
    }
}

export default WishlistItem;