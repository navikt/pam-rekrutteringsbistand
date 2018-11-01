import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alertstripe from 'nav-frontend-alertstriper';
import AdStatusEnum from './AdStatusEnum';
import './AdStatus.less';
import PrivacyStatusEnum from '../publishing/PrivacyStatusEnum';
import { formatISOString } from '../../../utils';

function AdStatus({ adStatus, originalData }) {
    return (
        <div className="AdStatusPreview">
            {adStatus === AdStatusEnum.INACTIVE && (
                <Alertstripe className="AdStatusPreview__Alertstripe" type="info" solid>
                    Stillingen er ikke publisert
                </Alertstripe>
            )}
            {adStatus === AdStatusEnum.ACTIVE && originalData.privacy === PrivacyStatusEnum.INTERNAL_NOT_SHOWN && (
                <Alertstripe className="AdStatusPreview__Alertstripe" type="suksess" solid>
                    Stillingen er publisert internt i NAV
                    {originalData.published ? ` | ${formatISOString(originalData.published)}` : ''}
                </Alertstripe>
            )}
            {adStatus === AdStatusEnum.ACTIVE && originalData.privacy === PrivacyStatusEnum.SHOW_ALL && (
                <Alertstripe className="AdStatusPreview__Alertstripe" type="suksess" solid>
                    Stillingen er publisert på arbeidsplassen.no
                    {originalData.published ? ` | ${formatISOString(originalData.published)}` : ''}
                </Alertstripe>
            )}
            {adStatus === AdStatusEnum.STOPPED && (
                <Alertstripe className="AdStatusPreview__Alertstripe" type="advarsel" solid>
                    Stillingen er stoppet
                </Alertstripe>
            )}
        </div>
    );
}

AdStatus.defaultProps = {
    originalData: undefined,
    adminStatus: undefined,
    published: undefined
};

AdStatus.propTypes = {
    adStatus: PropTypes.string.isRequired,
    originalData: PropTypes.shape({
        privacy: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    adStatus: state.adData.status,
    originalData: state.ad.originalData
});

export default connect(mapStateToProps)(AdStatus);
