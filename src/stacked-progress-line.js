import React, { PureComponent } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Svg, { Line } from 'react-native-svg'

const VERTICAL_PADDING = 18

class StackedProgressLine extends PureComponent {

    state = {
        height: 0,
        width: 0,
    }

    _onLayout(event) {
        const { nativeEvent: { layout: { height, width } } } = event
        const paddedHeight = height - VERTICAL_PADDING
        const padding = (VERTICAL_PADDING / 2) / height
        this.setState({ height: paddedHeight, width, padding })
    }

    render() {
        const { style } = this.props

        const { progressData, graySpace } = this.getProgressDataFromProps()

        return (
            <View
                style={style}
                onLayout={event => this._onLayout(event)}
            >
                <Svg style={{ flex: 1 }}>
                    { this.drawLine(graySpace) }
                    {
                      progressData.reverse().map((progress, index) =>
                        this.drawLine(progress, index)
                      )
                    }
                </Svg>
            </View>
        )
    }

    getProgressDataFromProps() {
        const { progressList } = this.props
        const { padding } = this.state
        let progressData = []
        let totalProgress = progressList.reduce((a, b) => a + b, 0)
        let lastProgress = 1 - totalProgress + padding

        const graySpace = this.graySpaceLineData(totalProgress)

        progressList.map((progressValue, index) => {
            const value = this.formatValueForProgress(progressValue)

            progressData.push(
              this.progressItem(value, index, lastProgress)
            )
            lastProgress += progressValue
        })
        return { progressData, graySpace }
    }

    formatValueForProgress(value) {
        if (!isFinite(value) || isNaN(value)) {
            return 0
        }
        return value
    }

    graySpaceLineData(totalProgress) {
        const { padding } = this.state
        const { backgroundColor } = this.props
        return {
            key: 'rest',
            value: 1 - totalProgress,
            color: backgroundColor,
            previousProgress: padding,
        }
    }

    progressItem(value, index, lastProgress) {
        const { colors } = this.props
        return {
            key: `progress-${index}`,
            value,
            color: colors[index],
            previousProgress: lastProgress,
        }
    }

    drawLine(progress, index = null) {
        const { strokeWidth } = this.props
        const { height } = this.state
        return (
              <Line
                  key={index}
                  y1={progress.previousProgress * height}
                  y2={ (progress.previousProgress + progress.value) * height }
                  x1={strokeWidth}
                  x2={strokeWidth}
                  stroke={ progress.color }
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
              />
        )
    }
}

StackedProgressLine.propTypes = {
    progressList: PropTypes.arrayOf(PropTypes.number).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    strokeWidth: PropTypes.number,
    style: PropTypes.any,
    backgroundColor: PropTypes.string,
}

StackedProgressLine.defaultProps = {
    strokeWidth: 16,
    backgroundColor: '#ECECEC',
}

export default StackedProgressLine
