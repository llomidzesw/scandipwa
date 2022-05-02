/* eslint-disable spaced-comment,@scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
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

import FieldFile from 'Component/FieldFile';
import { FieldNumberContainer } from 'Component/FieldNumber/FieldNumber.container';
import FieldSelectContainer from 'Component/FieldSelect/FieldSelect.container';
import { MixType, ReactElement } from 'Type/Common.type';
import {
    EventsType,
    FieldAttrType,
    LabelType,
    OptionType
} from 'Type/Field.type';
import { noopFn } from 'Util/Common';

import { FieldType } from './Field.config';

import './Field.style';

/**
 * Field
 * @class Field
 * @namespace Component/Field/Component
 */
export class Field extends PureComponent {
    static propTypes = {
        // Field attributes
        type: PropTypes.oneOf(Object.values(FieldType)).isRequired,
        attr: FieldAttrType.isRequired,
        events: EventsType.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        setRef: PropTypes.func.isRequired,
        mix: MixType.isRequired,
        options: PropTypes.arrayOf(OptionType).isRequired,
        changeValueOnDoubleClick: PropTypes.bool,
        isSortSelect: PropTypes.bool,

        // Validation
        showErrorAsLabel: PropTypes.bool.isRequired,
        validationResponse: (props, propName, componentName) => {
            const propValue = props[propName];

            if (propValue === null) {
                return;
            }

            if (typeof propValue === 'boolean') {
                return;
            }

            if (typeof propValue === 'object' && !Object.keys(propValue).includes('errorMessages')) {
                throw new Error(
                    // eslint-disable-next-line max-len
                    `${componentName} only accepts null, bool or object of "errorMessages" as "validationResponse", received "${JSON.stringify(propValue)}"`
                );
            }
        },

        // Labels
        label: LabelType.isRequired,
        subLabel: PropTypes.string.isRequired,
        addRequiredTag: PropTypes.bool.isRequired
    };

    static defaultProps = {
        validationResponse: null,
        changeValueOnDoubleClick: false,
        isSortSelect: false
    };

    renderMap = {
        // Checkboxes & Radio
        [FieldType.radio]: this.renderCheckboxOrRadio.bind(this),
        [FieldType.checkbox]: this.renderCheckboxOrRadio.bind(this),
        [FieldType.multi]: this.renderCheckboxOrRadio.bind(this),

        // Default input
        [FieldType.email]: this.renderDefaultInput.bind(this),
        [FieldType.text]: this.renderDefaultInput.bind(this),
        [FieldType.time]: this.renderDefaultInput.bind(this),
        [FieldType.dateTime]: this.renderDefaultInput.bind(this),
        [FieldType.date]: this.renderDefaultInput.bind(this),
        [FieldType.password]: this.renderDefaultInput.bind(this),
        [FieldType.submit]: this.renderDefaultInput.bind(this),

        // Custom fields
        [FieldType.file]: this.renderFile.bind(this),
        [FieldType.select]: this.renderSelect.bind(this),
        [FieldType.textarea]: this.renderTextArea.bind(this),
        [FieldType.button]: this.renderButton.bind(this),
        [FieldType.number]: this.renderNumber.bind(this)

    };

    //#region INPUT TYPE RENDER
    renderDefaultInput(): ReactElement {
        const {
            type, setRef, attr, events, isDisabled
        } = this.props;

        return (
            <input
              ref={ (elem) => setRef(elem) }
              disabled={ isDisabled }
              type={ type }
              { ...attr }
              { ...events }
            />
        );
    }

    renderFile(): ReactElement {
        const { attr, events, setRef } = this.props;

        return (
            <FieldFile attr={ attr } events={ events } setRef={ setRef } />
        );
    }

    renderNumber(): ReactElement {
        const {
            attr,
            events,
            setRef,
            isDisabled = false
        } = this.props;

        return (
            <FieldNumberContainer
              attr={ attr }
              events={ events }
              setRef={ setRef }
              isDisabled={ isDisabled }
            />
        );
    }

    renderSelect(): ReactElement {
        const {
            attr,
            events,
            setRef,
            options,
            isDisabled = false,
            changeValueOnDoubleClick,
            isSortSelect
        } = this.props;

        return (
            <FieldSelectContainer
              attr={ attr }
              events={ events }
              options={ options }
              setRef={ setRef }
              isDisabled={ isDisabled }
              isSortSelect={ isSortSelect }
              changeValueOnDoubleClick={ changeValueOnDoubleClick }
            />
        );
    }

    renderButton(): ReactElement {
        const {
            setRef, attr, events, isDisabled
        } = this.props;
        const { value = __('Submit') } = attr;

        return (
            <button
              ref={ (elem) => setRef(elem) }
              disabled={ isDisabled }
              { ...attr }
              { ...events }
            >
                { value }
            </button>
        );
    }

    renderCheckboxOrRadio(): ReactElement {
        const {
            type,
            setRef,
            attr: { defaultChecked = false, ...newAttr } = {},
            events: { onChange },
            events,
            isDisabled,
            label
        } = this.props;
        const { id = '', checked, value = '' } = newAttr;
        const elem = type.charAt(0).toUpperCase() + type.slice(1);
        const inputEvents = {
            ...events,
            onChange: onChange || noopFn
        };
        // if button value is "none" do not disable
        const isButtonDisabled = (!value.match('none') && isDisabled);
        const isChecked = isButtonDisabled || defaultChecked ? !isDisabled : null;

        return (
            <label htmlFor={ id } block="Field" elem={ `${elem}Label` } mods={ { isDisabled } }>
                <input
                  ref={ (elem) => setRef(elem) }
                  disabled={ isButtonDisabled ? isDisabled : false }
                  type={ type }
                  { ...newAttr }
                  { ...inputEvents }
                  // shipping options have checked attr assigned so prioritize its value
                  checked={ checked || isChecked }
                />
                <div block="input-control" disabled={ isDisabled } />
                { label }
            </label>
        );
    }

    renderTextArea(): ReactElement {
        const {
            setRef, attr, events, isDisabled
        } = this.props;

        return (
            <textarea
              ref={ (elem) => setRef(elem) }
              disabled={ isDisabled }
              { ...attr }
              { ...events }
            />
        );
    }
    //#endregion

    //#region LABEL/TEXT RENDER
    // Renders validation error messages under field
    renderErrorMessage(message, key): ReactElement {
        return <div block="Field" elem="ErrorMessage" key={ key }>{ message }</div>;
    }

    renderErrorMessages(): ReactElement {
        const {
            showErrorAsLabel,
            validationResponse,
            attr: { name }
        } = this.props;

        if (!showErrorAsLabel || !validationResponse || validationResponse === true) {
            return null;
        }

        const { errorMessages = [] } = validationResponse;

        if (!errorMessages) {
            return null;
        }

        return (
            <div block="Field" elem="ErrorMessages">
                { errorMessages.map((message, index) => this.renderErrorMessage.call(this, message, name + index)) }
            </div>
        );
    }

    // Renders fields label above field
    renderLabel(): ReactElement {
        const { type, label, attr: { name } = {} } = this.props;

        if (!label) {
            return null;
        }

        return (
            <div block="Field" elem="LabelContainer">
                <label block="Field" elem="Label" htmlFor={ name || `input-${type}` }>
                    { label }
                    { this.renderRequiredTag() }
                </label>
            </div>
        );
    }

    // Renders * for required fields
    renderRequiredTag(): ReactElement {
        const { addRequiredTag } = this.props;

        if (!addRequiredTag) {
            return null;
        }

        return (
            <span block="Field" elem="Label" mods={ { isRequired: true } }>
                { ' *' }
            </span>
        );
    }

    // Renders fields label under field
    renderSubLabel(): ReactElement {
        const { subLabel } = this.props;

        if (!subLabel) {
            return null;
        }

        return (
            <div block="Field" elem="SubLabelContainer">
                <div block="Field" elem="SubLabel">
                    { subLabel }
                </div>
            </div>
        );
    }
    //#endregion

    render(): ReactElement {
        const {
            type, validationResponse, mix
        } = this.props;
        const inputRenderer = this.renderMap[type];

        return (
            <div block="Field" elem="Wrapper" mods={ { type } }>
                <div
                  block="Field"
                  mods={ {
                      type,
                      isValid: validationResponse === true,
                      hasError: validationResponse !== true && Object.keys(validationResponse || {}).length !== 0
                  } }
                  mix={ mix }
                >
                    { type !== FieldType.checkbox && type !== FieldType.radio && this.renderLabel() }
                    { inputRenderer && inputRenderer() }
                </div>
                { this.renderErrorMessages() }
                { this.renderSubLabel() }
            </div>
        );
    }
}

export default Field;