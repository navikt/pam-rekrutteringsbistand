import React from 'react';
import PropTypes from 'prop-types';
import './Tag.less';

export default class Tag extends React.Component {
    onRemoveClick = () => {
        this.props.onRemove(this.props.value);
    };

    render() {
        return (
            <div className="Tag">
                <span className="typo-normal">{this.props.label}</span>
                {this.props.canRemove && (
                    <button className="Tag__remove" aria-label="Slett" onClick={this.onRemoveClick}>
                        x
                    </button>
                )}
            </div>
        );
    }
}

Tag.defaultProps = {
    canRemove: true,
};

Tag.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    canRemove: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
};
