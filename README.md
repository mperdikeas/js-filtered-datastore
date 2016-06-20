# js-filtered-datastore

##About

A facade for an underlying datastore on which an arbitrary number
of filters can be applied (transparently to the underlying datastore).

This is useful when the calculation of filters is time-consuming
and needs to be done only once or when the backing datastore
is not to be tampered with and you need another place to keep
information on which indices are filtered.

The constructor expects two functions that interface with the
underlying datastore:

* `getter`: take an integer returns a value
* `sizer` : takes no arguments, returns the size of the datastore

E.g. to use an array as the backing datastore:

```javascript
    const arr = ... // some array
    FilteredDataStore ds = new FilteredDataStore(
        (i)=>arr[i],
        ()=>arr.length
    );
```

A helper facility to create a `FilteredDataStore` out of an array is provided in the
factory method: `FilteredDataStore.fromArray`.

The facade exposes the following methods:

```javascript
    ds.deriveFilter(pred);    // returns the filter that corresponds to a given predicate function
    ds.installFilters([...]); // installs an array of filters
    ds.clearFilters();        // clears any installed filters
    ds.getSize();             // returns the size of the (filtered) datastore
    ds.get(i);                // returns the i-th element of the datastore (subject to filtering)
    ds.allFiltered();         // returns an array of the filtered values
    ds.getUnderlyingSize()    // returns the size of the backing datastore (without taking filtering into account)
```

##Use

```javascript
    import _ from 'lodash';
    import {FilteredDataStore} from 'filtered-datastore';

    const arr = _.range(0, 100, 1);
    const ds = fds.FilteredDataStore.fromArray(arr);
    ds.getSize(); // 100
    const mul3filter = ds.deriveFilter( (i)=>i%3===0 );
    const mul5filter = ds.deriveFilter( (i)=>i%5===0 );
    ds.installFilters ( [ mul3filter, mul5filter] );
    ds.getSize(); // 7
    for (let i = 0 ; i < ds.getSize() ; i++) {
        assert( (ds.get(i)%3===0) && (ds.get(i)%5===0) ) ;
    }
    ds.clearFilters();
    ds.getSize(); // 100 once again
```

## Test
```
npm test
```

## Release History

* 0.0.1 &nbsp;&nbsp;&nbsp; Initial release
* 0.0.2 &nbsp;&nbsp;&nbsp; fixed bug in allFiltered()
* 0.0.3 &nbsp;&nbsp;&nbsp; added getUnderlyingSize method
* 0.0.4 &nbsp;&nbsp;&nbsp; only conditionally include the Babel polyfill
