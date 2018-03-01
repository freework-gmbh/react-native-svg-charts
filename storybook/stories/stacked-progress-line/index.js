import React from 'react'
import StackedProgressLine from '../../../src/stacked-progress-line'

class StackedProgressLineExample extends React.PureComponent {

    render() {

        return (
            <StackedProgressLine
                style={ { height: 200 } }
                progressList={ [ 0.3, 0.3, 0.2 ] }
                colors={ [ 'rgb(134, 65, 244)', 'rgb(66, 134, 244)', 'rgb(66, 244, 149)' ] }
                strokeWidth={16}
                { ...this.props }
            />
        )
    }

}

export default StackedProgressLineExample
