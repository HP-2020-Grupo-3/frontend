import React from 'react';


class ComboBox extends React.Component {

  constructor(props) {
    super(props);
  }

renderComboBox(id, currentItem, availableItems, editable, displayProperty = "nombre") {
  return (
  <Form.Control as="Select" type="text" 
    id={id}
    disabled={!editable}
    onChange={this.handleChange}>
  <option key={currentItem.id} value={currentItem.id}>{currentItem.nombre}</option>
  {
    availableItems ?
      availableItems.filter(r => r.id !== currentItem.id).map( (availableItem) => {
        return (<option key={availableItem.id} value={availableItem.id}>{availableItem[displayProperty]}</option>)
      })
    : (<option value="-1">Sin datos</option>)
  }
  </Form.Control>
  )
}

};

export default ComboBox;