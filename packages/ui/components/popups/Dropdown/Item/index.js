import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from '../../../Icon'
import Menu from '../../../Menu'
import Link from '../../../Link'
import './index.styl'

function DropdownItem ({
  to,
  label,
  value,
  icon,
  onPress,
  children,
  _activeValue,
  _selectIndexValue,
  _variant,
  _onChange,
  _onDismissDropdown,
  _index,
  _childenLength
}) {
  const isPure = _variant === 'pure'

  const handlePress = () => {
    if (onPress) {
      onPress()
      _onDismissDropdown()
    } else {
      _onChange(value)
    }
  }

  if (_variant === 'popover' && !isPure) {
    return pug`
      Menu.Item(
        to=to
        active=_activeValue === value
        styleName={ selectMenu: _selectIndexValue === _index }
        onPress=handlePress
        iconPosition='left'
        icon=icon
      )= label
    `
  }

  const Wrapper = to ? Link : TouchableOpacity
  return pug`
    Wrapper(onPress=handlePress to=to)
      View.item(styleName=[!isPure && _variant, {
        active: !isPure && (_activeValue === value),
        itemUp: !isPure && (_index === 0),
        itemDown: !isPure && (_index === _childenLength - 1),
        selectMenu: _selectIndexValue === _index
      }])
        if isPure
          = children
        else
          Text.itemText(styleName=[_variant, { active: _activeValue && _activeValue === value }])
            = label
          if _activeValue === value
            Icon.iconActive(styleName=_variant icon=faCheck)
  `
}

DropdownItem.defaultProps = {}

DropdownItem.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired
}

export default observer(DropdownItem)
