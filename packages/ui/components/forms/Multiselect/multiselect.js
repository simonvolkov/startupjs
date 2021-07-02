import React from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Drawer from './../../popups/Drawer'
import MultiselectInput from './input'
import styles from './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  description,
  layout,
  focused,
  disabled,
  tagLimit,
  InputComponent,
  TagComponent,
  renderListItem,
  onSelect,
  onRemove,
  onOpen,
  onHide
}) => {
  return pug`
    MultiselectInput(
      label=label
      description=description
      layout=layout
      onOpen=onOpen
      focused=focused
      value=value
      placeholder=placeholder
      tagLimit=tagLimit
      options=options
      disabled=disabled
      InputComponent=InputComponent
      TagComponent=TagComponent
    )
    Drawer.nativeListContent(
      visible=focused
      position='bottom'
      onDismiss=onHide
      styleSwipe=styles.swipeZone
    )
      ScrollView.suggestions-native
        each opt in options
          = renderListItem(opt)

  `
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  tagLimit: PropTypes.number,
  disabled: PropTypes.bool,
  InputComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func
}

export default observer(Multiselect)
