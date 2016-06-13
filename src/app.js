'use strict';


(function() {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
})();

import assert from 'assert';
import _ from 'lodash';


class FilteredDataStore {
    constructor(getter, sizer) {
        this._underlyingGetter = getter;
        this._underlyingSizer  = sizer;
        this.filter = null;
    }

    getSize() {
        return this.filter?this.filter.length:this._underlyingSizer();
    }
    
    getUnderlyingSize() {
        return this._underlyingSizer();
    }

    get(idx) {
        const idxThroughFilter = (function(idx) {
            if (this.filter===null) {
                return idx;
            } else {
                return this.filter[idx];
            }
        }.bind(this))(idx);
        return this._underlyingGetter(idxThroughFilter);
    }

    clearFilters() {
        this.installFilters([]);
    }

    installFilters(filters) {
        // TODO: do various assertions on whether the filters passed as arguments
        //       make sense.
        const nonNullFilters = _.filter(filters, (x)=>x!==null);
        if (_.isEmpty(nonNullFilters))
            this.filter = null;
        else {
            const intersectedFilter = _.intersection(...nonNullFilters);
            this.filter = intersectedFilter;
        }
    }

    allFiltered() {
        const rv = [];
        for (let i = 0 ; i < this.getSize() ; i++)
            rv.push(this.get(i));
        return rv;
    }

    deriveFilter(pred) {
        let rv = [];
        for (let i = 0 ; i < this._underlyingSizer() ; i++) {
            if (pred(this._underlyingGetter(i)))
                rv.push(i);
        }
        return rv;
    }
}

FilteredDataStore.fromArray = function (arr) {
    return new FilteredDataStore(
        (i)=>arr[i],
        ()=>arr.length
    );
};

module.exports = {
    FilteredDataStore: FilteredDataStore
};


