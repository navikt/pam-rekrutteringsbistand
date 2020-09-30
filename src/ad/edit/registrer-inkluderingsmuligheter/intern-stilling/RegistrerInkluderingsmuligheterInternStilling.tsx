import React, { ChangeEvent, Fragment, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

import { CHECK_TAG, UNCHECK_TAG } from '../../../adDataReducer';
import isJson from '../../practicalInformation/IsJson';
import { hentKategorierMedNavn } from '../../../tagHelpers';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './RegistrerInkluderingsmuligheterInternStilling.less';
import { erDirektemeldtStilling } from '../../../adUtils';

type Props = {
    tags?: string;
    checkTag: (tag: string) => void;
    uncheckTag: (tag: string) => void;
    source: string;
};

const RegistrerInkluderingsmuligheterInternStilling: FunctionComponent<Props> = ({
    tags,
    checkTag,
    uncheckTag,
    source,
}) => {
    const onTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.checked ? checkTag(e.target.value) : uncheckTag(e.target.value);
    };

    const tagIsChecked = (tag: string) => tags && isJson(tags) && JSON.parse(tags).includes(tag);
    const kategorierMedNavn = hentKategorierMedNavn(erDirektemeldtStilling(source));

    return (
        <Ekspanderbartpanel
            border
            apen
            className="registrer-inkluderingsmuligheter-intern-stilling blokk-s"
            tittel={
                <>
                    <Undertittel className="blokk-xxxs">Muligheter for å inkludere</Undertittel>
                    <Normaltekst>
                        Arbeidsgiver er åpen for å inkludere personer som har behov for
                        tilrettelegging og/eller har nedsatt funksjonsevne.
                    </Normaltekst>
                </>
            }
        >
            <SkjemaGruppe>
                {kategorierMedNavn.map(({ tag, navn, harUnderkategorier, underkategorier }) => (
                    <Fragment key={tag}>
                        <Checkbox
                            id={`tag-${tag.toLowerCase()}-checkbox`}
                            label={navn}
                            value={tag}
                            checked={tagIsChecked(tag)}
                            onChange={onTagChange}
                        />
                        {harUnderkategorier && tagIsChecked(tag) && (
                            <SkjemaGruppe className="registrer-inkluderingsmuligheter-intern-stilling__subtags">
                                {(underkategorier || []).map(({ tag, navn }) => (
                                    <Checkbox
                                        id={`tag.${tag}-checkbox`}
                                        label={navn}
                                        value={tag}
                                        key={tag}
                                        checked={tagIsChecked(tag)}
                                        onChange={onTagChange}
                                    />
                                ))}
                            </SkjemaGruppe>
                        )}
                    </Fragment>
                ))}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

const mapStateToProps = (state) => ({
    tags: state.adData.properties.tags || '[]',
    source: state.adData.source,
});

const mapDispatchToProps = (dispatch) => ({
    checkTag: (value: string) => dispatch({ type: CHECK_TAG, value }),
    uncheckTag: (value: string) => dispatch({ type: UNCHECK_TAG, value }),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrerInkluderingsmuligheterInternStilling);