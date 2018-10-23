import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import AdStatusEnum from './AdStatusEnum';
import {
    PUBLISH_AD,
    SAVE_AD,
    PUBLISH_AD_CHANGES,
    SHOW_STOP_AD_MODAL,
    SHOW_HAS_CHANGES_MODAL,
    SHOW_AD_PUBLISHED_MODAL
} from '../../adReducer';
import PublishErrorModal from './PublishErrorModal';
import LinkButton from '../../../common/linkbutton/LinkButton';
import './AdStatusEdit.less';
import HasChangesModal from './HasChangesModal';
import StopAdModal from './StopAdModal';
import AdPublishedModal from './AdPublishedModal';

class AdStatusEdit extends React.Component {
    onPublishClick = () => {
        this.props.showAdPublishedModal();
        this.props.publish();
    };

    onPublishAdChangesClick = () => {
        this.props.publishAdChanges();
    };

    onCancelClick = () => {
        this.props.showHasChangesModal();
    };

    onStopClick = () => {
        this.props.stop();
    };

    onSaveAdClick = () => {
        this.props.saveAd();
    };

    render() {
        const {
            adStatus, hasChanges, hasSavedChanges
        } = this.props;
        return (
            <div className="AdStatusEdit">
                <PublishErrorModal />
                <HasChangesModal />
                <StopAdModal />
                <AdPublishedModal />
                <div>
                    {adStatus === AdStatusEnum.INACTIVE && (
                        <div className="AdStatusEdit__buttons">
                            <Hovedknapp className="AdStatusEdit__buttons__button" onClick={this.onPublishClick}>
                                Publisér
                            </Hovedknapp>
                            <Knapp className="AdStatusEdit__buttons__button" onClick={this.onCancelClick}>
                                Avbryt
                            </Knapp>
                        </div>
                    )}
                    {!hasChanges && adStatus === AdStatusEnum.ACTIVE && (
                        <div className="AdStatusEdit__buttons">
                            <Hovedknapp className="AdStatusEdit__buttons__button" onClick={this.onStopClick}>
                                Stopp annonsen
                            </Hovedknapp>
                        </div>
                    )}
                    {hasChanges && adStatus === AdStatusEnum.ACTIVE && (
                        <div className="AdStatusEdit__buttons">
                            <Hovedknapp className="AdStatusEdit__buttons__button" onClick={this.onPublishAdChangesClick}>
                                Publisér endringer
                            </Hovedknapp>
                            <Knapp className="AdStatusEdit__buttons__button" onClick={this.onCancelClick}>
                                Avbryt
                            </Knapp>
                        </div>
                    )}
                    {adStatus === AdStatusEnum.STOPPED && (
                        <div className="AdStatusEdit__buttons">
                            <Hovedknapp className="AdStatusEdit__buttons__button" onClick={this.onPublishClick}>
                                Re-publisér stilling
                            </Hovedknapp>
                        </div>
                    )}
                    <div className="AdStatusEdit__links">
                        {adStatus !== AdStatusEnum.ACTIVE && (
                            <LinkButton onClick={this.onSaveAdClick}>
                                    Lagre og forsett senere
                            </LinkButton>
                        )
                        }
                        {adStatus !== AdStatusEnum.ACTIVE
                            && !hasChanges && hasSavedChanges && (
                            <Normaltekst tag="span">
                                Annonsen er lagret
                            </Normaltekst>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

AdStatusEdit.propTypes = {
    isSavingAd: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    hasSavedChanges: PropTypes.bool.isRequired,
    adStatus: PropTypes.string.isRequired,
    publish: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    saveAd: PropTypes.func.isRequired,
    showHasChangesModal: PropTypes.func.isRequired,
    publishAdChanges: PropTypes.func.isRequired,
    showAdPublishedModal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    adStatus: state.adData.status,
    isSavingAd: state.ad.isSavingAd,
    hasChanges: state.ad.hasChanges,
    hasSavedChanges: state.ad.hasSavedChanges
});

const mapDispatchToProps = (dispatch) => ({
    publish: () => dispatch({ type: PUBLISH_AD }),
    stop: () => dispatch({ type: SHOW_STOP_AD_MODAL }),
    saveAd: () => dispatch({ type: SAVE_AD }),
    showHasChangesModal: () => dispatch({ type: SHOW_HAS_CHANGES_MODAL }),
    publishAdChanges: () => dispatch({ type: PUBLISH_AD_CHANGES }),
    showAdPublishedModal: () => dispatch({ type: SHOW_AD_PUBLISHED_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(AdStatusEdit);
