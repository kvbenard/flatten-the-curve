import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import map from "@amcharts/amcharts4-geodata/franceDepartmentsLow";


class Map extends Component {

    componentDidMount() {
        this.chart = am4core.create("french-map", am4maps.MapChart);
        this.chart.geodata = map;
        this.chart.projection = new am4maps.projections.Miller();
        this.chart.responsive.enabled = true;

        // Create map polygon series
        var polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#011627");

        // Create hover state and set alternative fill color
        hs = polygonTemplate.states.create("active");
        hs.properties.fill = am4core.color("#011627");

        this.chart.series.values[0].data = this.props.data.map(e => {
            return {
                id: "FR-" + e.department,
                value: e.reanimations / e.reanimation_capacity,
                department: e.department
            }
        });

        polygonSeries.heatRules.push({
            property: "fill",
            target: polygonSeries.mapPolygons.template,
            min: am4core.color("#eeeeee"),
            max: am4core.color("#ff0000"),
            maxValue: 2
        });

        polygonTemplate.events.on("hit", (ev) => {
            ev.target.isActive = !ev.target.isActive;
            let department = ev.target.dataItem.dataContext.department;

            this.props.onDepartmentClick(department);
        });
    }

    componentDidUpdate() {

        let data = this.props.data.map(e => {
            return {
                id: "FR-" + e.department,
                value: e.reanimations / e.reanimation_capacity,
                department: e.department
            }
        });

        if (this.chart && this.chart.series.values[0].data.length > 0) {
            this.chart.series.values[0].data.forEach((e, i) => {
                let newObj = data.filter(d => (d.id === e.id))[0];
                this.chart.series.values[0].data[i].value = newObj ? newObj.value : 0;
            });
        }

        this.chart.invalidateRawData();
    }

    render() {
        return (
            <div style={{ height: "500px", width: "500px" }} id="french-map"></div>
        )
    }
}

export default Map;