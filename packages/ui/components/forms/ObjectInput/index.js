import React from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import themed from '../../../theming/themed'
import './index.styl'

function ObjectInput ({
  style,
  inputStyle,
  $value,
  errors,
  properties,
  order,
  _renderWrapper
}) {
  if (!$value || !properties) {
    return null
  }

  const value = $value.get()

  order = getOrder(order, properties)

  function getInputs () {
    return order.map((key, index) => {
      const { dependsOn, dependsValue, ...inputProps } = properties[key] || {}

      if (resolvesDeps(value, dependsOn, dependsValue)) {
        return {
          ...inputProps,
          key,
          $value: $value.at(key)
        }
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  if (inputs.length === 0) return null

  if (!_renderWrapper) {
    _renderWrapper = (style, children) => {
      return pug`
        Div(style=style)= children
      `
    }
  }

  // INFO: we use require because the Input component is undefined
  // in circular imports https://stackoverflow.com/a/30390378
  const Input = require('../Input').default

  function renderItem ({ item, index }) {
    return pug`
      Input.input(
        ...item
        styleName={ pushTop: index !== 0 }
        error=errors[item.key]
      )
    `
  }

  return _renderWrapper({ style: [style, inputStyle] }, pug`
    FlatList(
      data=inputs
      renderItem=renderItem
      keyExtractor=item => item.key
    )
  `)
}

ObjectInput.defaultProps = {
  errors: {}
}

ObjectInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  $value: PropTypes.any.isRequired,
  errors: PropTypes.object,
  order: PropTypes.array,
  properties: PropTypes.object.isRequired
}

export default observer(
  themed('ObjectInput', ObjectInput),
  { forwardRef: true }
)

function getOrder (order, properties) {
  return order != null ? order : Object.keys(properties)
}

function resolvesDeps (value = {}, dependsOn, dependsValue) {
  return (
    // always show if dependsOn field doesn't exist
    !dependsOn ||
    // dependsValue is value
    (dependsValue != null && value[dependsOn] === dependsValue) ||
    // dependsValue is array
    (dependsValue != null && Array.isArray(dependsValue) &&
      dependsValue.indexOf(value[dependsOn]) !== -1
    ) ||
    // dependsValue is not present, check that value[dependsOn] has something
    (
      (dependsValue == null || (typeof dependsValue === 'string' && dependsValue.trim() === '')) &&
      value[dependsOn] != null &&
      !(typeof value[dependsOn] === 'string' && value[dependsOn].trim() === '')
    )
  )
}
