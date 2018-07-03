import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { formatISOString } from '../../../utils';

export default function AdDetails({ stilling }) {
    return (
        <div className="detail-section">
            <Element className="AdDetails__head detail-section__head">Om annonsen</Element>
            <dl className="dl-flex typo-normal">
                {stilling.updated && [
                    <dt key="dt">Sist endret:</dt>,
                    <dd key="dd">{formatISOString(stilling.updated, 'D. MMMM YYYY')}</dd>
                ]}
                {stilling.medium && [
                    <dt key="dt">Hentet fra:</dt>,
                    <dd key="dd">{stilling.medium}</dd>
                ]}
                {stilling.reference && [
                    <dt key="dt">ID nr.:</dt>,
                    <dd key="dd">{stilling.reference}</dd>
                ]}
            </dl>
        </div>
    );
}

AdDetails.propTypes = {
    stilling: PropTypes.shape({
        updated: PropTypes.string,
        medium: PropTypes.string,
        reference: PropTypes.string
    }).isRequired
};

