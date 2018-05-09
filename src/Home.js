import React, { Component } from 'react';
import { callRenewAPI, Toast } from  './Util';

import PieGraph from './PieGraph';
import ColumnGraph from './ColumnGraph';
import BarGraph from './BarGraph';
import HalfPieGraph from './HalfPieGraph';
// import Calendar from './Calendar';
import CalendarHeatmapGraph from './CalendarHeatmapGraph';

import GraphData from './GraphData';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			device: 0,
			calendar: [], // Calendar data
			total: [], // Processes data, pie and bar for now
			heatmap: [], // Heatmap data
			summary: [] // Idle vs activity half pie
		}

		this.refreshData = this.refreshData.bind(this);
		this.selectDevice = this.selectDevice.bind(this);
	}

	refreshData() {
		console.log(this.state.device, this.state.devices[this.state.device]);
		if (this.state.devices[this.state.device]) {
			const options = { device: this.state.devices[this.state.device].id_devices, start: 0, end: Math.floor(Date.now() / 1000) };
			GraphData.get('total', options, true).then(t_data => {
				GraphData.get('heatmap', options).then(h_data => {
					GraphData.get('summary', options).then(s_data => {
						console.log(h_data);
						this.setState({ summary: s_data, heatmap: h_data, total: t_data });
					});
				});
			});
		} else {
			console.log(`Invalid device index ${this.state.device}`);
		}
	}

	componentDidMount() {
		callRenewAPI('/get_devices', null, 'GET', null, true)
		.then(res => {
			this.setState({devices: res.devices});
			this.refreshData();
		})
		.catch(err => {
			console.log(err);
			Toast.error("Could not get device list");
		});
	}

	selectDevice(event) {
		event.preventDefault();
		// eslint-disable-next-line
		this.state.device = parseInt(event.target.value, 10);
		this.setState({device: parseInt(event.target.value, 10)});
		this.refreshData();
	}

	render() {
		return (
		<div className="container">
			<div className="row justify-content-md-center">			
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-body">
							<div className="form-group">
								<select onChange={this.selectDevice} className="form-control" id="selectDevice" value={this.state.device}>
									{this.state.devices.map((e, i) => <option value={i} key={i}>{`${e.devices_name}${e.collections_name ? ` (${e.collections_name})` : ``}`}</option>)}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Calendar Heatmap</div>
						<div className="card-body">
							{ this.state.heatmap.length > 0 ? <CalendarHeatmapGraph data={this.state.heatmap}/> : 'No heatmap data' }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-between">
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Total time spent</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <PieGraph data={this.state.total} height="300px"/> : "No total data" }
						</div>
					</div>
				</div>
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Activity Summary</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <HalfPieGraph data={this.state.summary} height="300px"/> : "No summary data" }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Process Activity</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <ColumnGraph data={this.state.total} height="300px"/> : "No process activity data" }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Process Activity</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <BarGraph data={this.state.total} height="300px"/> : "No process activity data" }
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}