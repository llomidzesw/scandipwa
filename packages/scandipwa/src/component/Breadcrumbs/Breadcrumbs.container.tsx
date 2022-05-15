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

import BreadcrumbsReducer from 'Store/Breadcrumbs/Breadcrumbs.reducer';
import { withReducers } from 'Util/DynamicReducer';
import { RootState } from 'Util/Store/Store.type';

import Breadcrumbs from './Breadcrumbs.component';
import { BreadcrumbsContainerMapStateProps } from './Breadcrumbs.type';

/** @namespace Component/Breadcrumbs/Container/mapStateToProps */
export const mapStateToProps = (state: RootState): BreadcrumbsContainerMapStateProps => ({
    breadcrumbs: state.BreadcrumbsReducer.breadcrumbs,
    areBreadcrumbsVisible: state.BreadcrumbsReducer.areBreadcrumbsVisible
});

/** @namespace Component/Breadcrumbs/Container/mapDispatchToProps */
export const mapDispatchToProps = (): Record<string, never> => ({});

export default withReducers({
    BreadcrumbsReducer
})(connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs));