import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertekst } from 'nav-frontend-typografi';
import Typeahead from '../../../common/typeahead/Typeahead';
import { FETCH_LOCATIONS, SET_LOCATION_TYPE_AHEAD_VALUE } from './locationCodeReducer';
import { SET_LOCATION_POSTAL_CODE } from '../../adDataReducer';
import {
    registerShortcuts,
    removeShortcuts
} from '../../../common/shortcuts/Shortcuts';
import './Location.less';

class Location extends React.Component {
    componentDidMount() {
        this.props.fetchLocations();
        registerShortcuts('locationEdit', {
            's s': (e) => {
                e.preventDefault();
                this.inputRef.input.focus();
            }
        });
    }

    componentWillUnmount() {
        removeShortcuts('locationEdit');
    }

    onTypeAheadValueChange = (value) => {
        this.props.setLocationTypeAheadValue(value);
        this.props.setLocationPostalCode(value);
    };

    onTypeAheadSuggestionSelected = (location) => {
        if (location) {
            this.props.setLocationTypeAheadValue(location.value);
            this.props.setLocationPostalCode(location.value);
        }
    };

    capitalize = (text) => {
        const separators = [
            ' ', // NORDRE LAND skal bli Nordre Land
            '-', // AUST-AGDER skal bli Aust-Agder
            '(' // BØ (TELEMARK) skal bli Bø (Telemark)
        ];

        const ignore = [
            'i', 'og' // MØRE OG ROMSDAL skal bli Møre og Romsdal
        ];

        if (text) {
            let capitalized = text.toLowerCase();

            for (let i = 0, len = separators.length; i < len; i += 1) {
                const fragments = capitalized.split(separators[i]);
                for (let j = 0, x = fragments.length; j < x; j += 1) {
                    if (!ignore.includes(fragments[j])) {
                        fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                    }
                }
                capitalized = fragments.join(separators[i]);
            }

            return capitalized;
        }
        return text;
    };

    render() {
        return (
            <div className="Location">
                <div className="blokk-xxs">
                    <Typeahead
                        id="PostalCode__input"
                        className="PostalCode__code"
                        label="Arbeidssted (postnummer)*"
                        placeholder="Skriv inn postnummer eller poststed"
                        onSelect={this.onTypeAheadSuggestionSelected}
                        onChange={this.onTypeAheadValueChange}
                        suggestions={this.props.suggestions.map((location) => ({
                            value: location.postalCode,
                            label: `${location.postalCode} ${this.capitalize(location.city)}`
                        }))}
                        value={this.props.location && this.props.location.postalCode ?
                            this.props.location.postalCode : ''}
                        ref={(instance) => {
                            this.inputRef = instance;
                        }}
                        error={this.props.validation.location !== undefined}
                    />
                </div>
                {this.props.location &&
                    <div>
                        {this.props.location.city && this.props.location.municipal && this.props.location.county && (
                            <Undertekst>
                                Sted: {this.capitalize(this.props.location.city)}{' | '}
                                Kommune: {this.capitalize(this.props.location.municipal)}{' | '}
                                Fylke: {this.capitalize(this.props.location.county)}
                            </Undertekst>
                        )}
                    </div>
                }
                {this.props.validation.location && (
                    <div className="Administration__error">{this.props.validation.location}</div>
                )}
            </div>
        );
    }
}

Location.propTypes = {
    suggestions: PropTypes.arrayOf(PropTypes.shape({
        kode: PropTypes.string,
        navn: PropTypes.string
    })).isRequired,
    setLocationTypeAheadValue: PropTypes.func.isRequired,
    fetchLocations: PropTypes.func.isRequired,
    setLocationPostalCode: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    suggestions: state.location.suggestions,
    location: state.adData.location,
    validation: state.adValidation.errors
});

const mapDispatchToProps = (dispatch) => ({
    setLocationTypeAheadValue: (value) => dispatch({ type: SET_LOCATION_TYPE_AHEAD_VALUE, value }),
    setLocationPostalCode: (postalCode) => dispatch({ type: SET_LOCATION_POSTAL_CODE, postalCode }),
    fetchLocations: () => dispatch({ type: FETCH_LOCATIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);
