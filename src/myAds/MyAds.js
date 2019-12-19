import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';
import { Container } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Sidetittel } from 'nav-frontend-typografi';
import Sorting from './statusFilter/StatusFilter';
import Loading from '../common/loading/Loading';
import ResultHeader from './result/ResultHeader';
import ResultItem from './result/ResultItem';
import NoResults from './noResults/NoResults';
import Pagination from './pagination/Pagination';
import StopAdModal from '../ad/administration/adStatus/StopAdModal';
import Count from './result/Count';
import { FETCH_MY_ADS } from './myAdsReducer';
import { CLEAR_COPIED_ADS, CREATE_AD } from '../ad/adReducer';
import { RESET_SEARCH } from '../searchPage/searchReducer';
import './MyAds.less';
import DeleteAdModal from '../ad/administration/adStatus/DeleteAdModal';
import { useEffect } from 'react';

const MyAds = props => {
    const {
        ads,
        getAds,
        clearCopiedAds,
        isSearching,
        resetSearch,
        error,
        reportee,
        history,
    } = props;
    const adsFound = !isSearching && ads && ads.length > 0;

    const onMount = () => {
        resetSearch();
        getAds();
    };

    const onDismount = () => {
        clearCopiedAds();
    };

    useEffect(() => {
        onMount();
        return onDismount;
    }, []);

    const onCreateAd = () => {
        history.push({
            pathname: '/stilling',
            state: { isNew: true },
        });
    };

    return (
        <div className="MyAds">
            <div className="MyAds__header">
                <Container className="MyAds__header-container">
                    <Sidetittel className="MyAds__header__title">Mine stillinger</Sidetittel>
                    <Hovedknapp onClick={onCreateAd} className="MyAds__header__button">
                        Opprett ny
                    </Hovedknapp>
                </Container>
            </div>
            <Container className="MyAds__content">
                <StopAdModal fromMyAds />
                <DeleteAdModal />
                {error && (
                    <AlertStripe className="AlertStripe__fullpage" type="advarsel" solid="true">
                        Det oppsto en feil. Forsøk å laste siden på nytt
                    </AlertStripe>
                )}
                <div className="">
                    <div className="MyAds__status-row blokk-s">
                        <Count />
                        <Sorting />
                    </div>

                    <table className="Result__table">
                        <ResultHeader />
                        <tbody>
                            {adsFound &&
                                ads.map(ad => (
                                    <ResultItem key={ad.uuid} ad={ad} reportee={reportee} />
                                ))}
                        </tbody>
                    </table>

                    {isSearching && <Loading />}
                    {!isSearching && ads && ads.length === 0 && <NoResults />}
                    {adsFound && <Pagination />}
                </div>
            </Container>
        </div>
    );
};

MyAds.defaultProps = {
    error: undefined,
};

MyAds.propTypes = {
    ads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isSearching: PropTypes.bool.isRequired,
    getAds: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    error: PropTypes.shape({
        statusCode: PropTypes.number,
    }),
    clearCopiedAds: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    ads: state.myAds.items,
    reportee: state.reportee.data,
    isSearching: state.myAds.isSearching,
    error: state.myAds.error,
});

const mapDispatchToProps = dispatch => ({
    getAds: () => dispatch({ type: FETCH_MY_ADS }),
    createAd: () => dispatch({ type: CREATE_AD }),
    clearCopiedAds: () => dispatch({ type: CLEAR_COPIED_ADS }),
    resetSearch: () => dispatch({ type: RESET_SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAds);
