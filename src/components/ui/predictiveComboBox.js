import React from 'react';
import Autosuggest from 'react-autosuggest';

class PredictiveComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

    this.state = {
      value: props.value ? props.value : '',
      suggestions: [],
      selectionHappend: false
    };
    this.baseState = this.state;
  }

  static defaultProps = {
    displayProperty: "nombre",
    value: ''
  }

  getSuggestions(value) {

    const {availableItems, displayProperty} = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputValue === '') {
      return [];
    }
    
    return inputLength === 0 ? [] : availableItems.filter(item => item[displayProperty].toLowerCase().includes(inputValue))
  }

  getSuggestionValue(suggestion) {
    const { displayProperty } = this.props

    return suggestion[displayProperty];
  }
  
  renderSuggestion(suggestion) {
    const { displayProperty } = this.props
    return (
      <div>
        {suggestion[displayProperty]}
      </div>
    )
  }
  
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, this.props.availableItems)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    var fakeEvent = {
      target: {
        id: this.props.id,
        value: JSON.stringify(suggestion)
      }
    };

    this.props.onChange(fakeEvent);
    this.setState({
      selectionHappend: true
    });
  };

  render() {
    const { value, suggestions, selectionHappend } = this.state;

    const inputProps = {
      placeholder: '',
      value,
      onChange: this.onChange
    };

    if (selectionHappend && (this.props.value === null || this.props.value === '')) {
      this.setState({
        selectionHappend: false,
        value: ''
      });
    }

    const theme = {
      container:                'autosuggest dropdown',
      containerOpen:            'dropdown open',
      input:                    'form-control',
      inputOpen:                'form-control',
      inputFocused:             'form-control',
      suggestionsContainer:     'dropdown-menu',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList:          'react-autosuggest__suggestions-list',
      suggestion:               'react-autosuggest__suggestion',
      suggestionFirst:          'react-autosuggest__suggestion--first',
      suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
      sectionContainer:         'react-autosuggest__section-container',
      sectionContainerFirst:    'react-autosuggest__section-container--first',
      sectionTitle:             'react-autosuggest__section-title'
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
        theme={theme}
      />
    );
  }
}

export default PredictiveComboBox