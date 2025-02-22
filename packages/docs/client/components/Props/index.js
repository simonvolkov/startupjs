import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { observer, $root, useComponentId } from 'startupjs'
import { themed, Button, Row, Div } from '@startupjs/ui'
import parsePropTypes from 'parse-prop-types'
import Constructor from './Constructor'
import Renderer from './Renderer'
import './index.styl'

function useEntries ({ Component, props, extraParams }) {
  return useMemo(() => {
    const propTypes = parsePropTypes(Component)
    const entries = Object.entries(propTypes)
    return parseEntries(entries)
      .filter(entry => entry.name[0] !== '_') // skip private properties
      .map(item => {
        if (props?.[item.name] !== undefined) {
          item.value = props?.[item.name] // add value from props to entries
        }
        if (extraParams?.[item.name]) {
          item.extraParams = extraParams?.[item.name]
        }
        return item
      })
  }, [])
}

function parseEntries (entries) {
  return entries.map(entry => {
    let meta = entry[1]
    return {
      name: entry[0],
      type: meta.type.name,
      defaultValue: meta.defaultValue && meta.defaultValue.value,
      possibleValues: meta.type.value,
      isRequired: meta.required
    }
  })
}

async function useInitDefaultProps ({ entries, $theProps }) {
  if ($theProps.get()) return
  $theProps.setDiff({})

  const promises = []

  for (const { name, value, defaultValue } of entries) {
    if (value !== undefined) {
      promises.push($theProps.set(name, value, null))
    } else if (defaultValue !== undefined) {
      promises.push($theProps.set(name, defaultValue, null))
    }
  }
  if (promises.length) throw await Promise.all(promises)
}

export default observer(themed(function PComponent ({
  style,
  rendererStyle,
  Component,
  $props,
  props,
  extraParams,
  componentName,
  showGrid,
  validateWidth,
  showSizes,
  theme,
  block: defaultBlock
}) {
  const [block, setBlock] = useState(!!defaultBlock)
  const componentId = useComponentId()

  const $theProps = useMemo(() => {
    if (!$props) {
      return $root.scope(`_session.Props.${componentId}`)
    } else {
      return $props
    }
  }, [$props])

  const entries = useEntries({ Component, props, extraParams })
  useInitDefaultProps({ entries, $theProps })

  return pug`
    Div.root(style=style)
      Div.top(styleName=[theme])
        Constructor(
          Component=Component
          $props=$theProps
          entries=entries
        )

      Div.bottom(styleName=[theme])
        ScrollView.scroll(
          contentContainerStyleName='scrollContent'
          horizontal
        )
          Renderer(
            style=rendererStyle
            Component=Component
            props=$theProps.get()
            showGrid=showGrid
            validateWidth=validateWidth
            showSizes=showSizes
            block=block
          )
        Row.display(align='right')
          Button(
            size='s'
            variant='text'
            color=block ? undefined : 'primary'
            onPress=() => setBlock(false)
          ) inline
          Button(
            size='s'
            variant='text'
            color=block ? 'primary' : undefined
            onPress=() => setBlock(true)
          ) block
  `
}))
