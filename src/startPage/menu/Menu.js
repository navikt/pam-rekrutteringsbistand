import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import MenuBox from './MenuBox';
import MenuSearch from './MenuSearch';
import MenuStatistics from './MenuStatistics';
import './Menu.less';
import { registerShortcuts } from '../../common/shortcuts/Shortcuts';
import { FETCH_NEXT_AD } from '../../ad/adReducer';


class Menu extends React.Component {
    componentDidUpdate() {
        if (this.props.adUuid) {
            this.props.history.push('/ads/' + this.props.adUuid);
        }
    }

    componentDidMount() {
        registerShortcuts('forside', {
            'n s': () => {
                this.onNextClick();
            },
            'l n': () => {
                this.props.history.push('/');
            }
        });
    }

    onNextClick = () => {
        this.props.getNextAd();
    };

    render() {
        return (
            <div className="Menu">
                <Column md="4" xs="12" className="Menu__column--left">
                    <Row className="Menu__row">
                        <MenuBox
                            icon='📤'
                            text='Start med neste stillingsannonse'
                            href=''
                            onClick={this.onNextClick}
                        />
                    </Row>
                    <Row className="Menu__row">
                        <MenuBox
                            icon='📝'
                            text='Lag ny stillingsannonse'
                            href='www.nav.no'
                        />
                    </Row>
                </Column>
                <Column md="4" xs="12" className="Menu__column--right">
                    <Row className="Menu__row">
                        <MenuSearch />
                    </Row>
                    <Row className="Menu__row">
                        <MenuStatistics />
                    </Row>
                </Column>
            </div>
        );
    }
}

Menu.propTypes = {
    history: PropTypes.shape().isRequired,
    getNextAd: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    adUuid: state.ad.data ? state.ad.data.uuid : undefined
});

const mapDispatchToProps = (dispatch) => ({
    getNextAd: () => dispatch({ type: FETCH_NEXT_AD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
