import React from 'react'
import { Image } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Link from '../Link'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import './index.styl'

function Item ({
  style,
  children,
  to,
  url,
  icon,
  onPress,
  ...props
}) {
  let Wrapper
  const extraProps = {}

  if (to) {
    Wrapper = Link
    extraProps.to = to
    extraProps.block = true
  } else {
    Wrapper = Div
  }

  let leftPart = null; let contentPart = null; let rightPart = null
  let contentChildren = []

  if (icon) {
    leftPart = pug`
      ItemLeft
        Icon(icon=icon)
    `
  }

  if (url) {
    leftPart = pug`
      ItemLeft
        Image.image(source={ uri: url })
    `
  }

  React.Children.toArray(children).forEach(child => {
    if (ItemLeft === child.type) {
      leftPart = child
      return
    }

    if (ItemRight === child.type) {
      rightPart = child
      return
    }

    if (ItemContent === child.type) {
      contentPart = child
      return
    }

    contentChildren.push(child)
  })

  if (!contentPart && contentChildren.length) {
    if (contentChildren.length === 1) {
      contentPart = pug`
        ItemContent= contentChildren[0]
      `
    } else {
      contentPart = pug`
        ItemContent= contentChildren
      `
    }
  }

  return pug`
    Wrapper.root(
      style=style
      variant="highlight"
      onPress=onPress
      ...extraProps
      ...props
    )
      = leftPart
      = contentPart
      = rightPart
  `
}

Item.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  to: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onPress: PropTypes.func
}

const ObservedItem = observer(themed('Item', Item))

function ItemLeft ({ style, children }) {
  return pug`
    Div.left(style=style)= children
  `
}

function ItemContent ({ style, children }) {
  return pug`
    if typeof children === 'string'
      Span.content(style=style)= children
    else
      Div.content(style=style)= children
  `
}

function ItemRight ({ style, children }) {
  return pug`
    Div.right(style=style)= children
  `
}

ObservedItem.Left = ItemLeft
ObservedItem.Content = ItemContent
ObservedItem.Right = ItemRight

export default ObservedItem
