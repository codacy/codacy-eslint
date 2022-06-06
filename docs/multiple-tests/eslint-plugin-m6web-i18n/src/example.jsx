import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import { options } from './config/options';
export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: options[0],
        };
    }
    changeLang = (lang) => {
        const { i18n } = this.props;
        const { value } = lang;
        this.setState({ lang });
        i18n.changeLanguage(value);
    };
    render() {
        const { lang } = this.state;
        const { t } = this.props;
        return (
            <div className="App-Root">
                <Select
                    defaultValue={options[0]}
                    options={options}
                    value={lang}
                    onChange={this.changeLang}
                    className="App-Select"
                />
                <h3 className="text-center pt-5">
                    {t('Welcome to React Translation')}
                </h3>
            </div>
        );
    }
}
export default withTranslation()(App);
