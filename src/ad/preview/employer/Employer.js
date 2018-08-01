import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import ReactHtmlParser from 'react-html-parser';
import markWords from '../markWords';
import './Employer.less';


export default function EmployerDetails({ properties }) {
    return (
        <div className="detail-section">
            <Element className="detail-section__head">Om arbeidsgiver</Element>
            <dl className="dl-flex typo-normal">
                {properties.employer && [
                    <dt key="dt">Arbeidsgiver:</dt>,
                    <dd key="dd">{properties.employer}</dd>
                ]}
            </dl>
            {properties.employerdescription && (
                <div className="EmployerDetails__description">{ ReactHtmlParser(markWords(properties.employerdescription)) }</div>
            )}
        </div>
    );
}

EmployerDetails.propTypes = {
    properties: PropTypes.shape({
        employer: PropTypes.string,
        address: PropTypes.string,
        employerdescription: PropTypes.string
    }).isRequired
};

