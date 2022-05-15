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

import { RouteComponentProps } from 'react-router';

import { Customer } from 'Query/MyAccount.type';
import { NetworkError } from 'Type/Common.type';

export interface MyAccountInformationContainerMapStateProps {
    customer: Partial<Customer>;
    isMobile: boolean;
    isLoading: boolean;
    isLocked: boolean;
    baseLinkUrl: string;
}

export interface MyAccountInformationContainerMapDispatchProps {
    updateCustomer: (customer: Partial<Customer>) => void;

    showSuccessNotification: (message: string) => void;
    showErrorNotification: (error: NetworkError | NetworkError[] | string) => void;

    updateCustomerLoadingStatus: (status: boolean) => void;
    logout: () => void;
    updateIsLocked: (isLocked: boolean) => void;
}

export type MyAccountInformationContainerProps = MyAccountInformationContainerMapStateProps
& MyAccountInformationContainerMapDispatchProps
& RouteComponentProps<Record<string, never>, Record<string, never>, { editPassword?: boolean }>;

export type MyAccountInformationContainerState = {
    showEmailChangeField: boolean;
    showPasswordChangeField: boolean;
    isErrorShow: boolean;
};

export interface MyAccountInformationComponentProps {
    onCustomerSave: (fields) => Promise<void>;
    isLoading: boolean;
    customer: Partial<Customer>;
    showEmailChangeField: boolean;
    showPasswordChangeField: boolean;
    handleChangeEmailCheckbox: () => void;
    handleChangePasswordCheckbox: () => void;
}

export type MyAccountInformationContainerPropsKeys =
       | 'customer'
       | 'isLoading'
       | 'showEmailChangeField'
       | 'showPasswordChangeField';