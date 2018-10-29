import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Undertittel } from 'nav-frontend-typografi';
import './Employer.less';
import { htmlParserOptions } from '../markWords';
import { isValidUrl } from '../../../common/utils';

export default function Employer({ properties }) {
    return (
        <div className="detail-section">
            <Undertittel className="detail-section__head">Om bedriften</Undertittel>
            <dl className="dl-flex typo-normal">
                {properties.employer && [
                    <dt key="dt">Bedriftens navn:</dt>,
                    <dd key="dd">{properties.employer}</dd>
                ]}
                {properties.employerhomepage && isValidUrl(properties.employerhomepage) && [
                    <dt key="dt">Nettsted:</dt>,
                    <a
                        className="lenke"
                        href={properties.employerhomepage}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {properties.employerhomepage}
                    </a>
                ]}
                {properties.employerhomepage && !isValidUrl(properties.employerhomepage) && [
                    <dt key="dt">Nettsted:</dt>,
                    <dd key="dd">{properties.employerhomepage}</dd>
                ]}
                {properties.linkedinpage && isValidUrl(properties.linkedinpage) && [
                    <dt key="dt">LinkedIn:</dt>,
                    <a
                        className="lenke"
                        href={properties.linkedinpage}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {properties.linkedinpage}
                    </a>
                ]}
                {properties.linkedinpage && !isValidUrl(properties.linkedinpage) && [
                    <dt key="dt">LinkedIn:</dt>,
                    <dd key="dd">{properties.linkedinpage}</dd>
                ]}
                {properties.twitteraddress && isValidUrl(properties.twitteraddress) && [
                    <dt key="dt">Twitter:</dt>,
                    <a
                        className="lenke"
                        href={properties.twitteraddress}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {properties.twitteraddress}
                    </a>
                ]}
                {properties.twitteraddress && !isValidUrl(properties.twitteraddress) && [
                    <dt key="dt">Twitter:</dt>,
                    <dd key="dd">{properties.twitteraddress}</dd>
                ]}
                {properties.facebookpage && isValidUrl(properties.facebookpage) && [
                    <dt key="dt">Facebook:</dt>,
                    <a
                        className="lenke"
                        href={properties.facebookpage}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {properties.facebookpage}
                    </a>
                ]}
                {properties.facebookpage && !isValidUrl(properties.facebookpage) && [
                    <dt key="dt">Facebook:</dt>,
                    <dd key="dd">{properties.facebookpage}</dd>
                ]}
            </dl>
            <div>
                {properties.employerdescription && (
                    <div className="EmployerDetails__description">
                        { ReactHtmlParser(properties.employerdescription, htmlParserOptions) }
                    </div>
                )}
            </div>
        </div>
    );
}
