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

import Popup from 'Component/Popup';
import ShareWishlistForm from 'Component/ShareWishlistForm';
import { ReactElement } from 'Type/Common.type';

import { SHARE_WISHLIST_POPUP_ID } from './ShareWishlistPopup.config';
import { ShareWishlistPopupComponentProps } from './ShareWishlistPopup.type';

import './ShareWishlistPopup.style';

/** @namespace Component/ShareWishlistPopup/Component */
export class ShareWishlistPopup extends PureComponent<ShareWishlistPopupComponentProps> {
    renderContent(): ReactElement {
        const { handleFormData, isFormLoading } = this.props;

        return (
            <ShareWishlistForm
              onSave={ handleFormData }
              isFormLoading={ isFormLoading }
            />
        );
    }

    render(): ReactElement {
        return (
            <Popup
              id={ SHARE_WISHLIST_POPUP_ID }
              clickOutside={ false }
              mix={ { block: 'ShareWishlistPopup' } }
            >
                { this.renderContent() }
            </Popup>
        );
    }
}

export default ShareWishlistPopup;