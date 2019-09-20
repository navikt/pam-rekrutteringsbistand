import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import { Fieldset, Checkbox } from 'nav-frontend-skjema';
import { Tags } from '../../../common/tags';
import { DirektemeldtTags } from './direktemeldtTags'; 
import { CHECK_TAG, UNCHECK_TAG} from '../../adDataReducer';
import IsJson from '../../edit/practicalInformation/IsJson';

class InkluderingPanel extends React.Component {
    constructor(props) {
        super(props);
        
    }

    onTagChange = (e) => {
        if (e.target.checked) {
            this.props.checkTag(e.target.value);
        } else {
            this.props.uncheckTag(e.target.value);
        }
    };

    render() {
        const { tags, direktemeldt } = this.props;
        const tagsToShow = direktemeldt ? DirektemeldtTags : Tags;
        const availableTags = Object.keys(tagsToShow).map((key) => Tags[key]);


        return (
            <div className="Inkludering typo-normal">
                {availableTags.map((availableTag) => (
                        <Checkbox
                            className="checkbox--tag skjemaelement--pink"
                            id={`tag-${availableTag.key.toLowerCase()}-checkbox`}
                            label={availableTag.label}
                            key={availableTag.key}
                            value={availableTag.key}
                            checked={tags ? (IsJson(tags) ? JSON.parse(tags).includes(availableTag.key) : false) : false}
                            onChange={this.onTagChange}
                        />
                    ))}
            </div>
        );
    }
}

InkluderingPanel.propTypes = {
    checkTag: PropTypes.func.isRequired,
    uncheckTag: PropTypes.func.isRequired,
    tags: PropTypes.string
};

const mapStateToProps = (state) => ({
    tags: state.adData.properties.tags || "[]",
    direktemeldt: state.adData.source === 'DIR'
});

const mapDispatchToProps = (dispatch) => ({
    checkTag: (value) => dispatch({ type: CHECK_TAG, value }),
    uncheckTag: (value) => dispatch({ type: UNCHECK_TAG, value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(InkluderingPanel);
