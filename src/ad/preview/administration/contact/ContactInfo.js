import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { MARKER_SOM_MIN, SAVE_AD } from '../../../adReducer';
import './ContactInfo.less';
import { SET_NAV_IDENT, SET_REPORTEE } from '../../../adDataReducer';
import { erDirektemeldtStilling } from '../../../adUtils';
import MarkerSomMinModal from '../markerSomMinModal/MarkerSomMinModal';

class ContactInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalMarkerSomMinStillingErÅpen: false,
        };
    }

    onMarkerSomMinKlikkEksternStilling = () => {
        this.props.markerSomMin();
        this.setState({ markerSomMinStillingModalErÅpen: false });
    };

    onMarkerSomMinKlikkInternStilling = () => {
        const { setReportee, setNavIdent, saveAd, innlogget } = this.props;
        setReportee(innlogget.displayName);
        setNavIdent(innlogget.navIdent);
        saveAd();
        this.setState({ markerSomMinStillingModalErÅpen: false });
    };

    kanMarkereStillingSomMin = () => {
        if (isDir) {
            return innlogget && innlogget.navIdent !== stilling.administration.navIdent;
        } else {
            return (
                !stillingsinfo.eierNavident ||
                (innlogget && stillingsinfo.eierNavident !== innlogget.navIdent)
            );
        }
    };

    render() {
        const { stilling, stillingsinfo } = this.props;
        const isDir = stilling && erDirektemeldtStilling(stilling.source);
        const { reportee, navIdent } = stilling.administration;

        const skalViseStillingsinfo = isDir || stillingsinfo;

        if (!skalViseStillingsinfo) {
            return null;
        }

        return (
            <div className="ContactInfo__preview">
                <Element>Spørsmål om stillingen?</Element>

                {isDir ? (
                    <Normaltekst>
                        Kontaktperson hos NAV: {reportee} {navIdent ? ` (${navIdent})` : ''}
                    </Normaltekst>
                ) : (
                    <Normaltekst>
                        Kontaktperson hos NAV: {stillingsinfo.eierNavn}{' '}
                        {stillingsinfo.eierNavident ? ` (${stillingsinfo.eierNavident})` : ''}
                    </Normaltekst>
                )}

                {this.kanMarkereStillingSomMin && (
                    <>
                        <Knapp
                            className="button-marker_som_min"
                            onClick={() => this.setState({ markerSomMinStillingModalErÅpen: true })}
                            mini
                        >
                            Marker som min
                        </Knapp>

                        <MarkerSomMinModal
                            erÅpen={this.state.markerSomMinStillingModalErÅpen}
                            onAvbryt={() =>
                                this.setState({ markerSomMinStillingModalErÅpen: false })
                            }
                            onMarkerSomMin={
                                isDir
                                    ? this.onMarkerSomMinKlikkInternStilling
                                    : this.onMarkerSomMinKlikkEksternStilling
                            }
                        />
                    </>
                )}
            </div>
        );
    }
}

ContactInfo.defaultProps = {
    stilling: undefined,
    stillingsinfo: undefined,
};

ContactInfo.propTypes = {
    stilling: PropTypes.shape({
        source: PropTypes.string,
        administration: PropTypes.shape({
            reportee: PropTypes.string,
            navIdent: PropTypes.string,
        }),
    }),
    stillingsinfo: PropTypes.shape({
        stillingsid: PropTypes.string,
        eierNavident: PropTypes.string,
        eierNavn: PropTypes.string,
    }),
};

const mapStateToProps = (state) => ({
    stilling: state.adData,
    stillingsinfo: state.stillingsinfoData,
    innlogget: state.reportee.data,
});

const mapDispatchToProps = (dispatch) => ({
    markerSomMin: () => dispatch({ type: MARKER_SOM_MIN }),
    setReportee: (reportee) => dispatch({ type: SET_REPORTEE, reportee }),
    setNavIdent: (navIdent) => dispatch({ type: SET_NAV_IDENT, navIdent }),
    saveAd: () => dispatch({ type: SAVE_AD }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfo);
