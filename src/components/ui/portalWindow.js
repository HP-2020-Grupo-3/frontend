import React from 'react';
import ReactDOM from 'react-dom';

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if (styleSheet.cssRules) { // true for inline styles
      const newStyleEl = targetDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) { // true for stylesheets loaded from a URL
      const newLinkEl = targetDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

class PortalWindow extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        containerEl: null,
        externalWindow: null
      }
    }
  
    componentDidMount() {

      let externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');
      externalWindow.document.title = 'Comprobante de Pago';
      let containerEl = document.createElement('div');
      externalWindow.document.body.appendChild(containerEl);
      copyStyles(document, externalWindow.document);

      this.setState({
        externalWindow, containerEl
      })
      externalWindow.addEventListener('beforeunload', () => {
        this.props.closeWindowPortal();
      });
      
    }
  
    componentWillUnmount() {
      const { externalWindow } = this.state;
      externalWindow.close();
    }
    
    render() {
      const { containerEl } = this.state;
      
      if (!containerEl) {
        return null;
      } 

      return ReactDOM.createPortal(this.props.children, containerEl);  
    }
  }

export default PortalWindow;