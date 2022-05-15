/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
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

import Field from 'Component/Field';
import FieldGroup from 'Component/FieldGroup';
import Form from 'Component/Form';
import { ReactElement } from 'Type/Common.type';

import './FieldForm.style';

/** @namespace Component/FieldForm/Component */
export class FieldForm<T> extends PureComponent<T> {
    get fieldMap() {
        return [
            // // Field
            // {
            //     attr: {
            //         name: __('Email'),
            //         ...
            //     },
            //     events: {
            //         onChange: handleInput,
            //         ...
            //     },
            //     validateOn: [ 'onChange', ... ],
            //     validationRules: {
            //         isRequired: true,
            //         ...
            //     },
            //     ...
            // },
            // // FieldGroup
            // {
            //     attr: { ... }
            //     events: { ... }
            //     fields: [
            //         // Can contain both fields or field groups
            //     ],
            //     ...
            // }
        ];
    }

    renderSection(section): ReactElement {
        const {
            fields,
            attr: {
                name = ''
            } = {},
            name: sectionName
        } = section;

        // If contains attr fields then outputs data as fields
        if (Array.isArray(fields)) {
            return (
                <FieldGroup { ...section } key={ name || sectionName }>
                    { fields.map(this.renderSection.bind(this)) }
                </FieldGroup>
            );
        }

        return <Field { ...section } key={ name } />;
    }

    renderActions(): ReactElement {
        return null;
    }

    renderFormBody(): ReactElement {
        return (
            <div block="FieldForm" elem="Body">
                <div block="FieldForm" elem="Fields">
                    { this.fieldMap.map(this.renderSection.bind(this)) }
                </div>
                { this.renderActions() }
            </div>
        );
    }

    getFormProps(): T {
        return { ...this.props };
    }

    render(): ReactElement {
        return (
            <Form { ...this.getFormProps() } block="FieldForm">
                { this.renderFormBody() }
            </Form>
        );
    }
}

export default FieldForm;