class SdmxWrapper {

    constructor(sdmx) {
        this.sdmx = sdmx;
    }

    getDimension(dimensionIndex, valueIndex) {
        let dimensions = this.sdmx.structure.dimensions.observation;

        return {
            "id": dimensions[dimensionIndex].id,
            "value": dimensions[dimensionIndex].values[valueIndex].id
        };
    }

    getAttribute(attributeIndex, valueIndex) {
        let attributes = this.sdmx.structure.attributes.observation;

        if (attributeIndex === 0)
            return {
                "id": "VALUE",
                "value": valueIndex
            };

        return {
            "id": attributes[attributeIndex-1].id,
            "value": attributes[attributeIndex-1].values[valueIndex].id
        };
    }

    getDataSet() {
        return this.sdmx.dataSets[0].observations;
    }

}


module.exports = SdmxWrapper;