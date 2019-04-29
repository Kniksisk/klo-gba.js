import React, { useContext, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Stage, Layer } from 'react-konva'
import MapFooter from '../MapFooter'
import HighlightCoordinates from './HighlightCoordinates'
import VisionContext from '../../context/VisionContext'
import TilemapLayer from './TilemapLayer'
import DrawingLayer from './DrawingLayer'
import OAMLayer from './OAMLayer'
import GridLayer from './GridLayer'
import useWhenVisionChanges from '../../hooks/useWhenVisionChanges'

const Map = ({
  highlightCoordinates,
  selectedTileIdInSet,
  showGrid,
  showOAM,
}) => {
  const { updateTilemapPoint, vision } = useContext(VisionContext) // workaround because a limitation in react-konva (https://github.com/konvajs/react-konva/issues/349)
  const {
    infos: {
      tilemap: {
        height,
        width,
      },
    },
  } = vision

  const [selectedPointInfos, setSelectedPointInfos] = useState(null)

  useWhenVisionChanges(() => {
    setSelectedPointInfos(null)
  })

  return (
    <Fragment>
      <Stage width={width * 4} height={height * 4}>
        <TilemapLayer
          setSelectedPointInfos={setSelectedPointInfos}
          vision={vision}
        />
        <DrawingLayer
          height={height * 4}
          selectedTileIdInSet={selectedTileIdInSet}
          updateTilemapPoint={updateTilemapPoint}
          width={width * 4}
        />
        {showOAM && <OAMLayer
          setSelectedPointInfos={setSelectedPointInfos}
          vision={vision}
        />}
        <Layer>
          <HighlightCoordinates
            coordinates={highlightCoordinates}
            height={height}
            width={width}
          />
        </Layer>
        {showGrid && <GridLayer
          height={height * 4}
          width={width * 4}
        />}
      </Stage>
      <MapFooter informations={selectedPointInfos} />
    </Fragment>
  )
}

Map.propTypes = {
  highlightCoordinates: PropTypes.arrayOf(PropTypes.number),
  selectedTileIdInSet: PropTypes.number,
  showGrid: PropTypes.bool,
  showOAM: PropTypes.bool,
}

Map.defaultProps = {
  highlightCoordinates: [-1, -1],
  selectedTileIdInSet: null,
  showGrid: false,
  showOAM: true,
}

export default Map
