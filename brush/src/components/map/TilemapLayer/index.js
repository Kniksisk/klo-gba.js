import React from 'react'
import PropTypes from 'prop-types'
import { Layer } from 'react-konva'
import {
  defaultTo,
  find,
  pipe,
  prop,
  range,
} from 'ramda'
import PointTile from '../point/PointTile'

const listCoordinates = (height, width) => {
  const rangeHeight = range(0, height)
  const rangeWidth = range(0, width)

  const coordinates = rangeWidth.reduce((acc, i) => {
    rangeHeight.forEach(j => acc.push([i, j]))
    return acc
  }, [])

  return coordinates
}

const getTileNameFromScheme = tileValue => pipe(
  find(({ ids }) => ids.includes(tileValue)),
  defaultTo({ name: 'unknown' }),
  prop('name')
)

const TilemapLayer = ({ setSelectedPointInfos, vision }) => {
  const {
    infos: {
      tilemap: {
        height,
        scheme,
        width,
      },
    },
    tilemap,
  } = vision

  const getPoint = (x, y) => {
    const tileValue = tilemap[x + (y * width)]

    let tileName
    if (tileValue === 0x00) {
      tileName = 'empty'
    } else {
      tileName = getTileNameFromScheme(tileValue)(scheme)
    }

    return (<PointTile
      key={`${x} ${y}`}
      tileName={tileName}
      tileValue={tileValue}
      showPointInfosHandle={setSelectedPointInfos}
      x={x}
      y={y}
    />)
  }

  const tiles = listCoordinates(height, width)
    .map(([x, y]) => getPoint(x, y))

  return (
    <Layer>
      {tiles}
    </Layer>
  )
}

TilemapLayer.propTypes = {
  setSelectedPointInfos: PropTypes.func,
  vision: PropTypes.shape({
    infos: PropTypes.shape({
      tilemap: PropTypes.shape({
        height: PropTypes.number.isRequired,
        scheme: PropTypes.arrayOf(PropTypes.shape({
          ids: PropTypes.arrayOf(PropTypes.number).isRequired,
          name: PropTypes.string.isRequired,
        })),
        width: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    tilemap: PropTypes.object.isRequired,
  }).isRequired,
}

TilemapLayer.defaultProps = {
  setSelectedPointInfos: () => {},
}

export default React.memo(TilemapLayer)
