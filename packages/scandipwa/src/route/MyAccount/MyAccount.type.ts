/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/scandipwa
 */

import { match, RouteComponentProps } from 'react-router';

import { Breadcrumb } from 'Store/Breadcrumbs/Breadcrumbs.type';
import { PageMeta } from 'Store/Meta/Meta.type';
import { NavigationState } from 'Store/Navigation/Navigation.type';
import { NotificationType } from 'Store/Notification/Notification.type';
import { WishlistProduct } from 'Store/Wishlist/Wishlist.type';
import { MyAccountTabsSection } from 'Type/Account.type';
import { Location } from 'Type/Router.type';

export interface MyAccountContainerMapStateProps {
    isMobile: boolean;
    isWishlistEnabled: boolean;
    wishlistItems: Record<string, WishlistProduct>;
    IsSignedInFromState: boolean;
    isLocked: boolean;
    newsletterActive: boolean;
    baseLinkUrl: string;
}

export interface MyAccountContainerMapDispatchProps {
    updateBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    changeHeaderState: (state: NavigationState) => void;
    requestCustomerData: () => void;
    toggleOverlayByKey: (key: string) => void;
    updateMeta: (meta: Partial<PageMeta>) => void;
    showNotification: (type: NotificationType, message: string) => void;
    logout: () => void;
    updateIsLocked: (isLocked: boolean) => void;
}

export type MyAccountContainerProps = MyAccountContainerMapStateProps
& MyAccountContainerMapDispatchProps
& RouteComponentProps<{ tab?: string; orderId?: string }>
& {
    selectedTab: string;
};

export type MyAccountContainerState = {
    activeTab: string;
    isEditingActive: boolean;
    tabName: string;
    stateSubHeading: string;
};

export interface MyAccountComponentProps {
    isEditingActive: boolean;
    subHeading: string;
    activeTab: string;
    tabMap: Record<string, MyAccountTab>;
    changeActiveTab: (activeTab: string) => void;
    onSignIn: () => void;
    onSignOut: () => void;
    location: Location;
    match: match<{
        tab: string;
        orderId: string;
    }>;
    changeTabName: (newTabName: string) => void;
    tabName: string;
    setTabSubheading: (subHeading: string) => void;
}

export type MyAccountTab = {
    url: string;
    tabName: string;
    section: MyAccountTabsSection;
    title?: string;
    isFullUrl?: boolean;
};