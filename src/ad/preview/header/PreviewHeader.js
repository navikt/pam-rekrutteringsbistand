import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { EDIT_AD, LEGG_TIL_I_MINE_STILLINGER } from '../../adReducer';
import { CLOSE_TRANSFERRED_ALERT } from '../../../recruitment/recruitmentReducer';
import AdTitle from './AdTitle';
import CandidateActions from '../../candidateActions/CandidateActions';
import Alertstripe from 'nav-frontend-alertstriper';
import { Lukknapp } from 'nav-frontend-ikonknapper';
import './PreviewHeader.less';
import KopierTekst from '../../kopierTekst/KopierTekst';
import { hentAnnonselenke, stillingErPublisert } from '../../adUtils';

class PreviewMenu extends React.Component {
    onEditAdClick = () => {
        this.props.editAd();
    };

    onPrintClick = () => {
        window.print();
    };

    onLeggTilIMineStillingerClick = () => {
        this.props.leggTilIMineStillinger();
    };

    onCloseAlertstripe = () => {
        this.props.closeAlertstripe();
    };

    componentWillUnmount() {
        this.props.closeAlertstripe();
    }

    render() {
        const {
            stilling,
            limitedAccess,
            rekrutteringData,
            rekruttering: { showAdTransferredAlert, showAdMarkedAlert },
        } = this.props;

        const kanOverfoereStilling =
            rekrutteringData && limitedAccess && !rekrutteringData.eierNavident;

        const stillingsLenke = hentAnnonselenke(stilling.uuid);

        return (
            <div>
                <div className="Ad__actions">
                    <CandidateActions />
                    <div>
                        {!limitedAccess && (
                            <Hovedknapp
                                className="Ad__actions-button"
                                onClick={this.onEditAdClick}
                                mini
                            >
                                Rediger stillingen
                            </Hovedknapp>
                        )}
                        {stillingErPublisert(stilling) && (
                            <KopierTekst
                                className="PreviewHeader__kopier-lenke-knapp"
                                tooltipTekst="Kopier stillingslenke"
                                skalKopieres={stillingsLenke}
                            />
                        )}
                        {kanOverfoereStilling && (
                            <Knapp
                                className="button-legg-i-mine-stillinger"
                                onClick={this.onLeggTilIMineStillingerClick}
                                mini
                            >
                                Opprett kandidatliste
                            </Knapp>
                        )}
                        <Knapp className="button-print" onClick={this.onPrintClick} mini>
                            Skriv ut
                        </Knapp>
                    </div>
                </div>
                {limitedAccess && (
                    <div>
                        {(showAdTransferredAlert || showAdMarkedAlert) && (
                            <div className="Ad__info">
                                <Alertstripe
                                    className="Adtransferred__Alertstripe"
                                    type="suksess"
                                    solid="true"
                                >
                                    <div className="Adtransferred_text">
                                        {(showAdTransferredAlert
                                            ? 'Kandidatlisten er opprettet.'
                                            : 'Kandidatlisten er markert som din.') +
                                            ' Du er nå eier av stillingen og kandidatlisten.'}
                                    </div>
                                    <Lukknapp
                                        className="alertstripe-lukk-knapp"
                                        onClick={this.onCloseAlertstripe}
                                        mini={true}
                                    />
                                </Alertstripe>
                            </div>
                        )}
                        <div className="Ad__info">
                            <Alertstripe
                                className="AdStatusPreview__Alertstripe"
                                type="info"
                                solid="true"
                            >
                                Dette er en eksternt utlyst stilling. Du kan <b>ikke</b> endre
                                stillingen.
                            </Alertstripe>
                        </div>
                    </div>
                )}
                <AdTitle
                    title={stilling.title}
                    employer={stilling.properties.employer}
                    location={stilling.location}
                />
            </div>
        );
    }
}

PreviewMenu.defaultProps = {
    stilling: undefined,
};

PreviewMenu.propTypes = {
    stilling: PropTypes.shape({
        title: PropTypes.string,
        location: PropTypes.shape({
            address: PropTypes.string,
            municipal: PropTypes.string,
            country: PropTypes.string,
        }),
        properties: PropTypes.shape({
            employer: PropTypes.string,
        }),
    }),
    editAd: PropTypes.func.isRequired,
    rekrutteringData: PropTypes.shape({
        stillingsid: PropTypes.string,
        eierNavident: PropTypes.string,
        eierNavn: PropTypes.string,
    }),
    rekruttering: PropTypes.shape({
        showAdTransferredAlert: PropTypes.bool,
        showAdMarkedAlert: PropTypes.bool,
    }),
};

const mapStateToProps = (state) => ({
    rekrutteringData: state.recruitmentData,
    rekruttering: state.recruitment,
    stilling: state.adData,
    limitedAccess: state.adData.createdBy !== 'pam-rekrutteringsbistand',
});

const mapDispatchToProps = (dispatch) => ({
    editAd: () => dispatch({ type: EDIT_AD }),
    leggTilIMineStillinger: () => dispatch({ type: LEGG_TIL_I_MINE_STILLINGER }),
    closeAlertstripe: () => dispatch({ type: CLOSE_TRANSFERRED_ALERT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewMenu);
