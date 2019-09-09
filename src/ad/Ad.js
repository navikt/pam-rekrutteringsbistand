import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import Faded from '../common/faded/Faded';
import DelayedSpinner from '../common/DelayedSpinner';
import { REMOVE_AD_DATA } from './adDataReducer';
import { CREATE_AD, FETCH_AD, PREVIEW_EDIT_AD } from './adReducer';
import { Column, Row } from 'nav-frontend-grid';
import Edit from './edit/Edit';
import Error from './error/Error';
import Preview from './preview/Preview';
import Administration from './administration/Administration';
import AdministrationPreview from './preview/administration/AdministrationPreview';
import SavedAdAlertStripe from './alertstripe/SavedAdAlertStripe';
import PreviewHeader from './preview/header/PreviewHeader';
import EditHeader from './edit/header/EditHeader';
import AdStatusEnum from '../common/enums/AdStatusEnum';
import LeggTilKandidatAlertStripe from './kandidatModal/LeggTilKandidatAlertStripe';
import HasChangesModal from './navigation/HasChangesModal';
import './Ad.less';

class Ad extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.match.params.uuid) {
            this.uuid = this.props.match.params.uuid;
            const edit = this.props.location.state && this.props.location.state.openInEditMode;
            this.props.getStilling(this.uuid, edit);
        } else {
            this.props.createAd();
        }
    }

    componentDidUpdate() {
        if (!this.uuid && this.props.stilling && this.props.stilling.uuid) {
            // Skjer når man kommer rett til /stilling uten uuid
            this.uuid = this.props.stilling.uuid;
            this.props.history.replace({
                pathname: `/stilling/${this.uuid}`,
                state: this.props.location.state
            });
        }
    }

    componentWillUnmount() {
        this.props.removeAdData();
    }

    onPreviewAdClick = () => {
        this.props.previewAd();
    };

    render() {
        const { stilling, isEditingAd, isLoadingAd, leavePageTrigger, hasChangesLeaveUrl } = this.props;
        const { isNew } = this.props.location.state || { isNew: false };

        if (leavePageTrigger) {
            window.location.pathname = hasChangesLeaveUrl;
        }

        if (leavePageTrigger || isLoadingAd || !stilling) {
            return (
                <div className="Ad Ad__spinner">
                    <DelayedSpinner />
                </div>
            );
        }

        if (stilling.status === AdStatusEnum.DELETED) {
            return (
                <div className="Ad Ad__deleted">
                    <Normaltekst className="blokk-s">Stillingen er slettet</Normaltekst>
                    <Link
                        to="/stillinger"
                        className="typo-normal lenke"
                    >
                        Søk etter stillinger
                    </Link>
                </div>
            );
        }

        return (
            <div className="Ad">
                <HasChangesModal />
                <LeggTilKandidatAlertStripe />
                <SavedAdAlertStripe />
                <Faded>
                    <div className="Ad__flex">
                        <h1 className="visually-hidden">Stilling</h1>
                        <div className="Ad__flex__center">
                            <div className="Ad__flex__center__inner">
                                <div>
                                    {isEditingAd ? (
                                        <div className="Ad__edit__inner">
                                            <EditHeader
                                                isNew={isNew}
                                                onPreviewAdClick={this.onPreviewAdClick}
                                            />
                                            <Edit isNew={isNew}/>
                                        </div>
                                    ) : (                  
                                    <div className="Ad__preview">
                                        <PreviewHeader />
                                        <Preview ad={stilling} />
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isEditingAd ? (
                            <div className="Ad__flex__right">
                                <div className="Ad__flex__right__inner">
                                    <Administration />
                                </div>
                            </div>
                        ) : (
                            <div className="Ad__flex__right">
                            <div className="Ad__flex__right__inner">
                                <AdministrationPreview />
                            </div>
                        </div> 
                        )}
                    </div>
                </Faded>
                <Error />
            </div>
        );
    }
}


Ad.defaultProps = {
    stilling: undefined,
    isLoadingAd: false,
    leavePageTrigger: false,
    hasChangesLeaveUrl: '/mineStillinger'
};

Ad.propTypes = {
    stilling: PropTypes.shape({
        title: PropTypes.string,
        uuid: PropTypes.string,
        source: PropTypes.string,
        status: PropTypes.string
    }),
    getStilling: PropTypes.func.isRequired,
    createAd: PropTypes.func.isRequired,
    previewAd: PropTypes.func.isRequired,
    isEditingAd: PropTypes.bool.isRequired,
    removeAdData: PropTypes.func.isRequired,
    isLoadingAd: PropTypes.bool,
    leavePageTrigger: PropTypes.bool,
    hasChangesLeaveUrl: PropTypes.string
};

const mapStateToProps = (state) => ({
    stilling: state.adData,
    isEditingAd: state.ad.isEditingAd,
    isLoadingAd: state.ad.isLoadingAd,
    leavePageTrigger: state.ad.leavePageTrigger,
    hasChangesLeaveUrl: state.ad.hasChangesLeaveUrl
});

const mapDispatchToProps = (dispatch) => ({
    getStilling: (uuid, edit) => dispatch({ type: FETCH_AD, uuid, edit }),
    createAd: () => dispatch({ type: CREATE_AD }),
    previewAd: () => dispatch({ type: PREVIEW_EDIT_AD }),
    removeAdData: () => dispatch({ type: REMOVE_AD_DATA })
});


export default connect(mapStateToProps, mapDispatchToProps)(Ad);
