var Q = require('q');

var lastCall;

exports.getLastCall = function() { return lastCall; };

exports.shouldErrorOnNextCall = false;

exports.findArray = function(collectionName, searchTerms, projection, sortOrder) {
  lastCall = {
    collectionName: collectionName,
    searchTerms: searchTerms,
    projection: projection,
    sortOrder: sortOrder
  };

  if (!exports.shouldErrorOnNextCall)
  {
    var dummyData = [
      { name: "foo", loc: [1, 2] },
      { name: "bar", loc: [3, 4] }
    ];

    return new Q(dummyData);
  } else {
    return Q.fcall(function() {
      exports.shouldErrorOnNextCall = false;
      throw new Error("findArray Oops");
    });
  }
};

exports.findOne = function(collectionName, searchTerms, projection, sortOrder) {
  lastCall = {
    collectionName: collectionName,
    searchTerms: searchTerms,
    projection: projection,
    sortOrder: sortOrder
  };

  if (!exports.shouldErrorOnNextCall)
  {
    var dummyData = {
      loc: [1, 2],
      name: "1234"
    };

    return new Q(dummyData);
  } else {
    return Q.fcall(function() {
      exports.shouldErrorOnNextCall = false;
      throw new Error("findOne Oops");
    });
  }
};

exports.remove = function(collectionName, searchTerms) {
  lastCall = {
    collectionName: collectionName,
    searchTerms: searchTerms,
  };

  if (!exports.shouldErrorOnNextCall)
  {
    return new Q();
  } else {
    return Q.fcall(function() {
      exports.shouldErrorOnNextCall = false;
      throw new Error("remove Oops");
    });
  }
};
