import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';
import { Container } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Sidetittel } from 'nav-frontend-typografi';
import Sorting  from './statusFilter/StatusFilter';
import Loading from '../common/loading/Loading';
import ListHeader from './list/ListHeader';
import ListItem from './list/ListItem';
import NoResults from '../searchPage/noResults/NoResults';
import Pagination from './pagination/Pagination';
import Count from './list/Count';
import { FETCH_MY_ADS } from './myAdsReducer';
import { CREATE_AD } from '../ad/adReducer';
import './MyAds.less'

class MyAds extends React.Component {
    componentDidMount() {
        this.props.getAds();
    }

    onCreateAd = () => {
        this.props.history.push(`/ads`);
    };

    render() {
        const {
            ads, isSearching, error, createAd
        } = this.props;
        const adsFound = !isSearching && ads && ads.length > 0;
        return (
            <div className="MyAds">
                <div className="MyAds__header">
                    <Container className="MyAds__header-container">
                        <div className="MyAds__header__item">
                            <div className="no-content" />
                        </div>
                        <div className="MyAds__header__item">
                            <Sidetittel> Mine stillinger </Sidetittel>
                        </div>
                        <div className="MyAds__header__item MyAds__header-button">
                            <Hovedknapp
                                onClick={this.onCreateAd}
                            >
                                Opprett ny
                            </Hovedknapp>
                        </div>
                    </Container>
                </div>
                <Container className="MyAds__content">
                    {(error && error.statusCode !== 412) && (
                        <AlertStripe className="SearchPage__alertStripe" type="advarsel" solid>
                            Det oppsto en feil. Forsøk å laste siden på nytt
                        </AlertStripe>
                    )}
                    <div className="">
                        <div className="">
                            <div className="">
                                <div className="MyAds__status-row blokk-s">
                                    <Count />
                                    <Sorting />
                                </div>
                                <ListHeader />
                                {isSearching && (
                                    <Loading />
                                )}
                                {!isSearching && ads && ads.length === 0 && (
                                    <NoResults />
                                )}
                                {adsFound && ads.map((ad) => (
                                    <ListItem key={ad.uuid} ad={ad} />
                                ))}
                                {adsFound && (
                                    <Pagination />
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

MyAds.defaultProps = {
    error: undefined
};

MyAds.propTypes = {
    ads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isSearching: PropTypes.bool.isRequired,
    getAds: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    error: PropTypes.shape({
        statusCode: PropTypes.number
    }),
    createAd: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    ads: state.myAds.items,
    isSearching: state.myAds.isSearching,
    error: state.myAds.error,

});

const mapDispatchToProps = (dispatch) => ({
    getAds: () => dispatch({ type: FETCH_MY_ADS }),
    resetSearch: () => dispatch({ type: RESET_SEARCH }),
    createAd: () => dispatch({ type: CREATE_AD })
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAds);
