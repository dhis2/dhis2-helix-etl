/**
 * Wrapper around an SDMX data payload which provides convenience methods
 * for accessing elements such as dimensions and attributes.
 */
class SdmxWrapper {

    constructor(sdmx) {
        this.sdmx = sdmx;
    }

    getDimension(dimensionIndex, valueIndex) {
        let dimensions = this.sdmx.data.structure.dimensions.observation;

        return {
            "id": dimensions[dimensionIndex].id,
            "value": dimensions[dimensionIndex].values[valueIndex].id
        };
    }

    getAttribute(attributeIndex, valueIndex) {
        let attributes = this.sdmx.data.structure.attributes.observation;

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
        return this.sdmx.data.dataSets[0].observations;
    }

}


module.exports = SdmxWrapper;