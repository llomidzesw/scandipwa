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

import { ReactElement } from 'Type/Common.type';

import { TextPlaceholderComponentProps } from './TextPlaceholder.type';

import './TextPlaceholder.style';

/**
 * Text placeholder
 * @class TextPlaceholder
 * @namespace Component/TextPlaceholder/Component
 */
export class TextPlaceholder extends PureComponent<TextPlaceholderComponentProps> {
    static defaultProps = {
        content: '',
        length: 'short',
        mix: {}
    };

    render(): ReactElement {
        const { content, length, mix } = this.props;

        if (content) {
            return content;
        }

        return <span mix={ mix } block="TextPlaceholder" mods={ { length } } />;
    }
}

export default TextPlaceholder;