import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FETCH_NEXT_AD, SAVE_AD } from '../../adReducer';
import { SET_ADMIN_STATUS } from '../../adDataReducer';
import AdminStatusEnum from './AdminStatusEnum';
import {
    registerShortcuts,
    removeShortcuts
} from '../../../common/shortcuts/Shortcuts';
import AdNotSavedPopup from '../AdNotSavedPopup';
import AdContainsErrorPopup from '../AdContainsErrorPopup';
import AdStatusEnum from '../adStatus/AdStatusEnum';

const validationError = (validation) => validation.styrk !== undefined ||
    validation.location !== undefined || validation.employer !== undefined;

class AdminStatusEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
    }

    componentDidMount() {
        registerShortcuts('administrationStatus', {
            'x x': () => {
                if (this.props.adminStatus === AdminStatusEnum.PENDING) {
                    this.onSetToDoneClick();
                }
            }
        });
    }

    componentWillUnmount() {
        removeShortcuts('administrationStatus');
    }

    onSetToPendingClick = () => {
        this.props.setAdminStatus(AdminStatusEnum.PENDING);
        this.props.saveAd();
        this.onCloseModal();
    };

    onSetToDoneClick = () => {
        if (this.props.adStatus === AdStatusEnum.ACTIVE && validationError(this.props.validation)) {
            this.setState({
                isModalOpen: true
            });
        } else {
            this.props.setAdminStatus(AdminStatusEnum.DONE);
            this.props.saveAd();
        }
    };

    onCloseModal = () => {
        this.setState({
            isModalOpen: false
        });
    };

    onSaveAdClick = () => {
        if (this.props.adStatus === AdStatusEnum.ACTIVE) {
            if (!validationError(this.props.validation)) {
                this.props.setAdminStatus(AdminStatusEnum.DONE);
                this.onCloseModal();
            }
        } else {
            this.props.setAdminStatus(AdminStatusEnum.DONE);
            this.onCloseModal();
        }
        this.props.saveAd();
    };

    onDiscardClick = () => {
        this.props.discardAdChanges();
        if (this.props.adStatus === AdStatusEnum.ACTIVE) {
            if (!validationError(this.props.validation)) {
                this.props.setAdminStatus(AdminStatusEnum.DONE);
                this.onCloseModal();
            }
        } else {
            this.props.setAdminStatus(AdminStatusEnum.DONE);
            this.onCloseModal();
        }
    };

    render() {
        const { adminStatus, isEditingAd, validation } = this.props;

        return (
            <div className="AdminStatusEdit">
                {adminStatus === AdminStatusEnum.RECEIVED && (
                    <div>
                        <Hovedknapp className="AdminStatusEdit__button" onClick={this.onSetToPendingClick}>
                            Start
                        </Hovedknapp>
                    </div>
                )}
                {adminStatus === AdminStatusEnum.PENDING && (
                    <div>
                        <Hovedknapp
                            className="AdminStatusEdit__button"
                            onClick={this.onSetToDoneClick}
                        >
                            Lagre
                        </Hovedknapp>
                    </div>
                )}
                {adminStatus === AdminStatusEnum.DONE && (
                    <div>
                        <Hovedknapp className="AdminStatusEdit__button" onClick={this.onSetToPendingClick}>
                            Gjennåpne
                        </Hovedknapp>

                    </div>
                )}
                <AdContainsErrorPopup
                    isOpen={this.state.isModalOpen && !isEditingAd}
                    onClose={this.onCloseModal}
                    validation={validation}
                />
            </div>
        );
    }
}

AdminStatusEdit.propTypes = {
    adminStatus: PropTypes.string.isRequired,
    adStatus: PropTypes.string.isRequired,
    setAdminStatus: PropTypes.func.isRequired,
    isEditingAd: PropTypes.bool.isRequired,
    getNextAd: PropTypes.func.isRequired,
    saveAd: PropTypes.func.isRequired,
    validation: PropTypes.shape({
        employer: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    adminStatus: state.adData.administration.status,
    adStatus: state.adData.status,
    isEditingAd: state.ad.isEditingAd,
    validation: state.adValidation.errors
});

const mapDispatchToProps = (dispatch) => ({
    setAdminStatus: (status) => dispatch({ type: SET_ADMIN_STATUS, status }),
    getNextAd: () => dispatch({ type: FETCH_NEXT_AD }),
    saveAd: () => dispatch({ type: SAVE_AD })
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminStatusEdit);
