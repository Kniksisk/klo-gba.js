import React, { useContext, useState, Fragment } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Flexbox,
  Popover,
  PopoverContent,
  Spacing,
} from 'former-kit'
import ObjectsTable from './ObjectsTable'
import ROMContext from '../context/ROMContext'
import Map from './map'
import InputROMModal from './InputROMModal'
import useWhenVisionChanges from '../hooks/useWhenVisionChanges'

const Body = () => {
  const { romBufferStatus } = useContext(ROMContext)
  const [highlightCoordinates, setHighlightCoordinates] = useState([-1, -1])
  const [showGrid, setShowGrid] = useState(false)
  const [showOAM, setShowOAM] = useState(true)

  useWhenVisionChanges(() => {
    setHighlightCoordinates([-1, -1])
  })

  const contentStates = {
    empty: <InputROMModal />,
    loaded: (
      <Fragment>
        <Card>
          <CardContent>
            <Flexbox justifyContent="flex-end">
              <Popover
                content={
                  <PopoverContent>
                    <Fragment>
                      <Checkbox
                        label="Show grid"
                        name="showGrid"
                        value={`${showGrid}`}
                        checked={showGrid}
                        onChange={() => { setShowGrid(!showGrid) }}
                      />
                      <Checkbox
                        label="Show OAM"
                        name="showOAM"
                        value={`${showOAM}`}
                        checked={showOAM}
                        onChange={() => { setShowOAM(!showOAM) }}
                      />
                    </Fragment>
                  </PopoverContent>
                }
              >
                <Button>Display map options</Button>
              </Popover>
            </Flexbox>

            <Spacing />

            <Map
              highlightCoordinates={highlightCoordinates}
              showGrid={showGrid}
              showOAM={showOAM}
            />
          </CardContent>
        </Card>

        <Spacing />

        <Card>
          <CardTitle title="Objects Table" />
          <CardContent>
            <ObjectsTable onRowClickHandler={setHighlightCoordinates} />
          </CardContent>
        </Card>
      </Fragment>
    ),
    starting: null,
  }

  return contentStates[romBufferStatus]
}

export default Body
