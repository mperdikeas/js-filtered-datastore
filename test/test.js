import 'babel-polyfill';
import _ from 'lodash';
import * as fds from '../lib/index.js';

console.log(fds.FilteredDataStore);

const assert     = require('assert');

describe('FilteredDataStore', function () {
    describe('fromArray', function () {
        it('should accurately reflect the backing array'
           , function () {
               const arr = ['a', 'c', 'b'];
               const ds = fds.FilteredDataStore.fromArray(arr);
               assert.deepEqual(ds.allFiltered(), arr);
               assert.equal(ds.getSize(), arr.length);
               for (let i = 0 ; i < arr.length; i++)
                   assert.equal(ds.get(i), arr[i]);
               assert.equal(ds.get(-1), null);
               assert.equal(ds.get( 3), null);
               assert(ds.getUnderlyingSize(), 3);
           });
        it('degenerate filtering all should work'
           , function () {
               const arr = ['a', 'c', 'b'];
               const ds = fds.FilteredDataStore.fromArray(arr);
               const allPassFilter = ds.deriveFilter( ()=>true );
               ds.installFilters ( [ allPassFilter ] );
               assert.deepEqual(ds.allFiltered(), arr);
               assert.equal(ds.getSize(), arr.length);
               for (let i = 0 ; i < arr.length; i++)
                   assert.equal(ds.get(i), arr[i]);
               assert.equal(ds.get(-1), null);
               assert.equal(ds.get( 3), null);
               assert(ds.getUnderlyingSize(), 3);               
           });
        it('degenerate filtering none should work'
           , function () {
               const arr = ['a', 'c', 'b'];
               const ds = fds.FilteredDataStore.fromArray(arr);
               const noneShallPassFilter = ds.deriveFilter( ()=>false );
               ds.installFilters ( [ noneShallPassFilter ] );
               assert.deepEqual(ds.allFiltered(), []);
               assert.equal(ds.getSize(), 0);
               for (let i = 0 ; i < arr.length; i++)
                   assert.equal(ds.get(i), null);
               assert(ds.getUnderlyingSize(), 3);               
           });
        it('composite filtering works'
           , function () {
               const N = 100;
               const arr = _.range(0, N, 1);
               const ds = fds.FilteredDataStore.fromArray(arr);
               assert(ds.getSize()===N);
               assert.deepEqual(ds.allFiltered(), arr);
               const mul3filter = ds.deriveFilter( (i)=>i%3===0 );
               const mul5filter = ds.deriveFilter( (i)=>i%5===0 );
               ds.installFilters ( [ mul3filter, mul5filter] );
               assert(ds.getUnderlyingSize(), N);
               const EXPECTED = [0,15,30,45,60,75,90];
               assert(ds.getSize() === EXPECTED.length);
               assert.deepEqual(ds.allFiltered(), EXPECTED);
               for (let i = 0 ; i < ds.getSize() ; i++) {
                   assert( (ds.get(i)%3===0) && (ds.get(i)%5===0) ) ;
               }
               ds.clearFilters();
               assert(ds.getSize()===N);
               assert.deepEqual(ds.allFiltered(), arr);
               assert(ds.getUnderlyingSize(), N);
           });
    });
});
         
