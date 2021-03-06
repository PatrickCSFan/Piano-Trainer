import Chartist from "Chartist";
import React, {Component} from "react";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import LevelView from "./level_view.js";
import CollapsableContainer from "./collapsable_container.js";

import AnimatedNumber from "./animated_number.js";
import StarAnimation from "./star_animation.js";

export default class PitchStatisticView extends Component {

  propTypes: {
    statisticService: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
  }

  render() {
    const statistics = this.props.statisticService;
    if (statistics.getSuccessCount() === 0) {
      return <div />;
    }

    return (
      <div className="graph-stats content-box">
        <div ref="chart" className="semi-transparent ct-chart ct-major-eleventh"></div>

        <div className="row around-xs">
          <div className="col-xs">
            <OverlayTrigger placement="top" overlay={<Tooltip id="avgTime">Your current score</Tooltip>}>
              <span className="stat-detail">
                <StarAnimation number={statistics.getCurrentScore()} />
                <AnimatedNumber number={statistics.getCurrentScore()} />
              </span>
            </OverlayTrigger>
          </div>
          <div className="col-xs">
            <OverlayTrigger placement="top" overlay={<Tooltip id="avgTime">Average time</Tooltip>}>
              <span className="stat-detail">
                <i className="fa fa-clock-o"></i>
                <AnimatedNumber
                 number={statistics.getAverageTimeOfLast(100) / 1000}
                 formatter={(el) => el.toFixed(2) + "s"} />
              </span>
            </OverlayTrigger>
          </div>
          <div className="col-xs">
            <OverlayTrigger placement="top" overlay={<Tooltip id="playedChordsAndNotes">Played notes</Tooltip>}>
              <span className="stat-detail">
                <i className="fa fa-music"></i>
                <AnimatedNumber number={statistics.getTotalAmountOfKeys()} />
              </span>
            </OverlayTrigger>
          </div>
          <div className="col-xs">
            <OverlayTrigger placement="top" overlay={<Tooltip id="successRate">Success rate</Tooltip>}>
              <span className="stat-detail">
                <i className="fa fa-trophy"></i>
                <AnimatedNumber number={statistics.getSuccessRate()} formatter={(el) => el.toFixed(2) * 100} />
                %
              </span>
            </OverlayTrigger>
          </div>
        </div>
        <CollapsableContainer collapsed={!this.props.settings.useAutomaticDifficulty}>
          <LevelView statisticService={this.props.statisticService} />
        </CollapsableContainer>
      </div>
    );
  }

  componentDidUpdate() {
    const statistics = this.props.statisticService;

    const data = {
      labels: [],
      series: [statistics.getLastTimes(100)]
    };

    const options = {
      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: false,
        showLabel: false
      },
      axisY: {
        labelInterpolationFnc: function(value) {
          return (value / 1000) + "s";
        }
      }
    };

    if (statistics.getSuccessCount() > 1) {
      Chartist.Line(this.refs.chart, data, options);
    }
  }
}
